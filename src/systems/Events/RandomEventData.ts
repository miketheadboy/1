import type { GameEvent } from './EventTypes';
import { FactionType } from '../Factions/FactionTypes';

// Random events that can occur during travel or time advancement
export const RANDOM_EVENTS: GameEvent[] = [
    // Weather Events
    {
        id: 'blizzard',
        title: 'Blizzard!',
        description: 'A fierce winter storm has struck! The snow is blinding and the cold is deadly. You must find shelter immediately.',
        options: [
            {
                id: 'opt_shelter',
                text: 'Seek shelter and wait it out.',
                description: 'Use supplies to survive the storm.',
                requirements: { money: 5 },
                effects: {
                    money: -5,
                    morale: -5
                }
            },
            {
                id: 'opt_push_through',
                text: 'Push through the storm.',
                description: 'Risky, but you might make it.',
                effects: {
                    health: -15,
                    morale: -10
                }
            }
        ]
    },
    {
        id: 'drought',
        title: 'Severe Drought',
        description: 'The summer heat is unbearable. Water is scarce and crops are failing. Food prices have skyrocketed.',
        options: [
            {
                id: 'opt_buy_water',
                text: 'Buy water at inflated prices.',
                description: 'Expensive but necessary.',
                requirements: { money: 10 },
                effects: {
                    money: -10,
                    hunger: -10
                }
            },
            {
                id: 'opt_ration',
                text: 'Ration what you have.',
                description: 'Make do with less.',
                effects: {
                    hunger: 10,
                    morale: -5
                }
            }
        ]
    },
    {
        id: 'tornado',
        title: 'Tornado Warning!',
        description: 'A massive tornado is bearing down on your location! You have only moments to act.',
        options: [
            {
                id: 'opt_cellar',
                text: 'Take cover in a storm cellar.',
                description: 'The safest option.',
                effects: {
                    morale: -5
                }
            },
            {
                id: 'opt_flee',
                text: 'Try to outrun it.',
                description: 'Dangerous but might save your possessions.',
                effects: {
                    health: -10,
                    money: -5
                }
            }
        ]
    },
    // Encounter Events
    {
        id: 'travelers',
        title: 'Fellow Travelers',
        description: 'You encounter a group of travelers heading west. They offer to share their campfire and news from back east.',
        options: [
            {
                id: 'opt_join',
                text: 'Join them for the evening.',
                description: 'Good company and information.',
                effects: {
                    morale: 10,
                    addItems: ['hardtack']
                }
            },
            {
                id: 'opt_decline',
                text: 'Politely decline and move on.',
                description: 'Better to travel alone.',
                effects: {
                    morale: -2
                }
            }
        ]
    },
    {
        id: 'peddler',
        title: 'Traveling Peddler',
        description: 'A peddler with a wagon full of goods has set up shop. He has medicines, tools, and other supplies for sale.',
        options: [
            {
                id: 'opt_buy',
                text: 'Buy some medicine.',
                description: 'Could save your life later.',
                requirements: { money: 12 },
                effects: {
                    money: -12,
                    addItems: ['tonic']
                }
            },
            {
                id: 'opt_pass',
                text: 'Pass on by.',
                description: 'Save your money.',
                effects: {}
            }
        ]
    },
    {
        id: 'refugees',
        title: 'Refugees',
        description: 'A family of refugees fleeing violence asks for help. They are hungry and desperate.',
        options: [
            {
                id: 'opt_help',
                text: 'Share your food with them.',
                description: 'It\'s the right thing to do.',
                effects: {
                    hunger: 10,
                    morale: 10,
                    reputationChanges: [
                        { faction: FactionType.FreeState, amount: 5 }
                    ]
                }
            },
            {
                id: 'opt_refuse',
                text: 'You can\'t afford to help.',
                description: 'You need your supplies.',
                effects: {
                    morale: -10
                }
            }
        ]
    },
    // Opportunity Events
    {
        id: 'found_supplies',
        title: 'Abandoned Supplies',
        description: 'You discover an abandoned wagon with supplies scattered around it. The owners are nowhere to be seen.',
        options: [
            {
                id: 'opt_take',
                text: 'Take what you can carry.',
                description: 'Finders keepers.',
                effects: {
                    addItems: ['dried_meat', 'hardtack'],
                    morale: 5
                }
            },
            {
                id: 'opt_leave',
                text: 'Leave it alone.',
                description: 'It might be a trap.',
                effects: {
                    morale: -2
                }
            }
        ]
    },
    {
        id: 'work_opportunity',
        title: 'Work Opportunity',
        description: 'A local farmer offers you work helping with the harvest. It\'s hard labor but pays well.',
        options: [
            {
                id: 'opt_work',
                text: 'Accept the work.',
                description: 'Earn some money.',
                effects: {
                    money: 15,
                    hunger: 10,
                    morale: -5
                }
            },
            {
                id: 'opt_decline_work',
                text: 'Decline the offer.',
                description: 'You have other priorities.',
                effects: {}
            }
        ]
    },
    // Threat Events
    {
        id: 'bandits_warning',
        title: 'Bandit Warning',
        description: 'A fellow traveler warns you that bandits have been spotted on the road ahead. They\'ve been robbing travelers.',
        options: [
            {
                id: 'opt_detour',
                text: 'Take a detour.',
                description: 'Safer but slower.',
                effects: {
                    morale: -5
                }
            },
            {
                id: 'opt_risk_it',
                text: 'Continue on the main road.',
                description: 'You\'ll take your chances.',
                effects: {
                    morale: 5
                }
            }
        ]
    },
    {
        id: 'wild_animal',
        title: 'Wild Animal Encounter',
        description: 'A wild animal (wolf/bear) has wandered into your camp! It looks aggressive.',
        options: [
            {
                id: 'opt_scare',
                text: 'Try to scare it away.',
                description: 'Make noise and look big.',
                effects: {
                    morale: -5
                }
            },
            {
                id: 'opt_fight_animal',
                text: 'Fight it off.',
                description: 'Dangerous but might work.',
                effects: {
                    health: -15,
                    morale: 5
                }
            }
        ]
    },
    {
        id: 'disease_outbreak',
        title: 'Disease Outbreak',
        description: 'There\'s been an outbreak of cholera in the area. People are falling ill and dying. You must be careful.',
        options: [
            {
                id: 'opt_medicine',
                text: 'Use medicine to protect yourself.',
                description: 'Prevention is key.',
                requirements: { money: 10 },
                effects: {
                    money: -10,
                    morale: -5
                }
            },
            {
                id: 'opt_risk_disease',
                text: 'Hope for the best.',
                description: 'You can\'t afford medicine.',
                effects: {
                    health: -10,
                    morale: -10
                }
            }
        ]
    }
];

// Helper function to get a random event
export function getRandomEvent(): GameEvent | null {
    if (Math.random() > 0.3) return null; // 30% chance of random event

    const randomIndex = Math.floor(Math.random() * RANDOM_EVENTS.length);
    return RANDOM_EVENTS[randomIndex];
}
