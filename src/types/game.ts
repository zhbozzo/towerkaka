export interface Position {
  x: number;
  y: number;
}

export interface Tower {
  id: string;
  type: TowerType;
  position: Position;
  level: number;
  lastFired: number;
  target: Enemy | null;
  upgrades: string[];
}

export interface SpecialTower {
  id: string;
  name: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  cost: number;
  damage: number;
  range: number;
  fireRate: number;
  description: string;
  special: string;
  unlocked: boolean;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Position;
  health: number;
  maxHealth: number;
  speed: number;
  waypointIndex: number;
  effects: EnemyEffect[];
  lastDamaged: number;
}

export interface Projectile {
  id: string;
  position: Position;
  target: Enemy;
  damage: number;
  speed: number;
  towerType: TowerType;
}

export interface EnemyEffect {
  type: 'slow' | 'freeze';
  duration: number;
  strength: number;
}

export interface Wave {
  enemyType: EnemyType;
  count: number;
  spawnDelay: number;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  waypoints: Position[];
  waves: Wave[][];
  initialResources: number;
  initialLives: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  region: string;
  obstacles: Position[];
  rewardCoins: number;
  specialMechanic: string | null;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  theme: string;
  unlocked: boolean;
}

export interface GameState {
  resources: number;
  lives: number;
  currentWave: number;
  waveInProgress: boolean;
  gamePhase: 'menu' | 'levelSelect' | 'playing' | 'gameOver' | 'victory' | 'shop' | 'leaderboard' | 'settings' | 'regionSelect';
  selectedTowerType: TowerType | null;
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  score: number;
  currentLevel: Level | null;
  sidebarVisible: boolean;
  gameSpeed: number;
  coins: number;
  ownedUpgrades: string[];
  unlockedTowers: string[];
  currentRegion: string | null;
}

export interface ShopUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'tower' | 'global';
  effect: string;
  icon: string;
}

export type TowerType = 'basic' | 'area' | 'slow' | 'resource';
export type EnemyType = 'fast' | 'tank' | 'stealth' | 'regen';