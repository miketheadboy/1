import { Enemy } from './CombatTypes';
import { FactionType } from '../Factions/FactionTypes';

export const ENEMIES: Record<string, Enemy> = {
    slave_catcher: {
        id: 'slave_catcher',
        name: 'Slave Catcher',
        description: 'A ruthless mercenary hunting for escaped slaves.',
        faction: FactionType.ProSlavery,
        health: 80,
        maxHealth: 80,
        damage: 15,
        defense: 5,
        loot: ['money', 'whiskey', 'pistol'],
        money: 50
    },
    border_ruffian: {
        id: 'border_ruffian',
        name: 'Border Ruffian',
        description: 'A pro-slavery militant from Missouri, looking for trouble.',
        faction: FactionType.ProSlavery,
        health: 50,
        maxHealth: 50,
        damage: 10,
        defense: 5,
        loot: ['whiskey', 'dried_meat', 'knife'],
        money: 15
    },
    jayhawker: {
        id: 'jayhawker',
        name: 'Jayhawker',
        description: 'A militant abolitionist raider.',
        faction: FactionType.Abolitionist,
        health: 45,
        maxHealth: 45,
        damage: 12,
        defense: 4,
        loot: ['hardtack', 'pistol'],
        money: 12
    },
    bandit: {
        id: 'bandit',
        name: 'Highwayman',
        description: 'A ruthless bandit preying on travelers.',
        faction: FactionType.ProSlavery, // Bandits might not have a real faction, but defaulting for now
        health: 40,
        maxHealth: 40,
        damage: 8,
        defense: 2,
        loot: ['knife', 'dried_meat'],
        money: 25
    },
    wolf: {
        id: 'wolf',
        name: 'Timber Wolf',
        description: 'A large, aggressive wolf.',
        faction: FactionType.Native, // Using Native as placeholder for "Nature"
        health: 30,
        maxHealth: 30,
        damage: 15,
        defense: 3,
        loot: ['dried_meat'],
        money: 0
    }
};
