import { ScavengeLocationType, type ScavengeNode, type ScavengeResult } from './ScavengeTypes';
import { SCAVENGE_LOOT_TABLES, SCAVENGE_RISK_DATA } from './ScavengeData';
import { LootManager } from '../Loot/LootManager';
import type { PlayerManager } from '../Survival/PlayerStats';

export class ScavengeManager {
    private lootManager: LootManager;

    constructor() {
        this.lootManager = new LootManager();
    }

    public generateScavengeNodes(locationId: string): ScavengeNode[] {
        // In a real implementation, this would depend on the location's properties (MapNode)
        // For now, we'll generate random nodes based on a hash of the locationId to keep it consistent-ish
        // or just random for prototype. Let's do random for now.

        const nodes: ScavengeNode[] = [];
        const numNodes = Math.floor(Math.random() * 3) + 2; // 2-4 nodes

        const types = Object.values(ScavengeLocationType);

        for (let i = 0; i < numNodes; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const riskData = SCAVENGE_RISK_DATA[type];

            nodes.push({
                id: `scavenge_${locationId}_${i}_${Date.now()}`,
                name: `Abandoned ${type}`,
                description: `An area of ${type.toLowerCase()} ruins that might contain supplies.`,
                type: type,
                difficulty: Math.floor(Math.random() * 50) + 10, // 10-60 difficulty
                riskLevel: riskData.riskLevel,
                isDepleted: false
            });
        }

        return nodes;
    }

    public scavenge(node: ScavengeNode, player: PlayerManager): ScavengeResult {
        const result: ScavengeResult = {
            success: false,
            message: "",
            itemsFound: [],
            moneyFound: 0,
            xpGained: 0,
            damageTaken: 0,
            combatTriggered: false
        };

        if (node.isDepleted) {
            result.message = "This area has already been picked clean.";
            return result;
        }

        // Calculate Success
        const scavengingSkill = player.getSkill('scavenging') || 0;
        // Base chance 40% + 2% per skill level
        const successChance = 0.4 + (scavengingSkill * 0.02);
        const roll = Math.random();

        // Check Risk
        const riskData = SCAVENGE_RISK_DATA[node.type];
        // Risk reduced by skill? Maybe slightly.
        const riskRoll = Math.random();

        if (riskRoll < riskData.baseRisk) {
            // Bad thing happens
            if (Math.random() < 0.5) {
                // Injury
                const damage = Math.floor(Math.random() * 10) + 5;
                result.damageTaken = damage;
                result.message = `You hurt yourself while scavenging! Took ${damage} damage. `;
                player.modifyStat('health', -damage);
            } else {
                // Combat (Simulated for now, or trigger actual combat)
                // For this MVP, let's just say you got attacked and fled or took damage
                const damage = Math.floor(Math.random() * 15) + 5;
                result.damageTaken = damage;
                result.message = `You were attacked by looters! You fled but took ${damage} damage. `;
                player.modifyStat('health', -damage);
                result.combatTriggered = true;
            }
        }

        if (roll < successChance) {
            // Success!
            result.success = true;

            // Generate Loot
            const lootTable = SCAVENGE_LOOT_TABLES[node.type];
            const loot = this.lootManager.generateLootWithLuck(lootTable, { min: 0, max: 5 }, 0); // TODO: Add luck stat

            result.itemsFound = loot.items;
            result.moneyFound = loot.money;

            // XP
            const xp = 10 + Math.floor(node.difficulty / 2);
            result.xpGained = xp;
            player.gainXp(xp);

            // Skill improvement chance
            if (Math.random() < 0.3) {
                player.improveSkill('scavenging');
                result.message += " Your Scavenging skill improved!";
            }

            if (loot.items.length > 0 || loot.money > 0) {
                result.message += `Found supplies! ${this.lootManager.formatLootResult(loot)}`;
            } else {
                result.message += "You searched thoroughly but found nothing of value.";
            }

            // Mark as depleted
            node.isDepleted = true;

        } else {
            // Failed to find anything
            result.success = false;
            result.message += "You searched but found nothing.";

            // Small XP for trying
            player.gainXp(2);
        }

        return result;
    }
}
