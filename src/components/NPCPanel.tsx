import React, { useState } from 'react';
import { useGameStore } from '../core/GameState';
import type { NPC } from '../systems/NPCs/NPCData';

export const NPCPanel: React.FC = () => {
    const { currentLocationId, npcSystem, interactWithNPC } = useGameStore();
    const npcs = npcSystem.getNPCsAtLocation(currentLocationId);
    const citizens = npcSystem.getCitizensAtLocation(currentLocationId);
    const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);

    if (npcs.length === 0 && citizens.length === 0) {
        return null;
    }

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm mt-4">
            <h2 className="text-xl font-bold text-stone-300 mb-3 border-b border-stone-600 pb-2">
                People
            </h2>

            {!selectedNPC ? (
                <div className="space-y-4">
                    {npcs.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Historical Figures</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {npcs.map(npc => (
                                    <button
                                        key={npc.id}
                                        onClick={() => setSelectedNPC(npc)}
                                        className="bg-stone-700 hover:bg-stone-600 p-3 rounded text-left transition-colors flex items-center gap-3"
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-stone-900 ${npc.relationship === 'friend' ? 'bg-green-500' :
                                            npc.relationship === 'lover' ? 'bg-pink-500' :
                                                npc.relationship === 'rival' ? 'bg-orange-500' :
                                                    npc.relationship === 'enemy' ? 'bg-red-500' :
                                                        'bg-stone-500'
                                            }`}>
                                            {npc.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-stone-200">{npc.name}</div>
                                            <div className="text-xs text-stone-400">{npc.title}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {citizens.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Locals</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {citizens.map(citizen => (
                                    <div key={citizen.id} className="bg-stone-700 p-3 rounded flex items-center gap-3 opacity-75">
                                        <div className="w-8 h-8 bg-stone-600 rounded-full flex items-center justify-center text-sm font-bold text-stone-300">
                                            {citizen.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-stone-300 text-sm">{citizen.name}</div>
                                            <div className="text-xs text-stone-500">{citizen.ethnicity} {citizen.job}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-stone-900 p-4 rounded">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-stone-200">{selectedNPC.name}</h3>
                            <div className="text-sm text-stone-400">{selectedNPC.title}</div>
                            <div className={`text-xs font-bold uppercase mt-1 ${selectedNPC.relationship === 'friend' ? 'text-green-400' :
                                selectedNPC.relationship === 'lover' ? 'text-pink-400' :
                                    selectedNPC.relationship === 'rival' ? 'text-orange-400' :
                                        selectedNPC.relationship === 'enemy' ? 'text-red-400' :
                                            'text-stone-500'
                                }`}>
                                {selectedNPC.relationship}
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedNPC(null)}
                            className="text-stone-500 hover:text-stone-300"
                        >
                            Back
                        </button>
                    </div>

                    <p className="text-stone-300 italic mb-4">"{selectedNPC.description}"</p>
                    <p className="text-stone-400 text-sm mb-6 border-l-2 border-stone-700 pl-3">{selectedNPC.biography}</p>

                    <div className="space-y-2">
                        {selectedNPC.dialogue
                            .filter(option => !option.reqRelationship || option.reqRelationship.includes(selectedNPC.relationship))
                            .map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => interactWithNPC(selectedNPC.id, option.id)}
                                    className="w-full text-left bg-stone-800 hover:bg-stone-700 p-3 rounded border border-stone-600 transition-colors"
                                >
                                    <div className="text-sm font-bold text-stone-200">{option.text}</div>
                                    {option.effect && (
                                        <div className="text-xs text-stone-500 mt-1 flex gap-2">
                                            {option.effect.moneyCost && <span className="text-amber-500">-${option.effect.moneyCost}</span>}
                                            {option.effect.politicalChange && <span className="text-blue-400">Politics</span>}
                                            {option.effect.reputationChange && <span className="text-green-400">Reputation</span>}
                                            {option.effect.relationshipChange && <span className="text-purple-400">Relationship</span>}
                                            {option.effect.recruit && <span className="text-yellow-400">Recruit</span>}
                                        </div>
                                    )}
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};
