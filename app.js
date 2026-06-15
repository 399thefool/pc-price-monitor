const categories = [
  { id: "cpu", label: "CPU" },
  { id: "gpu", label: "显卡" },
  { id: "motherboard", label: "主板" },
  { id: "memory", label: "内存" },
  { id: "storage", label: "固态" },
  { id: "psu", label: "电源" },
  { id: "case", label: "机箱" },
  { id: "cooler", label: "散热" },
];

const rawParts = [
  {
    id: "cpu-7800x3d",
    category: "cpu",
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    basePrice: 2399,
    socket: "AM5",
    memory: "DDR5",
    wattage: 120,
    score: 96,
    tags: ["游戏神U", "AM5", "8核16线程"],
  },
  {
    id: "cpu-9700x",
    category: "cpu",
    name: "AMD Ryzen 7 9700X",
    brand: "AMD",
    basePrice: 2199,
    socket: "AM5",
    memory: "DDR5",
    wattage: 88,
    score: 91,
    tags: ["低功耗", "AM5", "Zen 5"],
  },
  {
    id: "cpu-14700kf",
    category: "cpu",
    name: "Intel Core i7-14700KF",
    brand: "Intel",
    basePrice: 2449,
    socket: "LGA1700",
    memory: "DDR5",
    wattage: 190,
    score: 92,
    tags: ["生产力", "LGA1700", "20核"],
  },
  {
    id: "cpu-14600kf",
    category: "cpu",
    name: "Intel Core i5-14600KF",
    brand: "Intel",
    basePrice: 1599,
    socket: "LGA1700",
    memory: "DDR5",
    wattage: 155,
    score: 86,
    tags: ["高性价比", "LGA1700", "14核"],
  },
  {
    id: "gpu-4070s",
    category: "gpu",
    name: "NVIDIA GeForce RTX 4070 SUPER 12G",
    brand: "NVIDIA",
    basePrice: 4899,
    wattage: 220,
    length: 300,
    score: 93,
    tags: ["2K高刷", "DLSS", "12GB"],
  },
  {
    id: "gpu-4070ti-s",
    category: "gpu",
    name: "NVIDIA GeForce RTX 4070 Ti SUPER 16G",
    brand: "NVIDIA",
    basePrice: 6399,
    wattage: 285,
    length: 336,
    score: 98,
    tags: ["4K入门", "16GB", "创作"],
  },
  {
    id: "gpu-7900gre",
    category: "gpu",
    name: "AMD Radeon RX 7900 GRE 16G",
    brand: "AMD",
    basePrice: 4199,
    wattage: 260,
    length: 320,
    score: 91,
    tags: ["大显存", "2K高刷", "16GB"],
  },
  {
    id: "gpu-4060ti",
    category: "gpu",
    name: "NVIDIA GeForce RTX 4060 Ti 8G",
    brand: "NVIDIA",
    basePrice: 2799,
    wattage: 165,
    length: 245,
    score: 78,
    tags: ["1080P", "低功耗", "8GB"],
  },
  {
    id: "mb-b650m",
    category: "motherboard",
    name: "B650M WiFi 重炮手",
    brand: "ASUS",
    basePrice: 1199,
    socket: "AM5",
    memory: "DDR5",
    wattage: 35,
    score: 88,
    tags: ["AM5", "DDR5", "WiFi"],
  },
  {
    id: "mb-x870",
    category: "motherboard",
    name: "X870 AORUS ELITE WiFi7",
    brand: "GIGABYTE",
    basePrice: 2299,
    socket: "AM5",
    memory: "DDR5",
    wattage: 45,
    score: 94,
    tags: ["AM5", "PCIe 5.0", "WiFi7"],
  },
  {
    id: "mb-b760m",
    category: "motherboard",
    name: "B760M 迫击炮 WiFi II",
    brand: "MSI",
    basePrice: 1299,
    socket: "LGA1700",
    memory: "DDR5",
    wattage: 38,
    score: 89,
    tags: ["LGA1700", "DDR5", "WiFi"],
  },
  {
    id: "mb-z790",
    category: "motherboard",
    name: "Z790 AERO G",
    brand: "GIGABYTE",
    basePrice: 2399,
    socket: "LGA1700",
    memory: "DDR5",
    wattage: 50,
    score: 94,
    tags: ["LGA1700", "DDR5", "扩展强"],
  },
  {
    id: "ram-32-6000",
    category: "memory",
    name: "32GB DDR5 6000 C30 套条",
    brand: "Kingston",
    basePrice: 799,
    memory: "DDR5",
    wattage: 12,
    score: 91,
    tags: ["32GB", "6000MHz", "低时序"],
  },
  {
    id: "ram-32-6400",
    category: "memory",
    name: "32GB DDR5 6400 RGB 套条",
    brand: "G.Skill",
    basePrice: 899,
    memory: "DDR5",
    wattage: 14,
    score: 92,
    tags: ["32GB", "6400MHz", "RGB"],
  },
  {
    id: "ram-64-6000",
    category: "memory",
    name: "64GB DDR5 6000 创作套条",
    brand: "Corsair",
    basePrice: 1499,
    memory: "DDR5",
    wattage: 18,
    score: 95,
    tags: ["64GB", "创作", "DDR5"],
  },
  {
    id: "ssd-1t",
    category: "storage",
    name: "1TB PCIe 4.0 NVMe SSD",
    brand: "WD",
    basePrice: 499,
    wattage: 7,
    score: 84,
    tags: ["1TB", "PCIe 4.0", "系统盘"],
  },
  {
    id: "ssd-2t",
    category: "storage",
    name: "2TB PCIe 4.0 NVMe SSD",
    brand: "Samsung",
    basePrice: 999,
    wattage: 8,
    score: 92,
    tags: ["2TB", "高性能", "缓存"],
  },
  {
    id: "ssd-4t",
    category: "storage",
    name: "4TB PCIe 4.0 NVMe SSD",
    brand: "Lexar",
    basePrice: 1699,
    wattage: 10,
    score: 93,
    tags: ["4TB", "素材库", "大容量"],
  },
  {
    id: "psu-650",
    category: "psu",
    name: "650W 金牌全模组 ATX 3.0",
    brand: "Seasonic",
    basePrice: 599,
    wattage: -650,
    capacity: 650,
    score: 86,
    tags: ["650W", "金牌", "ATX 3.0"],
  },
  {
    id: "psu-750",
    category: "psu",
    name: "750W 金牌全模组 ATX 3.1",
    brand: "SuperFlower",
    basePrice: 799,
    wattage: -750,
    capacity: 750,
    score: 91,
    tags: ["750W", "金牌", "静音"],
  },
  {
    id: "psu-850",
    category: "psu",
    name: "850W 白金全模组 ATX 3.1",
    brand: "Corsair",
    basePrice: 1099,
    wattage: -850,
    capacity: 850,
    score: 95,
    tags: ["850W", "白金", "高端"],
  },
  {
    id: "case-matx",
    category: "case",
    name: "紧凑 MATX 海景房机箱",
    brand: "Jonsbo",
    basePrice: 399,
    maxGpuLength: 330,
    wattage: 0,
    score: 82,
    tags: ["MATX", "330mm显卡", "玻璃侧透"],
  },
  {
    id: "case-airflow",
    category: "case",
    name: "高风道 ATX 中塔机箱",
    brand: "Fractal",
    basePrice: 699,
    maxGpuLength: 380,
    wattage: 0,
    score: 92,
    tags: ["ATX", "380mm显卡", "风道强"],
  },
  {
    id: "case-sff",
    category: "case",
    name: "ITX 铝合金小钢炮机箱",
    brand: "Lian Li",
    basePrice: 899,
    maxGpuLength: 322,
    wattage: 0,
    score: 88,
    tags: ["ITX", "322mm显卡", "小体积"],
  },
  {
    id: "cooler-pa120",
    category: "cooler",
    name: "双塔六热管风冷",
    brand: "Thermalright",
    basePrice: 199,
    cooling: 210,
    wattage: 4,
    score: 87,
    tags: ["风冷", "性价比", "双塔"],
  },
  {
    id: "cooler-240",
    category: "cooler",
    name: "240mm 一体式水冷",
    brand: "DeepCool",
    basePrice: 499,
    cooling: 250,
    wattage: 8,
    score: 90,
    tags: ["240水冷", "ARGB", "安静"],
  },
  {
    id: "cooler-360",
    category: "cooler",
    name: "360mm 高性能水冷",
    brand: "NZXT",
    basePrice: 899,
    cooling: 320,
    wattage: 12,
    score: 95,
    tags: ["360水冷", "高端", "屏显"],
  },
];

