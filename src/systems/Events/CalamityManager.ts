import type { GameState } from '../../core/GameState';
import { InventoryManager } from '../Inventory/InventoryManager';
import { PlayerManager } from '../Survival/PlayerStats';

export enum CalamityType {
    Raid = 'Raid',
    Tornado = 'Tornado',
    Fire = 'Fire',
    Drought = 'Drought',
    Disease = 'Disease'
}

export class CalamityManager {

    public triggerCalamity(type: CalamityType, state: GameState): void {
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

    private handleRaid(playerManager: PlayerManager, inventoryManager: InventoryManager, log: (msg: string) => void): void {
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

    private handleTornado(inventoryManager: InventoryManager, log: (msg: string) => void): void {
        // Destroy vehicle or items
        // For now just items
        const items = inventoryManager.getItems();
        if (items.length > 0) {
            const victim = items[Math.floor(Math.random() * items.length)];
            inventoryManager.removeItem(victim.item.id, victim.quantity);
            log(`A tornado swept through and destroyed your ${victim.item.name}!`);
        } else {
            log("The tornado missed you, but it was close!");
        }
    }

    private handleFire(playerManager: PlayerManager, log: (msg: string) => void): void {
        // Burn crops or buildings (if implemented)
        // For now, damage health (burns) and morale
        playerManager.modifyStat('health', -20);
        playerManager.modifyStat('morale', -30);
        log("A fire broke out! You suffered burns and lost hope.");
    }
}
