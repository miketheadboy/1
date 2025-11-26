import type { CombatState, Enemy } from './CombatTypes';
import { CombatActionType } from './CombatTypes';
import { PlayerManager } from '../Survival/PlayerStats';
import { InventoryManager } from '../Inventory/InventoryManager';
import { ItemType } from '../Inventory/InventoryTypes';
import type { Item } from '../Inventory/InventoryTypes';
import { LootManager } from '../Loot/LootManager';
import { ENEMY_TEMPLATES } from './EnemyData';
import { KnowledgeManager } from '../Knowledge/KnowledgeManager';

export class CombatManager {
    private state: CombatState;
    private lootManager: LootManager;

    constructor() {
        this.state = {
            isActive: false,
            enemy: null,
            playerHealth: 100,
            playerMaxHealth: 100,
            combatLog: [],
            turnCount: 1,
            distance: 30 // Start at 30m
        };
        this.lootManager = new LootManager();
    }

    public startCombat(enemy: Enemy, playerManager: PlayerManager): void {
        const stats = playerManager.getStats();
        this.state = {
            isActive: true,
            enemy: { ...enemy }, // Clone enemy
            playerHealth: stats.health,
            playerMaxHealth: 100,
            combatLog: [`Combat started with ${enemy.name}!`],
            turnCount: 1,
            distance: 30
        };
    }

    public getState(): CombatState {
        return this.state;
    }

    public performAction(action: CombatActionType, playerManager: PlayerManager, inventoryManager: InventoryManager, knowledgeManager: KnowledgeManager): void {
        if (!this.state.isActive || !this.state.enemy) return;

        switch (action) {
            case CombatActionType.Shoot:
                this.handlePlayerShoot(playerManager, inventoryManager, knowledgeManager);
                break;
            case CombatActionType.Melee:
                this.handlePlayerMelee(playerManager, inventoryManager, knowledgeManager);
                break;
            case CombatActionType.Reload:
                this.state.combatLog.unshift("You reload your weapon.");
                // TODO: Add ammo tracking
                break;
            case CombatActionType.Attack: // Fallback
                this.handlePlayerAttack(playerManager, inventoryManager, knowledgeManager);
                break;
            case CombatActionType.Defend:
                this.state.combatLog.unshift("You take a defensive stance.");
                // Could add temporary defense buff here
                break;
            case CombatActionType.Flee:
                this.handlePlayerFlee();
                return; // End turn immediately if fled
            case CombatActionType.Negotiate:
                this.handlePlayerNegotiate(playerManager, inventoryManager, knowledgeManager);
                break;
        }

        if (this.state.isActive) {
            this.enemyTurn(playerManager);
        }
    }

    private handlePlayerShoot(playerManager: PlayerManager, inventoryManager: InventoryManager, knowledgeManager: KnowledgeManager): void {
        // Check for ranged weapon
        // For now, assume player has a gun if they choose Shoot
        // Accuracy penalty if too close?
        let accuracyMod = 0;
        if (this.state.distance < 5) {
            accuracyMod = -20;
            this.state.combatLog.unshift("It's hard to aim this close!");
        }

        this.handlePlayerAttack(playerManager, inventoryManager, knowledgeManager, accuracyMod);
    }

    private handlePlayerMelee(playerManager: PlayerManager, inventoryManager: InventoryManager, knowledgeManager: KnowledgeManager): void {
        if (this.state.distance > 5) {
            this.state.combatLog.unshift("Enemy is too far away! Closing distance...");
            this.state.distance = Math.max(0, this.state.distance - 10);
            return;
        }
        this.handlePlayerAttack(playerManager, inventoryManager, knowledgeManager, 20); // Bonus accuracy/damage for melee?
    }

    private handlePlayerNegotiate(playerManager: PlayerManager, inventoryManager: InventoryManager, knowledgeManager: KnowledgeManager): void {
        if (!this.state.enemy) return;

        const stats = playerManager.getStats();

        // Apply Item Effects for Negotiation
        const bestWeapon = inventoryManager.getBestWeapon();
        if (bestWeapon && bestWeapon.combatEffects) {
            for (const effect of bestWeapon.combatEffects) {
                if (effect.trigger === 'on_negotiate' && (!effect.condition || effect.condition({ knowledgeManager, negotiationType: 'Preach' }))) { // Assuming Preach for now or we need to pass negotiation type
                    // Handle specific negotiation effects
                    if (Math.random() < effect.chance) {
                        this.state.combatLog.unshift(effect.message || "Your words strike fear into their hearts!");
                        this.endCombat(true, playerManager, inventoryManager);
                        return;
                    }
                }
            }
        }

        // Simple negotiation logic
        const negotiationChance = Math.random();

        if (negotiationChance > 0.5) {
            this.state.combatLog.unshift(`You attempt to reason with the ${this.state.enemy.name}...`);

            if (Math.random() > 0.4) {
                this.state.combatLog.unshift("Success! The enemy agrees to cease hostilities.");
                this.endCombat(true, playerManager, inventoryManager);
                return;
            } else {
                this.state.combatLog.unshift("The enemy ignores your words!");
            }
        } else {
            this.state.combatLog.unshift(`You offer the ${this.state.enemy.name} a way out...`);
            if (stats.money >= 10 && Math.random() > 0.3) {
                playerManager.modifyStat('money', -10);
                this.state.combatLog.unshift("You bribed the enemy with $10 to leave.");
                this.endCombat(true, playerManager, inventoryManager);
                return;
            } else {
                this.state.combatLog.unshift("They refuse your offer!");
            }
        }
    }

