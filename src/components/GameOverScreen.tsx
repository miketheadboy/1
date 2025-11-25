import { useGameStore } from '../core/GameState';

export const GameOverScreen: React.FC = () => {
    const { deathReason, currentDate, playerManager } = useGameStore();
    const stats = playerManager.getStats();

    const handleRestart = () => {
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-stone-900 border-4 border-red-900 rounded-lg p-8 max-w-md w-full shadow-2xl">
                <h1 className="text-4xl font-bold text-red-500 mb-4 text-center">You Have Died</h1>

                <div className="bg-stone-800 p-4 rounded border border-stone-700 mb-6">
                    <p className="text-stone-300 text-center italic mb-4">{deathReason}</p>
                    <div className="text-sm text-stone-400 space-y-1">
                        <div className="flex justify-between">
                            <span>Date of Death:</span>
                            <span className="text-stone-200">{currentDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Final Health:</span>
                            <span className="text-red-500">{stats.health}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Final Hunger:</span>
                            <span className="text-orange-500">{stats.hunger}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Final Morale:</span>
                            <span className="text-blue-400">{stats.morale}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Money:</span>
                            <span className="text-amber-400">${stats.money.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleRestart}
                    className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded transition-colors"
                >
                    Restart Game
                </button>

                <p className="text-xs text-stone-600 text-center mt-4">
                    "Bleeding Kansas" - A tale of survival and conflict
                </p>
            </div>
        </div>
    );
};
