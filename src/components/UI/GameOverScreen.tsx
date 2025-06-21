import React from 'react';
import { GameState } from '../../types/game';
import { Trophy, RotateCcw, Skull, Home, Play, ShoppingCart } from 'lucide-react';
import { formatNumber } from '../../utils/gameUtils';

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onMainMenu: () => void;
  onLevelSelect: () => void;
  onOpenShop: () => void;
  coinsEarned: number;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameState,
  onRestart,
  onMainMenu,
  onLevelSelect,
  onOpenShop,
  coinsEarned
}) => {
  const isVictory = gameState.gamePhase === 'victory';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
        <div className="mb-6">
          {isVictory ? (
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          ) : (
            <Skull className="w-16 h-16 text-red-400 mx-auto mb-4" />
          )}
          
          <h1 className={`text-3xl font-bold mb-2 ${isVictory ? 'text-yellow-400' : 'text-red-400'}`}>
            {isVictory ? 'Victory!' : 'Game Over'}
          </h1>
          
          <p className="text-gray-300">
            {isVictory 
              ? `You successfully defended ${gameState.currentLevel?.name}!` 
              : 'The enemies have breached your defenses.'
            }
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          {isVictory && coinsEarned > 0 && (
            <div className="bg-yellow-600 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">Coins Earned!</h3>
              <div className="text-2xl font-bold text-white">+{coinsEarned} Coins</div>
              <div className="text-sm text-yellow-100">Use coins in the Tower Shop for permanent upgrades!</div>
            </div>
          )}
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-white font-bold mb-3">Final Stats</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Score</div>
                <div className="text-white font-bold">{formatNumber(gameState.score)}</div>
              </div>
              
              <div>
                <div className="text-gray-400">Wave Reached</div>
                <div className="text-white font-bold">
                  {gameState.currentWave}/{gameState.currentLevel?.waves.length || 10}
                </div>
              </div>
              
              <div>
                <div className="text-gray-400">Towers Built</div>
                <div className="text-white font-bold">{gameState.towers.length}</div>
              </div>
              
              <div>
                <div className="text-gray-400">Lives Left</div>
                <div className="text-white font-bold">{gameState.lives}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          
          <button
            onClick={onLevelSelect}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Choose Level
          </button>
          
          {isVictory && (
            <button
              onClick={onOpenShop}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Tower Shop
            </button>
          )}
          
          <button
            onClick={onMainMenu}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};