const categoryMap = Object.fromEntries(categories.map((item) => [item.id, item]));
const state = {
  activeCategory: "cpu",
  selected: {},
  range: 30,
  parts: [],
  tick: 0,
  apiBaseUrl: "",
  usingApi: false,
  marketTimer: null,
};

const els = {
  categoryTabs: document.querySelector("#categoryTabs"),
  partsList: document.querySelector("#partsList"),
  selectedParts: document.querySelector("#selectedParts"),
  compatibility: document.querySelector("#compatibility"),
  trendCanvas: document.querySelector("#trendCanvas"),
  totalPrice: document.querySelector("#totalPrice"),
  totalChange: document.querySelector("#totalChange"),
  thirtyDayChange: document.querySelector("#thirtyDayChange"),
  changeHint: document.querySelector("#changeHint"),
  buyAdvice: document.querySelector("#buyAdvice"),
  buyReason: document.querySelector("#buyReason"),
  budgetUsage: document.querySelector("#budgetUsage"),
  budgetInput: document.querySelector("#budgetInput"),
  lastUpdate: document.querySelector("#lastUpdate"),
  marketStatus: document.querySelector("#marketStatus"),
  watchList: document.querySelector("#watchList"),
  hotCount: document.querySelector("#hotCount"),
  clearBuild: document.querySelector("#clearBuild"),
  exportBuild: document.querySelector("#exportBuild"),
  toast: document.querySelector("#toast"),
  adminPart: document.querySelector("#adminPart"),
  adminPrice: document.querySelector("#adminPrice"),
  adminSource: document.querySelector("#adminSource"),
  adminToken: document.querySelector("#adminToken"),
  submitAdminPrice: document.querySelector("#submitAdminPrice"),
  adminMeta: document.querySelector("#adminMeta"),
  refreshMeta: document.querySelector("#refreshMeta"),
  sourcePart: document.querySelector("#sourcePart"),
  sourceType: document.querySelector("#sourceType"),
  sourceUrl: document.querySelector("#sourceUrl"),
  sourceExtractor: document.querySelector("#sourceExtractor"),
  sourceEnabled: document.querySelector("#sourceEnabled"),
  saveSource: document.querySelector("#saveSource"),
  runCapture: document.querySelector("#runCapture"),
  sourceList: document.querySelector("#sourceList"),
  sourceMeta: document.querySelector("#sourceMeta"),
};

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

