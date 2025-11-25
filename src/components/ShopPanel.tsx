import { useGameStore } from '../core/GameState';
import { ITEMS } from '../systems/Inventory/ItemData';
import { ItemType } from '../systems/Inventory/InventoryTypes';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';

export const ShopPanel: React.FC = () => {
    const { currentLocationId, playerManager, buyItem, addLog } = useGameStore();
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
        // Trading posts have more variety
        if (currentLocation.type === 'Trading Post') {
            return true;
        }
        return false;
    });

    const handleBuy = (itemId: string, quantity: number = 1) => {
        const item = ITEMS[itemId];
        const totalCost = item.value * quantity;

        if (stats.money < totalCost) {
            addLog('Not enough money!');
            return;
        }

        buyItem(itemId, quantity);
    };

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
                <h2 className="text-xl font-bold text-amber-500">General Store</h2>
                <div className="text-sm text-stone-300">
                    Money: <span className="text-amber-400 font-bold">${stats.money.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableItems.map(item => {
                    const canAfford = stats.money >= item.value;
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
                                    <div className="text-lg font-bold text-amber-400">${item.value.toFixed(2)}</div>
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
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleBuy(item.id, 1)}
                                        disabled={!canAfford}
                                        className={`text-xs px-3 py-1 rounded transition-colors ${canAfford
                                            ? 'bg-green-700 hover:bg-green-600 text-white'
                                            : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                                            }`}
                                    >
                                        Buy 1
                                    </button>
                                    <button
                                        onClick={() => handleBuy(item.id, 5)}
                                        disabled={stats.money < item.value * 5}
                                        className={`text-xs px-3 py-1 rounded transition-colors ${stats.money >= item.value * 5
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

            <div className="mt-3 pt-3 border-t border-stone-700 text-xs text-stone-500 italic text-center">
                {currentLocation.type === 'Trading Post'
                    ? 'Trading posts offer the best selection of goods.'
                    : 'Basic supplies available. Visit a trading post for more variety.'}
            </div>
        </div>
    );
};
