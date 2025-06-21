import { TowerType, EnemyType, Position, Wave, Level, ShopUpgrade, SpecialTower } from '../types/game';

export const TOWER_CONFIG = {
  basic: {
    name: 'Basic Tower',
    color: '#3366FF',
    cost: [50, 75, 100],
    damage: [25, 40, 60],
    range: [80, 90, 100],
    fireRate: [1000, 800, 600],
    description: 'High damage single target',
    sellValue: [35, 87, 157]
  },
  area: {
    name: 'Area Tower',
    color: '#FF6633',
    cost: [75, 100, 125],
    damage: [15, 25, 35],
    range: [60, 70, 80],
    fireRate: [1500, 1200, 1000],
    description: 'Splash damage to multiple enemies',
    sellValue: [52, 122, 210]
  },
  slow: {
    name: 'Freeze Tower',
    color: '#33CCFF',
    cost: [60, 90, 120],
    damage: [10, 15, 20],
    range: [70, 85, 100],
    fireRate: [800, 600, 400],
    description: 'Slows enemies and deals damage',
    sellValue: [42, 105, 189]
  },
  resource: {
    name: 'Resource Tower',
    color: '#FFCC33',
    cost: [100, 150, 200],
    damage: [5, 8, 12],
    range: [50, 60, 70],
    fireRate: [2000, 1500, 1000],
    description: 'Generates resources over time',
    sellValue: [70, 175, 315]
  }
} as const;

export const SPECIAL_TOWERS: SpecialTower[] = [
  {
    id: 'sniper',
    name: 'Sniper Tower',
    color: '#8B4513',
    rarity: 'epic',
    cost: 150,
    damage: 80,
    range: 200,
    fireRate: 2000,
    description: 'Long range precision shots that pierce through enemies',
    special: 'Every 10th shot is a headshot dealing double damage',
    unlocked: false
  },
  {
    id: 'glue',
    name: 'Glue Tower',
    color: '#9ACD32',
    rarity: 'rare',
    cost: 125,
    damage: 5,
    range: 70,
    fireRate: 1500,
    description: 'Creates slowing puddles that trap enemies',
    special: 'Creates puddles that slow enemies by 70% for 5 seconds',
    unlocked: false
  },
  {
    id: 'spike',
    name: 'Spike Factory',
    color: '#696969',
    rarity: 'uncommon',
    cost: 200,
    damage: 20,
    range: 40,
    fireRate: 3000,
    description: 'Places spikes on the path that damage passing enemies',
    special: 'Generates spikes every 3s that damage and slow enemies',
    unlocked: false
  },
  {
    id: 'bombard',
    name: 'Bombard Tower',
    color: '#DC143C',
    rarity: 'epic',
    cost: 175,
    damage: 50,
    range: 90,
    fireRate: 2500,
    description: 'Explosive area damage with fragment scatter',
    special: 'Explosions create 4 fragments that deal additional damage',
    unlocked: false
  },
  {
    id: 'camo',
    name: 'Camo-Detector Tower',
    color: '#FF1493',
    rarity: 'rare',
    cost: 125,
    damage: 15,
    range: 120,
    fireRate: 1200,
    description: 'Reveals and damages stealth enemies',
    special: 'Reveals stealth enemies and deals extra damage to them',
    unlocked: false
  },
  {
    id: 'laser',
    name: 'Laser Beam Tower',
    color: '#00FFFF',
    rarity: 'legendary',
    cost: 225,
    damage: 30,
    range: 150,
    fireRate: 500,
    description: 'Continuous laser beam that sweeps the battlefield',
    special: 'Activates laser sweep for 3s every 12s, hitting all enemies in line',
    unlocked: false
  },
  {
    id: 'quantum',
    name: 'Quantum Tower',
    color: '#9400D3',
    rarity: 'mythic',
    cost: 500,
    damage: 100,
    range: 180,
    fireRate: 800,
    description: 'Manipulates time and space around enemies',
    special: 'Can slow time in area and teleport projectiles',
    unlocked: false
  },
  {
    id: 'plasma',
    name: 'Plasma Cannon',
    color: '#FF4500',
    rarity: 'legendary',
    cost: 300,
    damage: 75,
    range: 130,
    fireRate: 1000,
    description: 'Fires superheated plasma bolts',
    special: 'Plasma bolts chain between nearby enemies',
    unlocked: false
  }
];

