const {
  NS,
  MAX_HISTORY,
  STORAGE_KEY,
  VECTOR_TYPES,
  ROOM_TYPES,
  DEFAULT_FURNITURE,
  ROOM_LAYOUTS
} = window.MF_CONSTANTS || {};

if (!window.MF_CONSTANTS) {
  throw new Error("MF_CONSTANTS est introuvable. Vérifiez l'ordre de chargement des scripts.");
}

let idCounter = 1;
const CELL_SIZE_CM = 30;
const IS_MAC_PLATFORM = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
const ZOOM_BASELINE = 3;
const ZOOM_MIN = ZOOM_BASELINE * 0.2;
const ZOOM_MAX = ZOOM_BASELINE * 4;
const WALL_STYLES = [
  { id: "pencil", label: "Crayon" },
  { id: "wood", label: "Bois" },
  { id: "stone", label: "Pierre" },
  { id: "stone_geo", label: "Pierre géométrique" },
  { id: "metal", label: "Métal" },
  { id: "mesh", label: "Mesh" },
  { id: "glass", label: "Verre" },
  { id: "water_curtain", label: "Rideau d'eau" },
  { id: "tapestry", label: "Tenture" },
  { id: "curtain", label: "Rideau" }
];
const FLOOR_TEXTURES = [
  { id: "stone", label: "Pierre" },
  { id: "wood", label: "Plancher" },
  { id: "sand", label: "Sable" },
  { id: "carpet_red", label: "Tapis rouge" },
  { id: "carpet_blue", label: "Tapis bleu" },
  { id: "tiles", label: "Carrelage" }
];
const ZONE_SHAPE_OPTIONS = [
  { id: "rect", label: "Rectangle" },
  { id: "ellipse", label: "Cercle" },
  { id: "vector_lasso", label: "Lasso vecteur" }
];

const FURNITURE_PIXEL_PALETTE = Object.freeze({
  A: "#0f172a",
  B: "#e2e8f0",
  C: "#b07a42",
  D: "#8b5e34",
  E: "#93c5fd",
  F: "#94a3b8",
  G: "#fbbf24",
  H: "#dbeafe",
  I: "#334155",
  J: "#86efac",
  K: "#67e8f9",
  L: "#38bdf8",
  M: "#c4b5fd",
  N: "#fda4af",
  O: "#bfdbfe"
});

const FURNITURE_PIXEL_ROWS = Object.freeze({
  bed_single: [
    "..AAAAAA..",
    ".ABBBBBBA.",
    ".ABEEEEBA.",
    ".ABEEEEBA.",
    ".ABEEEEBA.",
    ".ABBBBBBA.",
    ".ACCCCCCA.",
    "..AAAAAA.."
  ],
  bed_double: [
    ".AAAAAAAA.",
    "ABBBBBBBBA",
    "ABEEEEEEBA",
    "ABEEEEEEBA",
    "ABEEEEEEBA",
    "ABEEEEEEBA",
    "ACCCCCCCCA",
    ".AAAAAAAA."
  ],
  wardrobe: [
    ".AAAAAAA.",
    "ABCCCCCA.",
    "ABCDDDCA.",
    "ABCDDDCA.",
    "ABCDDDCA.",
    "ABCDDDCA.",
    "ABCCCCCA.",
    ".AAAAAAA."
  ],
  desk: [
    ".AAAAAAAA.",
    "ACCCCCCCCA",
    "ACCCCCCCCA",
    ".AA....AA.",
    ".AA....AA.",
    ".AA....AA.",
    ".AA....AA.",
    ".........."
  ],
  chair: [
    "..AAAA..",
    ".ACCCCA.",
    ".ACCCCA.",
    "..AAAA..",
    "..AA....",
    "..AA....",
    ".AA..AA.",
    "........"
  ],
  sofa: [
    ".AAAAAAAA.",
    "ACCCCCCCCA",
    "ACCCCCCCCA",
    "ACBBBBBBCA",
    "ACBBBBBBCA",
    ".AA....AA.",
    ".AA....AA.",
    ".........."
  ],
  coffee_table: [
    "..AAAA..",
    ".ACCCCA.",
    ".ACDDCA.",
    ".ACDDCA.",
    ".ACCCCA.",
    "..AAAA..",
    "..AA.AA.",
    "........"
  ],
  dining_table: [
    ".AAAAAAAA.",
    "ACCCCCCCCA",
    "ACDDDDDDCA",
    "ACDDDDDDCA",
    "ACCCCCCCCA",
    ".AA....AA.",
    ".AA....AA.",
    ".........."
  ],
  dining_chair: [
    "..AAAA..",
    ".ACCCCA.",
    ".ACCCCA.",
    "..AAAA..",
    "..AA....",
    ".AA.....",
    ".AA..AA.",
    "........"
  ],
  kitchen_sink: [
    ".AAAAAAAA.",
    "ACFFFFFFCA",
    "ACFHHHFFCA",
    "ACFHHHFFCA",
    "ACFFFFFFCA",
    "ACCCCCCCCA",
    ".AA....AA.",
    ".........."
  ],
  kitchen_counter: [
    ".AAAAAAAAAA.",
    "ACCCCCCCCCCA",
    "ACFFFFFFFFCA",
    "ACCCCCCCCCCA",
    "ACDDDDDDDDCA",
    ".AA......AA.",
    ".AA......AA.",
    "............"
  ],
  fridge: [
    ".AAAAAA.",
    "ABBBBBBA",
    "ABBBBBBA",
    "ABBBBBBA",
    "ABBBBBBA",
    "ABBBBBBA",
    "ABBBBBBA",
    ".AAAAAA."
  ],
  toilet: [
    "...AA...",
    "..AHHA..",
    ".AHHHHA.",
    ".AHHHHA.",
    "..AHHA..",
    "...AA...",
    "...AA...",
    "..AAAA.."
  ],
  bathtub: [
    ".AAAAAAAAAA.",
    "AHHHHHHHHHHA",
    "AHHHHHHHHHHA",
    "AHHHHHHHHHHA",
    "AHHHHHHHHHHA",
    ".AAAAAAAAAA.",
    "..AA....AA..",
    "............"
  ],
  shower: [
    ".AAAAAAAA.",
    "AHHHHHHHA",
    "AHOOOOOHA",
    "AHOLLLOHA",
    "AHOOOOOHA",
    "AHHHHHHHA",
    ".AAAAAAAA.",
    ".........."
  ],
  bookshelf: [
    ".AAAAAAAA.",
    "AJJJJJJJA",
    "AIIIIIIIA",
    "AJJJJJJJA",
    "AIIIIIIIA",
    "AJJJJJJJA",
    "AIIIIIIIA",
    ".AAAAAAAA."
  ],
  tv: [
    ".AAAAAAAA.",
    "AKKKKKKKKA",
    "AKKKKKKKKA",
    "AKKKKKKKKA",
    ".AAAAAAAA.",
    "...A..A...",
    "..AA..AA..",
    ".........."
  ]
});

const ui = {
  canvasWrap: document.getElementById("canvasWrap"),
  canvas: document.getElementById("canvas"),
  viewport: document.getElementById("viewport"),
  gridLayer: document.getElementById("gridLayer"),
  sceneLayer: document.getElementById("sceneLayer"),
  overlayLayer: document.getElementById("overlayLayer"),
  contextBar: document.getElementById("context-bar"),
  btnToggleGrid: document.getElementById("btnToggleGrid"),
  btnToggleZones: document.getElementById("btnToggleZones"),
  btnToggleSnap: document.getElementById("btnToggleSnap"),
  gridSize: document.getElementById("gridSize"),
  zoneShapeSelect: document.getElementById("zoneShapeSelect"),
  floorTextureSelect: document.getElementById("floorTextureSelect"),
  furnitureSelect: document.getElementById("furnitureSelect"),
  autoRoomType: document.getElementById("autoRoomType"),
  btnUndo: document.getElementById("btnUndo"),
  btnRedo: document.getElementById("btnRedo"),
  btnResetProject: document.getElementById("btnResetProject"),
  btnExportSvg: document.getElementById("btnExportSvg"),
  btnSave: document.getElementById("btnSave"),
  btnLoad: document.getElementById("btnLoad"),
  btnImportFurniture: document.getElementById("btnImportFurniture"),
  btnAutoFurnish: document.getElementById("btnAutoFurnish"),
  btnZoomIn: document.getElementById("btn-zoom-in"),
  btnZoomOut: document.getElementById("btn-zoom-out"),
  zoomDisplay: document.getElementById("zoom-display"),
  zoomBadge: document.getElementById("zoom-badge"),
  statusMode: document.getElementById("status-mode"),
  cursorX: document.getElementById("cursor-x"),
  cursorY: document.getElementById("cursor-y"),
  statNodes: document.getElementById("stat-nodes"),
  statVecs: document.getElementById("stat-vecs"),
  statZones: document.getElementById("stat-zones"),
  activeLayerName: document.getElementById("active-layer-name"),
  histCount: document.getElementById("hist-count"),
  scaleInfo: document.getElementById("scale-info"),
  fileLoad: document.getElementById("fileLoad"),
  fileFurniture: document.getElementById("fileFurniture"),
  tabs: [...document.querySelectorAll(".tabs button")],
  tabProperties: document.getElementById("tab-properties"),
  tabZones: document.getElementById("tab-zones"),
  tabLayers: document.getElementById("tab-layers"),
  toolOptions: document.getElementById("tool-options"),
  toolButtons: [...document.querySelectorAll("button[data-tool]")]
};

const app = {
  state: createDefaultState(),
  view: {
    zoom: ZOOM_BASELINE,
    panX: 0,
    panY: 0,
    showGrid: true,
    showZones: true,
    snap: true
  },
  history: {
    past: [],
    future: []
  },
  selection: [],
  tool: "select",
  zoneShape: "rect",
  activeTab: "properties",
  vectorPreset: {
    type: "wall",
    wallStyle: "pencil",
    thickness: 4,
    color: "#1f2937"
  },
  transient: {
    pendingVectorNodeId: null,
    pendingZoneAnchors: [],
    pendingFloorAnchors: [],
    lasso: null,
    pointerId: null,
    pointerDown: false,
    isPanning: false,
    panStart: null,
    selectionRect: null,
    moving: null
  }
};

init();

function createDefaultState() {
  const layerId = uid("layer");
  return {
    version: "1.3",
    grid: { enabled: true, cellSize: 20 },
    tree: [{
      type: "layer",
      id: layerId,
      name: "Layer principal",
      visible: true,
      nodes: [],
      vectors: [],
      furniture: [],
      floors: [],
      zones: []
    }],
    activeLayerId: layerId,
    furnitureLibrary: deepClone(DEFAULT_FURNITURE)
  };
}

function init() {
  bindUI();
  tryRestoreAutosave();
  syncCanvasSize(true);
  renderAll();
}

function bindUI() {
  ui.toolButtons.forEach((btn) => {
    btn.addEventListener("click", () => setTool(btn.dataset.tool));
  });

  ui.btnToggleGrid.addEventListener("click", () => {
    app.view.showGrid = !app.view.showGrid;
    renderAll();
  });

  if (ui.btnToggleZones) {
    ui.btnToggleZones.addEventListener("click", () => {
      app.view.showZones = !app.view.showZones;
      renderAll();
    });
  }

  ui.btnToggleSnap.addEventListener("click", () => {
    app.view.snap = !app.view.snap;
    renderAll();
  });

  ui.gridSize.addEventListener("change", () => {
    const value = Math.max(4, Number(ui.gridSize.value) || 20);
    mutate(() => {
      app.state.grid.cellSize = value;
    });
  });

  ui.zoneShapeSelect.addEventListener("change", () => {
    const raw = ui.zoneShapeSelect.value;
    app.zoneShape = (raw === "polygon" || raw === "lasso") ? "vector_lasso" : raw;
    ui.zoneShapeSelect.value = app.zoneShape;
    app.transient.pendingZoneAnchors = [];
    app.transient.pendingFloorAnchors = [];
    app.transient.lasso = null;
    renderAll();
  });

  ui.btnUndo.addEventListener("click", undo);
  ui.btnRedo.addEventListener("click", redo);
  if (ui.btnResetProject) ui.btnResetProject.addEventListener("click", resetProjectWithConfirmation);
  ui.btnSave.addEventListener("click", saveBmap);
  ui.btnLoad.addEventListener("click", () => ui.fileLoad.click());
  ui.fileLoad.addEventListener("change", handleLoadFile);
  ui.btnExportSvg.addEventListener("click", exportSvg);
  ui.btnImportFurniture.addEventListener("click", () => ui.fileFurniture.click());
  ui.fileFurniture.addEventListener("change", handleFurnitureImport);
  ui.btnAutoFurnish.addEventListener("click", autoFurnishSelection);

  ui.tabs.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      app.activeTab = tabBtn.dataset.tab;
      renderPanels();
    });
  });

  ui.canvas.addEventListener("pointerdown", onPointerDown);
  ui.canvas.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  ui.canvas.addEventListener("dblclick", onDoubleClick);
  ui.canvas.addEventListener("contextmenu", onContextMenu);
  (ui.canvasWrap || ui.canvas).addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("resize", () => {
    syncCanvasSize();
    renderAll();
  });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("pointerdown", (e) => {
    if (!e.target.closest?.("#context-bar")) hideContextBar();
  });

  if (ui.btnZoomIn) ui.btnZoomIn.addEventListener("click", () => zoomAtScreenCenter(1.2));
  if (ui.btnZoomOut) ui.btnZoomOut.addEventListener("click", () => zoomAtScreenCenter(1 / 1.2));
}

function onKeyDown(e) {
  if (e.key === " ") {
    if (ui.canvasWrap) ui.canvasWrap.classList.add("pan-mode");
    ui.canvas.classList.add("panning");
  }

  if (e.metaKey && (e.key === "." || e.code === "Period")) {
    e.preventDefault();
    cancelPendingVectorTrace();
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    if (e.shiftKey) redo();
    else undo();
  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
    e.preventDefault();
    redo();
  }

  if (e.key === "Escape") {
    cancelPendingVectorTrace();
    app.transient.pendingZoneAnchors = [];
    app.transient.pendingFloorAnchors = [];
    app.transient.lasso = null;
    app.transient.selectionRect = null;
    renderAll();
  }
}

function onKeyUp(e) {
  if (e.key === " ") {
    if (ui.canvasWrap) ui.canvasWrap.classList.remove("pan-mode");
    ui.canvas.classList.remove("panning");
    app.transient.isPanning = false;
  }
}

function cancelPendingVectorTrace() {
  if (!app.transient.pendingVectorNodeId) return;
  app.transient.pendingVectorNodeId = null;
}

function onWheel(e) {
  e.preventDefault();
  if (isUsualZoomGesture(e)) {
    const oldZoom = app.view.zoom;
    const intensity = e.ctrlKey || e.metaKey ? 0.0048 : 0.0018;
    const factor = Math.exp(-e.deltaY * intensity);
    const nextZoom = clamp(oldZoom * factor, ZOOM_MIN, ZOOM_MAX);
    if (nextZoom === oldZoom) return;

    const before = screenToWorld(e.clientX, e.clientY);
    app.view.zoom = nextZoom;
    const after = screenToWorld(e.clientX, e.clientY);
    app.view.panX += (after.x - before.x) * nextZoom;
    app.view.panY += (after.y - before.y) * nextZoom;
  } else {
    app.view.panX -= e.deltaX;
    app.view.panY -= e.deltaY;
  }
  renderAll();
}

function isUsualZoomGesture(e) {
  if (IS_MAC_PLATFORM) {
    // macOS: zoom uniquement via pinch (évite les zooms involontaires au scroll/drag trackpad).
    return !!(e.ctrlKey || e.metaKey);
  }
  // PC: zoom à la molette.
  return true;
}

function zoomAtScreenCenter(multiplier) {
  const rect = ui.canvas.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const oldZoom = app.view.zoom;
  const nextZoom = clamp(oldZoom * multiplier, ZOOM_MIN, ZOOM_MAX);
  if (nextZoom === oldZoom) return;
  const before = screenToWorld(cx, cy);
  app.view.zoom = nextZoom;
  const after = screenToWorld(cx, cy);
  app.view.panX += (after.x - before.x) * nextZoom;
  app.view.panY += (after.y - before.y) * nextZoom;
  renderAll();
}

function onPointerDown(e) {
  if (e.button !== 0 && e.button !== 1) return;
  const world = screenToWorld(e.clientX, e.clientY);
  const targetEntity = getTargetEntity(e.target);
  app.transient.pointerDown = true;
  app.transient.pointerId = e.pointerId;

  if (e.target.setPointerCapture) {
    try { e.target.setPointerCapture(e.pointerId); } catch (_) { }
  }

  if (e.altKey || e.ctrlKey && e.shiftKey) return;

  if (isSpacePressed() || e.button === 1) {
    e.preventDefault();
    app.transient.isPanning = true;
    app.transient.panStart = { x: e.clientX, y: e.clientY, panX: app.view.panX, panY: app.view.panY };
    return;
  }

  if (app.tool === "select") {
    if (targetEntity) {
      handleSelection(targetEntity, e.shiftKey);
      if ((targetEntity.kind === "node" || targetEntity.kind === "furniture" || targetEntity.kind === "opening") && !e.shiftKey) {
        startMoveSelection(world);
      }
    } else {
      if (!e.shiftKey) clearSelection();
      app.transient.selectionRect = { x0: world.x, y0: world.y, x1: world.x, y1: world.y, additive: e.shiftKey };
    }
    renderAll();
    return;
  }

  if (app.tool === "delete") {
    if (targetEntity) {
      mutate(() => deleteEntity(targetEntity));
    }
    return;
  }

  if (app.tool === "node") {
    handleNodeToolClick(world, targetEntity);
    return;
  }

  if (app.tool === "vector") {
    handleVectorToolClick(world, targetEntity);
    return;
  }

  if (app.tool === "zone") {
    handleZoneToolClick(world, targetEntity, false);
    return;
  }

  if (app.tool === "floor") {
    handleFloorToolClick(world, targetEntity, false);
    return;
  }

  if (app.tool === "furniture") {
    handleFurnitureToolClick(world);
    return;
  }
}

function onPointerMove(e) {
  const world = screenToWorld(e.clientX, e.clientY);
  updateSnapIndicator(world);
  if (ui.cursorX) ui.cursorX.textContent = Math.round(world.x);
  if (ui.cursorY) ui.cursorY.textContent = Math.round(world.y);

  if (app.transient.isPanning && app.transient.panStart) {
    app.view.panX = app.transient.panStart.panX + (e.clientX - app.transient.panStart.x);
    app.view.panY = app.transient.panStart.panY + (e.clientY - app.transient.panStart.y);
    renderAll();
    return;
  }

  if (app.transient.selectionRect) {
    app.transient.selectionRect.x1 = world.x;
    app.transient.selectionRect.y1 = world.y;
    renderAll();
    return;
  }

  if (app.transient.moving) {
    updateMoveSelection(world);
    renderAll();
    return;
  }

  if (app.transient.lasso) {
    updateLasso(world);
    renderAll();
    return;
  }

  if (app.tool === "vector" || app.tool === "zone" || app.tool === "floor") {
    app.transient.hoverPoint = world;
    renderAll();
  }
}

