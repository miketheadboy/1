import React from 'react';
import { useGameStore } from '../core/GameState';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import type { Mission } from '../systems/UndergroundRailroad/UndergroundRailroadSystem';

export const SafehousePanel: React.FC = () => {
    const { currentLocationId, undergroundRailroadSystem, startMission, addLog } = useGameStore();
    const currentLocation = INITIAL_MAP_NODES[currentLocationId];

    const isSafehouse = undergroundRailroadSystem.checkForSafehouse(currentLocation);
    const activeMission = undergroundRailroadSystem.getActiveMission();

    if (!isSafehouse) {
        return null;
    }

    const handleAcceptMission = () => {
        if (activeMission) {
            addLog("You already have an active mission.");
            return;
        }

        const newMission: Mission = {
            id: `mission_${Date.now()}`,
            type: 'escort',
            targetLocationId: 'nebraska_border', // Placeholder
            reward: 100,
            description: "Escort a group of 5 escaped slaves to the Nebraska border.",
            slavesCount: 5
        };

        startMission(newMission);
    };

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm mt-4">
            <div className="flex justify-between items-center mb-3 border-b border-stone-600 pb-2">
                <h2 className="text-xl font-bold text-stone-300">Underground Railroad Safehouse</h2>
            </div>

            <div className="bg-stone-900 p-4 rounded">
                <p className="text-stone-400 mb-4">
                    You are in a safe location known to the abolitionist network.
                </p>

                {activeMission ? (
                    <div className="bg-amber-900/30 p-3 rounded border border-amber-700">
                        <h3 className="font-bold text-amber-500">Active Mission</h3>
                        <p className="text-sm text-stone-300">{activeMission.description}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h3 className="font-bold text-stone-300">Available Missions</h3>
                        <div className="bg-stone-800 p-3 rounded border border-stone-700 flex justify-between items-center">
                            <div>
                                <div className="font-bold text-stone-200">Escort to Freedom</div>
                                <div className="text-xs text-stone-500">Reward: $100</div>
                            </div>
                            <button
                                onClick={handleAcceptMission}
                                className="bg-stone-600 hover:bg-stone-500 text-stone-200 px-3 py-1 rounded text-sm transition-colors"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
