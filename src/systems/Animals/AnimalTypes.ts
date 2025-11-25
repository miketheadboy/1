export enum AnimalType {
    // Wild
    BUFFALO = 'buffalo',
    DEER = 'deer',
    WOLF = 'wolf',
    COYOTE = 'coyote',
    RABBIT = 'rabbit',
    BEAR = 'bear',

    // Domestic
    HORSE = 'horse',
    OX = 'ox',
    MULE = 'mule',
    DOG = 'dog'
}

export enum AnimalCategory {
    WILD = 'wild',
    DOMESTIC = 'domestic'
}

export interface AnimalStats {
    id: AnimalType;
    name: string;
    category: AnimalCategory;
    description: string;
    health: number;
    damage: number; // For combat/hunting risk
    fleeChance: number; // Chance to run away when hunted
    huntDifficulty: number; // 0-100
    yields: {
        itemId: string;
        min: number;
        max: number;
    }[];
    price?: number; // For domestic animals
    perks?: {
        travelSpeed?: number; // Multiplier
        carryCapacity?: number; // Added weight
        combatBonus?: number;
    };
}

export interface AnimalInstance {
    id: string; // Unique ID
    type: AnimalType;
    health: number;
    isTamed: boolean;
    name?: string; // For pets
}
