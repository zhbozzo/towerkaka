import React from 'react';
import { Level } from '../../types/game';
import { LEVELS } from '../../config/gameConfig';
import { ArrowLeft, Star, Clock, Shield, Zap } from 'lucide-react';

interface LevelSelectProps {
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
  selectedRegion: string;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ onSelectLevel, onBack, selectedRegion }) => {
  const regionLevels = LEVELS.filter(level => level.region === selectedRegion);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900';
      case 'Medium': return 'text-yellow-400 bg-yellow-900';
      case 'Hard': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return <Shield className="w-4 h-4" />;
      case 'Medium': return <Clock className="w-4 h-4" />;
      case 'Hard': return <Star className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getSpecialMechanicDescription = (mechanic: string | null) => {
    switch (mechanic) {
      case 'sandstorm': return '🌪️ Sandstorms reduce tower range by 20% for 5s';
      case 'lava_shards': return '🔥 Lava shards damage towers in straight lines';
      case 'slippery_ice': return '❄️ Ice increases enemy speed by 15% for 3s';
      case 'coastal_waves': return '🌊 Waves reduce tower fire rate by 10%';
      case 'conveyor_belts': return '⚙️ Conveyor belts increase enemy speed by 20%';
      case 'stone_doors': return '🚪 Stone doors block placement every 20s';
      case 'magic_fountains': return '✨ Magic fountains boost tower damage by 25%';
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Regions
          </button>
          <h1 className="text-4xl font-bold text-white">Select Level</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionLevels.map((level) => {
            const specialMechanic = getSpecialMechanicDescription(level.specialMechanic);
            
            return (
              <div
                key={level.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => onSelectLevel(level)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{level.name}</h3>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(level.difficulty)}`}>
                    {getDifficultyIcon(level.difficulty)}
                    {level.difficulty}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {level.description}
                </p>
                
                {specialMechanic && (
                  <div className="bg-purple-900 p-3 rounded mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-bold text-sm">Special Mechanic</span>
                    </div>
                    <div className="text-purple-200 text-xs">{specialMechanic}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400">Starting Resources</div>
                    <div className="text-yellow-400 font-bold">${level.initialResources}</div>
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400">Lives</div>
                    <div className="text-red-400 font-bold">{level.initialLives}</div>
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400">Waves</div>
                    <div className="text-blue-400 font-bold">{level.waves.length}</div>
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400">Reward</div>
                    <div className="text-purple-400 font-bold">{level.rewardCoins} coins</div>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                  Play Level
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};