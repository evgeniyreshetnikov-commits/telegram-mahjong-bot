const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const STORAGE_PREFIX = "telegram-mahjong-shanghai";
const TILE_W = 78;
const TILE_H = 98;
const STEP_X = 42;
const STEP_Y = 52;
const LEVEL_OFFSET_X = 12;
const LEVEL_OFFSET_Y = 10;
const REMOVE_ANIMATION_MS = 340;

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

function level(rows, xOffset = 0, yOffset = 0) {
  return { rows, xOffset, yOffset };
}

const LAYOUTS = [
  {
    id: "turtle",
    name: "Черепаха Shanghai",
    levels: [
      level(["001111111100","011111111110","111111111111","111111111111","111111111111","111111111111","011111111110","001111111100"], 0, 0),
      level(["000111111000","001111111100","011111111110","011111111110","011111111110","011111111110","001111111100","000111111000"], 1, 1),
      level(["000011110000","000111111000","001111111100","001111111100","001111111100","001111111100","000111111000","000011110000"], 2, 2),
      level(["000000000000","000001100000","000011110000","000011110000","000011110000","000011110000","000001100000","000000000000"], 3, 3),
    ],
  },
  {
    id: "temple",
    name: "Храм",
    levels: [
      level(["000111111000","001111111100","011111111110","111111111111","111111111111","011111111110","001111111100","000111111000"], 0, 0),
      level(["000011110000","000111111000","001111111100","001111111100","001111111100","001111111100","000111111000","000011110000"], 2, 1),
      level(["000000000000","000001100000","000011110000","000111111000","000111111000","000011110000","000001100000","000000000000"], 3, 2),
      level(["000000000000","000000000000","000000000000","000001100000","000001100000","000000000000","000000000000","000000000000"], 5, 3),
    ],
  },
  {
    id: "dragon",
    name: "Дракон",
    levels: [
      level(["111111000000","001111110000","000111111100","001111111110","011111111100","001111111000","000111111100","000000111111"], 0, 0),
      level(["000110000000","000111100000","000011111000","000111111000","001111110000","000111110000","000011111000","000000011100"], 2, 1),
      level(["000000000000","000001100000","000001110000","000011110000","000111100000","000011100000","000001100000","000000000000"], 4, 2),
    ],
  },
  {
    id: "fortress",
    name: "Крепость",
    levels: [
      level(["111111111111","110000000011","101111111101","101100001101","101100001101","101111111101","110000000011","111111111111"], 0, 0),
      level(["000111111000","000100001000","000101101000","000100001000","000100001000","000101101000","000100001000","000111111000"], 2, 1),
      level(["000000000000","000001100000","000011110000","000011110000","000011110000","000011110000","000001100000","000000000000"], 4, 2),
    ],
  },
  {
    id: "pagoda",
    name: "Пагода",
    levels: [
      level(["000111111000","000111111000","001111111100","001111111100","001111111100","001111111100","000111111000","000111111000"], 0, 0),
      level(["000011110000","000111111000","000111111000","000111111000","000111111000","000111111000","000111111000","000011110000"], 1, 1),
      level(["000000000000","000001100000","000011110000","000011110000","000011110000","000011110000","000001100000","000000000000"], 3, 2),
      level(["000000000000","000000000000","000000000000","000001100000","000001100000","000000000000","000000000000","000000000000"], 5, 3),
    ],
  },
  {
    id: "crown",
    name: "Корона",
    levels: [
      level(["110011110011","111111111111","011111111110","001111111100","001111111100","011111111110","111111111111","110011110011"], 0, 0),
      level(["010001100010","011111111110","001111111100","000111111000","000111111000","001111111100","011111111110","010001100010"], 2, 1),
      level(["000000000000","000001100000","000011110000","000111111000","000111111000","000011110000","000001100000","000000000000"], 4, 2),
    ],
  },
  {
    id: "garden",
    name: "Императорский сад",
    levels: [
      level(["001100001100","011110011110","111111111111","111011110111","111011110111","111111111111","011110011110","001100001100"], 0, 0),
      level(["000000000000","001100001100","001111111100","001011110100","001011110100","001111111100","001100001100","000000000000"], 2, 1),
      level(["000000000000","000000000000","000011110000","000011110000","000011110000","000011110000","000000000000","000000000000"], 4, 2),
    ],
  },
  {
    id: "diamond",
    name: "Алмаз",
    levels: [
      level(["000011110000","000111111000","001111111100","011111111110","011111111110","001111111100","000111111000","000011110000"], 0, 0),
      level(["000000000000","000011110000","000111111000","001111111100","001111111100","000111111000","000011110000","000000000000"], 2, 1),
      level(["000000000000","000000000000","000001100000","000011110000","000011110000","000001100000","000000000000","000000000000"], 4, 2),
    ],
  },
  {
    id: "labyrinth",
    name: "Лабиринт",
    levels: [
      level(["111111111111","100000000001","101111111101","101000001101","101011101101","101111111101","100000000001","111111111111"], 0, 0),
      level(["000111111000","001111111100","001100001100","001101101100","001100001100","001111111100","000111111000","000001100000"], 2, 1),
      level(["000000000000","000000000000","000001100000","000001100000","000001100000","000001100000","000000000000","000000000000"], 4, 2),
    ],
  },
  {
    id: "phoenix",
    name: "Феникс",
    levels: [
      level(["000111111000","011111111110","001111111100","111111111111","111111111111","001111111100","011111111110","000111111000"], 0, 0),
      level(["000011110000","000111111000","000111111000","001111111100","001111111100","000111111000","000111111000","000011110000"], 1, 1),
      level(["000000000000","000000000000","000001100000","000011110000","000011110000","000001100000","000000000000","000000000000"], 4, 2),
      level(["000000000000","000000000000","000000000000","000001100000","000001100000","000000000000","000000000000","000000000000"], 5, 3),
    ],
  },
];

