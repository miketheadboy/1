import { FactionType } from '../Factions/FactionTypes';
import { PoliticalAlignment } from '../Politics/PoliticsSystem';

export type RelationshipStatus = 'neutral' | 'friend' | 'lover' | 'rival' | 'enemy' | 'recruited';

export interface NPCStats {
    combat: number;
    survival: number;
    trading: number;
    leadership: number;
}

export interface NPC {
    id: string;
    name: string;
    title: string;
    description: string;
    biography: string;
    locationId: string;
    faction: FactionType;
    image?: string;
    relationship: RelationshipStatus;
    stats: NPCStats;
    isRecruitable: boolean;
    dialogue: DialogueOption[];
}

export interface DialogueOption {
    id: string;
    text: string;
    response: string;
    reqRelationship?: RelationshipStatus[]; // Only available if in these states
    effect?: {
        politicalAlignment?: PoliticalAlignment;
        politicalChange?: number;
        moneyCost?: number;
        reputationChange?: number;
        relationshipChange?: RelationshipStatus;
        recruit?: boolean;
    };
}

export const HISTORICAL_NPCS: Record<string, NPC> = {
    john_brown: {
        id: 'john_brown',
        name: 'John Brown',
        title: 'Radical Abolitionist',
        description: 'A stern man with a wild look in his eyes, preaching violent liberation.',
        biography: 'Born in Connecticut, John Brown is a fervent abolitionist who believes armed insurrection is the only way to overthrow the institution of slavery. He has come to Kansas to fight the Pro-Slavery forces by any means necessary.',
        locationId: 'osawatomie',
        faction: FactionType.FreeState,
        relationship: 'neutral',
        stats: { combat: 9, survival: 8, trading: 2, leadership: 8 },
        isRecruitable: true,
        dialogue: [
            {
                id: 'jb_donate',
                text: "Here is $10 for the cause of freedom.",
                response: "God bless you. This will buy lead and powder for the righteous fight.",
                effect: {
                    politicalAlignment: PoliticalAlignment.FreeState,
                    politicalChange: 2,
                    moneyCost: 10,
                    reputationChange: 5,
                    relationshipChange: 'friend'
                }
            },
            {
                id: 'jb_talk',
                text: "What must be done to end slavery?",
                response: "Talk is cheap. Only blood can wash away the sins of this land. We must strike terror into their hearts.",
                effect: {
                    politicalAlignment: PoliticalAlignment.FreeState,
                    politicalChange: 0.5
                }
            },
            {
                id: 'jb_recruit',
                text: "Join my militia, Captain Brown.",
                response: "I will fight alongside any man who fears God and hates slavery. Let us ride.",
                reqRelationship: ['friend'],
                effect: {
                    recruit: true,
                    relationshipChange: 'recruited'
                }
            },
            {
                id: 'jb_rival',
                text: "Your methods are too extreme, Brown.",
                response: "Then you are part of the problem. Get out of my sight before I mistake you for a slaver.",
                effect: {
                    relationshipChange: 'rival',
                    reputationChange: -5
                }
            }
        ]
    },
    charles_robinson: {
        id: 'charles_robinson',
        name: 'Dr. Charles Robinson',
        title: 'Free State Leader',
        description: 'A composed and articulate leader of the Free State movement.',
        biography: 'A physician and politician, Robinson leads the New England Emigrant Aid Company in Kansas. He advocates for a Free State through political organization and the Topeka Constitution.',
        locationId: 'lawrence',
        faction: FactionType.FreeState,
        relationship: 'neutral',
        stats: { combat: 3, survival: 5, trading: 7, leadership: 9 },
        isRecruitable: false,
        dialogue: [
            {
                id: 'cr_support',
                text: "I pledge my support to the Topeka Constitution.",
                response: "Excellent. We must build a legitimate government to counter the bogus legislature.",
                effect: {
                    politicalAlignment: PoliticalAlignment.FreeState,
                    politicalChange: 1,
                    reputationChange: 2,
                    relationshipChange: 'friend'
                }
            },
            {
                id: 'cr_romance',
                text: "Dr. Robinson, I find your intellect... captivating.",
                response: "I... am flattered. But the cause of freedom consumes all my time. Perhaps, one day, when Kansas is free...",
                reqRelationship: ['friend'],
                effect: {
                    relationshipChange: 'lover'
                }
            }
        ]
    },
    david_rice_atchison: {
        id: 'david_rice_atchison',
        name: 'David Rice Atchison',
        title: 'Pro-Slavery Senator',
        description: 'A powerful politician determined to make Kansas a slave state.',
        biography: 'A US Senator from Missouri, Atchison leads the "Border Ruffians". He has pledged to see Kansas as a slave state even if he has to kill every abolitionist in the territory.',
        locationId: 'atchison',
        faction: FactionType.ProSlavery,
        relationship: 'neutral',
        stats: { combat: 6, survival: 4, trading: 6, leadership: 8 },
        isRecruitable: false,
        dialogue: [
            {
                id: 'dra_support',
                text: "The South has rights in this territory.",
                response: "Damn right. We will not let these abolitionist fanatics steal our property.",
                effect: {
                    politicalAlignment: PoliticalAlignment.SlaveState,
                    politicalChange: 1,
                    reputationChange: 2,
                    relationshipChange: 'friend'
                }
            },
            {
                id: 'dra_insult',
                text: "You are a tyrant and a bully.",
                response: "Watch your tongue, or I'll have you hanged for treason!",
                effect: {
                    relationshipChange: 'enemy',
                    reputationChange: -10
                }
            }
        ]
    }
};
