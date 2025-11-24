import type { Node, Edge } from 'reactflow';
import type { SimulationState, CanvasNodeType } from '../types';

/**
 * Simulation Engine for risk propagation through canvas nodes
 */
export class SimulationEngine {
    private nodes: Node[] = [];
    private edges: Edge[] = [];
    private state: SimulationState = {
        isRunning: false,
        speed: 1,
        currentStep: 0,
        affectedNodes: new Set<string>(),
        riskPath: [],
        impactLevel: new Map<string, number>()
    };
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private onUpdate: ((state: SimulationState, affectedNodes: Set<string>) => void) | null = null;

    constructor(nodes: Node[], edges: Edge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }

    /**
     * Initialize simulation from a risk node
     */
    public initialize(startNodeId: string): void {
        this.state = {
            isRunning: false,
            speed: 1,
            currentStep: 0,
            affectedNodes: new Set([startNodeId]),
            riskPath: [startNodeId],
            impactLevel: new Map([[startNodeId, 100]])
        };
    }

    /**
     * Start the simulation
     */
    public start(onUpdate: (state: SimulationState, affectedNodes: Set<string>) => void): void {
        if (this.state.isRunning) return;

        this.state.isRunning = true;
        this.onUpdate = onUpdate;

        // Find initial risk nodes if not already initialized
        if (this.state.affectedNodes.size === 0) {
            const riskNodes = this.nodes.filter(n => n.type === 'risk');
            if (riskNodes.length > 0) {
                this.initialize(riskNodes[0].id);
            }
        }

        this.run();
    }

    /**
     * Pause the simulation
     */
    public pause(): void {
        this.state.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Stop and reset the simulation
     */
    public stop(): void {
        this.pause();
        this.state = {
            isRunning: false,
            speed: 1,
            currentStep: 0,
            affectedNodes: new Set(),
            riskPath: [],
            impactLevel: new Map()
        };
        if (this.onUpdate) {
            this.onUpdate(this.state, new Set());
        }
    }

    /**
     * Change simulation speed
     */
    public setSpeed(speed: number): void {
        this.state.speed = speed;
        if (this.state.isRunning) {
            this.pause();
            this.start(this.onUpdate!);
        }
    }

    /**
     * Get current state
     */
    public getState(): SimulationState {
        return { ...this.state };
    }

    /**
     * Main simulation loop
     */
    private run(): void {
        const stepDuration = 1500 / this.state.speed; // Base duration: 1500ms

        this.intervalId = setInterval(() => {
            if (!this.state.isRunning) {
                if (this.intervalId) clearInterval(this.intervalId);
                return;
            }

            this.step();
        }, stepDuration);
    }

    /**
     * Execute one simulation step
     */
    private step(): void {
        this.state.currentStep++;

        // Get currently affected nodes
        const currentlyAffected = Array.from(this.state.affectedNodes);
        const newlyAffected = new Set<string>();

        // Propagate from each affected node
        currentlyAffected.forEach(nodeId => {
            const currentImpact = this.state.impactLevel.get(nodeId) || 0;

            // Find connected nodes
            const connectedNodes = this.getConnectedNodes(nodeId);

            connectedNodes.forEach(({ targetId, nodeType }) => {
                if (!this.state.affectedNodes.has(targetId)) {
                    // Calculate impact reduction
                    const impactReduction = this.calculateImpactReduction(nodeType);
                    const newImpact = currentImpact * (1 - impactReduction);

                    if (newImpact > 10) { // Only propagate if impact is significant
                        newlyAffected.add(targetId);
                        this.state.impactLevel.set(targetId, newImpact);
                        this.state.riskPath.push(targetId);
                    }
                }
            });
        });

        // Add newly affected nodes
        newlyAffected.forEach(id => this.state.affectedNodes.add(id));

        // Notify update
        if (this.onUpdate) {
            this.onUpdate(this.state, new Set(this.state.affectedNodes));
        }

        // Stop if no new nodes are affected
        if (newlyAffected.size === 0) {
            this.pause();
        }
    }

    /**
     * Get nodes connected to a given node
     */
    private getConnectedNodes(nodeId: string): Array<{ targetId: string; nodeType: CanvasNodeType }> {
        const connected: Array<{ targetId: string; nodeType: CanvasNodeType }> = [];

        this.edges.forEach(edge => {
            if (edge.source === nodeId) {
                const targetNode = this.nodes.find(n => n.id === edge.target);
                if (targetNode) {
                    connected.push({
                        targetId: edge.target,
                        nodeType: targetNode.type as CanvasNodeType
                    });
                }
            }
        });

        return connected;
    }

    /**
     * Calculate impact reduction based on node type
     * Measures reduce impact more than other node types
     */
    private calculateImpactReduction(nodeType: CanvasNodeType): number {
        switch (nodeType) {
            case 'measure':
                return 0.5; // Measures reduce impact by 50%
            case 'regulation':
                return 0.3; // Regulations reduce by 30%
            case 'process':
                return 0.1; // Processes reduce by 10%
            case 'asset':
                return 0.1; // Assets reduce by 10%
            case 'incident':
                return 0.0; // Incidents don't reduce (they are consequences)
            case 'risk':
                return 0.0; // Risks don't reduce
            default:
                return 0.2; // Default 20% reduction
        }
    }
}
