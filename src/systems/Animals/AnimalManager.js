import { AnimalType, AnimalCategory } from './AnimalTypes';
import { ANIMAL_DATA } from './AnimalData';
import { FactionType as FactionTypeEnum } from '../Factions/FactionTypes';
export class AnimalManager {
    wildAnimals = [];
    domesticAnimals = [];
    constructor() { }
    spawnWildAnimals() {
        this.wildAnimals = []; // Clear previous location's animals
        // Simple spawning logic based on random chance for now
        // In the future, this could be tied to EcologySystem
        const spawnChance = 0.6;
        if (Math.random() > spawnChance)
            return;
        const numAnimals = Math.floor(Math.random() * 3) + 1;
        // Determine possible animals based on location (mock logic)
        // TODO: Get biome from MapData
        const possibleTypes = [
            AnimalType.DEER,
            AnimalType.RABBIT,
            AnimalType.COYOTE,
            AnimalType.WOLF,
            AnimalType.BUFFALO
        ];
        for (let i = 0; i < numAnimals; i++) {
            const type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
            const stats = ANIMAL_DATA[type];
            this.wildAnimals.push({
                id: `wild_${Date.now()}_${i}`,
                type: type,
                health: stats.health,
                isTamed: false
            });
        }
    }
    getWildAnimals() {
        return this.wildAnimals;
    }
    getDomesticAnimals() {
        return this.domesticAnimals;
    }
    addDomesticAnimal(type, name) {
        const stats = ANIMAL_DATA[type];
        if (stats.category !== AnimalCategory.DOMESTIC)
            return;
        this.domesticAnimals.push({
            id: `domestic_${Date.now()}_${this.domesticAnimals.length}`,
            type: type,
            health: stats.health,
            isTamed: true,
            name: name || stats.name
        });
    }
    huntAnimal(animalId, player, inventory) {
        const animalIndex = this.wildAnimals.findIndex(a => a.id === animalId);
        if (animalIndex === -1)
            return { result: 'failure', message: 'Animal not found.' };
        const animal = this.wildAnimals[animalIndex];
        const animalStats = ANIMAL_DATA[animal.type];
        // Hunting logic
        // Success depends on player stats (e.g., health/morale/skills) vs huntDifficulty
        const survivalSkill = player.getSkill('survival');
        const baseSkill = 30 + (survivalSkill * 10); // Base 30% + 10% per skill level
        // Morale and Health modifiers
        const playerStats = player.getStats();
        const moraleMod = (playerStats.morale - 50) / 2; // +/- 25%
        const healthMod = (playerStats.health - 50) / 5; // +/- 10%
        const totalSkill = baseSkill + moraleMod + healthMod;
        const successChance = (totalSkill - animalStats.huntDifficulty + 50) / 100;
        const roll = Math.random();
        if (roll < successChance) {
            // Success
            this.wildAnimals.splice(animalIndex, 1);
            // Grant loot
            let lootMessage = `You successfully hunted the ${animalStats.name}. Received: `;
            animalStats.yields.forEach(yieldData => {
                const quantity = Math.floor(Math.random() * (yieldData.max - yieldData.min + 1)) + yieldData.min;
                inventory.addItem(yieldData.itemId, quantity);
                lootMessage += `${quantity}x ${yieldData.itemId}, `;
            });
            // Grant XP
            const xpGain = 10 + (animalStats.huntDifficulty / 2);
            const levelUpMsg = player.gainXp(xpGain);
            if (levelUpMsg) {
                lootMessage += ` ${levelUpMsg}`;
            }
            // Improve survival skill chance
            if (Math.random() < 0.2) { // 20% chance to improve skill
                player.improveSkill('survival');
                lootMessage += " Your Survival skill improved!";
            }
            return { result: 'success', message: lootMessage.slice(0, -2) };
        }
        else {
            // Failure
            // Check if animal flees or attacks
            if (Math.random() < animalStats.fleeChance) {
                this.wildAnimals.splice(animalIndex, 1);
                return { result: 'failure', message: `The ${animalStats.name} fled into the wilderness.` };
            }
            else {
                // Attack!
                // Don't remove animal, trigger combat
                return { result: 'combat', message: `The ${animalStats.name} is attacking!`, animal: animal };
            }
        }
    }
    getTravelSpeedModifier() {
        let modifier = 1.0;
        this.domesticAnimals.forEach(animal => {
            const stats = ANIMAL_DATA[animal.type];
            if (stats.perks?.travelSpeed) {
                // Only apply the highest speed bonus (don't stack horses linearly)
                modifier = Math.max(modifier, stats.perks.travelSpeed);
            }
        });
        return modifier;
    }
    getCarryCapacityBonus() {
        let bonus = 0;
        this.domesticAnimals.forEach(animal => {
            const stats = ANIMAL_DATA[animal.type];
            if (stats.perks?.carryCapacity) {
                bonus += stats.perks.carryCapacity;
            }
        });
        return bonus;
    }
    getEnemyFromAnimal(animalId) {
        const animal = this.wildAnimals.find(a => a.id === animalId);
        if (!animal)
            return null;
        const stats = ANIMAL_DATA[animal.type];
        return {
            id: animal.id,
            name: stats.name,
            description: `A wild ${stats.name}. ${stats.description}`,
            faction: FactionTypeEnum.Native, // Animals are neutral/native
            health: animal.health,
            maxHealth: stats.health,
            damage: stats.damage,
            defense: 0, // Animals have low defense usually
            loot: stats.yields.map(y => y.itemId), // Simplified loot
            money: 0,
            accuracy: 60, // Default animal accuracy
            xpReward: 10 + (stats.huntDifficulty / 2)
        };
    }
}
