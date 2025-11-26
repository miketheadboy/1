import { FactionType, NativeTribe } from './FactionTypes';
export class FactionManager {
    state;
    constructor(initialState) {
        this.state = initialState || {
            reputations: this.initializeReputations(),
        };
    }
    initializeReputations() {
        const reps = {};
        // Initialize major factions
        Object.values(FactionType).forEach(faction => {
            reps[faction] = { factionId: faction, value: 0, status: 'Neutral' };
        });
        // Initialize tribes
        Object.values(NativeTribe).forEach(tribe => {
            reps[tribe] = { factionId: tribe, value: 0, status: 'Neutral' };
        });
        return reps;
    }
    getReputation(factionId) {
        return this.state.reputations[factionId]?.value || 0;
    }
    getReputations() {
        return { ...this.state.reputations };
    }
    modifyReputation(factionId, amount) {
        if (!this.state.reputations[factionId])
            return;
        const current = this.state.reputations[factionId];
        current.value = Math.max(-100, Math.min(100, current.value + amount));
        current.status = this.calculateStatus(current.value);
    }
    calculateStatus(value) {
        if (value <= -75)
            return 'Hostile';
        if (value <= -25)
            return 'Unfriendly';
        if (value >= 75)
            return 'Allied';
        if (value >= 25)
            return 'Friendly';
        return 'Neutral';
    }
    getState() {
        return this.state;
    }
}
