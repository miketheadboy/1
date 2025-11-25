import React, { useState } from 'react';
import { useGameStore } from '../core/GameState';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import { LocationType } from '../systems/World/WorldTypes';

export const SaloonPanel: React.FC = () => {
    const { currentLocationId, playerManager, addLog } = useGameStore();
    const currentLocation = INITIAL_MAP_NODES[currentLocationId];
    const stats = playerManager.getStats();

    const [betAmount, setBetAmount] = useState<number>(5);
    const [gameResult, setGameResult] = useState<string | null>(null);

    if (currentLocation?.type !== LocationType.Town) {
        return null;
    }

    const handleGamble = () => {
        if (stats.money < betAmount) {
            addLog("You don't have enough money to cover that bet!");
            return;
        }

        if (betAmount <= 0) {
            addLog("You must bet something!");
            return;
        }

        // Simple Dice Game: Roll 2d6. 7 or higher wins.
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        const total = roll1 + roll2;

        playerManager.modifyStat('money', -betAmount);

        if (total >= 7) {
            const winnings = betAmount * 2;
            playerManager.modifyStat('money', winnings);
            setGameResult(`You rolled ${total} (Win!). Won $${betAmount}.`);
            addLog(`Gambled $${betAmount} and won! (Rolled ${total})`);

            // Chance to improve trading skill (bluffing/reading people)
            if (Math.random() < 0.05) {
                playerManager.improveSkill('trading');
                addLog("Your gambling experience improved your Trading skill.");
            }
        } else {
            setGameResult(`You rolled ${total} (Loss). Lost $${betAmount}.`);
            addLog(`Gambled $${betAmount} and lost. (Rolled ${total})`);
        }
    };

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm mt-4">
            <div className="flex justify-between items-center mb-3 border-b border-stone-600 pb-2">
                <h2 className="text-xl font-bold text-amber-500">Local Saloon</h2>
                <div className="text-sm text-stone-300">
                    Money: <span className="text-amber-400 font-bold">${stats.money.toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-stone-900 p-4 rounded text-center">
                <h3 className="text-lg font-bold text-stone-300 mb-2">High Roller Dice</h3>
                <p className="text-xs text-stone-500 mb-4">Roll 7 or higher to double your money.</p>

                <div className="flex justify-center items-center gap-4 mb-4">
                    <button
                        onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                        className="bg-stone-700 px-3 py-1 rounded text-stone-300 hover:bg-stone-600"
                    >
                        -
                    </button>
                    <div className="text-xl font-bold text-amber-400 w-20">
                        ${betAmount}
                    </div>
                    <button
                        onClick={() => setBetAmount(Math.min(stats.money, betAmount + 1))}
                        className="bg-stone-700 px-3 py-1 rounded text-stone-300 hover:bg-stone-600"
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={handleGamble}
                    disabled={stats.money < betAmount}
                    className={`w-full py-2 rounded font-bold transition-colors ${stats.money >= betAmount
                            ? 'bg-amber-700 hover:bg-amber-600 text-white'
                            : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                        }`}
                >
                    ROLL THE DICE
                </button>

                {gameResult && (
                    <div className={`mt-4 p-2 rounded font-bold ${gameResult.includes('Win') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                        }`}>
                        {gameResult}
                    </div>
                )}
            </div>

            <div className="mt-3 text-xs text-stone-500 italic text-center">
                "The house doesn't always win, but it usually does."
            </div>
        </div>
    );
};