function onPointerUp() {
  app.transient.pointerDown = false;
  hideSnapIndicator();

  if (app.transient.lasso) {
    finalizeLasso();
    renderAll();
  }

  if (app.transient.selectionRect) {
    applySelectionRect(app.transient.selectionRect);
    app.transient.selectionRect = null;
    renderAll();
  }

  if (app.transient.moving) {
    app.transient.moving = null;
    persistAutosave();
  }

  app.transient.isPanning = false;
  app.transient.panStart = null;
}

function onDoubleClick(e) {
  if ((app.tool !== "zone" && app.tool !== "floor") || !isVectorLassoShape(app.zoneShape)) return;
  const world = screenToWorld(e.clientX, e.clientY);
  const targetEntity = getTargetEntity(e.target);
  if (app.tool === "zone") handleZoneToolClick(world, targetEntity, true);
  else handleFloorToolClick(world, targetEntity, true);
}

function onContextMenu(e) {
  e.preventDefault();
  const world = screenToWorld(e.clientX, e.clientY);
  const hits = collectContextHits(world, e.target);
  if (!hits.length) {
    hideContextBar();
    return;
  }
  showContextBar(e.clientX, e.clientY, hits);
}

function setTool(tool) {
  app.tool = tool;
  hideContextBar();
  app.transient.pendingVectorNodeId = null;
  app.transient.pendingZoneAnchors = [];
  app.transient.pendingFloorAnchors = [];
  app.transient.lasso = null;
  app.selection = [];
  ui.canvas.dataset.tool = tool;
  if (ui.canvasWrap) {
    ui.canvasWrap.classList.remove("select-mode", "delete-mode");
    if (tool === "select" || tool === "furniture") ui.canvasWrap.classList.add("select-mode");
    if (tool === "delete") ui.canvasWrap.classList.add("delete-mode");
  }
  ui.toolButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tool === tool));
  renderAll();
}

function mutate(fn) {
  pushHistory();
  fn();
  cleanupReferences();
  renderAll();
  persistAutosave();
}

function pushHistory() {
  app.history.past.push(captureState());
  if (app.history.past.length > MAX_HISTORY) app.history.past.shift();
  app.history.future = [];
}

function captureState() {
  return deepClone({
    state: app.state,
    view: {
      showGrid: app.view.showGrid,
      showZones: app.view.showZones,
      snap: app.view.snap
    },
    tool: app.tool
  });
}

function restoreSnapshot(snapshot) {
  app.state = deepClone(snapshot.state);
  app.view.showGrid = snapshot.view.showGrid;
  app.view.showZones = snapshot.view.showZones !== false;
  app.view.snap = snapshot.view.snap;
  app.tool = snapshot.tool || "select";
  app.selection = [];
  app.transient.pendingVectorNodeId = null;
  app.transient.pendingZoneAnchors = [];
  app.transient.pendingFloorAnchors = [];
  app.transient.lasso = null;
}

function undo() {
  if (!app.history.past.length) return;
  app.history.future.push(captureState());
  const previous = app.history.past.pop();
  restoreSnapshot(previous);
  renderAll();
  persistAutosave();
}

function redo() {
  if (!app.history.future.length) return;
  app.history.past.push(captureState());
  const next = app.history.future.pop();
  restoreSnapshot(next);
  renderAll();
  persistAutosave();
}

function resetProjectWithConfirmation() {
  const ok = window.confirm("Réinitialiser le projet en cours ? Cette action supprimera le plan actuel.");
  if (!ok) return;

  app.state = createDefaultState();
  app.history.past = [];
  app.history.future = [];
  app.selection = [];
  app.tool = "select";
  app.view.zoom = ZOOM_BASELINE;
  app.view.panX = 0;
  app.view.panY = 0;
  app.view.showGrid = true;
  app.view.showZones = true;
  app.view.snap = true;
  app.vectorPreset = {
    type: "wall",
    wallStyle: "pencil",
    thickness: 4,
    color: "#1f2937"
  };
  app.transient.pendingVectorNodeId = null;
  app.transient.pendingZoneAnchors = [];
  app.transient.pendingFloorAnchors = [];
  app.transient.lasso = null;
  app.transient.selectionRect = null;
  app.transient.moving = null;
  setTool("select");
  renderAll();
  persistAutosave();
}

function clearSelection() {
  app.selection = [];
}

function handleSelection(entity, additive) {
  if (!additive) {
    app.selection = [entity];
    return;
  }
  const idx = app.selection.findIndex((s) => s.kind === entity.kind && s.id === entity.id);
  if (idx >= 0) app.selection.splice(idx, 1);
  else app.selection.push(entity);
}

function startMoveSelection(worldPoint) {
  const layer = getActiveLayer();
  if (!layer) return;

  const movable = app.selection.filter((s) => s.kind === "node" || s.kind === "furniture" || s.kind === "opening");
  if (!movable.length) return;

  const entries = [];
  for (const item of movable) {
    if (item.kind === "node") {
      const node = layer.nodes.find((n) => n.id === item.id);
      if (node) entries.push({ kind: "node", id: node.id, x: node.x, y: node.y });
    }
    if (item.kind === "furniture") {
      const furn = layer.furniture.find((f) => f.id === item.id);
      if (furn) entries.push({ kind: "furniture", id: furn.id, x: furn.x, y: furn.y });
    }
    if (item.kind === "opening") {
      const ref = findOpeningInLayer(layer, item.id);
      if (ref) {
        const p = pointOnSegmentAtT(ref.a, ref.b, ref.opening.t);
        entries.push({ kind: "opening", id: item.id, x: p.x, y: p.y });
      }
    }
  }

  if (!entries.length) return;
  pushHistory();
  app.transient.moving = { start: worldPoint, entries };
}

function updateMoveSelection(worldPoint) {
  const layer = getActiveLayer();
  if (!layer || !app.transient.moving) return;

  let dx = worldPoint.x - app.transient.moving.start.x;
  let dy = worldPoint.y - app.transient.moving.start.y;

  if (app.view.snap) {
    const cs = app.state.grid.cellSize;
    dx = Math.round(dx / cs) * cs;
    dy = Math.round(dy / cs) * cs;
  }

  for (const entry of app.transient.moving.entries) {
    if (entry.kind === "node") {
      const node = layer.nodes.find((n) => n.id === entry.id);
      if (node) {
        node.x = entry.x + dx;
        node.y = entry.y + dy;
      }
    } else if (entry.kind === "furniture") {
      const furn = layer.furniture.find((f) => f.id === entry.id);
      if (furn) {
        furn.x = entry.x + dx;
        furn.y = entry.y + dy;
      }
    } else if (entry.kind === "opening") {
      moveOpeningToPoint(layer, entry.id, { x: entry.x + dx, y: entry.y + dy });
    }
  }
}

function applySelectionRect(rect) {
  const layer = getActiveLayer();
  if (!layer) return;
  const xMin = Math.min(rect.x0, rect.x1);
  const xMax = Math.max(rect.x0, rect.x1);
  const yMin = Math.min(rect.y0, rect.y1);
  const yMax = Math.max(rect.y0, rect.y1);

  const hits = [];

  for (const node of layer.nodes) {
    if (node.x >= xMin && node.x <= xMax && node.y >= yMin && node.y <= yMax) {
      hits.push({ kind: "node", id: node.id });
    }
  }

  for (const furn of layer.furniture) {
    if (furn.x >= xMin && furn.x <= xMax && furn.y >= yMin && furn.y <= yMax) {
      hits.push({ kind: "furniture", id: furn.id });
    }
  }

  for (const vec of layer.vectors) {
    const a = getNode(layer, vec.a);
    const b = getNode(layer, vec.b);
    if (!a || !b) continue;
    if (inRect(a, xMin, xMax, yMin, yMax) && inRect(b, xMin, xMax, yMin, yMax)) {
      hits.push({ kind: "vector", id: vec.id });
    }
    const openings = normalizeVectorOpenings(vec.openings);
    vec.openings = openings;
    for (const opening of openings) {
      const c = pointOnSegmentAtT(a, b, opening.t);
      if (inRect(c, xMin, xMax, yMin, yMax)) {
        hits.push({ kind: "opening", id: opening.id });
      }
    }
  }

  for (const zone of layer.zones) {
    const bb = zoneBoundingBox(layer, zone);
    if (!bb) continue;
    if (bb.maxX >= xMin && bb.minX <= xMax && bb.maxY >= yMin && bb.minY <= yMax) {
      hits.push({ kind: "zone", id: zone.id });
    }
  }

  for (const floor of layer.floors || []) {
    const bb = floorBoundingBox(layer, floor);
    if (!bb) continue;
    if (bb.maxX >= xMin && bb.minX <= xMax && bb.maxY >= yMin && bb.minY <= yMax) {
      hits.push({ kind: "floor", id: floor.id });
    }
  }

  if (rect.additive) {
    const map = new Map(app.selection.map((s) => [`${s.kind}:${s.id}`, s]));
    hits.forEach((h) => map.set(`${h.kind}:${h.id}`, h));
    app.selection = [...map.values()];
  } else {
    app.selection = hits;
  }
}

function inRect(p, xMin, xMax, yMin, yMax) {
  return p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax;
}

function getTargetEntity(target) {
  if (!target) return null;
  const hit = target.closest?.("[data-kind][data-id]") || target;
  if (!hit.dataset) return null;
  const kind = hit.dataset.kind;
  const id = hit.dataset.id;
  if (!kind || !id) return null;
  return { kind, id };
}

function collectContextHits(world, eventTarget) {
  const layer = getActiveLayer();
  if (!layer) return [];
  const hits = [];
  const tol = 8 / app.view.zoom;

  const direct = getTargetEntity(eventTarget);
  if (direct) hits.push(direct);

  for (const node of layer.nodes) {
    if (Math.hypot(node.x - world.x, node.y - world.y) <= tol) {
      hits.push({ kind: "node", id: node.id });
    }
  }

  for (const furn of layer.furniture) {
    if (pointInsideFurniture(layer, furn, world)) {
      hits.push({ kind: "furniture", id: furn.id });
    }
  }

  for (const vec of layer.vectors) {
    const a = getNode(layer, vec.a);
    const b = getNode(layer, vec.b);
    if (!a || !b) continue;
    const openings = normalizeVectorOpenings(vec.openings);
    vec.openings = openings;
    for (const opening of openings) {
      const c = pointOnSegmentAtT(a, b, opening.t);
      if (Math.hypot(c.x - world.x, c.y - world.y) <= tol * 1.2) hits.push({ kind: "opening", id: opening.id });
    }
    const proj = projectPointOnSegment(world, a, b);
    if (proj.distance <= tol) hits.push({ kind: "vector", id: vec.id });
  }

  for (const zone of layer.zones) {
    if (zone.visible === false) continue;
    if (isPointInZone(layer, zone, world)) hits.push({ kind: "zone", id: zone.id });
  }

  for (const floor of layer.floors || []) {
    if (floor.visible === false) continue;
    if (isPointInFloor(layer, floor, world)) hits.push({ kind: "floor", id: floor.id });
  }

  const unique = [];
  const seen = new Set();
  for (const h of hits) {
    const key = `${h.kind}:${h.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(h);
  }
  return unique;
}

function pointInsideFurniture(layer, furn, point) {
  const def = furnitureDef(furn.furnitureId);
  const w = (def?.width || 1) * app.state.grid.cellSize;
  const h = (def?.height || 1) * app.state.grid.cellSize;
  const ang = (-normalizeAngle(furn.rotation) * Math.PI) / 180;
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const dx = point.x - furn.x;
  const dy = point.y - furn.y;
  const lx = dx * cos - dy * sin;
  const ly = dx * sin + dy * cos;
  return Math.abs(lx) <= w / 2 && Math.abs(ly) <= h / 2;
}

function findOpeningInLayer(layer, openingId) {
  for (const vector of layer.vectors) {
    const openings = normalizeVectorOpenings(vector.openings);
    vector.openings = openings;
    const index = openings.findIndex((o) => o.id === openingId);
    if (index < 0) continue;
    const a = getNode(layer, vector.a);
    const b = getNode(layer, vector.b);
    if (!a || !b) return null;
    return { vector, opening: openings[index], index, a, b };
  }
  return null;
}

function nearestVectorProjection(layer, point) {
  let best = null;
  for (const vector of layer.vectors) {
    const a = getNode(layer, vector.a);
    const b = getNode(layer, vector.b);
    if (!a || !b) continue;
    const proj = projectPointOnSegment(point, a, b);
    if (!best || proj.distance < best.proj.distance) {
      best = { vector, a, b, proj };
    }
  }
  return best;
}

function moveOpeningToPoint(layer, openingId, point) {
  const ref = findOpeningInLayer(layer, openingId);
  if (!ref) return;
  const nearest = nearestVectorProjection(layer, point);
  if (!nearest) return;

  const nextOpening = {
    ...ref.opening,
    t: clamp(nearest.proj.t, 0.05, 0.95)
  };

  if (ref.vector.id === nearest.vector.id) {
    ref.vector.openings = normalizeVectorOpenings(ref.vector.openings)
      .map((o) => (o.id === openingId ? nextOpening : o))
      .sort((a, b) => a.t - b.t);
    return;
  }

  ref.vector.openings = normalizeVectorOpenings(ref.vector.openings).filter((o) => o.id !== openingId);
  nearest.vector.openings = normalizeVectorOpenings(nearest.vector.openings);
  nearest.vector.openings.push(nextOpening);
  nearest.vector.openings.sort((a, b) => a.t - b.t);
}

function showContextBar(clientX, clientY, hits) {
  if (!ui.contextBar || !ui.canvasWrap) return;
  const wrapRect = ui.canvasWrap.getBoundingClientRect();
  ui.contextBar.innerHTML = hits
    .map((h) => `
      <div class="ctx-row">
        <button class="ctx-pick" data-pick-kind="${h.kind}" data-pick-id="${h.id}">${escapeHtml(contextHitLabel(h))}</button>
        <button class="ctx-del" data-del-kind="${h.kind}" data-del-id="${h.id}" title="Supprimer">✕</button>
      </div>
    `)
    .join("");

  ui.contextBar.querySelectorAll(".ctx-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      app.selection = [{ kind: btn.dataset.pickKind, id: btn.dataset.pickId }];
      app.activeTab = "properties";
      hideContextBar();
      renderAll();
    });
  });
  ui.contextBar.querySelectorAll(".ctx-del").forEach((btn) => {
    btn.addEventListener("click", () => {
      mutate(() => deleteEntity({ kind: btn.dataset.delKind, id: btn.dataset.delId }));
      hideContextBar();
    });
  });

  ui.contextBar.classList.add("visible");
  let x = clientX - wrapRect.left + 8;
  let y = clientY - wrapRect.top + 8;
  const w = ui.contextBar.offsetWidth || 180;
  const h = ui.contextBar.offsetHeight || 100;
  x = clamp(x, 8, Math.max(8, wrapRect.width - w - 8));
  y = clamp(y, 8, Math.max(8, wrapRect.height - h - 8));
  ui.contextBar.style.left = `${x}px`;
  ui.contextBar.style.top = `${y}px`;
}

function hideContextBar() {
  if (!ui.contextBar) return;
  ui.contextBar.classList.remove("visible");
  ui.contextBar.innerHTML = "";
}

function contextHitLabel(hit) {
  if (hit.kind === "node") return `Node ${hit.id}`;
  if (hit.kind === "vector") return `Vecteur ${hit.id}`;
  if (hit.kind === "opening") return `Ouverture ${hit.id}`;
  if (hit.kind === "zone") return `Zone ${hit.id}`;
  if (hit.kind === "furniture") return `Meuble ${hit.id}`;
  if (hit.kind === "floor") return `Sol ${hit.id}`;
  return `${hit.kind} ${hit.id}`;
}

function handleNodeToolClick(world, targetEntity) {
  const layer = getActiveLayer();
  if (!layer) return;

  if (targetEntity && targetEntity.kind === "node") {
    app.selection = [targetEntity];
    renderAll();
    return;
  }

  if (targetEntity && targetEntity.kind === "vector") {
    mutate(() => {
      const newNodeId = splitVectorAtPoint(layer, targetEntity.id, world);
      if (newNodeId) app.selection = [{ kind: "node", id: newNodeId }];
    });
    return;
  }

  const nearNode = findNodeNear(layer, world, 6 / app.view.zoom);
  if (nearNode) {
    app.selection = [{ kind: "node", id: nearNode.id }];
    renderAll();
    return;
  }

  const nearVector = findVectorNear(layer, world, 6 / app.view.zoom);
  if (nearVector) {
    mutate(() => {
      const newNodeId = splitVectorAtPoint(layer, nearVector.vector.id, nearVector.point);
      if (newNodeId) app.selection = [{ kind: "node", id: newNodeId }];
    });
    return;
  }

  const p = maybeSnap(world);
  mutate(() => {
    const node = createNode(layer, p.x, p.y);
    app.selection = [{ kind: "node", id: node.id }];
  });
}

function handleVectorToolClick(world, targetEntity) {
  const layer = getActiveLayer();
  if (!layer) return;

  const nodeId = getOrCreateVectorEndpoint(layer, world, targetEntity);
  if (!nodeId) return;

  if (!app.transient.pendingVectorNodeId) {
    app.transient.pendingVectorNodeId = nodeId;
    app.selection = [{ kind: "node", id: nodeId }];
    renderAll();
    return;
  }

  const sourceId = app.transient.pendingVectorNodeId;
  const destId = nodeId;

  if (sourceId === destId) {
    app.transient.pendingVectorNodeId = null;
    renderAll();
    return;
  }

  mutate(() => {
    const vector = createVector(layer, sourceId, destId, {
      type: app.vectorPreset.type,
      thickness: app.vectorPreset.thickness,
      color: app.vectorPreset.color,
      wallStyle: app.vectorPreset.wallStyle,
      openings: [],
      params: {}
    });
    if (vector) {
      processIntersections(layer, [vector.id]);
      app.selection = [{ kind: "node", id: destId }];
    }
    app.transient.pendingVectorNodeId = destId;
  });
}

function getOrCreateVectorEndpoint(layer, world, targetEntity) {
  if (targetEntity && targetEntity.kind === "node") return targetEntity.id;

  if (targetEntity && targetEntity.kind === "vector") {
    let createdNodeId = null;
    mutate(() => {
      createdNodeId = splitVectorAtPoint(layer, targetEntity.id, world);
    });
    return createdNodeId;
  }

  const nearNode = findNodeNear(layer, world, 6 / app.view.zoom);
  if (nearNode) return nearNode.id;

  const nearVector = findVectorNear(layer, world, 6 / app.view.zoom);
  if (nearVector) {
    let createdNodeId = null;
    mutate(() => {
      createdNodeId = splitVectorAtPoint(layer, nearVector.vector.id, nearVector.point);
    });
    return createdNodeId;
  }

  const p = maybeSnap(world);
  let nodeId = null;
  mutate(() => {
    const node = createNode(layer, p.x, p.y);
    nodeId = node.id;
  });
  return nodeId;
}

function handleZoneToolClick(world, targetEntity, forceFinish) {
  const layer = getActiveLayer();
  if (!layer) return;

  const anchor = createShapeAnchor(layer, world, targetEntity);
  if (!anchor) return;

  if (isVectorLassoShape(app.zoneShape)) {
    const pending = app.transient.pendingZoneAnchors;

    if (forceFinish) {
      if (pending.length >= 3) {
        const anchors = pending.slice();
        mutate(() => {
          const zone = createZone(layer, "vector_lasso", anchors);
          if (zone) app.selection = [{ kind: "zone", id: zone.id }];
        });
      }
      app.transient.pendingZoneAnchors = [];
      renderAll();
      return;
    }

    if (pending.length >= 3 && isAnchorEquivalent(anchor, pending[0])) {
      const anchors = pending.slice();
      mutate(() => {
        const zone = createZone(layer, "vector_lasso", anchors);
        if (zone) app.selection = [{ kind: "zone", id: zone.id }];
      });
      app.transient.pendingZoneAnchors = [];
      return;
    }

    pending.push(anchor);
    renderAll();
    return;
  }

  if (!app.transient.pendingZoneAnchors.length) {
    app.transient.pendingZoneAnchors = [anchor];
    renderAll();
    return;
  }

  const first = app.transient.pendingZoneAnchors[0];
  mutate(() => {
    const zone = createZone(layer, app.zoneShape, [first, anchor]);
    if (zone) app.selection = [{ kind: "zone", id: zone.id }];
  });
  app.transient.pendingZoneAnchors = [];
}

function handleFloorToolClick(world, targetEntity, forceFinish) {
  const layer = getActiveLayer();
  if (!layer) return;

  const anchor = createShapeAnchor(layer, world, targetEntity);
  if (!anchor) return;

  if (isVectorLassoShape(app.zoneShape)) {
    const pending = app.transient.pendingFloorAnchors;

    if (forceFinish) {
      if (pending.length >= 3) {
        const anchors = pending.slice();
        mutate(() => {
          const floor = createFloor(layer, "vector_lasso", anchors);
          if (floor) app.selection = [{ kind: "floor", id: floor.id }];
        });
      }
      app.transient.pendingFloorAnchors = [];
      renderAll();
      return;
    }

    if (pending.length >= 3 && isAnchorEquivalent(anchor, pending[0])) {
      const anchors = pending.slice();
      mutate(() => {
        const floor = createFloor(layer, "vector_lasso", anchors);
        if (floor) app.selection = [{ kind: "floor", id: floor.id }];
      });
      app.transient.pendingFloorAnchors = [];
      return;
    }

    pending.push(anchor);
    renderAll();
    return;
  }

  if (!app.transient.pendingFloorAnchors.length) {
    app.transient.pendingFloorAnchors = [anchor];
    renderAll();
    return;
  }

  const first = app.transient.pendingFloorAnchors[0];
  mutate(() => {
    const floor = createFloor(layer, app.zoneShape, [first, anchor]);
    if (floor) app.selection = [{ kind: "floor", id: floor.id }];
  });
  app.transient.pendingFloorAnchors = [];
}

function handleFurnitureToolClick(world) {
  const layer = getActiveLayer();
  if (!layer) return;
  const furnitureId = ui.furnitureSelect.value;
  const def = app.state.furnitureLibrary.find((f) => f.id === furnitureId);
  if (!def) return;

  const p = maybeSnap(world);
  mutate(() => {
    const item = {
      id: uid("furniture"),
      furnitureId: def.id,
      x: p.x,
      y: p.y,
      rotation: normalizeAngle(def.defaultRotation || 0),
      layerId: layer.id
    };
    layer.furniture.push(item);
    app.selection = [{ kind: "furniture", id: item.id }];
  });
}

function createShapeAnchor(layer, world, targetEntity) {
  if (targetEntity && targetEntity.kind === "node") {
    return { type: "nodeRef", nodeId: targetEntity.id };
  }

  const nearNode = findNodeNear(layer, world, 6 / app.view.zoom);
  if (nearNode) {
    return { type: "nodeRef", nodeId: nearNode.id };
  }

  const snapped = snapToGrid(world);
  return { type: "gridPoint", x: snapped.x, y: snapped.y };
}

function isAnchorEquivalent(a, b) {
  if (!a || !b || a.type !== b.type) return false;
  if (a.type === "nodeRef") return a.nodeId === b.nodeId;
  return Math.abs(a.x - b.x) < 0.001 && Math.abs(a.y - b.y) < 0.001;
}

function isVectorLassoShape(shape) {
  return shape === "vector_lasso" || shape === "polygon" || shape === "lasso";
}

function beginLasso(targetKind, world) {
  const start = snapToGrid(world);
  app.transient.lasso = {
    targetKind,
    points: [start]
  };
}

function updateLasso(world) {
  const lasso = app.transient.lasso;
  if (!lasso) return;
  const p = snapToGrid(world);
  const last = lasso.points[lasso.points.length - 1];
  if (!last || Math.hypot(last.x - p.x, last.y - p.y) >= app.state.grid.cellSize * 0.7) {
    lasso.points.push(p);
  }
}

function finalizeLasso() {
  const lasso = app.transient.lasso;
  app.transient.lasso = null;
  if (!lasso || lasso.points.length < 3) return;

  const layer = getActiveLayer();
  if (!layer) return;

  const anchors = dedupeGridPoints(lasso.points).map((p) => ({ type: "gridPoint", x: p.x, y: p.y }));
  if (anchors.length < 3) return;

  mutate(() => {
    if (lasso.targetKind === "zone") {
      const zone = createZone(layer, "lasso", anchors);
      if (zone) app.selection = [{ kind: "zone", id: zone.id }];
    } else if (lasso.targetKind === "floor") {
      const floor = createFloor(layer, "lasso", anchors);
      if (floor) app.selection = [{ kind: "floor", id: floor.id }];
    }
  });
}

function dedupeGridPoints(points) {
  const out = [];
  const seen = new Set();
  for (const p of points) {
    const key = `${Math.round(p.x)}:${Math.round(p.y)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ x: p.x, y: p.y });
  }
  return out;
}

