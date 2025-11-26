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
                        id: 'hold_rally',
                        name: 'Hold Rally',
                        description: 'Gather supporters to increase influence.',
                        cost: 50,
                        energyCost: 20,
                        cooldown: 7,
                        effect: (_state: any) => {
                            // Increase influence
                            this.state.stats.influence += 5 + (this.state.level * 2);
                            return { success: true, message: "Rally held! Influence increased." };
                        }
                    },
                    {
                        id: 'give_speech',
                        name: 'Give Speech',
                        description: 'Attempt to sway local opinion.',
                        cost: 10,
                        energyCost: 10,
                        cooldown: 3,
                        effect: (_state: any) => {
                            // Logic to affect local tension/faction control
                            return { success: true, message: "Speech given. Opinions are shifting." };
                        }
                    }
                ],
                dailyUpdate: () => {
                    // Decay influence slightly?
                    return [];
                },
                incomeFormula: (state) => {
                    // Donations
                    return Math.floor(state.stats.influence * 0.5);
                }
            },
            [CareerType.Clergy]: {
                type: CareerType.Clergy,
                name: "Clergy",
                description: "Tend to the spiritual needs of the people.",
                actions: [
                    {
                        id: 'give_sermon',
                        name: 'Give Sermon',
                        description: 'Preach to your congregation.',
                        cost: 0,
                        energyCost: 15,
                        cooldown: 7,
                        effect: (_state: any) => {
                            this.state.stats.congregationSize += 2;
                            return { success: true, message: "Sermon delivered. Congregation grew." };
                        }
                    }
                ],
                dailyUpdate: () => [],
                incomeFormula: (state) => Math.floor(state.stats.congregationSize * 0.2)
            },
            [CareerType.Trader]: {
                type: CareerType.Trader,
                name: "Trader",
                description: "Buy low, sell high, and establish routes.",
                actions: [], // To be implemented
                dailyUpdate: () => [],
                incomeFormula: (state) => Math.floor(state.stats.wealth * 0.01)
            },
            [CareerType.Farmer]: {
                type: CareerType.Farmer,
                name: "Farmer",
                description: "Work the land and harvest crops.",
                actions: [], // To be implemented
                dailyUpdate: () => [],
                incomeFormula: () => 0 // Income comes from selling crops manually usually
            },
            [CareerType.Militant]: {
                type: CareerType.Militant,
                name: "Militant",
                description: "Fight for your cause through force.",
                actions: [
                    {
                        id: 'start_militia',
                        name: 'Form Militia',
                        description: 'Start your own paramilitary group.',
                        cost: 100,
                        energyCost: 50,
                        cooldown: 0,
                        effect: (state: GameState) => {
                            if (this.militiaManager.getPlayerMilitia()) {
                                return { success: false, message: "You already lead a militia." };
                            }
                            // Determine faction based on player background or choice? Defaulting to Neutral for now
                            // Using FactionType.Neutral directly instead of casting to any
                            this.militiaManager.createPlayerMilitia("My Company", 4 as any, state.currentLocationId);
                            return { success: true, message: "Militia formed! You can now recruit and train." };
                        }
                    },
                    {
                        id: 'recruit_militia',
                        name: 'Recruit',
                        description: 'Recruit 5 men ($10 each).',
                        cost: 50,
                        energyCost: 20,
                        cooldown: 3,
                        effect: (state: GameState) => {
                            return this.militiaManager.recruit(5, 10, state);
                        }
                    },
                    {
                        id: 'train_militia',
                        name: 'Drill Troops',
                        description: 'Train your men to improve effectiveness.',
                        cost: 10, // Supplies
                        energyCost: 30,
                        cooldown: 1,
                        effect: (state: GameState) => {
                            return this.militiaManager.train(state);
                        }
                    },
                    {
                        id: 'patrol_militia',
                        name: 'Patrol Area',
                        description: 'Patrol the region for enemies.',
                        cost: 0,
                        energyCost: 40,
                        cooldown: 2,
                        effect: (state: GameState) => {
                            const result = this.militiaManager.patrol(state);
                            if (!result) return { success: false, message: "No militia to patrol with." };

                            // Log results
                            result.log.forEach(l => state.addLog(l));
                            return { success: true, message: result.victory ? "Patrol successful." : "Patrol encountered heavy resistance." };
                        }
                    }
                ],
                dailyUpdate: () => [],
                incomeFormula: () => 0
            }
        };
    }
}
