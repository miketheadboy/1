import { PlayerManager } from '../Survival/PlayerStats';

export enum CropType {
    Corn = 'Corn',
    Wheat = 'Wheat',
    Tobacco = 'Tobacco'
}

export enum LivestockType {
    Cattle = 'Cattle',
    Sheep = 'Sheep',
    Horse = 'Horse' // Horses are also used for travel, but can be bred
}

export interface FarmState {
    ownedAcres: number;
    crops: {
        type: CropType;
        plantedDate: Date;
        acres: number;
        status: 'Growing' | 'Ready' | 'Dead';
    }[];
    livestock: {
        type: LivestockType;
        count: number;
    }[];
}

export class FarmingSystem {
    private state: FarmState;

    constructor() {
        this.state = {
            ownedAcres: 0,
            crops: [],
            livestock: []
        };
    }

    public buyLand(acres: number, pricePerAcre: number, playerManager: PlayerManager): string {
        const totalCost = acres * pricePerAcre;
        const stats = playerManager.getStats();

        if (stats.money < totalCost) {
            return "Not enough money to buy land.";
        }

        playerManager.modifyStat('money', -totalCost);
        this.state.ownedAcres += acres;
        return `Purchased ${acres} acres of land. You now own ${this.state.ownedAcres} acres.`;
    }

    public plantCrop(type: CropType, acres: number, currentDate: Date, playerManager: PlayerManager): string {
        // Check available land
        const usedAcres = this.state.crops.reduce((sum, crop) => sum + crop.acres, 0);
        const availableAcres = this.state.ownedAcres - usedAcres;

        if (acres > availableAcres) {
            return `Not enough land. You have ${availableAcres} acres available.`;
        }

        // Costs
        const seedCostPerAcre = 2;
        const totalCost = seedCostPerAcre * acres;

        const stats = playerManager.getStats();
        if (stats.money < totalCost) {
            return "Not enough money for seeds.";
        }

        // Check season (Simplification: Plant in Spring/Summer)
        const month = currentDate.getMonth(); // 0-11
        if (month < 2 || month > 6) { // March (2) to July (6) is okay
            return "It's not the right season to plant.";
        }

        playerManager.modifyStat('money', -totalCost);
        this.state.crops.push({
            type,
            plantedDate: new Date(currentDate),
            acres,
            status: 'Growing'
        });

        return `Planted ${acres} acres of ${type}.`;
    }

    public harvestCrop(index: number, playerManager: PlayerManager): string {
        const crop = this.state.crops[index];
        if (!crop) return "Crop not found.";

        if (crop.status !== 'Ready') {
            return "Crop is not ready to harvest.";
        }

        // Yield calculation
        // Base yield * farming skill modifier
        const farmingSkill = playerManager.getSkill('farming');
        const baseYieldPerAcre = 10; // units
        const skillModifier = 1 + (farmingSkill * 0.1);
        const totalYield = Math.floor(crop.acres * baseYieldPerAcre * skillModifier);

        // Value
        let pricePerUnit = 1;
        if (crop.type === CropType.Tobacco) pricePerUnit = 3;
        if (crop.type === CropType.Wheat) pricePerUnit = 2;

        const totalValue = totalYield * pricePerUnit;

        playerManager.modifyStat('money', totalValue);
        playerManager.improveSkill('farming', 2); // Good XP for harvesting

        // Remove crop
        this.state.crops.splice(index, 1);

        return `Harvested ${totalYield} bushels of ${crop.type}. Sold for $${totalValue}.`;
    }

    public update(_daysPassed: number, currentDate: Date): string[] {
        const logs: string[] = [];
        const month = currentDate.getMonth();

        // Update Crops
        this.state.crops.forEach(crop => {
            if (crop.status === 'Growing') {
                // Simple growth logic: 3 months to mature
                const timeDiff = currentDate.getTime() - crop.plantedDate.getTime();
                const daysGrowing = timeDiff / (1000 * 3600 * 24);

                if (daysGrowing > 90) {
                    crop.status = 'Ready';
                    logs.push(`Your ${crop.type} is ready to harvest!`);
                }

                // Winter kills crops
                if (month === 11 || month === 0 || month === 1) { // Dec, Jan, Feb
                    if (crop.status === 'Growing') {
                        crop.status = 'Dead';
                        logs.push(`Your ${crop.type} has died in the winter frost.`);
                    }
                }
            }
        });

        return logs;
    }

    public getCrops() {
        return this.state.crops;
    }

    public getOwnedAcres() {
        return this.state.ownedAcres;
    }
}
