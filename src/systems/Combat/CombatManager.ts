import type { CombatState, Enemy } from './CombatTypes';
import { CombatActionType } from './CombatTypes';
import { PlayerManager } from '../Survival/PlayerStats';

export class CombatManager {
    private state: CombatState;

    constructor() {
        this.state = {
            isActive: false,
            enemy: null,
            playerHealth: 100,
            playerMaxHealth: 100,
            combatLog: [],
            turn: 1
        };
    }

    public startCombat(enemy: Enemy, playerManager: PlayerManager): void {
        const stats = playerManager.getStats();
        this.state = {
            isActive: true,
            enemy: { ...enemy }, // Clone enemy
            playerHealth: stats.health,
            playerMaxHealth: 100, // Assuming 100 is max for now
            combatLog: [`Combat started with ${enemy.name}!`],
            turn: 1
        };
    }

    public getState(): CombatState {
        return this.state;
    }

    public playerAction(action: CombatActionType, playerManager: PlayerManager): void {
        if (!this.state.isActive || !this.state.enemy) return;

        switch (action) {
            case CombatActionType.Attack:
                this.handlePlayerAttack(playerManager);
                break;
            case CombatActionType.Defend:
                this.state.combatLog.unshift("You take a defensive stance.");
                break;
            case CombatActionType.Flee:
                this.handlePlayerFlee(playerManager);
                return; // End turn immediately if fled
            case CombatActionType.Negotiate:
                this.handlePlayerNegotiate(playerManager);
                break;
        }

        if (this.state.isActive) {
            this.enemyTurn(playerManager);
        }
    }

    private handlePlayerAttack(playerManager: PlayerManager): void {
        if (!this.state.enemy) return;

        // Base damage + weapon damage (placeholder for now)
        const damage = Math.floor(Math.random() * 10) + 5;
        this.state.enemy.health -= damage;
        this.state.combatLog.unshift(`You hit ${this.state.enemy.name} for ${damage} damage.`);

        if (this.state.enemy.health <= 0) {
            this.endCombat(true, playerManager);
        }
    }

    private handlePlayerFlee(playerManager: PlayerManager): void {
        // 50% chance to flee
        if (Math.random() > 0.5) {
            this.state.combatLog.unshift("You managed to escape!");
            this.state.isActive = false;
            this.state.enemy = null;
        } else {
            this.state.combatLog.unshift("Failed to escape!");
            this.enemyTurn(playerManager);
        }
    }

    private handlePlayerNegotiate(_playerManager: PlayerManager): void {
        // Simple negotiation logic
        if (Math.random() > 0.7) {
            this.state.combatLog.unshift("You talked your way out of it.");
            this.state.isActive = false;
            this.state.enemy = null;
        } else {
            this.state.combatLog.unshift("Negotiation failed!");
        }
    }

    private enemyTurn(playerManager: PlayerManager): void {
        if (!this.state.isActive || !this.state.enemy) return;

        const damage = Math.floor(Math.random() * this.state.enemy.damage) + 1;
        this.state.playerHealth -= damage;
        playerManager.modifyStat('health', -damage);
        this.state.combatLog.unshift(`${this.state.enemy.name} hits you for ${damage} damage.`);

        if (this.state.playerHealth <= 0) {
            this.state.isActive = false;
            // Player death handled by GameState
        }

        this.state.turn++;
    }

    private endCombat(victory: boolean, playerManager: PlayerManager): void {
        this.state.isActive = false;
        if (victory && this.state.enemy) {
            this.state.combatLog.unshift(`You defeated ${this.state.enemy.name}!`);
            // Loot logic
            if (this.state.enemy.money > 0) {
                playerManager.modifyStat('money', this.state.enemy.money);
                this.state.combatLog.unshift(`Looted $${this.state.enemy.money}.`);
            }
        }
        this.state.enemy = null;
    }
}
