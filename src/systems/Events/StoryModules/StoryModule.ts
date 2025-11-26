import type { GameEvent } from '../EventTypes';
import type { WorldState } from '../../../core/StorytellerTypes';
import type { GameState } from '../../../core/GameState';

export interface StoryModule {
    id: string;
    update(worldState: WorldState, gameState: GameState): GameEvent | null;
}
