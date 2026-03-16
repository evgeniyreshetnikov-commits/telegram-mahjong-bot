const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const STORAGE_KEY = "telegram-mahjong-canvas-v11";
const TILE_W = 58;
const TILE_H = 76;
const STEP_X = 30;
const STEP_Y = 40;
const LEVEL_DX = 8;
const LEVEL_DY = 7;
const MIN_ZOOM = 0.42;
const MAX_ZOOM = 1.8;

const SYMBOLS = [
  { glyph: "中", tone: "red", label: "Красный дракон" },
  { glyph: "發", tone: "green", label: "Зелёный дракон" },
  { glyph: "白", tone: "blue", label: "Белый дракон" },
  { glyph: "東", tone: "teal", label: "Восток" },
  { glyph: "南", tone: "red", label: "Юг" },
  { glyph: "西", tone: "gold", label: "Запад" },
  { glyph: "北", tone: "blue", label: "Север" },
  { glyph: "萬", tone: "violet", label: "Вань" },
  { glyph: "筒", tone: "teal", label: "Точки" },
  { glyph: "索", tone: "green", label: "Бамбук" },
  { glyph: "一", tone: "blue", label: "Один" },
  { glyph: "二", tone: "green", label: "Два" },
  { glyph: "三", tone: "red", label: "Три" },
  { glyph: "四", tone: "violet", label: "Четыре" },
  { glyph: "五", tone: "gold", label: "Пять" },
  { glyph: "六", tone: "teal", label: "Шесть" },
  { glyph: "七", tone: "blue", label: "Семь" },
  { glyph: "八", tone: "green", label: "Восемь" },
  { glyph: "九", tone: "red", label: "Девять" },
  { glyph: "春", tone: "teal", label: "Весна" },
  { glyph: "夏", tone: "red", label: "Лето" },
  { glyph: "秋", tone: "gold", label: "Осень" },
  { glyph: "冬", tone: "blue", label: "Зима" },
  { glyph: "梅", tone: "violet", label: "Слива" },
  { glyph: "蘭", tone: "green", label: "Орхидея" },
  { glyph: "竹", tone: "teal", label: "Бамбук" },
  { glyph: "菊", tone: "red", label: "Хризантема" },
  { glyph: "龍", tone: "gold", label: "Дракон" },
  { glyph: "福", tone: "red", label: "Удача" },
  { glyph: "寿", tone: "violet", label: "Долголетие" },
  { glyph: "和", tone: "teal", label: "Гармония" },
  { glyph: "玉", tone: "green", label: "Нефрит" },
  { glyph: "星", tone: "blue", label: "Звезда" },
  { glyph: "雲", tone: "teal", label: "Облако" },
  { glyph: "月", tone: "gold", label: "Луна" },
  { glyph: "花", tone: "red", label: "Цветок" },
];

const DIFFICULTIES = {
  easy: { id: "easy", label: "Лёгкий", pairScore: 10, hints: 6, mismatchPenalty: 0 },
  medium: { id: "medium", label: "Средний", pairScore: 14, hints: 3, mismatchPenalty: 1 },
  hard: { id: "hard", label: "Хард", pairScore: 18, hints: 1, mismatchPenalty: 3 },
};

