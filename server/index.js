const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const { categories } = require("./parts-data");
const {
  createDb,
  getParts,
  getPart,
  recordPrice,
  getSources,
  upsertSource,
  updateSourceStatus,
  deleteSource,
  simulateMarketTick,
  saveBuild,
  getBuilds,
} = require("./database");

const rootDir = path.join(__dirname, "..");
const publicFiles = new Set(["/", "/index.html", "/styles.css", "/app.js", "/config.js"]);
const port = Number(process.env.PORT || 3000);
const db = createDb();
let tick = 0;
const adminToken = process.env.ADMIN_TOKEN || "";
const autoCaptureMinutes =
  process.env.AUTO_CAPTURE_INTERVAL_MINUTES === undefined
    ? 0
    : Number(process.env.AUTO_CAPTURE_INTERVAL_MINUTES);

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(message);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function serveStatic(req, res, pathname) {
  const normalized = pathname === "/" ? "/index.html" : pathname;
  if (!publicFiles.has(normalized)) {
    sendText(res, 404, "Not found");
    return;
  }

  const filePath = path.join(rootDir, normalized.slice(1));
  const extension = path.extname(filePath);
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
  };

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

function getChange(part, days = 30) {
  const fromIndex = Math.max(0, part.history.length - 1 - days);
  const from = part.history[fromIndex];
  return from ? ((part.price - from) / from) * 100 : 0;
}

function predictChange(part) {
  const points = part.history.slice(-14);
  const n = points.length;
  if (n < 2) return 0;
  const avgX = (n - 1) / 2;
  const avgY = points.reduce((sum, value) => sum + value, 0) / n;
  const numerator = points.reduce(
    (sum, value, index) => sum + (index - avgX) * (value - avgY),
    0,
  );
  const denominator = points.reduce((sum, _, index) => sum + (index - avgX) ** 2, 0);
  const dailySlope = denominator ? numerator / denominator : 0;
  return ((dailySlope * 7) / part.price) * 100;
}

function marketSnapshot() {
  const parts = getParts(db).map((part) => ({
    ...part,
    change7: getChange(part, 7),
    change30: getChange(part, 30),
    prediction7: predictChange(part),
  }));

  return {
    categories,
    parts,
    updatedAt: new Date().toISOString(),
  };
}

function hasAdminAccess(body = {}) {
  return !adminToken || body.token === adminToken;
}

function sourceSnapshot() {
  return {
    sources: getSources(db),
    updatedAt: new Date().toISOString(),
  };
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getNestedValue(value, path) {
  if (!path) return null;
  return path.split(".").reduce((current, key) => {
    if (current == null) return null;
    return current[key];
  }, value);
}

function findPriceInJson(value, seen = new WeakSet()) {
  if (value == null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") return toNumber(value);
  if (typeof value !== "object") return null;
  if (seen.has(value)) return null;
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findPriceInJson(item, seen);
      if (found != null) return found;
    }
    return null;
  }

  const preferredKeys = [
    "price",
    "currentPrice",
    "salePrice",
    "lowPrice",
    "highPrice",
    "amount",
    "minPrice",
    "maxPrice",
  ];
  for (const key of preferredKeys) {
    if (key in value) {
      const found = findPriceInJson(value[key], seen);
      if (found != null) return found;
    }
  }

  for (const entry of Object.values(value)) {
    const found = findPriceInJson(entry, seen);
    if (found != null) return found;
  }

  return null;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function extractPriceFromHtml(html) {
  const metaPatterns = [
    /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+itemprop=["']price["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']twitter:data1["'][^>]+content=["']([^"']+)["']/i,
  ];

  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    if (match) {
      const price = toNumber(match[1]);
      if (price != null) return price;
    }
  }

  const scriptPattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptPattern.exec(html))) {
    try {
      const parsed = JSON.parse(scriptMatch[1].trim());
      const price = findPriceInJson(parsed);
      if (price != null) return price;
    } catch (error) {
      // ignore malformed JSON-LD blocks
    }
  }

  const textMatch = html.match(
    /(?:售价|价格|现价|到手价|促销价)[^0-9]{0,24}(?:￥|¥)?\s*([0-9]+(?:\.[0-9]{1,2})?)/i,
  );
  if (textMatch) {
    return toNumber(textMatch[1]);
  }

  return null;
}

