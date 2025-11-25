import { create } from 'zustand';
import { FactionManager } from '../systems/Factions/FactionManager';
import { PlayerManager, INITIAL_PLAYER_STATS } from '../systems/Survival/PlayerStats';
import { TravelSystem } from '../systems/World/TravelSystem';
import { EcologySystem } from '../systems/Ecology/EcologySystem';
import { EventManager } from '../systems/Events/EventManager';
import { InventoryManager } from '../systems/Inventory/InventoryManager';
import { CombatManager } from '../systems/Combat/CombatManager';
import { INITIAL_EVENTS } from '../systems/Events/EventData';
import { INITIAL_MAP_NODES } from '../systems/World/MapData';
import { STARTING_ITEMS } from '../systems/Inventory/ItemData';
import { getRandomEvent } from '../systems/Events/RandomEventData';
import type { GameEvent, GameEventOption } from '../systems/Events/EventTypes';
import { CombatActionType } from '../systems/Combat/CombatTypes';
import type { Enemy } from '../systems/Combat/CombatTypes';
import type { CharacterBackground } from '../systems/Character/CharacterTypes';
import { SaveManager } from '../systems/SaveLoad/SaveManager';

export interface GameState {
    // Systems
    factionManager: FactionManager;
    playerManager: PlayerManager;
    travelSystem: TravelSystem;
    ecologySystem: EcologySystem;
    eventManager: EventManager;
    inventoryManager: InventoryManager;
    combatManager: CombatManager;

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
        ecologySystem.initLocation(id, 1000, 500); // Default populations
    });

    return {
        factionManager,
        playerManager,
        travelSystem,
        ecologySystem,
        eventManager,
        inventoryManager,
        combatManager,

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
            const { travelSystem, currentLocationId, addLog, advanceTime, currentEvent } = get();

            // Prevent travel if event is active
            if (currentEvent) {
                addLog("You must resolve the current event before traveling.");
                return;
            }

            const distance = travelSystem.getDistance(currentLocationId, nodeId);

            if (distance === -1) return;

            const days = travelSystem.getTravelTimeDays(distance, 'foot');

            advanceTime(days);
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
            const success = state.inventoryManager.buyItem(itemId, quantity, state.playerManager);
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
            state.combatManager.playerAction(action, state.playerManager);
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
        }
    };
});