const THEMES = [
  { id: "classic", name: "Classic Green", bg: "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 42%), linear-gradient(160deg, #0f5132 0%, #0a3d2a 100%)", preview: "linear-gradient(135deg,#1c7c54,#0a3d2a)" },
  { id: "jade", name: "Jade Mist", bg: "radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 40%), linear-gradient(160deg, #0b6e4f 0%, #084c3e 100%)", preview: "linear-gradient(135deg,#14b87a,#0b6e4f)" },
  { id: "night", name: "Midnight Blue", bg: "radial-gradient(circle at top, rgba(114,159,255,0.20), transparent 42%), linear-gradient(160deg, #112240 0%, #0b132b 100%)", preview: "linear-gradient(135deg,#3454d1,#0b132b)" },
  { id: "ruby", name: "Ruby Hall", bg: "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 40%), linear-gradient(160deg, #7f1d1d 0%, #450a0a 100%)", preview: "linear-gradient(135deg,#dc2626,#450a0a)" },
  { id: "royal", name: "Royal Violet", bg: "radial-gradient(circle at top, rgba(255,255,255,0.14), transparent 38%), linear-gradient(160deg, #4c1d95 0%, #1e1b4b 100%)", preview: "linear-gradient(135deg,#8b5cf6,#1e1b4b)" },
  { id: "sunset", name: "Sunset Gold", bg: "radial-gradient(circle at top, rgba(255,255,255,0.16), transparent 38%), linear-gradient(160deg, #a16207 0%, #78350f 100%)", preview: "linear-gradient(135deg,#f59e0b,#78350f)" },
  { id: "ice", name: "Ice Palace", bg: "radial-gradient(circle at top, rgba(255,255,255,0.26), transparent 42%), linear-gradient(160deg, #0f766e 0%, #164e63 100%)", preview: "linear-gradient(135deg,#67e8f9,#164e63)" },
  { id: "forest", name: "Deep Forest", bg: "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 40%), linear-gradient(160deg, #365314 0%, #1a2e05 100%)", preview: "linear-gradient(135deg,#84cc16,#1a2e05)" },
  { id: "rose", name: "Rose Silk", bg: "radial-gradient(circle at top, rgba(255,255,255,0.15), transparent 40%), linear-gradient(160deg, #9d174d 0%, #4a044e 100%)", preview: "linear-gradient(135deg,#f472b6,#4a044e)" },
  { id: "carbon", name: "Carbon Black", bg: "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 38%), linear-gradient(160deg, #262626 0%, #111827 100%)", preview: "linear-gradient(135deg,#737373,#111827)" },
];

function level(rows, xOffset = 0, yOffset = 0) { return { rows, xOffset, yOffset }; }

const LAYOUTS = [
  { id: "turtle", name: "Черепаха Shanghai", levels: [
    level(["001111111100","011111111110","111111111111","111111111111","111111111111","111111111111","011111111110","001111111100"], 0, 0),
    level(["000111111000","001111111100","011111111110","011111111110","011111111110","011111111110","001111111100","000111111000"], 1, 1),
    level(["000011110000","000111111000","001111111100","001111111100","001111111100","001111111100","000111111000","000011110000"], 2, 2),
    level(["000000000000","000001100000","000011110000","000011110000","000011110000","000011110000","000001100000","000000000000"], 3, 3),
  ]},
  { id: "temple", name: "Храм", levels: [
    level(["000111111000","001111111100","011111111110","111111111111","111111111111","011111111110","001111111100","000111111000"], 0, 0),
    level(["000011110000","000111111000","001111111100","001111111100","001111111100","001111111100","000111111000","000011110000"], 2, 1),
    level(["000000000000","000001100000","000011110000","000111111000","000111111000","000011110000","000001100000","000000000000"], 3, 2),
    level(["000000000000","000000000000","000000000000","000001100000","000001100000","000000000000","000000000000","000000000000"], 5, 3),
  ]},
  { id: "dragon", name: "Дракон", levels: [
    level(["111111000000","001111110000","000111111100","001111111110","011111111100","001111111000","000111111100","000000111111"], 0, 0),
    level(["000110000000","000111100000","000011111000","000111111000","001111110000","000111110000","000011111000","000000011100"], 2, 1),
    level(["000000000000","000001100000","000001110000","000011110000","000111100000","000011100000","000001100000","000000000000"], 4, 2),
  ]},
  { id: "fortress", name: "Крепость", levels: [
    level(["111111111111","110000000011","101111111101","101100001101","101100001101","101111111101","110000000011","111111111111"], 0, 0),
    level(["000111111000","000100001000","000101101000","000100001000","000100001000","000101101000","000100001000","000111111000"], 2, 1),
    level(["000000000000","000001100000","000011110000","000011110000","000011110000","000011110000","000001100000","000000000000"], 4, 2),
  ]},
  { id: "pagoda", name: "Пагода", levels: [
    level(["000111111000","000111111000","001111111100","001111111100","001111111100","001111111100","000111111000","000111111000"], 0, 0),
    level(["000011110000","000111111000","000111111000","000111111000","000111111000","000111111000","000111111000","000011110000"], 1, 1),
    level(["000000000000","000001100000","000011110000","000011110000","000011110000","000011110000","000001100000","000000000000"], 3, 2),
    level(["000000000000","000000000000","000000000000","000001100000","000001100000","000000000000","000000000000","000000000000"], 5, 3),
  ]},
  { id: "crown", name: "Корона", levels: [
    level(["110011110011","111111111111","011111111110","001111111100","001111111100","011111111110","111111111111","110011110011"], 0, 0),
    level(["010001100010","011111111110","001111111100","000111111000","000111111000","001111111100","011111111110","010001100010"], 2, 1),
    level(["000000000000","000001100000","000011110000","000111111000","000111111000","000011110000","000001100000","000000000000"], 4, 2),
  ]},
  { id: "garden", name: "Императорский сад", levels: [
    level(["001100001100","011110011110","111111111111","111011110111","111011110111","111111111111","011110011110","001100001100"], 0, 0),
    level(["000000000000","001100001100","001111111100","001011110100","001011110100","001111111100","001100001100","000000000000"], 2, 1),
    level(["000000000000","000000000000","000011110000","000011110000","000011110000","000011110000","000000000000","000000000000"], 4, 2),
  ]},
  { id: "diamond", name: "Алмаз", levels: [
    level(["000011110000","000111111000","001111111100","011111111110","011111111110","001111111100","000111111000","000011110000"], 0, 0),
    level(["000000000000","000011110000","000111111000","001111111100","001111111100","000111111000","000011110000","000000000000"], 2, 1),
    level(["000000000000","000000000000","000001100000","000011110000","000011110000","000001100000","000000000000","000000000000"], 4, 2),
  ]},
  { id: "labyrinth", name: "Лабиринт", levels: [
    level(["111111111111","100000000001","101111111101","101000001101","101011101101","101111111101","100000000001","111111111111"], 0, 0),
    level(["000111111000","001111111100","001100001100","001101101100","001100001100","001111111100","000111111000","000001100000"], 2, 1),
    level(["000000000000","000000000000","000001100000","000001100000","000001100000","000001100000","000000000000","000000000000"], 4, 2),
  ]},
  { id: "phoenix", name: "Феникс", levels: [
    level(["000111111000","011111111110","001111111100","111111111111","111111111111","001111111100","011111111110","000111111000"], 0, 0),
    level(["000011110000","000111111000","000111111000","001111111100","001111111100","000111111000","000111111000","000011110000"], 1, 1),
    level(["000000000000","000000000000","000011110000","000111111000","000111111000","000011110000","000000000000","000000000000"], 4, 2),
  ]},
];

