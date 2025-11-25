export enum BiomeType {
    Forest = 'Forest',
    TallgrassPrairie = 'Tallgrass Prairie',
    MixedGrassPrairie = 'Mixed-grass Prairie',
    River = 'River',
    Settlement = 'Settlement',
}

export enum LocationType {
    Town = 'Town',
    Fort = 'Fort',
    TradingPost = 'Trading Post',
    NaturalLandmark = 'Natural Landmark',
    PlayerBase = 'Player Base',
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface MapNode {
    id: string;
    name: string;
    description: string;
    biome: BiomeType;
    type: LocationType;
    coordinates: Coordinates;
    connections: string[]; // IDs of connected nodes
    resources: string[]; // Available resources here
    factionControl?: string; // Faction ID if controlled
    dangerLevel: number; // 1-10
    hasShop?: boolean; // Whether this location has a shop
}

export interface WorldState {
    nodes: Record<string, MapNode>;
    currentLocationId: string;
    discoveredLocations: string[];
}
