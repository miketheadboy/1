import { ItemType, type Item } from './InventoryTypes';
import { EffectTrigger } from '../Combat/CombatTypes';

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
    whiskey: {
        id: 'whiskey',
        name: 'Whiskey',
        type: ItemType.Resource,
        description: 'A jug of corn whiskey. High value in dry towns.',
        effects: { morale: 15, health: -5 },
        value: 5,
    },
    furs: {
        id: 'furs',
        name: 'Furs',
        type: ItemType.Resource,
        description: 'Beaver and buffalo pelts. Valuable trade goods.',
        effects: {},
        value: 15,
    },
    tobacco: {
        id: 'tobacco',
        name: 'Tobacco',
        type: ItemType.Resource,
        description: 'Pipe tobacco. A common luxury.',
        effects: { morale: 5 },
        value: 4,
    },
    // Animals
    horse: {
        id: 'horse',
        name: 'Horse',
        type: ItemType.Resource,
        description: 'A sturdy riding horse. Increases travel speed.',
        effects: {},
        value: 150,
    },
    ox: {
        id: 'ox',
        name: 'Ox',
        type: ItemType.Resource,
        description: 'Strong draft animal. Essential for pulling wagons.',
        effects: {},
        value: 80,
    },
    mule: {
        id: 'mule',
        name: 'Mule',
        type: ItemType.Resource,
        description: 'Hardy pack animal.',
        effects: {},
        value: 60,
    },
    // Vehicles
    wagon: {
        id: 'wagon',
        name: 'Conestoga Wagon',
        type: ItemType.Tool,
        description: 'A heavy covered wagon. Requires 2 Oxen. Slow but carries a lot.',
        effects: {},
        value: 200,
    },
    cart: {
        id: 'cart',
        name: 'Hand Cart',
        type: ItemType.Tool,
        description: 'A small two-wheeled cart. Can be pulled by a mule or person.',
        effects: {},
        value: 50,
    },
    // Books
    bible: {
        id: 'bible',
        name: 'Holy Bible',
        type: ItemType.Tool,
        description: 'The Good Book. Study to gain Theology knowledge.',
        effects: { morale: 5 },
        value: 10,
        knowledgeType: 'Theology',
        xpValue: 20
    },
    law_book: {
        id: 'law_book',
        name: 'Blackstone\'s Commentaries',
        type: ItemType.Tool,
        description: 'A dense legal text. Study to gain Law knowledge.',
        effects: {},
        value: 25,
        knowledgeType: 'Law',
        xpValue: 20
    },
    tactics_manual: {
        id: 'tactics_manual',
        name: 'Hardee\'s Tactics',
        type: ItemType.Tool,
        description: 'Standard infantry manual. Study to gain Military knowledge.',
        effects: {},
        value: 30,
        knowledgeType: 'Military',
        xpValue: 20
    },
    sharps_rifle: {
        id: 'sharps_rifle',
        name: "Sharps Rifle",
        type: ItemType.Weapon,
        description: "A high-tech breech-loading rifle. Often shipped in crates marked 'Bibles'.",
        value: 50,
        weight: 4,
        effects: {},
        combatEffects: [
            {
                id: 'beechers_bibles_dmg',
                trigger: EffectTrigger.OnAttack,
                chance: 1.0,
                multiplier: 0.2, // +20%
                message: "Righteous fury guides your aim! (+20% Damage)",
                condition: (context: any) => context.knowledgeManager?.hasPerk('beechers_bibles')
            },
            {
                id: 'beechers_bibles_preach',
                trigger: EffectTrigger.OnNegotiate,
                chance: 0.8, // 80% chance
                message: "You preach with the fury of the Lord and the cold steel of a Sharps rifle!",
                condition: (context: any) => context.knowledgeManager?.hasPerk('beechers_bibles') && context.negotiationType === 'Preach'
            }
        ],
        weaponStats: {
            damage: 25,
            accuracy: 95,
            range: 100
        }
    },
    printing_press: {
        id: 'printing_press',
        name: "Printing Press",
        type: ItemType.Tool,
        description: "A heavy cast-iron press. The most dangerous weapon in the territory.",
        value: 200,
        weight: 50,
        effects: {
            reputation: 5 // Passive influence gain (to be implemented)
        }
    }
};

export const STARTING_ITEMS: { itemId: string; quantity: number }[] = [
    { itemId: 'hardtack', quantity: 2 },
    { itemId: 'dried_meat', quantity: 1 },
];
