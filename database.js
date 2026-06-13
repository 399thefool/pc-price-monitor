const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { rawParts } = require("./parts-data");

const dataDir = process.env.SQLITE_DATA_DIR
  ? path.resolve(process.env.SQLITE_DATA_DIR)
  : path.join(__dirname, "data");
const dbPath = path.join(dataDir, "market.sqlite");

function ensureDir() {
  fs.mkdirSync(dataDir, { recursive: true });
}

function seededValue(seed) {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) % 9973;
  }
  return value / 9973;
}

function createHistory(part) {
  const seed = seededValue(part.id);
  const history = [];
  const drift = (seed - 0.5) * 0.004;
  let price = part.basePrice * (0.93 + seed * 0.12);

  for (let day = 0; day < 90; day += 1) {
    const cycle = Math.sin((day + seed * 20) / 8) * 0.008;
    const shock = Math.cos((day + seed * 18) / 17) * 0.005;
    const marketPulse = day > 63 ? (seed > 0.52 ? 0.0025 : -0.0015) : 0;
    price *= 1 + drift + cycle + shock + marketPulse;
    history.push(Math.max(99, Math.round(price / 5) * 5));
  }

  history[history.length - 1] = Math.round(part.basePrice * (0.96 + seed * 0.1));
  return history;
}

function todayMinus(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function createDb() {
  ensureDir();
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS parts (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      base_price INTEGER NOT NULL,
      attributes TEXT NOT NULL,
      tags TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS price_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_id TEXT NOT NULL,
      price INTEGER NOT NULL,
      source TEXT NOT NULL DEFAULT 'seed',
      captured_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_price_points_part_time
      ON price_points(part_id, captured_at);

    CREATE TABLE IF NOT EXISTS builds (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      budget INTEGER NOT NULL,
      selected_parts TEXT NOT NULL,
      total_price INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  seedDatabase(db);
  return db;
}

function seedDatabase(db) {
  const count = db.prepare("SELECT COUNT(*) AS count FROM parts").get().count;
  if (count > 0) return;

  const insertPart = db.prepare(`
    INSERT INTO parts (id, category, name, brand, base_price, attributes, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertPrice = db.prepare(`
    INSERT INTO price_points (part_id, price, source, captured_at)
    VALUES (?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    rawParts.forEach((part) => {
      const {
        id,
        category,
        name,
        brand,
        basePrice,
        tags,
        ...attributes
      } = part;
      insertPart.run(
        id,
        category,
        name,
        brand,
        basePrice,
        JSON.stringify(attributes),
        JSON.stringify(tags),
      );

      createHistory(part).forEach((price, index) => {
        insertPrice.run(id, price, "seed", `${todayMinus(89 - index)}T12:00:00.000Z`);
      });
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function rowToPart(row, history) {
  const attributes = JSON.parse(row.attributes);
  const tags = JSON.parse(row.tags);
  const current = history[history.length - 1] || row.base_price;
  const previous = history[history.length - 2] || current;

  return {
    id: row.id,
    category: row.category,
    name: row.name,
    brand: row.brand,
    basePrice: row.base_price,
    ...attributes,
    tags,
    history,
    price: current,
    previousPrice: previous,
  };
}

function getParts(db) {
  const rows = db.prepare("SELECT * FROM parts ORDER BY category, name").all();
  const historyStmt = db.prepare(`
    SELECT price
    FROM price_points
    WHERE part_id = ?
    ORDER BY captured_at DESC, id DESC
    LIMIT 90
  `);

  return rows.map((row) => {
    const history = historyStmt
      .all(row.id)
      .map((item) => item.price)
      .reverse();
    return rowToPart(row, history);
  });
}

function getPart(db, id) {
  const row = db.prepare("SELECT * FROM parts WHERE id = ?").get(id);
  if (!row) return null;
  const history = db
    .prepare(`
      SELECT price
      FROM price_points
      WHERE part_id = ?
      ORDER BY captured_at DESC, id DESC
      LIMIT 90
    `)
    .all(id)
    .map((item) => item.price)
    .reverse();
  return rowToPart(row, history);
}

function recordPrice(db, partId, price, source = "manual") {
  const exists = db.prepare("SELECT id FROM parts WHERE id = ?").get(partId);
  if (!exists) return null;
  db.prepare(`
    INSERT INTO price_points (part_id, price, source)
    VALUES (?, ?, ?)
  `).run(partId, Number(price), source);
  db.prepare("UPDATE parts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(partId);
  return getPart(db, partId);
}

function simulateMarketTick(db, tick) {
  const parts = getParts(db);
  const insert = db.prepare(`
    INSERT INTO price_points (part_id, price, source)
    VALUES (?, ?, 'simulated')
  `);
  const update = db.prepare("UPDATE parts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?");

  db.exec("BEGIN");
  try {
    parts.forEach((part) => {
      const seed = seededValue(`${part.id}-${tick}`);
      const categoryBias = part.category === "gpu" || part.category === "storage" ? 0.001 : 0;
      const randomMove = (seed - 0.5) * 0.018 + Math.sin(tick / 3 + seed) * 0.004;
      const nextPrice = Math.max(
        99,
        Math.round((part.price * (1 + randomMove + categoryBias)) / 5) * 5,
      );
      insert.run(part.id, nextPrice);
      update.run(part.id);
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return getParts(db);
}

function saveBuild(db, build) {
  const id = `build-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  db.prepare(`
    INSERT INTO builds (id, title, budget, selected_parts, total_price)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    build.title || "我的装机配置",
    Number(build.budget || 0),
    JSON.stringify(build.selectedParts || {}),
    Number(build.totalPrice || 0),
  );
  return getBuild(db, id);
}

function getBuild(db, id) {
  const row = db.prepare("SELECT * FROM builds WHERE id = ?").get(id);
  if (!row) return null;
  return {
    ...row,
    selectedParts: JSON.parse(row.selected_parts),
  };
}

function getBuilds(db) {
  return db
    .prepare("SELECT * FROM builds ORDER BY created_at DESC LIMIT 50")
    .all()
    .map((row) => ({
      ...row,
      selectedParts: JSON.parse(row.selected_parts),
    }));
}

module.exports = {
  createDb,
  getParts,
  getPart,
  recordPrice,
  simulateMarketTick,
  saveBuild,
  getBuilds,
};