function createNode(layer, x, y) {
  const existing = findNodeExact(layer, x, y, 0.001);
  if (existing) return existing;
  const node = { id: uid("node"), x, y, layerId: layer.id };
  layer.nodes.push(node);
  return node;
}

function createVector(layer, nodeAId, nodeBId, overrides = null) {
  if (nodeAId === nodeBId) return null;
  const a = getNode(layer, nodeAId);
  const b = getNode(layer, nodeBId);
  if (!a || !b) return null;

  const vector = {
    id: uid("vector"),
    a: nodeAId,
    b: nodeBId,
    type: "wall",
    thickness: 4,
    color: "#1f2937",
    wallStyle: "pencil",
    openings: [],
    params: {},
    layerId: layer.id
  };

  if (overrides) {
    vector.type = overrides.type;
    vector.thickness = overrides.thickness;
    vector.color = overrides.color;
    vector.wallStyle = WALL_STYLES.some((s) => s.id === overrides.wallStyle) ? overrides.wallStyle : "pencil";
    vector.openings = normalizeVectorOpenings(overrides.openings);
    vector.params = deepClone(overrides.params || {});
  }

  layer.vectors.push(vector);
  return vector;
}

function normalizeVectorOpenings(openings) {
  if (!Array.isArray(openings)) return [];
  return openings
    .map((o) => {
      const rawT = Number(o.t);
      const rawW = Number(o.widthCells);
      return {
        id: String(o.id || uid("open")),
        kind: o.kind === "door" ? "door" : "window",
        t: clamp(Number.isFinite(rawT) ? rawT : 0.5, 0.05, 0.95),
        widthCells: clamp(Number.isFinite(rawW) ? rawW : (o.kind === "door" ? 1.2 : 1.0), 0.4, 3)
      };
    })
    .sort((a, b) => a.t - b.t);
}

function addVectorOpening(vector, kind) {
  const openings = normalizeVectorOpenings(vector.openings);
  openings.push({
    id: uid("open"),
    kind: kind === "door" ? "door" : "window",
    t: 0.5,
    widthCells: kind === "door" ? 1.3 : 1.05
  });
  redistributeVectorOpenings(openings);
  vector.openings = openings;
}

function moveVectorOpening(vector, openingId, direction) {
  const openings = normalizeVectorOpenings(vector.openings);
  const idx = openings.findIndex((o) => o.id === openingId);
  if (idx < 0) return;
  const next = idx + direction;
  if (next < 0 || next >= openings.length) return;
  const tmp = openings[idx];
  openings[idx] = openings[next];
  openings[next] = tmp;
  redistributeVectorOpenings(openings);
  vector.openings = openings;
}

function removeVectorOpening(vector, openingId) {
  const openings = normalizeVectorOpenings(vector.openings).filter((o) => o.id !== openingId);
  redistributeVectorOpenings(openings);
  vector.openings = openings;
}

function redistributeVectorOpenings(openings) {
  if (!openings.length) return;
  for (let i = 0; i < openings.length; i += 1) {
    openings[i].t = (i + 1) / (openings.length + 1);
  }
}

function createZone(layer, shapeType, anchors) {
  if (!isValidShapeGeometry(layer, shapeType, anchors)) {
    alert("Zone invalide: la taille ne peut pas être nulle.");
    return null;
  }
  const name = prompt("Nom de la zone", `Zone ${layer.zones.length + 1}`) || `Zone ${layer.zones.length + 1}`;
  const roomType = ui.autoRoomType.value || "bedroom_single";
  const zone = {
    id: uid("zone"),
    name,
    roomType,
    shapeType,
    anchors: deepClone(anchors),
    visible: true,
    fill: "rgba(56,189,248,0.22)",
    stroke: "#0284c7",
    layerId: layer.id
  };
  layer.zones.push(zone);
  return zone;
}

function createFloor(layer, shapeType, anchors) {
  if (!isValidShapeGeometry(layer, shapeType, anchors)) {
    alert("Sol invalide: la taille ne peut pas être nulle.");
    return null;
  }
  const floor = {
    id: uid("floor"),
    name: `Sol ${((layer.floors || []).length || 0) + 1}`,
    textureId: ui.floorTextureSelect?.value || "stone",
    shapeType,
    anchors: deepClone(anchors),
    visible: true,
    opacity: 1,
    layerId: layer.id
  };
  layer.floors = layer.floors || [];
  layer.floors.push(floor);
  return floor;
}

function isValidShapeGeometry(layer, shapeType, anchors) {
  const pts = (anchors || []).map((a) => anchorToPoint(layer, a)).filter(Boolean);
  if (shapeType === "rect" || shapeType === "ellipse") {
    if (pts.length < 2) return false;
    const w = Math.abs(pts[1].x - pts[0].x);
    const h = Math.abs(pts[1].y - pts[0].y);
    return w > 0.001 && h > 0.001;
  }
  if (shapeType === "polygon" || shapeType === "lasso" || shapeType === "vector_lasso") {
    if (pts.length < 3) return false;
    return polygonAreaAbs(pts) > 0.5;
  }
  return false;
}

function polygonAreaAbs(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

function vectorsAreCollinearAtNode(layer, nodeId, v1, v2) {
  const n = getNode(layer, nodeId);
  if (!n) return false;
  const n1 = getNode(layer, v1.a === nodeId ? v1.b : v1.a);
  const n2 = getNode(layer, v2.a === nodeId ? v2.b : v2.a);
  if (!n1 || !n2) return false;
  const d1x = n1.x - n.x;
  const d1y = n1.y - n.y;
  const d2x = n2.x - n.x;
  const d2y = n2.y - n.y;
  const len1 = Math.hypot(d1x, d1y);
  const len2 = Math.hypot(d2x, d2y);
  if (len1 < 1e-6 || len2 < 1e-6) return false;
  const cross = d1x * d2y - d1y * d2x;
  const dot = d1x * d2x + d1y * d2y;
  return Math.abs(cross) <= 1e-4 * len1 * len2 && dot < 0;
}

function findVectorBetween(layer, aId, bId) {
  return layer.vectors.find((v) =>
    (v.a === aId && v.b === bId) || (v.a === bId && v.b === aId)
  ) || null;
}

function deleteEntity(entity) {
  const layer = getActiveLayer();
  if (!layer) return;

  if (entity.kind === "node") {
    const node = layer.nodes.find((n) => n.id === entity.id);
    if (!node) return;
    const connected = layer.vectors.filter((v) => v.a === node.id || v.b === node.id);
    if (connected.length === 2) {
      const v1 = connected[0];
      const v2 = connected[1];
      const n1 = v1.a === node.id ? v1.b : v1.a;
      const n2 = v2.a === node.id ? v2.b : v2.a;
      layer.vectors = layer.vectors.filter((v) => v.id !== v1.id && v.id !== v2.id);
      const canMerge = n1 && n2 && n1 !== n2 &&
        vectorsAreCollinearAtNode(layer, node.id, v1, v2) &&
        !findVectorBetween(layer, n1, n2);
      if (canMerge) {
        createVector(layer, n1, n2, {
          type: v1.type,
          thickness: (Number(v1.thickness) + Number(v2.thickness)) / 2,
          color: v1.color || v2.color || "#1f2937",
          wallStyle: v1.wallStyle || v2.wallStyle || "pencil",
          openings: [],
          params: { ...(v1.params || {}), ...(v2.params || {}) }
        });
      }
    } else {
      layer.vectors = layer.vectors.filter((v) => v.a !== node.id && v.b !== node.id);
    }
    layer.zones.forEach((z) => {
      z.anchors = z.anchors.map((a) => {
        if (a.type === "nodeRef" && a.nodeId === node.id) {
          return { type: "gridPoint", x: node.x, y: node.y };
        }
        return a;
      });
    });
    (layer.floors || []).forEach((fl) => {
      fl.anchors = fl.anchors.map((a) => {
        if (a.type === "nodeRef" && a.nodeId === node.id) {
          return { type: "gridPoint", x: node.x, y: node.y };
        }
        return a;
      });
    });
    layer.nodes = layer.nodes.filter((n) => n.id !== node.id);
  }

  if (entity.kind === "vector") {
    layer.vectors = layer.vectors.filter((v) => v.id !== entity.id);
  }

  if (entity.kind === "opening") {
    for (const vector of layer.vectors) {
      vector.openings = normalizeVectorOpenings(vector.openings).filter((o) => o.id !== entity.id);
    }
  }

  if (entity.kind === "furniture") {
    layer.furniture = layer.furniture.filter((f) => f.id !== entity.id);
  }

  if (entity.kind === "zone") {
    layer.zones = layer.zones.filter((z) => z.id !== entity.id);
  }

  if (entity.kind === "floor") {
    layer.floors = (layer.floors || []).filter((f) => f.id !== entity.id);
  }

  app.selection = app.selection.filter((s) => !(s.kind === entity.kind && s.id === entity.id));
}

function splitVectorAtPoint(layer, vectorId, worldPoint) {
  const vector = layer.vectors.find((v) => v.id === vectorId);
  if (!vector) return null;

  const a = getNode(layer, vector.a);
  const b = getNode(layer, vector.b);
  if (!a || !b) return null;

  const proj = projectPointOnSegment(worldPoint, a, b);
  const eps = 1e-5;
  if (proj.t <= eps) return a.id;
  if (proj.t >= 1 - eps) return b.id;

  const node = createNode(layer, proj.x, proj.y);
  splitVectorAtNodes(layer, vector.id, [node.id]);
  return node.id;
}

function splitVectorAtNodes(layer, vectorId, nodeIds) {
  const vector = layer.vectors.find((v) => v.id === vectorId);
  if (!vector) return [vectorId];

  const a = getNode(layer, vector.a);
  const b = getNode(layer, vector.b);
  if (!a || !b) return [vectorId];

  const uniqueIds = [...new Set(nodeIds)].filter((id) => id !== vector.a && id !== vector.b);
  if (!uniqueIds.length) return [vectorId];

  const sorted = uniqueIds
    .map((id) => ({ id, t: parameterOnSegment(getNode(layer, id), a, b) }))
    .filter((x) => x.t > 1e-6 && x.t < 1 - 1e-6)
    .sort((u, v) => u.t - v.t);

  if (!sorted.length) return [vectorId];

  layer.vectors = layer.vectors.filter((v) => v.id !== vectorId);

  const chain = [vector.a, ...sorted.map((s) => s.id), vector.b];
  const newIds = [];

  for (let i = 0; i < chain.length - 1; i += 1) {
    if (chain[i] === chain[i + 1]) continue;
    const created = createVector(layer, chain[i], chain[i + 1], {
      type: vector.type,
      thickness: vector.thickness,
      color: vector.color,
      wallStyle: vector.wallStyle,
      openings: [],
      params: vector.params
    });
    if (created) newIds.push(created.id);
  }

  return newIds;
}

function processIntersections(layer, newVectorIds) {
  for (const newId of newVectorIds) {
    const newVector = layer.vectors.find((v) => v.id === newId);
    if (!newVector) continue;

    const newA = getNode(layer, newVector.a);
    const newB = getNode(layer, newVector.b);
    if (!newA || !newB) continue;

    const splitMap = new Map();
    splitMap.set(newVector.id, []);

    for (const other of layer.vectors) {
      if (other.id === newVector.id) continue;
      const a1 = getNode(layer, other.a);
      const b1 = getNode(layer, other.b);
      if (!a1 || !b1) continue;

      const pt = segmentIntersectionStrict(newA, newB, a1, b1);
      if (!pt) continue;

      const interNode = createNode(layer, pt.x, pt.y);
      if (!splitMap.has(newVector.id)) splitMap.set(newVector.id, []);
      splitMap.get(newVector.id).push(interNode.id);
      if (!splitMap.has(other.id)) splitMap.set(other.id, []);
      splitMap.get(other.id).push(interNode.id);
    }

    for (const [vectorId, nodeIds] of splitMap.entries()) {
      if (nodeIds.length) splitVectorAtNodes(layer, vectorId, nodeIds);
    }
  }
}

function segmentIntersectionStrict(a, b, c, d) {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const den = cross2(r, s);
  const qmp = { x: c.x - a.x, y: c.y - a.y };

  if (Math.abs(den) < 1e-9) return null;

  const t = cross2(qmp, s) / den;
  const u = cross2(qmp, r) / den;

  const eps = 1e-6;
  if (t <= eps || t >= 1 - eps || u <= eps || u >= 1 - eps) return null;

  return { x: a.x + t * r.x, y: a.y + t * r.y };
}

function cross2(a, b) {
  return a.x * b.y - a.y * b.x;
}

function getNode(layer, nodeId) {
  return layer.nodes.find((n) => n.id === nodeId) || null;
}

function findNodeExact(layer, x, y, epsilon) {
  return layer.nodes.find((n) => Math.abs(n.x - x) <= epsilon && Math.abs(n.y - y) <= epsilon) || null;
}

function findNodeNear(layer, point, tol) {
  let best = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const n of layer.nodes) {
    const d = Math.hypot(n.x - point.x, n.y - point.y);
    if (d < tol && d < bestD) {
      best = n;
      bestD = d;
    }
  }
  return best;
}

