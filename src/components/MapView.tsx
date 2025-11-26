import React from 'react';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import { useGameStore } from '../core/GameState';
import { TravelMode } from '../systems/World/TravelTypes';
import clsx from 'clsx';

interface MapViewProps {
    currentLocationId: string;
    onTravel: (nodeId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ currentLocationId, onTravel }) => {
    const { travelSystem, discoveredLocations, currentTravelMode, setTravelMode } = useGameStore();
    const currentNode = INITIAL_MAP_NODES[currentLocationId];

    // Fog of War: Get visible nodes
    const visibleNodes = travelSystem.getVisibleNodes(currentLocationId, discoveredLocations);
    const connectedNodes = currentNode.connections
        .map(id => INITIAL_MAP_NODES[id])
        .filter(node => node && visibleNodes.some(v => v.id === node.id));

    const getTravelTime = (targetId: string) => {
        const distance = travelSystem.getDistance(currentLocationId, targetId);
        return travelSystem.getTravelTimeDays(distance, currentTravelMode);
    };

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTravelMode(e.target.value as TravelMode);
    };

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-amber-500 mb-2 border-b border-stone-600 pb-1">Territory Map</h2>

            <div className="mb-4">
                <h3 className="text-lg font-bold text-stone-200">{currentNode.name}</h3>
                <p className="text-stone-400 text-sm italic">{currentNode.biome} - {currentNode.type}</p>
                <p className="text-stone-300 mt-2">{currentNode.description}</p>
            </div>

            {/* Travel Mode Selector */}
            <div className="mb-4 bg-stone-900 p-3 rounded border border-stone-700">
                <label htmlFor="travel-mode-select" className="block text-stone-400 text-xs uppercase font-bold mb-1">Travel Mode</label>
                <select
                    id="travel-mode-select"
                    title="Select Travel Mode"
                    value={currentTravelMode}
                    onChange={handleModeChange}
                    className="w-full bg-stone-800 text-stone-200 border border-stone-600 rounded p-2 text-sm focus:border-amber-500 outline-none"
                >
                    <option value={TravelMode.Foot}>On Foot (Slow, Safe)</option>
                    <option value={TravelMode.Horseback}>Horseback (Fast, Requires Horse)</option>
                    <option value={TravelMode.Wagon}>Wagon (Slow, High Capacity)</option>
                    <option value={TravelMode.Cart}>Cart (Medium Speed/Capacity)</option>
                </select>
            </div>

            <div className="flex-1 overflow-y-auto">
                <h4 className="text-md font-semibold text-stone-400 mb-2">Travel Routes:</h4>
                <div className="grid grid-cols-1 gap-2">
                    {connectedNodes.length === 0 ? (
                        <p className="text-stone-500 italic">No visible paths from here.</p>
                    ) : (
                        connectedNodes.map(node => {
                            const days = getTravelTime(node.id);
                            const isDiscovered = discoveredLocations.includes(node.id);

                            return (
                                <button
                                    key={node.id}
                                    onClick={() => onTravel(node.id)}
                                    className={clsx(
                                        "p-3 rounded text-left transition-colors border w-full",
                                        isDiscovered
                                            ? "bg-stone-800 border-stone-600 hover:bg-stone-700 hover:border-amber-600 group"
                                            : "bg-stone-900 border-stone-800 hover:bg-stone-800 hover:border-stone-600 border-dashed"
                                    )}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={clsx(
                                            "font-bold",
                                            isDiscovered ? "text-stone-200 group-hover:text-amber-500" : "text-stone-500"
                                        )}>
                                            {isDiscovered ? node.name : "Unknown Location"}
                                        </span>
                                        <span className="text-xs text-stone-500 bg-stone-900 px-2 py-1 rounded">
                                            {days} Day{days !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 mt-1 truncate">
                                        {isDiscovered ? node.description : "You haven't scouted this area yet."}
                                    </p>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