async function runPriceSource(source) {
  if (!source.enabled) {
    return { price: null, message: "disabled" };
  }

  try {
    if (source.type === "fixed") {
      const price = Number(source.extractor);
      if (!Number.isFinite(price)) {
        return { price: null, message: "invalid_fixed_price" };
      }
      recordPrice(db, source.partId, price, source.label || "source");
      return { price, message: "ok" };
    }

    const response = await fetchWithTimeout(source.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return { price: null, message: `http_${response.status}` };
    }

    const contentType = response.headers.get("content-type") || "";
    const bodyText = await response.text();
    let price = null;

    if (source.type === "json" || contentType.includes("application/json")) {
      try {
        const parsed = JSON.parse(bodyText);
        if (source.extractor) {
          price = toNumber(getNestedValue(parsed, source.extractor));
        }
        if (price == null) {
          price = findPriceInJson(parsed);
        }
      } catch (error) {
        price = null;
      }
    } else {
      price = extractPriceFromHtml(bodyText);
    }

    if (price == null) {
      return { price: null, message: "price_not_found" };
    }

    const rounded = Math.round(Number(price));
    recordPrice(db, source.partId, rounded, source.label || source.type || "source");
    return { price: rounded, message: "ok" };

  } catch (error) {
    return { price: null, message: error.message || "source_failed" };
  }
}

async function runAutoCapture() {
  const sources = getSources(db).filter((source) => source.enabled);
  const results = [];

  for (const source of sources) {
    const result = await runPriceSource(source);
    updateSourceStatus(db, source.id, result);
    results.push({
      sourceId: source.id,
      partId: source.partId,
      ...result,
    });
  }

  return results;
}

if (Number.isFinite(autoCaptureMinutes) && autoCaptureMinutes > 0) {
  const intervalMs = Math.max(autoCaptureMinutes, 5) * 60 * 1000;
  setInterval(() => {
    runAutoCapture().catch((error) => {
      console.error("Auto capture failed:", error);
    });
  }, intervalMs);
}

async function handleApi(req, res, pathname) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "GET" && pathname === "/api/health") {
    sendJson(res, 200, { ok: true, updatedAt: new Date().toISOString() });
    return;
  }

  if (req.method === "GET" && pathname === "/api/parts") {
    sendJson(res, 200, marketSnapshot());
    return;
  }

  if (req.method === "GET" && pathname === "/api/sources") {
    sendJson(res, 200, sourceSnapshot());
    return;
  }

  if (req.method === "POST" && pathname === "/api/market/tick") {
    tick += 1;
    simulateMarketTick(db, tick);
    sendJson(res, 200, marketSnapshot());
    return;
  }

  if (req.method === "POST" && pathname === "/api/prices") {
    const body = await readBody(req);
    if (!body.partId || !Number.isFinite(Number(body.price))) {
      sendJson(res, 400, { error: "partId and numeric price are required" });
      return;
    }

    if (!hasAdminAccess(body)) {
      sendJson(res, 401, { error: "Invalid admin token" });
      return;
    }

    const part = recordPrice(db, body.partId, Number(body.price), body.source || "manual");
    if (!part) {
      sendJson(res, 404, { error: "Part not found" });
      return;
    }

    sendJson(res, 201, { part });
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/api/parts/")) {
    const id = decodeURIComponent(pathname.replace("/api/parts/", ""));
    const part = getPart(db, id);
    if (!part) {
      sendJson(res, 404, { error: "Part not found" });
      return;
    }
    sendJson(res, 200, { part });
    return;
  }

  if (req.method === "GET" && pathname === "/api/builds") {
    sendJson(res, 200, { builds: getBuilds(db) });
    return;
  }

  if (req.method === "POST" && pathname === "/api/builds") {
    const body = await readBody(req);
    const build = saveBuild(db, body);
    sendJson(res, 201, { build });
    return;
  }

  if (req.method === "GET" && pathname === "/api/admin/meta") {
    sendJson(res, 200, {
      adminProtected: Boolean(adminToken),
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/sources") {
    const body = await readBody(req);
    if (!hasAdminAccess(body)) {
      sendJson(res, 401, { error: "Invalid admin token" });
      return;
    }
    if (!body.partId || !body.url) {
      sendJson(res, 400, { error: "partId and url are required" });
      return;
    }
    const source = upsertSource(db, body);
    if (!source) {
      sendJson(res, 404, { error: "Part not found" });
      return;
    }
    sendJson(res, 201, { source });
    return;
  }

  if (req.method === "DELETE" && pathname.startsWith("/api/sources/")) {
    const body = await readBody(req);
    if (!hasAdminAccess(body)) {
      sendJson(res, 401, { error: "Invalid admin token" });
      return;
    }
    const id = decodeURIComponent(pathname.replace("/api/sources/", ""));
    const ok = deleteSource(db, id);
    sendJson(res, ok ? 200 : 404, { ok });
    return;
  }

  if (req.method === "POST" && pathname === "/api/sources/run") {
    const body = await readBody(req);
    if (!hasAdminAccess(body)) {
      sendJson(res, 401, { error: "Invalid admin token" });
      return;
    }
    const results = await runAutoCapture();
    sendJson(res, 200, { results, snapshot: marketSnapshot(), sources: sourceSnapshot() });
    return;
  }

  sendJson(res, 404, { error: "API route not found" });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  try {
    if (pathname.startsWith("/api/")) {
      await handleApi(req, res, pathname);
      return;
    }

    serveStatic(req, res, pathname);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`PC price monitor running at http://localhost:${port}`);
});
