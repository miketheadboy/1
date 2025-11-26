import { FIRST_NAMES, LAST_NAMES, JOBS } from './CitizenData';
import { HISTORICAL_NPCS } from './NPCData';
import { CompanionRole } from '../Companions/CompanionTypes';
export class NPCSystem {
    citizens = {};
    getNPCsAtLocation(locationId) {
        return Object.values(HISTORICAL_NPCS).filter(npc => npc.locationId === locationId && npc.relationship !== 'recruited');
    }
    getRecruitedNPCs() {
        return Object.values(HISTORICAL_NPCS).filter(npc => npc.relationship === 'recruited');
    }
    getCitizensAtLocation(locationId) {
        if (!this.citizens[locationId]) {
            this.citizens[locationId] = this.generateCitizens(locationId);
        }
        return this.citizens[locationId];
    }
    generateCitizens(locationId) {
        const count = Math.floor(Math.random() * 5) + 3; // 3-7 citizens
        const citizens = [];
        for (let i = 0; i < count; i++) {
            const gender = Math.random() > 0.5 ? 'male' : 'female';
            const ethnicity = this.getRandomEthnicity();
            const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
            const lastName = LAST_NAMES[ethnicity][Math.floor(Math.random() * LAST_NAMES[ethnicity].length)];
            citizens.push({
                id: `citizen_${locationId}_${i}`,
                name: `${firstName} ${lastName}`,
                race: this.getRaceFromEthnicity(ethnicity),
                ethnicity: ethnicity,
                job: JOBS[Math.floor(Math.random() * JOBS.length)],
                description: `A ${ethnicity} ${JOBS[Math.floor(Math.random() * JOBS.length)].toLowerCase()}.`,
                politicalLeaning: Math.floor(Math.random() * 200) - 100
            });
        }
        return citizens;
    }
    getRandomEthnicity() {
        const roll = Math.random();
        if (roll < 0.4)
            return 'Yankee';
        if (roll < 0.7)
            return 'Southerner';
        if (roll < 0.8)
            return 'German';
        if (roll < 0.9)
            return 'Irish';
        if (roll < 0.95)
            return 'Free Black';
        return 'Kansa'; // Rare
    }
    getRaceFromEthnicity(ethnicity) {
        switch (ethnicity) {
            case 'Free Black':
            case 'Enslaved':
                return 'Black';
            case 'Kansa':
            case 'Osage':
                return 'Native American';
            default:
                return 'White';
        }
    }
    interact(npcId, optionId, playerManager, politicsSystem, factionManager, recruitCallback // Added callback
    ) {
        const npc = HISTORICAL_NPCS[npcId];
        if (!npc)
            return "NPC not found.";
        const option = npc.dialogue.find(d => d.id === optionId);
        if (!option)
            return "Invalid option.";
        // Check costs
        if (option.effect?.moneyCost) {
            const stats = playerManager.getStats();
            if (stats.money < option.effect.moneyCost) {
                return "You cannot afford this.";
            }
            playerManager.modifyStat('money', -option.effect.moneyCost);
        }
        // Apply Political Effects
        if (option.effect?.politicalAlignment && option.effect?.politicalChange) {
            politicsSystem.modifySupport(option.effect.politicalAlignment, option.effect.politicalChange);
        }
        // Apply Reputation Effects
        if (option.effect?.reputationChange) {
            factionManager.modifyReputation(npc.faction, option.effect.reputationChange);
        }
        // Apply Relationship Effects
        if (option.effect?.relationshipChange) {
            npc.relationship = option.effect.relationshipChange;
        }
        // Apply Recruitment
        if (option.effect?.recruit) {
            npc.relationship = 'recruited';
            if (recruitCallback) {
                // Create companion from NPC
                // This is a simplified conversion. In a full system, we'd map skills/stats more carefully.
                const companion = {
                    id: npc.id,
                    name: npc.name,
                    description: npc.description,
                    race: 'White', // Default, should come from NPC data
                    ethnicity: 'Yankee', // Default
                    job: 'Soldier', // Default
                    politicalLeaning: 0, // Default
                    stats: { ...playerManager.getStats() }, // Start with base stats similar to player or randomized
                    role: CompanionRole.Fighter, // Default role, could be passed in effect
                    dailyWage: 2, // Default wage
                    joinedDate: new Date()
                };
                // Randomize stats slightly for variety
                companion.stats.health = 80 + Math.floor(Math.random() * 40);
                companion.stats.morale = 50 + Math.floor(Math.random() * 50);
                recruitCallback(companion);
            }
        }
        return `${npc.name}: "${option.response}"`;
    }
}
