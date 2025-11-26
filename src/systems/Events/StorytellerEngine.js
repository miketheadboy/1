import { ArcType, ConditionType, ComparisonOp } from '../../core/StorytellerTypes';
import { EcologyEventsModule } from './StoryModules/EcologyEventsModule';
import { PoliticalEventsModule } from './StoryModules/PoliticalEventsModule';
/**
 * StorytellerEngine monitors world state and generates procedural narrative arcs.
 * It creates emergent storylines based on complex conditions across multiple systems.
 */
export class StorytellerEngine {
    npcMemories;
    activeArcs;
    completedArcs;
    arcTemplates;
    modules;
    constructor() {
        this.npcMemories = new Map();
        this.activeArcs = [];
        this.completedArcs = [];
        this.completedArcs = [];
        this.arcTemplates = this.initializeArcTemplates();
        this.modules = [
            new EcologyEventsModule(),
            new PoliticalEventsModule()
        ];
    }
    // ========================================================================
    // MAIN UPDATE LOOP
    // ========================================================================
    /**
     * Main update called each game tick
     * Returns an event if a narrative arc triggers
     */
    update(worldState, _gameState) {
        // Update active arcs
        for (const arc of this.activeArcs) {
            if (!this.evaluateArcConditions(arc, worldState)) {
                // Conditions no longer met, deactivate arc
                arc.active = false;
            }
        }
        // Check for new arcs to activate
        const newArc = this.generateArc(worldState);
        if (newArc) {
            this.activeArcs.push(newArc);
        }
        // Check NPC memories for revenge/favor events
        const memoryEvent = this.checkNPCMemories(worldState.currentDate);
        if (memoryEvent) {
            return memoryEvent;
        }
        // Run Story Modules
        for (const module of this.modules) {
            const event = module.update(worldState, _gameState);
            if (event) {
                return event;
            }
        }
        return null;
    }
    // ========================================================================
    // ARC EVALUATION
    // ========================================================================
    /**
     * Check if all conditions for an arc are met
     */
    evaluateArcConditions(arc, worldState) {
        for (const condition of arc.conditions) {
            if (!this.evaluateCondition(condition, worldState)) {
                return false;
            }
        }
        return true;
    }
    evaluateCondition(condition, worldState) {
        let actualValue;
        switch (condition.type) {
            case ConditionType.Tension: {
                const regional = worldState.regionalStates.get(condition.target);
                actualValue = regional?.tension ?? 50;
                break;
            }
            case ConditionType.PlayerReputation:
                // TODO: Get from player manager
                actualValue = 50;
                break;
            case ConditionType.Weather:
                // Weather conditions are string-based, skip for now
                return true;
            default:
                return true;
        }
        return this.compareValues(actualValue, condition.operator, condition.value);
    }
    compareValues(actual, op, expected) {
        switch (op) {
            case ComparisonOp.GreaterThan:
                return actual > expected;
            case ComparisonOp.LessThan:
                return actual < expected;
            case ComparisonOp.Equal:
                return actual === expected;
            case ComparisonOp.GreaterOrEqual:
                return actual >= expected;
            case ComparisonOp.LessOrEqual:
                return actual <= expected;
            default:
                return false;
        }
    }
    // ========================================================================
    // ARC GENERATION
    // ========================================================================
    /**
     * Generate a new narrative arc based on current world state
     */
    generateArc(worldState) {
        // Don't activate too many arcs at once
        if (this.activeArcs.filter(a => a.active).length >= 3) {
            return null;
        }
        // Check each template
        for (const template of this.arcTemplates) {
            // Skip if already completed
            if (this.completedArcs.includes(template.id)) {
                continue;
            }
            // Skip if already active
            if (this.activeArcs.some(a => a.id === template.id && a.active)) {
                continue;
            }
            // Check conditions
            if (this.evaluateArcConditions(template, worldState)) {
                const newArc = {
                    ...template,
                    active: true,
                    startedAt: worldState.currentDate
                };
                return newArc;
            }
        }
        return null;
    }
    // ========================================================================
    // NPC MEMORY SYSTEM
    // ========================================================================
    /**
     * Record an interaction with an NPC
     */
    recordInteraction(npcId, interaction) {
        let memory = this.npcMemories.get(npcId);
        if (!memory) {
            memory = {
                npcId,
                interactions: [],
                relationship: 0,
                grudges: [],
                favors: []
            };
            this.npcMemories.set(npcId, memory);
        }
        memory.interactions.push(interaction);
        memory.relationship += interaction.impactOnRelationship;
        memory.lastInteraction = interaction.date;
        // Create grudge for very negative interactions
        if (interaction.impactOnRelationship < -30) {
            memory.grudges.push({
                reason: interaction.outcome,
                severity: Math.abs(interaction.impactOnRelationship),
                createdAt: interaction.date
            });
        }
        // Create favor for very positive interactions
        if (interaction.impactOnRelationship > 30) {
            memory.favors.push({
                description: interaction.outcome,
                value: interaction.impactOnRelationship,
                createdAt: interaction.date
            });
        }
        // Clamp relationship
        memory.relationship = Math.max(-100, Math.min(100, memory.relationship));
    }
    /**
     * Get NPC's current disposition toward player
     */
    getNPCDisposition(npcId) {
        const memory = this.npcMemories.get(npcId);
        return memory?.relationship ?? 0;
    }
    /**
     * Check if any NPCs want revenge or to return favors
     */
    checkNPCMemories(currentDate) {
        for (const [npcId, memory] of this.npcMemories.entries()) {
            // Check grudges (30-60 days later)
            for (const grudge of memory.grudges) {
                const daysSince = this.daysBetween(grudge.createdAt, currentDate);
                if (daysSince >= 30 && daysSince <= 60 && Math.random() < 0.1) {
                    // 10% chance per check to trigger revenge
                    return this.createRevengeEvent(npcId, grudge);
                }
            }
            // Check favors (can trigger anytime)
            for (const favor of memory.favors) {
                const daysSince = this.daysBetween(favor.createdAt, currentDate);
                if (daysSince >= 7 && Math.random() < 0.05) {
                    // 5% chance to return favor
                    return this.createFavorEvent(npcId, favor);
                }
            }
        }
        return null;
    }
    createRevengeEvent(npcId, grudge) {
        return {
            id: `revenge_${npcId}_${Date.now()}`,
            title: 'Vengeance Sought',
            description: `Someone seeks revenge for: ${grudge.reason}`,
            type: 'random',
            date: new Date(),
            options: [
                {
                    id: 'fight',
                    text: 'Stand and fight',
                    effects: {
                        combat: { enemyId: `bounty_hunter_${npcId}` }
                    }
                },
                {
                    id: 'flee',
                    text: 'Try to escape',
                    effects: {
                        playerStats: { health: -10 }
                    }
                },
                {
                    id: 'negotiate',
                    text: 'Attempt to negotiate',
                    effects: {
                        playerStats: { money: -50 }
                    }
                }
            ]
        };
    }
    createFavorEvent(npcId, favor) {
        return {
            id: `favor_${npcId}_${Date.now()}`,
            title: 'Favor Returned',
            description: `An old friend remembers your kindness: ${favor.description}`,
            type: 'random',
            date: new Date(),
            options: [
                {
                    id: 'accept',
                    text: 'Accept their help',
                    effects: {
                        playerStats: { money: favor.value }
                    }
                }
            ]
        };
    }
    // ========================================================================
    // HELPER METHODS
    // ========================================================================
    daysBetween(start, end) {
        const diff = end.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    // ========================================================================
    // ARC TEMPLATES
    // ========================================================================
    initializeArcTemplates() {
        return [
            // High Tension Arc
            {
                id: 'border_war_escalation',
                name: 'Border War Escalation',
                type: ArcType.Medium,
                stage: 0,
                totalStages: 5,
                conditions: [
                    {
                        type: ConditionType.Tension,
                        target: 'lawrence',
                        operator: ComparisonOp.GreaterThan,
                        value: 70
                    }
                ],
                active: false
            },
            // Drought Arc
            {
                id: 'great_drought',
                name: 'The Great Drought',
                type: ArcType.Long,
                stage: 0,
                totalStages: 8,
                conditions: [
                    {
                        type: ConditionType.Weather,
                        target: 'drought',
                        operator: ComparisonOp.Equal,
                        value: 1
                    }
                ],
                active: false
            },
            // Low Tension Peace Arc
            {
                id: 'uneasy_peace',
                name: 'Uneasy Peace',
                type: ArcType.Short,
                stage: 0,
                totalStages: 3,
                conditions: [
                    {
                        type: ConditionType.Tension,
                        target: 'lawrence',
                        operator: ComparisonOp.LessThan,
                        value: 30
                    }
                ],
                active: false
            }
        ];
    }
    // ========================================================================
    // QUERY METHODS
    // ========================================================================
    getActiveArcs() {
        return this.activeArcs.filter(a => a.active);
    }
    getNPCMemory(npcId) {
        return this.npcMemories.get(npcId);
    }
}
