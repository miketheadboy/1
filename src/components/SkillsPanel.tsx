import React from 'react';
import { useGameStore } from '../core/GameState';

export const SkillsPanel: React.FC = () => {
    const { playerManager } = useGameStore();
    const stats = playerManager.getStats();
    const skills = stats.skills;

    if (!skills) return null;

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm mt-4">
            <h2 className="text-xl font-bold text-amber-500 mb-3 border-b border-stone-600 pb-2">Character</h2>

            <div className="mb-4 flex justify-between items-center bg-stone-900 p-2 rounded">
                <div>
                    <div className="text-xs text-stone-500 uppercase">Level</div>
                    <div className="text-2xl font-bold text-stone-200">{stats.level}</div>
                </div>
                <div className="flex-1 mx-4">
                    <div className="text-xs text-stone-500 mb-1 flex justify-between">
                        <span>XP</span>
                        <span>{Math.floor(stats.xp)} / {stats.level * 100}</span>
                    </div>
                    <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-600"
                            style={{ width: `${(stats.xp / (stats.level * 100)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <h3 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Skills</h3>
            <div className="space-y-2">
                {Object.entries(skills).map(([skillName, level]) => (
                    <div key={skillName} className="flex items-center gap-2">
                        <div className="w-24 text-sm text-stone-300 capitalize">{skillName}</div>
                        <div className="flex-1 h-2 bg-stone-900 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${level > 0 ? 'bg-blue-600' : 'bg-stone-700'}`}
                                style={{ width: `${Math.min(100, (level / 10) * 100)}%` }}
                            ></div>
                        </div>
                        <div className="w-6 text-right text-sm font-bold text-stone-400">{level}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
