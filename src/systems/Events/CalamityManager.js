export var CalamityType;
(function (CalamityType) {
    CalamityType["Raid"] = "Raid";
    CalamityType["Tornado"] = "Tornado";
    CalamityType["Fire"] = "Fire";
    CalamityType["Drought"] = "Drought";
    CalamityType["Disease"] = "Disease";
})(CalamityType || (CalamityType = {}));
export class CalamityManager {
    triggerCalamity(type, state) {
        state.addLog(`!!! CALAMITY: ${type} !!!`);
        switch (type) {
            case CalamityType.Raid:
                this.handleRaid(state.playerManager, state.inventoryManager, state.addLog);
                break;
            case CalamityType.Tornado:
                this.handleTornado(state.inventoryManager, state.addLog);
                break;
            case CalamityType.Fire:
                this.handleFire(state.playerManager, state.addLog);
                break;
            // Add others
        }
    }
    handleRaid(playerManager, inventoryManager, log) {
        // Lose 50-100% of money
        const stats = playerManager.getStats();
        const moneyLoss = Math.floor(stats.money * (0.5 + Math.random() * 0.5));
        playerManager.modifyStat('money', -moneyLoss);
        // Lose random items
        const items = inventoryManager.getItems();
        let lostCount = 0;
        items.forEach(item => {
            if (Math.random() > 0.5) {
                inventoryManager.removeItem(item.item.id, item.quantity);
                lostCount++;
            }
        });
        log(`Raiders stole $${moneyLoss} and ${lostCount} stacks of items! You are left with almost nothing.`);
    }
    handleTornado(inventoryManager, log) {
        // Destroy vehicle or items
        // For now just items
        const items = inventoryManager.getItems();
        if (items.length > 0) {
            const victim = items[Math.floor(Math.random() * items.length)];
            inventoryManager.removeItem(victim.item.id, victim.quantity);
            log(`A tornado swept through and destroyed your ${victim.item.name}!`);
        }
        else {
            log("The tornado missed you, but it was close!");
        }
    }
    handleFire(playerManager, log) {
        // Burn crops or buildings (if implemented)
        // For now, damage health (burns) and morale
        playerManager.modifyStat('health', -20);
        playerManager.modifyStat('morale', -30);
        log("A fire broke out! You suffered burns and lost hope.");
    }
}
