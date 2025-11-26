export type Race = 'White' | 'Black' | 'Native American';
export type Ethnicity = 'Yankee' | 'Southerner' | 'German' | 'Irish' | 'Free Black' | 'Enslaved' | 'Kansa' | 'Osage';

export interface Citizen {
    id: string;
    name: string;
    race: Race;
    ethnicity: Ethnicity;
    job: string;
    description: string;
    politicalLeaning: number; // -100 (Pro-Slavery) to 100 (Abolitionist)
}

export const FIRST_NAMES: Record<string, string[]> = {
    male: ['James', 'John', 'William', 'Robert', 'George', 'Thomas', 'Henry', 'Charles', 'Joseph', 'Samuel'],
    female: ['Mary', 'Sarah', 'Elizabeth', 'Ann', 'Jane', 'Margaret', 'Emily', 'Susan', 'Hannah', 'Martha']
};

export const LAST_NAMES: Record<Ethnicity, string[]> = {
    'Yankee': ['Smith', 'Brown', 'Wilson', 'Thompson', 'White', 'Clark', 'Robinson', 'Walker'],
    'Southerner': ['Johnson', 'Jones', 'Davis', 'Miller', 'Taylor', 'Anderson', 'Jackson', 'Moore'],
    'German': ['Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker'],
    'Irish': ['Murphy', 'Kelly', 'O\'Brien', 'Ryan', 'Sullivan', 'Walsh', 'O\'Connor', 'Doyle'],
    'Free Black': ['Freeman', 'Washington', 'Jefferson', 'Douglass', 'Tubman', 'Truth', 'Carver', 'Wheatley'],
    'Enslaved': ['None', 'Freeman', 'Washington', 'Jefferson'], // Often took owner's name or none
    'Kansa': ['White Plume', 'Little White Bear', 'Hard Chief', 'American Chief'],
    'Osage': ['Pawhuska', 'Big Soldier', 'Claremore', 'Black Dog']
};

export const JOBS: string[] = [
    'Farmer', 'Blacksmith', 'Storekeeper', 'Saloon Keeper', 'Preacher', 'Doctor', 'Lawyer', 'Journalist', 'Laborer', 'Soldier'
];
