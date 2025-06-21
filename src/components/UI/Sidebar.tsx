import React from 'react';
import { TowerType, Tower } from '../../types/game';
import { TOWER_CONFIG } from '../../config/gameConfig';
import { ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';

interface SidebarProps {
  selectedTowerType: TowerType | null;
  onSelectTower: (type: TowerType | null) => void;
  resources: number;
  isVisible: boolean;
  onToggle: () => void;
  selectedTower: Tower | null;
  onSellTower: (towerId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedTowerType,
  onSelectTower,
  resources,
  isVisible,
  onToggle,
  selectedTower,
  onSellTower
}) => {
  const towerTypes: TowerType[] = ['basic', 'area', 'slow', 'resource'];

  const handleTowerSelect = (type: TowerType) => {
    onSelectTower(selectedTowerType === type ? null : type);
  };

  return (
    <>
      {/* Toggle Button - positioned to avoid settings button */}
      <button
        onClick={onToggle}
        className={`fixed top-1/2 -translate-y-1/2 z-30 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-l-lg transition-all duration-300 ${
          isVisible ? 'right-80' : 'right-0'
        }`}
        style={{ marginTop: '40px' }} // Offset to avoid settings button
      >
        {isVisible ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-2xl transform transition-transform duration-300 z-40 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tower Control</h2>
          
          {/* Tower Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Build Towers</h3>
            <div className="grid grid-cols-2 gap-3">
              {towerTypes.map(type => {
                const config = TOWER_CONFIG[type];
                const cost = config.cost[0];
                const canAfford = resources >= cost;
                const isSelected = selectedTowerType === type;
                
                return (
                  <button
                    key={type}
                    onClick={() => handleTowerSelect(type)}
                    disabled={!canAfford}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-white bg-gray-700' 
                        : 'border-gray-600 hover:border-gray-500'
                      }
                      ${!canAfford 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-700'
                      }
                    `}
                  >
                    <div
                      className="w-12 h-12 mx-auto mb-2 rounded"
                      style={{ backgroundColor: config.color }}
                    />
                    
                    <div className="text-white text-sm">
                      <div className="font-bold">{config.name}</div>
                      <div className="text-yellow-400">${cost}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {selectedTowerType && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <div className="text-white text-sm">
                  <strong>{TOWER_CONFIG[selectedTowerType].name}</strong>
                  <p className="text-xs opacity-75 mt-1">
                    {TOWER_CONFIG[selectedTowerType].description}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Range:</span>
                      <span className="text-white ml-1">{TOWER_CONFIG[selectedTowerType].range[0]}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Damage:</span>
                      <span className="text-white ml-1">{TOWER_CONFIG[selectedTowerType].damage[0]}</span>
                    </div>
                  </div>
                  <p className="text-xs opacity-75 mt-2 text-green-400">
                    Move mouse over battlefield to place
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Tower Info */}
          {selectedTower && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Tower Info</h3>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: TOWER_CONFIG[selectedTower.type].color }}
                  />
                  <div>
                    <div className="text-white font-bold">
                      {TOWER_CONFIG[selectedTower.type].name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Level {selectedTower.level + 1}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="bg-gray-600 p-2 rounded">
                    <div className="text-gray-400">Damage</div>
                    <div className="text-white font-bold">
                      {TOWER_CONFIG[selectedTower.type].damage[selectedTower.level]}
                    </div>
                  </div>
                  
                  <div className="bg-gray-600 p-2 rounded">
                    <div className="text-gray-400">Range</div>
                    <div className="text-white font-bold">
                      {TOWER_CONFIG[selectedTower.type].range[selectedTower.level]}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => onSellTower(selectedTower.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Sell for ${TOWER_CONFIG[selectedTower.type].sellValue[selectedTower.level]}
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-bold mb-2">How to Play</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Select a tower type to build</li>
              <li>• Move mouse to see placement preview</li>
              <li>• Click on green squares to place towers</li>
              <li>• Click on towers to upgrade or sell them</li>
              <li>• Start waves to begin enemy attacks</li>
              <li>• Defend your base and earn resources</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};