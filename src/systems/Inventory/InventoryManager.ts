import type { InventoryItem } from './InventoryTypes';
import type { PlayerManager } from '../Survival/PlayerStats';
import { ITEMS } from './ItemData';

export class InventoryManager {
    private items: Map<string, InventoryItem>;

    constructor() {
        this.items = new Map();
    }

    public clear(): void {
        this.items.clear();
    }

    public addItem(itemId: string, quantity: number = 1): void {
        const item = ITEMS[itemId];
        if (!item) {
            console.warn(`Item ${itemId} not found`);
            return;
        }

        const existing = this.items.get(itemId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.set(itemId, { item, quantity });
        }
    }

    public removeItem(itemId: string, quantity: number = 1): boolean {
        const existing = this.items.get(itemId);
        if (!existing || existing.quantity < quantity) {
            return false;
        }

        existing.quantity -= quantity;
        if (existing.quantity <= 0) {
            this.items.delete(itemId);
        }
        return true;
    }

    public hasItem(itemId: string, quantity: number = 1): boolean {
        const existing = this.items.get(itemId);
        return existing ? existing.quantity >= quantity : false;
    }

    public getItems(): InventoryItem[] {
        return Array.from(this.items.values());
    }

    public useItem(itemId: string, playerManager: PlayerManager): boolean {
        const inventoryItem = this.items.get(itemId);
        if (!inventoryItem) {
            return false;
        }

        const { item } = inventoryItem;

        // Apply effects
        if (item.effects.hunger) {
            playerManager.modifyStat('hunger', item.effects.hunger);
        }
        if (item.effects.health) {
            playerManager.modifyStat('health', item.effects.health);
        }
        if (item.effects.morale) {
            playerManager.modifyStat('morale', item.effects.morale);
        }

        // Remove one from inventory
        this.removeItem(itemId, 1);
        return true;
    }

    public buyItem(itemId: string, quantity: number, playerManager: PlayerManager): boolean {
        const item = ITEMS[itemId];
        if (!item) return false;

        const totalCost = item.value * quantity;
        const stats = playerManager.getStats();

        if (stats.money < totalCost) {
            return false; // Not enough money
        }

        playerManager.modifyStat('money', -totalCost);
        this.addItem(itemId, quantity);
        return true;
    }
}
