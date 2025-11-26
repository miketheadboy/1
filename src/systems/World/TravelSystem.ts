import type { MapNode, Coordinates } from './WorldTypes';
import { INITIAL_MAP_NODES } from './MapData';
import { TravelMode, type Vehicle } from './TravelTypes';

export class TravelSystem {
    private nodes: Record<string, MapNode>;

    constructor(nodes: Record<string, MapNode> = INITIAL_MAP_NODES) {
        this.nodes = nodes;
    }

    public getDistance(fromId: string, toId: string): number {
        const start = this.nodes[fromId];
        const end = this.nodes[toId];

        if (!start || !end) return -1;

        return this.calculateDistance(start.coordinates, end.coordinates);
    }

    private calculateDistance(c1: Coordinates, c2: Coordinates): number {
        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public getTravelTimeDays(distance: number, mode: TravelMode, vehicle?: Vehicle | null): number {
        let speed = 10; // Base foot speed (miles/day)

        switch (mode) {
            case TravelMode.Foot:
                speed = 10;
                break;
            case TravelMode.Horseback:
                speed = 25;
                break;
            case TravelMode.Wagon:
                speed = 15;
                if (vehicle) speed *= vehicle.speedModifier;
                break;
            case TravelMode.Cart:
                speed = 12;
                if (vehicle) speed *= vehicle.speedModifier;
                break;
        }

        // Ensure minimum 1 day
        return Math.max(1, Math.ceil(distance / speed));
    }

    public getConnectedNodes(currentId: string): MapNode[] {
        const node = this.nodes[currentId];
        if (!node) return [];
        return node.connections.map(id => this.nodes[id]).filter(n => !!n);
    }

    public getVisibleNodes(currentLocationId: string, discoveredIds: string[]): MapNode[] {
        const current = this.nodes[currentLocationId];
        if (!current) return [];

        // Visible nodes are:
        // 1. Already discovered locations
        // 2. Current location
        // 3. Direct neighbors (scouting range)
        const visibleSet = new Set([...discoveredIds, currentLocationId, ...current.connections]);

        return Object.values(this.nodes).filter(node => visibleSet.has(node.id));
    }
}
