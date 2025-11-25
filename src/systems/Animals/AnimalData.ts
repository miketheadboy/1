import { AnimalType, AnimalCategory, type AnimalStats } from './AnimalTypes';

export const ANIMAL_DATA: Record<AnimalType, AnimalStats> = {
    // Wild Animals
    [AnimalType.BUFFALO]: {
        id: AnimalType.BUFFALO,
        name: 'Buffalo',
        category: AnimalCategory.WILD,
        description: 'A massive beast of the plains. Valuable for meat and hide, but dangerous if cornered.',
        health: 150,
        damage: 25,
        fleeChance: 0.3,
        huntDifficulty: 60,
        yields: [
            { itemId: 'dried_meat', min: 5, max: 10 },
            // TODO: Add hides later
        ]
    },
    [AnimalType.DEER]: {
        id: AnimalType.DEER,
        name: 'Deer',
        category: AnimalCategory.WILD,
        description: 'Common game found in forests and plains. Skittish and hard to catch.',
        health: 40,
        damage: 5,
        fleeChance: 0.8,
        huntDifficulty: 40,
        yields: [
            { itemId: 'fresh_food', min: 2, max: 4 }
        ]
    },
    [AnimalType.WOLF]: {
        id: AnimalType.WOLF,
        name: 'Wolf',
        category: AnimalCategory.WILD,
        description: 'A predatory pack animal. Dangerous to lone travelers.',
        health: 60,
        damage: 15,
        fleeChance: 0.2,
        huntDifficulty: 70,
        yields: [
            { itemId: 'dried_meat', min: 1, max: 2 }
        ]
    },
    [AnimalType.COYOTE]: {
        id: AnimalType.COYOTE,
        name: 'Coyote',
        category: AnimalCategory.WILD,
        description: 'A scavenger of the plains. Generally avoids humans but will steal food.',
        health: 30,
        damage: 8,
        fleeChance: 0.6,
        huntDifficulty: 30,
        yields: [
            { itemId: 'dried_meat', min: 1, max: 1 }
        ]
    },
    [AnimalType.RABBIT]: {
        id: AnimalType.RABBIT,
        name: 'Rabbit',
        category: AnimalCategory.WILD,
        description: 'Small, fast game. Good for a quick meal.',
        health: 10,
        damage: 0,
        fleeChance: 0.9,
        huntDifficulty: 20,
        yields: [
            { itemId: 'fresh_food', min: 1, max: 1 }
        ]
    },
    [AnimalType.BEAR]: {
        id: AnimalType.BEAR,
        name: 'Black Bear',
        category: AnimalCategory.WILD,
        description: 'A powerful omnivore. Extremely dangerous.',
        health: 200,
        damage: 40,
        fleeChance: 0.1,
        huntDifficulty: 90,
        yields: [
            { itemId: 'fresh_provisions', min: 5, max: 8 },
            { itemId: 'dried_meat', min: 2, max: 5 }
        ]
    },

    // Domestic Animals
    [AnimalType.HORSE]: {
        id: AnimalType.HORSE,
        name: 'Horse',
        category: AnimalCategory.DOMESTIC,
        description: 'Essential for fast travel across the territory.',
        health: 100,
        damage: 10,
        fleeChance: 0.5,
        huntDifficulty: 0,
        yields: [],
        price: 150,
        perks: {
            travelSpeed: 1.5
        }
    },
    [AnimalType.OX]: {
        id: AnimalType.OX,
        name: 'Ox',
        category: AnimalCategory.DOMESTIC,
        description: 'Strong and sturdy. Increases carrying capacity significantly.',
        health: 120,
        damage: 20,
        fleeChance: 0.1,
        huntDifficulty: 0,
        yields: [],
        price: 100,
        perks: {
            carryCapacity: 100
        }
    },
    [AnimalType.MULE]: {
        id: AnimalType.MULE,
        name: 'Mule',
        category: AnimalCategory.DOMESTIC,
        description: 'Reliable transport. A balance between speed and carrying capacity.',
        health: 90,
        damage: 15,
        fleeChance: 0.2,
        huntDifficulty: 0,
        yields: [],
        price: 80,
        perks: {
            travelSpeed: 1.2,
            carryCapacity: 50
        }
    },
    [AnimalType.DOG]: {
        id: AnimalType.DOG,
        name: 'Hunting Dog',
        category: AnimalCategory.DOMESTIC,
        description: 'Loyal companion. Helps with hunting and guarding.',
        health: 50,
        damage: 15,
        fleeChance: 0.0,
        huntDifficulty: 0,
        yields: [],
        price: 40,
        perks: {
            combatBonus: 10
        }
    }
};
