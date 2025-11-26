export var PoliticalAlignment;
(function (PoliticalAlignment) {
    PoliticalAlignment["FreeState"] = "Free State";
    PoliticalAlignment["SlaveState"] = "Slave State";
})(PoliticalAlignment || (PoliticalAlignment = {}));
export class PoliticsSystem {
    state;
    constructor() {
        this.state = {
            freeStateSupport: 50,
            slaveStateSupport: 50,
            electionDate: new Date('1855-03-30') // First Territorial Legislature election
        };
    }
    modifySupport(alignment, amount) {
        if (alignment === PoliticalAlignment.FreeState) {
            this.state.freeStateSupport = Math.min(100, Math.max(0, this.state.freeStateSupport + amount));
            this.state.slaveStateSupport = Math.min(100, Math.max(0, this.state.slaveStateSupport - amount));
        }
        else {
            this.state.slaveStateSupport = Math.min(100, Math.max(0, this.state.slaveStateSupport + amount));
            this.state.freeStateSupport = Math.min(100, Math.max(0, this.state.freeStateSupport - amount));
        }
        return `Political influence shifted! Free State: ${this.state.freeStateSupport}, Pro-Slavery: ${this.state.slaveStateSupport}`;
    }
    checkVictory(currentDate) {
        if (currentDate >= this.state.electionDate) {
            if (this.state.freeStateSupport > this.state.slaveStateSupport) {
                return "VICTORY: The Free State party has won the election! Kansas will enter the Union as a Free State.";
            }
            else {
                return "DEFEAT: The Pro-Slavery party has won the election. Kansas will become a Slave State.";
            }
        }
        return null;
    }
    getState() {
        return this.state;
    }
}
