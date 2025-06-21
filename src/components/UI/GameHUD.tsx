import React from 'react';
import { GameState } from '../../types/game';
import { Heart, Coins, Zap, Trophy, Play, Pause, FastForward } from 'lucide-react';
import { formatNumber } from '../../utils/gameUtils';

interface GameHUDProps {
  gameState: GameState;
  onStartWave: () => void;
  onSpeedChange: (speed: number) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ gameState, onStartWave, onSpeedChange }) => {
  const canStartWave = !gameState.waveInProgress && gameState.currentWave < 10;

  const getSpeedIcon = () => {
    switch (gameState.gameSpeed) {
      case 0.5: return <Play className="w-4 h-4" />;
      case 1: return <Play className="w-4 h-4" />;
      case 2: return <FastForward className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getSpeedColor = () => {
    switch (gameState.gameSpeed) {
      case 0.5: return 'bg-blue-600 hover:bg-blue-700';
      case 1: return 'bg-green-600 hover:bg-green-700';
      case 2: return 'bg-orange-600 hover:bg-orange-700';
      default: return 'bg-green-600 hover:bg-green-700';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Resources */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-600 px-3 py-1 rounded-lg">
            <Coins className="w-4 h-4" />
            <span className="font-bold">{formatNumber(gameState.resources)}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-lg">
            <Heart className="w-4 h-4" />
            <span className="font-bold">{gameState.lives}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-purple-600 px-3 py-1 rounded-lg">
            <Trophy className="w-4 h-4" />
            <span className="font-bold">{formatNumber(gameState.score)}</span>
          </div>

          <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-lg">
            <Coins className="w-4 h-4" />
            <span className="font-bold text-yellow-300">{gameState.coins}</span>
          </div>
        </div>

        {/* Wave Info and Controls */}
        <div className="flex items-center gap-4">
          <div className="text-white">
            <span className="text-sm opacity-75">Wave </span>
            <span className="text-lg font-bold">{gameState.currentWave}/10</span>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSpeedChange(0.5)}
              className={`p-2 rounded ${gameState.gameSpeed === 0.5 ? 'bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'} text-white transition-colors`}
              title="0.5x Speed"
            >
              <span className="text-xs font-bold">0.5x</span>
            </button>
            <button
              onClick={() => onSpeedChange(1)}
              className={`p-2 rounded ${gameState.gameSpeed === 1 ? 'bg-green-700' : 'bg-gray-600 hover:bg-gray-500'} text-white transition-colors`}
              title="Normal Speed"
            >
              <span className="text-xs font-bold">1x</span>
            </button>
            <button
              onClick={() => onSpeedChange(2)}
              className={`p-2 rounded ${gameState.gameSpeed === 2 ? 'bg-orange-700' : 'bg-gray-600 hover:bg-gray-500'} text-white transition-colors`}
              title="2x Speed"
            >
              <span className="text-xs font-bold">2x</span>
            </button>
          </div>
          
          {canStartWave && (
            <button
              onClick={onStartWave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold text-white transition-colors"
            >
              <Zap className="w-4 h-4" />
              Start Wave
            </button>
          )}
          
          {gameState.waveInProgress && (
            <div className="bg-orange-600 px-3 py-1 rounded-lg">
              <span className="text-white font-bold">Wave Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};