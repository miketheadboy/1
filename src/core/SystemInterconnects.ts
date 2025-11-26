import {
    type WorldState,
    type RegionalState,
    type SystemEffect,
    SystemType,
    PlayerActionType,
    WeatherType
} from './StorytellerTypes';
import { FactionType } from '../systems/Factions/FactionTypes';
import { AnimalType } from '../systems/Animals/AnimalTypes';

/**
 * SystemInterconnects defines how different game systems affect each other.
 * This creates emergent gameplay where actions in one system ripple through others.
 */
export class SystemInterconnects {
    private worldState: WorldState;
    private activeEffects: Map<string, SystemEffect>;
    private effectIdCounter: number;

    constructor(initialWorldState?: WorldState) {
        if (initialWorldState) {
            this.worldState = initialWorldState;
        } else {
            this.worldState = {
                globalTension: 50,
                weatherPattern: WeatherType.Clear,
                marketTrends: {
                    foodPriceModifier: 1.0,
                    weaponPriceModifier: 1.0,
                    animalPriceModifier: 1.0,
                    generalInflation: 1.0
                },
                currentDate: new Date('1854-05-30'),
                moistureLevel: 50,
                droughtActive: false,
                regionalStates: new Map(),
                significantEvents: []
            };
        }
        this.activeEffects = new Map();
        this.effectIdCounter = 0;
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    public getWorldState(): WorldState {
        return this.worldState;
    }

    public getActiveEffects(): SystemEffect[] {
        return Array.from(this.activeEffects.values()).filter(e => e.active);
    }

    public update(currentDate: Date): void {
        this.worldState.currentDate = currentDate;
        this.cleanupExpiredEffects(currentDate);
    }

    // ========================================================================
    // ECOLOGY → ECONOMY
    // ========================================================================

    /**
     * Called when animal population changes significantly
     */
    public onEcologyChange(animalType: AnimalType, populationChange: number): void {
        // Significant population drop affects meat prices
        if (populationChange < -10) {
            const priceIncrease = Math.abs(populationChange) * 0.05; // 5% per 10 animals
            this.worldState.marketTrends.foodPriceModifier += priceIncrease;

            this.addEffect({
                source: SystemType.Ecology,
                target: SystemType.Economy,
                magnitude: priceIncrease,
                description: `${animalType} scarcity drives up meat prices by ${(priceIncrease * 100).toFixed(0)}%`
            });
        }

        // Population boom reduces prices
        if (populationChange > 20) {
            const priceDecrease = populationChange * 0.02;
            this.worldState.marketTrends.foodPriceModifier -= priceDecrease;

            this.addEffect({
                source: SystemType.Ecology,
                target: SystemType.Economy,
                magnitude: -priceDecrease,
                description: `${animalType} abundance lowers meat prices by ${(priceDecrease * 100).toFixed(0)}%`
            });
        }
    }

    // ========================================================================
    // POLITICS → GAMEPLAY
    // ========================================================================

    /**
     * Called when faction control of a location changes
     */
    public onPoliticsChange(locationId: string, newFaction: FactionType): void {
        const regional = this.getOrCreateRegionalState(locationId);

        // Update faction influence
        regional.factionInfluence.clear();
        regional.factionInfluence.set(newFaction, 100);

        // Faction change affects local tension
        regional.tension += 20; // Power shifts create unrest

        // Faction affects economy
        if (newFaction === FactionType.ProSlavery) {
            // Pro-slavery towns may have different trade goods
            this.worldState.marketTrends.generalInflation += 0.1;
        } else if (newFaction === FactionType.FreeState) {
            // Free state towns may be more prosperous
            regional.prosperity += 10;
        }

        this.addEffect({
            source: SystemType.Politics,
            target: SystemType.Economy,
            magnitude: 0.5,
            description: `${newFaction} control of ${locationId} shifts local economy`
        });
    }

    // ========================================================================
    // PLAYER ACTIONS → WORLD
    // ========================================================================

    /**
     * Called when player performs significant action
     */
    public onPlayerAction(
        locationId: string,
        action: PlayerActionType,
        severity: number
    ): void {
        const regional = this.getOrCreateRegionalState(locationId);

        switch (action) {
            case PlayerActionType.Violence:
                regional.tension += severity * 5;
                regional.lawLevel += severity * 2; // More violence = more law enforcement
                this.worldState.globalTension += severity;
                break;

            case PlayerActionType.Crime:
                regional.lawLevel += severity * 3;
                regional.prosperity -= severity * 2;
                break;

            case PlayerActionType.Heroism:
                regional.tension -= severity * 3;
                regional.prosperity += severity * 2;
                break;

            case PlayerActionType.Trade:
                regional.prosperity += severity;
                this.worldState.marketTrends.generalInflation += severity * 0.01;
                break;

            case PlayerActionType.Diplomacy:
                regional.tension -= severity * 2;
                break;
        }

        // Clamp values
        regional.tension = Math.max(0, Math.min(100, regional.tension));
        regional.prosperity = Math.max(0, Math.min(100, regional.prosperity));
        regional.lawLevel = Math.max(0, Math.min(100, regional.lawLevel));

        this.addEffect({
            source: SystemType.Player,
            target: SystemType.Politics,
            magnitude: severity / 100,
            description: `Player ${action} affects ${locationId}`
        });
    }

    // ========================================================================
    // WEATHER → ECONOMY
    // ========================================================================

    /**
     * Called when weather changes
     */
    public onWeatherChange(newWeather: WeatherType, duration: number = 7): void {
        this.worldState.weatherPattern = newWeather;

        const expiresAt = new Date(this.worldState.currentDate);
        expiresAt.setDate(expiresAt.getDate() + duration);

        switch (newWeather) {
            case WeatherType.Drought:
                this.worldState.marketTrends.foodPriceModifier += 0.5;
                this.addEffect({
                    source: SystemType.Weather,
                    target: SystemType.Economy,
                    magnitude: 0.5,
                    description: 'Drought devastates crops, food prices soar',
                    expiresAt
                });
                break;

            case WeatherType.Flood:
                this.worldState.marketTrends.foodPriceModifier += 0.3;
                this.addEffect({
                    source: SystemType.Weather,
                    target: SystemType.Economy,
                    magnitude: 0.3,
                    description: 'Flooding destroys farmland, prices rise',
                    expiresAt
                });
                break;

            case WeatherType.Snow:
                // Snow slows travel and trade
                this.worldState.marketTrends.generalInflation += 0.2;
                this.addEffect({
                    source: SystemType.Weather,
                    target: SystemType.Economy,
                    magnitude: 0.2,
                    description: 'Winter weather disrupts trade routes',
                    expiresAt
                });
                break;
        }
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    private getOrCreateRegionalState(locationId: string): RegionalState {
        let regional = this.worldState.regionalStates.get(locationId);

        if (!regional) {
            regional = {
                locationId,
                tension: 50,
                prosperity: 50,
                lawLevel: 50,
                factionInfluence: new Map(),
                lastUpdated: this.worldState.currentDate
            };
            this.worldState.regionalStates.set(locationId, regional);
        }

        return regional;
    }

    private addEffect(partial: Omit<SystemEffect, 'id' | 'active'>): void {
        const effect: SystemEffect = {
            id: `effect_${this.effectIdCounter++}`,
            active: true,
            ...partial
        };

        this.activeEffects.set(effect.id, effect);
    }

    private cleanupExpiredEffects(currentDate: Date): void {
        for (const effect of this.activeEffects.values()) {
            if (effect.expiresAt && currentDate >= effect.expiresAt) {
                effect.active = false;

                // Reverse the effect
                this.reverseEffect(effect);
            }
        }
    }

    private reverseEffect(effect: SystemEffect): void {
        // Reverse economic effects when they expire
        if (effect.target === SystemType.Economy) {
            if (effect.description.includes('food prices')) {
                this.worldState.marketTrends.foodPriceModifier -= effect.magnitude;
            } else if (effect.description.includes('trade')) {
                this.worldState.marketTrends.generalInflation -= effect.magnitude;
            }
        }
    }

    // ========================================================================
    // QUERY METHODS
    // ========================================================================

    public getRegionalTension(locationId: string): number {
        const regional = this.worldState.regionalStates.get(locationId);
        return regional?.tension ?? 50;
    }

    public getRegionalProsperity(locationId: string): number {
        const regional = this.worldState.regionalStates.get(locationId);
        return regional?.prosperity ?? 50;
    }

    public getFoodPriceModifier(): number {
        return Math.max(0.5, this.worldState.marketTrends.foodPriceModifier);
    }
}