const boardEl = document.getElementById("board");
const boardShellEl = document.getElementById("boardShell");
const boardViewportEl = document.getElementById("boardViewport");
const boardStageEl = document.getElementById("boardStage");
const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const tilesLeftEl = document.getElementById("tilesLeft");
const hintsLeftEl = document.getElementById("hintsLeft");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const sendResultBtn = document.getElementById("sendResultBtn");
const hintBtn = document.getElementById("hintBtn");
const difficultyControls = document.getElementById("difficultyControls");
const themeControls = document.getElementById("themeControls");
const layoutControls = document.getElementById("layoutControls");
const difficultyBadge = document.getElementById("difficultyBadge");
const themeBadge = document.getElementById("themeBadge");
const layoutBadge = document.getElementById("layoutBadge");
const appShell = document.getElementById("appShell");

const userId = tg?.initDataUnsafe?.user?.id || "guest";
const storageKey = `${STORAGE_PREFIX}:${userId}`;

let state = createInitialState();

function createInitialState() {
  return {
    difficulty: "easy",
    theme: THEMES[0].id,
    layout: LAYOUTS[0].id,
    board: [],
    selectedId: null,
    score: 0,
    moves: 0,
    finished: false,
    hintsLeft: DIFFICULTIES.easy.hints,
    hintedPair: [],
    animatingMatches: [],
    availablePairs: 0,
    seed: Math.random().toString(36).slice(2),
    startedAt: Date.now(),
    resumed: false,
  };
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getLayoutById(layoutId) {
  return LAYOUTS.find((layout) => layout.id === layoutId) || LAYOUTS[0];
}

function getThemeById(themeId) {
  return THEMES.find((theme) => theme.id === themeId) || THEMES[0];
}

function buildLayoutPositions(layout) {
  const positions = [];
  let id = 0;
  layout.levels.forEach((lvl, z) => {
    lvl.rows.forEach((row, rowIndex) => {
      [...row].forEach((cell, colIndex) => {
        if (cell !== "1") return;
        const x = (colIndex + lvl.xOffset) * 2;
        const y = (rowIndex + lvl.yOffset) * 2;
        positions.push({
          id: `tile-${layout.id}-${id++}`,
          x,
          y,
          z,
        });
      });
    });
  });

  if (positions.length % 2 !== 0) {
    positions.pop();
  }
  return positions;
}

function overlapsTop(a, b) {
  return Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;
}

function overlapsSide(a, b) {
  return Math.abs(a.y - b.y) < 2;
}

function isFreeTile(tile, occupiedMap) {
  if (tile.removed) return false;

  const topBlocked = state.board.some((other) => {
    if (other.removed || other.id === tile.id) return false;
    return other.z > tile.z && overlapsTop(tile, other);
  });
  if (topBlocked) return false;

  let leftBlocked = false;
  let rightBlocked = false;
  state.board.forEach((other) => {
    if (other.removed || other.id === tile.id || other.z !== tile.z) return;
    if (!overlapsSide(tile, other)) return;
    const dx = other.x - tile.x;
    if (dx > 0 && dx <= 2) rightBlocked = true;
    if (dx < 0 && dx >= -2) leftBlocked = true;
  });

  return !leftBlocked || !rightBlocked;
}

function getFreeTiles(board = state.board) {
  const originalBoard = state.board;
  state.board = board;
  const result = board.filter((tile) => isFreeTile(tile));
  state.board = originalBoard;
  return result;
}

function buildSolvableBoard(layoutId) {
  const layout = getLayoutById(layoutId);
  const positions = buildLayoutPositions(layout);
  const targetPairs = positions.length / 2;

  let solution = null;
  for (let attempt = 0; attempt < 240; attempt++) {
    const remaining = positions.map((pos) => ({ ...pos, removed: false }));
    const order = [];

    while (order.length < targetPairs) {
      const freeTiles = getFreeTiles(remaining).sort((a, b) => {
        if (b.z !== a.z) return b.z - a.z;
        return a.x - b.x;
      });

      if (freeTiles.length < 2) break;

      const anchor = sample(freeTiles.slice(0, Math.min(6, freeTiles.length)));
      const candidates = freeTiles
        .filter((tile) => tile.id !== anchor.id)
        .sort((a, b) => Math.abs(b.x - anchor.x) + Math.abs(b.y - anchor.y) - (Math.abs(a.x - anchor.x) + Math.abs(a.y - anchor.y)));
      const partner = candidates[0] || freeTiles.find((tile) => tile.id !== anchor.id);
      if (!partner) break;

      const pairIds = [anchor.id, partner.id];
      order.push(pairIds);
      remaining.forEach((tile) => {
        if (pairIds.includes(tile.id)) tile.removed = true;
      });
    }

    if (order.length === targetPairs) {
      solution = order;
      break;
    }
  }

  if (!solution) {
    throw new Error("Не удалось собрать проходимую раскладку. Попробуй другую раскладку.");
  }

  const facePool = [];
  while (facePool.length < targetPairs) {
    facePool.push(...shuffle(SYMBOLS));
  }
  const chosenFaces = shuffle(facePool).slice(0, targetPairs);

  const faceByTileId = new Map();
  solution.forEach((pair, index) => {
    const face = chosenFaces[index];
    pair.forEach((tileId) => faceByTileId.set(tileId, face));
  });

  return positions.map((pos) => ({
    ...pos,
    removed: false,
    face: faceByTileId.get(pos.id),
  }));
}

function getTileById(tileId) {
  return state.board.find((tile) => tile.id === tileId) || null;
}

function getFreePairs(board = state.board) {
  const free = getFreeTiles(board);
  const byGlyph = new Map();
  free.forEach((tile) => {
    const key = tile.face.glyph;
    if (!byGlyph.has(key)) byGlyph.set(key, []);
    byGlyph.get(key).push(tile);
  });

  const pairs = [];
  byGlyph.forEach((tiles) => {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        pairs.push([tiles[i], tiles[j]]);
      }
    }
  });
  return pairs;
}

