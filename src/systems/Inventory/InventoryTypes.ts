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
}

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    description: string;
    effects: ItemEffects;
    value: number; // Price in dollars
}

export interface InventoryItem {
    item: Item;
    quantity: number;
}

export interface InventoryState {
    items: Map<string, InventoryItem>;
}
