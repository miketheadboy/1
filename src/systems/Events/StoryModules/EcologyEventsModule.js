export class EcologyEventsModule {
    id = 'ecology_events';
    update(worldState) {
        // SYSTEM INTERCONNECT: Ecology -> Economy (Drought)
        // Update moisture level
        const month = worldState.currentDate.getMonth();
        const isDrySeason = month >= 5 && month <= 10; // June to November
        if (isDrySeason) {
            // 10% chance to drop moisture
            if (Math.random() < 0.1) {
                worldState.moistureLevel = Math.max(0, worldState.moistureLevel - 5);
            }
        }
        else {
            // Recover moisture in Winter/Spring
            if (Math.random() < 0.2) {
                worldState.moistureLevel = Math.min(100, worldState.moistureLevel + 5);
            }
        }
        // Trigger Drought
        if (worldState.moistureLevel < 20) {
            if (!worldState.droughtActive) {
                worldState.droughtActive = true;
                return {
                    id: `drought_start_${Date.now()}`,
                    title: 'The Great Drought Begins',
                    description: 'The skies have turned to brass. Crops are withering, and the creeks are running dry. Food prices will skyrocket.',
                    type: 'random',
                    date: new Date(),
                    options: [{ id: 'ok', text: 'God help us.', effects: {} }]
                };
            }
        }
        else if (worldState.moistureLevel > 40) {
            if (worldState.droughtActive) {
                worldState.droughtActive = false;
                return {
                    id: `drought_end_${Date.now()}`,
                    title: 'The Rains Return',
                    description: 'At long last, the rains have returned. The drought is broken.',
                    type: 'random',
                    date: new Date(),
                    options: [{ id: 'ok', text: 'Praise be.', effects: {} }]
                };
            }
        }
        return null;
    }
}
