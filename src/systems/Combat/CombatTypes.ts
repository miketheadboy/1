import { FactionType } from '../Factions/FactionTypes';

export enum CombatActionType {
    Attack = 'Attack',
    Defend = 'Defend',
    Flee = 'Flee',
    Negotiate = 'Negotiate'
}

export interface Enemy {
    id: string;
    name: string;
    description: string;
    faction: FactionType;
    health: number;
    maxHealth: number;
    damage: number;
    defense: number;
    loot: string[]; // Item IDs
    money: number;
}

export interface CombatState {
    isActive: boolean;
    enemy: Enemy | null;
    playerHealth: number;
    playerMaxHealth: number;
    combatLog: string[];
    turn: number;
}

export interface Weapon {
    id: string;
    name: string;
    damage: number;
    accuracy: number;
    value: number;
}
