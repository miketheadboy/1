import type { LootTableEntry } from './LootTypes';

export enum ContainerType {
    Chest = 'Chest',
    Crate = 'Crate',
    Wagon = 'Wagon',
    Corpse = 'Corpse',
    Safe = 'Safe'
}

export interface GameContainer {
    id: string;
    name: string;
    type: ContainerType;
    isLocked: boolean;
    keyId?: string; // If locked, ID of item needed to open
    lootTable: LootTableEntry[];
    isOpen: boolean;
    items: { itemId: string; quantity: number }[]; // Items currently inside
    money: number;
}
