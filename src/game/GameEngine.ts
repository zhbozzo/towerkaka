import { GameState, Tower, Enemy, Projectile, TowerType, EnemyType, Level, SpecialTower } from '../types/game';
import { TOWER_CONFIG, ENEMY_CONFIG, GAME_CONFIG, SHOP_UPGRADES, SPECIAL_TOWERS, TOWER_RARITIES } from '../config/gameConfig';
import { getDistance, moveTowardsTarget, getNextWaypoint, getWaveDifficulty, isValidTowerPosition, saveGameData, loadGameData, canTowerSeeEnemy } from '../utils/gameUtils';

export class GameEngine {
  private gameState: GameState;
  private lastUpdate: number = 0;
  private waveSpawnQueue: Array<{ enemyType: EnemyType; spawnTime: number }> = [];
  private nextEnemySpawn: number = 0;
  private lastResourceGeneration: number = 0;

  constructor() {
    const savedData = loadGameData();
    this.gameState = this.initializeGameState();
    this.gameState.coins = savedData.coins;
    this.gameState.ownedUpgrades = savedData.ownedUpgrades;
    this.gameState.unlockedTowers = savedData.unlockedTowers || [];
  }

  private initializeGameState(): GameState {
    return {
      resources: 0,
      lives: 0,
      currentWave: 0,
      waveInProgress: false,
      gamePhase: 'menu',
      selectedTowerType: null,
      towers: [],
      enemies: [],
      projectiles: [],
      score: 0,
      currentLevel: null,
      currentRegion: null,
      sidebarVisible: true,
      gameSpeed: 1,
      coins: 0,
      ownedUpgrades: [],
      unlockedTowers: []
    };
  }

  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public selectRegion(regionId: string): void {
    this.gameState.currentRegion = regionId;
    this.gameState.gamePhase = 'levelSelect';
  }

  public startLevel(level: Level): void {
    this.gameState.currentLevel = level;
    
    let initialResources = level.initialResources;
    let initialLives = level.initialLives;
    
    this.gameState.ownedUpgrades.forEach(upgradeId => {
      const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
      if (upgrade?.effect === 'starting_resources_100') {
        initialResources += 100;
      } else if (upgrade?.effect === 'starting_lives_5') {
        initialLives += 5;
      } else if (upgrade?.effect === 'god_mode') {
        initialLives = 100;
      }
    });
    
    this.gameState.resources = initialResources;
    this.gameState.lives = initialLives;
    this.gameState.currentWave = 0;
    this.gameState.waveInProgress = false;
    this.gameState.gamePhase = 'playing';
    this.gameState.selectedTowerType = null;
    this.gameState.towers = [];
    this.gameState.enemies = [];
    this.gameState.projectiles = [];
    this.gameState.score = 0;
    this.gameState.gameSpeed = 1;
    this.waveSpawnQueue = [];
    this.lastResourceGeneration = 0;
  }

  public update(deltaTime: number): void {
    if (this.gameState.gamePhase !== 'playing' || !this.gameState.currentLevel) return;

    const adjustedDeltaTime = deltaTime * this.gameState.gameSpeed;

    this.updateEnemies(adjustedDeltaTime);
    this.updateTowers(adjustedDeltaTime);
    this.updateProjectiles(adjustedDeltaTime);
    this.spawnEnemies(adjustedDeltaTime);
    this.generateResources(adjustedDeltaTime);
    this.checkWaveCompletion();
    this.checkGameOver();
  }

  private updateEnemies(deltaTime: number): void {
    if (!this.gameState.currentLevel) return;
    
    const currentTime = Date.now();
    
    this.gameState.enemies = this.gameState.enemies.filter(enemy => {
      enemy.effects = enemy.effects.filter(effect => {
        effect.duration -= deltaTime;
        return effect.duration > 0;
      });

      let effectiveSpeed = enemy.speed * this.gameState.gameSpeed;
      const slowEffect = enemy.effects.find(e => e.type === 'slow');
      if (slowEffect) {
        effectiveSpeed *= (1 - slowEffect.strength);
      }

      // Apply level-specific mechanics
      if (this.gameState.currentLevel.specialMechanic === 'slippery_ice') {
        effectiveSpeed *= 1.15; // Ice increases speed
      } else if (this.gameState.currentLevel.specialMechanic === 'conveyor_belts') {
        effectiveSpeed *= 1.20; // Conveyor belts increase speed
      }

      if (enemy.type === 'regen' && currentTime - enemy.lastDamaged > 2000) {
        const difficulty = getWaveDifficulty(this.gameState.currentWave);
        const maxHealth = ENEMY_CONFIG.regen.health[difficulty];
        enemy.health = Math.min(enemy.health + maxHealth * 0.02, enemy.maxHealth);
      }

      if (enemy.type === 'stealth') {
        const stealthCycle = Math.floor(currentTime / 3000) % 2;
        enemy.effects = enemy.effects.filter(e => e.type !== 'stealth');
        if (stealthCycle === 1) {
          enemy.effects.push({ type: 'freeze', duration: 1000, strength: 0.8 });
        }
      }

      const nextWaypoint = getNextWaypoint(enemy, this.gameState.currentLevel!.waypoints);
      if (nextWaypoint) {
        enemy.position = moveTowardsTarget(enemy.position, nextWaypoint, effectiveSpeed);
        
        if (getDistance(enemy.position, nextWaypoint) < 5) {
          enemy.waypointIndex++;
        }
      } else {
        this.gameState.lives--;
        return false;
      }

      return enemy.health > 0;
    });
  }