function findVectorNear(layer, point, tol) {
  let best = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const v of layer.vectors) {
    const a = getNode(layer, v.a);
    const b = getNode(layer, v.b);
    if (!a || !b) continue;
    const proj = projectPointOnSegment(point, a, b);
    if (proj.distance <= tol && proj.distance < bestDist) {
      bestDist = proj.distance;
      best = { vector: v, point: { x: proj.x, y: proj.y } };
    }
  }

  return best;
}

function projectPointOnSegment(p, a, b) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const len2 = abx * abx + aby * aby;
  if (!len2) {
    return { t: 0, x: a.x, y: a.y, distance: Math.hypot(p.x - a.x, p.y - a.y) };
  }

  const t = clamp(((p.x - a.x) * abx + (p.y - a.y) * aby) / len2, 0, 1);
  const x = a.x + t * abx;
  const y = a.y + t * aby;
  return { t, x, y, distance: Math.hypot(p.x - x, p.y - y) };
}

function parameterOnSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (!len2) return 0;
  return ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
}

function maybeSnap(p) {
  if (!app.view.snap) return { x: p.x, y: p.y };
  return snapToGrid(p);
}

function snapToGrid(p) {
  const cs = app.state.grid.cellSize;
  return {
    x: Math.round(p.x / cs) * cs,
    y: Math.round(p.y / cs) * cs
  };
}

function getActiveLayer() {
  return findLayerById(app.state.activeLayerId, app.state.tree);
}

function findLayerById(layerId, nodes) {
  for (const node of nodes) {
    if (node.type === "layer" && node.id === layerId) return node;
    if (node.type === "group") {
      const inChild = findLayerById(layerId, node.children || []);
      if (inChild) return inChild;
    }
  }
  return null;
}

function walkTree(nodes, fn, parentVisible = true) {
  for (const node of nodes) {
    const ownVisible = node.visible !== false;
    const combinedVisible = parentVisible && ownVisible;
    fn(node, combinedVisible);
    if (node.type === "group") {
      walkTree(node.children || [], fn, combinedVisible);
    }
  }
}

function findTreeNode(id, nodes = app.state.tree, parent = null) {
  for (let i = 0; i < nodes.length; i += 1) {
    const n = nodes[i];
    if (n.id === id) return { node: n, parent, index: i, siblings: nodes };
    if (n.type === "group") {
      const result = findTreeNode(id, n.children || [], n);
      if (result) return result;
    }
  }
  return null;
}

function cleanupReferences() {
  const layer = getActiveLayer();
  if (!layer) {
    const first = firstLayer(app.state.tree);
    if (first) app.state.activeLayerId = first.id;
  }

  const selectedValid = [];
  const active = getActiveLayer();
  if (active) {
    for (const s of app.selection) {
      if (s.kind === "node" && active.nodes.some((n) => n.id === s.id)) selectedValid.push(s);
      if (s.kind === "vector" && active.vectors.some((n) => n.id === s.id)) selectedValid.push(s);
      if (s.kind === "opening" && !!findOpeningInLayer(active, s.id)) selectedValid.push(s);
      if (s.kind === "furniture" && active.furniture.some((n) => n.id === s.id)) selectedValid.push(s);
      if (s.kind === "zone" && active.zones.some((n) => n.id === s.id)) selectedValid.push(s);
      if (s.kind === "floor" && (active.floors || []).some((n) => n.id === s.id)) selectedValid.push(s);
    }
  }
  app.selection = selectedValid;
}

function firstLayer(nodes) {
  for (const node of nodes) {
    if (node.type === "layer") return node;
    if (node.type === "group") {
      const nested = firstLayer(node.children || []);
      if (nested) return nested;
    }
  }
  return null;
}

function syncCanvasSize(force = false) {
  if (!ui.canvas || !ui.canvasWrap) return;
  const rect = ui.canvasWrap.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const currentW = Number(ui.canvas.getAttribute("width")) || 0;
  const currentH = Number(ui.canvas.getAttribute("height")) || 0;
  if (!force && currentW === width && currentH === height) return;
  ui.canvas.setAttribute("width", String(width));
  ui.canvas.setAttribute("height", String(height));
  ui.canvas.setAttribute("viewBox", `0 0 ${width} ${height}`);
  ui.canvas.setAttribute("preserveAspectRatio", "none");
}

function screenToWorld(clientX, clientY) {
  const rect = ui.canvas.getBoundingClientRect();
  const localX = clientX - rect.left;
  const localY = clientY - rect.top;
  return {
    x: (localX - app.view.panX) / app.view.zoom,
    y: (localY - app.view.panY) / app.view.zoom
  };
}

function worldToScreen(x, y) {
  const rect = ui.canvas.getBoundingClientRect();
  return {
    x: rect.left + app.view.panX + x * app.view.zoom,
    y: rect.top + app.view.panY + y * app.view.zoom
  };
}

function updateSnapIndicator(world) {
  const dot = document.getElementById("snap-dot");
  if (!dot || !app.view.snap || app.tool === "select" || app.tool === "delete") {
    hideSnapIndicator();
    return;
  }

  const snapped = snapToGrid(world);
  const localX = app.view.panX + snapped.x * app.view.zoom;
  const localY = app.view.panY + snapped.y * app.view.zoom;
  dot.style.display = "block";
  dot.style.left = `${localX}px`;
  dot.style.top = `${localY}px`;
}

function hideSnapIndicator() {
  const dot = document.getElementById("snap-dot");
  if (dot) dot.style.display = "none";
}

function updateViewportTransform() {
  ui.viewport.setAttribute("transform", `translate(${app.view.panX},${app.view.panY}) scale(${app.view.zoom})`);
}

function renderAll() {
  syncCanvasSize();
  updateViewportTransform();
  renderToolbarState();
  renderGrid();
  renderScene();
  renderOverlay();
  renderPanels();
}

function renderToolbarState() {
  const selectedFurniture = ui.furnitureSelect.value;
  const selectedRoomType = ui.autoRoomType.value;

  ui.btnToggleGrid.textContent = `Grille ${app.state.grid.cellSize}px: ${app.view.showGrid ? "On" : "Off"}`;
  ui.btnToggleGrid.classList.toggle("active", app.view.showGrid);
  if (ui.btnToggleZones) {
    ui.btnToggleZones.textContent = app.view.showZones ? "Masquer zones" : "Afficher zones";
    ui.btnToggleZones.classList.toggle("active", app.view.showZones);
  }
  ui.btnToggleSnap.textContent = app.view.snap ? "SNAP" : "LIB";
  ui.btnToggleSnap.classList.toggle("active", app.view.snap);
  ui.gridSize.value = String(app.state.grid.cellSize);
  if (![...ui.zoneShapeSelect.options].some((o) => o.value === app.zoneShape)) {
    app.zoneShape = "rect";
  }
  ui.zoneShapeSelect.value = app.zoneShape;
  if (ui.canvasWrap) ui.canvasWrap.classList.toggle("grid-off", !app.view.showGrid);
  const gridBg = document.getElementById("grid-bg");
  if (gridBg) {
    const major = app.state.grid.cellSize * 5;
    const minor = app.state.grid.cellSize;
    gridBg.style.backgroundSize = `${minor}px ${minor}px, ${major}px ${major}px, ${major}px ${major}px, ${minor}px ${minor}px, ${minor}px ${minor}px`;
  }
  const uiZoomPercent = Math.round((app.view.zoom / ZOOM_BASELINE) * 100);
  if (ui.zoomDisplay) ui.zoomDisplay.textContent = `${uiZoomPercent}%`;
  if (ui.zoomBadge) ui.zoomBadge.textContent = `${uiZoomPercent}`;
  if (ui.statusMode) ui.statusMode.textContent = app.tool.toUpperCase();

  ui.furnitureSelect.innerHTML = app.state.furnitureLibrary
    .map((f) => `<option value="${escapeAttr(f.id)}">${escapeHtml(f.label)} (${escapeHtml(f.id)})</option>`)
    .join("");

  if (!ui.furnitureSelect.value && app.state.furnitureLibrary.length) {
    ui.furnitureSelect.value = app.state.furnitureLibrary[0].id;
  }

  ui.autoRoomType.innerHTML = ROOM_TYPES.map((r) => `<option value="${r.id}">${r.label}</option>`).join("");
  if (selectedFurniture && app.state.furnitureLibrary.some((f) => f.id === selectedFurniture)) {
    ui.furnitureSelect.value = selectedFurniture;
  }
  if (selectedRoomType && ROOM_TYPES.some((r) => r.id === selectedRoomType)) {
    ui.autoRoomType.value = selectedRoomType;
  }
  renderToolOptionsPanel();

  const activeLayer = getActiveLayer();
  if (ui.activeLayerName) ui.activeLayerName.textContent = activeLayer?.name || "—";
  if (ui.histCount) ui.histCount.textContent = `${app.history.past.length}`;
  if (ui.scaleInfo) ui.scaleInfo.textContent = `1 carré ≈ ${CELL_SIZE_CM} cm IRL`;
  if (activeLayer) {
    if (ui.statNodes) ui.statNodes.textContent = `${activeLayer.nodes.length}`;
    if (ui.statVecs) ui.statVecs.textContent = `${activeLayer.vectors.length}`;
    if (ui.statZones) ui.statZones.textContent = `${activeLayer.zones.length}`;
  } else {
    if (ui.statNodes) ui.statNodes.textContent = "0";
    if (ui.statVecs) ui.statVecs.textContent = "0";
    if (ui.statZones) ui.statZones.textContent = "0";
  }
}

function renderToolOptionsPanel() {
  if (!ui.toolOptions) return;

  if (app.tool === "floor") {
    ui.toolOptions.innerHTML = `
      <div class="tool-options-head">Textures de Sol</div>
      <div class="tile-grid">
        ${FLOOR_TEXTURES.map((f) => `
          <button class="opt-tile ${ui.floorTextureSelect.value === f.id ? "active" : ""}" data-floor-texture="${f.id}">
            <span class="texture-swatch texture-${escapeAttr(f.id)}"></span>
            <span class="opt-label">${escapeHtml(f.label)}</span>
          </button>
        `).join("")}
      </div>
    `;
    [...ui.toolOptions.querySelectorAll("[data-floor-texture]")].forEach((btn) => {
      btn.addEventListener("click", () => {
        ui.floorTextureSelect.value = btn.dataset.floorTexture;
        renderToolOptionsPanel();
      });
    });
    return;
  }

  if (app.tool === "furniture") {
    ui.toolOptions.innerHTML = `
      <div class="tool-options-head">Bibliothèque Meubles</div>
      <div class="tile-grid furniture">
        ${app.state.furnitureLibrary.map((f) => `
          <button class="opt-tile ${ui.furnitureSelect.value === f.id ? "active" : ""}" data-furniture-id="${escapeAttr(f.id)}">
            <span class="furn-mini">${furnitureMiniGridHtml(f)}</span>
            <span class="opt-label">${escapeHtml(f.label)}</span>
          </button>
        `).join("")}
      </div>
    `;
    [...ui.toolOptions.querySelectorAll("[data-furniture-id]")].forEach((btn) => {
      btn.addEventListener("click", () => {
        ui.furnitureSelect.value = btn.dataset.furnitureId;
        renderToolOptionsPanel();
      });
    });
    return;
  }

  if (app.tool === "zone") {
    ui.toolOptions.innerHTML = `
      <div class="tool-options-head">Formes de Zone</div>
      <div class="tile-grid">
        ${ZONE_SHAPE_OPTIONS.map((s) => `
          <button class="opt-tile ${app.zoneShape === s.id ? "active" : ""}" data-zone-shape="${s.id}">
            ${zoneShapePreviewSvg(s.id)}
            <span class="opt-label">${escapeHtml(s.label)}</span>
          </button>
        `).join("")}
      </div>
    `;
    [...ui.toolOptions.querySelectorAll("[data-zone-shape]")].forEach((btn) => {
      btn.addEventListener("click", () => {
        app.zoneShape = btn.dataset.zoneShape;
        ui.zoneShapeSelect.value = app.zoneShape;
        app.transient.pendingZoneAnchors = [];
        app.transient.pendingFloorAnchors = [];
        app.transient.lasso = null;
        renderAll();
      });
    });
    return;
  }

  if (app.tool === "vector") {
    const sourceNode = app.transient.pendingVectorNodeId
      ? getNode(getActiveLayer() || { nodes: [] }, app.transient.pendingVectorNodeId)
      : null;
    ui.toolOptions.innerHTML = `
      <div class="tool-options-head">Types de Vecteur</div>
      <div class="tile-grid">
        ${VECTOR_TYPES.map((t) => `
          <button class="opt-tile ${app.vectorPreset.type === t ? "active" : ""}" data-vector-type="${t}">
            ${vectorTypePreviewSvg(t)}
            <span class="opt-label">${escapeHtml(t)}</span>
          </button>
        `).join("")}
      </div>
      <div class="tool-options-head">Style de Mur</div>
      <div class="tile-grid">
        ${WALL_STYLES.map((s) => `
          <button class="opt-tile ${app.vectorPreset.wallStyle === s.id ? "active" : ""}" data-vector-style="${s.id}">
            ${vectorStylePreviewSvg(s.id)}
            <span class="opt-label">${escapeHtml(s.label)}</span>
          </button>
        `).join("")}
      </div>
      <div class="row">
        <label>Épaisseur</label>
        <input id="optVectorThickness" type="number" min="1" max="40" step="1" value="${Number(app.vectorPreset.thickness) || 4}">
      </div>
      <div class="row">
        <label>Couleur</label>
        <input id="optVectorColor" type="color" value="${toHexColor(app.vectorPreset.color)}">
      </div>
      ${sourceNode ? `
        <div class="row">
          <label>Tracé en cours</label>
          <input value="Source: ${escapeAttr(sourceNode.id)}" readonly>
        </div>
        <div class="row single">
          <button id="btnCancelVectorTrace" class="danger">Annuler tracé</button>
        </div>
      ` : ""}
    `;
    [...ui.toolOptions.querySelectorAll("[data-vector-type]")].forEach((btn) => {
      btn.addEventListener("click", () => {
        app.vectorPreset.type = btn.dataset.vectorType;
        renderToolOptionsPanel();
      });
    });
    [...ui.toolOptions.querySelectorAll("[data-vector-style]")].forEach((btn) => {
      btn.addEventListener("click", () => {
        app.vectorPreset.wallStyle = btn.dataset.vectorStyle;
        renderToolOptionsPanel();
      });
    });
    const thickInput = document.getElementById("optVectorThickness");
    if (thickInput) {
      thickInput.addEventListener("change", (e) => {
        app.vectorPreset.thickness = clamp(Number(e.target.value) || 4, 1, 40);
      });
    }
    const colorInput = document.getElementById("optVectorColor");
    if (colorInput) {
      colorInput.addEventListener("change", (e) => {
        app.vectorPreset.color = e.target.value || "#1f2937";
      });
    }
    const cancelBtn = document.getElementById("btnCancelVectorTrace");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        cancelPendingVectorTrace();
        renderAll();
      });
    }
    return;
  }

  ui.toolOptions.innerHTML = `<div class="hint">Sélectionnez un outil pour afficher ses options.</div>`;
}

function vectorTypePreviewSvg(type) {
  if (type === "door") {
    return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><line x1="6" y1="10" x2="54" y2="10" stroke="#b45309" stroke-width="2.4" stroke-linecap="round"/><path d="M24 10 A10 10 0 0 1 24 0" fill="none" stroke="#d97706" stroke-width="1.2"/></svg>`;
  }
  if (type === "window") {
    return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><line x1="6" y1="10" x2="54" y2="10" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round"/><line x1="6" y1="10" x2="54" y2="10" stroke="#7dd3fc" stroke-width="1" stroke-dasharray="4 2"/></svg>`;
  }
  if (type === "opening") {
    return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><line x1="6" y1="10" x2="54" y2="10" stroke="#6b7280" stroke-width="2.2" stroke-linecap="round"/><line x1="24" y1="10" x2="36" y2="10" stroke="#ffffff" stroke-width="2.6"/></svg>`;
  }
  if (type === "invisible") {
    return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><line x1="6" y1="10" x2="54" y2="10" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4" opacity="0.8"/></svg>`;
  }
  return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><line x1="6" y1="10" x2="54" y2="10" stroke="#1f2937" stroke-width="2.4" stroke-linecap="round"/></svg>`;
}

function vectorStylePreviewSvg(styleId) {
  const style = wallStyleStroke(styleId, "#1f2937", 2.2);
  return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><line x1="6" y1="10" x2="54" y2="10" stroke="${escapeAttr(style.stroke)}" stroke-width="${n(style.width)}" stroke-linecap="round" ${style.dash ? `stroke-dasharray="${escapeAttr(style.dash)}"` : ""} opacity="${n(style.opacity)}"/></svg>`;
}

function zoneShapePreviewSvg(shapeId) {
  if (shapeId === "ellipse") {
    return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><ellipse cx="30" cy="10" rx="16" ry="6" fill="rgba(56,189,248,0.2)" stroke="#0284c7" stroke-width="1.1"/></svg>`;
  }
  if (shapeId === "vector_lasso") {
    return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><polyline points="8,14 18,5 32,7 42,13 52,8" fill="none" stroke="#0284c7" stroke-width="1.3"/></svg>`;
  }
  return `<svg class="vector-preview" viewBox="0 0 60 20" aria-hidden="true"><rect x="14" y="4" width="32" height="12" fill="rgba(56,189,248,0.2)" stroke="#0284c7" stroke-width="1.1"/></svg>`;
}

function furnitureMiniGridHtml(def) {
  const rows = normalizedPixelRowsForFurniture(def.id, def);
  const cols = rows[0]?.length || 1;
  const cells = [];
  for (const row of rows) {
    for (const key of row) {
      const color = FURNITURE_PIXEL_PALETTE[key] || "transparent";
      cells.push(`<span class="furn-mini-cell" style="background:${escapeAttr(color)}"></span>`);
    }
  }
  return `<span class="furn-mini-grid" style="grid-template-columns:repeat(${cols},2px)">${cells.join("")}</span>`;
}

function renderGrid() {
  ui.gridLayer.innerHTML = "";
  if (!app.view.showGrid || !app.state.grid.enabled) return;

  const rect = ui.canvas.getBoundingClientRect();
  const topLeft = screenToWorld(rect.left, rect.top);
  const bottomRight = screenToWorld(rect.right, rect.bottom);

  const cs = app.state.grid.cellSize;
  const minX = Math.floor(Math.min(topLeft.x, bottomRight.x) / cs) * cs;
  const maxX = Math.ceil(Math.max(topLeft.x, bottomRight.x) / cs) * cs;
  const minY = Math.floor(Math.min(topLeft.y, bottomRight.y) / cs) * cs;
  const maxY = Math.ceil(Math.max(topLeft.y, bottomRight.y) / cs) * cs;

  const majorStep = cs * 5;

  for (let x = minX; x <= maxX; x += cs) {
    const isMajor = Math.abs((x / majorStep) - Math.round(x / majorStep)) < 1e-6;
    const line = createSvg("line", {
      x1: x,
      y1: minY,
      x2: x,
      y2: maxY,
      stroke: isMajor ? "rgba(15,23,42,0.08)" : "rgba(15,23,42,0.018)",
      "stroke-width": isMajor ? 0.8 : 0.5
    });
    ui.gridLayer.appendChild(line);
  }

  for (let y = minY; y <= maxY; y += cs) {
    const isMajor = Math.abs((y / majorStep) - Math.round(y / majorStep)) < 1e-6;
    const line = createSvg("line", {
      x1: minX,
      y1: y,
      x2: maxX,
      y2: y,
      stroke: isMajor ? "rgba(15,23,42,0.08)" : "rgba(15,23,42,0.018)",
      "stroke-width": isMajor ? 0.8 : 0.5
    });
    ui.gridLayer.appendChild(line);
  }

  for (let x = minX; x <= maxX; x += cs) {
    for (let y = minY; y <= maxY; y += cs) {
      const dot = createSvg("circle", {
        cx: x,
        cy: y,
        r: Math.max(0.35, 0.6 / app.view.zoom),
        fill: "rgba(15,23,42,0.14)"
      });
      ui.gridLayer.appendChild(dot);
    }
  }
}

