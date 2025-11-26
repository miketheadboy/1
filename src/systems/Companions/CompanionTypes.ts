import { type Citizen } from '../NPCs/CitizenData';
import { type PlayerStats } from '../Survival/PlayerStats';

export enum CompanionRole {
    Scout = 'Scout',
    Fighter = 'Fighter',
    Doctor = 'Doctor',
    Cook = 'Cook',
    Laborer = 'Laborer'
}

export interface Companion extends Citizen {
    stats: PlayerStats;
    role: CompanionRole;
    dailyWage: number;
    joinedDate: Date;
}
