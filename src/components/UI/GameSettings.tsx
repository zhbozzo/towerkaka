import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Monitor, Smartphone } from 'lucide-react';

interface GameSettingsProps {
  onBack: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ onBack }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(50);
  const [showFPS, setShowFPS] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [screenMode, setScreenMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleSaveSettings = () => {
    // In a real app, these would be saved to localStorage or backend
    const settings = {
      soundEnabled,
      musicEnabled,
      soundVolume,
      musicVolume,
      showFPS,
      autoSave,
      screenMode
    };
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Menu
          </button>
          <h1 className="text-4xl font-bold text-white">Game Settings</h1>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
          <div className="space-y-8">
            {/* Audio Settings */}
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Audio Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {soundEnabled ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                    <span className="text-white">Sound Effects</span>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {soundEnabled && (
                  <div className="ml-8">
                    <label className="text-gray-300 text-sm">Volume: {soundVolume}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundVolume}
                      onChange={(e) => setSoundVolume(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {musicEnabled ? <Volume2 className="w-5 h-5 text-purple-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                    <span className="text-white">Background Music</span>
                  </div>
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      musicEnabled ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      musicEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {musicEnabled && (
                  <div className="ml-8">
                    <label className="text-gray-300 text-sm">Volume: {musicVolume}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Show FPS Counter</span>
                  <button
                    onClick={() => setShowFPS(!showFPS)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      showFPS ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      showFPS ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="text-white mb-2 block">Screen Mode</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setScreenMode('desktop')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        screenMode === 'desktop' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      Desktop
                    </button>
                    <button
                      onClick={() => setScreenMode('mobile')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        screenMode === 'mobile' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      Mobile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Settings */}
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Game Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Auto-Save Progress</span>
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      autoSave ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-600">
            <button
              onClick={handleSaveSettings}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};