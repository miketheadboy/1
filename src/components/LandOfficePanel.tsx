import React, { useState } from 'react';
import { useGameStore } from '../core/GameState';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import { LocationType } from '../systems/World/WorldTypes';

export const LandOfficePanel: React.FC = () => {
    const { currentLocationId, buyLand, playerManager, farmingSystem } = useGameStore();
    const currentLocation = INITIAL_MAP_NODES[currentLocationId];
    const stats = playerManager.getStats();
    const ownedAcres = farmingSystem.getOwnedAcres();

    const [acresToBuy, setAcresToBuy] = useState<number>(10);
    const pricePerAcre = 10; // Fixed for now

    if (currentLocation?.type !== LocationType.Town) {
        return null;
    }

    const totalCost = acresToBuy * pricePerAcre;
    const canAfford = stats.money >= totalCost;

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm mt-4">
            <div className="flex justify-between items-center mb-3 border-b border-stone-600 pb-2">
                <h2 className="text-xl font-bold text-blue-400">Land Office</h2>
                <div className="text-sm text-stone-300">
                    Owned: <span className="text-green-400 font-bold">{ownedAcres} acres</span>
                </div>
            </div>

            <div className="bg-stone-900 p-4 rounded">
                <p className="text-stone-400 mb-4 text-sm">
                    Purchase land deeds to expand your homestead. Land is required for farming and ranching.
                </p>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-xs text-stone-500 mb-1">Acres to Buy</label>
                        <input
                            type="number"
                            value={acresToBuy}
                            onChange={(e) => setAcresToBuy(Math.max(1, parseInt(e.target.value)))}
                            className="bg-stone-700 text-stone-200 rounded p-2 w-full"
                            min="1"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-stone-500 mb-1">Cost</label>
                        <div className="text-xl font-bold text-amber-400">${totalCost}</div>
                    </div>
                </div>

                <button
                    onClick={() => buyLand(acresToBuy)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded font-bold transition-colors ${canAfford
                            ? 'bg-blue-700 hover:bg-blue-600 text-white'
                            : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                        }`}
                >
                    PURCHASE DEED
                </button>
            </div>
        </div>
    );
};
