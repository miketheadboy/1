
import type { PlayerStats } from '../systems/Survival/PlayerStats';

interface StatsDisplayProps {
    stats: PlayerStats;
    date: Date;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, date }) => {
    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm">
            <h2 className="text-xl font-bold text-amber-500 mb-2 border-b border-stone-600 pb-1">Status</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-stone-400">Date:</span>
                    <span>{date.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-400">Health:</span>
                    <span className={stats.health < 50 ? 'text-red-500' : 'text-green-500'}>{stats.health}%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-400">Hunger:</span>
                    <span className={stats.hunger > 50 ? 'text-red-500' : 'text-green-500'}>{stats.hunger}%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-400">Morale:</span>
                    <span className={stats.morale < 40 ? 'text-yellow-500' : 'text-blue-400'}>{stats.morale}%</span>
                </div>
                <div className="flex justify-between col-span-2 mt-2 border-t border-stone-700 pt-2">
                    <span className="text-stone-400">Money:</span>
                    <span className="text-amber-400">${stats.money.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};
