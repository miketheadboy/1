export class UndergroundRailroadSystem {
    activeMission = null;
    startMission(mission) {
        this.activeMission = mission;
    }
    completeMission(playerManager) {
        if (!this.activeMission)
            return "No active mission.";
        const reward = this.activeMission.reward;
        playerManager.modifyStat('money', reward);
        // Boost abolitionist reputation (handled via FactionManager usually, but we can return a signal)
        const message = `Mission Complete! Delivered ${this.activeMission.slavesCount} souls to freedom. Received $${reward}.`;
        this.activeMission = null;
        return message;
    }
    failMission() {
        this.activeMission = null;
        return "Mission Failed. The slave catchers intercepted the group.";
    }
    getActiveMission() {
        return this.activeMission;
    }
    checkForSafehouse(location) {
        // Safehouses are hidden in certain towns or farms
        // For now, let's say any 'Abolitionist' town has a safehouse
        // We'll need to check location faction alignment if we had that data on MapNode
        // For now, hardcode 'Lawrence' and 'Topeka'
        const safehouseLocations = ['lawrence', 'topeka', 'osawatomie'];
        return safehouseLocations.includes(location.id);
    }
    getSlaveCatcherChance(location) {
        if (!this.activeMission)
            return 0;
        // Higher chance in Pro-Slavery areas or near borders
        // Hardcode for now
        const dangerousLocations = ['lecompton', 'atchison', 'leavenworth'];
        if (dangerousLocations.includes(location.id)) {
            return 0.3; // 30% chance per day/travel
        }
        return 0.1; // 10% base chance
    }
}
