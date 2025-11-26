import React from 'react';
import { useGameStore } from '../core/GameState';
import { ScavengeRiskLevel } from '../systems/Scavenge/ScavengeTypes';

export const ScavengePanel: React.FC = () => {
    const { scavengeNodes, scavenge, playerManager } = useGameStore();

    // Filter nodes for current location if we had location-specific nodes in state
    // But currently GameState stores nodes for the current location only (regenerated on travel)
    // So we just use all nodes in state.

    // However, we need to make sure nodes are generated when entering a location.
    // For now, let's assume they are or we trigger generation if empty?
    // Actually, GameState travelTo spawns animals, we should add spawnScavengeNodes there too.
    // But for now, let's just display what we have.

    const getRiskColorClass = (risk: ScavengeRiskLevel) => {
        switch (risk) {
            case ScavengeRiskLevel.Safe: return 'text-green-500';
            case ScavengeRiskLevel.Low: return 'text-lime-500';
            case ScavengeRiskLevel.Medium: return 'text-yellow-500';
            case ScavengeRiskLevel.High: return 'text-orange-500';
            case ScavengeRiskLevel.Deadly: return 'text-red-500';
            default: return 'text-white';
        }
    };

    const stats = playerManager.getStats();
    const scavengingSkill = playerManager.getSkill('scavenging');

    return (
        <div className="game-panel p-5 text-stone-300">
            <h2 className="text-2xl font-serif text-amber-500 mb-2">Scavenge Area</h2>
            <p className="mb-4 text-stone-400">Search the area for supplies. Scavenging takes 1 day and carries risks.</p>

            <div className="mb-5 p-2 bg-stone-800 rounded border border-stone-700 inline-block">
                <strong className="text-amber-100">Scavenging Skill: {scavengingSkill}</strong>
            </div>

            {scavengeNodes.length === 0 ? (
                <p className="italic text-stone-500">No scavengeable locations found nearby.</p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                    {scavengeNodes.map(node => (
                        <div key={node.id} className={`
                            border border-stone-700 p-4 rounded
                            ${node.isDepleted ? 'bg-stone-900/50 opacity-60' : 'bg-stone-800'}
                        `}>
                            <h3 className="text-lg font-bold text-amber-100 mt-0 mb-1">{node.name}</h3>
                            <p className="text-sm text-stone-400 mb-3">{node.description}</p>

                            <div className="flex justify-between mb-3 text-sm">
                                <span>Difficulty: {node.difficulty}</span>
                                <span className={getRiskColorClass(node.riskLevel)}>Risk: {node.riskLevel}</span>
                            </div>

                            {node.isDepleted ? (
                                <div className="text-stone-600 italic">Depleted</div>
                            ) : (
                                <button
                                    onClick={() => scavenge(node.id)}
                                    disabled={stats.health <= 10} // Too injured to scavenge
                                    className={`
                                        w-full py-2 px-3 rounded font-bold transition-colors
                                        ${stats.health <= 10
                                            ? 'bg-stone-700 text-stone-500 cursor-not-allowed'
                                            : 'game-btn cursor-pointer'}
                                    `}
                                >
                                    Scavenge (1 Day)
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