function buildVectorVisualGroup(vector, a, b) {
  const g = createSvg("g", {});
  g.dataset.kind = "vector";
  g.dataset.id = vector.id;
  if (isSelected("vector", vector.id)) g.classList.add("selected");

  const thickness = Math.max(1, Number(vector.thickness) || 1);
  const styleId = WALL_STYLES.some((s) => s.id === vector.wallStyle) ? vector.wallStyle : "pencil";
  const baseColor = vectorBaseColor(vector);
  renderVectorBaseByStyle(g, vector, a, b, baseColor, thickness, styleId);
  renderVectorOpenings(g, vector, a, b, thickness);

  if (vector.type && vector.type !== "wall") {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const tag = createSvg("text", {
      x: mx,
      y: my - 7,
      "text-anchor": "middle",
      "font-size": 9,
      fill: "#334155",
      "pointer-events": "none"
    });
    tag.textContent = vector.type;
    g.appendChild(tag);
  }

  return g;
}

function vectorBaseColor(vector) {
  if (vector.type === "door") return "#b45309";
  if (vector.type === "window") return "#0284c7";
  if (vector.type === "opening") return "#6b7280";
  if (vector.type === "invisible") return "#94a3b8";
  return vector.color || "#1f2937";
}

function renderVectorBaseByStyle(group, vector, a, b, baseColor, thickness, styleId) {
  if (vector.type === "invisible") {
    group.appendChild(createSvg("line", {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: baseColor, "stroke-width": Math.max(1, thickness * 0.8), "stroke-linecap": "round",
      "stroke-dasharray": "6,4", opacity: 0.45
    }));
    return;
  }

  if (styleId === "pencil") {
    const d1 = handDrawnPath(a, b, vector.id, 1, 2.6);
    const d2 = handDrawnPath(a, b, vector.id, 2, 1.8);
    group.appendChild(createSvg("path", {
      d: d1,
      fill: "none",
      stroke: baseColor,
      "stroke-width": thickness,
      "stroke-linecap": "round",
      opacity: 0.9
    }));
    group.appendChild(createSvg("path", {
      d: d2,
      fill: "none",
      stroke: baseColor,
      "stroke-width": Math.max(1, thickness * 0.45),
      "stroke-linecap": "round",
      opacity: 0.55
    }));
    return;
  }

  const styleStroke = wallStyleStroke(styleId, baseColor, thickness);
  group.appendChild(createSvg("line", {
    x1: a.x, y1: a.y, x2: b.x, y2: b.y,
    stroke: styleStroke.stroke,
    "stroke-width": styleStroke.width,
    "stroke-linecap": "round",
    "stroke-dasharray": styleStroke.dash || null,
    opacity: styleStroke.opacity
  }));

  if (vector.type === "door") {
    const mid = pointOnSegmentAtT(a, b, 0.5);
    const dir = unitDirection(a, b);
    const n = { x: -dir.y, y: dir.x };
    const r = Math.max(6, thickness * 2.8);
    const s = { x: mid.x - dir.x * r * 0.65, y: mid.y - dir.y * r * 0.65 };
    const arcEnd = { x: s.x + n.x * r, y: s.y + n.y * r };
    group.appendChild(createSvg("path", {
      d: `M ${n2(s.x)} ${n2(s.y)} A ${n2(r)} ${n2(r)} 0 0 1 ${n2(arcEnd.x)} ${n2(arcEnd.y)}`,
      fill: "none",
      stroke: "#b45309",
      "stroke-width": Math.max(1, thickness * 0.35),
      opacity: 0.85
    }));
  } else if (vector.type === "window") {
    group.appendChild(createSvg("line", {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: "#7dd3fc",
      "stroke-width": Math.max(1, thickness * 0.35),
      "stroke-linecap": "round",
      "stroke-dasharray": "6,3",
      opacity: 0.9
    }));
  }

  if (styleId === "wood") {
    group.appendChild(createSvg("line", {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: "#7c4a23",
      "stroke-width": Math.max(1, thickness * 0.28),
      "stroke-linecap": "round",
      "stroke-dasharray": "2,5",
      opacity: 0.7
    }));
  } else if (styleId === "metal") {
    group.appendChild(createSvg("line", {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: "#cbd5e1",
      "stroke-width": Math.max(1, thickness * 0.32),
      "stroke-linecap": "round",
      opacity: 0.9
    }));
  } else if (styleId === "mesh") {
    const n = unitNormal(a, b);
    group.appendChild(createSvg("line", {
      x1: a.x + n.x * 2.2, y1: a.y + n.y * 2.2, x2: b.x + n.x * 2.2, y2: b.y + n.y * 2.2,
      stroke: "#64748b",
      "stroke-width": Math.max(0.8, thickness * 0.22),
      "stroke-linecap": "round",
      "stroke-dasharray": "1.5,3",
      opacity: 0.65
    }));
  } else if (styleId === "glass") {
    const n = unitNormal(a, b);
    group.appendChild(createSvg("line", {
      x1: a.x + n.x * 1.8, y1: a.y + n.y * 1.8, x2: b.x + n.x * 1.8, y2: b.y + n.y * 1.8,
      stroke: "#bae6fd",
      "stroke-width": Math.max(0.8, thickness * 0.25),
      "stroke-linecap": "round",
      opacity: 0.9
    }));
    group.appendChild(createSvg("line", {
      x1: a.x - n.x * 1.8, y1: a.y - n.y * 1.8, x2: b.x - n.x * 1.8, y2: b.y - n.y * 1.8,
      stroke: "#bae6fd",
      "stroke-width": Math.max(0.8, thickness * 0.25),
      "stroke-linecap": "round",
      opacity: 0.9
    }));
  }
}

function wallStyleStroke(styleId, baseColor, thickness) {
  const base = { stroke: baseColor, width: thickness, dash: null, opacity: 1 };
  if (styleId === "wood") return { stroke: "#8b5e34", width: thickness * 1.05, dash: null, opacity: 0.95 };
  if (styleId === "stone") return { stroke: "#6b7280", width: thickness * 1.2, dash: "1,3.5", opacity: 0.95 };
  if (styleId === "stone_geo") return { stroke: "#64748b", width: thickness * 1.1, dash: "8,3,2,3", opacity: 0.95 };
  if (styleId === "metal") return { stroke: "#475569", width: thickness * 1.05, dash: null, opacity: 1 };
  if (styleId === "mesh") return { stroke: "#64748b", width: Math.max(1, thickness * 0.9), dash: "2,2", opacity: 0.9 };
  if (styleId === "glass") return { stroke: "#0ea5e9", width: Math.max(1, thickness * 0.7), dash: null, opacity: 0.55 };
  if (styleId === "water_curtain") return { stroke: "#38bdf8", width: Math.max(1, thickness * 0.95), dash: "1,5", opacity: 0.7 };
  if (styleId === "tapestry") return { stroke: "#a855f7", width: Math.max(1, thickness), dash: "5,3", opacity: 0.75 };
  if (styleId === "curtain") return { stroke: "#7c3aed", width: Math.max(1, thickness * 0.85), dash: "3,2", opacity: 0.65 };
  return base;
}

function renderVectorOpenings(group, vector, a, b, thickness) {
  const openings = normalizeVectorOpenings(vector.openings);
  if (!openings.length) return;
  vector.openings = openings;

  const dir = unitDirection(a, b);
  const n = { x: -dir.y, y: dir.x };

  for (const opening of openings) {
    const c = pointOnSegmentAtT(a, b, opening.t);
    const half = Math.max(5, opening.widthCells * app.state.grid.cellSize * 0.28);
    const s = { x: c.x - dir.x * half, y: c.y - dir.y * half };
    const e = { x: c.x + dir.x * half, y: c.y + dir.y * half };

    if (opening.kind === "door") {
      group.appendChild(createSvg("line", {
        x1: s.x, y1: s.y, x2: e.x, y2: e.y,
        stroke: "#b45309",
        "stroke-width": Math.max(1.3, thickness * 0.58),
        "stroke-linecap": "round"
      }));

      const arcR = half * 0.95;
      const arcEnd = { x: s.x + n.x * arcR, y: s.y + n.y * arcR };
      const arc = createSvg("path", {
        d: `M ${n2(s.x)} ${n2(s.y)} A ${n2(arcR)} ${n2(arcR)} 0 0 1 ${n2(arcEnd.x)} ${n2(arcEnd.y)}`,
        fill: "none",
        stroke: "#d97706",
        "stroke-width": Math.max(1, thickness * 0.36),
        opacity: 0.8
      });
      group.appendChild(arc);
    } else {
      group.appendChild(createSvg("line", {
        x1: s.x, y1: s.y, x2: e.x, y2: e.y,
        stroke: "#0284c7",
        "stroke-width": Math.max(1.3, thickness * 0.52),
        "stroke-linecap": "round"
      }));
      const tickHalf = Math.max(2, thickness * 0.4);
      group.appendChild(createSvg("line", {
        x1: s.x - n.x * tickHalf, y1: s.y - n.y * tickHalf,
        x2: s.x + n.x * tickHalf, y2: s.y + n.y * tickHalf,
        stroke: "#0ea5e9", "stroke-width": 1.1, opacity: 0.85
      }));
      group.appendChild(createSvg("line", {
        x1: e.x - n.x * tickHalf, y1: e.y - n.y * tickHalf,
        x2: e.x + n.x * tickHalf, y2: e.y + n.y * tickHalf,
        stroke: "#0ea5e9", "stroke-width": 1.1, opacity: 0.85
      }));
    }

    const handle = createSvg("circle", {
      cx: c.x,
      cy: c.y,
      r: 3.6,
      class: `opening-handle ${opening.kind}${isSelected("opening", opening.id) ? " selected" : ""}`
    });
    handle.dataset.kind = "opening";
    handle.dataset.id = opening.id;
    group.appendChild(handle);
  }
}

function handDrawnPath(a, b, seedBase, channel, amplitude) {
  const t = 0.5;
  const mid = pointOnSegmentAtT(a, b, t);
  const n = unitNormal(a, b);
  const jitter = seededNoise(`${seedBase}:${channel}`) * amplitude;
  const c = { x: mid.x + n.x * jitter, y: mid.y + n.y * jitter };
  return `M ${n2(a.x)} ${n2(a.y)} Q ${n2(c.x)} ${n2(c.y)} ${n2(b.x)} ${n2(b.y)}`;
}

function seededNoise(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 2001) / 1000 - 1;
}

