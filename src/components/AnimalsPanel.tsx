import React from 'react';
import { useGameStore } from '../core/GameState';
import { ANIMAL_DATA } from '../systems/Animals/AnimalData';

export const AnimalsPanel: React.FC = () => {
    const { animalManager, huntAnimal } = useGameStore();
    const wildAnimals = animalManager.getWildAnimals();
    const domesticAnimals = animalManager.getDomesticAnimals();

    if (wildAnimals.length === 0 && domesticAnimals.length === 0) {
        return null;
    }

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm mt-4">
            <h2 className="text-xl font-bold text-amber-500 mb-3 border-b border-stone-600 pb-2">Animals</h2>

            {/* Domestic Animals */}
            {domesticAnimals.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Livestock & Pets</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {domesticAnimals.map(animal => {
                            const stats = ANIMAL_DATA[animal.type];
                            return (
                                <div key={animal.id} className="bg-stone-900 p-2 rounded border border-stone-700 flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-stone-200">{animal.name || stats.name}</div>
                                        <div className="text-xs text-stone-500">{stats.name}</div>
                                    </div>
                                    <div className="text-xs text-stone-400 text-right">
                                        {stats.perks?.travelSpeed && <div>Speed x{stats.perks.travelSpeed}</div>}
                                        {stats.perks?.carryCapacity && <div>Carry +{stats.perks.carryCapacity}</div>}
                                        {stats.perks?.combatBonus && <div>Combat +{stats.perks.combatBonus}</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Wild Animals */}
            {wildAnimals.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Wild Animals</h3>
                    <div className="space-y-2">
                        {wildAnimals.map(animal => {
                            const stats = ANIMAL_DATA[animal.type];
                            return (
                                <div key={animal.id} className="bg-stone-900 p-2 rounded border border-stone-700 flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-stone-200">{stats.name}</div>
                                        <div className="text-xs text-stone-500">{stats.description}</div>
                                        <div className="text-xs text-red-400 mt-1">Difficulty: {stats.huntDifficulty}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => huntAnimal(animal.id)}
                                            className="bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs px-3 py-1 rounded border border-stone-500 transition-colors"
                                        >
                                            Hunt
                                        </button>
                                        <button
                                            onClick={() => useGameStore.getState().fightAnimal(animal.id)}
                                            className="bg-red-900 hover:bg-red-800 text-red-100 text-xs px-3 py-1 rounded border border-red-700 transition-colors"
                                        >
                                            Fight
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
