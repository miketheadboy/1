import { KnowledgeType, XP_PER_LEVEL } from './KnowledgeTypes';
export class KnowledgeManager {
    state;
    perks;
    constructor() {
        this.state = {
            levels: {
                [KnowledgeType.Theology]: 1,
                [KnowledgeType.Law]: 1,
                [KnowledgeType.Military]: 1,
                [KnowledgeType.Agriculture]: 1,
                [KnowledgeType.Medicine]: 1
            },
            xp: {
                [KnowledgeType.Theology]: 0,
                [KnowledgeType.Law]: 0,
                [KnowledgeType.Military]: 0,
                [KnowledgeType.Agriculture]: 0,
                [KnowledgeType.Medicine]: 0
            },
            unlockedPerks: []
        };
        this.perks = this.initializePerks();
    }
    getState() {
        return this.state;
    }
    gainXp(type, amount, log) {
        this.state.xp[type] += amount;
        log(`You gained ${amount} XP in ${type}.`);
        if (this.state.xp[type] >= this.state.levels[type] * XP_PER_LEVEL) {
            this.levelUp(type, log);
        }
    }
    levelUp(type, log) {
        this.state.levels[type]++;
        this.state.xp[type] = 0; // Reset XP or keep overflow? Let's reset for simple tiers.
        log(`You reached Level ${this.state.levels[type]} in ${type}!`);
        this.checkPerks(type, log);
    }
    checkPerks(type, log) {
        const level = this.state.levels[type];
        const newPerks = this.perks.filter(p => p.requiredKnowledge === type &&
            p.requiredLevel === level &&
            !this.state.unlockedPerks.includes(p.id));
        for (const perk of newPerks) {
            this.state.unlockedPerks.push(perk.id);
            log(`Perk Unlocked: ${perk.name} - ${perk.description}`);
        }
    }
    hasPerk(perkId) {
        return this.state.unlockedPerks.includes(perkId);
    }
    getLevel(type) {
        return this.state.levels[type];
    }
    initializePerks() {
        return [
            {
                id: 'righteous_fury',
                name: 'Righteous Fury',
                description: 'Preaching is 20% more effective.',
                requiredKnowledge: KnowledgeType.Theology,
                requiredLevel: 3,
                effect: () => { }
            },
            {
                id: 'legal_eagle',
                name: 'Legal Eagle',
                description: 'Bribes cost 20% less.',
                requiredKnowledge: KnowledgeType.Law,
                requiredLevel: 3,
                effect: () => { }
            },
            {
                id: 'drill_sergeant',
                name: 'Drill Sergeant',
                description: 'Militia training is twice as fast.',
                requiredKnowledge: KnowledgeType.Military,
                requiredLevel: 3,
                effect: () => { }
            },
            {
                id: 'beechers_bibles',
                name: "Beecher's Bibles",
                description: "Sharps Rifles deal +20% damage. 'Preach' action can Intimidate enemies.",
                requiredKnowledge: KnowledgeType.Theology,
                requiredLevel: 3,
                effect: () => { }
            }
        ];
    }
}