export const TOWER_RARITIES = {
  common: { color: '#FFFFFF', chance: 40 },
  uncommon: { color: '#00FF00', chance: 30 },
  rare: { color: '#0080FF', chance: 15 },
  epic: { color: '#8000FF', chance: 10 },
  legendary: { color: '#FF8000', chance: 4 },
  mythic: { color: '#FF0080', chance: 1 }
};

export const ENEMY_CONFIG = {
  fast: {
    name: 'Scout',
    color: '#FF3366',
    health: [30, 45, 60],
    speed: [3, 3.5, 4],
    reward: [15, 20, 25],
    description: 'Fast but fragile'
  },
  tank: {
    name: 'Heavy',
    color: '#666666',
    health: [120, 180, 240],
    speed: [1, 1.2, 1.5],
    reward: [40, 60, 80],
    description: 'Slow but very durable'
  },
  stealth: {
    name: 'Ghost',
    color: '#9933FF',
    health: [60, 80, 100],
    speed: [2, 2.5, 3],
    reward: [30, 40, 50],
    description: 'Becomes invisible periodically'
  },
  regen: {
    name: 'Healer',
    color: '#33FF66',
    health: [80, 110, 140],
    speed: [1.5, 1.8, 2.1],
    reward: [35, 50, 65],
    description: 'Regenerates health over time'
  }
} as const;

export const SHOP_UPGRADES: ShopUpgrade[] = [
  {
    id: 'damage_boost',
    name: 'Damage Amplifier',
    description: '+20% damage to all towers',
    cost: 100,
    type: 'global',
    effect: 'damage_multiplier_1.2',
    icon: '⚡'
  },
  {
    id: 'range_boost',
    name: 'Range Extender',
    description: '+15% range to all towers',
    cost: 80,
    type: 'global',
    effect: 'range_multiplier_1.15',
    icon: '🎯'
  },
  {
    id: 'fire_rate_boost',
    name: 'Rapid Fire',
    description: '+25% fire rate to all towers',
    cost: 120,
    type: 'global',
    effect: 'fire_rate_multiplier_1.25',
    icon: '🔥'
  },
  {
    id: 'resource_boost',
    name: 'Economic Boost',
    description: '+50% resource generation',
    cost: 150,
    type: 'global',
    effect: 'resource_multiplier_1.5',
    icon: '💰'
  },
  {
    id: 'starting_resources',
    name: 'Starting Capital',
    description: '+100 starting resources',
    cost: 200,
    type: 'global',
    effect: 'starting_resources_100',
    icon: '🏦'
  },
  {
    id: 'extra_lives',
    name: 'Reinforcements',
    description: '+5 starting lives',
    cost: 180,
    type: 'global',
    effect: 'starting_lives_5',
    icon: '❤️'
  },
  // Extremely expensive ultimate upgrades
  {
    id: 'tower_master',
    name: 'Tower Master',
    description: 'All towers gain +50% damage, range, and fire rate',
    cost: 2000,
    type: 'global',
    effect: 'tower_master',
    icon: '👑'
  },
  {
    id: 'time_lord',
    name: 'Time Lord',
    description: 'Ability to slow down time globally for 10 seconds',
    cost: 3000,
    type: 'global',
    effect: 'time_lord',
    icon: '⏰'
  },
  {
    id: 'god_mode',
    name: 'Divine Protection',
    description: 'Start with 100 lives and immunity to first 10 enemies',
    cost: 5000,
    type: 'global',
    effect: 'god_mode',
    icon: '✨'
  }
];

