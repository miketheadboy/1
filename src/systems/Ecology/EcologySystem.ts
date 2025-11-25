

export interface LocalEcology {
    bisonPopulation: number;
    beaverPopulation: number;
    isDepleted: boolean;
}

export class EcologySystem {
    // Map Node ID -> Ecology Data
    private ecologyMap: Record<string, LocalEcology> = {};

    constructor() {
        // Initialize with some default data (would normally come from MapData)
    }

    public initLocation(nodeId: string, bisonCount: number, beaverCount: number) {
        this.ecologyMap[nodeId] = {
            bisonPopulation: bisonCount,
            beaverPopulation: beaverCount,
            isDepleted: false,
        };
    }

    public hunt(nodeId: string, target: 'bison' | 'beaver', amount: number): { success: number, meat: number, hides: number } {
        const eco = this.ecologyMap[nodeId];
        if (!eco) return { success: 0, meat: 0, hides: 0 };

        let actualHunted = 0;
        if (target === 'bison') {
            actualHunted = Math.min(amount, eco.bisonPopulation);
            eco.bisonPopulation -= actualHunted;
        } else {
            actualHunted = Math.min(amount, eco.beaverPopulation);
            eco.beaverPopulation -= actualHunted;
        }

        this.checkDepletion(nodeId);

        return {
            success: actualHunted,
            meat: actualHunted * 100, // lbs of meat
            hides: actualHunted,
        };
    }

    private checkDepletion(nodeId: string) {
        const eco = this.ecologyMap[nodeId];
        if (eco.bisonPopulation < 50 && !eco.isDepleted) {
            eco.isDepleted = true;
            // This flag can trigger the "Native Hostility" event
        }
    }

    public getPopulation(nodeId: string): LocalEcology | null {
        return this.ecologyMap[nodeId] || null;
    }
}
