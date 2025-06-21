import React from 'react';
import { TowerType } from '../../types/game';
import { TOWER_CONFIG } from '../../config/gameConfig';

interface TowerSelectorProps {
  selectedTowerType: TowerType | null;
  onSelectTower: (type: TowerType | null) => void;
  resources: number;
}

export const TowerSelector: React.FC<TowerSelectorProps> = ({
  selectedTowerType,
  onSelectTower,
  resources
}) => {
  const towerTypes: TowerType[] = ['basic', 'area', 'slow', 'resource'];

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-white font-bold mb-3">Tower Selection</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {towerTypes.map(type => {
          const config = TOWER_CONFIG[type];
          const cost = config.cost[0];
          const canAfford = resources >= cost;
          const isSelected = selectedTowerType === type;
          
          return (
            <button
              key={type}
              onClick={() => onSelectTower(isSelected ? null : type)}
              disabled={!canAfford}
              className={`
                p-3 rounded-lg border-2 transition-all
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
                className="w-8 h-8 mx-auto mb-2 rounded"
                style={{ backgroundColor: config.color }}
              />
              
              <div className="text-white text-sm">
                <div className="font-bold">{config.name}</div>
                <div className="text-yellow-400">${cost}</div>
                <div className="text-xs opacity-75 mt-1">{config.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedTowerType && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <div className="text-white text-sm">
            <strong>Selected:</strong> {TOWER_CONFIG[selectedTowerType].name}
            <br />
            <span className="text-xs opacity-75">
              Click on the map to place tower
            </span>
          </div>
        </div>
      )}
    </div>
  );
};