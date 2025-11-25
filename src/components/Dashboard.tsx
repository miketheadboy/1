import React, { useState } from 'react';
import { useGameStore } from '../core/GameState';
import { StatsDisplay } from './StatsDisplay';
import { GameLog } from './GameLog';
import { MapView } from './MapView';
import { EventDisplay } from './EventDisplay';
import { FactionDisplay } from './FactionDisplay';
import { GameOverScreen } from './GameOverScreen';
import { InventoryPanel } from './InventoryPanel';
import { ShopPanel } from './ShopPanel';
import { CombatPanel } from './CombatPanel';
import { SaveLoadMenu } from './SaveLoadMenu';
import { AnimalsPanel } from './AnimalsPanel';
import { SkillsPanel } from './SkillsPanel';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';

export const Dashboard: React.FC = () => {
    const {
        playerManager,
        factionManager,
        currentDate,
        gameLog,
        currentLocationId,
        travelTo,
        currentEvent
    } = useGameStore();

    const [showMenu, setShowMenu] = useState(false);
    const [menuMode, setMenuMode] = useState<'save' | 'load'>('save');

    const stats = playerManager.getStats();
    const factionState = factionManager.getState();
    const currentLocation = INITIAL_MAP_NODES[currentLocationId];
    const hasShop = currentLocation?.hasShop || false;

    return (
        <div className="grid grid-cols-12 gap-4 h-full relative">
            <GameOverScreen />
            {currentEvent && <EventDisplay event={currentEvent} />}
            <CombatPanel />
            {showMenu && <SaveLoadMenu mode={menuMode} onClose={() => setShowMenu(false)} />}

            {/* Left Column: Stats & Info (3 cols) */}
            <div className="col-span-3 flex flex-col gap-4">
                <StatsDisplay stats={stats} date={currentDate} />
                <FactionDisplay reputations={factionState.reputations} />
                <SkillsPanel />
                <InventoryPanel />
                <AnimalsPanel />

                {/* System Menu Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => { setMenuMode('save'); setShowMenu(true); }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-500 py-2 rounded border border-stone-700 font-bold text-sm transition-colors"
                    >
                        SAVE GAME
                    </button>
                    <button
                        onClick={() => { setMenuMode('load'); setShowMenu(true); }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-500 py-2 rounded border border-stone-700 font-bold text-sm transition-colors"
                    >
                        LOAD GAME
                    </button>
                </div>
            </div>

            {/* Center Column: Map & Shop (6 cols) */}
            <div className="col-span-6 flex flex-col gap-4">
                <div className="flex-1">
                    <MapView currentLocationId={currentLocationId} onTravel={travelTo} />
                </div>
                {hasShop && <ShopPanel />}
            </div>

            {/* Right Column: Log (3 cols) */}
            <div className="col-span-3 h-full">
                <GameLog logs={gameLog} />
            </div>
        </div>
    );
};
