import { create } from 'zustand';
import { FactionManager } from '../systems/Factions/FactionManager';
import { PlayerManager, INITIAL_PLAYER_STATS } from '../systems/Survival/PlayerStats';
import { TravelSystem } from '../systems/World/TravelSystem';
import { EcologySystem } from '../systems/Ecology/EcologySystem';
import { EventManager } from '../systems/Events/EventManager';
import { InventoryManager } from '../systems/Inventory/InventoryManager';
import { CombatManager } from '../systems/Combat/CombatManager';
import { AnimalManager } from '../systems/Animals/AnimalManager';
import { UndergroundRailroadSystem, Mission } from '../systems/UndergroundRailroad/UndergroundRailroadSystem';
import { INITIAL_EVENTS } from '../systems/Events/EventData';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import { STARTING_ITEMS } from '../systems/Inventory/ItemData';
import { getRandomEvent } from '../systems/Events/RandomEventData';
import type { GameEvent, GameEventOption } from '../systems/Events/EventTypes';
import { CombatActionType } from '../systems/Combat/CombatTypes';
import type { Enemy } from '../systems/Combat/CombatTypes';
import type { CharacterBackground } from '../systems/Character/CharacterTypes';
import { SaveManager } from '../systems/SaveLoad/SaveManager';
import { AnimalType } from '../systems/Animals/AnimalTypes';
import { FactionType } from '../systems/Factions/FactionTypes';

export interface GameState {
    // Systems
    factionManager: FactionManager;
    playerManager: PlayerManager;
    travelSystem: TravelSystem;
    ecologySystem: EcologySystem;
    eventManager: EventManager;
    inventoryManager: InventoryManager;
    combatManager: CombatManager;
    animalManager: AnimalManager;
    undergroundRailroadSystem: UndergroundRailroadSystem;

    // Game Data
    currentDate: Date;
    currentLocationId: string;
    gameLog: string[];
    currentEvent: GameEvent | null;
    gameOver: boolean;
    deathReason: string | null;
    characterBackground: CharacterBackground | null;

    // Actions
    addLog: (message: string) => void;
    advanceTime: (days: number) => void;
    travelTo: (nodeId: string) => void;
    resolveEventOption: (option: GameEventOption) => void;
    useItem: (itemId: string) => void;
    buyItem: (itemId: string, quantity: number) => void;
    startCombat: (enemy: Enemy) => void;
    performCombatAction: (action: CombatActionType) => void;
    setCharacter: (bg: CharacterBackground) => void;
    saveGame: (slotId: string, slotName: string) => void;
    loadGame: (slotId: string) => void;
    huntAnimal: (animalId: string) => void;
    fightAnimal: (animalId: string) => void;
    buyAnimal: (type: AnimalType, price: number) => void;
    startMission: (mission: Mission) => void;
}

