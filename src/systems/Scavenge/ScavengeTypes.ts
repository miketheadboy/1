

export enum ScavengeLocationType {
    Residential = 'Residential',
    Commercial = 'Commercial',
    Industrial = 'Industrial',
    Wilderness = 'Wilderness',
    Battlefield = 'Battlefield',
    Ruins = 'Ruins'
}

export enum ScavengeRiskLevel {
    Safe = 'Safe',
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Deadly = 'Deadly'
}

export interface ScavengeNode {
    id: string;
    name: string;
    description: string;
    type: ScavengeLocationType;
    difficulty: number; // 0-100, higher requires better Scavenging skill
    riskLevel: ScavengeRiskLevel;
    isDepleted: boolean;
    lastScavengedDate?: Date;
}

export interface ScavengeResult {
    success: boolean;
    message: string;
    itemsFound: { itemId: string; quantity: number }[];
    moneyFound: number;
    xpGained: number;
    damageTaken: number;
    combatTriggered?: boolean;
}
