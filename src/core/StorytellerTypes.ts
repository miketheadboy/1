import { FactionType } from '../systems/Factions/FactionTypes';

// ============================================================================
// WORLD STATE - Global and Regional Tracking
// ============================================================================

export enum WeatherType {
    Clear = 'Clear',
    Rain = 'Rain',
    Drought = 'Drought',
    Flood = 'Flood',
    Snow = 'Snow',
    Storm = 'Storm'
}

export enum SystemType {
    Ecology = 'Ecology',
    Economy = 'Economy',
    Politics = 'Politics',
    Combat = 'Combat',
    Player = 'Player',
    Weather = 'Weather'
}

export interface MarketData {
    foodPriceModifier: number;      // 1.0 = normal, 2.0 = double price
    weaponPriceModifier: number;
    animalPriceModifier: number;
    generalInflation: number;
}

export interface RegionalState {
    locationId: string;
    tension: number;                // 0-100, local conflict level
    prosperity: number;             // 0-100, economic health
    lawLevel: number;               // 0-100, law enforcement strength
    factionInfluence: Map<FactionType, number>;
    lastUpdated: Date;
}

export interface WorldState {
    // Global tracking
    globalTension: number;          // 0-100, affects event frequency
    weatherPattern: WeatherType;
    marketTrends: MarketData;
    currentDate: Date;

    // Ecology / Drought System
    moistureLevel: number;          // 0-100. < 20 triggers Drought.
    droughtActive: boolean;

    // Regional data
    regionalStates: Map<string, RegionalState>;

    // Historical tracking
    significantEvents: string[];    // Log of major events
}

// ============================================================================
// SYSTEM EFFECTS - How Systems Affect Each Other
// ============================================================================

export interface SystemEffect {
    id: string;
    source: SystemType;
    target: SystemType;
    magnitude: number;              // -1.0 to 1.0
    description: string;
    expiresAt?: Date;               // Optional expiration
    active: boolean;
}

export enum PlayerActionType {
    Violence = 'Violence',
    Trade = 'Trade',
    Diplomacy = 'Diplomacy',
    Crime = 'Crime',
    Heroism = 'Heroism',
    Build = 'Build',
    Recruit = 'Recruit'
}

// ============================================================================
// NARRATIVE ARC SYSTEM
// ============================================================================

export enum ArcType {
    Short = 'Short',        // 1-3 events
    Medium = 'Medium',      // 4-7 events
    Long = 'Long'           // 8+ events
}

export enum ConditionType {
    Tension = 'Tension',
    Resource = 'Resource',
    Faction = 'Faction',
    Weather = 'Weather',
    PlayerReputation = 'PlayerReputation',
    Population = 'Population',
    Date = 'Date'
}

export enum ComparisonOp {
    GreaterThan = '>',
    LessThan = '<',
    Equal = '==',
    GreaterOrEqual = '>=',
    LessOrEqual = '<='
}

export interface ArcCondition {
    type: ConditionType;
    target: string;                 // What to check (locationId, resource type, etc.)
    operator: ComparisonOp;
    value: number;
}

export interface NarrativeArc {
    id: string;
    name: string;
    type: ArcType;
    stage: number;                  // Current event in sequence (0-based)
    totalStages: number;
    conditions: ArcCondition[];     // Must all be true to activate
    active: boolean;
    startedAt?: Date;
    completedAt?: Date;
}

// ============================================================================
// NPC MEMORY SYSTEM
// ============================================================================

export enum InteractionType {
    Trade = 'Trade',
    Combat = 'Combat',
    Dialogue = 'Dialogue',
    Gift = 'Gift',
    Betrayal = 'Betrayal',
    Rescue = 'Rescue',
    Theft = 'Theft'
}

export interface Interaction {
    date: Date;
    type: InteractionType;
    outcome: string;
    impactOnRelationship: number;   // -100 to 100
}

export interface Grudge {
    reason: string;
    severity: number;               // 0-100
    createdAt: Date;
}

export interface Favor {
    description: string;
    value: number;                  // How significant
    createdAt: Date;
}

export interface NPCMemory {
    npcId: string;
    interactions: Interaction[];
    relationship: number;           // -100 to 100
    grudges: Grudge[];
    favors: Favor[];
    lastInteraction?: Date;
}
