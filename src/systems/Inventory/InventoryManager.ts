import type { InventoryItem } from './InventoryTypes';
import type { PlayerManager } from '../Survival/PlayerStats';
import { ITEMS } from './ItemData';
import { INITIAL_MAP_NODES } from '../World/MapData';

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

    public useItem(itemId: string, playerManager: PlayerManager): boolean {
        const existing = this.items.get(itemId);
        if (!existing || existing.quantity <= 0) return false;

        const item = existing.item;
        if (item.effects) {
            if (item.effects.health) playerManager.modifyStat('health', item.effects.health);
            if (item.effects.hunger) playerManager.modifyStat('hunger', item.effects.hunger);
            if (item.effects.morale) playerManager.modifyStat('morale', item.effects.morale);
        }

        this.removeItem(itemId, 1);
        return true;
    }

    public getItems(): InventoryItem[] {
        return Array.from(this.items.values());
    }

    public buyItem(itemId: string, quantity: number, playerManager: PlayerManager, locationId: string): boolean {
        const item = ITEMS[itemId];
        if (!item) return false;

        const location = INITIAL_MAP_NODES[locationId];
        if (!location || !location.hasShop) return false;

        // Simple economy: base price * 1 (can be expanded later)
        const price = item.value * quantity;

        if (playerManager.getStats().money >= price) {
            playerManager.modifyStat('money', -price);
            this.addItem(itemId, quantity);
            return true;
        }
        return false;
    }

    public getBestWeapon(): import('./InventoryTypes').Item | null {
        let bestWeapon: import('./InventoryTypes').Item | null = null;
        let maxDamage = 0;

        for (const { item } of this.items.values()) {
            if (item.type === 'Weapon' && item.weaponStats && item.weaponStats.damage > maxDamage) {
                maxDamage = item.weaponStats.damage;
                bestWeapon = item;
            }
        }
        return bestWeapon;
    }
}
