export enum FactionType {
    ProSlavery = 'Pro-Slavery',
    FreeState = 'Free-State',
    Abolitionist = 'Abolitionist',
    Native = 'Native',
    Neutral = 'Neutral',
}

export enum NativeTribe {
    Kansa = 'Kansa',
    Osage = 'Osage',
    Pawnee = 'Pawnee',
    Cheyenne = 'Cheyenne',
    Delaware = 'Delaware',
    Shawnee = 'Shawnee',
    Potawatomi = 'Potawatomi',
    Wyandot = 'Wyandot',
}

export interface FactionReputation {
    factionId: FactionType | NativeTribe;
    value: number; // -100 to 100
    status: 'Hostile' | 'Unfriendly' | 'Neutral' | 'Friendly' | 'Allied';
}

export interface FactionState {
    reputations: Record<string, FactionReputation>;
}
