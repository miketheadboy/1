import type { PlayerStats } from '../Survival/PlayerStats';
import type { FactionReputation } from '../Factions/FactionTypes';
import type { CharacterBackground } from '../Character/CharacterTypes';

export interface SaveData {
    version: string;
    timestamp: number;
    currentDate: string; // ISO string
    currentLocationId: string;
    characterBackground: CharacterBackground | null;
    playerStats: PlayerStats;
    inventory: { item: string; quantity: number }[]; // Simplified for storage
    reputations: Record<string, FactionReputation>;
    gameLog: string[];
    seenEvents: string[]; // IDs of events already triggered
    gameOver: boolean;
}

export interface SaveSlot {
    id: string;
    name: string;
    date: string;
    data: SaveData;
}
