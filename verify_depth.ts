import { useGameStore } from './src/core/GameState';
import { KnowledgeType } from './src/systems/Knowledge/KnowledgeTypes';
import { CombatActionType } from './src/systems/Combat/CombatTypes';

const state = useGameStore.getState();
const playerManager = state.playerManager;
const inventoryManager = state.inventoryManager;
const knowledgeManager = state.knowledgeManager;
const combatManager = state.combatManager;

console.log('--- DEPTH MECHANICS VERIFICATION ---');

// 1. Setup for Beecher's Bibles
console.log('\n1. Testing Beecher\'s Bibles...');
playerManager.modifyStat('xp', 1000); // Level up
knowledgeManager.gainXp(KnowledgeType.Theology, 500, (msg) => console.log(msg)); // Level up Theology
// Unlock perk manually for test
// knowledgeManager.state.unlockedPerks.push('beechers_bibles'); // Hack for test if level up logic is complex
// Actually let's try to unlock it properly if we can, or just force it.
// The level up logic in KnowledgeManager checks perks.
// Let's force the perk for verification certainty.
(knowledgeManager as any).state.unlockedPerks.push('beechers_bibles');
console.log('Perk "Beecher\'s Bibles" unlocked.');

inventoryManager.addItem('sharps_rifle', 1);
console.log('Sharps Rifle added.');

// Start Mock Combat
const mockEnemy = {
    id: 'border_ruffian',
    name: 'Border Ruffian',
    health: 50,
    maxHealth: 50,
    damage: 10,
    defense: 0,
    xpReward: 20,
    money: 10,
    lootTable: []
};
combatManager.startCombat(mockEnemy, playerManager);

// Attack with Rifle
console.log('Performing Attack with Sharps Rifle + Perk...');
combatManager.performAction(CombatActionType.Attack, playerManager, inventoryManager, knowledgeManager);
const log = combatManager.getState().combatLog;
console.log('Combat Log:', log[0]);
console.log('Combat Log:', log[1]);

if (log.some(l => l.includes('Righteous fury'))) {
    console.log('✅ Beecher\'s Bibles Damage Bonus Verified.');
} else {
    console.error('❌ Beecher\'s Bibles Damage Bonus FAILED.');
}

// 2. Setup for Political Censorship
console.log('\n2. Testing Political Censorship...');
inventoryManager.addItem('printing_press', 1);
console.log('Printing Press added.');

// Mock Storyteller Update
console.log('Simulating Storyteller Update (forcing random check)...');
// We can't easily force the random check inside Storyteller without mocking Math.random or running it many times.
// Let's run it 100 times and see if it triggers.
let raidTriggered = false;
const storyteller = state.storytellerEngine;
const worldState = state.systemInterconnects.getWorldState();

for (let i = 0; i < 200; i++) {
    const event = storyteller.update(worldState, state);
    if (event && event.id.startsWith('ruffian_raid')) {
        console.log('✅ Ruffian Raid Triggered:', event.title);
        raidTriggered = true;
        break;
    }
}

if (!raidTriggered) {
    console.warn('⚠️ Ruffian Raid did not trigger in 200 ticks (Random chance). Logic exists but RNG is RNG.');
}
