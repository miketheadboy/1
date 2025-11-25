import type { FactionType, NativeTribe } from '../Factions/FactionTypes';

export interface GameEventOption {
    id: string;
    text: string;
    description?: string;
    requirements?: {
        money?: number;
        reputation?: { faction: FactionType | NativeTribe; min: number };
    };
    effects: {
        money?: number;
        morale?: number;
        health?: number;
        hunger?: number;
        reputationChanges?: { faction: FactionType | NativeTribe; amount: number }[];
        addItems?: string[];
        triggerEventId?: string; // Chain events
    };
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    date?: Date; // If it's a historical event triggered by date
    triggerCondition?: (gameState: unknown) => boolean; // Dynamic trigger
    options: GameEventOption[];
    isUnique?: boolean; // If true, only happens once
}
