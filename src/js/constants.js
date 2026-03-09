window.MF_CONSTANTS = Object.freeze({
  NS: "http://www.w3.org/2000/svg",
  MAX_HISTORY: 100,
  STORAGE_KEY: "mansionforge.autosave.v1.3",
  VECTOR_TYPES: ["wall", "door", "window", "opening", "invisible"],
  ROOM_TYPES: [
    { id: "bedroom_single", label: "Chambre simple" },
    { id: "bedroom_double", label: "Chambre double" },
    { id: "living_room", label: "Salon" },
    { id: "kitchen", label: "Cuisine" },
    { id: "bathroom", label: "Salle de bain" },
    { id: "office", label: "Bureau" },
    { id: "corridor", label: "Couloir" },
    { id: "wardrobe_room", label: "Garde-robe" },
    { id: "dining_room", label: "Salle à manger" },
    { id: "cellar", label: "Cave" }
  ],
  DEFAULT_FURNITURE: [
    { id: "bed_single", label: "Lit simple", category: "chambre", width: 2, height: 4, defaultRotation: 0, svg: "<rect x='0' y='0' width='100' height='200' rx='8'/>" },
    { id: "bed_double", label: "Lit double", category: "chambre", width: 3, height: 4, defaultRotation: 0, svg: "<rect x='0' y='0' width='150' height='200' rx='8'/>" },
    { id: "wardrobe", label: "Armoire", category: "chambre", width: 2, height: 1, defaultRotation: 0, svg: "<rect x='0' y='0' width='100' height='50'/>" },
    { id: "desk", label: "Bureau", category: "bureau", width: 2, height: 1, defaultRotation: 0, svg: "<rect x='0' y='0' width='100' height='50'/>" },
    { id: "chair", label: "Chaise", category: "general", width: 1, height: 1, defaultRotation: 0, svg: "<rect x='0' y='0' width='40' height='40' rx='4'/>" },
    { id: "sofa", label: "Canapé", category: "salon", width: 3, height: 1.5, defaultRotation: 0, svg: "<rect x='0' y='0' width='150' height='75' rx='10'/>" },
    { id: "coffee_table", label: "Table basse", category: "salon", width: 1.5, height: 1.5, defaultRotation: 0, svg: "<rect x='0' y='0' width='75' height='75' rx='8'/>" },
    { id: "dining_table", label: "Table repas", category: "salle_a_manger", width: 3, height: 2, defaultRotation: 0, svg: "<rect x='0' y='0' width='150' height='100' rx='6'/>" },
    { id: "dining_chair", label: "Chaise repas", category: "salle_a_manger", width: 1, height: 1, defaultRotation: 0, svg: "<rect x='0' y='0' width='40' height='40' rx='4'/>" },
    { id: "kitchen_sink", label: "Évier", category: "cuisine", width: 1.5, height: 1, defaultRotation: 0, svg: "<rect x='0' y='0' width='75' height='50'/>" },
    { id: "kitchen_counter", label: "Plan de travail", category: "cuisine", width: 3, height: 1, defaultRotation: 0, svg: "<rect x='0' y='0' width='150' height='50'/>" },
    { id: "fridge", label: "Frigo", category: "cuisine", width: 1, height: 1, defaultRotation: 0, svg: "<rect x='0' y='0' width='50' height='50'/>" },
    { id: "toilet", label: "Toilettes", category: "sdb", width: 1, height: 1, defaultRotation: 0, svg: "<ellipse cx='20' cy='20' rx='20' ry='20'/>" },
    { id: "bathtub", label: "Baignoire", category: "sdb", width: 2.5, height: 1.2, defaultRotation: 0, svg: "<rect x='0' y='0' width='125' height='60' rx='20'/>" },
    { id: "shower", label: "Douche", category: "sdb", width: 1.5, height: 1.5, defaultRotation: 0, svg: "<rect x='0' y='0' width='75' height='75' rx='5'/>" },
    { id: "bookshelf", label: "Bibliothèque", category: "bureau", width: 2, height: 1, defaultRotation: 0, svg: "<rect x='0' y='0' width='100' height='50'/>" },
    { id: "tv", label: "TV", category: "salon", width: 1.5, height: 0.7, defaultRotation: 0, svg: "<rect x='0' y='0' width='75' height='35'/>" }
  ],
  ROOM_LAYOUTS: {
    bedroom_single: [
      { furnitureId: "bed_single", x: 0.3, y: 0.35 },
      { furnitureId: "wardrobe", x: 0.75, y: 0.2 },
      { furnitureId: "desk", x: 0.7, y: 0.75 },
      { furnitureId: "chair", x: 0.78, y: 0.78 }
    ],
    bedroom_double: [
      { furnitureId: "bed_double", x: 0.45, y: 0.4 },
      { furnitureId: "wardrobe", x: 0.85, y: 0.2 },
      { furnitureId: "desk", x: 0.8, y: 0.75 },
      { furnitureId: "chair", x: 0.88, y: 0.78 }
    ],
    living_room: [
      { furnitureId: "sofa", x: 0.35, y: 0.35 },
      { furnitureId: "coffee_table", x: 0.5, y: 0.5 },
      { furnitureId: "tv", x: 0.75, y: 0.35 },
      { furnitureId: "bookshelf", x: 0.8, y: 0.7 }
    ],
    kitchen: [
      { furnitureId: "kitchen_counter", x: 0.3, y: 0.2 },
      { furnitureId: "kitchen_sink", x: 0.55, y: 0.2 },
      { furnitureId: "fridge", x: 0.8, y: 0.2 },
      { furnitureId: "dining_table", x: 0.45, y: 0.65 },
      { furnitureId: "dining_chair", x: 0.32, y: 0.65 },
      { furnitureId: "dining_chair", x: 0.58, y: 0.65 }
    ],
    bathroom: [
      { furnitureId: "toilet", x: 0.25, y: 0.3 },
      { furnitureId: "bathtub", x: 0.62, y: 0.35 },
      { furnitureId: "shower", x: 0.78, y: 0.75 }
    ],
    office: [
      { furnitureId: "desk", x: 0.35, y: 0.35 },
      { furnitureId: "chair", x: 0.44, y: 0.4 },
      { furnitureId: "bookshelf", x: 0.8, y: 0.22 },
      { furnitureId: "sofa", x: 0.65, y: 0.7 }
    ],
    corridor: [
      { furnitureId: "bookshelf", x: 0.22, y: 0.5 },
      { furnitureId: "bookshelf", x: 0.78, y: 0.5 }
    ],
    wardrobe_room: [
      { furnitureId: "wardrobe", x: 0.25, y: 0.25 },
      { furnitureId: "wardrobe", x: 0.75, y: 0.25 },
      { furnitureId: "wardrobe", x: 0.25, y: 0.75 },
      { furnitureId: "wardrobe", x: 0.75, y: 0.75 }
    ],
    dining_room: [
      { furnitureId: "dining_table", x: 0.5, y: 0.5 },
      { furnitureId: "dining_chair", x: 0.35, y: 0.5 },
      { furnitureId: "dining_chair", x: 0.65, y: 0.5 },
      { furnitureId: "dining_chair", x: 0.5, y: 0.35 },
      { furnitureId: "dining_chair", x: 0.5, y: 0.65 }
    ],
    cellar: [
      { furnitureId: "bookshelf", x: 0.25, y: 0.2 },
      { furnitureId: "bookshelf", x: 0.75, y: 0.2 },
      { furnitureId: "wardrobe", x: 0.25, y: 0.75 },
      { furnitureId: "wardrobe", x: 0.75, y: 0.75 }
    ]
  }
});
