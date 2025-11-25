export enum ResourceType {
    BisonHide = 'Bison Hide',
    BisonMeat = 'Bison Meat',
    BisonBone = 'Bison Bone',
    BeaverPelt = 'Beaver Pelt',
    Corn = 'Corn',
    Timber = 'Timber',
    Sod = 'Sod',
    Ammo = 'Ammunition',
    Medicine = 'Medicine',
}

export interface ResourceDef {
    name: string;
    baseValue: number; // In dollars
    weight: number; // In lbs
    perishable: boolean;
}

export const RESOURCES: Record<ResourceType, ResourceDef> = {
    [ResourceType.BisonHide]: { name: 'Bison Hide', baseValue: 3.50, weight: 10, perishable: false },
    [ResourceType.BisonMeat]: { name: 'Bison Meat', baseValue: 0.10, weight: 1, perishable: true },
    [ResourceType.BisonBone]: { name: 'Bison Bone', baseValue: 0.05, weight: 5, perishable: false },
    [ResourceType.BeaverPelt]: { name: 'Beaver Pelt', baseValue: 6.00, weight: 2, perishable: false },
    [ResourceType.Corn]: { name: 'Corn', baseValue: 0.50, weight: 1, perishable: false },
    [ResourceType.Timber]: { name: 'Timber', baseValue: 0.20, weight: 5, perishable: false },
    [ResourceType.Sod]: { name: 'Sod', baseValue: 0.00, weight: 10, perishable: false },
    [ResourceType.Ammo]: { name: 'Ammunition', baseValue: 0.10, weight: 0.1, perishable: false },
    [ResourceType.Medicine]: { name: 'Medicine', baseValue: 2.00, weight: 0.5, perishable: false },
};
