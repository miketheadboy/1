export class EventManager {
    events = {};
    activeEvent = null;
    seenEvents = new Set();
    constructor() { }
    registerEvent(event) {
        this.events[event.id] = event;
    }
    checkForEvents(state) {
        // 1. Check for date-based historical events
        const dateEvents = Object.values(this.events).filter(e => {
            if (this.seenEvents.has(e.id) && e.isUnique)
                return false;
            if (!e.date)
                return false;
            // Simple date match (same day)
            return (e.date.getDate() === state.currentDate.getDate() &&
                e.date.getMonth() === state.currentDate.getMonth() &&
                e.date.getFullYear() === state.currentDate.getFullYear());
        });
        if (dateEvents.length > 0) {
            return dateEvents[0];
        }
        // 2. Check for dynamic triggers (TODO)
        return null;
    }
    triggerEvent(eventId) {
        const event = this.events[eventId];
        if (event) {
            this.activeEvent = event;
            this.seenEvents.add(eventId);
            return event;
        }
        return null;
    }
    resolveOption(option, state) {
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
    getActiveEvent() {
        return this.activeEvent;
    }
    getSeenEvents() {
        return new Set(this.seenEvents);
    }
    setSeenEvents(seen) {
        this.seenEvents = new Set(seen);
    }
}