const els = {
  appShell: document.getElementById("appShell"),
  boardViewport: document.getElementById("boardViewport"),
  boardCanvas: document.getElementById("boardCanvas"),
  score: document.getElementById("score"),
  moves: document.getElementById("moves"),
  tilesLeft: document.getElementById("tilesLeft"),
  hintsLeft: document.getElementById("hintsLeft"),
  difficultyBadge: document.getElementById("difficultyBadge"),
  themeBadge: document.getElementById("themeBadge"),
  layoutBadge: document.getElementById("layoutBadge"),
  difficultyControls: document.getElementById("difficultyControls"),
  themeControls: document.getElementById("themeControls"),
  layoutControls: document.getElementById("layoutControls"),
  message: document.getElementById("message"),
  hintBtn: document.getElementById("hintBtn"),
  restartBtn: document.getElementById("restartBtn"),
  sendResultBtn: document.getElementById("sendResultBtn"),
  zoomOutBtn: document.getElementById("zoomOutBtn"),
  zoomInBtn: document.getElementById("zoomInBtn"),
  recenterBtn: document.getElementById("recenterBtn"),
};

const ctx = els.boardCanvas.getContext("2d");

let state = createInitialState();
let rafPending = false;
let viewportRect = null;
let pointerState = { pointers: new Map(), dragStart: null, mode: null, pinch: null };

function createInitialState() {
  return {
    difficulty: "easy",
    theme: "classic",
    layout: "turtle",
    board: [],
    selectedId: null,
    hintedPair: [],
    score: 0,
    moves: 0,
    finished: false,
    hintsLeft: DIFFICULTIES.easy.hints,
    availablePairs: 0,
    boardBounds: { minX: 0, minY: 0, width: 400, height: 320 },
    camera: { x: 0, y: 0, zoom: 1 },
    resumed: false,
    startedAt: Date.now(),
  };
}

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function getLayoutById(id) { return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0]; }
function getThemeById(id) { return THEMES.find((t) => t.id === id) || THEMES[0]; }

