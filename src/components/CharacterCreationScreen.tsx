import React, { useState } from 'react';
import { BackgroundType, BACKGROUNDS } from '../systems/Character/CharacterTypes';
import { useGameStore } from '../core/GameState';

export const CharacterCreationScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [selectedBackground, setSelectedBackground] = useState<BackgroundType>(BackgroundType.FreeSoilFarmer);
    const { setCharacter } = useGameStore();

    const handleSelect = (bg: BackgroundType) => {
        setSelectedBackground(bg);
    };

    const handleConfirm = () => {
        setCharacter(BACKGROUNDS[selectedBackground]);
        onComplete();
    };

    const currentBg = BACKGROUNDS[selectedBackground];

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center p-8 font-serif">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Panel: Selection */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-stone-900 border-2 border-stone-800 p-6 rounded-lg shadow-xl">
                        <h1 className="text-3xl font-bold text-amber-600 mb-2 tracking-wide border-b border-stone-800 pb-4">SELECT ORIGIN</h1>
                        <p className="text-stone-500 text-sm mb-6 italic">Who were you before the bleeding began?</p>

                        <div className="space-y-3">
                            {Object.values(BACKGROUNDS).map((bg) => (
                                <button
                                    key={bg.type}
                                    onClick={() => handleSelect(bg.type)}
                                    className={`w-full text-left p-4 rounded border transition-all duration-200 group ${selectedBackground === bg.type
                                        ? 'bg-amber-900/30 border-amber-600/50 text-amber-100 shadow-[0_0_15px_rgba(217,119,6,0.15)]'
                                        : 'bg-stone-800/50 border-stone-700 hover:bg-stone-800 hover:border-stone-500 text-stone-400'
                                        }`}
                                >
                                    <div className="font-bold text-lg group-hover:text-amber-500 transition-colors">{bg.name}</div>
                                    <div className="text-xs text-stone-600 uppercase tracking-widest mt-1 group-hover:text-stone-500">Background</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Details */}
                <div className="lg:col-span-8">
                    <div className="bg-stone-900 border-2 border-stone-800 p-8 rounded-lg shadow-2xl h-full flex flex-col relative overflow-hidden">
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-900/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10 flex-1">
                            <h2 className="text-5xl font-bold text-amber-500 mb-4 tracking-tight">{currentBg.name}</h2>
                            <p className="text-xl text-stone-400 italic mb-8 leading-relaxed border-l-4 border-stone-700 pl-6 py-2">
                                "{currentBg.description}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-stone-950/50 p-6 rounded border border-stone-800">
                                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-stone-600 rounded-full"></span> Starting Stats
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center border-b border-stone-800/50 pb-2">
                                            <span className="text-stone-400">Money</span>
                                            <span className="text-green-400 font-mono font-bold text-lg">${currentBg.startingStats.money}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-stone-800/50 pb-2">
                                            <span className="text-stone-400">Health</span>
                                            <span className="text-red-400 font-mono font-bold text-lg">{currentBg.startingStats.health}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-stone-800/50 pb-2">
                                            <span className="text-stone-400">Morale</span>
                                            <span className="text-blue-400 font-mono font-bold text-lg">{currentBg.startingStats.morale}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-stone-950/50 p-6 rounded border border-stone-800">
                                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-stone-600 rounded-full"></span> Skills
                                    </h4>
                                    <div className="space-y-3">
                                        {Object.entries(currentBg.skills).map(([skill, level]) => (
                                            <div key={skill} className="flex items-center gap-3">
                                                <div className="w-24 text-sm text-stone-400 capitalize">{skill}</div>
                                                <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${level > 0 ? 'bg-amber-600' : 'bg-stone-700'}`}
                                                        style={{ width: `${(level / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className={`w-6 text-right font-mono font-bold ${level > 0 ? 'text-amber-500' : 'text-stone-600'}`}>
                                                    {level}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-stone-950/30 p-6 rounded border border-stone-800 mb-8">
                                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Starting Equipment</h4>
                                <div className="flex flex-wrap gap-3">
                                    {currentBg.startingItems.map((item, i) => (
                                        <div key={i} className="bg-stone-800 px-4 py-2 rounded border border-stone-600 flex items-center gap-2 shadow-sm">
                                            <span className="text-amber-500 font-bold">{item.quantity}x</span>
                                            <span className="text-stone-300 capitalize">{item.itemId.replace('_', ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-stone-800">
                            <button
                                onClick={handleConfirm}
                                className="bg-amber-700 hover:bg-amber-600 text-white px-10 py-4 rounded font-bold text-xl transition-all shadow-lg hover:shadow-amber-900/20 hover:-translate-y-1 flex items-center gap-3"
                            >
                                <span>BEGIN JOURNEY</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