function setMessage(text, tone = "default") {
  messageEl.textContent = text;
  messageEl.dataset.tone = tone;
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
    seed: state.seed,
    startedAt: state.startedAt,
    savedAt: Date.now(),
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function clearSavedProgress() {
  localStorage.removeItem(storageKey);
}

function restoreSavedProgress() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.board) || saved.board.length === 0) return false;
    state = {
      ...createInitialState(),
      ...saved,
      resumed: true,
      hintedPair: [],
      animatingMatches: [],
    };
    return true;
  } catch (error) {
    console.error("restoreSavedProgress error", error);
    return false;
  }
}

function startNewGame({ preserveSettings = true } = {}) {
  const previous = { difficulty: state.difficulty, theme: state.theme, layout: state.layout };
  state = createInitialState();
  if (preserveSettings) {
    state.difficulty = previous.difficulty;
    state.theme = previous.theme;
    state.layout = previous.layout;
  }
  state.hintsLeft = DIFFICULTIES[state.difficulty].hints;
  state.board = buildSolvableBoard(state.layout);
  state.startedAt = Date.now();
  state.seed = Math.random().toString(36).slice(2);
  clearSavedProgress();
  updateAvailablePairs();
  applyTheme();
  renderControls();
  renderBoard();
  updateStats();
  const layout = getLayoutById(state.layout);
  setMessage(`Новая раскладка «${layout.name}»: ${state.board.length} плиток, проходимость гарантирована.`, "success");
  saveProgress();
}

