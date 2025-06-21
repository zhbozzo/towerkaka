import React, { useState } from 'react';
import { Settings, X, Pause, Play, RotateCcw, Home } from 'lucide-react';

interface SettingsMenuProps {
  gameSpeed: number;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  isPaused: boolean;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  gameSpeed,
  onPause,
  onResume,
  onRestart,
  onMainMenu,
  isPaused
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePauseToggle = () => {
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };

  const handleRestart = () => {
    setIsOpen(false);
    onRestart();
  };

  const handleMainMenu = () => {
    setIsOpen(false);
    onMainMenu();
  };

  return (
    <>
      {/* Settings Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Game Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Pause/Resume */}
              <button
                onClick={handlePauseToggle}
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-bold transition-colors ${
                  isPaused 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5" />
                    Resume Game
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause Game
                  </>
                )}
              </button>
              
              {/* Restart Level */}
              <button
                onClick={handleRestart}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Restart Level
              </button>
              
              {/* Main Menu */}
              <button
                onClick={handleMainMenu}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                Exit to Main Menu
              </button>
            </div>
            
            {isPaused && (
              <div className="mt-6 pt-4 border-t border-gray-600">
                <div className="text-yellow-400 font-bold text-center">
                  ⏸️ Game Paused
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};