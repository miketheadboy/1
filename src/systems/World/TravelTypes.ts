
export enum TravelMode {
    Foot = 'foot',
    Horseback = 'horseback',
    Wagon = 'wagon',
    Cart = 'cart'
}

export interface Vehicle {
    id: string;
    type: 'wagon' | 'cart';
    name: string;
    capacity: number; // Item weight capacity
    passengerCapacity: number;
    durability: number;
    maxDurability: number;
    speedModifier: number;
    requiredAnimals: number; // Number of animals needed to pull (e.g., 2 oxen for wagon)
    animalTypes: string[]; // 'ox', 'horse', 'mule'
}

export interface TravelState {
    mode: TravelMode;
    vehicleId: string | null; // ID of the vehicle item in inventory if using one
    assignedAnimalIds: string[]; // IDs of animals from AnimalManager assigned to pull
    isTraveling: boolean;
    destinationId: string | null;
    progress: number; // 0-100%
    daysRemaining: number;
}

export interface FogOfWarData {
    discoveredLocationIds: string[];
    visibleLocationIds: string[]; // Currently visible (neighbors of current location)
}
