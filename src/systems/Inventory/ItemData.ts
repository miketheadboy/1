import { ItemType, type Item } from './InventoryTypes';

export const ITEMS: Record<string, Item> = {
    hardtack: {
        id: 'hardtack',
        name: 'Hardtack',
        type: ItemType.Food,
        description: 'Hard, dry biscuits that last forever but taste like cardboard.',
        effects: { hunger: -15 },
        value: 2,
    },
    dried_meat: {
        id: 'dried_meat',
        name: 'Dried Meat',
        type: ItemType.Food,
        description: 'Salted and dried beef. Filling and long-lasting.',
        effects: { hunger: -25 },
        value: 5,
    },
    fresh_provisions: {
        id: 'fresh_provisions',
        name: 'Fresh Provisions',
        type: ItemType.Food,
        description: 'Fresh bread, vegetables, and meat. Delicious but spoils quickly.',
        effects: { hunger: -40, morale: 5 },
        value: 10,
    },
    cornmeal: {
        id: 'cornmeal',
        name: 'Cornmeal',
        type: ItemType.Food,
        description: 'Ground corn for making johnnycakes and mush.',
        effects: { hunger: -20 },
        value: 3,
    },
    bandages: {
        id: 'bandages',
        name: 'Bandages',
        type: ItemType.Medicine,
        description: 'Clean cloth strips for treating wounds.',
        effects: { health: 10 },
        value: 5,
    },
    tonic: {
        id: 'tonic',
        name: 'Medicine Tonic',
        type: ItemType.Medicine,
        description: 'Patent medicine. May or may not work, but it lifts the spirits.',
        effects: { health: 20, morale: 5 },
        value: 12,
    },
    knife: {
        id: 'knife',
        name: 'Bowie Knife',
        type: ItemType.Weapon,
        description: 'A heavy knife popular on the frontier. Good for close quarters.',
        effects: {},
        weaponStats: { damage: 15, accuracy: 90 },
        value: 8,
    },
    pistol: {
        id: 'pistol',
        name: 'Colt Revolver',
        type: ItemType.Weapon,
        description: 'A six-shooter. Reliable and deadly.',
        effects: {},
        weaponStats: { damage: 30, accuracy: 75 },
        value: 25,
    },
    rifle: {
        id: 'rifle',
        name: 'Sharps Rifle',
        type: ItemType.Weapon,
        description: 'A breech-loading rifle known for its accuracy and range.',
        effects: {},
        weaponStats: { damage: 50, accuracy: 85 },
        value: 45,
    },
};

export const STARTING_ITEMS: { itemId: string; quantity: number }[] = [
    { itemId: 'hardtack', quantity: 2 },
    { itemId: 'dried_meat', quantity: 1 },
];
