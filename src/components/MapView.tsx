

import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import { useGameStore } from '../core/GameState';
import clsx from 'clsx';

interface MapViewProps {
    currentLocationId: string;
    onTravel: (nodeId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ currentLocationId, onTravel }) => {
    const { travelSystem } = useGameStore();
    const currentNode = INITIAL_MAP_NODES[currentLocationId];
    const connectedNodes = currentNode.connections.map(id => INITIAL_MAP_NODES[id]).filter(Boolean);

    const getTravelTime = (targetId: string) => {
        const distance = travelSystem.getDistance(currentLocationId, targetId);
        return travelSystem.getTravelTimeDays(distance, 'foot');
    };

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm h-full">
            <h2 className="text-xl font-bold text-amber-500 mb-2 border-b border-stone-600 pb-1">Territory Map</h2>

            <div className="mb-4">
                <h3 className="text-lg font-bold text-stone-200">{currentNode.name}</h3>
                <p className="text-stone-400 text-sm italic">{currentNode.biome} - {currentNode.type}</p>
                <p className="text-stone-300 mt-2">{currentNode.description}</p>
            </div>

            <div className="mt-4">
                <h4 className="text-md font-semibold text-stone-400 mb-2">Travel Routes:</h4>
                <div className="grid grid-cols-1 gap-2">
                    {connectedNodes.map(node => {
                        const days = getTravelTime(node.id);
                        return (
                            <button
                                key={node.id}
                                onClick={() => onTravel(node.id)}
                                className={clsx(
                                    "p-3 rounded text-left transition-colors border border-stone-600",
                                    "hover:bg-stone-700 hover:border-amber-600 group"
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-stone-200 group-hover:text-amber-500">{node.name}</span>
                                    <span className="text-xs text-stone-500 bg-stone-900 px-2 py-1 rounded">
                                        {days} Day{days !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500 mt-1 truncate">{node.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
