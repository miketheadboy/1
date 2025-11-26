export enum KnowledgeType {
    Theology = 'Theology',
    Law = 'Law',
    Military = 'Military',
    Agriculture = 'Agriculture',
    Medicine = 'Medicine'
}

export interface Perk {
    id: string;
    name: string;
    description: string;
    requiredKnowledge: KnowledgeType;
    requiredLevel: number;
    effect: (state: any) => void; // Effect logic to be applied
}

export interface KnowledgeState {
    levels: Record<KnowledgeType, number>;
    xp: Record<KnowledgeType, number>;
    unlockedPerks: string[];
}

export const XP_PER_LEVEL = 100;
