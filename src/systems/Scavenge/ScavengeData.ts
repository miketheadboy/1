import { ScavengeLocationType, ScavengeRiskLevel } from './ScavengeTypes';
import type { LootTableEntry } from '../Loot/LootTypes';

export const SCAVENGE_LOOT_TABLES: Record<ScavengeLocationType, LootTableEntry[]> = {
    [ScavengeLocationType.Residential]: [
        { itemId: 'fresh_food', dropChance: 0.4, minQuantity: 1, maxQuantity: 3 },
        { itemId: 'canned_food', dropChance: 0.2, minQuantity: 1, maxQuantity: 2 },
        { itemId: 'clothing', dropChance: 0.3, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'medicine', dropChance: 0.05, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'knife', dropChance: 0.02, minQuantity: 1, maxQuantity: 1 }
    ],
    [ScavengeLocationType.Commercial]: [
        { itemId: 'canned_food', dropChance: 0.4, minQuantity: 2, maxQuantity: 5 },
        { itemId: 'medicine', dropChance: 0.1, minQuantity: 1, maxQuantity: 2 },
        { itemId: 'tools', dropChance: 0.2, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'ammunition', dropChance: 0.15, minQuantity: 5, maxQuantity: 10 },
        { itemId: 'whiskey', dropChance: 0.1, minQuantity: 1, maxQuantity: 2 }
    ],
    [ScavengeLocationType.Industrial]: [
        { itemId: 'tools', dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
        { itemId: 'building_materials', dropChance: 0.5, minQuantity: 2, maxQuantity: 5 },
        { itemId: 'coal', dropChance: 0.3, minQuantity: 5, maxQuantity: 10 }
    ],
    [ScavengeLocationType.Wilderness]: [
        { itemId: 'fresh_food', dropChance: 0.3, minQuantity: 1, maxQuantity: 2 }, // Berries, nuts
        { itemId: 'herbs', dropChance: 0.2, minQuantity: 1, maxQuantity: 3 },
        { itemId: 'wood', dropChance: 0.5, minQuantity: 2, maxQuantity: 5 }
    ],
    [ScavengeLocationType.Battlefield]: [
        { itemId: 'ammunition', dropChance: 0.5, minQuantity: 2, maxQuantity: 10 },
        { itemId: 'rifle', dropChance: 0.05, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'pistol', dropChance: 0.05, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'clothing', dropChance: 0.2, minQuantity: 1, maxQuantity: 1 }, // Uniforms
        { itemId: 'medicine', dropChance: 0.1, minQuantity: 1, maxQuantity: 1 }
    ],
    [ScavengeLocationType.Ruins]: [
        { itemId: 'gold_nugget', dropChance: 0.01, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'antique_coin', dropChance: 0.05, minQuantity: 1, maxQuantity: 3 },
        { itemId: 'tools', dropChance: 0.1, minQuantity: 1, maxQuantity: 1 }
    ]
};

export const SCAVENGE_RISK_DATA: Record<ScavengeLocationType, { baseRisk: number; riskLevel: ScavengeRiskLevel }> = {
    [ScavengeLocationType.Residential]: { baseRisk: 0.1, riskLevel: ScavengeRiskLevel.Low },
    [ScavengeLocationType.Commercial]: { baseRisk: 0.2, riskLevel: ScavengeRiskLevel.Medium },
    [ScavengeLocationType.Industrial]: { baseRisk: 0.3, riskLevel: ScavengeRiskLevel.Medium },
    [ScavengeLocationType.Wilderness]: { baseRisk: 0.15, riskLevel: ScavengeRiskLevel.Low },
    [ScavengeLocationType.Battlefield]: { baseRisk: 0.4, riskLevel: ScavengeRiskLevel.High },
    [ScavengeLocationType.Ruins]: { baseRisk: 0.25, riskLevel: ScavengeRiskLevel.Medium }
};
