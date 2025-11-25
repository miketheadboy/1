import { useGameStore } from '../core/GameState';
import { ItemType } from '../systems/Inventory/InventoryTypes';
import { useState } from 'react';

export const InventoryPanel: React.FC = () => {
    const inventoryManager = useGameStore(state => state.inventoryManager);
    const useItemAction = useGameStore(state => state.useItem);
    const [expanded, setExpanded] = useState(true);
    const items = inventoryManager.getItems();

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
        <div className="bg-stone-800 rounded border border-stone-600 shadow-sm">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-3 flex justify-between items-center hover:bg-stone-700 transition-colors"
            >
                <h2 className="text-lg font-bold text-amber-500">Inventory</h2>
                <span className="text-stone-400 text-sm">
                    {expanded ? '▼' : '▶'} {items.length} items
                </span>
            </button>

            {expanded && (
                <div className="p-3 pt-0 space-y-2 max-h-64 overflow-y-auto">
                    {items.length === 0 ? (
                        <p className="text-stone-500 text-sm italic text-center py-4">
                            No items in inventory
                        </p>
                    ) : (
                        items.map(({ item, quantity }) => (
                            <div
                                key={item.id}
                                className="bg-stone-900 p-2 rounded border border-stone-700 hover:border-stone-600 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-stone-200">{item.name}</span>
                                            <span className={`text-xs ${getItemTypeColor(item.type)}`}>
                                                {item.type}
                                            </span>
                                        </div>
                                        <p className="text-xs text-stone-500 mt-1">{item.description}</p>
                                    </div>
                                    <span className="text-sm text-stone-400 ml-2">x{quantity}</span>
                                </div>

                                <div className="flex justify-between items-center mt-2">
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
                                    {(item.type === ItemType.Food || item.type === ItemType.Medicine) && (
                                        <button
                                            onClick={() => useItemAction(item.id)}
                                            className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded transition-colors"
                                        >
                                            Use
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