function buildLayoutPositions(layout) {
  const positions = [];
  let id = 0;
  layout.levels.forEach((lvl, z) => {
    lvl.rows.forEach((row, rowIndex) => {
      [...row].forEach((cell, colIndex) => {
        if (cell !== "1") return;
        positions.push({ id: `tile-${layout.id}-${id++}`, x: (colIndex + lvl.xOffset) * 2, y: (rowIndex + lvl.yOffset) * 2, z });
      });
    });
  });
  if (positions.length % 2 !== 0) positions.pop();
  return positions;
}
function overlapsTop(a, b) { return Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2; }
function overlapsSide(a, b) { return Math.abs(a.y - b.y) < 2; }
function isFreeTile(tile, board = state.board) {
  if (tile.removed) return false;
  for (const other of board) {
    if (other.removed || other.id === tile.id) continue;
    if (other.z > tile.z && overlapsTop(tile, other)) return false;
  }
  let leftBlocked = false;
  let rightBlocked = false;
  for (const other of board) {
    if (other.removed || other.id === tile.id || other.z !== tile.z) continue;
    if (!overlapsSide(tile, other)) continue;
    const dx = other.x - tile.x;
    if (dx > 0 && dx <= 2) rightBlocked = true;
    if (dx < 0 && dx >= -2) leftBlocked = true;
  }
  return !leftBlocked || !rightBlocked;
}
function getFreeTiles(board = state.board) { return board.filter((t) => isFreeTile(t, board)); }
function getFreePairs(board = state.board) {
  const free = getFreeTiles(board);
  const map = new Map();
  for (const tile of free) {
    const key = tile.face.glyph;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(tile);
  }
  const pairs = [];
  for (const tiles of map.values()) {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) pairs.push([tiles[i], tiles[j]]);
    }
  }
  return pairs;
}

function buildSolvableBoard(layoutId) {
  const positions = buildLayoutPositions(getLayoutById(layoutId));
  const pairCount = positions.length / 2;
  let solution = null;
  for (let attempt = 0; attempt < 240 && !solution; attempt++) {
    const remaining = positions.map((p) => ({ ...p, removed: false }));
    const order = [];
    while (order.length < pairCount) {
      const free = getFreeTiles(remaining).sort((a, b) => b.z - a.z || a.x - b.x);
      if (free.length < 2) break;
      const a = sample(free.slice(0, Math.min(8, free.length)));
      const partner = free.find((t) => t.id !== a.id && Math.abs(t.x - a.x) + Math.abs(t.y - a.y) > 1) || free.find((t) => t.id !== a.id);
      if (!partner) break;
      order.push([a.id, partner.id]);
      remaining.forEach((tile) => { if (tile.id === a.id || tile.id === partner.id) tile.removed = true; });
    }
    if (order.length === pairCount) solution = order;
  }
  if (!solution) throw new Error("Не удалось собрать проходимую раскладку");
  const facePool = [];
  while (facePool.length < pairCount) facePool.push(...shuffle(SYMBOLS));
  const chosen = shuffle(facePool).slice(0, pairCount);
  const faceById = new Map();
  solution.forEach((pair, idx) => pair.forEach((id) => faceById.set(id, chosen[idx])));
  return positions.map((pos) => ({ ...pos, face: faceById.get(pos.id), removed: false }));
}

function tileToPixel(tile) {
  return { x: tile.x * STEP_X + tile.z * LEVEL_DX, y: tile.y * STEP_Y - tile.z * LEVEL_DY };
}

function computeBoardBounds(board = state.board) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const tile of board) {
    const p = tileToPixel(tile);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x + TILE_W + LEVEL_DX);
    maxY = Math.max(maxY, p.y + TILE_H + LEVEL_DY);
  }
  if (!Number.isFinite(minX)) return { minX: 0, minY: 0, width: 400, height: 300 };
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

