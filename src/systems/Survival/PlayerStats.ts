export interface Skills {
    farming: number;
    survival: number;
    combat: number;
    persuasion: number;
    trading: number;
    medicine: number;
}

export interface PlayerStats {
    health: number; // 0-100
    hunger: number; // 0-100 (0 is full, 100 is starving)
    morale: number; // 0-100 (0 is broken, 100 is high spirits)
    money: number; // Dollars
    xp: number;
    level: number;
    skills: Skills;
}

export const INITIAL_PLAYER_STATS: PlayerStats = {
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
        medicine: 0
    }
};

export class PlayerManager {
    private stats: PlayerStats;

    constructor(initialStats: PlayerStats = INITIAL_PLAYER_STATS) {
        this.stats = { ...initialStats };
    }

    public modifyStat(stat: keyof PlayerStats, amount: number): void {
        if (stat === 'skills' || stat === 'xp' || stat === 'level') return; // Handle separately

        (this.stats[stat] as number) += amount;
        // Clamp values
        if (stat === 'health' || stat === 'morale') {
            this.stats[stat] = Math.max(0, Math.min(100, this.stats[stat] as number));
        } else if (stat === 'hunger') {
            this.stats[stat] = Math.max(0, Math.min(100, this.stats[stat] as number));
        }
    }

    public gainXp(amount: number): string | null {
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

    public getSkill(skill: keyof Skills): number {
        return this.stats.skills[skill];
    }

    public improveSkill(skill: keyof Skills, amount: number = 1): void {
        this.stats.skills[skill] += amount;
    }

    public setSkills(skills: Skills): void {
        this.stats.skills = { ...skills };
    }

    public applySurvivalDecay(days: number): void {
        // Hunger increases over time
        this.stats.hunger += 5 * days;
        this.stats.hunger = Math.min(100, this.stats.hunger);

        // Health decreases when hungry
        if (this.stats.hunger > 90) {
            this.stats.health -= 5 * days;
        } else if (this.stats.hunger > 75) {
            this.stats.health -= 2 * days;
        }
        this.stats.health = Math.max(0, this.stats.health);

        // Morale decreases when health is low
        if (this.stats.health < 25) {
            this.stats.morale -= 3 * days;
        }
        this.stats.morale = Math.max(0, this.stats.morale);
    }

    public consumeFood(amount: number): void {
        this.stats.hunger = Math.max(0, this.stats.hunger - amount);
    }

    public rest(days: number): void {
        // Resting restores health slowly
        this.stats.health += 5 * days;
        this.stats.health = Math.min(100, this.stats.health);
    }

    public getStats(): PlayerStats {
        return { ...this.stats };
    }

    public setStats(stats: PlayerStats): void {
        this.stats = { ...stats };
    }

    public isDead(): boolean {
        return this.stats.health <= 0;
    }

    public isStarving(): boolean {
        return this.stats.hunger >= 100;
    }
}
