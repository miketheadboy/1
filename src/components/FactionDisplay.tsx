import { FactionType } from '../systems/Factions/FactionTypes';
import type { FactionReputation } from '../systems/Factions/FactionTypes';

interface FactionDisplayProps {
    reputations: Record<string, FactionReputation>;
}

export const FactionDisplay: React.FC<FactionDisplayProps> = ({ reputations }) => {
    const majorFactions = Object.values(FactionType).map(faction => reputations[faction]).filter(Boolean);

    const getStatusColor = (status: FactionReputation['status']) => {
        switch (status) {
            case 'Allied': return 'text-green-400';
            case 'Friendly': return 'text-green-500';
            case 'Neutral': return 'text-stone-400';
            case 'Unfriendly': return 'text-orange-500';
            case 'Hostile': return 'text-red-500';
            default: return 'text-stone-400';
        }
    };

    const getBarColor = (value: number) => {
        if (value >= 75) return 'bg-green-500';
        if (value >= 25) return 'bg-green-600';
        if (value >= -25) return 'bg-stone-500';
        if (value >= -75) return 'bg-orange-600';
        return 'bg-red-600';
    };

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm flex-1">
            <h2 className="text-xl font-bold text-amber-500 mb-2 border-b border-stone-600 pb-1">Factions</h2>
            <div className="space-y-3">
                {majorFactions.map(faction => {
                    const percentage = ((faction.value + 100) / 200) * 100; // Convert -100 to 100 range to 0-100%
                    return (
                        <div key={faction.factionId} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-stone-200">{faction.factionId}</span>
                                <span className={`text-xs font-bold ${getStatusColor(faction.status)}`}>
                                    {faction.status}
                                </span>
                            </div>
                            <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${getBarColor(faction.value)}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="text-xs text-stone-500 text-right">{faction.value > 0 ? '+' : ''}{faction.value}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