  private updateTowers(deltaTime: number): void {
    if (!this.gameState.currentLevel) return;
    
    const currentTime = Date.now();

    this.gameState.towers.forEach(tower => {
      const config = TOWER_CONFIG[tower.type];
      let range = config.range[tower.level];
      let damage = config.damage[tower.level];
      let fireRate = config.fireRate[tower.level];
      
      // Apply upgrades
      this.gameState.ownedUpgrades.forEach(upgradeId => {
        const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
        if (upgrade?.effect === 'range_multiplier_1.15') {
          range *= 1.15;
        } else if (upgrade?.effect === 'damage_multiplier_1.2') {
          damage *= 1.2;
        } else if (upgrade?.effect === 'fire_rate_multiplier_1.25') {
          fireRate *= 0.8;
        } else if (upgrade?.effect === 'tower_master') {
          range *= 1.5;
          damage *= 1.5;
          fireRate *= 0.5;
        }
      });

      // Apply level-specific mechanics
      if (this.gameState.currentLevel.specialMechanic === 'sandstorm') {
        range *= 0.8; // Sandstorm reduces range
      } else if (this.gameState.currentLevel.specialMechanic === 'coastal_waves') {
        fireRate *= 1.1; // Waves reduce fire rate
      } else if (this.gameState.currentLevel.specialMechanic === 'magic_fountains') {
        damage *= 1.25; // Magic fountains boost damage
      }
      
      if (!tower.target || tower.target.health <= 0 || 
          getDistance(tower.position, tower.target.position) > range ||
          !canTowerSeeEnemy(tower.position, tower.target.position, this.gameState.currentLevel!.obstacles)) {
        tower.target = this.findNearestEnemyWithLineOfSight(tower.position, range);
      }

      if (tower.target && currentTime - tower.lastFired > fireRate / this.gameState.gameSpeed) {
        this.createProjectile(tower, tower.target, damage);
        tower.lastFired = currentTime;
      }

      if (tower.type === 'resource' && currentTime - this.lastResourceGeneration > GAME_CONFIG.RESOURCE_GENERATION_RATE / this.gameState.gameSpeed) {
        let resourceAmount = GAME_CONFIG.RESOURCE_GENERATION_AMOUNT;
        
        this.gameState.ownedUpgrades.forEach(upgradeId => {
          const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
          if (upgrade?.effect === 'resource_multiplier_1.5') {
            resourceAmount *= 1.5;
          }
        });
        
        this.gameState.resources += resourceAmount;
      }
    });
  }

  private updateProjectiles(deltaTime: number): void {
    this.gameState.projectiles = this.gameState.projectiles.filter(projectile => {
      if (projectile.target.health <= 0) {
        return false;
      }

      projectile.position = moveTowardsTarget(
        projectile.position,
        projectile.target.position,
        projectile.speed * this.gameState.gameSpeed
      );

      if (getDistance(projectile.position, projectile.target.position) < 10) {
        this.dealDamage(projectile);
        return false;
      }

      return true;
    });
  }

  private findNearestEnemyWithLineOfSight(position: any, range: number): Enemy | null {
    if (!this.gameState.currentLevel) return null;
    
    let nearest: Enemy | null = null;
    let nearestDistance = Infinity;

    this.gameState.enemies.forEach(enemy => {
      if (enemy.type === 'stealth') {
        const stealthCycle = Math.floor(Date.now() / 3000) % 2;
        if (stealthCycle === 1) return;
      }

      const distance = getDistance(position, enemy.position);
      if (distance <= range && distance < nearestDistance) {
        if (canTowerSeeEnemy(position, enemy.position, this.gameState.currentLevel!.obstacles)) {
          nearest = enemy;
          nearestDistance = distance;
        }
      }
    });

    return nearest;
  }