function pointOnSegmentAtT(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function unitDirection(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

function unitNormal(a, b) {
  const d = unitDirection(a, b);
  return { x: -d.y, y: d.x };
}

function n2(v) {
  return Number(v.toFixed(2));
}

function normalizedPixelRowsForFurniture(furnitureId, def) {
  const rows = FURNITURE_PIXEL_ROWS[furnitureId] || fallbackPixelRows(def);
  const width = Math.max(...rows.map((r) => r.length), 1);
  return rows.map((r) => r.padEnd(width, "."));
}

function fallbackPixelRows(def) {
  const wide = (def?.width || 1) >= (def?.height || 1);
  if (wide) {
    return [
      ".AAAAAAAA.",
      "ABBBBBBBBA",
      "ABCCCCCCBA",
      "ABCCCCCCBA",
      "ABBBBBBBBA",
      ".AA....AA.",
      ".AA....AA.",
      ".........."
    ];
  }
  return [
    ".AAAAAA.",
    "ABBBBBBA",
    "ABCCCCBA",
    "ABCCCCBA",
    "ABCCCCBA",
    "ABCCCCBA",
    "ABBBBBBA",
    ".AAAAAA."
  ];
}

function renderFurniturePixelArt(model, furn, def, selected) {
  const cs = app.state.grid.cellSize;
  const w = (def?.width || 1) * cs;
  const h = (def?.height || 1) * cs;
  const left = furn.x - w / 2;
  const top = furn.y - h / 2;
  const rows = normalizedPixelRowsForFurniture(furn.furnitureId, def);
  const rowCount = rows.length;
  const colCount = rows[0]?.length || 1;
  const cellW = w / colCount;
  const cellH = h / rowCount;

  const pixels = createSvg("g", { "shape-rendering": "crispEdges" });
  pixels.dataset.kind = "furniture";
  pixels.dataset.id = furn.id;

  for (let y = 0; y < rowCount; y += 1) {
    const row = rows[y];
    for (let x = 0; x < colCount; x += 1) {
      const key = row[x];
      const color = FURNITURE_PIXEL_PALETTE[key];
      if (!color) continue;
      const px = createSvg("rect", {
        x: left + x * cellW,
        y: top + y * cellH,
        width: cellW + 0.05,
        height: cellH + 0.05,
        fill: color,
        class: "furniture-pixel-cell"
      });
      px.dataset.kind = "furniture";
      px.dataset.id = furn.id;
      pixels.appendChild(px);
    }
  }

  const frame = createSvg("rect", {
    x: left,
    y: top,
    width: w,
    height: h,
    fill: "none",
    stroke: "#334155",
    "stroke-width": Math.max(1, cs * 0.06),
    class: selected ? "selected furniture-pixel-frame" : "furniture-pixel-frame"
  });
  frame.dataset.kind = "furniture";
  frame.dataset.id = furn.id;
  pixels.appendChild(frame);

  model.appendChild(pixels);
}

function renderScene() {
  ui.sceneLayer.innerHTML = "";
  const layer = getActiveLayer();
  if (!layer) return;

  const zonesG = createSvg("g", {});
  const floorsG = createSvg("g", {});
  const vectorsG = createSvg("g", {});
  const furnitureG = createSvg("g", {});
  const nodesG = createSvg("g", {});

  floorsG.appendChild(buildFloorPatternDefs());
  for (const floor of layer.floors || []) {
    if (floor.visible === false) continue;
    const shape = createFloorShapeElement(layer, floor);
    if (!shape) continue;
    shape.dataset.kind = "floor";
    shape.dataset.id = floor.id;
    if (isSelected("floor", floor.id)) shape.classList.add("selected");
    floorsG.appendChild(shape);
  }

  if (app.view.showZones) for (const zone of layer.zones) {
    if (zone.visible === false) continue;
    const shape = createZoneShapeElement(layer, zone);
    if (!shape) continue;
    shape.dataset.kind = "zone";
    shape.dataset.id = zone.id;
    if (isSelected("zone", zone.id)) shape.classList.add("selected");
    zonesG.appendChild(shape);

    const center = zoneLabelPosition(layer, zone);
    if (center) {
      const label = createSvg("text", {
        x: center.x,
        y: center.y,
        class: "zone-label"
      });
      label.textContent = zone.name || "Zone";
      zonesG.appendChild(label);
    }
  }

  for (const vector of layer.vectors) {
    const a = getNode(layer, vector.a);
    const b = getNode(layer, vector.b);
    if (!a || !b) continue;
    const group = buildVectorVisualGroup(vector, a, b);
    vectorsG.appendChild(group);
  }

  for (const furn of layer.furniture) {
    const def = furnitureDef(furn.furnitureId);
    const cs = app.state.grid.cellSize;
    const w = (def?.width || 1) * cs;
    const h = (def?.height || 1) * cs;

    const g = createSvg("g", {});
    g.dataset.kind = "furniture";
    g.dataset.id = furn.id;

    const model = createSvg("g", {
      transform: `rotate(${normalizeAngle(furn.rotation)} ${furn.x} ${furn.y})`
    });
    renderFurniturePixelArt(model, furn, def, isSelected("furniture", furn.id));
    g.appendChild(model);

    const txt = createSvg("text", {
      x: furn.x,
      y: furn.y + h / 2 + 10,
      "text-anchor": "middle",
      "font-size": 8,
      fill: "#0f172a",
      "pointer-events": "none"
    });
    txt.textContent = (def?.label || furn.furnitureId || "?").slice(0, 12);
    g.appendChild(txt);

    const centerHandle = createSvg("circle", {
      cx: furn.x,
      cy: furn.y,
      r: 3.2,
      class: "furniture-center-handle"
    });
    centerHandle.dataset.kind = "furniture";
    centerHandle.dataset.id = furn.id;
    g.appendChild(centerHandle);

    furnitureG.appendChild(g);
  }

  for (const node of layer.nodes) {
    const isNodeSelected = isSelected("node", node.id);
    if (isNodeSelected) {
      const ring = createSvg("circle", {
        cx: node.x,
        cy: node.y,
        r: 9,
        class: "node-selected-ring"
      });
      const anim = createSvg("animateTransform", {
        attributeName: "transform",
        type: "rotate",
        from: `0 ${node.x} ${node.y}`,
        to: `360 ${node.x} ${node.y}`,
        dur: "2.2s",
        repeatCount: "indefinite"
      });
      ring.appendChild(anim);
      nodesG.appendChild(ring);
    }

    const circle = createSvg("circle", {
      cx: node.x,
      cy: node.y,
      r: 4.5,
      fill: isNodeSelected ? "#2563eb" : "#1e293b",
      stroke: "#fff",
      "stroke-width": 1.4
    });
    circle.dataset.kind = "node";
    circle.dataset.id = node.id;
    if (isNodeSelected) circle.classList.add("selected");
    nodesG.appendChild(circle);
  }

  ui.sceneLayer.append(floorsG, zonesG, vectorsG, furnitureG, nodesG);
}

function renderOverlay() {
  ui.overlayLayer.innerHTML = "";
  const layer = getActiveLayer();

  if (layer && app.transient.pendingVectorNodeId) {
    const start = getNode(layer, app.transient.pendingVectorNodeId);
    const hover = app.transient.hoverPoint;
    if (start && hover) {
      const p = maybeSnap(hover);
      const line = createSvg("line", {
        x1: start.x,
        y1: start.y,
        x2: p.x,
        y2: p.y,
        stroke: "#10b981",
        "stroke-width": 2,
        "stroke-dasharray": "6,4"
      });
      ui.overlayLayer.appendChild(line);
    }
  }

  if (layer && app.tool === "zone" && app.transient.pendingZoneAnchors.length) {
    const points = app.transient.pendingZoneAnchors
      .map((a) => anchorToPoint(layer, a))
      .filter(Boolean);

    const hover = app.transient.hoverPoint;
    if (hover) {
      points.push(snapToGrid(hover));
    }

    if (isVectorLassoShape(app.zoneShape) && points.length >= 2) {
      const poly = createSvg("polyline", {
        points: points.map((p) => `${p.x},${p.y}`).join(" "),
        fill: "none",
        stroke: "#0ea5e9",
        "stroke-width": 1.5,
        "stroke-dasharray": "5,4"
      });
      ui.overlayLayer.appendChild(poly);
    }

    if ((app.zoneShape === "rect" || app.zoneShape === "ellipse") && points.length >= 2) {
      const p0 = points[0];
      const p1 = points[1];
      if (app.zoneShape === "rect") {
        ui.overlayLayer.appendChild(createSvg("rect", {
          x: Math.min(p0.x, p1.x),
          y: Math.min(p0.y, p1.y),
          width: Math.abs(p1.x - p0.x),
          height: Math.abs(p1.y - p0.y),
          fill: "rgba(56,189,248,0.14)",
          stroke: "#0284c7",
          "stroke-dasharray": "4,3"
        }));
      } else {
        ui.overlayLayer.appendChild(createSvg("ellipse", {
          cx: (p0.x + p1.x) / 2,
          cy: (p0.y + p1.y) / 2,
          rx: Math.abs(p1.x - p0.x) / 2,
          ry: Math.abs(p1.y - p0.y) / 2,
          fill: "rgba(56,189,248,0.14)",
          stroke: "#0284c7",
          "stroke-dasharray": "4,3"
        }));
      }
    }

    for (const p of points) {
      ui.overlayLayer.appendChild(createSvg("circle", {
        cx: p.x,
        cy: p.y,
        r: 3,
        fill: "#0ea5e9"
      }));
    }
  }

  if (layer && app.tool === "floor" && app.transient.pendingFloorAnchors.length) {
    const points = app.transient.pendingFloorAnchors
      .map((a) => anchorToPoint(layer, a))
      .filter(Boolean);

    const hover = app.transient.hoverPoint;
    if (hover) points.push(snapToGrid(hover));

    if (isVectorLassoShape(app.zoneShape) && points.length >= 2) {
      ui.overlayLayer.appendChild(createSvg("polyline", {
        points: points.map((p) => `${p.x},${p.y}`).join(" "),
        fill: "none",
        stroke: "#7c3aed",
        "stroke-width": 1.5,
        "stroke-dasharray": "5,4"
      }));
    }

    if ((app.zoneShape === "rect" || app.zoneShape === "ellipse") && points.length >= 2) {
      const p0 = points[0];
      const p1 = points[1];
      if (app.zoneShape === "rect") {
        ui.overlayLayer.appendChild(createSvg("rect", {
          x: Math.min(p0.x, p1.x),
          y: Math.min(p0.y, p1.y),
          width: Math.abs(p1.x - p0.x),
          height: Math.abs(p1.y - p0.y),
          fill: "rgba(124,58,237,0.12)",
          stroke: "#7c3aed",
          "stroke-dasharray": "4,3"
        }));
      } else {
        ui.overlayLayer.appendChild(createSvg("ellipse", {
          cx: (p0.x + p1.x) / 2,
          cy: (p0.y + p1.y) / 2,
          rx: Math.abs(p1.x - p0.x) / 2,
          ry: Math.abs(p1.y - p0.y) / 2,
          fill: "rgba(124,58,237,0.12)",
          stroke: "#7c3aed",
          "stroke-dasharray": "4,3"
        }));
      }
    }
  }

  if (app.transient.lasso?.points?.length) {
    const points = app.transient.lasso.points;
    ui.overlayLayer.appendChild(createSvg("polyline", {
      points: points.map((p) => `${p.x},${p.y}`).join(" "),
      fill: "none",
      stroke: app.transient.lasso.targetKind === "floor" ? "#7c3aed" : "#0ea5e9",
      "stroke-width": 1.6,
      "stroke-dasharray": "5,4"
    }));
  }

  if (app.transient.selectionRect) {
    const r = app.transient.selectionRect;
    ui.overlayLayer.appendChild(createSvg("rect", {
      x: Math.min(r.x0, r.x1),
      y: Math.min(r.y0, r.y1),
      width: Math.abs(r.x1 - r.x0),
      height: Math.abs(r.y1 - r.y0),
      fill: "rgba(15,118,110,0.08)",
      stroke: "#0f766e",
      "stroke-width": 1,
      "stroke-dasharray": "4,4"
    }));
  }
}

function createZoneShapeElement(layer, zone) {
  const points = zoneResolvedPoints(layer, zone);
  if (!points.length) return null;

  if (zone.shapeType === "rect") {
    if (points.length < 2) return null;
    const p0 = points[0];
    const p1 = points[1];
    return createSvg("rect", {
      x: Math.min(p0.x, p1.x),
      y: Math.min(p0.y, p1.y),
      width: Math.abs(p1.x - p0.x),
      height: Math.abs(p1.y - p0.y),
      fill: zone.fill || "rgba(56,189,248,0.22)",
      stroke: zone.stroke || "#0284c7",
      "stroke-width": 1.3
    });
  }

  if (zone.shapeType === "ellipse") {
    if (points.length < 2) return null;
    const p0 = points[0];
    const p1 = points[1];
    return createSvg("ellipse", {
      cx: (p0.x + p1.x) / 2,
      cy: (p0.y + p1.y) / 2,
      rx: Math.abs(p1.x - p0.x) / 2,
      ry: Math.abs(p1.y - p0.y) / 2,
      fill: zone.fill || "rgba(56,189,248,0.22)",
      stroke: zone.stroke || "#0284c7",
      "stroke-width": 1.3
    });
  }

  if (zone.shapeType === "polygon" || zone.shapeType === "lasso" || zone.shapeType === "vector_lasso") {
    if (points.length < 3) return null;
    return createSvg("polygon", {
      points: points.map((p) => `${p.x},${p.y}`).join(" "),
      fill: zone.fill || "rgba(56,189,248,0.22)",
      stroke: zone.stroke || "#0284c7",
      "stroke-width": 1.3
    });
  }

  return null;
}

function createFloorShapeElement(layer, floor) {
  const points = floorResolvedPoints(layer, floor);
  if (!points.length) return null;
  const fill = `url(#floor-${escapeAttr(floor.textureId || "stone")})`;

  if (floor.shapeType === "rect") {
    if (points.length < 2) return null;
    const p0 = points[0];
    const p1 = points[1];
    return createSvg("rect", {
      x: Math.min(p0.x, p1.x),
      y: Math.min(p0.y, p1.y),
      width: Math.abs(p1.x - p0.x),
      height: Math.abs(p1.y - p0.y),
      fill,
      opacity: clamp(Number(floor.opacity) || 1, 0.1, 1),
      stroke: "#64748b",
      "stroke-width": 0.8
    });
  }

  if (floor.shapeType === "ellipse") {
    if (points.length < 2) return null;
    const p0 = points[0];
    const p1 = points[1];
    return createSvg("ellipse", {
      cx: (p0.x + p1.x) / 2,
      cy: (p0.y + p1.y) / 2,
      rx: Math.abs(p1.x - p0.x) / 2,
      ry: Math.abs(p1.y - p0.y) / 2,
      fill,
      opacity: clamp(Number(floor.opacity) || 1, 0.1, 1),
      stroke: "#64748b",
      "stroke-width": 0.8
    });
  }

  if (floor.shapeType === "polygon" || floor.shapeType === "lasso" || floor.shapeType === "vector_lasso") {
    if (points.length < 3) return null;
    return createSvg("polygon", {
      points: points.map((p) => `${p.x},${p.y}`).join(" "),
      fill,
      opacity: clamp(Number(floor.opacity) || 1, 0.1, 1),
      stroke: "#64748b",
      "stroke-width": 0.8
    });
  }

  return null;
}

function buildFloorPatternDefs() {
  const defs = createSvg("defs", {});
  const patterns = [
    { id: "stone", size: 24, body: "<rect width='24' height='24' fill='#d1d5db'/><path d='M0 8H24M8 0V24M16 0V24' stroke='#9ca3af' stroke-width='1'/><circle cx='6' cy='6' r='1' fill='#6b7280'/>" },
    { id: "wood", size: 24, body: "<rect width='24' height='24' fill='#c08457'/><path d='M0 6H24M0 12H24M0 18H24' stroke='#8b5e34' stroke-width='1.6'/><path d='M6 0V24M18 0V24' stroke='#b07a42' stroke-width='0.8'/>" },
    { id: "sand", size: 18, body: "<rect width='18' height='18' fill='#f4d69a'/><circle cx='4' cy='5' r='1' fill='#d4a94f'/><circle cx='12' cy='8' r='1' fill='#d4a94f'/><circle cx='7' cy='13' r='1' fill='#e1b766'/>" },
    { id: "carpet_red", size: 20, body: "<rect width='20' height='20' fill='#991b1b'/><path d='M0 5H20M0 15H20M5 0V20M15 0V20' stroke='#fca5a5' stroke-width='0.8' opacity='0.7'/>" },
    { id: "carpet_blue", size: 20, body: "<rect width='20' height='20' fill='#1e3a8a'/><path d='M0 5H20M0 15H20M5 0V20M15 0V20' stroke='#93c5fd' stroke-width='0.8' opacity='0.7'/>" },
    { id: "tiles", size: 20, body: "<rect width='20' height='20' fill='#e5e7eb'/><path d='M0 10H20M10 0V20' stroke='#94a3b8' stroke-width='1'/><rect x='1' y='1' width='8' height='8' fill='#f8fafc' opacity='0.7'/>" }
  ];
  for (const p of patterns) {
    const pattern = createSvg("pattern", {
      id: `floor-${p.id}`,
      width: p.size,
      height: p.size,
      patternUnits: "userSpaceOnUse"
    });
    pattern.innerHTML = p.body;
    defs.appendChild(pattern);
  }
  return defs;
}

function zoneResolvedPoints(layer, zone) {
  const pts = [];
  for (const a of zone.anchors || []) {
    const p = anchorToPoint(layer, a);
    if (p) pts.push(p);
  }
  return pts;
}

function floorResolvedPoints(layer, floor) {
  const pts = [];
  for (const a of floor.anchors || []) {
    const p = anchorToPoint(layer, a);
    if (p) pts.push(p);
  }
  return pts;
}

function anchorToPoint(layer, anchor) {
  if (anchor.type === "gridPoint") return { x: anchor.x, y: anchor.y };
  if (anchor.type === "nodeRef") {
    const node = getNode(layer, anchor.nodeId);
    if (!node) return null;
    return { x: node.x, y: node.y };
  }
  return null;
}

function zoneLabelPosition(layer, zone) {
  const points = zoneResolvedPoints(layer, zone);
  if (!points.length) return null;

  if (zone.shapeType === "rect" || zone.shapeType === "ellipse") {
    if (points.length < 2) return null;
    return { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
  }

  let sx = 0;
  let sy = 0;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
  }
  return { x: sx / points.length, y: sy / points.length };
}

function zoneBoundingBox(layer, zone) {
  const points = zoneResolvedPoints(layer, zone);
  if (!points.length) return null;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys)
  };
}

function floorBoundingBox(layer, floor) {
  const points = floorResolvedPoints(layer, floor);
  if (!points.length) return null;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys)
  };
}

function isPointInZone(layer, zone, p) {
  const points = zoneResolvedPoints(layer, zone);
  if (!points.length) return false;

  if (zone.shapeType === "rect") {
    const bb = zoneBoundingBox(layer, zone);
    return !!bb && p.x >= bb.minX && p.x <= bb.maxX && p.y >= bb.minY && p.y <= bb.maxY;
  }

  if (zone.shapeType === "ellipse") {
    if (points.length < 2) return false;
    const cx = (points[0].x + points[1].x) / 2;
    const cy = (points[0].y + points[1].y) / 2;
    const rx = Math.abs(points[1].x - points[0].x) / 2;
    const ry = Math.abs(points[1].y - points[0].y) / 2;
    if (!rx || !ry) return false;
    const dx = (p.x - cx) / rx;
    const dy = (p.y - cy) / ry;
    return dx * dx + dy * dy <= 1;
  }

  if (zone.shapeType === "polygon" || zone.shapeType === "lasso" || zone.shapeType === "vector_lasso") {
    return pointInPolygon(points, p);
  }

  return false;
}

function isPointInFloor(layer, floor, p) {
  const points = floorResolvedPoints(layer, floor);
  if (!points.length) return false;

  if (floor.shapeType === "rect") {
    const bb = floorBoundingBox(layer, floor);
    return !!bb && p.x >= bb.minX && p.x <= bb.maxX && p.y >= bb.minY && p.y <= bb.maxY;
  }

  if (floor.shapeType === "ellipse") {
    if (points.length < 2) return false;
    const cx = (points[0].x + points[1].x) / 2;
    const cy = (points[0].y + points[1].y) / 2;
    const rx = Math.abs(points[1].x - points[0].x) / 2;
    const ry = Math.abs(points[1].y - points[0].y) / 2;
    if (!rx || !ry) return false;
    const dx = (p.x - cx) / rx;
    const dy = (p.y - cy) / ry;
    return dx * dx + dy * dy <= 1;
  }

  if (floor.shapeType === "polygon" || floor.shapeType === "lasso" || floor.shapeType === "vector_lasso") {
    return pointInPolygon(points, p);
  }
  return false;
}

function pointInPolygon(points, point) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function isSelected(kind, id) {
  return app.selection.some((s) => s.kind === kind && s.id === id);
}

function renderPanels() {
  ui.tabs.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === app.activeTab));
  ui.tabProperties.classList.toggle("active", app.activeTab === "properties");
  ui.tabZones.classList.toggle("active", app.activeTab === "zones");
  ui.tabLayers.classList.toggle("active", app.activeTab === "layers");

  renderPropertiesPanel();
  renderZonesPanel();
  renderLayersPanel();
}

