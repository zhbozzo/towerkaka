import React from 'react';
import { Region } from '../../types/game';
import { REGIONS, LEVELS } from '../../config/gameConfig';
import { ArrowLeft, Lock, Star, Mountain, TreePine, Waves, Flame, Snowflake, Anchor, Cog, Coins as Ruins, Flower } from 'lucide-react';

interface RegionSelectProps {
  onSelectRegion: (regionId: string) => void;
  onBack: () => void;
  unlockedRegions: string[];
}

export const RegionSelect: React.FC<RegionSelectProps> = ({ onSelectRegion, onBack, unlockedRegions }) => {
  const getRegionIcon = (theme: string) => {
    switch (theme) {
      case 'forest': return <TreePine className="w-8 h-8" />;
      case 'mountain': return <Mountain className="w-8 h-8" />;
      case 'desert': return <Star className="w-8 h-8" />;
      case 'volcano': return <Flame className="w-8 h-8" />;
      case 'arctic': return <Snowflake className="w-8 h-8" />;
      case 'coastal': return <Anchor className="w-8 h-8" />;
      case 'industrial': return <Cog className="w-8 h-8" />;
      case 'ruins': return <Ruins className="w-8 h-8" />;
      case 'garden': return <Flower className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };

  const getRegionColor = (theme: string) => {
    switch (theme) {
      case 'forest': return 'from-green-800 to-green-600';
      case 'mountain': return 'from-gray-800 to-gray-600';
      case 'desert': return 'from-yellow-800 to-orange-600';
      case 'volcano': return 'from-red-800 to-orange-600';
      case 'arctic': return 'from-blue-800 to-cyan-600';
      case 'coastal': return 'from-blue-800 to-teal-600';
      case 'industrial': return 'from-gray-800 to-slate-600';
      case 'ruins': return 'from-purple-800 to-indigo-600';
      case 'garden': return 'from-emerald-800 to-green-600';
      default: return 'from-gray-800 to-gray-600';
    }
  };

  const getRegionLevels = (regionId: string) => {
    return LEVELS.filter(level => level.region === regionId);
  };

  const isRegionUnlocked = (regionId: string) => {
    return regionId === 'forest' || unlockedRegions.includes(regionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Menu
          </button>
          <h1 className="text-4xl font-bold text-white">Select Region</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REGIONS.map((region) => {
            const levels = getRegionLevels(region.id);
            const unlocked = isRegionUnlocked(region.id);
            
            return (
              <div
                key={region.id}
                className={`relative rounded-lg p-6 border-2 transition-all cursor-pointer ${
                  unlocked 
                    ? 'border-blue-500 hover:border-blue-400 hover:scale-105' 
                    : 'border-gray-600 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => unlocked && onSelectRegion(region.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getRegionColor(region.theme)} rounded-lg opacity-20`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white">
                      {getRegionIcon(region.theme)}
                    </div>
                    {!unlocked && (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{region.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{region.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {levels.map((level, index) => (
                      <div
                        key={level.id}
                        className={`p-2 rounded text-center text-xs font-bold ${
                          level.difficulty === 'Easy' 
                            ? 'bg-green-600 text-white' 
                            : level.difficulty === 'Medium'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-red-600 text-white'
                        }`}
                      >
                        {level.difficulty}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">{levels.length} Levels</div>
                    {unlocked ? (
                      <div className="text-blue-400 font-bold">Available</div>
                    ) : (
                      <div className="text-gray-500 font-bold">Locked</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-4">Region Progression</h3>
          <div className="text-gray-300 text-sm">
            <p>• Complete all levels in a region to unlock the next one</p>
            <p>• Each region introduces new challenges and mechanics</p>
            <p>• Higher difficulty regions offer better coin rewards</p>
            <p>• Special mechanics make each region unique</p>
          </div>
        </div>
      </div>
    </div>
  );
};