  private createProjectile(tower: Tower, target: Enemy, damage: number): void {
    const projectile: Projectile = {
      id: `projectile-${Date.now()}-${Math.random()}`,
      position: { ...tower.position },
      target,
      damage,
      speed: GAME_CONFIG.PROJECTILE_SPEED,
      towerType: tower.type
    };

    this.gameState.projectiles.push(projectile);
  }

  private dealDamage(projectile: Projectile): void {
    const target = projectile.target;
    target.health -= projectile.damage;
    target.lastDamaged = Date.now();

    if (projectile.towerType === 'slow') {
      target.effects.push({ type: 'slow', duration: 2000, strength: 0.5 });
    }

    if (projectile.towerType === 'area') {
      this.gameState.enemies.forEach(enemy => {
        if (enemy.id !== target.id && getDistance(enemy.position, target.position) < 40) {
          enemy.health -= projectile.damage * 0.5;
          enemy.lastDamaged = Date.now();
        }
      });
    }

    if (target.health <= 0) {
      const difficulty = getWaveDifficulty(this.gameState.currentWave);
      const reward = ENEMY_CONFIG[target.type].reward[difficulty];
      this.gameState.resources += reward;
      this.gameState.score += reward * 2;
    }
  }

  private spawnEnemies(deltaTime: number): void {
    if (!this.gameState.waveInProgress || this.waveSpawnQueue.length === 0 || !this.gameState.currentLevel) return;

    const currentTime = Date.now();
    
    while (this.waveSpawnQueue.length > 0 && currentTime >= this.waveSpawnQueue[0].spawnTime) {
      const spawn = this.waveSpawnQueue.shift()!;
      this.createEnemy(spawn.enemyType);
    }
  }

  private createEnemy(type: EnemyType): void {
    if (!this.gameState.currentLevel) return;
    
    const difficulty = getWaveDifficulty(this.gameState.currentWave);
    const config = ENEMY_CONFIG[type];
    
    const enemy: Enemy = {
      id: `enemy-${Date.now()}-${Math.random()}`,
      type,
      position: { ...this.gameState.currentLevel.waypoints[0] },
      health: config.health[difficulty],
      maxHealth: config.health[difficulty],
      speed: config.speed[difficulty],
      waypointIndex: 0,
      effects: [],
      lastDamaged: 0
    };

    this.gameState.enemies.push(enemy);
  }

  private generateResources(deltaTime: number): void {
    const currentTime = Date.now();
    const resourceTowers = this.gameState.towers.filter(t => t.type === 'resource');
    
    if (resourceTowers.length > 0 && currentTime - this.lastResourceGeneration > GAME_CONFIG.RESOURCE_GENERATION_RATE / this.gameState.gameSpeed) {
      let totalGeneration = resourceTowers.reduce((total, tower) => {
        return total + GAME_CONFIG.RESOURCE_GENERATION_AMOUNT * (tower.level + 1);
      }, 0);
      
      this.gameState.ownedUpgrades.forEach(upgradeId => {
        const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
        if (upgrade?.effect === 'resource_multiplier_1.5') {
          totalGeneration *= 1.5;
        }
      });
      
      this.gameState.resources += totalGeneration;
      this.lastResourceGeneration = currentTime;
    }
  }

  private checkWaveCompletion(): void {
    if (this.gameState.waveInProgress && 
        this.waveSpawnQueue.length === 0 && 
        this.gameState.enemies.length === 0) {
      this.gameState.waveInProgress = false;
    }
  }

  private checkGameOver(): void {
    if (!this.gameState.currentLevel) return;
    
    if (this.gameState.lives <= 0) {
      this.gameState.gamePhase = 'gameOver';
    } else if (this.gameState.currentWave >= this.gameState.currentLevel.waves.length && !this.gameState.waveInProgress) {
      this.gameState.gamePhase = 'victory';
      this.gameState.coins += this.gameState.currentLevel.rewardCoins;
      this.saveProgress();
    }
  }

  public startNextWave(): void {
    if (!this.gameState.currentLevel || this.gameState.waveInProgress || 
        this.gameState.currentWave >= this.gameState.currentLevel.waves.length) return;

    this.gameState.currentWave++;
    this.gameState.waveInProgress = true;
    
    const waves = this.gameState.currentLevel.waves[this.gameState.currentWave - 1];
    this.waveSpawnQueue = [];
    
    let currentTime = Date.now() + 1000;
    
    waves.forEach(wave => {
      for (let i = 0; i < wave.count; i++) {
        this.waveSpawnQueue.push({
          enemyType: wave.enemyType,
          spawnTime: currentTime
        });
        currentTime += wave.spawnDelay / this.gameState.gameSpeed;
      }
    });
  }

