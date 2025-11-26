import React from 'react';
import { useGameStore, Scene } from '../core/GameState';
import { CombatActionType } from '../systems/Combat/CombatTypes';
import { useFXStore } from '../systems/FX/FXManager';
import { audioManager } from '../systems/Audio/AudioManager';
import { particleSystemRef } from '../App';

export const CombatScene: React.FC = () => {
    const { combatManager, playerManager, performCombatAction, gameLog, setScene } = useGameStore();
    const state = combatManager.getState();

    if (!state.isActive || !state.enemy) {
        // Combat ended or invalid state
        return (
            <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-200">
                <div className="text-center">
                    <h2 className="text-2xl mb-4">Combat Ended</h2>
                    <button
                        onClick={() => setScene(Scene.Gameplay)}
                        className="px-6 py-2 bg-stone-700 hover:bg-stone-600 rounded"
                    >
                        Return to Game
                    </button>
                </div>
            </div>
        );
    }

    const playerStats = playerManager.getStats();

    return (
        <div className="w-full h-screen bg-stone-900 text-stone-200 flex flex-col p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-stone-700 pb-4">
                <h1 className="text-3xl font-serif text-red-500">COMBAT</h1>
                <div className="text-stone-400">
                    Turn: {state.turnCount}
                </div>
            </div>

            {/* Main Combat Area */}
            <div className="flex-1 flex gap-8">
                {/* Player Side */}
                <div className="flex-1 bg-stone-800 p-6 rounded border border-stone-700">
                    <h2 className="text-xl font-bold mb-4 text-amber-500">You</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Health:</span>
                            <span className={playerStats.health < 30 ? 'text-red-500' : 'text-green-500'}>
                                {playerStats.health} / 100
                            </span>
                        </div>
                        <div className="w-full bg-stone-900 h-2 rounded overflow-hidden">
                            <div
                                className="bg-green-600 h-full transition-all duration-500"
                                style={{ width: `${playerStats.health}%` }}
                            />
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold text-stone-400 mb-2">Equipment</h3>
                            {/* Show equipped weapon if any */}
                            <div className="text-sm">
                                Weapon: {state.distance > 20 ? 'Rifle (Effective)' : 'Pistol (Effective)'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center / Action Area */}
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="text-center mb-8">
                        <div className="text-4xl font-bold mb-2">{state.distance}m</div>
                        <div className="text-stone-500">Distance</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <button
                            onClick={() => {
                                performCombatAction(CombatActionType.Shoot);
                                useFXStore.getState().triggerShake(10, 0.2);
                                particleSystemRef?.emitSmoke(window.innerWidth / 2, window.innerHeight / 2);
                                audioManager.playSFX('shoot');
                            }}
                            className="p-4 bg-red-900/50 border border-red-700 hover:bg-red-800 transition-colors rounded flex flex-col items-center"
                        >
                            <span className="font-bold text-lg">SHOOT</span>
                            <span className="text-xs text-stone-400">Ranged Attack</span>
                        </button>
                        <button
                            onClick={() => {
                                performCombatAction(CombatActionType.Melee);
                                useFXStore.getState().triggerShake(5, 0.1);
                                audioManager.playSFX('hit');
                            }}
                            className="p-4 bg-stone-700 border border-stone-600 hover:bg-stone-600 transition-colors rounded flex flex-col items-center"
                            disabled={state.distance > 5}
                        >
                            <span className="font-bold text-lg">MELEE</span>
                            <span className="text-xs text-stone-400">Close Quarters</span>
                        </button>
                        <button
                            onClick={() => {
                                performCombatAction(CombatActionType.Reload);
                                audioManager.playSFX('reload');
                            }}
                            className="p-4 bg-stone-700 border border-stone-600 hover:bg-stone-600 transition-colors rounded flex flex-col items-center"
                        >
                            <span className="font-bold text-lg">RELOAD</span>
                            <span className="text-xs text-stone-400">Prepare Weapon</span>
                        </button>
                        <button
                            onClick={() => performCombatAction(CombatActionType.Flee)}
                            className="p-4 bg-amber-900/30 border border-amber-700 hover:bg-amber-900/50 transition-colors rounded flex flex-col items-center"
                        >
                            <span className="font-bold text-lg">FLEE</span>
                            <span className="text-xs text-stone-400">Escape Combat</span>
                        </button>
                    </div>

                    <div className="mt-8 w-full bg-stone-950 p-4 rounded h-32 overflow-y-auto font-mono text-sm border border-stone-800">
                        {gameLog.slice(0, 5).map((log, i) => (
                            <div key={i} className="mb-1 text-stone-300">{log}</div>
                        ))}
                    </div>
                </div>

                {/* Enemy Side */}
                <div className="flex-1 bg-stone-800 p-6 rounded border border-stone-700">
                    <h2 className="text-xl font-bold mb-4 text-red-500">{state.enemy.name}</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Health:</span>
                            <span>{state.enemy.health} / {state.enemy.maxHealth}</span>
                        </div>
                        <div className="w-full bg-stone-900 h-2 rounded overflow-hidden">
                            <div
                                className="bg-red-600 h-full transition-all duration-500"
                                style={{ width: `${(state.enemy.health / state.enemy.maxHealth) * 100}%` }}
                            />
                        </div>
                        <p className="mt-4 text-sm text-stone-400 italic">
                            {state.enemy.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