function renderPropertiesPanel() {
  const layer = getActiveLayer();
  if (!layer) {
    ui.tabProperties.innerHTML = `<div class="section">Aucun layer actif.</div>`;
    return;
  }

  if (app.selection.length !== 1) {
    ui.tabProperties.innerHTML = `
      <div class="section">
        <h4>État</h4>
        <div class="hint">
          Layer actif: <strong>${escapeHtml(layer.name)}</strong><br>
          Sélection: <strong>${app.selection.length}</strong> élément(s)<br>
          Outil: <strong>${escapeHtml(app.tool)}</strong><br>
          Zoom: <strong>${Math.round((app.view.zoom / ZOOM_BASELINE) * 100)}%</strong>
        </div>
      </div>
      <div class="section hint">
        Raccourcis: <span class="kbd">Shift+clic</span> multi-sélection, <span class="kbd">Espace+drag</span> pan, molette pour zoom.
      </div>
    `;
    return;
  }

  const sel = app.selection[0];

  if (sel.kind === "vector") {
    const v = layer.vectors.find((x) => x.id === sel.id);
    if (!v) return;
    const openings = normalizeVectorOpenings(v.openings);
    v.openings = openings;

    ui.tabProperties.innerHTML = `
      <div class="section">
        <h4>Vecteur</h4>
        <div class="row"><label>Type</label><select id="propVectorType">${VECTOR_TYPES.map((t) => `<option value="${t}" ${t === v.type ? "selected" : ""}>${t}</option>`).join("")}</select></div>
        <div class="row"><label>Style de mur</label><select id="propVectorStyle">${WALL_STYLES.map((s) => `<option value="${s.id}" ${s.id === (v.wallStyle || "pencil") ? "selected" : ""}>${s.label}</option>`).join("")}</select></div>
        <div class="row"><label>Épaisseur</label><input id="propVectorThickness" type="number" min="1" max="40" step="1" value="${Number(v.thickness) || 1}"></div>
        <div class="row single"><input id="propVectorThicknessRange" type="range" min="1" max="40" step="1" value="${Number(v.thickness) || 1}"></div>
        <div class="row"><label>Couleur</label><input id="propVectorColor" type="color" value="${toHexColor(v.color)}"></div>
        <div class="row single"><button id="propDeleteEntity" class="danger">Supprimer ce vecteur</button></div>
      </div>

      <div class="section">
        <h4>Portes / Fenêtres Sur Mur</h4>
        <div class="row">
          <button id="propAddDoor">+ Porte</button>
          <button id="propAddWindow">+ Fenêtre</button>
        </div>
        <div class="hint">Ajoute des inserts sur le vecteur sélectionné puis réorganise leur ordre.</div>
        <div id="propOpeningsList" class="row single" style="margin-top:8px">
          ${
            openings.length
              ? openings.map((o, idx) => `
                <div class="row" style="grid-template-columns: auto 1fr auto auto auto; margin-bottom:6px; background:#eef2f7; border:1px solid #dbe3ee; padding:6px; border-radius:6px;">
                  <span>${o.kind === "door" ? "🚪" : "🪟"}</span>
                  <span>${o.kind === "door" ? "Porte" : "Fenêtre"} ${idx + 1}</span>
                  <button data-open-up="${o.id}" ${idx === 0 ? "disabled" : ""}>↑</button>
                  <button data-open-down="${o.id}" ${idx === openings.length - 1 ? "disabled" : ""}>↓</button>
                  <button data-open-del="${o.id}" class="danger">✕</button>
                </div>
              `).join("")
              : `<div class="hint">Aucune porte/fenêtre sur ce mur.</div>`
          }
        </div>
      </div>
    `;

    document.getElementById("propVectorType").addEventListener("change", (e) => mutate(() => { v.type = e.target.value; }));
    document.getElementById("propVectorStyle").addEventListener("change", (e) => mutate(() => { v.wallStyle = e.target.value; }));
    document.getElementById("propVectorThickness").addEventListener("change", (e) => mutate(() => { v.thickness = clamp(Number(e.target.value) || 1, 1, 40); }));
    document.getElementById("propVectorThicknessRange").addEventListener("input", (e) => {
      const val = clamp(Number(e.target.value) || 1, 1, 40);
      document.getElementById("propVectorThickness").value = String(val);
      mutate(() => { v.thickness = val; });
    });
    document.getElementById("propVectorColor").addEventListener("change", (e) => mutate(() => { v.color = e.target.value; }));
    document.getElementById("propAddDoor").addEventListener("click", () => mutate(() => addVectorOpening(v, "door")));
    document.getElementById("propAddWindow").addEventListener("click", () => mutate(() => addVectorOpening(v, "window")));

    [...ui.tabProperties.querySelectorAll("[data-open-up]")].forEach((btn) => {
      btn.addEventListener("click", () => mutate(() => moveVectorOpening(v, btn.dataset.openUp, -1)));
    });
    [...ui.tabProperties.querySelectorAll("[data-open-down]")].forEach((btn) => {
      btn.addEventListener("click", () => mutate(() => moveVectorOpening(v, btn.dataset.openDown, 1)));
    });
    [...ui.tabProperties.querySelectorAll("[data-open-del]")].forEach((btn) => {
      btn.addEventListener("click", () => mutate(() => removeVectorOpening(v, btn.dataset.openDel)));
    });
    document.getElementById("propDeleteEntity").addEventListener("click", () => {
      mutate(() => deleteEntity({ kind: "vector", id: v.id }));
    });
    return;
  }

  if (sel.kind === "node") {
    const n = layer.nodes.find((x) => x.id === sel.id);
    if (!n) return;
    const connected = layer.vectors.filter((v) => v.a === n.id || v.b === n.id).length;

    ui.tabProperties.innerHTML = `
      <div class="section">
        <h4>Node</h4>
        <div class="row"><label>X</label><input id="propNodeX" type="number" step="1" value="${Math.round(n.x)}"></div>
        <div class="row"><label>Y</label><input id="propNodeY" type="number" step="1" value="${Math.round(n.y)}"></div>
        <div class="row single"><span class="hint">Vecteurs connectés: <strong>${connected}</strong></span></div>
        <div class="row single"><button id="propDeleteEntity" class="danger">Supprimer ce node</button></div>
      </div>
    `;

    document.getElementById("propNodeX").addEventListener("change", (e) => mutate(() => { n.x = Number(e.target.value) || 0; }));
    document.getElementById("propNodeY").addEventListener("change", (e) => mutate(() => { n.y = Number(e.target.value) || 0; }));
    document.getElementById("propDeleteEntity").addEventListener("click", () => {
      mutate(() => deleteEntity({ kind: "node", id: n.id }));
    });
    return;
  }

  if (sel.kind === "opening") {
    const ref = findOpeningInLayer(layer, sel.id);
    if (!ref) return;
    const { vector, opening } = ref;

    ui.tabProperties.innerHTML = `
      <div class="section">
        <h4>Ouverture</h4>
        <div class="row"><label>Type</label><select id="propOpeningKind"><option value="door" ${opening.kind === "door" ? "selected" : ""}>Porte</option><option value="window" ${opening.kind === "window" ? "selected" : ""}>Fenêtre</option></select></div>
        <div class="row"><label>Largeur</label><input id="propOpeningWidth" type="number" min="0.4" max="3" step="0.1" value="${clamp(Number(opening.widthCells) || 1, 0.4, 3)}"></div>
        <div class="row"><label>Position</label><input id="propOpeningT" type="range" min="0.05" max="0.95" step="0.01" value="${clamp(Number(opening.t) || 0.5, 0.05, 0.95)}"></div>
        <div class="row"><label>Vecteur</label><input value="${escapeAttr(vector.id)}" readonly></div>
        <div class="row single"><button id="propDeleteEntity" class="danger">Supprimer cette ouverture</button></div>
      </div>
    `;

    document.getElementById("propOpeningKind").addEventListener("change", (e) => mutate(() => {
      const r = findOpeningInLayer(layer, opening.id);
      if (!r) return;
      r.opening.kind = e.target.value === "door" ? "door" : "window";
      r.vector.openings = normalizeVectorOpenings(r.vector.openings).sort((a, b) => a.t - b.t);
    }));
    document.getElementById("propOpeningWidth").addEventListener("change", (e) => mutate(() => {
      const r = findOpeningInLayer(layer, opening.id);
      if (!r) return;
      r.opening.widthCells = clamp(Number(e.target.value) || 1, 0.4, 3);
      r.vector.openings = normalizeVectorOpenings(r.vector.openings).sort((a, b) => a.t - b.t);
    }));
    document.getElementById("propOpeningT").addEventListener("input", (e) => mutate(() => {
      const r = findOpeningInLayer(layer, opening.id);
      if (!r) return;
      r.opening.t = clamp(Number(e.target.value) || 0.5, 0.05, 0.95);
      r.vector.openings = normalizeVectorOpenings(r.vector.openings).sort((a, b) => a.t - b.t);
    }));
    document.getElementById("propDeleteEntity").addEventListener("click", () => {
      mutate(() => deleteEntity({ kind: "opening", id: opening.id }));
    });
    return;
  }

  if (sel.kind === "furniture") {
    const f = layer.furniture.find((x) => x.id === sel.id);
    if (!f) return;
    const def = furnitureDef(f.furnitureId);

    ui.tabProperties.innerHTML = `
      <div class="section">
        <h4>Meuble</h4>
        <div class="row"><label>Nom</label><input value="${escapeAttr(def?.label || f.furnitureId)}" readonly></div>
        <div class="row"><label>Rotation</label><input id="propFurnitureRot" type="number" min="0" max="359" step="1" value="${normalizeAngle(f.rotation)}"></div>
        <div class="row"><label>Layer</label><input value="${escapeAttr(layer.name)}" readonly></div>
        <div class="row single"><button id="propDeleteEntity" class="danger">Supprimer ce meuble</button></div>
      </div>
    `;

    document.getElementById("propFurnitureRot").addEventListener("change", (e) => {
      mutate(() => { f.rotation = normalizeAngle(Number(e.target.value) || 0); });
    });
    document.getElementById("propDeleteEntity").addEventListener("click", () => {
      mutate(() => deleteEntity({ kind: "furniture", id: f.id }));
    });
    return;
  }

  if (sel.kind === "zone") {
    const z = layer.zones.find((x) => x.id === sel.id);
    if (!z) return;

    ui.tabProperties.innerHTML = `
      <div class="section">
        <h4>Zone</h4>
        <div class="row"><label>Nom</label><input id="propZoneName" value="${escapeAttr(z.name || "")}"></div>
        <div class="row"><label>Type pièce</label><select id="propZoneRoomType">${ROOM_TYPES.map((r) => `<option value="${r.id}" ${r.id === z.roomType ? "selected" : ""}>${r.label}</option>`).join("")}</select></div>
        <div class="row"><label>Couleur fond</label><input id="propZoneFill" type="color" value="${toHexColor(z.fill)}"></div>
        <div class="row"><label>Couleur contour</label><input id="propZoneStroke" type="color" value="${toHexColor(z.stroke)}"></div>
        <div class="row"><label>Layer</label><input value="${escapeAttr(layer.name)}" readonly></div>
        <div class="row single"><button id="propZoneAuto">Auto-meubler cette zone</button></div>
        <div class="row single"><button id="propDeleteEntity" class="danger">Supprimer cette zone</button></div>
      </div>
    `;

    document.getElementById("propZoneName").addEventListener("change", (e) => mutate(() => { z.name = e.target.value || z.name; }));
    document.getElementById("propZoneRoomType").addEventListener("change", (e) => mutate(() => { z.roomType = e.target.value; }));
    document.getElementById("propZoneFill").addEventListener("change", (e) => mutate(() => { z.fill = e.target.value; }));
    document.getElementById("propZoneStroke").addEventListener("change", (e) => mutate(() => { z.stroke = e.target.value; }));
    document.getElementById("propZoneAuto").addEventListener("click", () => mutate(() => autoFurnishZone(layer, z, z.roomType || ui.autoRoomType.value)));
    document.getElementById("propDeleteEntity").addEventListener("click", () => {
      mutate(() => deleteEntity({ kind: "zone", id: z.id }));
    });
    return;
  }

  if (sel.kind === "floor") {
    const fl = (layer.floors || []).find((x) => x.id === sel.id);
    if (!fl) return;
    const textures = [
      ["stone", "Pierre"],
      ["wood", "Plancher"],
      ["sand", "Sable"],
      ["carpet_red", "Tapis rouge"],
      ["carpet_blue", "Tapis bleu"],
      ["tiles", "Carrelage"]
    ];

    ui.tabProperties.innerHTML = `
      <div class="section">
        <h4>Sol</h4>
        <div class="row"><label>Nom</label><input id="propFloorName" value="${escapeAttr(fl.name || fl.id)}"></div>
        <div class="row"><label>Texture</label><select id="propFloorTexture">${textures.map(([id, label]) => `<option value="${id}" ${id === (fl.textureId || "stone") ? "selected" : ""}>${label}</option>`).join("")}</select></div>
        <div class="row"><label>Opacité</label><input id="propFloorOpacity" type="range" min="0.1" max="1" step="0.05" value="${clamp(Number(fl.opacity) || 1, 0.1, 1)}"></div>
        <div class="row"><label>Visible</label><select id="propFloorVisible"><option value="1" ${fl.visible === false ? "" : "selected"}>Oui</option><option value="0" ${fl.visible === false ? "selected" : ""}>Non</option></select></div>
        <div class="row"><label>Layer</label><input value="${escapeAttr(layer.name)}" readonly></div>
        <div class="row single"><button id="propDeleteEntity" class="danger">Supprimer ce sol</button></div>
      </div>
    `;

    document.getElementById("propFloorName").addEventListener("change", (e) => mutate(() => {
      fl.name = e.target.value || fl.name || fl.id;
    }));
    document.getElementById("propFloorTexture").addEventListener("change", (e) => mutate(() => {
      fl.textureId = e.target.value;
    }));
    document.getElementById("propFloorOpacity").addEventListener("input", (e) => mutate(() => {
      fl.opacity = clamp(Number(e.target.value) || 1, 0.1, 1);
    }));
    document.getElementById("propFloorVisible").addEventListener("change", (e) => mutate(() => {
      fl.visible = e.target.value === "1";
    }));
    document.getElementById("propDeleteEntity").addEventListener("click", () => {
      mutate(() => deleteEntity({ kind: "floor", id: fl.id }));
    });
    return;
  }
}

function renderZonesPanel() {
  const layer = getActiveLayer();
  if (!layer) {
    ui.tabZones.innerHTML = "";
    return;
  }

  const zones = layer.zones;
  const rows = zones.map((z) => {
    const label = ROOM_TYPES.find((r) => r.id === z.roomType)?.label || z.roomType || "non défini";
    return `
      <div class="section">
        <div><strong>${escapeHtml(z.name || z.id)}</strong></div>
        <div class="muted">${escapeHtml(label)} · ${escapeHtml(z.shapeType)}</div>
        <div class="row" style="grid-template-columns: 1fr 1fr; margin-top:6px;">
          <span class="muted">Layer</span>
          <span>${escapeHtml(layer.name)}</span>
        </div>
        <div class="row" style="grid-template-columns: 1fr 1fr;">
          <span class="muted">Couleur</span>
          <span style="display:inline-flex; width:26px; height:14px; border-radius:4px; background:${escapeAttr(z.fill || "rgba(56,189,248,0.22)")}; border:2px solid ${escapeAttr(z.stroke || "#0284c7")}"></span>
        </div>
        <div class="row" style="grid-template-columns: auto auto; gap:6px; margin-top:8px;">
          <button class="btn-mini" data-zone-select="${escapeAttr(z.id)}">Sélectionner</button>
          <button class="btn-mini" data-zone-auto="${escapeAttr(z.id)}">Auto-meubler</button>
        </div>
      </div>
    `;
  }).join("");

  ui.tabZones.innerHTML = `
    <div class="section">
      <h4>Zones du layer actif</h4>
      <div class="hint">${zones.length} zone(s)</div>
    </div>
    ${rows || `<div class="section hint">Aucune zone.</div>`}
  `;

  [...ui.tabZones.querySelectorAll("[data-zone-select]")].forEach((btn) => {
    btn.addEventListener("click", () => {
      app.selection = [{ kind: "zone", id: btn.dataset.zoneSelect }];
      app.activeTab = "properties";
      renderAll();
    });
  });

  [...ui.tabZones.querySelectorAll("[data-zone-auto]")].forEach((btn) => {
    btn.addEventListener("click", () => {
      const z = layer.zones.find((zone) => zone.id === btn.dataset.zoneAuto);
      if (!z) return;
      mutate(() => autoFurnishZone(layer, z, z.roomType || ui.autoRoomType.value));
    });
  });
}

function renderLayersPanel() {
  ui.tabLayers.innerHTML = `
    <div class="section">
      <h4>Gestion Layers / Groups</h4>
      <div class="row single"><button id="btnAddRootLayer">+ Layer racine</button></div>
      <div class="row single"><button id="btnAddRootGroup">+ Group racine</button></div>
    </div>
    <div id="layerTree"></div>
  `;

  const treeContainer = document.getElementById("layerTree");
  renderTreeNodes(app.state.tree, treeContainer, 0);

  document.getElementById("btnAddRootLayer").addEventListener("click", () => {
    mutate(() => addLayer(null));
  });

  document.getElementById("btnAddRootGroup").addEventListener("click", () => {
    mutate(() => addGroup(null));
  });
}

function renderTreeNodes(nodes, container, depth) {
  for (const node of nodes) {
    const wrap = document.createElement("div");
    wrap.className = "tree-item";
    wrap.style.marginLeft = `${depth * 8}px`;

    const head = document.createElement("div");
    head.className = "tree-head";

    const vis = document.createElement("input");
    vis.type = "checkbox";
    vis.checked = node.visible !== false;
    vis.addEventListener("change", () => mutate(() => { node.visible = vis.checked; }));

    const name = document.createElement("span");
    name.className = `name ${node.type === "layer" && app.state.activeLayerId === node.id ? "active" : ""}`;
    name.textContent = node.name;
    name.addEventListener("click", () => {
      if (node.type === "layer") {
        app.state.activeLayerId = node.id;
        app.selection = [];
        app.transient.pendingVectorNodeId = null;
        app.transient.pendingZoneAnchors = [];
        app.transient.pendingFloorAnchors = [];
        app.transient.lasso = null;
        renderAll();
      }
    });

    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = node.type;

    head.append(vis, name, chip);

    if (node.type === "group") {
      const addLayerBtn = document.createElement("button");
      addLayerBtn.textContent = "+L";
      addLayerBtn.title = "Ajouter layer";
      addLayerBtn.addEventListener("click", () => mutate(() => addLayer(node.id)));
      addLayerBtn.style.width = "40px";

      const addGroupBtn = document.createElement("button");
      addGroupBtn.textContent = "+G";
      addGroupBtn.title = "Ajouter group";
      addGroupBtn.addEventListener("click", () => mutate(() => addGroup(node.id)));
      addGroupBtn.style.width = "40px";

      head.append(addLayerBtn, addGroupBtn);
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.title = "Supprimer";
    delBtn.className = "danger";
    delBtn.style.width = "34px";
    delBtn.addEventListener("click", () => mutate(() => removeTreeNode(node.id)));
    head.append(delBtn);

    wrap.appendChild(head);
    container.appendChild(wrap);

    if (node.type === "group") {
      renderTreeNodes(node.children || [], container, depth + 1);
    }
  }
}

function addLayer(parentGroupId) {
  const layer = {
    type: "layer",
    id: uid("layer"),
    name: `Layer ${countLayers(app.state.tree) + 1}`,
    visible: true,
    nodes: [],
    vectors: [],
    furniture: [],
    floors: [],
    zones: []
  };

  if (!parentGroupId) {
    app.state.tree.push(layer);
  } else {
    const found = findTreeNode(parentGroupId);
    if (found && found.node.type === "group") {
      found.node.children = found.node.children || [];
      found.node.children.push(layer);
    }
  }

  app.state.activeLayerId = layer.id;
}

function addGroup(parentGroupId) {
  const group = {
    type: "group",
    id: uid("group"),
    name: `Group ${countGroups(app.state.tree) + 1}`,
    visible: true,
    children: []
  };

  if (!parentGroupId) {
    app.state.tree.push(group);
  } else {
    const found = findTreeNode(parentGroupId);
    if (found && found.node.type === "group") {
      found.node.children = found.node.children || [];
      found.node.children.push(group);
    }
  }
}

function removeTreeNode(nodeId) {
  const ref = findTreeNode(nodeId);
  if (!ref) return;

  if (ref.node.type === "layer") {
    const layerCount = countLayers(app.state.tree);
    if (layerCount <= 1) {
      alert("Impossible de supprimer le dernier layer.");
      return;
    }
  }

  ref.siblings.splice(ref.index, 1);

  const activeLayerStillExists = !!findLayerById(app.state.activeLayerId, app.state.tree);
  if (!activeLayerStillExists) {
    const first = firstLayer(app.state.tree);
    if (first) app.state.activeLayerId = first.id;
  }
}

function countLayers(nodes) {
  let c = 0;
  walkTree(nodes, (node) => { if (node.type === "layer") c += 1; });
  return c;
}

function countGroups(nodes) {
  let c = 0;
  walkTree(nodes, (node) => { if (node.type === "group") c += 1; });
  return c;
}

function autoFurnishSelection() {
  const layer = getActiveLayer();
  if (!layer) return;
  const zoneSel = app.selection.find((s) => s.kind === "zone");
  if (!zoneSel) {
    alert("Sélectionnez d'abord une zone.");
    return;
  }

  const zone = layer.zones.find((z) => z.id === zoneSel.id);
  if (!zone) return;

  const roomType = ui.autoRoomType.value || zone.roomType || "bedroom_single";
  mutate(() => {
    zone.roomType = roomType;
    autoFurnishZone(layer, zone, roomType);
  });
}

function autoFurnishZone(layer, zone, roomType) {
  const layout = ROOM_LAYOUTS[roomType] || ROOM_LAYOUTS.bedroom_single;
  const bbox = zoneBoundingBox(layer, zone);
  if (!bbox) return;

  for (const item of layout) {
    const def = furnitureDef(item.furnitureId);
    if (!def) continue;
    const p = randomPointInZone(layer, zone, bbox, app.view.snap ? 120 : 80);
    if (!p) continue;
    const randomQuarterTurn = [0, 90, 180, 270][Math.floor(Math.random() * 4)];

    layer.furniture.push({
      id: uid("furniture"),
      furnitureId: item.furnitureId,
      x: p.x,
      y: p.y,
      rotation: normalizeAngle((item.rotation ?? def.defaultRotation ?? 0) + randomQuarterTurn),
      layerId: layer.id
    });
  }
}

function randomPointInZone(layer, zone, bbox, maxAttempts) {
  const marginX = Math.max(2, (bbox.maxX - bbox.minX) * 0.03);
  const marginY = Math.max(2, (bbox.maxY - bbox.minY) * 0.03);
  const minX = bbox.minX + marginX;
  const maxX = bbox.maxX - marginX;
  const minY = bbox.minY + marginY;
  const maxY = bbox.maxY - marginY;
  if (minX >= maxX || minY >= maxY) return null;

  for (let i = 0; i < maxAttempts; i += 1) {
    const raw = {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY)
    };
    const p = app.view.snap ? snapToGrid(raw) : raw;
    if (isPointInZone(layer, zone, p)) return p;
  }

  return null;
}

function furnitureDef(furnitureId) {
  return app.state.furnitureLibrary.find((f) => f.id === furnitureId) || null;
}

function handleFurnitureImport(e) {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const incoming = Array.isArray(parsed) ? parsed : [parsed];
      mutate(() => appendFurnitureDefs(incoming));
    } catch (err) {
      alert(`Import meubles impossible: ${err.message}`);
    }
  };
  reader.readAsText(file);
}

function appendFurnitureDefs(incoming) {
  for (const raw of incoming) {
    if (!raw || typeof raw !== "object") continue;
    if (!raw.id) continue;

    const item = {
      id: String(raw.id),
      label: String(raw.label || raw.id),
      category: String(raw.category || "custom"),
      width: Number(raw.width) > 0 ? Number(raw.width) : 1,
      height: Number(raw.height) > 0 ? Number(raw.height) : 1,
      defaultRotation: normalizeAngle(Number(raw.defaultRotation) || 0),
      svg: typeof raw.svg === "string" ? raw.svg : "<rect x='0' y='0' width='100' height='100'/>"
    };

    let finalId = item.id;
    let n = 1;
    while (app.state.furnitureLibrary.some((f) => f.id === finalId)) {
      finalId = `${item.id}_${n++}`;
    }
    item.id = finalId;
    app.state.furnitureLibrary.push(item);
  }
}

