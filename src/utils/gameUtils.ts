import { Position, Enemy, Tower, Level } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

export function getDistance(pos1: Position, pos2: Position): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function moveTowardsTarget(current: Position, target: Position, speed: number): Position {
  const distance = getDistance(current, target);
  if (distance <= speed) {
    return { ...target };
  }
  
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const ratio = speed / distance;
  
  return {
    x: current.x + dx * ratio,
    y: current.y + dy * ratio
  };
}

export function getNextWaypoint(enemy: Enemy, waypoints: Position[]): Position | null {
  if (enemy.waypointIndex >= waypoints.length - 1) {
    return null;
  }
  return waypoints[enemy.waypointIndex + 1];
}

export function isValidTowerPosition(position: Position, existingTowers: Tower[], level: Level): boolean {
  if (position.x < 20 || position.x > GAME_CONFIG.CANVAS_WIDTH - 20 || 
      position.y < 20 || position.y > GAME_CONFIG.CANVAS_HEIGHT - 20) {
    return false;
  }

  const pathBuffer = GAME_CONFIG.PATH_WIDTH;
  for (let i = 0; i < level.waypoints.length - 1; i++) {
    const start = level.waypoints[i];
    const end = level.waypoints[i + 1];
    
    if (isNearPath(position, start, end, pathBuffer)) {
      return false;
    }
  }

  for (const obstacle of level.obstacles) {
    if (getDistance(position, obstacle) < GAME_CONFIG.OBSTACLE_RADIUS) {
      return false;
    }
  }
  
  for (const tower of existingTowers) {
    if (getDistance(position, tower.position) < GAME_CONFIG.MIN_TOWER_DISTANCE) {
      return false;
    }
  }
  
  return true;
}

function isNearPath(point: Position, pathStart: Position, pathEnd: Position, buffer: number): boolean {
  const distance = distanceToLineSegment(point, pathStart, pathEnd);
  return distance < buffer;
}

function distanceToLineSegment(point: Position, lineStart: Position, lineEnd: Position): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) return getDistance(point, lineStart);
  
  let param = dot / lenSq;
  param = Math.max(0, Math.min(1, param));
  
  const xx = lineStart.x + param * C;
  const yy = lineStart.y + param * D;
  
  return getDistance(point, { x: xx, y: yy });
}

export function snapToGrid(position: Position): Position {
  const gridSize = GAME_CONFIG.GRID_SIZE;
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize
  };
}

export function getWaveDifficulty(waveNumber: number): number {
  return Math.min(Math.floor(waveNumber / 3), 2);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getValidPlacementZones(level: Level, existingTowers: Tower[]): { valid: Position[], invalid: Position[] } {
  const valid: Position[] = [];
  const invalid: Position[] = [];
  
  for (let x = 20; x < GAME_CONFIG.CANVAS_WIDTH - 20; x += 10) {
    for (let y = 20; y < GAME_CONFIG.CANVAS_HEIGHT - 20; y += 10) {
      const position = { x, y };
      if (isValidTowerPosition(position, existingTowers, level)) {
        valid.push(position);
      } else {
        const isPath = isNearAnyPath(position, level.waypoints, GAME_CONFIG.PATH_WIDTH);
        const isObstacle = level.obstacles.some(obs => getDistance(position, obs) < GAME_CONFIG.OBSTACLE_RADIUS);
        
        if (isPath || isObstacle) {
          invalid.push(position);
        }
      }
    }
  }
  
  return { valid, invalid };
}

function isNearAnyPath(point: Position, waypoints: Position[], buffer: number): boolean {
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (isNearPath(point, waypoints[i], waypoints[i + 1], buffer)) {
      return true;
    }
  }
  return false;
}

export function hasLineOfSight(from: Position, to: Position, obstacles: Position[]): boolean {
  for (const obstacle of obstacles) {
    if (lineIntersectsCircle(from, to, obstacle, GAME_CONFIG.OBSTACLE_RADIUS)) {
      return false;
    }
  }
  return true;
}

function lineIntersectsCircle(lineStart: Position, lineEnd: Position, circleCenter: Position, radius: number): boolean {
  const distance = distanceToLineSegment(circleCenter, lineStart, lineEnd);
  return distance <= radius;
}

export function getVisibleRangePoints(towerPos: Position, range: number, obstacles: Position[]): Position[] {
  const points: Position[] = [];
  const angleStep = Math.PI / 180;
  
  for (let angle = 0; angle < Math.PI * 2; angle += angleStep) {
    const maxX = towerPos.x + Math.cos(angle) * range;
    const maxY = towerPos.y + Math.sin(angle) * range;
    const maxPoint = { x: maxX, y: maxY };
    
    let closestDistance = range;
    
    for (const obstacle of obstacles) {
      const rayToObstacle = { x: obstacle.x - towerPos.x, y: obstacle.y - towerPos.y };
      const rayLength = Math.sqrt(rayToObstacle.x * rayToObstacle.x + rayToObstacle.y * rayToObstacle.y);
      
      if (rayLength > range) continue;
      
      const rayAngle = Math.atan2(rayToObstacle.y, rayToObstacle.x);
      const angleDiff = Math.abs(angle - rayAngle);
      const normalizedAngleDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
      
      if (normalizedAngleDiff < Math.atan(GAME_CONFIG.OBSTACLE_RADIUS / rayLength)) {
        const distanceToObstacleEdge = rayLength - GAME_CONFIG.OBSTACLE_RADIUS;
        if (distanceToObstacleEdge > 0 && distanceToObstacleEdge < closestDistance) {
          closestDistance = distanceToObstacleEdge;
        }
      }
    }
    
    const finalX = towerPos.x + Math.cos(angle) * closestDistance;
    const finalY = towerPos.y + Math.sin(angle) * closestDistance;
    points.push({ x: finalX, y: finalY });
  }
  
  return points;
}

export function canTowerSeeEnemy(towerPos: Position, enemyPos: Position, obstacles: Position[]): boolean {
  return hasLineOfSight(towerPos, enemyPos, obstacles);
}

export function saveGameData(coins: number, ownedUpgrades: string[], unlockedTowers: string[] = []): void {
  const data = { coins, ownedUpgrades, unlockedTowers };
  localStorage.setItem('towerDefenseData', JSON.stringify(data));
}

export function loadGameData(): { coins: number; ownedUpgrades: string[]; unlockedTowers: string[] } {
  const saved = localStorage.getItem('towerDefenseData');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      return {
        coins: data.coins || 0,
        ownedUpgrades: data.ownedUpgrades || [],
        unlockedTowers: data.unlockedTowers || []
      };
    } catch (e) {
      console.error('Failed to load game data:', e);
    }
  }
  return { coins: 0, ownedUpgrades: [], unlockedTowers: [] };
}