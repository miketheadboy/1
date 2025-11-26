import { FactionType } from '../Factions/FactionTypes';
/**
 * All enemy templates
 */
export const ENEMY_TEMPLATES = {
    // ========================================================================
    // HOSTILE HUMANS
    // ========================================================================
    border_ruffian: {
        id: 'border_ruffian',
        name: 'Border Ruffian',
        description: 'Pro-slavery militant from Missouri, armed and dangerous',
        faction: FactionType.ProSlavery,
        minHealth: 60,
        maxHealth: 80,
        minDamage: 12,
        maxDamage: 18,
        defense: 3,
        accuracy: 0.7,
        lootTable: [
            { itemId: 'revolver', dropChance: 0.3, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ammunition', dropChance: 0.6, minQuantity: 5, maxQuantity: 15 },
            { itemId: 'whiskey', dropChance: 0.4, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'hardtack', dropChance: 0.3, minQuantity: 2, maxQuantity: 5 }
        ],
        minMoney: 5,
        maxMoney: 25,
        aggressionLevel: 0.7,
        fleeThreshold: 0.2,
        xpReward: 25
    },
    jayhawker_raider: {
        id: 'jayhawker_raider',
        name: 'Jayhawker Raider',
        description: 'Free State militant, fiercely anti-slavery',
        faction: FactionType.FreeState,
        minHealth: 65,
        maxHealth: 85,
        minDamage: 14,
        maxDamage: 20,
        defense: 4,
        accuracy: 0.75,
        lootTable: [
            { itemId: 'sharps_rifle', dropChance: 0.25, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ammunition', dropChance: 0.7, minQuantity: 10, maxQuantity: 20 },
            { itemId: 'medicine', dropChance: 0.3, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'rope', dropChance: 0.4, minQuantity: 1, maxQuantity: 1 }
        ],
        minMoney: 10,
        maxMoney: 35,
        aggressionLevel: 0.65,
        fleeThreshold: 0.25,
        xpReward: 30
    },
    bushwhacker: {
        id: 'bushwhacker',
        name: 'Bushwhacker',
        description: 'Guerrilla fighter, ruthless and unpredictable',
        faction: FactionType.ProSlavery,
        minHealth: 70,
        maxHealth: 90,
        minDamage: 16,
        maxDamage: 24,
        defense: 5,
        accuracy: 0.8,
        lootTable: [
            { itemId: 'bowie_knife', dropChance: 0.5, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'revolver', dropChance: 0.4, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ammunition', dropChance: 0.8, minQuantity: 10, maxQuantity: 25 },
            { itemId: 'whiskey', dropChance: 0.6, minQuantity: 1, maxQuantity: 3 }
        ],
        minMoney: 15,
        maxMoney: 50,
        aggressionLevel: 0.85,
        fleeThreshold: 0.15,
        xpReward: 40
    },
    slave_catcher: {
        id: 'slave_catcher',
        name: 'Slave Catcher',
        description: 'Ruthless bounty hunter tracking escaped slaves',
        faction: FactionType.ProSlavery,
        minHealth: 75,
        maxHealth: 100,
        minDamage: 18,
        maxDamage: 26,
        defense: 6,
        accuracy: 0.85,
        lootTable: [
            { itemId: 'revolver', dropChance: 0.7, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ammunition', dropChance: 0.9, minQuantity: 15, maxQuantity: 30 },
            { itemId: 'rope', dropChance: 0.8, minQuantity: 1, maxQuantity: 2 }
        ],
        minMoney: 25,
        maxMoney: 75,
        aggressionLevel: 0.9,
        fleeThreshold: 0.1,
        xpReward: 50
    },
    bounty_hunter: {
        id: 'bounty_hunter',
        name: 'Bounty Hunter',
        description: 'Professional manhunter, well-armed and experienced',
        faction: FactionType.Neutral,
        minHealth: 80,
        maxHealth: 110,
        minDamage: 20,
        maxDamage: 30,
        defense: 7,
        accuracy: 0.9,
        lootTable: [
            { itemId: 'sharps_rifle', dropChance: 0.5, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'revolver', dropChance: 0.7, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'ammunition', dropChance: 1.0, minQuantity: 20, maxQuantity: 50 },
            { itemId: 'medicine', dropChance: 0.5, minQuantity: 1, maxQuantity: 3 }
        ],
        minMoney: 40,
        maxMoney: 120,
        aggressionLevel: 1.0,
        fleeThreshold: 0.05,
        xpReward: 75
    },
    outlaw_bandit: {
        id: 'outlaw_bandit',
        name: 'Outlaw',
        description: 'Common criminal looking for easy pickings',
        faction: FactionType.Neutral,
        minHealth: 50,
        maxHealth: 70,
        minDamage: 10,
        maxDamage: 16,
        defense: 2,
        accuracy: 0.65,
        lootTable: [
            { itemId: 'revolver', dropChance: 0.4, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bowie_knife', dropChance: 0.6, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ammunition', dropChance: 0.5, minQuantity: 3, maxQuantity: 10 },
            { itemId: 'whiskey', dropChance: 0.7, minQuantity: 1, maxQuantity: 2 }
        ],
        minMoney: 3,
        maxMoney: 20,
        aggressionLevel: 0.6,
        fleeThreshold: 0.3,
        xpReward: 15
    },
    // ========================================================================
    // DANGEROUS WILDLIFE
    // ========================================================================
    grizzly_bear: {
        id: 'grizzly_bear',
        name: 'Grizzly Bear',
        description: 'Massive predator, extremely dangerous',
        faction: FactionType.Native,
        minHealth: 120,
        maxHealth: 150,
        minDamage: 25,
        maxDamage: 40,
        defense: 8,
        accuracy: 0.75,
        lootTable: [
            { itemId: 'meat', dropChance: 1.0, minQuantity: 20, maxQuantity: 40 }
        ],
        minMoney: 0,
        maxMoney: 0,
        aggressionLevel: 0.8,
        fleeThreshold: 0.1,
        xpReward: 60
    },
    wolf_pack: {
        id: 'wolf_pack',
        name: 'Wolf Pack',
        description: '3-5 wolves hunting together',
        faction: FactionType.Native,
        minHealth: 90,
        maxHealth: 120,
        minDamage: 18,
        maxDamage: 28,
        defense: 4,
        accuracy: 0.8,
        lootTable: [
            { itemId: 'meat', dropChance: 0.9, minQuantity: 10, maxQuantity: 20 }
        ],
        minMoney: 0,
        maxMoney: 0,
        aggressionLevel: 0.7,
        fleeThreshold: 0.2,
        xpReward: 45
    },
    wild_boar: {
        id: 'wild_boar',
        name: 'Wild Boar',
        description: 'Aggressive tusked pig',
        faction: FactionType.Native,
        minHealth: 60,
        maxHealth: 80,
        minDamage: 12,
        maxDamage: 20,
        defense: 3,
        accuracy: 0.7,
        lootTable: [
            { itemId: 'meat', dropChance: 1.0, minQuantity: 15, maxQuantity: 25 }
        ],
        minMoney: 0,
        maxMoney: 0,
        aggressionLevel: 0.5,
        fleeThreshold: 0.25,
        xpReward: 20
    },
    rattlesnake: {
        id: 'rattlesnake',
        name: 'Rattlesnake',
        description: 'Venomous serpent, often found in tall grass',
        faction: FactionType.Native,
        minHealth: 20,
        maxHealth: 30,
        minDamage: 8,
        maxDamage: 15,
        defense: 1,
        accuracy: 0.85,
        lootTable: [],
        minMoney: 0,
        maxMoney: 0,
        aggressionLevel: 0.3,
        fleeThreshold: 0.5,
        xpReward: 10
    }
};
/**
 * Generate an enemy from a template with randomized stats
 */
export function generateEnemy(templateId) {
    const template = ENEMY_TEMPLATES[templateId];
    if (!template) {
        throw new Error(`Unknown enemy template: ${templateId}`);
    }
    const health = randomInt(template.minHealth, template.maxHealth);
    const damage = randomInt(template.minDamage, template.maxDamage);
    return {
        id: `${template.id}_${Date.now()}`,
        name: template.name,
        description: template.description,
        faction: template.faction,
        health,
        maxHealth: health,
        damage,
        defense: template.defense,
        loot: [],
        money: randomInt(template.minMoney, template.maxMoney),
        accuracy: Math.floor(template.accuracy * 100),
        xpReward: template.xpReward
    };
}
/**
 * Legacy enemy data for backward compatibility
 */
export const ENEMIES = {
    slave_catcher: generateEnemy('slave_catcher'),
    border_ruffian: generateEnemy('border_ruffian'),
    bounty_hunter: generateEnemy('bounty_hunter'),
    outlaw_bandit: generateEnemy('outlaw_bandit'),
    grizzly_bear: generateEnemy('grizzly_bear'),
    wolf_pack: generateEnemy('wolf_pack')
};
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
