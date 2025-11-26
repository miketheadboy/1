export enum PoliticalAlignment {
    FreeState = 'Free State',
    SlaveState = 'Slave State'
}

export interface PoliticsState {
    freeStateSupport: number; // 0-100
    slaveStateSupport: number; // 0-100
    electionDate: Date;
}

export class PoliticsSystem {
    private state: PoliticsState;

    constructor() {
        this.state = {
            freeStateSupport: 50,
            slaveStateSupport: 50,
            electionDate: new Date('1855-03-30') // First Territorial Legislature election
        };
    }

    public modifySupport(alignment: PoliticalAlignment, amount: number): string {
        if (alignment === PoliticalAlignment.FreeState) {
            this.state.freeStateSupport = Math.min(100, Math.max(0, this.state.freeStateSupport + amount));
            this.state.slaveStateSupport = Math.min(100, Math.max(0, this.state.slaveStateSupport - amount));
        } else {
            this.state.slaveStateSupport = Math.min(100, Math.max(0, this.state.slaveStateSupport + amount));
            this.state.freeStateSupport = Math.min(100, Math.max(0, this.state.freeStateSupport - amount));
        }
        return `Political influence shifted! Free State: ${this.state.freeStateSupport}, Pro-Slavery: ${this.state.slaveStateSupport}`;
    }

    public checkVictory(currentDate: Date): string | null {
        if (currentDate >= this.state.electionDate) {
            if (this.state.freeStateSupport > this.state.slaveStateSupport) {
                return "VICTORY: The Free State party has won the election! Kansas will enter the Union as a Free State.";
            } else {
                return "DEFEAT: The Pro-Slavery party has won the election. Kansas will become a Slave State.";
            }
        }
        return null;
    }

    public getState() {
        return this.state;
    }
}
