
export enum CareerType {
    None = 'None',
    Farmer = 'Farmer',
    Trader = 'Trader',
    Politician = 'Politician',
    Clergy = 'Clergy',
    Militant = 'Militant' // Vigilante/Soldier
}

export interface CareerAction {
    id: string;
    name: string;
    description: string;
    cost: number; // Money cost
    energyCost: number;
    cooldown: number; // Days
    requirements?: {
        minInfluence?: number;
        minReputation?: number;
        skillLevel?: number;
    };
    effect: (state: unknown) => { success: boolean; message: string };
}

export interface CareerState {
    type: CareerType;
    level: number;
    experience: number;
    dailyIncome: number;
    stats: {
        influence: number;      // For Politician
        congregationSize: number; // For Clergy
        reputation: number;     // General
        wealth: number;         // For Trader
    };
    activeRoutes?: string[];    // For Trader
    ownedLand?: number;         // For Farmer (acres)
    cooldowns: Record<string, number>; // Action ID -> Days remaining
}

export interface CareerTemplate {
    type: CareerType;
    name: string;
    description: string;
    actions: CareerAction[];
    dailyUpdate: (state: unknown) => string[]; // Returns log messages
    incomeFormula: (state: unknown) => number;
}
