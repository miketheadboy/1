import { type Item, ItemType } from '../Inventory/InventoryTypes';
import { type MapNode, LocationType } from '../World/WorldTypes';

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

    public static getPriceWithContext(item: Item, location: MapNode, basePrice: number, droughtActive: boolean): number {
        let price = this.getPrice(item, location, basePrice);

        if (droughtActive) {
            if (item.type === ItemType.Food) {
                // Massive spike for food
                if (location.id !== 'leavenworth') {
                    price *= 4.0; // 400% price
                } else {
                    price *= 1.5; // Still expensive, but manageable
                }
            } else if (item.id === 'ox' || item.id === 'horse' || item.id === 'mule') {
                // Animals are cheap because people are selling them (can't feed them)
                price *= 0.5;
            }
        }

        return price;
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