function updateAvailablePairs() {
  state.availablePairs = getFreePairs().length;
}

function applyTheme() {
  const theme = getThemeById(state.theme);
  appShell.style.setProperty("--table-bg", theme.bg);
}

function updateStats() {
  scoreEl.textContent = String(state.score);
  movesEl.textContent = String(state.moves);
  tilesLeftEl.textContent = String(state.board.filter((tile) => !tile.removed).length);
  hintsLeftEl.textContent = String(state.hintsLeft);
  difficultyBadge.textContent = DIFFICULTIES[state.difficulty].label;
  themeBadge.textContent = getThemeById(state.theme).name;
  const layout = getLayoutById(state.layout);
  const progressLabel = state.resumed ? " • прогресс восстановлен" : "";
  layoutBadge.textContent = `${layout.name} (${state.board.length})${progressLabel}`;
  sendResultBtn.disabled = !state.finished;
  hintBtn.disabled = state.hintsLeft <= 0 || state.finished || state.availablePairs === 0;
}

function renderControls() {
  difficultyControls.innerHTML = "";
  Object.values(DIFFICULTIES).forEach((difficulty) => {
    const btn = document.createElement("button");
    btn.className = `option-btn ${state.difficulty === difficulty.id ? "active" : ""}`;
    btn.textContent = difficulty.label;
    btn.addEventListener("click", () => {
      if (state.difficulty === difficulty.id) return;
      state.difficulty = difficulty.id;
      state.hintsLeft = DIFFICULTIES[difficulty.id].hints;
      startNewGame();
    });
    difficultyControls.appendChild(btn);
  });

  themeControls.innerHTML = "";
  THEMES.forEach((theme) => {
    const btn = document.createElement("button");
    btn.className = `option-btn theme-btn ${state.theme === theme.id ? "active" : ""}`;
    btn.innerHTML = `<span class="theme-preview" style="background:${theme.preview}"></span>${theme.name}`;
    btn.addEventListener("click", () => {
      state.theme = theme.id;
      applyTheme();
      renderControls();
      saveProgress();
    });
    themeControls.appendChild(btn);
  });

  layoutControls.innerHTML = "";
  LAYOUTS.forEach((layout) => {
    const size = buildLayoutPositions(layout).length;
    const btn = document.createElement("button");
    btn.className = `option-btn ${state.layout === layout.id ? "active" : ""}`;
    btn.textContent = `${layout.name} • ${size}`;
    btn.addEventListener("click", () => {
      if (state.layout === layout.id) return;
      state.layout = layout.id;
      startNewGame();
    });
    layoutControls.appendChild(btn);
  });
}