  public placeTower(position: any, type: TowerType): boolean {
    if (!this.gameState.currentLevel) return false;
    
    const cost = TOWER_CONFIG[type].cost[0];
    
    if (this.gameState.resources < cost) {
      return false;
    }

    if (!isValidTowerPosition(position, this.gameState.towers, this.gameState.currentLevel)) {
      return false;
    }

    const tower: Tower = {
      id: `tower-${Date.now()}-${Math.random()}`,
      type,
      position,
      level: 0,
      lastFired: 0,
      target: null,
      upgrades: []
    };

    this.gameState.towers.push(tower);
    this.gameState.resources -= cost;
    return true;
  }

  public sellTower(towerId: string): boolean {
    const towerIndex = this.gameState.towers.findIndex(t => t.id === towerId);
    if (towerIndex === -1) return false;

    const tower = this.gameState.towers[towerIndex];
    const config = TOWER_CONFIG[tower.type];
    const sellValue = config.sellValue[tower.level];

    this.gameState.resources += sellValue;
    this.gameState.towers.splice(towerIndex, 1);
    return true;
  }

  public upgradeTower(towerId: string): boolean {
    const tower = this.gameState.towers.find(t => t.id === towerId);
    if (!tower || tower.level >= 2) return false;

    const cost = TOWER_CONFIG[tower.type].cost[tower.level + 1];
    if (this.gameState.resources < cost) return false;

    tower.level++;
    this.gameState.resources -= cost;
    return true;
  }

  public selectTowerType(type: TowerType | null): void {
    this.gameState.selectedTowerType = type;
  }

  public toggleSidebar(): void {
    this.gameState.sidebarVisible = !this.gameState.sidebarVisible;
  }

  public setGameSpeed(speed: number): void {
    this.gameState.gameSpeed = speed;
  }

  public purchaseUpgrade(upgradeId: string): boolean {
    const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade || this.gameState.coins < upgrade.cost || this.gameState.ownedUpgrades.includes(upgradeId)) {
      return false;
    }

    this.gameState.coins -= upgrade.cost;
    this.gameState.ownedUpgrades.push(upgradeId);
    this.saveProgress();
    return true;
  }

  public purchaseSpecialTower(towerId: string): boolean {
    const tower = SPECIAL_TOWERS.find(t => t.id === towerId);
    if (!tower || this.gameState.coins < tower.cost || this.gameState.unlockedTowers.includes(towerId)) {
      return false;
    }

    this.gameState.coins -= tower.cost;
    this.gameState.unlockedTowers.push(towerId);
    this.saveProgress();
    return true;
  }

  public spinRoulette(): SpecialTower | null {
    if (this.gameState.coins < GAME_CONFIG.ROULETTE_COST) return null;

    this.gameState.coins -= GAME_CONFIG.ROULETTE_COST;

    // Determine rarity based on chances
    const random = Math.random() * 100;
    let cumulativeChance = 0;
    let selectedRarity = 'common';

    for (const [rarity, data] of Object.entries(TOWER_RARITIES)) {
      cumulativeChance += data.chance;
      if (random <= cumulativeChance) {
        selectedRarity = rarity;
        break;
      }
    }

    // Find available towers of that rarity
    const availableTowers = SPECIAL_TOWERS.filter(
      tower => tower.rarity === selectedRarity && !this.gameState.unlockedTowers.includes(tower.id)
    );

    if (availableTowers.length === 0) {
      // If no towers of that rarity available, give coins back
      this.gameState.coins += GAME_CONFIG.ROULETTE_COST;
      return null;
    }

    const selectedTower = availableTowers[Math.floor(Math.random() * availableTowers.length)];
    this.gameState.unlockedTowers.push(selectedTower.id);
    this.saveProgress();

    return selectedTower;
  }

  public goToMenu(): void {
    this.gameState.gamePhase = 'menu';
  }

  public goToRegionSelect(): void {
    this.gameState.gamePhase = 'regionSelect';
  }

  public goToLevelSelect(): void {
    this.gameState.gamePhase = 'levelSelect';
  }

  public goToShop(): void {
    this.gameState.gamePhase = 'shop';
  }

  public goToLeaderboard(): void {
    this.gameState.gamePhase = 'leaderboard';
  }

  public goToSettings(): void {
    this.gameState.gamePhase = 'settings';
  }

  private saveProgress(): void {
    saveGameData(this.gameState.coins, this.gameState.ownedUpgrades, this.gameState.unlockedTowers);
  }

  public resetGame(): void {
    const savedData = loadGameData();
    this.gameState = this.initializeGameState();
    this.gameState.coins = savedData.coins;
    this.gameState.ownedUpgrades = savedData.ownedUpgrades;
    this.gameState.unlockedTowers = savedData.unlockedTowers || [];
    this.waveSpawnQueue = [];
    this.lastResourceGeneration = 0;
  }
}