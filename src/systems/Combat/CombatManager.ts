import type { CombatState, Enemy } from './CombatTypes';
import { CombatActionType } from './CombatTypes';
import { PlayerManager } from '../Survival/PlayerStats';
import { InventoryManager } from '../Inventory/InventoryManager';
import type { Item } from '../Inventory/InventoryTypes';

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
            playerMaxHealth: 100,
            combatLog: [`Combat started with ${enemy.name}!`],
            turn: 1
        };
    }

    public getState(): CombatState {
        return this.state;
    }

    public playerAction(action: CombatActionType, playerManager: PlayerManager, inventoryManager: InventoryManager): void {
        if (!this.state.isActive || !this.state.enemy) return;

        switch (action) {
            case CombatActionType.Attack:
                this.handlePlayerAttack(playerManager, inventoryManager);
                break;
            case CombatActionType.Defend:
                this.state.combatLog.unshift("You take a defensive stance.");
                // Could add temporary defense buff here
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

    private handlePlayerAttack(playerManager: PlayerManager, inventoryManager: InventoryManager): void {
        if (!this.state.enemy) return;

        // Find best weapon in inventory
        const items = inventoryManager.getItems();
        let bestWeapon: Item | null = null;
        let maxDamage = 0;

        items.forEach((invItem) => {
            if (invItem.item.type === 'Weapon' && invItem.item.weaponStats) {
                if (invItem.item.weaponStats.damage > maxDamage) {
                    maxDamage = invItem.item.weaponStats.damage;
                    bestWeapon = invItem.item;
                }
            }
        });

        const weaponName = bestWeapon ? bestWeapon.name : "Fists";
        const baseDamage = bestWeapon && bestWeapon.weaponStats ? bestWeapon.weaponStats.damage : 5;
        let accuracy = bestWeapon && bestWeapon.weaponStats ? bestWeapon.weaponStats.accuracy : 90;

        // Apply Combat Skill
        const combatSkill = playerManager.getSkill('combat');
        accuracy += combatSkill * 5; // +5% accuracy per level
        const damageBonus = Math.floor(combatSkill * 1.5); // +1.5 damage per level

        // Hit Check
        if (Math.random() * 100 > accuracy) {
            this.state.combatLog.unshift(`You attacked with ${weaponName} but missed!`);
            return;
        }

        // Damage Calculation
        // Damage = (Base + Random(0-5)) - EnemyDefense
        const rawDamage = baseDamage + damageBonus + Math.floor(Math.random() * 6);
        const actualDamage = Math.max(1, rawDamage - this.state.enemy.defense);

        this.state.enemy.health -= actualDamage;
        this.state.combatLog.unshift(`You hit ${this.state.enemy.name} with ${weaponName} for ${actualDamage} damage.`);

        // Chance to improve combat skill
        if (Math.random() < 0.05) { // 5% chance per hit
            playerManager.improveSkill('combat');
            this.state.combatLog.unshift("Your Combat skill improved!");
        }

        if (this.state.enemy.health <= 0) {
            this.endCombat(true, playerManager, inventoryManager);
        }
    }

    private handlePlayerFlee(_playerManager: PlayerManager): void {
        // 50% chance to flee, modified by health?
        if (Math.random() > 0.5) {
            this.state.combatLog.unshift("You managed to escape!");
            this.state.isActive = false;
            this.state.enemy = null;
        } else {
            this.state.combatLog.unshift("Failed to escape!");
            // Enemy gets a free hit? handled by normal turn
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

        // Enemy Hit Chance (fixed 80% for now)
        if (Math.random() > 0.8) {
            this.state.combatLog.unshift(`${this.state.enemy.name} attacked but missed you.`);
            return;
        }

        const damage = Math.max(1, Math.floor(Math.random() * this.state.enemy.damage) + 1);
        this.state.playerHealth -= damage;
        playerManager.modifyStat('health', -damage);
        this.state.combatLog.unshift(`${this.state.enemy.name} hits you for ${damage} damage.`);

        if (this.state.playerHealth <= 0) {
            this.state.isActive = false;
            // Player death handled by GameState
        }

        this.state.turn++;
    }

    private endCombat(victory: boolean, playerManager: PlayerManager, inventoryManager: InventoryManager): void {
        this.state.isActive = false;
        if (victory && this.state.enemy) {
            this.state.combatLog.unshift(`You defeated ${this.state.enemy.name}!`);

            // Loot logic
            if (this.state.enemy.money > 0) {
                playerManager.modifyStat('money', this.state.enemy.money);
                this.state.combatLog.unshift(`Looted $${this.state.enemy.money}.`);
            }

            if (this.state.enemy.loot && this.state.enemy.loot.length > 0) {
                this.state.enemy.loot.forEach(itemId => {
                    // 50% chance for each loot item
                    if (Math.random() > 0.5) {
                        inventoryManager.addItem(itemId, 1);
                        this.state.combatLog.unshift(`Looted: ${itemId}`);
                    }
                });
            }

            // Grant XP
            const xpGain = 20 + (this.state.enemy.maxHealth / 5);
            const levelUpMsg = playerManager.gainXp(xpGain);
            if (levelUpMsg) {
                this.state.combatLog.unshift(levelUpMsg);
            }
        }
        this.state.enemy = null;
    }
}
