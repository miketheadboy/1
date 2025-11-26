import React from 'react';
import { useGameStore } from '../core/GameState';


export const ContainerPanel: React.FC = () => {
    const { containers, currentLocationId, openContainer } = useGameStore();
    const locationContainers = containers[currentLocationId] || [];

    if (locationContainers.length === 0) {
        return null;
    }

    return (
        <div className="game-panel p-5 mt-5 text-stone-300 border-t border-stone-700">
            <h3 className="text-xl font-serif text-amber-500 mb-3">Containers</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                {locationContainers.map(container => (
                    <div key={container.id} className={`
                        border border-stone-600 p-3 rounded
                        ${container.isOpen ? 'bg-stone-900/50 opacity-70' : 'bg-stone-800'}
                    `}>
                        <div className="flex justify-between items-center mb-2">
                            <strong className="text-amber-100">{container.name}</strong>
                            <span className="text-xs text-stone-500">
                                {container.isOpen ? 'Open' : (container.isLocked ? 'Locked' : 'Closed')}
                            </span>
                        </div>

                        {container.isOpen ? (
                            <div className="text-sm text-stone-600 italic">
                                Empty
                            </div>
                        ) : (
                            <button
                                onClick={() => openContainer(container.id)}
                                className="game-btn w-full py-1 px-2 text-sm rounded"
                            >
                                {container.isLocked ? 'Unlock' : 'Open'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
