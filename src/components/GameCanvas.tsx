import React, { useRef, useEffect, useState } from 'react';
import { GameState, Tower, Enemy, Projectile } from '../types/game';
import { TOWER_CONFIG, ENEMY_CONFIG, GAME_CONFIG } from '../config/gameConfig';
import { getWaveDifficulty, getValidPlacementZones, getVisibleRangePoints } from '../utils/gameUtils';

interface GameCanvasProps {
  gameState: GameState;
  onCanvasClick: (x: number, y: number) => void;
  onTowerClick: (tower: Tower) => void;
  onMouseMove?: (x: number, y: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  onCanvasClick,
  onTowerClick,
  onMouseMove
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState.currentLevel) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = GAME_CONFIG.CANVAS_WIDTH;
    canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw placement zones when tower is selected
    if (gameState.selectedTowerType) {
      drawPlacementZones(ctx);
    }

    // Draw path
    drawPath(ctx, gameState.currentLevel.waypoints);
    
    // Draw obstacles
    drawObstacles(ctx, gameState.currentLevel.obstacles);

    // Draw towers
    gameState.towers.forEach(tower => drawTower(ctx, tower));

    // Draw enemies
    gameState.enemies.forEach(enemy => drawEnemy(ctx, enemy));

    // Draw projectiles
    gameState.projectiles.forEach(projectile => drawProjectile(ctx, projectile));

