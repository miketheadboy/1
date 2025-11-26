import { type MapNode } from '../World/WorldTypes';
import { PlayerManager } from '../Survival/PlayerStats';

export interface Mission {
    id: string;
    type: 'escort';
    targetLocationId: string;
    reward: number;
    description: string;
    slavesCount: number;
}

export class UndergroundRailroadSystem {
    private activeMission: Mission | null = null;

    public startMission(mission: Mission): void {
        this.activeMission = mission;
    }

    public completeMission(playerManager: PlayerManager): string {
        if (!this.activeMission) return "No active mission.";

        const reward = this.activeMission.reward;
        playerManager.modifyStat('money', reward);
        // Boost abolitionist reputation (handled via FactionManager usually, but we can return a signal)

        const message = `Mission Complete! Delivered ${this.activeMission.slavesCount} souls to freedom. Received $${reward}.`;
        this.activeMission = null;
        return message;
    }

    public failMission(): string {
        this.activeMission = null;
        return "Mission Failed. The slave catchers intercepted the group.";
    }

    public getActiveMission(): Mission | null {
        return this.activeMission;
    }

    public checkForSafehouse(location: MapNode): boolean {
        // Safehouses are hidden in certain towns or farms
        // For now, let's say any 'Abolitionist' town has a safehouse
        // We'll need to check location faction alignment if we had that data on MapNode
        // For now, hardcode 'Lawrence' and 'Topeka'
        const safehouseLocations = ['lawrence', 'topeka', 'osawatomie'];
        return safehouseLocations.includes(location.id);
    }

    public getSlaveCatcherChance(location: MapNode): number {
        if (!this.activeMission) return 0;

        // Higher chance in Pro-Slavery areas or near borders
        // Hardcode for now
        const dangerousLocations = ['lecompton', 'atchison', 'leavenworth'];
        if (dangerousLocations.includes(location.id)) {
            return 0.3; // 30% chance per day/travel
        }
        return 0.1; // 10% base chance
    }
}