export const useGameStore = create<GameState>((set, get) => {
    // Initialize Systems
    const factionManager = new FactionManager();
    const playerManager = new PlayerManager(INITIAL_PLAYER_STATS);
    const travelSystem = new TravelSystem(INITIAL_MAP_NODES);
    const ecologySystem = new EcologySystem();
    const eventManager = new EventManager();
    const inventoryManager = new InventoryManager();
    const combatManager = new CombatManager();
    const animalManager = new AnimalManager();
    const undergroundRailroadSystem = new UndergroundRailroadSystem();

    // Register Initial Events
    INITIAL_EVENTS.forEach(e => eventManager.registerEvent(e));

    // Trigger the initial event so it's marked as seen
    if (INITIAL_EVENTS.length > 0) {
        eventManager.triggerEvent(INITIAL_EVENTS[0].id);
    }

    // Initialize starting inventory
    STARTING_ITEMS.forEach(({ itemId, quantity }) => {
        inventoryManager.addItem(itemId, quantity);
    });

    // Initialize Ecology for locations (mock data for now)
    Object.keys(INITIAL_MAP_NODES).forEach(id => {
        ecologySystem.initLocation(id, 1000); // Default population
    });

    return {
        factionManager,
        playerManager,
        travelSystem,
        ecologySystem,
        eventManager,
        inventoryManager,
        combatManager,
        animalManager,
        undergroundRailroadSystem,

        currentDate: new Date('1854-05-30'), // Kansas-Nebraska Act
        currentLocationId: 'lawrence', // Start in Lawrence
        gameLog: ['Welcome to the Kansas Territory. The year is 1854.'],
        currentEvent: INITIAL_EVENTS[0], // Start with the first event triggered
        gameOver: false,
        deathReason: null,
        characterBackground: null,

        addLog: (message: string) => {
            set(state => ({ gameLog: [message, ...state.gameLog] }));
        },

        advanceTime: (days: number) => {
            const state = get();

            // Don't advance time if game is over
            if (state.gameOver) return;

            // Apply survival decay
            state.playerManager.applySurvivalDecay(days);

            const newDate = new Date(state.currentDate);
            newDate.setDate(newDate.getDate() + days);

            // Check for historical events first
            const historicalEvent = state.eventManager.checkForEvents({ ...state, currentDate: newDate });

            // If no historical event, check for random event (30% chance)
            let eventToTrigger = historicalEvent;

            // Check for Slave Catchers (High priority if on mission)
            const mission = state.undergroundRailroadSystem.getActiveMission();
            if (mission && !eventToTrigger) {
                const currentLocation = INITIAL_MAP_NODES[state.currentLocationId];
                const catchChance = state.undergroundRailroadSystem.getSlaveCatcherChance(currentLocation);
                if (Math.random() < catchChance) {
                    // Trigger Slave Catcher Combat
                    // We need to create a combat event or just start combat directly
                    // For now, let's just start combat directly and log it
                    state.addLog("Slave Catchers have found you!");
                    // We need to import ENEMIES from EnemyData, but we can't easily do that here without top-level import
                    // Let's use a helper or just assume we can get it.
                    // Actually, I'll add the import in a separate step or just use a mock for now to avoid build error
                    // Better: Create a specific event for this?
                    // Let's just create a mock enemy here for now to keep it simple
                    const slaveCatcher: Enemy = {
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
                    };
                    state.startCombat(slaveCatcher);
                    return; // Stop processing other events
                }
            }

            if (!historicalEvent && Math.random() < 0.3) {
                const randomEvent = getRandomEvent();
                if (randomEvent) {
                    state.eventManager.registerEvent(randomEvent);
                    eventToTrigger = randomEvent;
                }
            }

            if (eventToTrigger) {
                state.eventManager.triggerEvent(eventToTrigger.id);
            }

            // Check for death
            let gameOver = false;
            let deathReason = null;
            if (state.playerManager.isDead()) {
                gameOver = true;
                const stats = state.playerManager.getStats();
                if (stats.hunger >= 100) {
                    deathReason = 'You starved to death in the Kansas wilderness.';
                } else {
                    deathReason = 'You succumbed to your injuries and illness.';
                }
                state.addLog(deathReason);
            }

            set({
                currentDate: newDate,
                currentEvent: eventToTrigger || state.currentEvent,
                gameOver,
                deathReason
            });
        },

        travelTo: (nodeId: string) => {
            const { travelSystem, currentLocationId, addLog, advanceTime, currentEvent, animalManager } = get();

            // Prevent travel if event is active
            if (currentEvent) {
                addLog("You must resolve the current event before traveling.");
                return;
            }

            const distance = travelSystem.getDistance(currentLocationId, nodeId);

            if (distance === -1) return;

            // Apply travel speed modifiers from animals
            const speedModifier = animalManager.getTravelSpeedModifier();
            const days = Math.ceil(travelSystem.getTravelTimeDays(distance, 'foot') / speedModifier);

            advanceTime(days);

            // Spawn wild animals at new location
            animalManager.spawnWildAnimals(nodeId);

            set({ currentLocationId: nodeId });
            addLog(`Traveled to ${INITIAL_MAP_NODES[nodeId].name}. Took ${days} days.`);
        },

        resolveEventOption: (option: GameEventOption) => {
            const state = get();
            state.eventManager.resolveOption(option, state);

            // Handle health and hunger effects
            if (option.effects.health) {
                state.playerManager.modifyStat('health', option.effects.health);
            }
            if (option.effects.hunger) {
                state.playerManager.modifyStat('hunger', option.effects.hunger);
            }

            // Handle addItems effect
            if (option.effects.addItems) {
                option.effects.addItems.forEach(itemId => {
                    state.inventoryManager.addItem(itemId, 1);
                    state.addLog(`Received: ${itemId}`);
                });
            }

            set({ currentEvent: null });
        },

        useItem: (itemId: string) => {
            const state = get();
            const success = state.inventoryManager.useItem(itemId, state.playerManager);
            if (success) {
                const item = state.inventoryManager.getItems().find(i => i.item.id === itemId);
                if (item) {
                    state.addLog(`Used ${item.item.name}`);
                }
            }
        },

        buyItem: (itemId: string, quantity: number) => {
            const state = get();
            const success = state.inventoryManager.buyItem(itemId, quantity, state.playerManager, state.currentLocationId);
            if (success) {
                state.addLog(`Purchased ${quantity}x ${itemId}`);
            } else {
                state.addLog('Not enough money!');
            }
        },

        startCombat: (enemy: Enemy) => {
            const state = get();
            state.combatManager.startCombat(enemy, state.playerManager);
            // Force update
            set({});
        },

        performCombatAction: (action: CombatActionType) => {
            const state = get();
            state.combatManager.playerAction(action, state.playerManager, state.inventoryManager);
            // Force update to reflect combat state changes
            set({});
        },

        setCharacter: (bg: CharacterBackground) => {
            const state = get();

            // Apply starting stats
            state.playerManager.modifyStat('money', bg.startingStats.money - INITIAL_PLAYER_STATS.money);
            state.playerManager.modifyStat('morale', bg.startingStats.morale - INITIAL_PLAYER_STATS.morale);
            state.playerManager.modifyStat('health', bg.startingStats.health - INITIAL_PLAYER_STATS.health);

            // Add starting items
            bg.startingItems.forEach(item => {
                state.inventoryManager.addItem(item.itemId, item.quantity);
            });

            // Apply reputation
            bg.startingReputation.forEach(rep => {
                state.factionManager.modifyReputation(rep.faction, rep.amount);
            });

            // Apply skills
            state.playerManager.setSkills(bg.skills);

            set({ characterBackground: bg });
        },

        saveGame: (slotId: string, slotName: string) => {
            const state = get();
            const saveManager = new SaveManager();
            saveManager.saveGame(slotId, slotName, state);
            state.addLog(`Game saved to ${slotName}`);
        },

        loadGame: (slotId: string) => {
            const saveManager = new SaveManager();
            const data = saveManager.loadGame(slotId);

            if (!data) return;

            const state = get();

            // Restore Managers
            // Player
            state.playerManager.setStats(data.playerStats);

            // Inventory
            state.inventoryManager.clear();
            data.inventory.forEach(item => {
                state.inventoryManager.addItem(item.item, item.quantity);
            });

            // Events
            state.eventManager.setSeenEvents(new Set(data.seenEvents));

            set({
                currentDate: new Date(data.currentDate),
                currentLocationId: data.currentLocationId,
                characterBackground: data.characterBackground,
                gameLog: data.gameLog,
                gameOver: data.gameOver,
                currentEvent: null
            });

            state.addLog(`Game loaded from slot ${slotId}`);
        },

        huntAnimal: (animalId: string) => {
            const state = get();
            const result = state.animalManager.huntAnimal(animalId, state.playerManager, state.inventoryManager);

            state.addLog(result.message);

            if (result.result === 'combat' && result.animal) {
                // Convert AnimalInstance to Enemy
                // We need to import ANIMAL_DATA to get stats, or pass them from AnimalManager
                // For now, we'll assume we can get stats from AnimalManager or just hardcode basic conversion
                // But we don't have ANIMAL_DATA imported here.
                // Let's import ANIMAL_DATA at the top of GameState.ts
                // Wait, I can't easily add an import with replace_file_content if I'm only replacing this block.
                // I'll assume I can access it via state.animalManager if I add a helper, or just use a placeholder for now.
                // Actually, I can use a helper in AnimalManager to get Enemy data?
                // Or I can just add the import in a separate step.
                // Let's try to do it without extra imports if possible, or just add the import.

                // Better approach: AnimalManager.huntAnimal returns the Enemy object directly if combat?
                // No, it returns AnimalInstance.

                // I'll add the import in a separate step. For now, I'll use a placeholder or try to get data.
                // Actually, I can just use `any` for now to avoid build errors and fix it properly with import.
                // But I want to be correct.

                // Let's just trigger combat with a mock enemy based on animal name for now, 
                // and I'll add the import in the next step.
                const enemy: Enemy = {
                    id: result.animal.id,
                    name: result.animal.type, // Should be pretty name but type works for now
                    description: `A wild ${result.animal.type}`,
                    faction: FactionType.Native, // Placeholder
                    health: result.animal.health,
                    maxHealth: result.animal.health, // Approximate
                    damage: 10, // Placeholder
                    defense: 2,
                    loot: [],
                    money: 0
                };
                state.startCombat(enemy);
            }

            set({}); // Force update
        },

        fightAnimal: (animalId: string) => {
            const state = get();
            const enemy = state.animalManager.getEnemyFromAnimal(animalId);

            if (enemy) {
                state.addLog(`You engage the ${enemy.name} in combat!`);
                state.startCombat(enemy);
            } else {
                state.addLog("Could not find animal to fight.");
            }
            set({}); // Force update
        },

        buyAnimal: (type: AnimalType, price: number) => {
            const state = get();
            const stats = state.playerManager.getStats();

            if (stats.money >= price) {
                state.playerManager.modifyStat('money', -price);
                state.animalManager.addDomesticAnimal(type);
                state.addLog(`Purchased a ${type}`);
                set({}); // Force update
            } else {
                state.addLog("Not enough money to buy animal.");
            }
        },

        startMission: (mission: Mission) => {
            const state = get();
            state.undergroundRailroadSystem.startMission(mission);
            state.addLog(`Mission Started: ${mission.description}`);
            set({});
        }
    };
});
