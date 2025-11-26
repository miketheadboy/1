import React, { useState } from 'react';
import { useGameStore } from '../core/GameState';
import { CropType } from '../systems/Farming/FarmingSystem';

export const FarmPanel: React.FC = () => {
    const { farmingSystem, plantCrop, harvestCrop } = useGameStore();
    const crops = farmingSystem.getCrops();

    const [selectedCrop, setSelectedCrop] = useState<CropType>(CropType.Corn);
    const [acres, setAcres] = useState<number>(1);

    // Only show if player has farming skill or is a farmer background?
    // For now, show always, but maybe collapse it
    // Or maybe only show if they own land? (Not implemented yet)
    // Let's assume they have a small plot.

    return (
        <div className="bg-stone-800 p-4 rounded border border-stone-600 shadow-sm mt-4">
            <div className="flex justify-between items-center mb-3 border-b border-stone-600 pb-2">
                <h2 className="text-xl font-bold text-green-600">Homestead</h2>
            </div>

            <div className="bg-stone-900 p-4 rounded mb-4">
                <h3 className="font-bold text-stone-300 mb-2">Plant Crops</h3>
                <div className="flex gap-2 mb-2">
                    <select
                        title="Select Crop"
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                        className="bg-stone-700 text-stone-200 rounded p-1"
                    >
                        {Object.values(CropType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <input
                        title="Acres to Plant"
                        type="number"
                        value={acres}
                        onChange={(e) => setAcres(Math.max(1, parseInt(e.target.value)))}
                        className="bg-stone-700 text-stone-200 rounded p-1 w-16"
                        min="1"
                    />
                    <span className="text-stone-400 self-center">acres</span>
                </div>
                <button
                    onClick={() => plantCrop(selectedCrop, acres)}
                    className="bg-green-800 hover:bg-green-700 text-green-100 px-4 py-1 rounded font-bold w-full"
                >
                    Plant ($2/acre)
                </button>
            </div>

            <div className="space-y-2">
                <h3 className="font-bold text-stone-300">Fields</h3>
                {crops.length === 0 && <p className="text-stone-500 italic">No crops planted.</p>}
                {crops.map((crop, index) => (
                    <div key={index} className="bg-stone-700 p-2 rounded flex justify-between items-center">
                        <div>
                            <div className="font-bold text-stone-200">{crop.type} ({crop.acres} acres)</div>
                            <div className={`text-xs ${crop.status === 'Ready' ? 'text-green-400 font-bold' :
                                crop.status === 'Dead' ? 'text-red-500' : 'text-stone-400'
                                }`}>
                                {crop.status}
                            </div>
                        </div>
                        {crop.status === 'Ready' && (
                            <button
                                onClick={() => harvestCrop(index)}
                                className="bg-amber-700 hover:bg-amber-600 text-white px-2 py-1 rounded text-sm"
                            >
                                Harvest
                            </button>
                        )}
                        {crop.status === 'Dead' && (
                            <button
                                onClick={() => harvestCrop(index)} // Reuse harvest to clear dead crops? Need a clear action.
                                className="bg-red-900 hover:bg-red-800 text-white px-2 py-1 rounded text-sm"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
