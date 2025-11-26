export class MilitiaManager {
    militias;
    playerMilitiaId = null;
    constructor() {
        this.militias = new Map();
        // Initialize some AI militias?
    }
    createPlayerMilitia(name, faction, locationId) {
        const id = `player_militia_${Date.now()}`;
        const militia = {
            id,
            name,
            faction,
            leaderId: 'player',
            size: 1, // Starts with just the player (or maybe a few followers)
            morale: 50,
            trainingLevel: 10,
            equipmentLevel: 10,
            locationId,
            isPlayerOwned: true
        };
        this.militias.set(id, militia);
        this.playerMilitiaId = id;
        return militia;
    }
    getPlayerMilitia() {
        if (!this.playerMilitiaId)
            return undefined;
        return this.militias.get(this.playerMilitiaId);
    }
    recruit(amount, costPerRecruit, gameState) {
        const militia = this.getPlayerMilitia();
        if (!militia)
            return { success: false, message: "You don't have a militia." };
        const totalCost = amount * costPerRecruit;
        if (gameState.playerManager.getStats().money < totalCost) {
            return { success: false, message: `Not enough money. Need $${totalCost}.` };
        }
        gameState.playerManager.modifyStat('money', -totalCost);
        militia.size += amount;
        // Slightly lower training/morale when recruiting raw recruits
        militia.trainingLevel = Math.max(0, militia.trainingLevel - (amount * 0.5));
        return { success: true, message: `Recruited ${amount} men.` };
    }
    train(gameState) {
        const militia = this.getPlayerMilitia();
        if (!militia)
            return { success: false, message: "No militia to train." };
        // Training logic
        const trainingGain = 5 + (gameState.playerManager.getSkill('combat') || 0);
        militia.trainingLevel = Math.min(100, militia.trainingLevel + trainingGain);
        militia.morale = Math.min(100, militia.morale + 2); // Training builds camaraderie
        return { success: true, message: `Drilled the troops. Training increased to ${militia.trainingLevel.toFixed(1)}%.` };
    }
    patrol(gameState) {
        const militia = this.getPlayerMilitia();
        if (!militia)
            return null;
        // 30% chance to find a skirmish
        if (Math.random() < 0.3) {
            return this.generateSkirmish(militia, gameState);
        }
        return {
            victory: true, // "Peaceful" patrol is a kind of victory
            casualties: 0,
            loot: 0,
            xpGained: 5,
            reputationChange: 1,
            log: ["Patrolled the area. No threats found."]
        };
    }
    generateSkirmish(playerMilitia, gameState) {
        // Generate a random enemy force
        const enemySize = Math.floor(playerMilitia.size * (0.5 + Math.random())); // 50% to 150% of player size
        const enemyStrength = 20 + (Math.random() * 40); // Random strength
        // Simple resolution for now
        const playerStrength = (playerMilitia.size * playerMilitia.trainingLevel * playerMilitia.equipmentLevel) / 1000;
        const enemyPower = (enemySize * enemyStrength * 30) / 1000; // Simplified
        const victory = playerStrength > enemyPower;
        const casualties = victory ? Math.floor(playerMilitia.size * 0.1 * Math.random()) : Math.floor(playerMilitia.size * 0.3 * Math.random());
        playerMilitia.size = Math.max(0, playerMilitia.size - casualties);
        const loot = victory ? Math.floor(enemySize * 5 * Math.random()) : 0;
        const xp = victory ? 50 : 10;
        const rep = victory ? 5 : -2;
        const log = [
            `Encountered a hostile force of ${enemySize} men!`,
            victory ? "Victory! The enemy scattered." : "Defeat! We were forced to retreat.",
            `Casualties: ${casualties}`,
            victory ? `Loot recovered: $${loot}` : "No loot."
        ];
        if (loot > 0)
            gameState.playerManager.modifyStat('money', loot);
        gameState.playerManager.gainXp(xp);
        return {
            victory,
            casualties,
            loot,
            xpGained: xp,
            reputationChange: rep,
            log
        };
    }
}
