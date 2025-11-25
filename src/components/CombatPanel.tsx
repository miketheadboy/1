import React from 'react';
import { useGameStore } from '../core/GameState';
import { CombatActionType } from '../systems/Combat/CombatTypes';

export const CombatPanel: React.FC = () => {
    const { combatManager } = useGameStore();
    const combatState = combatManager.getState();

    // Force re-render when combat state changes (since CombatManager isn't a store itself, 
    // we rely on GameState updates to trigger re-renders, which we'll ensure in GameState actions)

    if (!combatState.isActive || !combatState.enemy) return null;

    const handleAction = (action: CombatActionType) => {
        useGameStore.getState().performCombatAction(action);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-stone-900 border-2 border-red-900 rounded-lg p-6 max-w-2xl w-full shadow-2xl">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-red-500 mb-2">COMBAT ENCOUNTER</h2>
                    <div className="text-xl text-stone-300">{combatState.enemy.name}</div>
                    <div className="text-sm text-stone-500">{combatState.enemy.description}</div>
                </div>

                {/* Health Bars */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                        <div className="text-stone-400 text-sm mb-1">YOU</div>
                        <div className="h-4 bg-stone-800 rounded overflow-hidden border border-stone-600">
                            <div
                                className="h-full bg-green-600 transition-all duration-300"
                                style={{ width: `${(combatState.playerHealth / combatState.playerMaxHealth) * 100}%` }}
                            />
                        </div>
                        <div className="text-right text-xs text-stone-500 mt-1">
                            {combatState.playerHealth} / {combatState.playerMaxHealth}
                        </div>
                    </div>
                    <div>
                        <div className="text-stone-400 text-sm mb-1 text-right">ENEMY</div>
                        <div className="h-4 bg-stone-800 rounded overflow-hidden border border-stone-600">
                            <div
                                className="h-full bg-red-600 transition-all duration-300"
                                style={{ width: `${(combatState.enemy.health / combatState.enemy.maxHealth) * 100}%` }}
                            />
                        </div>
                        <div className="text-right text-xs text-stone-500 mt-1">
                            {combatState.enemy.health} / {combatState.enemy.maxHealth}
                        </div>
                    </div>
                </div>

                {/* Combat Log */}
                <div className="bg-stone-950 p-4 rounded border border-stone-800 h-48 overflow-y-auto mb-6 font-mono text-sm">
                    {combatState.combatLog.map((log, i) => (
                        <div key={i} className={`mb-1 ${i === 0 ? 'text-white font-bold' : 'text-stone-500'}`}>
                            {i === 0 ? '> ' : ''}{log}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-4 gap-4">
                    <button
                        onClick={() => handleAction(CombatActionType.Attack)}
                        className="bg-red-900 hover:bg-red-800 text-white py-3 rounded border border-red-700 font-bold transition-colors"
                    >
                        ATTACK
                    </button>
                    <button
                        onClick={() => handleAction(CombatActionType.Defend)}
                        className="bg-stone-700 hover:bg-stone-600 text-white py-3 rounded border border-stone-500 font-bold transition-colors"
                    >
                        DEFEND
                    </button>
                    <button
                        onClick={() => handleAction(CombatActionType.Negotiate)}
                        className="bg-blue-900 hover:bg-blue-800 text-white py-3 rounded border border-blue-700 font-bold transition-colors"
                    >
                        NEGOTIATE
                    </button>
                    <button
                        onClick={() => handleAction(CombatActionType.Flee)}
                        className="bg-amber-900 hover:bg-amber-800 text-white py-3 rounded border border-amber-700 font-bold transition-colors"
                    >
                        FLEE
                    </button>
                </div>
            </div>
        </div>
    );
};