export const REGIONS = [
  {
    id: 'forest',
    name: 'Enchanted Forest',
    description: 'Mystical woodlands with ancient magic',
    theme: 'forest',
    unlocked: true
  },
  {
    id: 'mountain',
    name: 'Frozen Peaks',
    description: 'Treacherous mountain passes and icy cliffs',
    theme: 'mountain',
    unlocked: false
  },
  {
    id: 'desert',
    name: 'Scorching Dunes',
    description: 'Harsh desert landscapes with sandstorms',
    theme: 'desert',
    unlocked: false
  },
  {
    id: 'volcano',
    name: 'Molten Core',
    description: 'Volcanic craters with flowing lava',
    theme: 'volcano',
    unlocked: false
  },
  {
    id: 'arctic',
    name: 'Frozen Wasteland',
    description: 'Icy tundra with blizzards and glaciers',
    theme: 'arctic',
    unlocked: false
  },
  {
    id: 'coastal',
    name: 'Storm Coast',
    description: 'Rocky shores with crashing waves',
    theme: 'coastal',
    unlocked: false
  },
  {
    id: 'industrial',
    name: 'Steel Factory',
    description: 'Mechanical platforms and conveyor belts',
    theme: 'industrial',
    unlocked: false
  },
  {
    id: 'ruins',
    name: 'Ancient Ruins',
    description: 'Forgotten underground chambers',
    theme: 'ruins',
    unlocked: false
  },
  {
    id: 'garden',
    name: 'Mystic Garden',
    description: 'Magical garden with flowing water',
    theme: 'garden',
    unlocked: false
  }
];