    // Draw tower preview when hovering
    if (gameState.selectedTowerType && mousePosition) {
      drawTowerPreview(ctx, mousePosition, gameState.selectedTowerType);
    }

  }, [gameState, mousePosition]);

  const drawPlacementZones = (ctx: CanvasRenderingContext2D) => {
    if (!gameState.currentLevel) return;
    
    const zones = getValidPlacementZones(gameState.currentLevel, gameState.towers);
    
    // Draw valid zones (green)
    ctx.fillStyle = '#00FF0020';
    zones.valid.forEach(pos => {
      ctx.fillRect(pos.x - 5, pos.y - 5, 10, 10);
    });
    
    // Draw invalid zones (red)
    ctx.fillStyle = '#FF000030';
    zones.invalid.forEach(pos => {
      ctx.fillRect(pos.x - 5, pos.y - 5, 10, 10);
    });
  };

  const drawPath = (ctx: CanvasRenderingContext2D, waypoints: any[]) => {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = GAME_CONFIG.PATH_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    
    ctx.stroke();

    // Draw path center line
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawObstacles = (ctx: CanvasRenderingContext2D, obstacles: any[]) => {
    ctx.fillStyle = '#8B4513';
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    
    obstacles.forEach(obstacle => {
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y, GAME_CONFIG.OBSTACLE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Add texture lines to make obstacles more visible
      ctx.strokeStyle = '#A0522D';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const x1 = obstacle.x + Math.cos(angle) * (GAME_CONFIG.OBSTACLE_RADIUS * 0.3);
        const y1 = obstacle.y + Math.sin(angle) * (GAME_CONFIG.OBSTACLE_RADIUS * 0.3);
        const x2 = obstacle.x + Math.cos(angle) * (GAME_CONFIG.OBSTACLE_RADIUS * 0.7);
        const y2 = obstacle.y + Math.sin(angle) * (GAME_CONFIG.OBSTACLE_RADIUS * 0.7);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
    });
  };

  const drawTowerPreview = (ctx: CanvasRenderingContext2D, position: { x: number; y: number }, towerType: string) => {
    if (!gameState.currentLevel) return;
    
    const config = TOWER_CONFIG[towerType as keyof typeof TOWER_CONFIG];
    
    // Draw range with line-of-sight blocking
    const rangePoints = getVisibleRangePoints(position, config.range[0], gameState.currentLevel.obstacles);
    
    if (rangePoints.length > 0) {
      // Fill the visible area
      ctx.fillStyle = config.color + '20';
      ctx.beginPath();
      ctx.moveTo(rangePoints[0].x, rangePoints[0].y);
      for (let i = 1; i < rangePoints.length; i++) {
        ctx.lineTo(rangePoints[i].x, rangePoints[i].y);
      }
      ctx.closePath();
      ctx.fill();
      
      // Draw the outline
      ctx.strokeStyle = config.color;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rangePoints[0].x, rangePoints[0].y);
      for (let i = 1; i < rangePoints.length; i++) {
        ctx.lineTo(rangePoints[i].x, rangePoints[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw tower preview
    ctx.globalAlpha = 0.8;
    const size = 20;
    ctx.fillStyle = config.color;
    ctx.fillRect(position.x - size/2, position.y - size/2, size, size);
    
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(position.x - size/2, position.y - size/2, size, size);
    
    ctx.globalAlpha = 1;
  };

  const drawTower = (ctx: CanvasRenderingContext2D, tower: Tower) => {
    if (!gameState.currentLevel) return;
    
    const config = TOWER_CONFIG[tower.type];
    const size = 20 + tower.level * 5;
    
    // Draw range with line-of-sight blocking when no tower type is selected
    if (gameState.selectedTowerType === null) {
      const rangePoints = getVisibleRangePoints(tower.position, config.range[tower.level], gameState.currentLevel.obstacles);
      
      if (rangePoints.length > 0) {
        // Fill the visible area
        ctx.fillStyle = config.color + '10';
        ctx.beginPath();
        ctx.moveTo(rangePoints[0].x, rangePoints[0].y);
        for (let i = 1; i < rangePoints.length; i++) {
          ctx.lineTo(rangePoints[i].x, rangePoints[i].y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Draw the outline
        ctx.strokeStyle = config.color;
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rangePoints[0].x, rangePoints[0].y);
        for (let i = 1; i < rangePoints.length; i++) {
          ctx.lineTo(rangePoints[i].x, rangePoints[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    // Draw tower body
    ctx.fillStyle = config.color;
    ctx.fillRect(
      tower.position.x - size / 2,
      tower.position.y - size / 2,
      size,
      size
    );
    
    // Draw border
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      tower.position.x - size / 2,
      tower.position.y - size / 2,
      size,
      size
    );
    
    // Draw level indicator
    if (tower.level > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        (tower.level + 1).toString(),
        tower.position.x,
        tower.position.y + 4
      );
    }
    
    // Draw upgrade indicators
    if (tower.upgrades.length > 0) {
      ctx.fillStyle = '#00FF00';
      ctx.beginPath();
      ctx.arc(tower.position.x + size/2 - 5, tower.position.y - size/2 + 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw targeting line to current target (only if line of sight exists)
    if (tower.target && gameState.currentLevel) {
      // Check if there are any obstacles blocking the line of sight
      let hasObstacleBlocking = false;
      for (const obstacle of gameState.currentLevel.obstacles) {
        const dx = tower.target.position.x - tower.position.x;
        const dy = tower.target.position.y - tower.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if obstacle is between tower and target
        const obstacleDistance = Math.sqrt(
          (obstacle.x - tower.position.x) ** 2 + (obstacle.y - tower.position.y) ** 2
        );
        
        if (obstacleDistance < distance) {
          // Calculate if the line passes through the obstacle
          const t = ((obstacle.x - tower.position.x) * dx + (obstacle.y - tower.position.y) * dy) / (dx * dx + dy * dy);
          if (t >= 0 && t <= 1) {
            const closestX = tower.position.x + t * dx;
            const closestY = tower.position.y + t * dy;
            const distanceToObstacle = Math.sqrt((closestX - obstacle.x) ** 2 + (closestY - obstacle.y) ** 2);
            
            if (distanceToObstacle <= GAME_CONFIG.OBSTACLE_RADIUS) {
              hasObstacleBlocking = true;
              break;
            }
          }
        }
      }
      
      if (!hasObstacleBlocking) {
        ctx.strokeStyle = config.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tower.position.x, tower.position.y);
        ctx.lineTo(tower.target.position.x, tower.target.position.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  };

  const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    const difficulty = getWaveDifficulty(gameState.currentWave);
    const config = ENEMY_CONFIG[enemy.type];
    const radius = 12 + difficulty * 2;
    
    // Check if enemy is stealthed
    const isStealthed = enemy.type === 'stealth' && Math.floor(Date.now() / 3000) % 2 === 1;
    
    ctx.globalAlpha = isStealthed ? 0.3 : 1;
    
    // Draw enemy body
    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.arc(enemy.position.x, enemy.position.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(enemy.position.x, enemy.position.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw health bar
    const healthBarWidth = 20;
    const healthBarHeight = 4;
    const healthPercentage = enemy.health / enemy.maxHealth;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(
      enemy.position.x - healthBarWidth / 2,
      enemy.position.y - radius - 8,
      healthBarWidth,
      healthBarHeight
    );
    
    ctx.fillStyle = healthPercentage > 0.5 ? '#4CAF50' : healthPercentage > 0.25 ? '#FFC107' : '#F44336';
    ctx.fillRect(
      enemy.position.x - healthBarWidth / 2,
      enemy.position.y - radius - 8,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
    
    // Draw status effects
    if (enemy.effects.length > 0) {
      const slowEffect = enemy.effects.find(e => e.type === 'slow');
      if (slowEffect) {
        ctx.strokeStyle = '#33CCFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.position.x, enemy.position.y, radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    ctx.globalAlpha = 1;
  };

  const drawProjectile = (ctx: CanvasRenderingContext2D, projectile: Projectile) => {
    const config = TOWER_CONFIG[projectile.towerType];
    
    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.arc(projectile.position.x, projectile.position.y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw trail
    ctx.strokeStyle = config.color;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(projectile.position.x, projectile.position.y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Check if clicking on a tower
    const clickedTower = gameState.towers.find(tower => {
      const distance = Math.sqrt((tower.position.x - x) ** 2 + (tower.position.y - y) ** 2);
      return distance < 25;
    });

    if (clickedTower && !gameState.selectedTowerType) {
      onTowerClick(clickedTower);
    } else {
      onCanvasClick(x, y);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameState.selectedTowerType) {
      setMousePosition(null);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setMousePosition({ x, y });
    
    if (onMouseMove) {
      onMouseMove(x, y);
    }
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-600 rounded-lg cursor-pointer w-full max-w-4xl"
      style={{ aspectRatio: '8/5' }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
};