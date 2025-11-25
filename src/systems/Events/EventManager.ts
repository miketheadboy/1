import type { GameEvent, GameEventOption } from './EventTypes';
import type { GameState } from '../../core/GameState';

export class EventManager {
    private events: Record<string, GameEvent> = {};
    private activeEvent: GameEvent | null = null;
    private seenEvents: Set<string> = new Set();

    constructor() { }

    public registerEvent(event: GameEvent) {
        this.events[event.id] = event;
    }

    public checkForEvents(state: GameState): GameEvent | null {
        // 1. Check for date-based historical events
        const dateEvents = Object.values(this.events).filter(e => {
            if (this.seenEvents.has(e.id) && e.isUnique) return false;
            if (!e.date) return false;

            // Simple date match (same day)
            return (
                e.date.getDate() === state.currentDate.getDate() &&
                e.date.getMonth() === state.currentDate.getMonth() &&
                e.date.getFullYear() === state.currentDate.getFullYear()
            );
        });

        if (dateEvents.length > 0) {
            return dateEvents[0];
        }

        // 2. Check for dynamic triggers (TODO)

        return null;
    }

    public triggerEvent(eventId: string): GameEvent | null {
        const event = this.events[eventId];
        if (event) {
            this.activeEvent = event;
            this.seenEvents.add(eventId);
            return event;
        }
        return null;
    }

    public resolveOption(option: GameEventOption, state: GameState) {
        // Apply effects
        if (option.effects.money) {
            state.playerManager.modifyStat('money', option.effects.money);
        }
        if (option.effects.morale) {
            state.playerManager.modifyStat('morale', option.effects.morale);
        }
        if (option.effects.reputationChanges) {
            option.effects.reputationChanges.forEach(change => {
                state.factionManager.modifyReputation(change.faction, change.amount);
            });
        }

        // Clear active event
        this.activeEvent = null;

        // Log the choice
        state.addLog(`Event: ${state.currentEvent?.title} - Chose: ${option.text}`);
    }

    public getActiveEvent(): GameEvent | null {
        return this.activeEvent;
    }

    public getSeenEvents(): Set<string> {
        return new Set(this.seenEvents);
    }

    public setSeenEvents(seen: Set<string>): void {
        this.seenEvents = new Set(seen);
    }
}