    private handlePlayerAttack(playerManager: PlayerManager, inventoryManager: InventoryManager, knowledgeManager: KnowledgeManager, accuracyMod: number = 0): void {
        if (!this.state.enemy) return;

        // Find best weapon in inventory
        const items = inventoryManager.getItems();
        let bestWeapon: Item | null = null;
        let maxDamage = 0;

        for (const invItem of items) {
            if (invItem.item.type === ItemType.Weapon && invItem.item.weaponStats) {
                if (invItem.item.weaponStats.damage > maxDamage) {
                    maxDamage = invItem.item.weaponStats.damage;
                    bestWeapon = invItem.item;
                }
            }
        }

        const weaponName = bestWeapon ? bestWeapon.name : "Fists";
        const baseDamage = bestWeapon && bestWeapon.weaponStats ? bestWeapon.weaponStats.damage : 5;
        let accuracy = bestWeapon && bestWeapon.weaponStats ? bestWeapon.weaponStats.accuracy : 90;

        // Apply Combat Skill
        const combatSkill = playerManager.getSkill('combat');
        accuracy += combatSkill * 5; // +5% accuracy per level
        accuracy += accuracyMod;
        let damageBonus = Math.floor(combatSkill * 1.5); // +1.5 damage per level

        // Apply Item Effects
        if (bestWeapon && bestWeapon.combatEffects) {
            for (const effect of bestWeapon.combatEffects) {
                if (effect.trigger === 'on_attack' && (!effect.condition || effect.condition({ knowledgeManager }))) {
                    if (effect.multiplier) {
                        damageBonus += Math.floor(baseDamage * effect.multiplier);
                    }
                    if (effect.value) {
                        damageBonus += effect.value;
                    }
                    if (effect.message) {
                        this.state.combatLog.unshift(effect.message);
                    }
                }
            }
        }

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

    private handlePlayerFlee(): void {
        // 50% chance to flee
        if (Math.random() > 0.5) {
            this.state.combatLog.unshift("You managed to escape!");
            this.state.isActive = false;
            this.state.enemy = null;
        } else {
            this.state.combatLog.unshift("Failed to escape!");
        }
    }



    private enemyTurn(playerManager: PlayerManager): void {
        if (!this.state.isActive || !this.state.enemy) return;

        // Enemy movement logic
        if (this.state.distance > 5) {
            // Enemy closes in
            const moveDist = 10;
            this.state.distance = Math.max(0, this.state.distance - moveDist);
            this.state.combatLog.unshift(`${this.state.enemy.name} advances! Distance: ${this.state.distance}m`);
        }

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

        this.state.turnCount++;
    }

    private endCombat(victory: boolean, playerManager: PlayerManager, inventoryManager: InventoryManager): void {
        this.state.isActive = false;
        if (victory && this.state.enemy) {
            this.state.combatLog.unshift(`You defeated ${this.state.enemy.name}!`);

            // Generate loot from enemy template
            const enemyId = this.state.enemy.id.split('_')[0]; // Get template ID
            const template = ENEMY_TEMPLATES[enemyId];

            if (template) {
                // Apply scavenging skill as luck modifier
                const scavengingSkill = playerManager.getSkill('scavenging');
                const luckModifier = scavengingSkill * 0.05; // 5% per level

                const loot = this.lootManager.generateLootWithLuck(
                    template.lootTable,
                    { min: template.minMoney, max: template.maxMoney },
                    luckModifier
                );

                // Add money
                if (loot.money > 0) {
                    playerManager.modifyStat('money', loot.money);
                    this.state.combatLog.unshift(`Looted $${loot.money}`);
                }

                // Add items
                for (const item of loot.items) {
                    inventoryManager.addItem(item.itemId, item.quantity);
                    this.state.combatLog.unshift(`Looted: ${item.quantity}x ${item.itemId}`);
                }

                // Grant XP from template
                const levelUpMsg = playerManager.gainXp(template.xpReward);
                if (levelUpMsg) {
                    this.state.combatLog.unshift(levelUpMsg);
                }
            } else {
                // Fallback for enemies without templates
                if (this.state.enemy.money > 0) {
                    playerManager.modifyStat('money', this.state.enemy.money);
                    this.state.combatLog.unshift(`Looted $${this.state.enemy.money}`);
                }
            }
        }
        this.state.enemy = null;
    }
}
