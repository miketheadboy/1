import React from 'react';
import { useGameStore } from '../core/GameState';
import { KnowledgeType, XP_PER_LEVEL } from '../systems/Knowledge/KnowledgeTypes';

export const KnowledgePanel: React.FC = () => {
    const { knowledgeManager, inventoryManager, addLog } = useGameStore();
    const state = knowledgeManager.getState();
    const items = inventoryManager.getItems();

    // Find books in inventory
    const books = items.filter(item =>
        item.item.knowledgeType !== undefined &&
        item.item.xpValue !== undefined
    );

    const handleStudy = (bookId: string) => {
        const bookItem = items.find(i => i.item.id === bookId);
        if (bookItem && bookItem.item.knowledgeType && bookItem.item.xpValue) {
            // Check if we have enough energy/time? For now just do it.
            // Maybe consume "Study Time" resource later.

            const type = bookItem.item.knowledgeType as KnowledgeType;
            knowledgeManager.gainXp(type, bookItem.item.xpValue, addLog);

            // Optional: Consume book? Or just time?
            // "Studying takes time..."
            addLog(`You spent time studying ${bookItem.item.name}.`);
        }
    };

    return (
        <div className="knowledge-panel p-4 bg-stone-800 text-stone-200 rounded-lg shadow-lg border border-stone-600">
            <h2 className="text-2xl font-bold mb-4 text-amber-500 font-serif border-b border-stone-600 pb-2">Knowledge & Research</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Knowledge Levels */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-stone-300">Skills</h3>
                    <div className="space-y-4">
                        {Object.values(KnowledgeType).map(type => {
                            const level = state.levels[type];
                            const xp = state.xp[type];
                            const progress = (xp / (level * XP_PER_LEVEL)) * 100;

                            return (
                                <div key={type} className="bg-stone-700 p-3 rounded border border-stone-600">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-amber-100">{type}</span>
                                        <span className="text-sm text-stone-400">Lvl {level}</span>
                                    </div>
                                    <div className="w-full bg-stone-900 rounded-full h-2.5">
                                        <div
                                            className="bg-amber-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, progress)}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-right mt-1 text-stone-500">{xp} / {level * XP_PER_LEVEL} XP</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Study Materials */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-stone-300">Study Materials</h3>
                    {books.length === 0 ? (
                        <p className="text-stone-500 italic">You have no books to study.</p>
                    ) : (
                        <div className="space-y-3">
                            {books.map(book => (
                                <div key={book.item.id} className="bg-stone-700 p-3 rounded border border-stone-600 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-amber-100">{book.item.name}</div>
                                        <div className="text-xs text-stone-400">
                                            +{book.item.xpValue} XP to {book.item.knowledgeType}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStudy(book.item.id)}
                                        className="px-3 py-1 bg-amber-700 hover:bg-amber-600 text-white rounded text-sm transition-colors"
                                    >
                                        Study
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Unlocked Perks */}
                    <h3 className="text-xl font-semibold mt-6 mb-3 text-stone-300">Unlocked Perks</h3>
                    {state.unlockedPerks.length === 0 ? (
                        <p className="text-stone-500 italic">No perks unlocked yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {state.unlockedPerks.map(perkId => (
                                <div key={perkId} className="bg-green-900/30 border border-green-800 p-2 rounded">
                                    <span className="text-green-400 font-bold">{perkId.replace('_', ' ').toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
