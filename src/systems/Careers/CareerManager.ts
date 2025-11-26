import { CareerType, type CareerState, type CareerTemplate, type CareerAction } from './CareerTypes';
import type { GameState } from '../../core/GameState';
import { MilitiaManager } from '../Militia/MilitiaManager';

export class CareerManager {
    private state: CareerState;
    private templates: Record<CareerType, CareerTemplate>;
    public militiaManager: MilitiaManager;

    constructor() {
        this.state = {
            type: CareerType.None,
            level: 1,
            experience: 0,
            dailyIncome: 0,
            stats: {
                influence: 0,
                congregationSize: 0,
                reputation: 0,
                wealth: 0
            },
            cooldowns: {}
        };
        this.militiaManager = new MilitiaManager();
        this.templates = this.initializeTemplates();
    }

    public setCareer(type: CareerType): void {
        this.state.type = type;
        this.state.level = 1;
        this.state.experience = 0;
        // Reset stats relevant to new career? Or keep them?
        // For now, keep stats as they might carry over (reputation definitely does)
    }

    public getCareerState(): CareerState {
        return this.state;
    }

    public getAvailableActions(): CareerAction[] {
        const template = this.templates[this.state.type];
        if (!template) return [];
        return template.actions;
    }

    public performAction(actionId: string, gameState: GameState): { success: boolean; message: string } {
        const template = this.templates[this.state.type];
        if (!template) return { success: false, message: "No active career." };

        const action = template.actions.find(a => a.id === actionId);
        if (!action) return { success: false, message: "Unknown action." };

        // Check cooldown
        if (this.state.cooldowns[actionId] > 0) {
            return { success: false, message: `Action on cooldown for ${this.state.cooldowns[actionId]} days.` };
        }

        // Check costs
        if (gameState.playerManager.getStats().money < action.cost) {
            return { success: false, message: "Not enough money." };
        }
        // Check energy (if we had energy system, for now assume always active)

        // Deduct cost
        gameState.playerManager.modifyStat('money', -action.cost);

        // Execute effect
        const result = action.effect(gameState);

        if (result.success) {
            // Set cooldown
            this.state.cooldowns[actionId] = action.cooldown;
            // Grant XP
            this.gainExperience(10); // Base XP
        }

        return result;
    }

    public dailyUpdate(gameState: GameState): string[] {
        const logs: string[] = [];
        const template = this.templates[this.state.type];

        // Reduce cooldowns
        for (const id in this.state.cooldowns) {
            if (this.state.cooldowns[id] > 0) {
                this.state.cooldowns[id]--;
            }
        }

        if (template) {
            // Calculate Income
            const income = template.incomeFormula(this.state);
            if (income > 0) {
                gameState.playerManager.modifyStat('money', income);
                logs.push(`Earned $${income} from ${template.name} career.`);
            }

            // Career specific updates
            const specificLogs = template.dailyUpdate(this.state);
            logs.push(...specificLogs);
        }

        return logs;
    }

    private gainExperience(amount: number): void {
        this.state.experience += amount;
        if (this.state.experience >= this.state.level * 100) {
            this.state.level++;
            this.state.experience = 0;
            // Level up logic (unlock perks?)
        }
    }

    private initializeTemplates(): Record<CareerType, CareerTemplate> {
        return {
            [CareerType.None]: {
                type: CareerType.None,
                name: "Drifter",
                description: "No specific career.",
                actions: [],
                dailyUpdate: () => [],
                incomeFormula: () => 0
            },
            [CareerType.Politician]: {
                type: CareerType.Politician,
                name: "Politician",
                description: "Seek office and influence public opinion.",
                actions: [
                    {
                        id: 'train_militia',
                        name: 'Drill Troops',
                        description: 'Train your men to improve effectiveness.',
                        cost: 10, // Supplies
                        energyCost: 30,
                        cooldown: 1,
                        effect: (state: unknown) => {
                            return this.militiaManager.train(state as GameState);
                        }
                    },
                    {
                        id: 'patrol_militia',
                        name: 'Patrol Area',
                        description: 'Patrol the region for enemies.',
                        cost: 0,
                        energyCost: 40,
                        cooldown: 2,
                        effect: (state: unknown) => {
                            const gs = state as GameState;
                            const result = this.militiaManager.patrol(gs);
                            if (!result) return { success: false, message: "No militia to patrol with." };

                            // Log results
                            result.log.forEach(l => gs.addLog(l));
                            return { success: true, message: result.victory ? "Patrol successful." : "Patrol encountered heavy resistance." };
                        }
                    }
                ],
                dailyUpdate: () => [],
                incomeFormula: () => 0
            },
            [CareerType.Farmer]: {
                type: CareerType.Farmer,
                name: "Farmer",
                description: "Work the land.",
                actions: [],
                dailyUpdate: () => [],
                incomeFormula: () => 0
            },
            [CareerType.Trader]: {
                type: CareerType.Trader,
                name: "Trader",
                description: "Buy and sell goods.",
                actions: [],
                dailyUpdate: () => [],
                incomeFormula: () => 0
            },
            [CareerType.Clergy]: {
                type: CareerType.Clergy,
                name: "Clergy",
                description: "Tend to the flock.",
                actions: [],
                dailyUpdate: () => [],
                incomeFormula: () => 0
            },
            [CareerType.Militant]: {
                type: CareerType.Militant,
                name: "Militant",
                description: "Fight for the cause.",
                actions: [],
                dailyUpdate: () => [],
                incomeFormula: () => 0
            }
        };
    }
}
