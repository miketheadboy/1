import { FactionType, NativeTribe, type FactionReputation, type FactionState } from './FactionTypes';

export class FactionManager {
    private state: FactionState;

    constructor(initialState?: FactionState) {
        this.state = initialState || {
            reputations: this.initializeReputations(),
        };
    }

    private initializeReputations(): Record<string, FactionReputation> {
        const reps: Record<string, FactionReputation> = {};

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

    public getReputation(factionId: FactionType | NativeTribe): number {
        return this.state.reputations[factionId]?.value || 0;
    }

    public getReputations(): Record<string, FactionReputation> {
        return { ...this.state.reputations };
    }

    public modifyReputation(factionId: FactionType | NativeTribe, amount: number): void {
        if (!this.state.reputations[factionId]) return;

        const current = this.state.reputations[factionId];
        current.value = Math.max(-100, Math.min(100, current.value + amount));
        current.status = this.calculateStatus(current.value);
    }

    private calculateStatus(value: number): FactionReputation['status'] {
        if (value <= -75) return 'Hostile';
        if (value <= -25) return 'Unfriendly';
        if (value >= 75) return 'Allied';
        if (value >= 25) return 'Friendly';
        return 'Neutral';
    }

    public getState(): FactionState {
        return this.state;
    }
}
