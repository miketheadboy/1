import type { MapNode, Coordinates } from './WorldTypes';
import { INITIAL_MAP_NODES } from './MapData';

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

    public getTravelTimeDays(distance: number, transportMode: 'foot' | 'horse' | 'wagon'): number {
        let speed = 1; // Base speed
        switch (transportMode) {
            case 'foot': speed = 10; break; // miles per day
            case 'wagon': speed = 15; break;
            case 'horse': speed = 25; break;
        }
        // Assuming distance unit is roughly miles in the coordinate system
        return Math.ceil(distance / speed);
    }

    public getConnectedNodes(currentId: string): MapNode[] {
        const node = this.nodes[currentId];
        if (!node) return [];
        return node.connections.map(id => this.nodes[id]).filter(n => !!n);
    }
}
