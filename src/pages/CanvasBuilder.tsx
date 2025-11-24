import React, { useState, useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
    type Node,
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    type Connection,
    MarkerType,
    type NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';

import { RiskNode } from '../components/canvas/RiskNode';
import { ProcessNode } from '../components/canvas/ProcessNode';
import { AssetNode } from '../components/canvas/AssetNode';
import { MeasureNode } from '../components/canvas/MeasureNode';
import { IncidentNode } from '../components/canvas/IncidentNode';
import { RegulationNode } from '../components/canvas/RegulationNode';
import { CanvasToolbar } from '../components/canvas/CanvasToolbar';
import { PropertiesPanel } from '../components/canvas/PropertiesPanel';
import { SimulationControls } from '../components/canvas/SimulationControls';
import { SimulationEngine } from '../services/simulationEngine';

import type { CanvasNodeType, SimulationState } from '../types';
import styles from './CanvasBuilder.module.css';

export const CanvasBuilder: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [simulationState, setSimulationState] = useState<SimulationState>({
        isRunning: false,
        speed: 1,
        currentStep: 0,
        affectedNodes: new Set(),
        riskPath: [],
        impactLevel: new Map()
    });
    const [affectedNodeIds, setAffectedNodeIds] = useState<Set<string>>(new Set());

    const simulationEngine = useRef<SimulationEngine | null>(null);
    const nodeIdCounter = useRef(0);

    // Define custom node types
    const nodeTypes: NodeTypes = useMemo(() => ({
        risk: RiskNode,
        process: ProcessNode,
        asset: AssetNode,
        measure: MeasureNode,
        incident: IncidentNode,
        regulation: RegulationNode
    }), []);

    // Handle edge connection
    const onConnect = useCallback(
        (params: Connection) => {
            const edge = {
                ...params,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#94a3b8', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }
            };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );

    // Add new node
    const handleAddNode = useCallback((type: CanvasNodeType) => {
        const id = `${type}-${++nodeIdCounter.current}`;
        const position = {
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100
        };

        const newNode: Node = {
            id,
            type,
            position,
            data: {
                label: `Novi ${getNodeLabel(type)}`,
                type,
                entityData: {}
            }
        };

        setNodes((nds) => [...nds, newNode]);
    }, [setNodes]);

    // Handle node click
    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

    // Handle pane click (deselect node)
    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    // Save node data from properties panel
    const handleSaveNodeData = useCallback((nodeId: string, data: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            )
        );
    }, [setNodes]);

    // Save canvas state
    const handleSave = useCallback(() => {
        const canvasState = {
            nodes: nodes.map(n => ({
                id: n.id,
                type: n.type as CanvasNodeType,
                position: n.position,
                data: n.data
            })),
            edges: edges.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target,
                type: e.type
            }))
        };

        localStorage.setItem('canvasBuilder', JSON.stringify(canvasState));
        alert('Canvas spremljen!');
    }, [nodes, edges]);

    // Load canvas state
    const handleLoad = useCallback(() => {
        const saved = localStorage.getItem('canvasBuilder');
        if (saved) {
            try {
                const canvasState = JSON.parse(saved);
                setNodes(canvasState.nodes || []);
                setEdges(canvasState.edges || []);
                alert('Canvas učitan!');
            } catch (error) {
                alert('Greška pri učitavanju canvasa');
            }
        } else {
            alert('Nema spremljenog canvasa');
        }
    }, [setNodes, setEdges]);

    // Clear canvas
    const handleClear = useCallback(() => {
        if (confirm('Jeste li sigurni da želite očistiti cijeli canvas?')) {
            setNodes([]);
            setEdges([]);
            setSelectedNode(null);
            if (simulationEngine.current) {
                simulationEngine.current.stop();
            }
            setSimulationState({
                isRunning: false,
                speed: 1,
                currentStep: 0,
                affectedNodes: new Set(),
                riskPath: [],
                impactLevel: new Map()
            });
            setAffectedNodeIds(new Set());
        }
    }, [setNodes, setEdges]);

    // Start simulation
    const handleStartSimulation = useCallback(() => {
        // Debug: Log all nodes to see their structure
        console.log('All nodes:', nodes);
        console.log('Node types:', nodes.map(n => ({ id: n.id, type: n.type, dataType: n.data?.type })));

        // Find a risk node to start from - check both node.type and node.data.type
        const riskNode = nodes.find(n => n.type === 'risk' || n.data?.type === 'risk');

        console.log('Found risk node:', riskNode);

        if (!riskNode) {
            alert('Dodajte barem jedan rizik čvor za simulaciju!');
            return;
        }

        simulationEngine.current = new SimulationEngine(nodes, edges);
        simulationEngine.current.initialize(riskNode.id);

        simulationEngine.current.start((state, affected) => {
            setSimulationState(state);
            setAffectedNodeIds(new Set(affected));
        });
    }, [nodes, edges]);

    // Pause simulation
    const handlePauseSimulation = useCallback(() => {
        simulationEngine.current?.pause();
        setSimulationState(prev => ({ ...prev, isRunning: false }));
    }, []);

    // Stop simulation
    const handleStopSimulation = useCallback(() => {
        simulationEngine.current?.stop();
        setSimulationState({
            isRunning: false,
            speed: 1,
            currentStep: 0,
            affectedNodes: new Set(),
            riskPath: [],
            impactLevel: new Map()
        });
        setAffectedNodeIds(new Set());
    }, []);

    // Change simulation speed
    const handleSpeedChange = useCallback((speed: number) => {
        simulationEngine.current?.setSpeed(speed);
        setSimulationState(prev => ({ ...prev, speed }));
    }, []);

    // Toggle simulation
    const handleToggleSimulation = useCallback(() => {
        if (simulationState.isRunning) {
            handlePauseSimulation();
        } else {
            handleStartSimulation();
        }
    }, [simulationState.isRunning, handlePauseSimulation, handleStartSimulation]);

    // Apply simulation styling to affected nodes
    const styledNodes = useMemo(() => {
        return nodes.map(node => {
            if (affectedNodeIds.has(node.id)) {
                return {
                    ...node,
                    className: 'nodeAffected'
                };
            }
            return node;
        });
    }, [nodes, affectedNodeIds]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Canvas Builder</h1>
                    <p className={styles.subtitle}>Interaktivno kreiranje i povezivanje rizika</p>
                </div>
            </div>

            <CanvasToolbar
                onAddNode={handleAddNode}
                onSave={handleSave}
                onLoad={handleLoad}
                onClear={handleClear}
                onToggleSimulation={handleToggleSimulation}
                isSimulationRunning={simulationState.isRunning}
            />

            <div className={styles.infoBox}>
                <h4 className={styles.infoTitle}>ℹ️ Kako koristiti Canvas Builder</h4>
                <ul className={styles.infoList}>
                    <li><strong>Dodavanje čvorova:</strong> Kliknite na gumbe iznad (Rizik, Proces, itd.) za dodavanje čvorova na canvas</li>
                    <li><strong>Povezivanje:</strong> Povucite iz male točke na rubu jednog čvora do drugog čvora za kreiranje veze</li>
                    <li><strong>Uređivanje:</strong> Kliknite na čvor da otvorite panel za uređivanje podataka</li>
                    <li><strong>Simulacija:</strong> Prikazuje kako se rizik propagira kroz povezane čvorove. Utjecaj se smanjuje kroz svaki sloj - mjere reduciraju za 50%, propisi za 30%, procesi i imovina za 10%</li>
                </ul>
            </div>

            {simulationState.isRunning && (
                <SimulationControls
                    isRunning={simulationState.isRunning}
                    speed={simulationState.speed}
                    currentStep={simulationState.currentStep}
                    affectedNodesCount={affectedNodeIds.size}
                    onPlay={handleStartSimulation}
                    onPause={handlePauseSimulation}
                    onStop={handleStopSimulation}
                    onSpeedChange={handleSpeedChange}
                />
            )}

            <div className={styles.canvasWrapper}>
                <ReactFlow
                    nodes={styledNodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    fitView
                    snapToGrid
                    snapGrid={[15, 15]}
                >
                    <Background gap={15} size={1} />
                    <Controls />
                    <MiniMap zoomable pannable />
                </ReactFlow>

                {selectedNode && (
                    <PropertiesPanel
                        nodeId={selectedNode.id}
                        nodeType={selectedNode.type as CanvasNodeType}
                        nodeData={selectedNode.data}
                        onClose={() => setSelectedNode(null)}
                        onSave={handleSaveNodeData}
                    />
                )}
            </div>
        </div>
    );
};

// Helper function to get node label
function getNodeLabel(type: CanvasNodeType): string {
    const labels: Record<CanvasNodeType, string> = {
        risk: 'Rizik',
        process: 'Proces',
        asset: 'Imovina',
        measure: 'Mjera',
        incident: 'Incident',
        regulation: 'Propis'
    };
    return labels[type];
}
