import { useGameStore } from '../core/GameState';
import { ITEMS } from '../systems/Inventory/ItemData';
import { ItemType } from '../systems/Inventory/InventoryTypes';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import { ANIMAL_DATA } from '../systems/Animals/AnimalData';
import { AnimalCategory, AnimalType } from '../systems/Animals/AnimalTypes';

export const ShopPanel: React.FC = () => {
    const { currentLocationId, playerManager, buyItem, buyAnimal } = useGameStore();
    const currentLocation = INITIAL_MAP_NODES[currentLocationId];
    const stats = playerManager.getStats();

    if (!currentLocation?.hasShop) {
        return null;
    }

    // Get available items based on location
    const availableItems = Object.values(ITEMS).filter(item => {
        // All shops have basic food and medicine
        if (item.type === ItemType.Food || item.type === ItemType.Medicine) {
            return true;
        }
        // Trading posts and towns have more variety
        if (currentLocation.type === 'Trading Post' || currentLocation.type === 'Town') {
            return true;
        }
        return false;
    });

    // Get available animals (only domestic ones in towns/trading posts)
    const availableAnimals = Object.values(ANIMAL_DATA).filter(animal => {
        if (animal.category === AnimalCategory.DOMESTIC) {
            if (currentLocation.type === 'Town' || currentLocation.type === 'Trading Post') {
                return true;
            }
        }
        return false;
    });

    const getItemTypeColor = (type: ItemType) => {
        switch (type) {
            case ItemType.Food: return 'text-green-400';
            case ItemType.Medicine: return 'text-red-400';
            case ItemType.Weapon: return 'text-orange-400';
            case ItemType.Tool: return 'text-blue-400';
            case ItemType.Resource: return 'text-amber-400';
            default: return 'text-stone-400';
        }
    };

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm">
            <div className="flex justify-between items-center mb-3 border-b border-stone-600 pb-2">
                <h2 className="text-xl font-bold text-amber-500">General Store & Stable</h2>
                <div className="text-sm text-stone-300">
                    Money: <span className="text-amber-400 font-bold">${stats.money.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Items Section */}
                <div>
                    <h3 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Goods</h3>
                    <div className="space-y-2">
                        {availableItems.map(item => {
                            const price = item.value;
                            const canAfford = stats.money >= price;
                            return (
                                <div
                                    key={item.id}
                                    className={`bg-stone-900 p-3 rounded border transition-colors ${canAfford ? 'border-stone-700 hover:border-stone-600' : 'border-stone-800 opacity-60'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-stone-200">{item.name}</span>
                                                <span className={`text-xs ${getItemTypeColor(item.type)}`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <p className="text-xs text-stone-500 mt-1">{item.description}</p>
                                        </div>
                                        <div className="text-right ml-3">
                                            <div className="text-lg font-bold text-amber-400">${price.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-xs text-stone-400 space-x-2">
                                            {item.effects.hunger && (
                                                <span className="text-green-400">
                                                    Hunger {item.effects.hunger > 0 ? '+' : ''}{item.effects.hunger}
                                                </span>
                                            )}
                                            {item.effects.health && (
                                                <span className="text-red-400">
                                                    Health +{item.effects.health}
                                                </span>
                                            )}
                                            {item.effects.morale && (
                                                <span className="text-blue-400">
                                                    Morale +{item.effects.morale}
                                                </span>
                                            )}
                                            {item.weaponStats && (
                                                <span className="text-orange-400">
                                                    Dmg: {item.weaponStats.damage} Acc: {item.weaponStats.accuracy}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => buyItem(item.id, 1)}
                                                disabled={!canAfford}
                                                className={`text-xs px-3 py-1 rounded transition-colors ${canAfford
                                                    ? 'bg-green-700 hover:bg-green-600 text-white'
                                                    : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                                                    }`}
                                            >
                                                Buy 1
                                            </button>
                                            <button
                                                onClick={() => buyItem(item.id, 5)}
                                                disabled={stats.money < price * 5}
                                                className={`text-xs px-3 py-1 rounded transition-colors ${stats.money >= price * 5
                                                    ? 'bg-green-700 hover:bg-green-600 text-white'
                                                    : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                                                    }`}
                                            >
                                                Buy 5
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Animals Section */}
                {availableAnimals.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Livestock</h3>
                        <div className="space-y-2">
                            {availableAnimals.map(animal => {
                                const price = animal.price || 0;
                                const canAfford = stats.money >= price;
                                return (
                                    <div
                                        key={animal.id}
                                        className={`bg-stone-900 p-3 rounded border transition-colors ${canAfford ? 'border-stone-700 hover:border-stone-600' : 'border-stone-800 opacity-60'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-stone-200">{animal.name}</span>
                                                    <span className="text-xs text-stone-400">Animal</span>
                                                </div>
                                                <p className="text-xs text-stone-500 mt-1">{animal.description}</p>
                                                <div className="text-xs text-stone-400 mt-1">
                                                    {animal.perks?.travelSpeed && <span>Speed x{animal.perks.travelSpeed} </span>}
                                                    {animal.perks?.carryCapacity && <span>Carry +{animal.perks.carryCapacity}lbs </span>}
                                                </div>
                                            </div>
                                            <div className="text-right ml-3">
                                                <div className="text-lg font-bold text-amber-400">${price.toFixed(2)}</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => buyAnimal(animal.id as AnimalType, price)}
                                                disabled={!canAfford}
                                                className={`text-xs px-3 py-1 rounded transition-colors ${canAfford
                                                    ? 'bg-green-700 hover:bg-green-600 text-white'
                                                    : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                                                    }`}
                                            >
                                                Purchase
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-3 pt-3 border-t border-stone-700 text-xs text-stone-500 italic text-center">
                {currentLocation.type === 'Trading Post'
                    ? 'Trading posts offer the best selection of goods.'
                    : 'Basic supplies available. Visit a trading post for more variety.'}
            </div>
        </div>
    );
};
