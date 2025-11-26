import { ITEMS } from './ItemData';
import { INITIAL_MAP_NODES } from '../World/MapData';
export class InventoryManager {
    items;
    constructor() {
        this.items = new Map();
    }
    clear() {
        this.items.clear();
    }
    addItem(itemId, quantity = 1) {
        const item = ITEMS[itemId];
        if (!item) {
            console.warn(`Item ${itemId} not found`);
            return;
        }
        const existing = this.items.get(itemId);
        if (existing) {
            existing.quantity += quantity;
        }
        else {
            this.items.set(itemId, { item, quantity });
        }
    }
    removeItem(itemId, quantity = 1) {
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
    hasItem(itemId, quantity = 1) {
        const existing = this.items.get(itemId);
        return existing ? existing.quantity >= quantity : false;
    }
    useItem(itemId, playerManager) {
        const existing = this.items.get(itemId);
        if (!existing || existing.quantity <= 0)
            return false;
        const item = existing.item;
        if (item.effects) {
            if (item.effects.health)
                playerManager.modifyStat('health', item.effects.health);
            if (item.effects.hunger)
                playerManager.modifyStat('hunger', item.effects.hunger);
            if (item.effects.morale)
                playerManager.modifyStat('morale', item.effects.morale);
        }
        this.removeItem(itemId, 1);
        return true;
    }
    getItems() {
        return Array.from(this.items.values());
    }
    buyItem(itemId, quantity, playerManager, locationId) {
        const item = ITEMS[itemId];
        if (!item)
            return false;
        const location = INITIAL_MAP_NODES[locationId];
        if (!location || !location.hasShop)
            return false;
        // Simple economy: base price * 1 (can be expanded later)
        const price = item.value * quantity;
        if (playerManager.getStats().money >= price) {
            playerManager.modifyStat('money', -price);
            this.addItem(itemId, quantity);
            return true;
        }
        return false;
    }
    getBestWeapon() {
        let bestWeapon = null;
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
