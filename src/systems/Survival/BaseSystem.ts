export enum BuildingType {
    Soddy = 'Soddy',
    LogCabin = 'Log Cabin',
    Barn = 'Barn',
    Fortification = 'Fortification',
}

export interface BuildingCost {
    timber: number;
    sod: number;
    money: number;
    laborDays: number;
}

export const BUILDING_COSTS: Record<BuildingType, BuildingCost> = {
    [BuildingType.Soddy]: { timber: 2, sod: 50, money: 0, laborDays: 7 },
    [BuildingType.LogCabin]: { timber: 50, sod: 0, money: 20, laborDays: 14 },
    [BuildingType.Barn]: { timber: 30, sod: 10, money: 10, laborDays: 10 },
    [BuildingType.Fortification]: { timber: 100, sod: 0, money: 50, laborDays: 30 },
};

export interface PlayerBase {
    locationId: string;
    buildings: BuildingType[];
    integrity: number; // 0-100, degraded by weather/attacks
    isHidden: boolean; // For Underground Railroad
}
