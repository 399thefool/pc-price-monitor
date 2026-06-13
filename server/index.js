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
  simulateMarketTick,
  saveBuild,
  getBuilds,
} = require("./database");

const rootDir = path.join(__dirname, "..");
const publicFiles = new Set(["/", "/index.html", "/styles.css", "/app.js", "/config.js"]);
const port = Number(process.env.PORT || 3000);
const db = createDb();
let tick = 0;

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
