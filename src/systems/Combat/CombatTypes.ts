import { FactionType } from '../Factions/FactionTypes';

export enum CombatActionType {
    Attack = 'Attack', // Generic fallback
    Shoot = 'Shoot',
    Melee = 'Melee',
    Reload = 'Reload',
    Defend = 'Defend',
    Flee = 'Flee',
    Negotiate = 'Negotiate'
}

export enum EffectTrigger {
    OnAttack = 'on_attack',
    OnHit = 'on_hit',
    OnKill = 'on_kill',
    OnNegotiate = 'on_negotiate',
    Passive = 'passive'
}

export interface CombatEffect {
    id: string;
    trigger: EffectTrigger;
    chance: number; // 0-1
    value?: number; // Flat value
    multiplier?: number; // Multiplier (e.g. 1.2 for +20%)
    stat?: string; // Stat to modify
    message?: string; // Combat log message
    condition?: (context: unknown) => boolean; // Dynamic condition
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
    accuracy: number; // 0-100
    xpReward: number;
}

export interface CombatState {
    isActive: boolean;
    enemy: Enemy | null;
    playerHealth: number;
    playerMaxHealth: number;
    combatLog: string[];
    turnCount: number; // Renamed from turn to match UI
    distance: number; // Added distance
}

export interface Weapon {
    id: string;
    name: string;
    damage: number;
    accuracy: number;
    value: number;
}