function computeBoardBounds() {
  const activeTiles = state.board.filter((tile) => !tile.removed);
  if (!activeTiles.length) {
    boardEl.style.width = "100%";
    boardEl.style.height = "420px";
    boardStageEl.style.width = "100%";
    boardStageEl.style.height = "420px";
    appShell.style.setProperty("--board-scale", "1");
    return { width: 760, height: 420 };
  }

  const maxX = Math.max(...state.board.map((tile) => tile.x));
  const maxY = Math.max(...state.board.map((tile) => tile.y));
  const maxZ = Math.max(...state.board.map((tile) => tile.z));
  const width = (maxX / 2) * STEP_X + TILE_W + maxZ * LEVEL_OFFSET_X + 40;
  const height = (maxY / 2) * STEP_Y + TILE_H + maxZ * LEVEL_OFFSET_Y + 30;
  const finalWidth = Math.max(width, 760);
  const finalHeight = Math.max(height, 420);
  boardEl.style.width = `${finalWidth}px`;
  boardEl.style.height = `${finalHeight}px`;
  return { width: finalWidth, height: finalHeight };
}

function fitBoardToViewport(bounds) {
  const viewportWidth = boardViewportEl.clientWidth - 6;
  const viewportHeight = boardViewportEl.clientHeight - 6;
  if (!viewportWidth || !viewportHeight) return;

  const widthScale = viewportWidth / bounds.width;
  const heightScale = viewportHeight / bounds.height;
  const isPhone = window.innerWidth <= 640;
  const scale = Math.min(widthScale, heightScale, isPhone ? 0.96 : 1);
  const safeScale = Math.max(scale, isPhone ? 0.42 : 0.6);

  appShell.style.setProperty("--board-scale", String(safeScale));
  boardStageEl.style.width = `${Math.max(bounds.width * safeScale, viewportWidth)}px`;
  boardStageEl.style.height = `${Math.max(bounds.height * safeScale, viewportHeight)}px`;
}

function renderBoard() {
  const bounds = computeBoardBounds();
  fitBoardToViewport(bounds);
  boardEl.innerHTML = "";
  updateAvailablePairs();

  const freeIds = new Set(getFreeTiles().map((tile) => tile.id));
  const hintedIds = new Set(state.hintedPair);
  const animatingIds = new Set(state.animatingMatches);

  state.board
    .filter((tile) => !tile.removed)
    .sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x)
    .forEach((tile) => {
      const btn = document.createElement("button");
      btn.className = "tile";
      if (!freeIds.has(tile.id)) btn.classList.add("blocked");
      if (state.selectedId === tile.id) btn.classList.add("selected");
      if (hintedIds.has(tile.id)) btn.classList.add("hint");
      if (animatingIds.has(tile.id)) btn.classList.add("removing");
      btn.style.left = `${(tile.x / 2) * STEP_X + tile.z * LEVEL_OFFSET_X}px`;
      btn.style.top = `${(tile.y / 2) * STEP_Y - tile.z * LEVEL_OFFSET_Y}px`;
      btn.style.zIndex = String(20 + tile.z * 20 + tile.y);
      btn.setAttribute("aria-label", tile.face.label);
      btn.innerHTML = `
        <span class="tile-shadow-stack"></span>
        <span class="tile-side tile-side-right"></span>
        <span class="tile-side tile-side-bottom"></span>
        <span class="tile-face">
          <span class="tile-corner top-left tone-${tile.face.tone}">${tile.face.glyph}</span>
          <span class="tile-glyph tone-${tile.face.tone}">${tile.face.glyph}</span>
          <span class="tile-corner bottom-right tone-${tile.face.tone}">${tile.face.glyph}</span>
        </span>
      `;
      btn.addEventListener("click", () => onTileClick(tile.id));
      boardEl.appendChild(btn);
    });
}

