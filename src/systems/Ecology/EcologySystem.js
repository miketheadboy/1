import { AnimalType } from '../Animals/AnimalTypes';
export class EcologySystem {
    // Map Node ID -> Ecology Data
    ecologyMap = {};
    constructor() {
        // Initialize with some default data (would normally come from MapData)
    }
    initLocation(nodeId, defaultPop) {
        this.ecologyMap[nodeId] = {
            populations: {
                [AnimalType.BUFFALO]: defaultPop,
                [AnimalType.DEER]: defaultPop * 2,
                [AnimalType.RABBIT]: defaultPop * 5,
                [AnimalType.WOLF]: defaultPop / 10,
                [AnimalType.COYOTE]: defaultPop / 5,
                [AnimalType.BEAR]: defaultPop / 20,
            },
            isDepleted: false,
        };
    }
    getPopulation(nodeId, type) {
        return this.ecologyMap[nodeId]?.populations[type] || 0;
    }
    reducePopulation(nodeId, type, amount) {
        const eco = this.ecologyMap[nodeId];
        if (!eco || !eco.populations[type])
            return;
        eco.populations[type] = Math.max(0, (eco.populations[type] || 0) - amount);
        this.checkDepletion(nodeId);
    }
    checkDepletion(nodeId) {
        const eco = this.ecologyMap[nodeId];
        if (!eco)
            return;
        const totalLargeGame = (eco.populations[AnimalType.BUFFALO] || 0) + (eco.populations[AnimalType.DEER] || 0);
        if (totalLargeGame < 50 && !eco.isDepleted) {
            eco.isDepleted = true;
            // This flag can trigger the "Native Hostility" event
        }
    }
}
