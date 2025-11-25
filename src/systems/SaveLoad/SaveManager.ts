import type { SaveData, SaveSlot } from './SaveTypes';
import type { GameState } from '../../core/GameState';

const SAVE_STORAGE_KEY = 'bleeding_kansas_saves';
const CURRENT_VERSION = '0.1.0';

export class SaveManager {
    private getSaves(): Record<string, SaveSlot> {
        const savesJson = localStorage.getItem(SAVE_STORAGE_KEY);
        return savesJson ? JSON.parse(savesJson) : {};
    }

    public saveGame(slotId: string, slotName: string, state: GameState): void {
        const saveData: SaveData = {
            version: CURRENT_VERSION,
            timestamp: Date.now(),
            currentDate: state.currentDate.toISOString(),
            currentLocationId: state.currentLocationId,
            characterBackground: state.characterBackground,
            playerStats: state.playerManager.getStats(),
            inventory: state.inventoryManager.getItems().map(i => ({ item: i.item.id, quantity: i.quantity })),
            reputations: state.factionManager.getReputations(),
            gameLog: state.gameLog,
            seenEvents: Array.from(state.eventManager.getSeenEvents()),
            gameOver: state.gameOver
        };

        const saves = this.getSaves();
        saves[slotId] = {
            id: slotId,
            name: slotName,
            date: new Date().toLocaleString(),
            data: saveData
        };

        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(saves));
        console.log(`Game saved to slot ${slotId}`);
    }

    public loadGame(slotId: string): SaveData | null {
        const saves = this.getSaves();
        const slot = saves[slotId];

        if (!slot) {
            console.error(`Save slot ${slotId} not found`);
            return null;
        }

        return slot.data;
    }

    public getSaveList(): SaveSlot[] {
        const saves = this.getSaves();
        return Object.values(saves).sort((a, b) => b.data.timestamp - a.data.timestamp);
    }
    public deleteSave(slotId: string): void {
        const saves = this.getSaves();
        delete saves[slotId];
        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(saves));
    }
}
