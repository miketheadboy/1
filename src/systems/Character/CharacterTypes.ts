import { FactionType } from '../Factions/FactionTypes';

export enum BackgroundType {
    FreeSoilFarmer = 'Free-Soil Farmer',
    AbolitionistPreacher = 'Abolitionist Preacher',
    BorderRuffian = 'Border Ruffian',
    Merchant = 'Merchant',
    Frontiersman = 'Frontiersman'
}

export interface CharacterBackground {
    type: BackgroundType;
    name: string;
    description: string;
    startingStats: {
        money: number;
        morale: number;
        health: number;
    };
    startingItems: { itemId: string; quantity: number }[];
    startingReputation: { faction: FactionType; amount: number }[];
    skills: {
        farming: number;
        survival: number;
        combat: number;
        persuasion: number;
        trading: number;
        medicine: number;
    };
}

export const BACKGROUNDS: Record<BackgroundType, CharacterBackground> = {
    [BackgroundType.FreeSoilFarmer]: {
        type: BackgroundType.FreeSoilFarmer,
        name: 'Free-Soil Farmer',
        description: 'You came to Kansas to till the land and live free. You are hardy and self-reliant.',
        startingStats: { money: 30, morale: 60, health: 100 },
        startingItems: [
            { itemId: 'cornmeal', quantity: 5 },
            { itemId: 'dried_meat', quantity: 2 },
            { itemId: 'seeds', quantity: 1 } // Placeholder if seeds exist, otherwise just food
        ],
        startingReputation: [
            { faction: FactionType.FreeState, amount: 10 }
        ],
        skills: { farming: 5, survival: 3, combat: 1, persuasion: 1, trading: 2, medicine: 1 }
    },
    [BackgroundType.AbolitionistPreacher]: {
        type: BackgroundType.AbolitionistPreacher,
        name: 'Abolitionist Preacher',
        description: 'You are here on a crusade against the sin of slavery. Your words are your weapon.',
        startingStats: { money: 20, morale: 80, health: 90 },
        startingItems: [
            { itemId: 'bible', quantity: 1 }, // Placeholder
            { itemId: 'hardtack', quantity: 3 }
        ],
        startingReputation: [
            { faction: FactionType.Abolitionist, amount: 20 },
            { faction: FactionType.ProSlavery, amount: -20 }
        ],
        skills: { farming: 0, survival: 1, combat: 0, persuasion: 5, trading: 1, medicine: 2 }
    },
    [BackgroundType.BorderRuffian]: {
        type: BackgroundType.BorderRuffian,
        name: 'Border Ruffian',
        description: 'You crossed over from Missouri to ensure Kansas remains open to Southern institutions.',
        startingStats: { money: 40, morale: 50, health: 100 },
        startingItems: [
            { itemId: 'whiskey', quantity: 2 }, // Placeholder
            { itemId: 'dried_meat', quantity: 3 }
        ],
        startingReputation: [
            { faction: FactionType.ProSlavery, amount: 20 },
            { faction: FactionType.FreeState, amount: -20 },
            { faction: FactionType.Abolitionist, amount: -30 }
        ],
        skills: { farming: 1, survival: 2, combat: 4, persuasion: 1, trading: 1, medicine: 0 }
    },
    [BackgroundType.Merchant]: {
        type: BackgroundType.Merchant,
        name: 'Merchant',
        description: 'You see opportunity in this conflict. You are here to make a profit.',
        startingStats: { money: 100, morale: 50, health: 80 },
        startingItems: [
            { itemId: 'fresh_provisions', quantity: 2 },
            { itemId: 'tonic', quantity: 2 }
        ],
        startingReputation: [],
        skills: { farming: 0, survival: 0, combat: 1, persuasion: 3, trading: 5, medicine: 1 }
    },
    [BackgroundType.Frontiersman]: {
        type: BackgroundType.Frontiersman,
        name: 'Frontiersman',
        description: 'You are at home in the wild. Politics matters less to you than survival.',
        startingStats: { money: 10, morale: 70, health: 100 },
        startingItems: [
            { itemId: 'dried_meat', quantity: 5 },
            { itemId: 'bandages', quantity: 2 }
        ],
        startingReputation: [],
        skills: { farming: 1, survival: 5, combat: 3, persuasion: 0, trading: 1, medicine: 3 }
    }
};
