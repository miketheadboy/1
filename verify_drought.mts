import { GameState, useGameStore } from './src/core/GameState';
import { ItemType } from './src/systems/Inventory/InventoryTypes';
import { EconomySystem } from './src/systems/Economy/EconomySystem';
import { INITIAL_MAP_NODES } from './src/systems/World/MapData';

// Mock Item
const foodItem = {
    id: 'food',
    name: 'Food',
    type: ItemType.Food,
    description: 'Food',
    effects: {},
    value: 10
};

const horseItem = {
    id: 'horse',
    name: 'Horse',
    type: ItemType.Resource,
    description: 'Horse',
    effects: {},
    value: 100
};

// Get State
const state = useGameStore.getState();
const worldState = state.systemInterconnects.getWorldState();

console.log('--- DROUGHT VERIFICATION ---');

// 1. Normal Prices
console.log('\n1. Normal Conditions:');
let lawrencePrice = EconomySystem.getPriceWithContext(foodItem, INITIAL_MAP_NODES['lawrence'], 10, false);
console.log(`Food Price in Lawrence (Normal): $${lawrencePrice} (Expected ~$10)`);

// 2. Trigger Drought
console.log('\n2. Triggering Drought...');
worldState.moistureLevel = 10;
worldState.droughtActive = true;

// 3. Drought Prices
let lawrenceDroughtPrice = EconomySystem.getPriceWithContext(foodItem, INITIAL_MAP_NODES['lawrence'], 10, true);
console.log(`Food Price in Lawrence (Drought): $${lawrenceDroughtPrice} (Expected ~$40)`);

let leavenworthDroughtPrice = EconomySystem.getPriceWithContext(foodItem, INITIAL_MAP_NODES['leavenworth'], 10, true);
console.log(`Food Price in Leavenworth (Drought): $${leavenworthDroughtPrice} (Expected ~$15)`);

let horseDroughtPrice = EconomySystem.getPriceWithContext(horseItem, INITIAL_MAP_NODES['lawrence'], 100, true);
console.log(`Horse Price in Lawrence (Drought): $${horseDroughtPrice} (Expected ~$50)`);

// 4. Verify Logic
if (lawrenceDroughtPrice > 35 && leavenworthDroughtPrice < 20 && horseDroughtPrice < 60) {
    console.log('\n✅ VERIFICATION SUCCESS: Drought mechanics are working correctly.');
} else {
    console.error('\n❌ VERIFICATION FAILED: Prices did not match expected values.');
}
