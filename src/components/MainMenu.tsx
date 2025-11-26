import React from 'react';
import { useGameStore, Scene } from '../core/GameState';

export const MainMenu: React.FC = () => {
    const { setScene } = useGameStore();

    const handleNewGame = () => {
        setScene(Scene.CharacterCreation);
    };

    const handleLoadGame = () => {
        // For now, just load slot 1 if it exists, or show a simple prompt
        // Ideally we'd show a load menu, but for MVP let's just try to load 'autosave' or 'slot1'
        // Or switch to a LoadGame scene/menu
        // For simplicity, let's just start new game for now or add a placeholder
        alert("Load Game functionality to be implemented in SaveLoadMenu");
    };

    return (
        <div className="w-full h-screen bg-stone-900 flex flex-col items-center justify-center text-stone-200 font-serif">
            <h1 className="text-6xl mb-8 text-amber-600 font-bold tracking-wider">BLEEDING KANSAS</h1>
            <p className="text-xl mb-12 italic text-stone-400">A Story of Struggle and Survival on the Frontier</p>

            <div className="flex flex-col gap-4 w-64">
                <button
                    onClick={handleNewGame}
                    className="px-6 py-3 bg-stone-800 border border-stone-600 hover:bg-stone-700 hover:border-amber-600 transition-colors text-lg"
                >
                    New Game
                </button>
                <button
                    onClick={handleLoadGame}
                    className="px-6 py-3 bg-stone-800 border border-stone-600 hover:bg-stone-700 hover:border-amber-600 transition-colors text-lg"
                >
                    Load Game
                </button>
                <button
                    className="px-6 py-3 bg-stone-800 border border-stone-600 hover:bg-stone-700 hover:border-amber-600 transition-colors text-lg opacity-50 cursor-not-allowed"
                >
                    Options
                </button>
            </div>

            <div className="mt-16 text-stone-600 text-sm">
                v0.1.0 - Pre-Alpha
            </div>
        </div>
    );
};
