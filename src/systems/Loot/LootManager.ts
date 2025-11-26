import type { LootTableEntry, LootResult } from './LootTypes';
import { type GameContainer, ContainerType } from './ContainerTypes';

/**
 * LootManager handles generating random loot from loot tables
 */
export class LootManager {
    /**
     * Generate loot from a loot table
     */
    public generateLoot(lootTable: LootTableEntry[], moneyRange?: { min: number; max: number }): LootResult {
        const items: Array<{ itemId: string; quantity: number }> = [];

        // Roll for each item in the loot table
        for (const entry of lootTable) {
            if (Math.random() < entry.dropChance) {
                const quantity = this.randomInt(entry.minQuantity, entry.maxQuantity);

                // Check if item already in list (stack it)
                const existing = items.find(i => i.itemId === entry.itemId);
                if (existing) {
                    existing.quantity += quantity;
                } else {
                    items.push({ itemId: entry.itemId, quantity });
                }
            }
        }

        // Generate money
        let money = 0;
        if (moneyRange) {
            money = this.randomInt(moneyRange.min, moneyRange.max);
        }

        return { items, money };
    }

    /**
     * Generate loot with a luck modifier (from player skills)
     */
    public generateLootWithLuck(
        lootTable: LootTableEntry[],
        moneyRange: { min: number; max: number },
        luckModifier: number = 0
    ): LootResult {
        const items: Array<{ itemId: string; quantity: number }> = [];

        // Apply luck to drop chances
        for (const entry of lootTable) {
            const adjustedChance = Math.min(1, entry.dropChance + luckModifier);

            if (Math.random() < adjustedChance) {
                // Luck also increases quantity slightly
                const bonusQuantity = Math.random() < luckModifier ? 1 : 0;
                const quantity = this.randomInt(entry.minQuantity, entry.maxQuantity) + bonusQuantity;

                const existing = items.find(i => i.itemId === entry.itemId);
                if (existing) {
                    existing.quantity += quantity;
                } else {
                    items.push({ itemId: entry.itemId, quantity });
                }
            }
        }

        // Luck increases money
        const moneyMultiplier = 1 + luckModifier;
        const baseMoney = this.randomInt(moneyRange.min, moneyRange.max);
        const money = Math.floor(baseMoney * moneyMultiplier);

        return { items, money };
    }

    /**
     * Get a random integer between min and max (inclusive)
     */
    private randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Format loot result as a readable string
     */
    public formatLootResult(loot: LootResult): string {
        const parts: string[] = [];

        if (loot.items.length > 0) {
            const itemStrings = loot.items.map(i => `${i.quantity}x ${i.itemId}`);
            parts.push(`Items: ${itemStrings.join(', ')}`);
        }

        if (loot.money > 0) {
            parts.push(`$${loot.money}`);
        }

        if (parts.length === 0) {
            return 'Nothing found.';
        }

        return parts.join(' | ');
    }

    /**
     * Generate a random container
     */
    public generateContainer(id: string, type: ContainerType, lootTable: LootTableEntry[], isLocked: boolean = false, keyId?: string): GameContainer {
        return {
            id,
            name: type,
            type,
            isLocked,
            keyId,
            lootTable,
            isOpen: false,
            items: [],
            money: 0
        };
    }

    /**
     * Open a container and generate its loot if not already generated
     */
    public openContainer(container: GameContainer, playerLuck: number = 0): LootResult {
        if (container.isOpen) {
            return { items: container.items, money: container.money };
        }

        // Generate loot on first open
        const loot = this.generateLootWithLuck(container.lootTable, { min: 5, max: 50 }, playerLuck);

        container.items = loot.items;
        container.money = loot.money;
        container.isOpen = true;

        return loot;
    }

    /**
     * Generate random containers for a location
     */
    public generateContainersForLocation(locationId: string): GameContainer[] {
        const newContainers: GameContainer[] = [];
        // Chance for a chest
        if (Math.random() < 0.5) {
            newContainers.push(this.generateContainer(
                `chest_${locationId}_${Date.now()}`,
                ContainerType.Chest,
                [{ itemId: 'money', minQuantity: 10, maxQuantity: 50, dropChance: 1.0 }],
                Math.random() < 0.3 // 30% chance locked
            ));
        }
        // Chance for a crate
        if (Math.random() < 0.7) {
            newContainers.push(this.generateContainer(
                `crate_${locationId}_${Date.now()}`,
                ContainerType.Crate,
                [{ itemId: 'whiskey', minQuantity: 1, maxQuantity: 2, dropChance: 0.5 }]
            ));
        }
        return newContainers;
    }
}
