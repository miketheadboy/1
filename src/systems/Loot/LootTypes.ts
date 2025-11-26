/**
 * Loot system types for drops from combat and scavenging
 */

export interface LootTableEntry {
    itemId: string;
    dropChance: number;      // 0-1 probability
    minQuantity: number;
    maxQuantity: number;
}

export interface LootResult {
    items: Array<{ itemId: string; quantity: number }>;
    money: number;
}

export interface ScavengeLocation {
    id: string;
    name: string;
    description: string;
    lootTable: LootTableEntry[];
    searchTime: number;      // Hours to search
    riskLevel: number;       // 0-1 chance of danger
    canRespawn: boolean;
    respawnDays?: number;
}

export interface ScavengeResult {
    success: boolean;
    loot: LootResult;
    danger?: DangerEvent;
    message: string;
    timePassed: number;      // Hours
}

export enum DangerType {
    Combat = 'Combat',
    Injury = 'Injury',
    Trap = 'Trap',
    Disease = 'Disease',
    None = 'None'
}

export interface DangerEvent {
    type: DangerType;
    description: string;
    enemyId?: string;        // If combat
    damage?: number;         // If injury/trap
}
