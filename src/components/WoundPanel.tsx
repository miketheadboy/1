import React from 'react';
import { useGameStore } from '../core/GameState';
import { WoundSeverity } from '../systems/Wounds/WoundTypes';

export const WoundPanel: React.FC = () => {
    const { woundManager, inventoryManager, addLog } = useGameStore();
    const { bodyParts } = woundManager.getState();
    const inventory = inventoryManager.getItems();

    const handleTreat = (woundId: string, itemType: string) => {
        // Check if player has item
        // This is a simplified check, ideally we'd check for specific item IDs
        // For now, let's assume 'bandage' corresponds to an item with id 'bandage'
        const hasItem = inventory.some(i => i.item.id === itemType && i.quantity > 0);

        if (!hasItem) {
            addLog(`You don't have any ${itemType}s!`);
            return;
        }

        const result = woundManager.treatWound(woundId, itemType);
        if (result.success) {
            inventoryManager.removeItem(itemType, 1);
            addLog(result.message);
        } else {
            addLog(result.message);
        }
    };

    const getSeverityColor = (severity: WoundSeverity) => {
        switch (severity) {
            case WoundSeverity.Minor: return 'text-yellow-400';
            case WoundSeverity.Moderate: return 'text-orange-500';
            case WoundSeverity.Severe: return 'text-red-600';
            case WoundSeverity.Critical: return 'text-red-900 font-bold';
            default: return 'text-stone-400';
        }
    };

    return (
        <div className="game-panel p-4 text-stone-300">
            <h2 className="text-2xl font-serif text-amber-600 mb-4 border-b border-stone-700 pb-2">Body Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(bodyParts).map(part => (
                    <div key={part.part} className={`p-3 rounded border ${part.health < 50 ? 'border-red-900 bg-red-900/20' : 'border-stone-700 bg-stone-800'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">{part.part}</span>
                            <span className={`${part.health < 30 ? 'text-red-500' : 'text-stone-400'}`}>
                                {Math.round(part.health)}%
                            </span>
                        </div>

                        {/* Health Bar */}
                        <div className="w-full bg-stone-900 h-2 rounded mb-3 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${part.health < 30 ? 'bg-red-700' : 'bg-green-700'}`}
                                style={{ width: `${part.health}%` }}
                            />
                        </div>

                        {part.isCrippled && (
                            <div className="text-red-600 font-bold mb-2 uppercase tracking-widest text-xs">CRIPPLED</div>
                        )}

                        {part.wounds.length > 0 ? (
                            <div className="space-y-2">
                                {part.wounds.map(wound => (
                                    <div key={wound.id} className="bg-stone-900/50 p-2 rounded text-sm">
                                        <div className="flex justify-between">
                                            <span className={`${getSeverityColor(wound.severity)}`}>
                                                {WoundSeverity[wound.severity]} {wound.type}
                                            </span>
                                            {wound.isTreated ? (
                                                <span className="text-green-500 text-xs uppercase">Treated</span>
                                            ) : (
                                                <span className="text-red-400 text-xs uppercase animate-pulse">Bleeding</span>
                                            )}
                                        </div>

                                        {!wound.isTreated && (
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    onClick={() => handleTreat(wound.id, 'bandage')}
                                                    className="game-btn text-xs py-1 px-2"
                                                    title="Use Bandage"
                                                >
                                                    Bandage
                                                </button>
                                                <button
                                                    onClick={() => handleTreat(wound.id, 'whiskey')}
                                                    className="game-btn text-xs py-1 px-2"
                                                    title="Disinfect with Whiskey"
                                                >
                                                    Whiskey
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-stone-600 italic text-sm">No injuries</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
