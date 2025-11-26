import React from 'react';
import { useGameStore } from '../core/GameState';

export const PoliticsPanel: React.FC = () => {
    const { politicsSystem, currentDate } = useGameStore();
    const state = politicsSystem.getState();

    const daysUntilElection = Math.ceil((state.electionDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm mt-4">
            <div className="flex justify-between items-center mb-3 border-b border-stone-600 pb-2">
                <h2 className="text-xl font-bold text-stone-300">Political Struggle</h2>
                <div className="text-sm text-stone-400">Election in {daysUntilElection} days</div>
            </div>

            <div className="bg-stone-900 p-4 rounded">
                <div className="flex justify-between text-sm font-bold mb-1">
                    <span className="text-blue-400">Free State</span>
                    <span className="text-red-400">Pro-Slavery</span>
                </div>
                <div className="h-4 bg-stone-700 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${state.freeStateSupport}%` }}
                    />
                    <div
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${state.slaveStateSupport}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-stone-500 mt-1">
                    <span>{state.freeStateSupport.toFixed(1)}%</span>
                    <span>{state.slaveStateSupport.toFixed(1)}%</span>
                </div>

                <p className="text-xs text-stone-500 mt-4 italic text-center">
                    "The fate of Kansas hangs in the balance. Every action you take influences the future."
                </p>
            </div>
        </div>
    );
};
