import { FactionType } from '../Factions/FactionTypes';

export interface MilitiaUnit {
    id: string;
    name: string;
    faction: FactionType;
    leaderId: string; // "player" or NPC ID
    size: number;
    morale: number; // 0-100
    trainingLevel: number; // 0-100
    equipmentLevel: number; // 0-100
    locationId: string;
    isPlayerOwned: boolean;
}

export interface SkirmishResult {
    victory: boolean;
    casualties: number;
    loot: number; // Money value
    xpGained: number;
    reputationChange: number;
    log: string[];
}

export const MILITIA_NAMES = {
    [FactionType.ProSlavery]: ["Border Ruffians", "Red Shirts", "Kickapoo Rangers", "Westport Guards"],
    [FactionType.FreeState]: ["Jayhawkers", "Free State Guard", "Lawrence Stubbs", "Topeka Rifles"],
    [FactionType.Abolitionist]: ["Liberty Guards", "Brown's Company", "Freedom Fighters"],
    [FactionType.Native]: ["Tribal Defenders", "Braves", "War Party"],
    [FactionType.Neutral]: ["Town Watch", "Regulators", "Vigilance Committee"]
};