function onTileClick(tileId) {
  if (state.finished || state.animatingMatches.length) return;
  const tile = getTileById(tileId);
  if (!tile || tile.removed) return;
  if (!isFreeTile(tile)) {
    setMessage("Эта плитка заблокирована: сверху или с обеих сторон есть соседние плитки.", "warning");
    return;
  }

  if (state.selectedId === tileId) {
    state.selectedId = null;
    state.hintedPair = [];
    renderBoard();
    saveProgress();
    return;
  }

  if (!state.selectedId) {
    state.selectedId = tileId;
    state.hintedPair = [];
    renderBoard();
    saveProgress();
    return;
  }

  const selected = getTileById(state.selectedId);
  if (!selected || selected.removed) {
    state.selectedId = tileId;
    renderBoard();
    saveProgress();
    return;
  }

  state.moves += 1;

  if (selected.face.glyph === tile.face.glyph) {
    state.animatingMatches = [selected.id, tile.id];
    state.score += DIFFICULTIES[state.difficulty].pairScore;
    state.selectedId = null;
    renderBoard();
    updateStats();

    window.setTimeout(() => {
      state.board.forEach((entry) => {
        if (state.animatingMatches.includes(entry.id)) entry.removed = true;
      });
      state.animatingMatches = [];
      state.hintedPair = [];
      updateAvailablePairs();
      checkGameState();
      renderBoard();
      updateStats();
      saveProgress();
    }, REMOVE_ANIMATION_MS);
    return;
  }

  state.score = Math.max(0, state.score - DIFFICULTIES[state.difficulty].mismatchPenalty);
  state.selectedId = tileId;
  state.hintedPair = [];
  setMessage("Это разные плитки. Попробуй найти совпадающую свободную пару.", "warning");
  renderBoard();
  updateStats();
  saveProgress();
}

function checkGameState() {
  const remaining = state.board.filter((tile) => !tile.removed).length;
  if (remaining === 0) {
    state.finished = true;
    clearSavedProgress();
    const duration = Math.round((Date.now() - state.startedAt) / 1000);
    setMessage(`Победа! Поле очищено за ${state.moves} ходов и ${duration} сек. Можно отправить результат в бота.`, "success");
    return;
  }

  if (state.availablePairs === 0) {
    setMessage("Свободных пар не осталось. Запусти новую игру или смени раскладку.", "danger");
  } else {
    setMessage(`Доступно пар: ${state.availablePairs}. Продолжай разбирать раскладку.`, "default");
  }
}

function useHint() {
  if (state.finished || state.hintsLeft <= 0) return;
  const pairs = getFreePairs();
  if (!pairs.length) {
    setMessage("Подсказка недоступна: свободных совпадающих пар не найдено.", "warning");
    return;
  }

  const [a, b] = pairs[0];
  state.hintsLeft -= 1;
  state.hintedPair = [a.id, b.id];
  state.selectedId = null;
  renderBoard();
  updateStats();
  saveProgress();
  setMessage(`Подсказка: попробуй пару ${a.face.label}. Осталось подсказок: ${state.hintsLeft}.`, "success");
}

function sendResult() {
  const payload = {
    score: state.score,
    moves: state.moves,
    difficulty: DIFFICULTIES[state.difficulty].label,
    theme: getThemeById(state.theme).name,
    layout: getLayoutById(state.layout).name,
    tiles: state.board.length,
    durationSec: Math.round((Date.now() - state.startedAt) / 1000),
  };

  const text = JSON.stringify(payload);
  if (tg) {
    tg.sendData(text);
    tg.close();
  } else {
    navigator.clipboard?.writeText(text).catch(() => null);
    setMessage(`Результат скопирован: ${text}`, "success");
  }
}

restartBtn.addEventListener("click", () => startNewGame());
hintBtn.addEventListener("click", useHint);
sendResultBtn.addEventListener("click", sendResult);

renderControls();
applyTheme();

if (restoreSavedProgress()) {
  applyTheme();
  renderControls();
  updateAvailablePairs();
  renderBoard();
  updateStats();
  checkGameState();
  setMessage("Прогресс восстановлен из сохранения на устройстве. Можно продолжать партию.", "success");
} else {
  startNewGame({ preserveSettings: false });
}


window.addEventListener("resize", () => {
  const bounds = computeBoardBounds();
  fitBoardToViewport(bounds);
});
