import type { CombatEffect } from '../Combat/CombatTypes';

export enum ItemType {
    Food = 'Food',
    Medicine = 'Medicine',
    Weapon = 'Weapon',
    Tool = 'Tool',
    Resource = 'Resource',
}

export interface ItemEffects {
    hunger?: number; // Negative values reduce hunger
    health?: number; // Positive values restore health
    morale?: number; // Positive/negative morale change
    reputation?: number; // Passive reputation/influence gain
}

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    description: string;
    effects: ItemEffects;
    weaponStats?: {
        damage: number;
        accuracy: number; // 0-100
        range?: number; // Effective range
    };
    value: number; // Price in dollars
    weight?: number; // Weight in lbs
    knowledgeType?: string; // For books/manuals
    xpValue?: number; // XP gained from studying
    combatEffects?: CombatEffect[];
}

export interface InventoryItem {
    item: Item;
    quantity: number;
}

export interface InventoryState {
    items: Map<string, InventoryItem>;
}
