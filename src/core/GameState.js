import { create } from 'zustand';
import { FactionManager } from '../systems/Factions/FactionManager';
import { PlayerManager, INITIAL_PLAYER_STATS } from '../systems/Survival/PlayerStats';
import { TravelSystem } from '../systems/World/TravelSystem';
import { EcologySystem } from '../systems/Ecology/EcologySystem';
import { EventManager } from '../systems/Events/EventManager';
import { InventoryManager } from '../systems/Inventory/InventoryManager';
import { LootManager } from '../systems/Loot/LootManager';
import { CombatManager } from '../systems/Combat/CombatManager';
import { AnimalManager } from '../systems/Animals/AnimalManager';
import { UndergroundRailroadSystem } from '../systems/UndergroundRailroad/UndergroundRailroadSystem';
import { INITIAL_EVENTS } from '../systems/Events/EventData';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import { STARTING_ITEMS } from '../systems/Inventory/ItemData';
import { getRandomEvent } from '../systems/Events/RandomEventData';
import { SaveManager } from '../systems/SaveLoad/SaveManager';
import { FactionType } from '../systems/Factions/FactionTypes';
import { MilitiaManager } from '../systems/Militia/MilitiaManager';
import { CalamityManager } from '../systems/Events/CalamityManager';
import { WoundManager } from '../systems/Wounds/WoundManager';
import { TravelMode } from '../systems/World/TravelTypes';
import { FarmingSystem } from '../systems/Farming/FarmingSystem';
import { NPCSystem } from '../systems/NPCs/NPCSystem';
import { PoliticsSystem } from '../systems/Politics/PoliticsSystem';
import { ScavengeManager } from '../systems/Scavenge/ScavengeManager';
import { SystemInterconnects } from './SystemInterconnects';
import { StorytellerEngine } from '../systems/Events/StorytellerEngine';
import { PlayerActionType } from './StorytellerTypes';
import { KnowledgeManager } from '../systems/Knowledge/KnowledgeManager';
export var Scene;
(function (Scene) {
    Scene["MainMenu"] = "MainMenu";
    Scene["CharacterCreation"] = "CharacterCreation";
    Scene["Gameplay"] = "Gameplay";
    Scene["Combat"] = "Combat";
    Scene["GameOver"] = "GameOver";
})(Scene || (Scene = {}));
export const useGameStore = create((set, get) => {
    const factionManager = new FactionManager();
    const playerManager = new PlayerManager(INITIAL_PLAYER_STATS);
    const travelSystem = new TravelSystem(INITIAL_MAP_NODES);
    const ecologySystem = new EcologySystem();
    const eventManager = new EventManager();
    const inventoryManager = new InventoryManager();
    const lootManager = new LootManager();
    const combatManager = new CombatManager();
    const animalManager = new AnimalManager();
    const undergroundRailroadSystem = new UndergroundRailroadSystem();
    const militiaManager = new MilitiaManager();
    const calamityManager = new CalamityManager();
    const knowledgeManager = new KnowledgeManager();
    const systemInterconnects = new SystemInterconnects();
    const storytellerEngine = new StorytellerEngine();
    const farmingSystem = new FarmingSystem();
    const npcSystem = new NPCSystem();
    const politicsSystem = new PoliticsSystem();
    const scavengeManager = new ScavengeManager();
    const woundManager = new WoundManager();
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
        lootManager,
        combatManager,
        animalManager,
        undergroundRailroadSystem,
        militiaManager,
        calamityManager,
        knowledgeManager,
        systemInterconnects,
        storytellerEngine,
        farmingSystem,
        npcSystem,
        politicsSystem,
        scavengeManager,
        woundManager,
        currentDate: new Date('1854-05-30'), // Kansas-Nebraska Act
        currentLocationId: 'lawrence', // Start in Lawrence
        gameLog: ['Welcome to the Kansas Territory. The year is 1854.'],
        currentEvent: INITIAL_EVENTS[0], // Start with the first event triggered
        gameOver: false,
        deathReason: null,
        characterBackground: null,
        currentScene: Scene.MainMenu,
        setScene: (scene) => set({ currentScene: scene }),
        discoveredLocations: ['lawrence'],
        currentTravelMode: TravelMode.Foot,
        currentVehicle: null,
        assignedAnimals: {},
        scavengeNodes: [],
        containers: {},
        companions: [],
        addLog: (message) => {
            set(state => ({ gameLog: [message, ...state.gameLog] }));
        },
        advanceTime: (days) => {
            const state = get();
            // Don't advance time if game is over
            if (state.gameOver)
                return;
            // Apply survival decay
            state.playerManager.applySurvivalDecay(days);
            // Companion Wages and Food
            if (state.companions.length > 0) {
                let totalWages = 0;
                let totalFood = 0;
                state.companions.forEach(c => {
                    totalWages += c.dailyWage * days;
                    totalFood += 1 * days; // 1 food unit per day
                });
                if (state.playerManager.getStats().money >= totalWages) {
                    state.playerManager.modifyStat('money', -totalWages);
                    state.addLog(`Paid $${totalWages} in wages.`);
                }
                else {
                    state.addLog("Cannot afford wages! Companions are unhappy.");
                    // TODO: Decrease morale or have them leave
                }
                // Simple food consumption for now
                // Ideally we'd check inventory for food items, but for now we'll just log it
                // or maybe deduct from a 'supplies' abstract item if we had one.
                // Let's just deduct money for food as "upkeep" for now to keep it simple
                const foodCost = totalFood * 0.5; // $0.50 per meal
                if (state.playerManager.getStats().money >= foodCost) {
                    state.playerManager.modifyStat('money', -foodCost);
                    state.addLog(`Spent $${foodCost} on companion food.`);
                }
            }
            const newDate = new Date(state.currentDate);
            newDate.setDate(newDate.getDate() + days);
            // Update Storyteller Systems
            state.systemInterconnects.update(newDate);
            const narrativeEvent = state.storytellerEngine.update(state.systemInterconnects.getWorldState(), state // Pass state directly
            );
            // Update Farming System
            const farmLogs = state.farmingSystem.update(days, newDate);
            if (farmLogs.length > 0) {
                state.addLog(farmLogs.join(' '));
            }
            // Update Wounds
            state.woundManager.update(days, state.playerManager);
            // Check for historical events first
            const historicalEvent = state.eventManager.checkForEvents({ ...state, currentDate: newDate });
            // Prioritize narrative events, then historical events
            let eventToTrigger = narrativeEvent || historicalEvent;
            // Check for Slave Catchers (High priority if on mission)
            const mission = state.undergroundRailroadSystem.getActiveMission();
            if (mission && !eventToTrigger) {
                const currentLocation = INITIAL_MAP_NODES[state.currentLocationId];
                const catchChance = state.undergroundRailroadSystem.getSlaveCatcherChance(currentLocation);
                if (Math.random() < catchChance) {
                    state.addLog("Slave Catchers have found you!");
                    const slaveCatcher = {
                        id: 'slave_catcher',
                        name: 'Slave Catcher',
                        description: 'A ruthless mercenary hunting for escaped slaves.',
                        faction: FactionType.ProSlavery,
                        health: 80,
                        maxHealth: 80,
                        damage: 15,
                        defense: 5,
                        loot: ['money', 'whiskey', 'pistol'],
                        money: 50,
                        accuracy: 80,
                        xpReward: 50
                    };
                    state.startCombat(slaveCatcher);
                    return;
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
                }
                else {
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
        travelTo: (nodeId) => {
            const { travelSystem, currentLocationId, addLog, advanceTime, currentEvent, animalManager, lootManager } = get();
            if (currentEvent) {
                addLog("You must resolve the current event before traveling.");
                return;
            }
            const distance = travelSystem.getDistance(currentLocationId, nodeId);
            if (distance === -1)
                return;
            const speedModifier = animalManager.getTravelSpeedModifier();
            const days = Math.ceil(travelSystem.getTravelTimeDays(distance, TravelMode.Foot) / speedModifier);
            advanceTime(days);
            animalManager.spawnWildAnimals();
            // Discover location
            const state = get();
            if (!state.discoveredLocations.includes(nodeId)) {
                set(state => ({ discoveredLocations: [...state.discoveredLocations, nodeId] }));
                addLog(`Discovered ${INITIAL_MAP_NODES[nodeId].name}!`);
            }
            // Generate containers if not present
            if (!state.containers[nodeId]) {
                const newContainers = lootManager.generateContainersForLocation(nodeId);
                set(state => ({
                    containers: {
                        ...state.containers,
                        [nodeId]: newContainers
                    }
                }));
            }
            set({ currentLocationId: nodeId });
            addLog(`Traveled to ${INITIAL_MAP_NODES[nodeId].name}. Took ${days} days.`);
        },
        resolveEventOption: (option) => {
            const state = get();
            state.eventManager.resolveOption(option, state);
            if (option.effects.health) {
                state.playerManager.modifyStat('health', option.effects.health);
            }
            if (option.effects.hunger) {
                state.playerManager.modifyStat('hunger', option.effects.hunger);
            }
            if (option.effects.addItems) {
                option.effects.addItems.forEach(itemId => {
                    state.inventoryManager.addItem(itemId, 1);
                    state.addLog(`Received: ${itemId}`);
                });
            }
            if (option.effects.removeItems) {
                option.effects.removeItems.forEach(itemId => {
                    state.inventoryManager.removeItem(itemId, 1);
                    state.addLog(`Lost: ${itemId}`);
                });
            }
            set({ currentEvent: null });
        },
        useItem: (itemId) => {
            const state = get();
            const success = state.inventoryManager.useItem(itemId, state.playerManager);
            if (success) {
                const item = state.inventoryManager.getItems().find(i => i.item.id === itemId);
                if (item) {
                    state.addLog(`Used ${item.item.name}`);
                }
            }
        },
        buyItem: (itemId, quantity) => {
            const state = get();
            const success = state.inventoryManager.buyItem(itemId, quantity, state.playerManager, state.currentLocationId);
            if (success) {
                state.addLog(`Purchased ${quantity}x ${itemId}`);
                // Economy effect?
            }
            else {
                state.addLog('Not enough money!');
            }
        },
        startCombat: (enemy) => {
            const state = get();
            state.combatManager.startCombat(enemy, state.playerManager);
            set({});
        },
        performCombatAction: (action) => {
            const state = get();
            state.combatManager.performAction(action, state.playerManager, state.inventoryManager, state.knowledgeManager);
            set({});
        },
        setCharacter: (bg) => {
            const state = get();
            state.playerManager.modifyStat('money', bg.startingStats.money - INITIAL_PLAYER_STATS.money);
            state.playerManager.modifyStat('morale', bg.startingStats.morale - INITIAL_PLAYER_STATS.morale);
            state.playerManager.modifyStat('health', bg.startingStats.health - INITIAL_PLAYER_STATS.health);
            bg.startingItems.forEach(item => {
                state.inventoryManager.addItem(item.itemId, item.quantity);
            });
            bg.startingReputation.forEach(rep => {
                state.factionManager.modifyReputation(rep.faction, rep.amount);
            });
            state.playerManager.setSkills(bg.skills);
            set({ characterBackground: bg });
        },
        saveGame: (slotId, slotName) => {
            const state = get();
            const saveManager = new SaveManager();
            saveManager.saveGame(slotId, slotName, state);
            state.addLog(`Game saved to ${slotName}`);
        },
        loadGame: (slotId) => {
            const saveManager = new SaveManager();
            const data = saveManager.loadGame(slotId);
            if (!data)
                return;
            const state = get();
            state.playerManager.setStats(data.playerStats);
            state.inventoryManager.clear();
            data.inventory.forEach(item => {
                state.inventoryManager.addItem(item.item, item.quantity);
            });
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
        huntAnimal: (animalId) => {
            const state = get();
            const result = state.animalManager.huntAnimal(animalId, state.playerManager, state.inventoryManager);
            state.addLog(result.message);
            if (result.result === 'combat' && result.animal) {
                const enemy = {
                    id: result.animal.id,
                    name: result.animal.type,
                    description: `A wild ${result.animal.type}`,
                    faction: FactionType.Native,
                    health: result.animal.health,
                    maxHealth: result.animal.health,
                    damage: 10,
                    defense: 2,
                    loot: [],
                    money: 0,
                    accuracy: 70,
                    xpReward: 20
                };
                state.startCombat(enemy);
                // Trigger ecology update
                if (result.animal) {
                    state.systemInterconnects.onEcologyChange(result.animal.type, -1);
                }
            }
            set({});
        },
        fightAnimal: (animalId) => {
            const state = get();
            const enemy = state.animalManager.getEnemyFromAnimal(animalId);
            if (enemy) {
                state.addLog(`You engage the ${enemy.name} in combat!`);
                state.startCombat(enemy);
            }
            else {
                state.addLog("Could not find animal to fight.");
            }
            set({});
        },
        buyAnimal: (type, price) => {
            const state = get();
            const stats = state.playerManager.getStats();
            if (stats.money >= price) {
                state.playerManager.modifyStat('money', -price);
                state.animalManager.addDomesticAnimal(type);
                state.addLog(`Purchased a ${type}`);
                set({});
            }
            else {
                state.addLog("Not enough money to buy animal.");
            }
        },
        startMission: (mission) => {
            const state = get();
            state.undergroundRailroadSystem.startMission(mission);
            state.addLog(`Mission Started: ${mission.description}`);
            set({});
        },
        setTravelMode: (mode) => {
            set({ currentTravelMode: mode });
        },
        discoverLocation: (locationId) => {
            set(state => {
                if (!state.discoveredLocations.includes(locationId)) {
                    return { discoveredLocations: [...state.discoveredLocations, locationId] };
                }
                return {};
            });
        },
        plantCrop: (type, acres) => {
            const state = get();
            const result = state.farmingSystem.plantCrop(type, acres, state.currentDate, state.playerManager);
            state.addLog(result);
            set({});
        },
        harvestCrop: (index) => {
            const state = get();
            const result = state.farmingSystem.harvestCrop(index, state.playerManager);
            state.addLog(result);
            set({});
        },
        buyLand: (acres) => {
            const state = get();
            // Assuming price is constant for now or retrieved from somewhere
            const pricePerAcre = 10;
            const result = state.farmingSystem.buyLand(acres, pricePerAcre, state.playerManager);
            state.addLog(result);
            // System Interconnect
            state.systemInterconnects.onPlayerAction(state.currentLocationId, PlayerActionType.Build, 1);
            set({});
        },
        interactWithNPC: (npcId, optionId) => {
            const state = get();
            const result = state.npcSystem.interact(npcId, optionId, state.playerManager, state.politicsSystem, state.factionManager, state.recruitCompanion);
            state.addLog(result);
            set({});
        },
        scavenge: (nodeId) => {
            const state = get();
            const node = state.scavengeNodes.find(n => n.id === nodeId);
            if (!node) {
                state.addLog("Scavenge location not found.");
                return;
            }
            // Time cost
            state.advanceTime(1);
            const result = state.scavengeManager.scavenge(node, state.playerManager);
            state.addLog(result.message);
            if (result.itemsFound.length > 0) {
                result.itemsFound.forEach(item => {
                    state.inventoryManager.addItem(item.itemId, item.quantity);
                });
            }
            if (result.moneyFound > 0) {
                state.playerManager.modifyStat('money', result.moneyFound);
            }
            // Handle combat trigger if implemented
            if (result.combatTriggered) {
                // TODO: Trigger actual combat
                state.addLog("You barely escaped with your life!");
            }
            // System Interconnect - Scavenging causes minor disturbance/resource depletion
            // We don't have a specific Scavenge action type yet, using Trade or similar? 
            // Or just generic action. Let's use Trade for now as it affects economy/resources.
            // Actually, let's add Scavenge to PlayerActionType if possible, or just skip for now.
            // Let's assume Scavenge is a form of "Looting" if we had that.
            // For now, no interconnect call or maybe a small one.
            set({});
        },
        openContainer: (containerId) => {
            const state = get();
            const container = state.containers[state.currentLocationId]?.find(c => c.id === containerId);
            if (!container) {
                state.addLog("Container not found.");
                return;
            }
            if (container.isLocked) {
                if (container.keyId) {
                    const hasKey = state.inventoryManager.hasItem(container.keyId);
                    if (!hasKey) {
                        state.addLog(`Locked! You need a ${container.keyId} to open this.`);
                        return;
                    }
                    state.addLog(`Unlocked with ${container.keyId}.`);
                    container.isLocked = false;
                }
                else {
                    // Lockpicking check? For now just say locked.
                    state.addLog("It's locked tight.");
                    return;
                }
            }
            const result = state.lootManager.openContainer(container);
            state.addLog(state.lootManager.formatLootResult(result));
            if (result.items.length > 0) {
                result.items.forEach(item => {
                    state.inventoryManager.addItem(item.itemId, item.quantity);
                });
            }
            if (result.money > 0) {
                state.playerManager.modifyStat('money', result.money);
            }
            // System Interconnect - Looting
            // state.systemInterconnects.onPlayerAction(state.currentLocationId, PlayerActionType.Loot, 1); // Need to add Loot type
            set({});
        },
        recruitCompanion: (companion) => {
            const state = get();
            set(state => ({
                companions: [...state.companions, companion]
            }));
            state.addLog(`${companion.name} has joined your party!`);
            // System Interconnect - Recruitment (building power)
            state.systemInterconnects.onPlayerAction(state.currentLocationId, PlayerActionType.Recruit, 2);
        }
    };
});