export const LEVELS: Level[] = [
  // FOREST REGION
  {
    id: 1,
    name: 'Whispering Woods',
    description: 'A gentle path through the enchanted forest',
    difficulty: 'Easy',
    region: 'forest',
    initialResources: 300,
    initialLives: 25,
    rewardCoins: 50,
    specialMechanic: null,
    obstacles: [
      { x: 200, y: 50 }, { x: 220, y: 50 }, { x: 240, y: 50 },
      { x: 500, y: 250 }, { x: 520, y: 250 }, { x: 540, y: 250 }
    ],
    waypoints: [
      { x: -20, y: 200 }, { x: 150, y: 200 }, { x: 150, y: 100 },
      { x: 400, y: 100 }, { x: 400, y: 300 }, { x: 250, y: 300 },
      { x: 250, y: 400 }, { x: 550, y: 400 }, { x: 550, y: 150 },
      { x: 700, y: 150 }, { x: 820, y: 150 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 8, spawnDelay: 800 }],
      [{ enemyType: 'fast', count: 10, spawnDelay: 700 }],
      [{ enemyType: 'tank', count: 3, spawnDelay: 1500 }],
      [{ enemyType: 'fast', count: 12, spawnDelay: 600 }, { enemyType: 'tank', count: 2, spawnDelay: 2000 }],
      [{ enemyType: 'stealth', count: 6, spawnDelay: 1000 }]
    ]
  },
  {
    id: 2,
    name: 'Twisted Branches',
    description: 'Dense forest with winding paths and hidden dangers',
    difficulty: 'Medium',
    region: 'forest',
    initialResources: 250,
    initialLives: 20,
    rewardCoins: 75,
    specialMechanic: null,
    obstacles: [
      { x: 100, y: 100 }, { x: 300, y: 200 }, { x: 500, y: 300 },
      { x: 600, y: 150 }, { x: 200, y: 350 }
    ],
    waypoints: [
      { x: -20, y: 250 }, { x: 100, y: 250 }, { x: 100, y: 150 },
      { x: 250, y: 150 }, { x: 250, y: 300 }, { x: 400, y: 300 },
      { x: 400, y: 100 }, { x: 600, y: 100 }, { x: 600, y: 400 },
      { x: 820, y: 400 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 12, spawnDelay: 600 }],
      [{ enemyType: 'tank', count: 5, spawnDelay: 1200 }],
      [{ enemyType: 'stealth', count: 8, spawnDelay: 800 }],
      [{ enemyType: 'regen', count: 6, spawnDelay: 1000 }],
      [{ enemyType: 'fast', count: 20, spawnDelay: 400 }, { enemyType: 'tank', count: 4, spawnDelay: 1500 }]
    ]
  },
  {
    id: 3,
    name: 'Ancient Grove',
    description: 'The heart of the forest where ancient magic flows',
    difficulty: 'Hard',
    region: 'forest',
    initialResources: 200,
    initialLives: 15,
    rewardCoins: 100,
    specialMechanic: null,
    obstacles: [
      { x: 150, y: 150 }, { x: 350, y: 250 }, { x: 550, y: 150 },
      { x: 250, y: 350 }, { x: 450, y: 350 }, { x: 650, y: 250 }
    ],
    waypoints: [
      { x: -20, y: 50 }, { x: 200, y: 50 }, { x: 200, y: 200 },
      { x: 100, y: 200 }, { x: 100, y: 300 }, { x: 300, y: 300 },
      { x: 300, y: 100 }, { x: 500, y: 100 }, { x: 500, y: 400 },
      { x: 700, y: 400 }, { x: 700, y: 200 }, { x: 820, y: 200 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 15, spawnDelay: 500 }],
      [{ enemyType: 'tank', count: 8, spawnDelay: 1000 }],
      [{ enemyType: 'stealth', count: 12, spawnDelay: 600 }],
      [{ enemyType: 'regen', count: 10, spawnDelay: 800 }],
      [{ enemyType: 'fast', count: 25, spawnDelay: 300 }, { enemyType: 'tank', count: 6, spawnDelay: 1200 }]
    ]
  },

  // MOUNTAIN REGION
  {
    id: 4,
    name: 'Rocky Ascent',
    description: 'A steep climb through mountain passes',
    difficulty: 'Easy',
    region: 'mountain',
    initialResources: 280,
    initialLives: 22,
    rewardCoins: 60,
    specialMechanic: null,
    obstacles: [
      { x: 150, y: 100 }, { x: 350, y: 200 }, { x: 550, y: 300 },
      { x: 250, y: 350 }, { x: 450, y: 150 }
    ],
    waypoints: [
      { x: -20, y: 400 }, { x: 150, y: 400 }, { x: 150, y: 250 },
      { x: 300, y: 250 }, { x: 300, y: 100 }, { x: 500, y: 100 },
      { x: 500, y: 350 }, { x: 650, y: 350 }, { x: 650, y: 200 },
      { x: 820, y: 200 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 10, spawnDelay: 700 }],
      [{ enemyType: 'tank', count: 4, spawnDelay: 1400 }],
      [{ enemyType: 'stealth', count: 7, spawnDelay: 900 }],
      [{ enemyType: 'regen', count: 5, spawnDelay: 1100 }],
      [{ enemyType: 'fast', count: 18, spawnDelay: 450 }, { enemyType: 'tank', count: 3, spawnDelay: 1600 }]
    ]
  },

  // DESERT REGION
  {
    id: 5,
    name: 'Dunas en Zig-Zag',
    description: 'Zig-zag pronunciado en dos tramos paralelos con tempestades de arena',
    difficulty: 'Medium',
    region: 'desert',
    initialResources: 220,
    initialLives: 18,
    rewardCoins: 80,
    specialMechanic: 'sandstorm',
    obstacles: [
      { x: 200, y: 150 }, { x: 400, y: 250 }, { x: 600, y: 150 },
      { x: 300, y: 350 }, { x: 500, y: 350 }
    ],
    waypoints: [
      { x: -20, y: 100 }, { x: 150, y: 100 }, { x: 300, y: 200 },
      { x: 150, y: 300 }, { x: 300, y: 400 }, { x: 450, y: 300 },
      { x: 600, y: 400 }, { x: 750, y: 300 }, { x: 820, y: 300 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 14, spawnDelay: 550 }],
      [{ enemyType: 'tank', count: 6, spawnDelay: 1100 }],
      [{ enemyType: 'stealth', count: 10, spawnDelay: 700 }],
      [{ enemyType: 'regen', count: 8, spawnDelay: 900 }],
      [{ enemyType: 'fast', count: 22, spawnDelay: 350 }, { enemyType: 'tank', count: 5, spawnDelay: 1300 }]
    ]
  },

  // VOLCANO REGION
  {
    id: 6,
    name: 'Pista de Lava Circular',
    description: 'Circuito ovalado cerrado con esquirlas de lava ocasionales',
    difficulty: 'Hard',
    region: 'volcano',
    initialResources: 180,
    initialLives: 12,
    rewardCoins: 120,
    specialMechanic: 'lava_shards',
    obstacles: [
      { x: 400, y: 250 }, { x: 200, y: 200 }, { x: 600, y: 200 },
      { x: 300, y: 350 }, { x: 500, y: 350 }
    ],
    waypoints: [
      { x: -20, y: 250 }, { x: 150, y: 250 }, { x: 250, y: 150 },
      { x: 400, y: 100 }, { x: 550, y: 150 }, { x: 650, y: 250 },
      { x: 550, y: 350 }, { x: 400, y: 400 }, { x: 250, y: 350 },
      { x: 150, y: 250 }, { x: 820, y: 250 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 18, spawnDelay: 450 }],
      [{ enemyType: 'tank', count: 10, spawnDelay: 900 }],
      [{ enemyType: 'stealth', count: 15, spawnDelay: 550 }],
      [{ enemyType: 'regen', count: 12, spawnDelay: 700 }],
      [{ enemyType: 'fast', count: 30, spawnDelay: 250 }, { enemyType: 'tank', count: 8, spawnDelay: 1000 }]
    ]
  },

  // ARCTIC REGION
  {
    id: 7,
    name: 'Ruta Glacial en Espiral',
    description: 'Espiral hacia el centro con hielo resbaladizo',
    difficulty: 'Hard',
    region: 'arctic',
    initialResources: 160,
    initialLives: 10,
    rewardCoins: 140,
    specialMechanic: 'slippery_ice',
    obstacles: [
      { x: 300, y: 150 }, { x: 500, y: 200 }, { x: 400, y: 350 },
      { x: 200, y: 300 }, { x: 600, y: 300 }
    ],
    waypoints: [
      { x: -20, y: 400 }, { x: 100, y: 400 }, { x: 200, y: 350 },
      { x: 300, y: 300 }, { x: 400, y: 250 }, { x: 500, y: 250 },
      { x: 600, y: 200 }, { x: 650, y: 150 }, { x: 700, y: 100 },
      { x: 750, y: 150 }, { x: 820, y: 200 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 20, spawnDelay: 400 }],
      [{ enemyType: 'tank', count: 12, spawnDelay: 800 }],
      [{ enemyType: 'stealth', count: 18, spawnDelay: 500 }],
      [{ enemyType: 'regen', count: 15, spawnDelay: 600 }],
      [{ enemyType: 'fast', count: 35, spawnDelay: 200 }, { enemyType: 'tank', count: 10, spawnDelay: 900 }]
    ]
  },

  // COASTAL REGION
  {
    id: 8,
    name: 'Camino del Acantilado Costero',
    description: 'Línea con curvas suaves mirando al mar con oleaje',
    difficulty: 'Medium',
    region: 'coastal',
    initialResources: 240,
    initialLives: 16,
    rewardCoins: 90,
    specialMechanic: 'coastal_waves',
    obstacles: [
      { x: 200, y: 100 }, { x: 400, y: 150 }, { x: 600, y: 100 },
      { x: 300, y: 300 }, { x: 500, y: 300 }
    ],
    waypoints: [
      { x: -20, y: 200 }, { x: 150, y: 200 }, { x: 300, y: 150 },
      { x: 450, y: 200 }, { x: 600, y: 150 }, { x: 750, y: 200 },
      { x: 820, y: 200 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 16, spawnDelay: 500 }],
      [{ enemyType: 'tank', count: 7, spawnDelay: 1000 }],
      [{ enemyType: 'stealth', count: 12, spawnDelay: 650 }],
      [{ enemyType: 'regen', count: 9, spawnDelay: 850 }],
      [{ enemyType: 'fast', count: 24, spawnDelay: 300 }, { enemyType: 'tank', count: 6, spawnDelay: 1200 }]
    ]
  },

  // INDUSTRIAL REGION
  {
    id: 9,
    name: 'Pasarela Industrial Rectilínea',
    description: 'Recta larga con cintas transportadoras activas',
    difficulty: 'Hard',
    region: 'industrial',
    initialResources: 170,
    initialLives: 12,
    rewardCoins: 130,
    specialMechanic: 'conveyor_belts',
    obstacles: [
      { x: 200, y: 200 }, { x: 400, y: 200 }, { x: 600, y: 200 },
      { x: 300, y: 100 }, { x: 500, y: 300 }
    ],
    waypoints: [
      { x: -20, y: 250 }, { x: 200, y: 250 }, { x: 200, y: 150 },
      { x: 400, y: 150 }, { x: 400, y: 350 }, { x: 600, y: 350 },
      { x: 600, y: 250 }, { x: 820, y: 250 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 22, spawnDelay: 350 }],
      [{ enemyType: 'tank', count: 14, spawnDelay: 750 }],
      [{ enemyType: 'stealth', count: 20, spawnDelay: 450 }],
      [{ enemyType: 'regen', count: 16, spawnDelay: 550 }],
      [{ enemyType: 'fast', count: 40, spawnDelay: 180 }, { enemyType: 'tank', count: 12, spawnDelay: 800 }]
    ]
  },

  // RUINS REGION
  {
    id: 10,
    name: 'Corredor de Ruinas Subterráneas',
    description: 'Línea quebrada con puertas de piedra que se abren y cierran',
    difficulty: 'Hard',
    region: 'ruins',
    initialResources: 150,
    initialLives: 10,
    rewardCoins: 150,
    specialMechanic: 'stone_doors',
    obstacles: [
      { x: 250, y: 200 }, { x: 450, y: 300 }, { x: 350, y: 150 },
      { x: 550, y: 250 }, { x: 150, y: 300 }
    ],
    waypoints: [
      { x: -20, y: 250 }, { x: 200, y: 250 }, { x: 400, y: 250 },
      { x: 400, y: 150 }, { x: 600, y: 150 }, { x: 820, y: 150 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 25, spawnDelay: 300 }],
      [{ enemyType: 'tank', count: 16, spawnDelay: 700 }],
      [{ enemyType: 'stealth', count: 22, spawnDelay: 400 }],
      [{ enemyType: 'regen', count: 18, spawnDelay: 500 }],
      [{ enemyType: 'fast', count: 45, spawnDelay: 150 }, { enemyType: 'tank', count: 15, spawnDelay: 750 }]
    ]
  },

  // GARDEN REGION
  {
    id: 11,
    name: 'Vía de Canal en Jardín Mágico',
    description: 'Canales de agua con fuentes mágicas que potencian torres',
    difficulty: 'Medium',
    region: 'garden',
    initialResources: 260,
    initialLives: 18,
    rewardCoins: 100,
    specialMechanic: 'magic_fountains',
    obstacles: [
      { x: 200, y: 150 }, { x: 400, y: 250 }, { x: 600, y: 150 },
      { x: 300, y: 350 }, { x: 500, y: 350 }
    ],
    waypoints: [
      { x: -20, y: 300 }, { x: 150, y: 300 }, { x: 250, y: 200 },
      { x: 350, y: 300 }, { x: 450, y: 200 }, { x: 550, y: 300 },
      { x: 650, y: 200 }, { x: 750, y: 300 }, { x: 820, y: 300 }
    ],
    waves: [
      [{ enemyType: 'fast', count: 18, spawnDelay: 450 }],
      [{ enemyType: 'tank', count: 9, spawnDelay: 950 }],
      [{ enemyType: 'stealth', count: 14, spawnDelay: 600 }],
      [{ enemyType: 'regen', count: 11, spawnDelay: 800 }],
      [{ enemyType: 'fast', count: 28, spawnDelay: 280 }, { enemyType: 'tank', count: 7, spawnDelay: 1100 }]
    ]
  }
];

export const GAME_CONFIG = {
  GRID_SIZE: 40,
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 500,
  PROJECTILE_SPEED: 5,
  RESOURCE_GENERATION_RATE: 10000,
  RESOURCE_GENERATION_AMOUNT: 25,
  TOWER_SELL_PERCENTAGE: 0.7,
  MIN_TOWER_DISTANCE: 35,
  PATH_WIDTH: 30,
  OBSTACLE_RADIUS: 20,
  ROULETTE_COST: 50
};