export enum BodyPart {
    Head = 'Head',
    Torso = 'Torso',
    LeftArm = 'Left Arm',
    RightArm = 'Right Arm',
    LeftLeg = 'Left Leg',
    RightLeg = 'Right Leg'
}

export enum WoundSeverity {
    Minor = 1,
    Moderate = 2,
    Severe = 3,
    Critical = 4
}

export enum WoundType {
    Bruise = 'Bruise',
    Cut = 'Cut',
    Gunshot = 'Gunshot',
    Fracture = 'Fracture',
    Burn = 'Burn',
    Infection = 'Infection'
}

export interface Wound {
    id: string;
    type: WoundType;
    severity: WoundSeverity;
    bodyPart: BodyPart;
    isTreated: boolean;
    isInfected: boolean;
    painLevel: number; // 0-10, affects morale/aim
    bleedRate: number; // Health loss per day
    dayAcquired: number; // Game day
}

export interface BodyPartStatus {
    part: BodyPart;
    health: number; // 0-100
    maxHealth: number;
    isCrippled: boolean;
    wounds: Wound[];
}
