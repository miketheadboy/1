import React, { useState, useEffect } from 'react';
import { useGameStore } from '../core/GameState';
import { SaveManager } from '../systems/SaveLoad/SaveManager';
import type { SaveSlot } from '../systems/SaveLoad/SaveTypes';

interface SaveLoadMenuProps {
    mode: 'save' | 'load';
    onClose: () => void;
}

export const SaveLoadMenu: React.FC<SaveLoadMenuProps> = ({ mode, onClose }) => {
    const { saveGame, loadGame } = useGameStore();
    const [saves, setSaves] = useState<SaveSlot[]>([]);
    const [newSaveName, setNewSaveName] = useState('');
    const saveManager = new SaveManager();

    const refreshSaves = () => {
        setSaves(saveManager.getSaveList());
    };

    useEffect(() => {
        refreshSaves();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = () => {
        if (!newSaveName.trim()) return;
        const slotId = `save_${Date.now()}`;
        saveGame(slotId, newSaveName);
        setNewSaveName('');
        refreshSaves();
        if (mode === 'save') {
            // Optional: Close after save? Or just show success?
            // For now, let's keep it open so they can see it.
        }
    };

    const handleLoad = (slotId: string) => {
        if (window.confirm('Are you sure you want to load this game? Unsaved progress will be lost.')) {
            loadGame(slotId);
            onClose();
        }
    };

    const handleDelete = (slotId: string) => {
        if (window.confirm('Are you sure you want to delete this save?')) {
            saveManager.deleteSave(slotId);
            refreshSaves();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-stone-900 border-2 border-stone-700 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b border-stone-800 flex justify-between items-center bg-stone-950">
                    <h2 className="text-2xl font-bold text-amber-600 font-serif uppercase tracking-widest">
                        {mode === 'save' ? 'Save Game' : 'Load Game'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-stone-500 hover:text-stone-300 transition-colors"
                        aria-label="Close Menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                    {mode === 'save' && (
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newSaveName}
                                onChange={(e) => setNewSaveName(e.target.value)}
                                placeholder="Enter save name..."
                                className="flex-1 bg-stone-950 border border-stone-700 p-3 rounded text-stone-200 focus:border-amber-600 focus:outline-none"
                            />
                            <button
                                onClick={handleSave}
                                disabled={!newSaveName.trim()}
                                className="bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-bold transition-colors"
                            >
                                SAVE
                            </button>
                        </div>
                    )}

                    <div className="space-y-3">
                        {saves.length === 0 ? (
                            <div className="text-center text-stone-600 italic py-8">No saved games found.</div>
                        ) : (
                            saves.map((save) => (
                                <div key={save.id} className="bg-stone-800/50 border border-stone-700 p-4 rounded hover:border-stone-500 transition-colors flex justify-between items-center group">
                                    <div>
                                        <div className="font-bold text-lg text-stone-300">{save.name}</div>
                                        <div className="text-xs text-stone-500 flex gap-4 mt-1">
                                            <span>{save.date}</span>
                                            <span className="text-amber-700/70">{save.data.currentLocationId}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {mode === 'load' && (
                                            <button
                                                onClick={() => handleLoad(save.id)}
                                                className="bg-stone-700 hover:bg-green-700 text-stone-300 hover:text-white px-3 py-1 rounded text-sm font-bold transition-colors"
                                            >
                                                LOAD
                                            </button>
                                        )}
                                        {mode === 'save' && (
                                            <button
                                                onClick={() => handleSave()}
                                                className="hidden"
                                                aria-label="Overwrite Save"
                                            >
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(save.id)}
                                            className="bg-stone-700 hover:bg-red-900/80 text-stone-300 hover:text-red-200 px-3 py-1 rounded text-sm font-bold transition-colors"
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
