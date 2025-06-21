import React from 'react';
import { Play, Trophy, Settings, ShoppingCart } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  coins: number;
  showCoins: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  onStartGame, 
  onOpenShop, 
  onOpenLeaderboard,
  onOpenSettings,
  coins, 
  showCoins 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white mb-4">
            Tower Defense
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            Defend your territory with strategic tower placement and tactical upgrades
          </p>
          
          {showCoins && (
            <div className="flex items-center justify-center gap-2 bg-yellow-600 px-4 py-2 rounded-lg inline-block">
              <span className="text-white font-bold text-lg">{coins} Coins</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onStartGame}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors w-64 mx-auto"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
          
          <button
            onClick={onOpenShop}
            className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors w-64 mx-auto"
          >
            <ShoppingCart className="w-6 h-6" />
            Tower Shop
          </button>
          
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors w-64 mx-auto"
          >
            <Trophy className="w-6 h-6" />
            Leaderboard
          </button>
          
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors w-64 mx-auto"
          >
            <Settings className="w-6 h-6" />
            Settings
          </button>
        </div>
        
        <div className="text-gray-400 text-sm">
          <p>Use geometric towers to defend against waves of enemies</p>
          <p>Upgrade your defenses and earn coins to unlock permanent upgrades</p>
        </div>
      </div>
    </div>
  );
};