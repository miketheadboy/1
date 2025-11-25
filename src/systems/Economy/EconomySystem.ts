import { Item, ItemType } from '../Inventory/InventoryTypes';
import { MapNode, LocationType } from '../World/MapData';

export class EconomySystem {

    public static getPrice(item: Item, location: MapNode, basePrice: number): number {
        let modifier = 1.0;

        // Location Type Modifiers
        if (location.type === LocationType.TradingPost) {
            // Trading posts sell resources cheap, but manufactured goods are expensive
            if (item.type === ItemType.Resource) {
                modifier -= 0.2; // 20% cheaper
            } else if (item.type === ItemType.Weapon || item.type === ItemType.Tool) {
                modifier += 0.3; // 30% more expensive
            }
        } else if (location.type === LocationType.Town) {
            // Towns have standard prices generally
            if (item.type === ItemType.Food) {
                modifier -= 0.1; // Slightly cheaper food
            }
        }

        // Resource Modifiers (Supply/Demand)
        if (location.resources) {
            // If location produces the item type, it's cheaper
            if (location.resources.includes('Furs') && item.id === 'furs') {
                modifier -= 0.3;
            }
            if (location.resources.includes('Weapons') && item.type === ItemType.Weapon) {
                modifier -= 0.2;
            }
            if (location.resources.includes('Supplies') && (item.type === ItemType.Food || item.type === ItemType.Medicine)) {
                modifier -= 0.15;
            }
        }

        // Ensure price doesn't go below 10% of base
        const finalPrice = Math.max(basePrice * 0.1, basePrice * modifier);
        return finalPrice;
    }

    public static getSellPrice(item: Item, location: MapNode, basePrice: number): number {
        // Sell price is usually lower than buy price
        const buyPrice = this.getPrice(item, location, basePrice);

        // Trading posts pay more for furs
        let sellModifier = 0.5; // Base sell price is 50% of buy price

        if (location.type === LocationType.TradingPost && item.id === 'furs') {
            sellModifier = 0.8; // Pay 80% for furs
        }

        return buyPrice * sellModifier;
    }
}
