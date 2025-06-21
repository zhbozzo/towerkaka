import React, { useState } from 'react';
import { ShopUpgrade, SpecialTower } from '../../types/game';
import { SHOP_UPGRADES, SPECIAL_TOWERS, TOWER_RARITIES, GAME_CONFIG } from '../../config/gameConfig';
import { ArrowLeft, ShoppingCart, Check, Star, Lock, RefreshCw, Sparkles } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'roulette' | 'upgrades' | 'towers'>('roulette');
  const [rouletteResult, setRouletteResult] = useState<SpecialTower | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAnimation, setSpinAnimation] = useState(0);

  const canAfford = (cost: number) => coins >= cost;
  const isOwned = (upgradeId: string) => ownedUpgrades.includes(upgradeId);
  const isTowerUnlocked = (towerId: string) => unlockedTowers.includes(towerId);

  const handleRouletteSpin = async () => {
    if (!canAfford(GAME_CONFIG.ROULETTE_COST) || isSpinning) return;
    
    setIsSpinning(true);
    setRouletteResult(null);
    
    // Animate the roulette wheel
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    setSpinAnimation(spins * 360);
    
    // Simulate spinning animation
    setTimeout(() => {
      const result = onRoulette();
      setRouletteResult(result);
      setIsSpinning(false);
    }, 3000);
  };

  const getRarityColor = (rarity: string) => {
    return TOWER_RARITIES[rarity as keyof typeof TOWER_RARITIES]?.color || '#FFFFFF';
  };

  const getRarityChance = (rarity: string) => {
    return TOWER_RARITIES[rarity as keyof typeof TOWER_RARITIES]?.chance || 0;
  };

  const unlockedTowersData = SPECIAL_TOWERS.filter(tower => isTowerUnlocked(tower.id));
  const lockedTowersData = SPECIAL_TOWERS.filter(tower => !isTowerUnlocked(tower.id));

  // Create roulette wheel segments
  const rouletteSegments = Object.entries(TOWER_RARITIES).map(([rarity, data], index) => ({
    rarity,
    color: data.color,
    chance: data.chance,
    angle: (360 / Object.keys(TOWER_RARITIES).length) * index
  }));

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
            onClick={() => setActiveTab('roulette')}
            className={`px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'roulette' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Tower Roulette
          </button>
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
            Tower Collection
          </button>
        </div>

        {/* Roulette Tab */}
        {activeTab === 'roulette' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 text-center border border-purple-500">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                Mystical Tower Roulette
                <Sparkles className="w-8 h-8 text-purple-400" />
              </h2>
              
              <div className="mb-8 relative">
                {/* Roulette Wheel */}
                <div className="relative w-64 h-64 mx-auto">
                  <div 
                    className={`w-full h-full rounded-full border-8 border-yellow-500 relative overflow-hidden transition-transform duration-3000 ease-out ${
                      isSpinning ? 'animate-spin' : ''
                    }`}
                    style={{ 
                      transform: `rotate(${spinAnimation}deg)`,
                      background: `conic-gradient(${rouletteSegments.map((segment, index) => 
                        `${segment.color} ${(360 / rouletteSegments.length) * index}deg ${(360 / rouletteSegments.length) * (index + 1)}deg`
                      ).join(', ')})`
                    }}
                  >
                    {/* Roulette segments with text */}
                    {rouletteSegments.map((segment, index) => (
                      <div
                        key={segment.rarity}
                        className="absolute w-full h-full flex items-center justify-center text-white font-bold text-xs"
                        style={{
                          transform: `rotate(${(360 / rouletteSegments.length) * index + (360 / rouletteSegments.length) / 2}deg)`,
                          transformOrigin: 'center'
                        }}
                      >
                        <span 
                          className="absolute"
                          style={{ 
                            top: '20px',
                            transform: `rotate(-${(360 / rouletteSegments.length) * index + (360 / rouletteSegments.length) / 2}deg)`
                          }}
                        >
                          {segment.rarity.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500"></div>
                  </div>
                  
                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-800 rounded-full border-4 border-yellow-500 flex items-center justify-center">
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Spin the mystical roulette to unlock special towers! Each spin costs {GAME_CONFIG.ROULETTE_COST} coins.
                </p>
                <p className="text-yellow-400 text-sm mb-4">
                  ⚠️ You might get duplicate towers - collect them all to master your arsenal!
                </p>
                
                <button
                  onClick={handleRouletteSpin}
                  disabled={!canAfford(GAME_CONFIG.ROULETTE_COST) || isSpinning}
                  className={`px-8 py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105 ${
                    canAfford(GAME_CONFIG.ROULETTE_COST) && !isSpinning
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSpinning ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Spinning the Wheel...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Spin Roulette ({GAME_CONFIG.ROULETTE_COST} coins)
                    </div>
                  )}
                </button>
              </div>
              
              {rouletteResult && (
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg mb-6 border-2" style={{ borderColor: getRarityColor(rouletteResult.rarity) }}>
                  <h3 className="text-xl font-bold text-white mb-2">🎉 Roulette Result!</h3>
                  <div 
                    className="text-3xl font-bold mb-2"
                    style={{ color: getRarityColor(rouletteResult.rarity) }}
                  >
                    {rouletteResult.name}
                  </div>
                  <div className="text-gray-300 mb-2">{rouletteResult.description}</div>
                  <div className="text-blue-300 text-sm">{rouletteResult.special}</div>
                  {isTowerUnlocked(rouletteResult.id) ? (
                    <div className="mt-3 text-yellow-400 font-bold">
                      ⚡ Duplicate! This tower is now enhanced in your collection!
                    </div>
                  ) : (
                    <div className="mt-3 text-green-400 font-bold">
                      ✨ New tower unlocked for battle!
                    </div>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <h4 className="col-span-full text-white font-bold mb-2">Rarity Chances</h4>
                {Object.entries(TOWER_RARITIES).map(([rarity, data]) => (
                  <div key={rarity} className="bg-gray-700 p-3 rounded border-l-4" style={{ borderColor: data.color }}>
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
              <h2 className="text-2xl font-bold text-white mb-4">Your Tower Collection</h2>
              {unlockedTowersData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unlockedTowersData.map((tower) => {
                    const duplicateCount = unlockedTowers.filter(id => id === tower.id).length;
                    
                    return (
                      <div
                        key={tower.id}
                        className="bg-gray-800 rounded-lg p-6 border-2"
                        style={{ borderColor: getRarityColor(tower.rarity) }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div 
                            className="w-12 h-12 rounded"
                            style={{ backgroundColor: tower.color }}
                          />
                          <div className="flex items-center gap-2">
                            <div 
                              className="px-3 py-1 rounded text-sm font-bold text-white"
                              style={{ backgroundColor: getRarityColor(tower.rarity) }}
                            >
                              {tower.rarity.toUpperCase()}
                            </div>
                            {duplicateCount > 1 && (
                              <div className="bg-yellow-600 px-2 py-1 rounded text-xs font-bold text-white">
                                x{duplicateCount}
                              </div>
                            )}
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
                        
                        {duplicateCount > 1 && (
                          <div className="mt-3 text-center">
                            <div className="text-yellow-400 text-sm font-bold">
                              Enhanced Tower! +{(duplicateCount - 1) * 10}% effectiveness
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">No towers in your collection yet</div>
                  <div className="text-gray-500">Spin the roulette to unlock special towers!</div>
                </div>
              )}
            </div>

            {/* Locked Towers Preview */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Undiscovered Towers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {lockedTowersData.map((tower) => (
                  <div
                    key={tower.id}
                    className="bg-gray-800 rounded-lg p-4 border-2 border-gray-600 opacity-60"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded bg-gray-600 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div 
                        className="px-2 py-1 rounded text-xs font-bold text-white"
                        style={{ backgroundColor: getRarityColor(tower.rarity) }}
                      >
                        {tower.rarity.toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-bold text-gray-400 mb-1">{tower.name}</h3>
                    <p className="text-gray-500 text-xs">Unlock through roulette</p>
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