function prepareParts() {
  state.parts = rawParts.map((part) => {
    const history = createHistory(part);
    return {
      ...part,
      history,
      price: history[history.length - 1],
      previousPrice: history[history.length - 2],
    };
  });
}

function getApiCandidates() {
  const config = window.PC_MONITOR_CONFIG || {};
  const candidates = [];
  const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const canUseSameOrigin = window.location.protocol === "http:" || window.location.protocol === "https:";

  if (isLocalHost && window.location.port === "3000") {
    candidates.push("");
  }

  if (isLocalHost || window.location.protocol === "file:") {
    candidates.push(config.LOCAL_API_BASE_URL || "http://localhost:3000");
  }

  if (config.REMOTE_API_BASE_URL) {
    candidates.push(config.REMOTE_API_BASE_URL);
  }

  if (canUseSameOrigin) {
    candidates.push(window.location.origin);
  }

  return [...new Set(candidates.map((url) => url.replace(/\/$/, "")))];
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${state.apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}`);
  }

  return response.json();
}

function normalizeApiPart(part) {
  const history = Array.isArray(part.history) ? part.history : [];
  const price = Number(part.price || history[history.length - 1] || part.basePrice || 0);
  return {
    ...part,
    history,
    price,
    previousPrice: Number(part.previousPrice || history[history.length - 2] || price),
  };
}

function applyMarketSnapshot(snapshot) {
  if (!snapshot?.parts?.length) return false;

  state.parts = snapshot.parts.map(normalizeApiPart);
  const updatedAt = snapshot.updatedAt ? new Date(snapshot.updatedAt) : new Date();
  els.lastUpdate.textContent = `数据库行情 ${updatedAt.toLocaleTimeString("zh-CN", {
    hour12: false,
  })}`;
  els.marketStatus.textContent = "后端已连接";
  renderAdminPanel(snapshot);
  renderAll();
  return true;
}

function renderAdminPartOptions() {
  if (!els.adminPart) return;
  const current = els.adminPart.value;
  const options = state.parts
    .map(
      (part) => `
        <option value="${part.id}">${categoryMap[part.category].label} · ${part.name}</option>
      `,
    )
    .join("");
  els.adminPart.innerHTML = options;
  if (els.sourcePart) {
    const sourceCurrent = els.sourcePart.value;
    els.sourcePart.innerHTML = options;
    if (sourceCurrent && state.parts.some((part) => part.id === sourceCurrent)) {
      els.sourcePart.value = sourceCurrent;
    }
  }
  if (current && state.parts.some((part) => part.id === current)) {
    els.adminPart.value = current;
  }
}

async function refreshAdminMeta() {
  if (!state.usingApi) {
    els.adminMeta.textContent = "当前是离线演示模式，不能写入后端。";
    return;
  }

  try {
    const meta = await apiRequest("/api/admin/meta");
    els.adminMeta.textContent = meta.adminProtected
      ? "后端已开启管理员口令保护。"
      : "后端当前未启用口令保护，可以直接写入。";
  } catch (error) {
    els.adminMeta.textContent = "无法读取管理状态。";
  }
}

function renderAdminPanel(snapshot = null) {
  if (!els.adminPart) return;
  renderAdminPartOptions();
  const first = state.parts.find(Boolean);
  if (first && !els.adminPart.value) {
    els.adminPart.value = first.id;
  }

  if (snapshot?.updatedAt) {
    const updatedAt = new Date(snapshot.updatedAt);
    els.adminMeta.textContent = `最近一次整体行情更新时间：${updatedAt.toLocaleString("zh-CN", {
      hour12: false,
    })}`;
  }
}

function renderSources(sources = []) {
  if (!els.sourceList) return;

  if (!sources.length) {
    els.sourceList.innerHTML = `
      <div class="source-item">
        <strong>还没有价格源</strong>
        <small>先绑定一个测试源，例如 URL 填 https://example.com/price?price=2399</small>
      </div>
    `;
    return;
  }

  els.sourceList.innerHTML = sources
    .map(
      (source) => `
        <article class="source-item">
          <strong>${source.label} · ${source.partName}</strong>
          <small>${source.type} · ${source.enabled ? "启用" : "停用"} · ${source.lastStatus || "pending"}</small>
          <small>${source.url}</small>
        </article>
      `,
    )
    .join("");
}

async function refreshSources() {
  if (!state.usingApi) {
    renderSources([]);
    if (els.sourceMeta) els.sourceMeta.textContent = "离线演示模式不能管理价格源。";
    return;
  }

  try {
    const payload = await apiRequest("/api/sources");
    renderSources(payload.sources || []);
    if (els.sourceMeta) {
      els.sourceMeta.textContent = `已加载 ${(payload.sources || []).length} 个价格源。`;
    }
  } catch (error) {
    if (els.sourceMeta) els.sourceMeta.textContent = "价格源加载失败。";
  }
}

async function connectApi() {
  const candidates = getApiCandidates();

  for (const candidate of candidates) {
    try {
      state.apiBaseUrl = candidate;
      await apiRequest("/api/health");
      const snapshot = await apiRequest("/api/parts");
      state.usingApi = applyMarketSnapshot(snapshot);
      if (state.usingApi) return true;
    } catch (error) {
      state.apiBaseUrl = "";
      state.usingApi = false;
    }
  }

  els.marketStatus.textContent = "离线演示";
  return false;
}

function money(value) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
}

function percent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatSource(part) {
  if (!part?.capturedAt) return `来源 ${part?.source || "seed"}`;
  const capturedAt = new Date(part.capturedAt);
  return `${part.source || "seed"} · ${capturedAt.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
}

function getPart(id) {
  return state.parts.find((part) => part.id === id);
}

function getSelectedParts() {
  return categories
    .map((category) => state.selected[category.id])
    .filter(Boolean)
    .map(getPart)
    .filter(Boolean);
}

function getChange(part, days = 30) {
  const fromIndex = Math.max(0, part.history.length - 1 - days);
  const from = part.history[fromIndex];
  return ((part.price - from) / from) * 100;
}

function predictChange(part) {
  const points = part.history.slice(-14);
  const n = points.length;
  const avgX = (n - 1) / 2;
  const avgY = points.reduce((sum, value) => sum + value, 0) / n;
  const numerator = points.reduce(
    (sum, value, index) => sum + (index - avgX) * (value - avgY),
    0,
  );
  const denominator = points.reduce((sum, _, index) => sum + (index - avgX) ** 2, 0);
  const dailySlope = denominator ? numerator / denominator : 0;
  const predicted = dailySlope * 7;
  return (predicted / part.price) * 100;
}

function classifyPrediction(part) {
  const prediction = predictChange(part);
  const recent = getChange(part, 7);

  if (prediction > 1.2 && recent > 0.6) {
    return {
      label: "预计上涨",
      tone: "trend-up",
      reason: "近 14 日斜率走强，短线可能继续抬价",
    };
  }

  if (prediction < -1.2 && recent < 0.4) {
    return {
      label: "预计下跌",
      tone: "trend-down",
      reason: "近期价格回落，等待低点更舒服",
    };
  }

  return {
    label: "震荡观望",
    tone: "trend-flat",
    reason: "波动不大，更多看预算和刚需",
  };
}

function selectedHistory(range) {
  const selected = getSelectedParts();
  const length = Math.min(range, 89) + 1;

  if (!selected.length) {
    const market = state.parts.slice(0, 12);
    return Array.from({ length }, (_, offset) => {
      const index = 90 - length + offset;
      return Math.round(
        market.reduce((sum, part) => sum + part.history[index], 0) / market.length,
      );
    });
  }

  return Array.from({ length }, (_, offset) => {
    const index = 90 - length + offset;
    return selected.reduce((sum, part) => sum + part.history[index], 0);
  });
}

function renderTabs() {
  els.categoryTabs.innerHTML = categories
    .map(
      (category) => `
        <button
          class="tab-button ${state.activeCategory === category.id ? "active" : ""}"
          type="button"
          data-category="${category.id}"
        >
          ${category.label}
        </button>
      `,
    )
    .join("");
}

function renderParts() {
  const items = state.parts.filter((part) => part.category === state.activeCategory);
  els.partsList.innerHTML = items
    .map((part) => {
      const isSelected = state.selected[part.category] === part.id;
      const change7 = getChange(part, 7);
      const prediction = classifyPrediction(part);
      return `
        <article class="part-card ${isSelected ? "selected" : ""}">
          <div class="part-top">
            <div>
              <div class="part-name">${part.name}</div>
              <div class="part-meta">
                ${part.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
              </div>
            </div>
            <span class="price">${money(part.price)}</span>
          </div>
          <div class="part-footer">
            <div>
              <strong class="${change7 > 0 ? "trend-up" : change7 < 0 ? "trend-down" : "trend-flat"}">
                7日 ${percent(change7)}
              </strong>
              <small class="${prediction.tone}"> · ${prediction.label}</small>
              <small>${formatSource(part)}</small>
            </div>
            <button class="pick-button" type="button" data-pick="${part.id}">
              ${isSelected ? "已选择" : "选择"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSelected() {
  els.selectedParts.innerHTML = categories
    .map((category) => {
      const part = getPart(state.selected[category.id]);
      if (!part) {
        return `
          <article class="selected-item empty">
            <span>${category.label} 待选择</span>
          </article>
        `;
      }

      const prediction = classifyPrediction(part);
      return `
        <article class="selected-item">
          <div class="selected-top">
            <div>
              <span class="chip">${category.label}</span>
              <div class="selected-name">${part.name}</div>
            </div>
            <button class="remove-button" type="button" data-remove="${category.id}" aria-label="移除${category.label}">×</button>
          </div>
          <div class="selected-meta">
            <span>${money(part.price)}</span>
            <span class="${getChange(part, 30) > 0 ? "trend-up" : "trend-down"}">30日 ${percent(getChange(part, 30))}</span>
            <span class="${prediction.tone}">${prediction.label}</span>
            <span>${formatSource(part)}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function compatibilityReport() {
  const parts = Object.fromEntries(
    Object.entries(state.selected).map(([category, id]) => [category, getPart(id)]),
  );
  const warnings = [];
  const notes = [];

  if (parts.cpu && parts.motherboard && parts.cpu.socket !== parts.motherboard.socket) {
    warnings.push(`CPU 是 ${parts.cpu.socket}，主板是 ${parts.motherboard.socket}，接口不匹配。`);
  }

  if (parts.memory && parts.motherboard && parts.memory.memory !== parts.motherboard.memory) {
    warnings.push(`内存规格 ${parts.memory.memory} 与主板 ${parts.motherboard.memory} 不匹配。`);
  }

  if (parts.gpu && parts.case && parts.gpu.length > parts.case.maxGpuLength) {
    warnings.push(`显卡长度 ${parts.gpu.length}mm 超过机箱限制 ${parts.case.maxGpuLength}mm。`);
  }

  if (parts.cpu && parts.cooler && parts.cpu.wattage > parts.cooler.cooling) {
    warnings.push("CPU 满载功耗高于散热器标称压制能力，建议升级散热。");
  }

  const consumption = getSelectedParts().reduce(
    (sum, part) => sum + Math.max(0, part.wattage || 0),
    0,
  );
  const psuCapacity = parts.psu?.capacity || 0;

  if (parts.psu && consumption) {
    const target = Math.ceil(consumption * 1.45);
    if (psuCapacity < target) {
      warnings.push(`整机估算功耗 ${consumption}W，建议电源至少 ${target}W。`);
    } else {
      notes.push(`电源余量充足：估算 ${consumption}W，当前 ${psuCapacity}W。`);
    }
  }

  if (!warnings.length) {
    notes.push("已选配件没有发现明显兼容性问题。");
  }

  return { warnings, notes };
}

function renderCompatibility() {
  const report = compatibilityReport();
  const hasWarning = report.warnings.length > 0;
  els.compatibility.className = `compatibility ${hasWarning ? "warn" : "ok"}`;
  els.compatibility.innerHTML = `
    <strong>${hasWarning ? "兼容性需要确认" : "兼容性通过"}</strong>
    <p>${[...report.warnings, ...report.notes].join(" ")}</p>
  `;
}

function calcTotals() {
  const selected = getSelectedParts();
  const total = selected.reduce((sum, part) => sum + part.price, 0);
  const oldTotal = selected.reduce((sum, part) => {
    const index = Math.max(0, part.history.length - 31);
    return sum + part.history[index];
  }, 0);
  const change = oldTotal ? ((total - oldTotal) / oldTotal) * 100 : 0;
  const prediction = selected.length
    ? selected.reduce((sum, part) => sum + predictChange(part) * (part.price / total), 0)
    : 0;

  return { total, change, prediction, selected };
}

function renderMetrics() {
  const { total, change, prediction, selected } = calcTotals();
  const budget = Math.max(1, Number(els.budgetInput.value) || 8000);
  const usage = Math.round((total / budget) * 100);
  const changeClass = change > 0 ? "trend-up" : change < 0 ? "trend-down" : "trend-flat";

  els.totalPrice.textContent = money(total);
  els.totalChange.textContent = selected.length
    ? `已选 ${selected.length}/${categories.length} 件`
    : "请先选择配件";
  els.thirtyDayChange.textContent = percent(change);
  els.thirtyDayChange.className = changeClass;
  els.budgetUsage.textContent = `${usage}%`;
  els.budgetUsage.className = usage > 100 ? "trend-up" : usage > 85 ? "trend-flat" : "trend-down";

  if (!selected.length) {
    els.buyAdvice.textContent = "待选型";
    els.buyReason.textContent = "选择配件后生成判断";
    return;
  }

  if (prediction < -1.3 || change > 4) {
    els.buyAdvice.textContent = "可等等";
    els.buyReason.textContent = `预测 ${percent(prediction)}，当前不急着冲`;
  } else if (prediction > 1.5 && change < 3) {
    els.buyAdvice.textContent = "早买更稳";
    els.buyReason.textContent = `预测 ${percent(prediction)}，有抬价迹象`;
  } else {
    els.buyAdvice.textContent = "按需入手";
    els.buyReason.textContent = `预测 ${percent(prediction)}，行情偏震荡`;
  }
}

function renderWatchList() {
  const ranked = [...state.parts]
    .map((part) => ({
      part,
      prediction: predictChange(part),
      change7: getChange(part, 7),
      change30: getChange(part, 30),
    }))
    .sort((a, b) => Math.abs(b.prediction) - Math.abs(a.prediction))
    .slice(0, 8);

  const hot = ranked.filter((item) => Math.abs(item.prediction) > 1.2).length;
  els.hotCount.textContent = hot;
  els.watchList.innerHTML = ranked
    .map(({ part, prediction, change7, change30 }) => {
      const label = classifyPrediction(part);
      return `
        <article class="watch-row">
          <div class="watch-top">
            <div>
              <div class="watch-name">${part.name}</div>
              <small>${categoryMap[part.category].label} · 7日 ${percent(change7)} · 30日 ${percent(change30)} · ${formatSource(part)}</small>
            </div>
            <strong class="${label.tone}">${percent(prediction)}</strong>
          </div>
          <small>${label.reason}</small>
        </article>
      `;
    })
    .join("");
}

function drawTrend() {
  const canvas = els.trendCanvas;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.scale(ratio, ratio);

  const width = rect.width;
  const height = rect.height;
  const pad = { top: 24, right: 24, bottom: 34, left: 70 };
  const points = selectedHistory(state.range);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const spread = Math.max(1, max - min);
  const xStep = (width - pad.left - pad.right) / Math.max(1, points.length - 1);
  const yFor = (value) =>
    pad.top + (height - pad.top - pad.bottom) * (1 - (value - min) / spread);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#e5ebf3";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#637086";
  ctx.font = "12px Inter, sans-serif";

  for (let index = 0; index <= 4; index += 1) {
    const y = pad.top + ((height - pad.top - pad.bottom) / 4) * index;
    const value = max - (spread / 4) * index;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(money(value), 10, y + 4);
  }

  const gradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
  gradient.addColorStop(0, "rgba(15, 118, 110, 0.22)");
  gradient.addColorStop(1, "rgba(15, 118, 110, 0)");

  ctx.beginPath();
  points.forEach((value, index) => {
    const x = pad.left + xStep * index;
    const y = yFor(value);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(width - pad.right, height - pad.bottom);
  ctx.lineTo(pad.left, height - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  points.forEach((value, index) => {
    const x = pad.left + xStep * index;
    const y = yFor(value);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 3;
  ctx.stroke();

  const latest = points[points.length - 1];
  const latestX = pad.left + xStep * (points.length - 1);
  const latestY = yFor(latest);
  ctx.fillStyle = "#0f766e";
  ctx.beginPath();
  ctx.arc(latestX, latestY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#172033";
  ctx.font = "700 13px Inter, sans-serif";
  ctx.fillText(getSelectedParts().length ? "所选整机总价" : "市场均价参考", pad.left, 18);
  ctx.fillStyle = "#637086";
  ctx.font = "12px Inter, sans-serif";
  ctx.fillText(`${state.range}日`, width - pad.right - 28, height - 12);
}

function renderAll() {
  renderTabs();
  renderParts();
  renderSelected();
  renderCompatibility();
  renderMetrics();
  renderWatchList();
  drawTrend();
}

function updateLocalMarket() {
  state.tick += 1;
  state.parts = state.parts.map((part) => {
    const seed = seededValue(`${part.id}-${state.tick}`);
    const categoryBias = part.category === "gpu" || part.category === "storage" ? 0.001 : 0;
    const randomMove = (seed - 0.5) * 0.018 + Math.sin(state.tick / 3 + seed) * 0.004;
    const nextPrice = Math.max(
      99,
      Math.round((part.price * (1 + randomMove + categoryBias)) / 5) * 5,
    );
    const history = [...part.history.slice(1), nextPrice];
    return {
      ...part,
      previousPrice: part.price,
      price: nextPrice,
      history,
    };
  });

  const now = new Date();
  els.lastUpdate.textContent = `最后更新 ${now.toLocaleTimeString("zh-CN", {
    hour12: false,
  })}`;
  els.marketStatus.textContent = "行情已刷新";
  renderAll();
}

async function updateMarket() {
  if (!state.usingApi) {
    updateLocalMarket();
    return;
  }

  try {
    const snapshot = await apiRequest("/api/market/tick", { method: "POST" });
    applyMarketSnapshot(snapshot);
  } catch (error) {
    state.usingApi = false;
    els.marketStatus.textContent = "离线演示";
    showToast("后端连接断开，已切换本地演示行情");
    updateLocalMarket();
  }
}

async function submitAdminPrice() {
  if (!state.usingApi) {
    showToast("当前离线演示模式，不能写入后端");
    return;
  }

  const partId = els.adminPart.value;
  const price = Number(els.adminPrice.value);
  const source = els.adminSource.value.trim() || "manual";
  const token = els.adminToken.value.trim();

  if (!partId) {
    showToast("先选一个配件");
    return;
  }

  if (!Number.isFinite(price) || price <= 0) {
    showToast("请输入有效价格");
    return;
  }

  try {
    const result = await apiRequest("/api/prices", {
      method: "POST",
      body: JSON.stringify({
        partId,
        price,
        source,
        token: token || undefined,
      }),
    });

    if (result?.part) {
      state.parts = state.parts.map((part) =>
        part.id === result.part.id ? normalizeApiPart(result.part) : part,
      );
      renderAll();
      renderAdminPanel();
      showToast("价格已写入数据库");
      els.adminPrice.value = "";
    }
  } catch (error) {
    const message = error.message.includes("401")
      ? "口令不对，或后端要求管理员口令"
      : "写入失败";
    showToast(message);
  }
}

async function savePriceSource() {
  if (!state.usingApi) {
    showToast("当前离线演示模式，不能保存价格源");
    return;
  }

  const token = els.adminToken.value.trim();
  const body = {
    partId: els.sourcePart.value,
    label: els.sourceType.value === "fixed" ? "固定测试源" : "JSON 测试源",
    type: els.sourceType.value,
    url: els.sourceUrl.value.trim(),
    extractor: els.sourceExtractor.value.trim(),
    enabled: els.sourceEnabled.checked,
    token: token || undefined,
  };

  if (!body.partId || !body.url) {
    showToast("请选择配件并填写源地址");
    return;
  }

  try {
    await apiRequest("/api/sources", {
      method: "POST",
      body: JSON.stringify(body),
    });
    showToast("价格源已保存");
    els.sourceUrl.value = "";
    els.sourceExtractor.value = "";
    refreshSources();
  } catch (error) {
    showToast(error.message.includes("401") ? "口令不对，不能保存价格源" : "价格源保存失败");
  }
}

async function runCaptureNow() {
  if (!state.usingApi) {
    showToast("当前离线演示模式，不能自动采集");
    return;
  }

  try {
    const payload = await apiRequest("/api/sources/run", {
      method: "POST",
      body: JSON.stringify({ token: els.adminToken.value.trim() || undefined }),
    });
    applyMarketSnapshot(payload.snapshot);
    renderSources(payload.sources?.sources || []);
    showToast(`采集完成：${payload.results.length} 个来源`);
  } catch (error) {
    showToast(error.message.includes("401") ? "口令不对，不能执行采集" : "采集失败");
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2400);
}

function selectPart(id) {
  const part = getPart(id);
  if (!part) return;
  state.selected[part.category] = id;
  renderAll();
}

function removePart(category) {
  delete state.selected[category];
  renderAll();
}

async function exportBuild() {
  const selected = getSelectedParts();
  if (!selected.length) {
    showToast("还没有选择配件");
    return;
  }

  const { total, change, prediction } = calcTotals();
  const selectedParts = Object.fromEntries(
    Object.entries(state.selected).filter(([, id]) => Boolean(id)),
  );
  const lines = [
    "装机配置清单",
    `总价：${money(total)}`,
    `30日涨跌：${percent(change)}`,
    `7日预测：${percent(prediction)}`,
    "",
    ...selected.map(
      (part) => `${categoryMap[part.category].label}：${part.name} ${money(part.price)}`,
    ),
  ];
  const text = lines.join("\n");

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast("配置清单已复制"))
      .catch(() => showToast(text));
  } else {
    showToast(text);
  }

  if (state.usingApi) {
    try {
      await apiRequest("/api/builds", {
        method: "POST",
        body: JSON.stringify({
          title: "我的装机配置",
          budget: Number(els.budgetInput.value) || 0,
          selectedParts,
          totalPrice: total,
        }),
      });
    } catch (error) {
      console.warn("Build save failed", error);
    }
  }
}

function bindEvents() {
  els.categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.activeCategory = button.dataset.category;
    renderAll();
  });

  els.partsList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-pick]");
    if (!button) return;
    selectPart(button.dataset.pick);
  });

  els.selectedParts.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    removePart(button.dataset.remove);
  });

  document.querySelectorAll(".range-button").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".range-button")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.range = Number(button.dataset.range);
      drawTrend();
    });
  });

  els.clearBuild.addEventListener("click", () => {
    state.selected = {};
    renderAll();
    showToast("配置已清空");
  });

  els.exportBuild.addEventListener("click", exportBuild);
  els.budgetInput.addEventListener("input", renderMetrics);
  els.submitAdminPrice.addEventListener("click", submitAdminPrice);
  els.refreshMeta.addEventListener("click", refreshAdminMeta);
  els.saveSource.addEventListener("click", savePriceSource);
  els.runCapture.addEventListener("click", runCaptureNow);
  window.addEventListener("resize", drawTrend);
}

function initDefaultBuild() {
  state.selected = {
    cpu: "cpu-7800x3d",
    gpu: "gpu-4070s",
    motherboard: "mb-b650m",
    memory: "ram-32-6000",
    storage: "ssd-2t",
    psu: "psu-750",
    case: "case-airflow",
    cooler: "cooler-pa120",
  };
}

async function initApp() {
  prepareParts();
  initDefaultBuild();
  bindEvents();
  renderAll();

  const connected = await connectApi();
  if (!connected) {
    updateLocalMarket();
  } else {
    renderAdminPanel();
    refreshAdminMeta();
    refreshSources();
  }

  state.marketTimer = window.setInterval(updateMarket, 5200);
}

initApp();