function fitBoard(resetZoom = true) {
  const bounds = state.boardBounds;
  const width = els.boardViewport.clientWidth || 320;
  const height = els.boardViewport.clientHeight || 420;
  const fitZoom = clamp(Math.min((width - 24) / bounds.width, (height - 24) / bounds.height), MIN_ZOOM, 1.15);
  if (resetZoom) state.camera.zoom = fitZoom;
  const zoom = state.camera.zoom;
  state.camera.x = width / 2 - (bounds.minX + bounds.width / 2) * zoom;
  state.camera.y = height / 2 - (bounds.minY + bounds.height / 2) * zoom;
}

function setMessage(text, tone = "default") {
  els.message.textContent = text;
  els.message.dataset.tone = tone;
}

function saveProgress() {
  const payload = {
    difficulty: state.difficulty,
    theme: state.theme,
    layout: state.layout,
    board: state.board,
    selectedId: state.selectedId,
    score: state.score,
    moves: state.moves,
    finished: state.finished,
    hintsLeft: state.hintsLeft,
    startedAt: state.startedAt,
    camera: state.camera,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function restoreProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    if (!saved?.board?.length) return false;
    state = { ...createInitialState(), ...saved, resumed: true, hintedPair: [] };
    state.boardBounds = computeBoardBounds(state.board);
    updateAvailablePairs();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

function updateAvailablePairs() {
  state.availablePairs = getFreePairs().length;
}

function applyTheme() {
  els.appShell.style.setProperty("--table-bg", getThemeById(state.theme).bg);
}

function updateStats() {
  els.score.textContent = `${state.score}`;
  els.moves.textContent = `${state.moves}`;
  els.tilesLeft.textContent = `${state.board.filter((t) => !t.removed).length}`;
  els.hintsLeft.textContent = `${state.hintsLeft}`;
  els.difficultyBadge.textContent = DIFFICULTIES[state.difficulty].label;
  els.themeBadge.textContent = getThemeById(state.theme).name;
  els.layoutBadge.textContent = `${getLayoutById(state.layout).name} • ${state.board.length}`;
  els.hintBtn.disabled = state.hintsLeft <= 0 || state.availablePairs === 0 || state.finished;
  els.sendResultBtn.disabled = !tg;
}

function renderControls() {
  els.difficultyControls.innerHTML = "";
  Object.values(DIFFICULTIES).forEach((d) => {
    const btn = document.createElement("button");
    btn.className = `option-btn ${state.difficulty === d.id ? "active" : ""}`;
    btn.textContent = d.label;
    btn.onclick = () => {
      if (state.difficulty === d.id) return;
      state.difficulty = d.id;
      startNewGame(true);
    };
    els.difficultyControls.appendChild(btn);
  });
  els.themeControls.innerHTML = "";
  THEMES.forEach((theme) => {
    const btn = document.createElement("button");
    btn.className = `option-btn theme-btn ${state.theme === theme.id ? "active" : ""}`;
    btn.innerHTML = `<span class="theme-preview" style="background:${theme.preview}"></span>${theme.name}`;
    btn.onclick = () => {
      state.theme = theme.id;
      applyTheme();
      renderControls();
      drawSoon();
      updateStats();
      saveProgress();
    };
    els.themeControls.appendChild(btn);
  });
  els.layoutControls.innerHTML = "";
  LAYOUTS.forEach((layout) => {
    const btn = document.createElement("button");
    btn.className = `option-btn ${state.layout === layout.id ? "active" : ""}`;
    btn.textContent = `${layout.name} • ${buildLayoutPositions(layout).length}`;
    btn.onclick = () => {
      if (state.layout === layout.id) return;
      state.layout = layout.id;
      startNewGame(true);
    };
    els.layoutControls.appendChild(btn);
  });
}

function startNewGame(preserveSettings = true) {
  const prev = { difficulty: state.difficulty, theme: state.theme, layout: state.layout };
  state = createInitialState();
  if (preserveSettings) Object.assign(state, prev);
  state.hintsLeft = DIFFICULTIES[state.difficulty].hints;
  state.board = buildSolvableBoard(state.layout);
  state.boardBounds = computeBoardBounds(state.board);
  fitBoard(true);
  updateAvailablePairs();
  applyTheme();
  renderControls();
  updateStats();
  setMessage(`Новая партия: ${getLayoutById(state.layout).name}, ${state.board.length} плиток.`, "success");
  saveProgress();
  drawSoon();
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = els.boardViewport.getBoundingClientRect();
  viewportRect = rect;
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  if (els.boardCanvas.width !== Math.floor(w * dpr) || els.boardCanvas.height !== Math.floor(h * dpr)) {
    els.boardCanvas.width = Math.floor(w * dpr);
    els.boardCanvas.height = Math.floor(h * dpr);
    els.boardCanvas.style.width = `${w}px`;
    els.boardCanvas.style.height = `${h}px`;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (state.board.length) fitBoard(false);
  drawSoon();
}

function clearHint() { state.hintedPair = []; }

function selectTile(tileId) {
  const tile = state.board.find((t) => t.id === tileId && !t.removed);
  if (!tile || !isFreeTile(tile)) {
    setMessage("Эта плитка пока закрыта.", "warning");
    return;
  }
  clearHint();
  if (!state.selectedId) {
    state.selectedId = tileId;
    setMessage(`Выбрана плитка ${tile.face.label}.`, "default");
    saveProgress();
    drawSoon();
    return;
  }
  if (state.selectedId === tileId) {
    state.selectedId = null;
    setMessage("Выбор снят.", "default");
    saveProgress();
    drawSoon();
    return;
  }
  const first = state.board.find((t) => t.id === state.selectedId && !t.removed);
  if (!first || !isFreeTile(first)) {
    state.selectedId = tileId;
    drawSoon();
    return;
  }
  state.moves += 1;
  if (first.face.glyph === tile.face.glyph) {
    first.removed = true;
    tile.removed = true;
    state.selectedId = null;
    state.score += DIFFICULTIES[state.difficulty].pairScore;
    setMessage(`Пара снята: ${tile.face.label}.`, "success");
    updateAvailablePairs();
    if (state.board.every((t) => t.removed)) {
      state.finished = true;
      setMessage(`Победа! Очки: ${state.score}.`, "success");
    } else if (state.availablePairs === 0) {
      setMessage("Ходы закончились. Начни новую игру или смени раскладку.", "warning");
    }
  } else {
    state.score = Math.max(0, state.score - DIFFICULTIES[state.difficulty].mismatchPenalty);
    state.selectedId = tileId;
    setMessage("Плитки не совпали.", "warning");
  }
  updateStats();
  saveProgress();
  drawSoon();
}

function useHint() {
  const pairs = getFreePairs();
  if (!pairs.length) {
    setMessage("Нет доступных пар.", "warning");
    return;
  }
  if (state.hintsLeft <= 0) {
    setMessage("Подсказки закончились.", "warning");
    return;
  }
  const [a, b] = pairs[0];
  state.hintsLeft -= 1;
  state.hintedPair = [a.id, b.id];
  state.selectedId = a.id;
  updateStats();
  saveProgress();
  setMessage(`Подсказка: попробуй пару ${a.face.label}.`, "success");
  drawSoon();
}

function sendResult() {
  const payload = {
    score: state.score,
    moves: state.moves,
    layout: getLayoutById(state.layout).name,
    difficulty: DIFFICULTIES[state.difficulty].label,
    finished: state.finished,
    remaining: state.board.filter((t) => !t.removed).length,
  };
  if (tg?.sendData) {
    tg.sendData(JSON.stringify(payload));
    setMessage("Результат отправлен в бот.", "success");
  }
}

function screenToWorld(screenX, screenY) {
  const x = (screenX - state.camera.x) / state.camera.zoom;
  const y = (screenY - state.camera.y) / state.camera.zoom;
  return { x, y };
}

function hitTile(screenX, screenY) {
  const p = screenToWorld(screenX, screenY);
  const candidates = state.board
    .filter((t) => !t.removed)
    .slice()
    .sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);
  let hit = null;
  for (const tile of candidates) {
    const pos = tileToPixel(tile);
    if (p.x >= pos.x && p.x <= pos.x + TILE_W && p.y >= pos.y && p.y <= pos.y + TILE_H) hit = tile;
  }
  return hit;
}

function pointerPosition(ev) {
  const rect = viewportRect || els.boardViewport.getBoundingClientRect();
  return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
}

function updatePointers(ev, add = true) {
  if (add) pointerState.pointers.set(ev.pointerId, pointerPosition(ev));
  else pointerState.pointers.delete(ev.pointerId);
}

function onPointerDown(ev) {
  ev.preventDefault();
  els.boardCanvas.setPointerCapture(ev.pointerId);
  updatePointers(ev, true);
  if (pointerState.pointers.size === 1) {
    const p = pointerState.pointers.get(ev.pointerId);
    pointerState.dragStart = { pointerId: ev.pointerId, x: p.x, y: p.y, camX: state.camera.x, camY: state.camera.y, moved: false };
    pointerState.mode = "tap-or-pan";
  } else if (pointerState.pointers.size === 2) {
    const pts = [...pointerState.pointers.values()];
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    pointerState.mode = "pinch";
    pointerState.pinch = {
      startDistance: Math.hypot(dx, dy),
      startZoom: state.camera.zoom,
      startCenter: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
      worldAtCenter: screenToWorld((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2),
    };
  }
}

function onPointerMove(ev) {
  if (!pointerState.pointers.has(ev.pointerId)) return;
  updatePointers(ev, true);
  if (pointerState.mode === "pinch" && pointerState.pointers.size >= 2) {
    const pts = [...pointerState.pointers.values()];
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    const centerX = (pts[0].x + pts[1].x) / 2;
    const centerY = (pts[0].y + pts[1].y) / 2;
    const zoom = clamp(pointerState.pinch.startZoom * (Math.hypot(dx, dy) / Math.max(1, pointerState.pinch.startDistance)), MIN_ZOOM, MAX_ZOOM);
    state.camera.zoom = zoom;
    state.camera.x = centerX - pointerState.pinch.worldAtCenter.x * zoom;
    state.camera.y = centerY - pointerState.pinch.worldAtCenter.y * zoom;
    drawSoon();
    return;
  }
  if (pointerState.mode === "tap-or-pan" && pointerState.dragStart?.pointerId === ev.pointerId) {
    const p = pointerState.pointers.get(ev.pointerId);
    const dx = p.x - pointerState.dragStart.x;
    const dy = p.y - pointerState.dragStart.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) pointerState.dragStart.moved = true;
    if (pointerState.dragStart.moved) {
      state.camera.x = pointerState.dragStart.camX + dx;
      state.camera.y = pointerState.dragStart.camY + dy;
      drawSoon();
    }
  }
}

function onPointerUp(ev) {
  const p = pointerState.pointers.get(ev.pointerId);
  const drag = pointerState.dragStart;
  if (pointerState.mode === "tap-or-pan" && drag?.pointerId === ev.pointerId && p && !drag.moved) {
    const tile = hitTile(p.x, p.y);
    if (tile) selectTile(tile.id);
  }
  updatePointers(ev, false);
  if (pointerState.pointers.size === 0) {
    pointerState.mode = null;
    pointerState.dragStart = null;
    pointerState.pinch = null;
  } else if (pointerState.pointers.size === 1) {
    const [id, pt] = [...pointerState.pointers.entries()][0];
    pointerState.mode = "tap-or-pan";
    pointerState.dragStart = { pointerId: id, x: pt.x, y: pt.y, camX: state.camera.x, camY: state.camera.y, moved: true };
  }
}

function zoomBy(factor) {
  const rect = viewportRect || els.boardViewport.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const world = screenToWorld(cx, cy);
  state.camera.zoom = clamp(state.camera.zoom * factor, MIN_ZOOM, MAX_ZOOM);
  state.camera.x = cx - world.x * state.camera.zoom;
  state.camera.y = cy - world.y * state.camera.zoom;
  drawSoon();
  saveProgress();
}

function onWheel(ev) {
  ev.preventDefault();
  zoomBy(ev.deltaY > 0 ? 0.92 : 1.08);
}

function drawTile(tile) {
  const pos = tileToPixel(tile);
  const selected = state.selectedId === tile.id;
  const hinted = state.hintedPair.includes(tile.id);
  const free = isFreeTile(tile);
  const scale = selected ? 1.08 : 1;
  const x = pos.x + TILE_W / 2;
  const y = pos.y + TILE_H / 2;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-TILE_W / 2, -TILE_H / 2);

  ctx.fillStyle = "rgba(28,17,6,0.28)";
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 10;
  ctx.fillRect(10, 12, TILE_W - 4, TILE_H - 2);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#b58d52";
  roundRect(ctx, 8, TILE_H - 10, TILE_W - 8, 10, 8, true, false);
  ctx.fillStyle = "#c8a26a";
  roundRect(ctx, TILE_W - 10, 8, 10, TILE_H - 10, 8, true, false);

  const faceGrad = ctx.createLinearGradient(0, 0, 0, TILE_H - 10);
  faceGrad.addColorStop(0, "#fbf6ec");
  faceGrad.addColorStop(0.55, "#f1e7d4");
  faceGrad.addColorStop(1, "#e0cfad");
  ctx.fillStyle = faceGrad;
  ctx.strokeStyle = hinted ? "#f8e16a" : selected ? "#7ea1ff" : free ? "rgba(126,161,255,0.22)" : "rgba(125,102,70,0.24)";
  ctx.lineWidth = hinted || selected ? 3 : 1.4;
  roundRect(ctx, 0, 0, TILE_W - 10, TILE_H - 10, 12, true, true);

  ctx.strokeStyle = "rgba(145, 117, 76, 0.18)";
  ctx.lineWidth = 1;
  roundRect(ctx, 4, 4, TILE_W - 18, TILE_H - 18, 9, false, true);

  const colorMap = { red: "#b91c1c", green: "#15803d", blue: "#1d4ed8", teal: "#0f766e", gold: "#b7791f", violet: "#7c3aed" };
  ctx.fillStyle = colorMap[tile.face.tone] || "#1f2937";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 31px system-ui";
  ctx.fillText(tile.face.glyph, (TILE_W - 10) / 2, (TILE_H - 10) / 2 + (selected ? -1 : 0));

  ctx.font = "700 11px system-ui";
  ctx.fillText(tile.face.glyph, 14, 14);
  ctx.save();
  ctx.translate(TILE_W - 24, TILE_H - 24);
  ctx.rotate(Math.PI);
  ctx.fillText(tile.face.glyph, 0, 0);
  ctx.restore();

  if (!free) {
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    roundRect(ctx, 0, 0, TILE_W - 10, TILE_H - 10, 12, true, false);
  }
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function draw() {
  rafPending = false;
  resizeCanvasIfNeededQuick();
  const width = els.boardCanvas.clientWidth || 1;
  const height = els.boardCanvas.clientHeight || 1;
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(state.camera.x, state.camera.y);
  ctx.scale(state.camera.zoom, state.camera.zoom);
  const visible = state.board.filter((t) => !t.removed).slice().sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);
  for (const tile of visible) drawTile(tile);
  ctx.restore();
}

function resizeCanvasIfNeededQuick() {
  const rect = els.boardViewport.getBoundingClientRect();
  if (!viewportRect || rect.width !== viewportRect.width || rect.height !== viewportRect.height) resizeCanvas();
}

function drawSoon() {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(draw);
  }
}

els.hintBtn.addEventListener("click", useHint);
els.restartBtn.addEventListener("click", () => startNewGame(true));
els.sendResultBtn.addEventListener("click", sendResult);
els.zoomInBtn.addEventListener("click", () => zoomBy(1.12));
els.zoomOutBtn.addEventListener("click", () => zoomBy(0.88));
els.recenterBtn.addEventListener("click", () => { fitBoard(false); drawSoon(); saveProgress(); });
els.boardCanvas.addEventListener("pointerdown", onPointerDown, { passive: false });
els.boardCanvas.addEventListener("pointermove", onPointerMove, { passive: false });
els.boardCanvas.addEventListener("pointerup", onPointerUp, { passive: false });
els.boardCanvas.addEventListener("pointercancel", onPointerUp, { passive: false });
els.boardCanvas.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("resize", resizeCanvas);

afterInit();
function afterInit() {
  applyTheme();
  renderControls();
  if (restoreProgress()) {
    applyTheme();
    renderControls();
    updateStats();
    setMessage("Прогресс восстановлен.", "success");
  } else {
    startNewGame(true);
  }
  resizeCanvas();
  drawSoon();
}