function saveBmap() {
  const payload = {
    version: "1.3",
    grid: deepClone(app.state.grid),
    tree: deepClone(app.state.tree),
    furnitureLibrary: deepClone(app.state.furnitureLibrary)
  };
  downloadTextFile(`${slugify(projectName()) || "mansionforge"}.bmap`, JSON.stringify(payload, null, 2));
}

function handleLoadFile(e) {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const normalized = normalizeLoadedProject(parsed);
      pushHistory();
      app.state = normalized;
      app.selection = [];
      app.transient.pendingVectorNodeId = null;
      app.transient.pendingZoneAnchors = [];
      app.transient.pendingFloorAnchors = [];
      app.transient.lasso = null;
      renderAll();
      persistAutosave();
    } catch (err) {
      alert(`Chargement impossible: ${err.message}`);
    }
  };
  reader.readAsText(file);
}

function normalizeLoadedProject(data) {
  if (!data || typeof data !== "object") throw new Error("Fichier invalide");

  const tree = Array.isArray(data.tree) ? data.tree : [];
  if (!tree.length) throw new Error("Aucun layer/group dans tree");

  const normalized = {
    version: "1.3",
    grid: {
      enabled: true,
      cellSize: Math.max(4, Number(data.grid?.cellSize) || 20)
    },
    tree: normalizeTree(tree),
    activeLayerId: "",
    furnitureLibrary: Array.isArray(data.furnitureLibrary) && data.furnitureLibrary.length
      ? data.furnitureLibrary.map((f) => ({
        id: String(f.id || uid("furn")),
        label: String(f.label || f.id || "Furniture"),
        category: String(f.category || "custom"),
        width: Number(f.width) > 0 ? Number(f.width) : 1,
        height: Number(f.height) > 0 ? Number(f.height) : 1,
        defaultRotation: normalizeAngle(Number(f.defaultRotation) || 0),
        svg: typeof f.svg === "string" ? f.svg : "<rect x='0' y='0' width='100' height='100'/>"
      }))
      : deepClone(DEFAULT_FURNITURE)
  };

  const first = firstLayer(normalized.tree);
  if (!first) throw new Error("Aucun layer trouvé");
  normalized.activeLayerId = first.id;
  return normalized;
}

function normalizeTree(nodes) {
  return nodes.map((node) => {
    if (node.type === "group") {
      return {
        type: "group",
        id: String(node.id || uid("group")),
        name: String(node.name || "Group"),
        visible: node.visible !== false,
        children: normalizeTree(Array.isArray(node.children) ? node.children : [])
      };
    }

    return {
      type: "layer",
      id: String(node.id || uid("layer")),
      name: String(node.name || "Layer"),
      visible: node.visible !== false,
      nodes: normalizeArray(node.nodes, (n) => ({
        id: String(n.id || uid("node")),
        x: Number(n.x) || 0,
        y: Number(n.y) || 0,
        layerId: String(node.id || "")
      })),
      vectors: normalizeArray(node.vectors, (v) => ({
        id: String(v.id || uid("vector")),
        a: String(v.a || ""),
        b: String(v.b || ""),
        type: VECTOR_TYPES.includes(v.type) ? v.type : "wall",
        thickness: Math.max(1, Number(v.thickness) || 1),
        color: String(v.color || "#1f2937"),
        wallStyle: WALL_STYLES.some((s) => s.id === v.wallStyle) ? v.wallStyle : "pencil",
        openings: normalizeVectorOpenings(v.openings),
        params: typeof v.params === "object" && v.params ? v.params : {},
        layerId: String(node.id || "")
      })),
      furniture: normalizeArray(node.furniture, (f) => ({
        id: String(f.id || uid("furniture")),
        furnitureId: String(f.furnitureId || ""),
        x: Number(f.x) || 0,
        y: Number(f.y) || 0,
        rotation: normalizeAngle(Number(f.rotation) || 0),
        layerId: String(node.id || "")
      })),
      floors: normalizeArray(node.floors, (fl) => ({
        id: String(fl.id || uid("floor")),
        name: String(fl.name || "Sol"),
        textureId: String(fl.textureId || "stone"),
        shapeType: ["rect", "ellipse", "polygon", "lasso", "vector_lasso"].includes(fl.shapeType) ? fl.shapeType : "polygon",
        anchors: normalizeArray(fl.anchors, (a) => {
          if (a.type === "nodeRef") return { type: "nodeRef", nodeId: String(a.nodeId || "") };
          return { type: "gridPoint", x: Number(a.x) || 0, y: Number(a.y) || 0 };
        }),
        visible: fl.visible !== false,
        opacity: clamp(Number(fl.opacity) || 1, 0.1, 1),
        layerId: String(node.id || "")
      })),
      zones: normalizeArray(node.zones, (z) => ({
        id: String(z.id || uid("zone")),
        name: String(z.name || "Zone"),
        roomType: String(z.roomType || "bedroom_single"),
        shapeType: ["rect", "ellipse", "polygon", "lasso", "vector_lasso"].includes(z.shapeType) ? z.shapeType : "polygon",
        anchors: normalizeArray(z.anchors, (a) => {
          if (a.type === "nodeRef") return { type: "nodeRef", nodeId: String(a.nodeId || "") };
          return { type: "gridPoint", x: Number(a.x) || 0, y: Number(a.y) || 0 };
        }),
        visible: z.visible !== false,
        fill: String(z.fill || "rgba(56,189,248,0.22)"),
        stroke: String(z.stroke || "#0284c7"),
        layerId: String(node.id || "")
      }))
    };
  });
}

function normalizeArray(value, mapper) {
  if (!Array.isArray(value)) return [];
  return value.map(mapper);
}

function exportSvg() {
  const exportData = buildExportSvg();
  downloadTextFile(`${slugify(projectName()) || "mansionforge"}.svg`, exportData);
}

function buildExportSvg() {
  const layers = [];
  walkTree(app.state.tree, (node, visible) => {
    if (node.type === "layer" && visible) layers.push(node);
  });

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  const chunks = [];
  const floorDefs = buildFloorPatternDefs().innerHTML;

  for (const layer of layers) {
    let inner = "";

    for (const floor of layer.floors || []) {
      if (floor.visible === false) continue;
      const f = exportFloor(layer, floor);
      if (!f) continue;
      inner += f.markup;
      minX = Math.min(minX, f.bounds.minX);
      minY = Math.min(minY, f.bounds.minY);
      maxX = Math.max(maxX, f.bounds.maxX);
      maxY = Math.max(maxY, f.bounds.maxY);
    }

    for (const zone of layer.zones) {
      if (zone.visible === false) continue;
      const z = exportZone(layer, zone);
      if (!z) continue;
      inner += z.markup;
      minX = Math.min(minX, z.bounds.minX);
      minY = Math.min(minY, z.bounds.minY);
      maxX = Math.max(maxX, z.bounds.maxX);
      maxY = Math.max(maxY, z.bounds.maxY);
    }

    for (const vector of layer.vectors) {
      const a = getNode(layer, vector.a);
      const b = getNode(layer, vector.b);
      if (!a || !b) continue;
      const rendered = exportVectorMarkup(vector, a, b);
      inner += rendered.markup;
      minX = Math.min(minX, rendered.bounds.minX);
      minY = Math.min(minY, rendered.bounds.minY);
      maxX = Math.max(maxX, rendered.bounds.maxX);
      maxY = Math.max(maxY, rendered.bounds.maxY);
    }

    for (const furn of layer.furniture) {
      const def = furnitureDef(furn.furnitureId);
      const w = (def?.width || 1) * app.state.grid.cellSize;
      const h = (def?.height || 1) * app.state.grid.cellSize;
      const x = furn.x - w / 2;
      const y = furn.y - h / 2;

      inner += `<g transform="rotate(${n(normalizeAngle(furn.rotation))} ${n(furn.x)} ${n(furn.y)})"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.2"/></g>`;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    }

    for (const node of layer.nodes) {
      inner += `<circle cx="${n(node.x)}" cy="${n(node.y)}" r="2.5" fill="#0f172a"/>`;
      minX = Math.min(minX, node.x - 2.5);
      minY = Math.min(minY, node.y - 2.5);
      maxX = Math.max(maxX, node.x + 2.5);
      maxY = Math.max(maxY, node.y + 2.5);
    }

    chunks.push(`<g id="${escapeAttr(slugify(layer.name) || layer.id)}">${inner}</g>`);
  }

  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = 800;
    maxY = 600;
  }

  const margin = 20;
  const width = maxX - minX + margin * 2;
  const height = maxY - minY + margin * 2;
  const vbX = minX - margin;
  const vbY = minY - margin;

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(vbX)} ${n(vbY)} ${n(width)} ${n(height)}" width="${n(width)}" height="${n(height)}"><defs>${floorDefs}</defs>${chunks.join("")}</svg>`;
}

function exportVectorMarkup(vector, a, b) {
  const thickness = Math.max(1, Number(vector.thickness) || 1);
  const styleId = WALL_STYLES.some((s) => s.id === vector.wallStyle) ? vector.wallStyle : "pencil";
  const color = vectorBaseColor(vector);
  let markup = "";

  if (vector.type === "invisible") {
    markup += `<line x1="${n(a.x)}" y1="${n(a.y)}" x2="${n(b.x)}" y2="${n(b.y)}" stroke="${escapeAttr(color)}" stroke-width="${n(Math.max(1, thickness * 0.8))}" stroke-linecap="round" stroke-dasharray="6,4" opacity="0.45"/>`;
  } else if (styleId === "pencil") {
    markup += `<path d="${escapeAttr(handDrawnPath(a, b, vector.id, 1, 2.6))}" fill="none" stroke="${escapeAttr(color)}" stroke-width="${n(thickness)}" stroke-linecap="round" opacity="0.9"/>`;
    markup += `<path d="${escapeAttr(handDrawnPath(a, b, vector.id, 2, 1.8))}" fill="none" stroke="${escapeAttr(color)}" stroke-width="${n(Math.max(1, thickness * 0.45))}" stroke-linecap="round" opacity="0.55"/>`;
  } else {
    const style = wallStyleStroke(styleId, color, thickness);
    markup += `<line x1="${n(a.x)}" y1="${n(a.y)}" x2="${n(b.x)}" y2="${n(b.y)}" stroke="${escapeAttr(style.stroke)}" stroke-width="${n(style.width)}" stroke-linecap="round"${style.dash ? ` stroke-dasharray="${escapeAttr(style.dash)}"` : ""} opacity="${n(style.opacity)}"/>`;
  }

  if (vector.type === "door") {
    const mid = pointOnSegmentAtT(a, b, 0.5);
    const dir = unitDirection(a, b);
    const nn = { x: -dir.y, y: dir.x };
    const r = Math.max(6, thickness * 2.8);
    const s = { x: mid.x - dir.x * r * 0.65, y: mid.y - dir.y * r * 0.65 };
    const arcEnd = { x: s.x + nn.x * r, y: s.y + nn.y * r };
    markup += `<path d="M ${n(s.x)} ${n(s.y)} A ${n(r)} ${n(r)} 0 0 1 ${n(arcEnd.x)} ${n(arcEnd.y)}" fill="none" stroke="#b45309" stroke-width="${n(Math.max(1, thickness * 0.35))}" opacity="0.85"/>`;
  } else if (vector.type === "window") {
    markup += `<line x1="${n(a.x)}" y1="${n(a.y)}" x2="${n(b.x)}" y2="${n(b.y)}" stroke="#7dd3fc" stroke-width="${n(Math.max(1, thickness * 0.35))}" stroke-linecap="round" stroke-dasharray="6,3" opacity="0.9"/>`;
  }

  for (const opening of normalizeVectorOpenings(vector.openings)) {
    const dir = unitDirection(a, b);
    const nn = { x: -dir.y, y: dir.x };
    const c = pointOnSegmentAtT(a, b, opening.t);
    const half = Math.max(5, opening.widthCells * app.state.grid.cellSize * 0.28);
    const s = { x: c.x - dir.x * half, y: c.y - dir.y * half };
    const e = { x: c.x + dir.x * half, y: c.y + dir.y * half };
    if (opening.kind === "door") {
      const arcR = half * 0.95;
      const arcEnd = { x: s.x + nn.x * arcR, y: s.y + nn.y * arcR };
      markup += `<line x1="${n(s.x)}" y1="${n(s.y)}" x2="${n(e.x)}" y2="${n(e.y)}" stroke="#b45309" stroke-width="${n(Math.max(1.3, thickness * 0.58))}" stroke-linecap="round"/>`;
      markup += `<path d="M ${n(s.x)} ${n(s.y)} A ${n(arcR)} ${n(arcR)} 0 0 1 ${n(arcEnd.x)} ${n(arcEnd.y)}" fill="none" stroke="#d97706" stroke-width="${n(Math.max(1, thickness * 0.36))}" opacity="0.8"/>`;
    } else {
      markup += `<line x1="${n(s.x)}" y1="${n(s.y)}" x2="${n(e.x)}" y2="${n(e.y)}" stroke="#0284c7" stroke-width="${n(Math.max(1.3, thickness * 0.52))}" stroke-linecap="round"/>`;
    }
  }

  const minX = Math.min(a.x, b.x) - thickness - 8;
  const minY = Math.min(a.y, b.y) - thickness - 8;
  const maxX = Math.max(a.x, b.x) + thickness + 8;
  const maxY = Math.max(a.y, b.y) + thickness + 8;
  return { markup, bounds: { minX, minY, maxX, maxY } };
}

function exportFloor(layer, floor) {
  const points = floorResolvedPoints(layer, floor);
  if (!points.length) return null;
  const fill = `url(#floor-${floor.textureId || "stone"})`;
  const opacity = clamp(Number(floor.opacity) || 1, 0.1, 1);

  if (floor.shapeType === "rect") {
    if (points.length < 2) return null;
    const x = Math.min(points[0].x, points[1].x);
    const y = Math.min(points[0].y, points[1].y);
    const w = Math.abs(points[1].x - points[0].x);
    const h = Math.abs(points[1].y - points[0].y);
    return {
      markup: `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${escapeAttr(fill)}" opacity="${n(opacity)}" stroke="#64748b" stroke-width="0.8"/>`,
      bounds: { minX: x, minY: y, maxX: x + w, maxY: y + h }
    };
  }

  if (floor.shapeType === "ellipse") {
    if (points.length < 2) return null;
    const cx = (points[0].x + points[1].x) / 2;
    const cy = (points[0].y + points[1].y) / 2;
    const rx = Math.abs(points[1].x - points[0].x) / 2;
    const ry = Math.abs(points[1].y - points[0].y) / 2;
    return {
      markup: `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${escapeAttr(fill)}" opacity="${n(opacity)}" stroke="#64748b" stroke-width="0.8"/>`,
      bounds: { minX: cx - rx, minY: cy - ry, maxX: cx + rx, maxY: cy + ry }
    };
  }

  if (floor.shapeType === "polygon" || floor.shapeType === "lasso" || floor.shapeType === "vector_lasso") {
    if (points.length < 3) return null;
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      markup: `<polygon points="${points.map((p) => `${n(p.x)},${n(p.y)}`).join(" ")}" fill="${escapeAttr(fill)}" opacity="${n(opacity)}" stroke="#64748b" stroke-width="0.8"/>`,
      bounds: { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) }
    };
  }
  return null;
}

function exportZone(layer, zone) {
  const points = zoneResolvedPoints(layer, zone);
  if (!points.length) return null;

  if (zone.shapeType === "rect") {
    if (points.length < 2) return null;
    const x = Math.min(points[0].x, points[1].x);
    const y = Math.min(points[0].y, points[1].y);
    const w = Math.abs(points[1].x - points[0].x);
    const h = Math.abs(points[1].y - points[0].y);
    return {
      markup: `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${escapeAttr(zone.fill || "rgba(56,189,248,0.22)")}" stroke="${escapeAttr(zone.stroke || "#0284c7")}" stroke-width="1.2"/>`,
      bounds: { minX: x, minY: y, maxX: x + w, maxY: y + h }
    };
  }

  if (zone.shapeType === "ellipse") {
    if (points.length < 2) return null;
    const cx = (points[0].x + points[1].x) / 2;
    const cy = (points[0].y + points[1].y) / 2;
    const rx = Math.abs(points[1].x - points[0].x) / 2;
    const ry = Math.abs(points[1].y - points[0].y) / 2;
    return {
      markup: `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${escapeAttr(zone.fill || "rgba(56,189,248,0.22)")}" stroke="${escapeAttr(zone.stroke || "#0284c7")}" stroke-width="1.2"/>`,
      bounds: { minX: cx - rx, minY: cy - ry, maxX: cx + rx, maxY: cy + ry }
    };
  }

  if (zone.shapeType === "polygon" || zone.shapeType === "lasso" || zone.shapeType === "vector_lasso") {
    if (points.length < 3) return null;
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      markup: `<polygon points="${points.map((p) => `${n(p.x)},${n(p.y)}`).join(" ")}" fill="${escapeAttr(zone.fill || "rgba(56,189,248,0.22)")}" stroke="${escapeAttr(zone.stroke || "#0284c7")}" stroke-width="1.2"/>`,
      bounds: { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) }
    };
  }

  return null;
}

function projectName() {
  const first = firstLayer(app.state.tree);
  return first?.name || "mansionforge";
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function tryRestoreAutosave() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeLoadedProject(parsed.state ? parsed.state : parsed);
    app.state = normalized;
    if (parsed.view) {
      app.view.showGrid = parsed.view.showGrid !== false;
      app.view.showZones = parsed.view.showZones !== false;
      app.view.snap = parsed.view.snap !== false;
    }
  } catch (_) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function persistAutosave() {
  const payload = {
    state: {
      version: "1.3",
      grid: app.state.grid,
      tree: app.state.tree,
      furnitureLibrary: app.state.furnitureLibrary
    },
    view: {
      showGrid: app.view.showGrid,
      showZones: app.view.showZones,
      snap: app.view.snap
    }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function createSvg(tag, attrs) {
  const el = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    el.setAttribute(k, String(v));
  });
  return el;
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${idCounter++}`;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeAngle(value) {
  let v = Math.round(value) % 360;
  if (v < 0) v += 360;
  return v;
}

function n(value) {
  return Number.isFinite(value) ? Number(value.toFixed(3)) : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isSpacePressed() {
  return ui.canvas.classList.contains("panning") || ui.canvasWrap?.classList.contains("pan-mode");
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s) {
  return escapeHtml(s);
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toHexColor(value) {
  if (!value) return "#0284c7";
  if (value.startsWith("#") && (value.length === 7 || value.length === 4)) return value;

  const rgb = value.match(/rgba?\(([^)]+)\)/i);
  if (!rgb) return "#0284c7";
  const [r, g, b] = rgb[1].split(",").slice(0, 3).map((x) => clamp(Number(x.trim()) || 0, 0, 255));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
