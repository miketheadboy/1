import type { StoryModule } from './StoryModule';
import type { WorldState } from '../../../core/StorytellerTypes';
import type { GameState } from '../../../core/GameState';
import type { GameEvent } from '../EventTypes';
import { FactionType } from '../../Factions/FactionTypes';

export class PoliticalEventsModule implements StoryModule {
    id = 'political_events';

    update(_worldState: WorldState, gameState: GameState): GameEvent | null {
        // SYSTEM INTERCONNECT: Politics -> Reputation (Political Censorship)
        // Check for Printing Press and trigger Ruffian Raid
        const hasPress = gameState.inventoryManager.hasItem('printing_press');

        if (hasPress) {
            // 2% chance per tick if you have the press
            if (Math.random() < 0.02) {
                return {
                    id: `ruffian_raid_${Date.now()}`,
                    title: 'Ruffian Raid on the Press',
                    description: 'Border Ruffians have heard of your abolitionist rag. They are coming to smash your printing press!',
                    type: 'combat',
                    date: new Date(),
                    options: [
                        {
                            id: 'defend',
                            text: 'Defend the Press! (Combat)',
                            effects: {
                                combat: { enemyId: 'border_ruffian' }
                            }
                        },
                        {
                            id: 'hide',
                            text: 'Hide the Press (Lose Reputation)',
                            effects: {
                                reputationChanges: [{ faction: FactionType.FreeState, amount: -10 }]
                            }
                        },
                        {
                            id: 'surrender',
                            text: 'Surrender the Press (Lose Item)',
                            effects: {
                                morale: -20,
                                reputationChanges: [{ faction: FactionType.FreeState, amount: -20 }],
                                removeItems: ['printing_press']
                            }
                        }
                    ]
                };
            }
        }

        return null;
    }
}
