import { FactionType } from '../Factions/FactionTypes';
export const INITIAL_EVENTS = [
    {
        id: 'kansas_nebraska_act',
        title: 'The Kansas-Nebraska Act',
        description: 'May 30, 1854. The Act is passed, repealing the Missouri Compromise and establishing "Popular Sovereignty." The territory is now open. Settlers from the North and South are flooding in to decide the fate of Kansas. Where do you stand?',
        date: new Date('1854-05-30'),
        isUnique: true,
        options: [
            {
                id: 'opt_free_state',
                text: 'I am a Free-Stater.',
                description: 'I believe Kansas should be a free state for white settlers.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 20 },
                        { faction: FactionType.ProSlavery, amount: -10 }
                    ],
                    morale: 10
                }
            },
            {
                id: 'opt_pro_slavery',
                text: 'I support the Southern Cause.',
                description: 'Our institutions must be protected and expanded.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.ProSlavery, amount: 20 },
                        { faction: FactionType.FreeState, amount: -20 },
                        { faction: FactionType.Abolitionist, amount: -20 }
                    ],
                    money: 20
                }
            },
            {
                id: 'opt_abolitionist',
                text: 'Slavery is a sin. It must end.',
                description: 'I will fight to destroy slavery by any means necessary.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.Abolitionist, amount: 25 },
                        { faction: FactionType.ProSlavery, amount: -30 },
                        { faction: FactionType.FreeState, amount: -5 }
                    ],
                    morale: 20
                }
            }
        ]
    },
    {
        id: 'border_ruffian_election',
        title: 'The Border Ruffian Elections',
        description: 'March 30, 1855. Armed Missourians have crossed the border to vote illegally in the territorial elections. They are intimidating Free-State voters and stuffing ballot boxes. The "Bogus Legislature" is being elected through fraud and violence.',
        date: new Date('1855-03-30'),
        isUnique: true,
        options: [
            {
                id: 'opt_protest',
                text: 'Protest the fraudulent election!',
                description: 'Refuse to recognize this illegitimate government.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 15 },
                        { faction: FactionType.ProSlavery, amount: -15 }
                    ],
                    morale: 5
                }
            },
            {
                id: 'opt_accept',
                text: 'Accept the results to avoid conflict.',
                description: 'Perhaps we can work within the system.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.ProSlavery, amount: 10 }
                    ],
                    morale: -10
                }
            },
            {
                id: 'opt_organize',
                text: 'Organize our own Free-State government!',
                description: 'We will not submit to this tyranny.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 20 },
                        { faction: FactionType.Abolitionist, amount: 10 },
                        { faction: FactionType.ProSlavery, amount: -25 }
                    ],
                    morale: 15
                }
            }
        ]
    },
    {
        id: 'wakarusa_war',
        title: 'The Wakarusa War',
        description: 'December 1855. Pro-slavery forces have surrounded Lawrence. Sheriff Jones demands the surrender of Free-State leaders. Hundreds of armed men on both sides face off. Will this be the spark that ignites civil war?',
        date: new Date('1855-12-01'),
        isUnique: true,
        options: [
            {
                id: 'opt_defend',
                text: 'Defend Lawrence!',
                description: 'We will not surrender to these border ruffians.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 20 },
                        { faction: FactionType.ProSlavery, amount: -20 }
                    ],
                    morale: 10,
                    addItems: ['hardtack', 'bandages']
                }
            },
            {
                id: 'opt_negotiate',
                text: 'Negotiate a peaceful resolution.',
                description: 'Bloodshed will only make things worse.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 5 }
                    ],
                    morale: -5
                }
            }
        ]
    },
    {
        id: 'sack_of_lawrence',
        title: 'The Sack of Lawrence',
        description: 'May 21, 1856. Pro-slavery forces have invaded Lawrence! The Free State Hotel is destroyed, printing presses are thrown in the river, and homes are looted. This is an act of war against the Free-State movement.',
        date: new Date('1856-05-21'),
        isUnique: true,
        options: [
            {
                id: 'opt_flee',
                text: 'Flee to safety.',
                description: 'Live to fight another day.',
                effects: {
                    morale: -15,
                    money: -10
                }
            },
            {
                id: 'opt_resist',
                text: 'Resist the attackers!',
                description: 'We will not go quietly.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 15 },
                        { faction: FactionType.ProSlavery, amount: -20 }
                    ],
                    morale: 10
                }
            },
            {
                id: 'opt_rebuild',
                text: 'Focus on helping rebuild.',
                description: 'The town needs us now more than ever.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 10 }
                    ],
                    morale: 5,
                    money: -15
                }
            }
        ]
    },
    {
        id: 'pottawatomie_massacre',
        title: 'Pottawatomie Creek Massacre',
        description: 'May 24, 1856. John Brown and his sons have killed five pro-slavery settlers at Pottawatomie Creek in retaliation for the Sack of Lawrence. The violence is escalating. Some call Brown a hero, others a murderer.',
        date: new Date('1856-05-24'),
        isUnique: true,
        options: [
            {
                id: 'opt_support_brown',
                text: 'Brown did what was necessary.',
                description: 'Violence must be met with violence.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.Abolitionist, amount: 25 },
                        { faction: FactionType.FreeState, amount: -10 },
                        { faction: FactionType.ProSlavery, amount: -30 }
                    ],
                    morale: 5
                }
            },
            {
                id: 'opt_condemn',
                text: 'This is murder, not justice.',
                description: 'We must not become what we fight against.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 10 },
                        { faction: FactionType.Abolitionist, amount: -15 }
                    ],
                    morale: -5
                }
            },
            {
                id: 'opt_neutral',
                text: 'Stay out of it.',
                description: 'This is too dangerous to get involved in.',
                effects: {
                    morale: -10
                }
            }
        ]
    },
    {
        id: 'battle_black_jack',
        title: 'Battle of Black Jack',
        description: 'June 2, 1856. John Brown and his Free-State militia have defeated a pro-slavery force led by Henry Pate. This is the first real battle of the Kansas conflict. The territory is now in open warfare.',
        date: new Date('1856-06-02'),
        isUnique: true,
        options: [
            {
                id: 'opt_join_militia',
                text: 'Join the Free-State militia.',
                description: 'The time for talk is over.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 20 },
                        { faction: FactionType.Abolitionist, amount: 15 },
                        { faction: FactionType.ProSlavery, amount: -25 }
                    ],
                    morale: 15,
                    addItems: ['bandages']
                }
            },
            {
                id: 'opt_stay_neutral',
                text: 'Remain neutral.',
                description: 'This war will destroy us all.',
                effects: {
                    morale: -5
                }
            }
        ]
    },
    {
        id: 'battle_osawatomie',
        title: 'Battle of Osawatomie',
        description: 'August 30, 1856. Pro-slavery forces have attacked Osawatomie. John Brown\'s son Frederick has been killed. The town is burning. Brown and his men fought bravely but were overwhelmed.',
        date: new Date('1856-08-30'),
        isUnique: true,
        options: [
            {
                id: 'opt_help_defend',
                text: 'Help defend the town!',
                description: 'Every hand is needed.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.Abolitionist, amount: 20 },
                        { faction: FactionType.ProSlavery, amount: -20 }
                    ],
                    morale: 5
                }
            },
            {
                id: 'opt_evacuate',
                text: 'Help evacuate civilians.',
                description: 'Save who we can.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 10 }
                    ],
                    morale: -5
                }
            }
        ]
    },
    {
        id: 'lecompton_constitution',
        title: 'The Lecompton Constitution',
        description: 'November 1857. The pro-slavery Lecompton Constitution has been drafted. It would make Kansas a slave state. Free-Staters are boycotting the vote, calling it fraudulent. The fate of Kansas hangs in the balance.',
        date: new Date('1857-11-01'),
        isUnique: true,
        options: [
            {
                id: 'opt_boycott',
                text: 'Boycott this sham vote!',
                description: 'We will not legitimize this fraud.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 15 },
                        { faction: FactionType.ProSlavery, amount: -15 }
                    ],
                    morale: 5
                }
            },
            {
                id: 'opt_vote_no',
                text: 'Vote NO on the constitution.',
                description: 'We must participate to defeat it.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 10 }
                    ],
                    morale: 10
                }
            }
        ]
    },
    {
        id: 'marais_des_cygnes',
        title: 'Marais des Cygnes Massacre',
        description: 'May 19, 1858. Pro-slavery raiders have murdered five Free-State men at Marais des Cygnes. They were lined up and shot in cold blood. The violence continues even as the nation watches in horror.',
        date: new Date('1858-05-19'),
        isUnique: true,
        options: [
            {
                id: 'opt_demand_justice',
                text: 'Demand justice for the victims!',
                description: 'These murderers must be brought to account.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 15 },
                        { faction: FactionType.ProSlavery, amount: -20 }
                    ],
                    morale: -5
                }
            },
            {
                id: 'opt_mourn',
                text: 'Mourn the dead.',
                description: 'When will this violence end?',
                effects: {
                    morale: -10
                }
            }
        ]
    },
    {
        id: 'harpers_ferry_news',
        title: 'News from Harpers Ferry',
        description: 'October 1859. Word has reached Kansas: John Brown has raided the federal arsenal at Harpers Ferry, Virginia, attempting to start a slave rebellion. He has been captured and will be hanged. The man who fought here in Kansas has become a martyr.',
        date: new Date('1859-10-18'),
        isUnique: true,
        options: [
            {
                id: 'opt_honor_brown',
                text: 'Honor Brown\'s sacrifice.',
                description: 'He gave his life for the cause of freedom.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.Abolitionist, amount: 20 },
                        { faction: FactionType.ProSlavery, amount: -25 }
                    ],
                    morale: 10
                }
            },
            {
                id: 'opt_distance',
                text: 'Distance yourself from Brown.',
                description: 'His methods were too extreme.',
                effects: {
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 5 },
                        { faction: FactionType.Abolitionist, amount: -10 }
                    ],
                    morale: -5
                }
            },
            {
                id: 'opt_reflect',
                text: 'Reflect on the cost of this conflict.',
                description: 'So much blood has been spilled.',
                effects: {
                    morale: -10
                }
            }
        ]
    }
];
