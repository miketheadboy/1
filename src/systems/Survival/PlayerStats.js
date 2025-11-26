export const INITIAL_PLAYER_STATS = {
    health: 100,
    hunger: 0,
    morale: 80,
    money: 50,
    xp: 0,
    level: 1,
    skills: {
        farming: 0,
        survival: 0,
        combat: 0,
        persuasion: 0,
        trading: 0,
        medicine: 0,
        scavenging: 0
    }
};
export class PlayerManager {
    stats;
    constructor(initialStats = INITIAL_PLAYER_STATS) {
        this.stats = { ...initialStats };
    }
    modifyStat(stat, amount) {
        if (stat === 'skills' || stat === 'xp' || stat === 'level')
            return; // Handle separately
        this.stats[stat] += amount;
        // Clamp values
        if (stat === 'health' || stat === 'morale') {
            this.stats[stat] = Math.max(0, Math.min(100, this.stats[stat]));
        }
        else if (stat === 'hunger') {
            this.stats[stat] = Math.max(0, Math.min(100, this.stats[stat]));
        }
    }
    gainXp(amount) {
        this.stats.xp += amount;
        // Simple leveling formula: Level * 100 XP required
        const xpRequired = this.stats.level * 100;
        if (this.stats.xp >= xpRequired) {
            this.stats.level++;
            this.stats.xp -= xpRequired;
            // Grant a skill point or stat boost? For now just level up message
            return `You reached Level ${this.stats.level}!`;
        }
        return null;
    }
    getSkill(skill) {
        return this.stats.skills[skill];
    }
    improveSkill(skill, amount = 1) {
        this.stats.skills[skill] += amount;
    }
    setSkills(skills) {
        this.stats.skills = { ...skills };
    }
    applySurvivalDecay(days) {
        // Hunger increases over time
        this.stats.hunger += 5 * days;
        this.stats.hunger = Math.min(100, this.stats.hunger);
        // Health decreases when hungry
        if (this.stats.hunger > 90) {
            this.stats.health -= 5 * days;
        }
        else if (this.stats.hunger > 75) {
            this.stats.health -= 2 * days;
        }
        this.stats.health = Math.max(0, this.stats.health);
        // Morale decreases when health is low
        if (this.stats.health < 25) {
            this.stats.morale -= 3 * days;
        }
        this.stats.morale = Math.max(0, this.stats.morale);
    }
    consumeFood(amount) {
        this.stats.hunger = Math.max(0, this.stats.hunger - amount);
    }
    rest(days) {
        // Resting restores health slowly
        this.stats.health += 5 * days;
        this.stats.health = Math.min(100, this.stats.health);
    }
    getStats() {
        return { ...this.stats };
    }
    setStats(stats) {
        this.stats = { ...stats };
    }
    isDead() {
        return this.stats.health <= 0;
    }
    isStarving() {
        return this.stats.hunger >= 100;
    }
}
