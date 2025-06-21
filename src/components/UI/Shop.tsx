import React, { useState } from 'react';
import { ShopUpgrade, SpecialTower } from '../../types/game';
import { SHOP_UPGRADES, SPECIAL_TOWERS, TOWER_RARITIES, GAME_CONFIG } from '../../config/gameConfig';
import { ArrowLeft, ShoppingCart, Check, Dice6, Star, Lock, RefreshCw } from 'lucide-react';

interface ShopProps {
  coins: number;
  ownedUpgrades: string[];
  unlockedTowers: string[];
  onPurchase: (upgradeId: string) => void;
  onPurchaseTower: (towerId: string) => void;
  onRoulette: () => SpecialTower | null;
  onBack: () => void;
}

export const Shop: React.FC<ShopProps> = ({ 
  coins, 
  ownedUpgrades, 
  unlockedTowers,
  onPurchase, 
  onPurchaseTower,
  onRoulette,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'upgrades' | 'towers' | 'roulette'>('upgrades');
  const [rouletteResult, setRouletteResult] = useState<SpecialTower | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const canAfford = (cost: number) => coins >= cost;
  const isOwned = (upgradeId: string) => ownedUpgrades.includes(upgradeId);
  const isTowerUnlocked = (towerId: string) => unlockedTowers.includes(towerId);

  const handleRouletteSpin = async () => {
    if (!canAfford(GAME_CONFIG.ROULETTE_COST) || isSpinning) return;
    
    setIsSpinning(true);
    
    // Simulate spinning animation
    setTimeout(() => {
      const result = onRoulette();
      setRouletteResult(result);
      setIsSpinning(false);
    }, 2000);
  };

  const getRarityColor = (rarity: string) => {
    return TOWER_RARITIES[rarity as keyof typeof TOWER_RARITIES]?.color || '#FFFFFF';
  };

  const getRarityChance = (rarity: string) => {
    return TOWER_RARITIES[rarity as keyof typeof TOWER_RARITIES]?.chance || 0;
  };

  const unlockedTowersData = SPECIAL_TOWERS.filter(tower => isTowerUnlocked(tower.id));
  const lockedTowersData = SPECIAL_TOWERS.filter(tower => !isTowerUnlocked(tower.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              Back
            </button>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="w-10 h-10" />
              Tower Shop
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-yellow-600 px-4 py-2 rounded-lg">
            <span className="text-white font-bold text-lg">{coins} Coins</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`px-6 py-3 rounded-lg font-bold transition-colors ${
              activeTab === 'upgrades' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Upgrades
          </button>
          <button
            onClick={() => setActiveTab('towers')}
            className={`px-6 py-3 rounded-lg font-bold transition-colors ${
              activeTab === 'towers' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Special Towers
          </button>
          <button
            onClick={() => setActiveTab('roulette')}
            className={`px-6 py-3 rounded-lg font-bold transition-colors ${
              activeTab === 'roulette' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tower Roulette
          </button>
        </div>

        {/* Upgrades Tab */}
        {activeTab === 'upgrades' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOP_UPGRADES.map((upgrade) => {
              const owned = isOwned(upgrade.id);
              const affordable = canAfford(upgrade.cost);
              
              return (
                <div
                  key={upgrade.id}
                  className={`bg-gray-800 rounded-lg p-6 border-2 transition-all ${
                    owned 
                      ? 'border-green-500 bg-green-900/20' 
                      : affordable 
                        ? 'border-blue-500 hover:border-blue-400' 
                        : 'border-gray-600 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{upgrade.icon}</div>
                    <div className="flex items-center gap-2">
                      {owned && <Check className="w-6 h-6 text-green-400" />}
                      <div className={`px-3 py-1 rounded text-sm font-bold ${
                        owned 
                          ? 'bg-green-600 text-white' 
                          : affordable 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                      }`}>
                        {owned ? 'OWNED' : `${upgrade.cost} Coins`}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{upgrade.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{upgrade.description}</p>
                  
                  {!owned && (
                    <button
                      onClick={() => onPurchase(upgrade.id)}
                      disabled={!affordable}
                      className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                        affordable
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {affordable ? 'Purchase' : 'Not Enough Coins'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Special Towers Tab */}
        {activeTab === 'towers' && (
          <div className="space-y-8">
            {/* Unlocked Towers */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Unlocked Towers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlockedTowersData.map((tower) => (
                  <div
                    key={tower.id}
                    className="bg-gray-800 rounded-lg p-6 border-2 border-green-500"
                    style={{ borderColor: getRarityColor(tower.rarity) }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded"
                        style={{ backgroundColor: tower.color }}
                      />
                      <div 
                        className="px-3 py-1 rounded text-sm font-bold text-white"
                        style={{ backgroundColor: getRarityColor(tower.rarity) }}
                      >
                        {tower.rarity.toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{tower.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{tower.description}</p>
                    <p className="text-blue-300 text-xs mb-4">{tower.special}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-700 p-2 rounded">
                        <div className="text-gray-400">Damage</div>
                        <div className="text-white font-bold">{tower.damage}</div>
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <div className="text-gray-400">Range</div>
                        <div className="text-white font-bold">{tower.range}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Towers */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Locked Towers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedTowersData.map((tower) => (
                  <div
                    key={tower.id}
                    className="bg-gray-800 rounded-lg p-6 border-2 border-gray-600 opacity-60"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded bg-gray-600 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                      <div 
                        className="px-3 py-1 rounded text-sm font-bold text-white"
                        style={{ backgroundColor: getRarityColor(tower.rarity) }}
                      >
                        {tower.rarity.toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-400 mb-2">{tower.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">Unlock through Tower Roulette</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Roulette Tab */}
        {activeTab === 'roulette' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Tower Roulette</h2>
              
              <div className="mb-8">
                <div className={`w-32 h-32 mx-auto rounded-full border-4 border-yellow-500 flex items-center justify-center ${
                  isSpinning ? 'animate-spin' : ''
                }`}>
                  <Dice6 className="w-16 h-16 text-yellow-500" />
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Spin the roulette to unlock special towers! Each spin costs {GAME_CONFIG.ROULETTE_COST} coins.
                </p>
                
                <button
                  onClick={handleRouletteSpin}
                  disabled={!canAfford(GAME_CONFIG.ROULETTE_COST) || isSpinning}
                  className={`px-8 py-4 rounded-lg font-bold text-xl transition-colors ${
                    canAfford(GAME_CONFIG.ROULETTE_COST) && !isSpinning
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSpinning ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Spinning...
                    </div>
                  ) : (
                    `Spin (${GAME_CONFIG.ROULETTE_COST} coins)`
                  )}
                </button>
              </div>
              
              {rouletteResult && (
                <div className="bg-gray-700 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">You got:</h3>
                  <div 
                    className="text-2xl font-bold mb-2"
                    style={{ color: getRarityColor(rouletteResult.rarity) }}
                  >
                    {rouletteResult.name}
                  </div>
                  <div className="text-gray-300">{rouletteResult.description}</div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {Object.entries(TOWER_RARITIES).map(([rarity, data]) => (
                  <div key={rarity} className="bg-gray-700 p-3 rounded">
                    <div 
                      className="font-bold mb-1"
                      style={{ color: data.color }}
                    >
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </div>
                    <div className="text-gray-300">{data.chance}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};