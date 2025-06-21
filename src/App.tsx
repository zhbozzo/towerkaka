import React, { useState, useEffect, useRef } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/UI/GameHUD';
import { Sidebar } from './components/UI/Sidebar';
import { TowerUpgrade } from './components/UI/TowerUpgrade';
import { GameOverScreen } from './components/UI/GameOverScreen';
import { MainMenu } from './components/UI/MainMenu';
import { RegionSelect } from './components/UI/RegionSelect';
import { LevelSelect } from './components/UI/LevelSelect';
import { Shop } from './components/UI/Shop';
import { Leaderboard } from './components/UI/Leaderboard';
import { GameSettings } from './components/UI/GameSettings';
import { TowerSelectionCancel } from './components/UI/TowerSelectionCancel';
import { SettingsMenu } from './components/UI/SettingsMenu';
import { Tower, TowerType, Level } from './types/game';
import { isValidTowerPosition } from './utils/gameUtils';

function App() {
  const gameEngineRef = useRef(new GameEngine());
  const [gameState, setGameState] = useState(gameEngineRef.current.getGameState());
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasVisitedShop, setHasVisitedShop] = useState(false);
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;

      const prevState = gameEngineRef.current.getGameState();
      
      if (!isPaused) {
        gameEngineRef.current.update(deltaTime);
      }
      
      const newState = gameEngineRef.current.getGameState();
      
      if (newState.coins > prevState.coins) {
        setCoinsEarned(newState.coins - prevState.coins);
      }
      
      setGameState(newState);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

  const handleCanvasClick = (x: number, y: number) => {
    if (gameState.selectedTowerType && gameState.currentLevel) {
      const position = { x, y };
      
      if (isValidTowerPosition(position, gameState.towers, gameState.currentLevel)) {
        const success = gameEngineRef.current.placeTower(position, gameState.selectedTowerType);
        
        if (success) {
          gameEngineRef.current.selectTowerType(null);
        }
      }
    }
    
    setSelectedTower(null);
  };

  const handleTowerClick = (tower: Tower) => {
    if (!gameState.selectedTowerType) {
      setSelectedTower(tower);
    }
  };

  const handleSelectTower = (type: TowerType | null) => {
    gameEngineRef.current.selectTowerType(type);
    setSelectedTower(null);
    
    if (type && gameState.sidebarVisible) {
      gameEngineRef.current.toggleSidebar();
    }
  };

  const handleCancelTowerSelection = () => {
    gameEngineRef.current.selectTowerType(null);
  };

  const handleStartWave = () => {
    gameEngineRef.current.startNextWave();
  };

  const handleSpeedChange = (speed: number) => {
    gameEngineRef.current.setGameSpeed(speed);
  };

  const handleUpgradeTower = (towerId: string) => {
    const success = gameEngineRef.current.upgradeTower(towerId);
    if (success) {
      setSelectedTower(null);
    }
  };

  const handleSellTower = (towerId: string) => {
    const success = gameEngineRef.current.sellTower(towerId);
    if (success) {
      setSelectedTower(null);
    }
  };

  const handleToggleSidebar = () => {
    gameEngineRef.current.toggleSidebar();
  };

  const handleStartGame = () => {
    gameEngineRef.current.goToRegionSelect();
  };

  const handleOpenShop = () => {
    setHasVisitedShop(true);
    gameEngineRef.current.goToShop();
  };

  const handleOpenLeaderboard = () => {
    gameEngineRef.current.goToLeaderboard();
  };

  const handleOpenSettings = () => {
    gameEngineRef.current.goToSettings();
  };

  const handleSelectRegion = (regionId: string) => {
    gameEngineRef.current.selectRegion(regionId);
  };

  const handleSelectLevel = (level: Level) => {
    gameEngineRef.current.startLevel(level);
    setSelectedTower(null);
    setCoinsEarned(0);
    setIsPaused(false);
  };

  const handleRestart = () => {
    if (gameState.currentLevel) {
      gameEngineRef.current.startLevel(gameState.currentLevel);
      setSelectedTower(null);
      setCoinsEarned(0);
      setIsPaused(false);
    }
  };

  const handleMainMenu = () => {
    gameEngineRef.current.goToMenu();
    setSelectedTower(null);
    setIsPaused(false);
  };

  const handleRegionSelect = () => {
    gameEngineRef.current.goToRegionSelect();
    setSelectedTower(null);
    setIsPaused(false);
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    gameEngineRef.current.purchaseUpgrade(upgradeId);
  };

  const handlePurchaseTower = (towerId: string) => {
    gameEngineRef.current.purchaseSpecialTower(towerId);
  };

  const handleRoulette = () => {
    return gameEngineRef.current.spinRoulette();
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  // Render different screens based on game phase
  if (gameState.gamePhase === 'menu') {
    return (
      <MainMenu 
        onStartGame={handleStartGame} 
        onOpenShop={handleOpenShop}
        onOpenLeaderboard={handleOpenLeaderboard}
        onOpenSettings={handleOpenSettings}
        coins={gameState.coins}
        showCoins={hasVisitedShop}
      />
    );
  }

  if (gameState.gamePhase === 'regionSelect') {
    return (
      <RegionSelect 
        onSelectRegion={handleSelectRegion}
        onBack={handleMainMenu}
        unlockedRegions={gameState.unlockedTowers}
      />
    );
  }

  if (gameState.gamePhase === 'levelSelect') {
    return (
      <LevelSelect 
        onSelectLevel={handleSelectLevel}
        onBack={handleRegionSelect}
        selectedRegion={gameState.currentRegion || 'forest'}
      />
    );
  }

  if (gameState.gamePhase === 'shop') {
    return (
      <Shop
        coins={gameState.coins}
        ownedUpgrades={gameState.ownedUpgrades}
        unlockedTowers={gameState.unlockedTowers}
        onPurchase={handlePurchaseUpgrade}
        onPurchaseTower={handlePurchaseTower}
        onRoulette={handleRoulette}
        onBack={handleMainMenu}
      />
    );
  }

  if (gameState.gamePhase === 'leaderboard') {
    return (
      <Leaderboard
        onBack={handleMainMenu}
      />
    );
  }

  if (gameState.gamePhase === 'settings') {
    return (
      <GameSettings
        onBack={handleMainMenu}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tower Defense</h1>
          {gameState.currentLevel && (
            <div className="text-lg font-semibold text-blue-400">
              {gameState.currentLevel.name}
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex justify-center">
            <GameCanvas
              gameState={gameState}
              onCanvasClick={handleCanvasClick}
              onTowerClick={handleTowerClick}
            />
          </div>
          
          <div className="lg:w-80">
            <GameHUD
              gameState={gameState}
              onStartWave={handleStartWave}
              onSpeedChange={handleSpeedChange}
            />
          </div>
        </div>
      </div>
      
      <SettingsMenu
        gameSpeed={gameState.gameSpeed}
        onPause={handlePause}
        onResume={handleResume}
        onRestart={handleRestart}
        onMainMenu={handleMainMenu}
        isPaused={isPaused}
      />
      
      <TowerSelectionCancel
        isVisible={!!gameState.selectedTowerType}
        onCancel={handleCancelTowerSelection}
      />
      
      <Sidebar
        selectedTowerType={gameState.selectedTowerType}
        onSelectTower={handleSelectTower}
        resources={gameState.resources}
        isVisible={gameState.sidebarVisible}
        onToggle={handleToggleSidebar}
        selectedTower={selectedTower}
        onSellTower={handleSellTower}
      />
      
      <TowerUpgrade
        tower={selectedTower}
        resources={gameState.resources}
        onUpgrade={handleUpgradeTower}
        onSell={handleSellTower}
        onClose={() => setSelectedTower(null)}
      />
      
      {(gameState.gamePhase === 'gameOver' || gameState.gamePhase === 'victory') && (
        <GameOverScreen
          gameState={gameState}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
          onLevelSelect={handleRegionSelect}
          onOpenShop={handleOpenShop}
          coinsEarned={coinsEarned}
        />
      )}
      
      {isPaused && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Paused</h2>
            <p className="text-gray-300 mb-6">Click the settings button to resume or access other options</p>
            <button
              onClick={handleResume}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;