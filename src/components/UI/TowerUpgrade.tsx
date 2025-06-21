import React from 'react';
import { Tower } from '../../types/game';
import { TOWER_CONFIG } from '../../config/gameConfig';
import { ArrowUp, X, Trash2 } from 'lucide-react';

interface TowerUpgradeProps {
  tower: Tower | null;
  resources: number;
  onUpgrade: (towerId: string) => void;
  onSell: (towerId: string) => void;
  onClose: () => void;
}

export const TowerUpgrade: React.FC<TowerUpgradeProps> = ({
  tower,
  resources,
  onUpgrade,
  onSell,
  onClose
}) => {
  if (!tower) return null;

  const config = TOWER_CONFIG[tower.type];
  const canUpgrade = tower.level < 2;
  const upgradeCost = canUpgrade ? config.cost[tower.level + 1] : 0;
  const canAfford = resources >= upgradeCost;
  const sellValue = config.sellValue[tower.level];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Tower Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded"
              style={{ backgroundColor: config.color }}
            />
            <div>
              <h3 className="text-white font-bold">{config.name}</h3>
              <p className="text-gray-400 text-sm">Level {tower.level + 1}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-gray-400">Damage</div>
              <div className="text-white font-bold">
                {config.damage[tower.level]}
              </div>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-gray-400">Range</div>
              <div className="text-white font-bold">
                {config.range[tower.level]}
              </div>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-gray-400">Fire Rate</div>
              <div className="text-white font-bold">
                {(1000 / config.fireRate[tower.level]).toFixed(1)}/s
              </div>
            </div>
            
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-gray-400">Sell Value</div>
              <div className="text-yellow-400 font-bold">
                ${sellValue}
              </div>
            </div>
          </div>
          
          {canUpgrade && (
            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-white font-bold mb-2">Next Level Preview</h4>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-gray-400">Damage</div>
                  <div className="text-green-400 font-bold">
                    {config.damage[tower.level]} → {config.damage[tower.level + 1]}
                  </div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-gray-400">Range</div>
                  <div className="text-green-400 font-bold">
                    {config.range[tower.level]} → {config.range[tower.level + 1]}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            {canUpgrade && (
              <button
                onClick={() => onUpgrade(tower.id)}
                disabled={!canAfford}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold
                  ${canAfford 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <ArrowUp className="w-4 h-4" />
                Upgrade ${upgradeCost}
              </button>
            )}
            
            <button
              onClick={() => onSell(tower.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
              Sell ${sellValue}
            </button>
          </div>
          
          {!canUpgrade && (
            <div className="text-center py-4">
              <div className="text-yellow-400 font-bold">MAX LEVEL</div>
              <div className="text-gray-400 text-sm">This tower is fully upgraded</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};