import React, { useEffect, useState } from 'react';
import ReactFlow, {
    type Node,
    type Edge,
    Controls,
    Background,
    MarkerType,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { api } from '../services/api';
import type { Risk } from '../types';
import styles from './Page.module.css';

const nodeStyles = {
    risk: { background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 100, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' as const, fontSize: '12px', fontWeight: 'bold', padding: '10px' },
    measure: { background: '#22c55e', color: 'white', border: '1px solid #16a34a', borderRadius: '8px', padding: '10px', minWidth: '150px' },
    incident: { background: '#f97316', color: 'white', border: '1px solid #ea580c', borderRadius: '8px', padding: '10px', minWidth: '150px' },
    process: { background: '#3b82f6', color: 'white', border: '1px solid #2563eb', borderRadius: '8px', padding: '10px', minWidth: '150px' },
    asset: { background: '#a855f7', color: 'white', border: '1px solid #9333ea', borderRadius: '8px', padding: '10px', minWidth: '150px' },
    regulation: { background: '#64748b', color: 'white', border: '1px solid #475569', borderRadius: '8px', padding: '10px', minWidth: '150px' },
    assessment: { background: '#eab308', color: 'black', border: '1px solid #ca8a04', borderRadius: '8px', padding: '10px', minWidth: '150px' },
};

export const RiskCanvas: React.FC = () => {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [selectedRiskId, setSelectedRiskId] = useState<string>('');
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const loadRisks = async () => {
            const data = await api.getRisks();
            setRisks(data);
            if (data.length > 0) {
                setSelectedRiskId(data[0].id);
            }
        };
        loadRisks();
    }, []);

    useEffect(() => {
        if (!selectedRiskId) return;

        const loadGraphData = async () => {
            const risk = risks.find(r => r.id === selectedRiskId);
            if (!risk) return;

            const [measures, incidents, assessments, processes, assets, regulations] = await Promise.all([
                api.getMitigationMeasures(),
                api.getIncidents(),
                api.getRiskAssessments(),
                api.getProcesses(),
                api.getAssets(),
                api.getRegulations()
            ]);

            const newNodes: Node[] = [];
            const newEdges: Edge[] = [];

            // Central Risk Node
            newNodes.push({
                id: 'risk-center',
                type: 'default',
                data: { label: risk.name },
                position: { x: 400, y: 300 },
                style: nodeStyles.risk,
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            });

            const addEntity = (id: string, label: string, type: keyof typeof nodeStyles, x: number, y: number, labelPrefix: string = '') => {
                newNodes.push({
                    id,
                    data: { label: `${labelPrefix}${label}` },
                    position: { x, y },
                    style: nodeStyles[type],
                    sourcePosition: x < 400 ? Position.Right : Position.Left,
                    targetPosition: x < 400 ? Position.Left : Position.Right,
                });

                newEdges.push({
                    id: `e-${id}`,
                    source: x < 400 ? id : 'risk-center',
                    target: x < 400 ? 'risk-center' : id,
                    animated: true,
                    style: { stroke: '#94a3b8' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                });
            };

            // Connected Measures (Right side)
            const riskMeasures = measures.filter(m => m.riskId === risk.id);
            riskMeasures.forEach((m, i) => {
                addEntity(m.id, m.name, 'measure', 700, 100 + (i * 120), 'Mjera: ');
            });

            // Connected Incidents (Right side, below measures)
            const riskIncidents = incidents.filter(i => i.riskId === risk.id);
            riskIncidents.forEach((inc, i) => {
                addEntity(inc.id, inc.eventDescription, 'incident', 700, 100 + ((riskMeasures.length + i) * 120), 'Incident: ');
            });

            // Connected Process (Left side)
            if (risk.processId) {
                const process = processes.find(p => p.id === risk.processId);
                if (process) {
                    addEntity(process.id, process.name, 'process', 100, 100, 'Proces: ');
                }
            }

            // Connected Asset (Left side)
            if (risk.assetId) {
                const asset = assets.find(a => a.id === risk.assetId);
                if (asset) {
                    addEntity(asset.id, asset.name, 'asset', 100, 250, 'Imovina: ');
                }
            }

            // Connected Regulation (Left side)
            if (risk.regulationId) {
                const regulation = regulations.find(r => r.id === risk.regulationId);
                if (regulation) {
                    addEntity(regulation.id, regulation.name, 'regulation', 100, 400, 'Propis: ');
                }
            }

            // Latest Assessment (Bottom)
            const riskAssessments = assessments.filter(a => a.riskId === risk.id);
            if (riskAssessments.length > 0) {
                const latest = riskAssessments[0];
                newNodes.push({
                    id: latest.id,
                    data: { label: `Procjena: ${latest.riskLevel}` },
                    position: { x: 400, y: 500 },
                    style: nodeStyles.assessment,
                    sourcePosition: Position.Top,
                    targetPosition: Position.Top,
                });
                newEdges.push({
                    id: `e-${latest.id}`,
                    source: 'risk-center',
                    target: latest.id,
                    style: { stroke: '#eab308', strokeWidth: 2 },
                });
            }

            setNodes(newNodes);
            setEdges(newEdges);
        };

        loadGraphData();
    }, [selectedRiskId, risks]);

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <div className={styles.header} style={{ marginBottom: '1rem' }}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Mapa rizika</h1>
                    <p className={styles.subtitle}>Vizualni prikaz povezanosti rizika</p>
                </div>
                <select
                    value={selectedRiskId}
                    onChange={(e) => setSelectedRiskId(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border-color)',
                        fontSize: '1rem',
                        minWidth: '300px'
                    }}
                >
                    {risks.map(risk => (
                        <option key={risk.id} value={risk.id}>{risk.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '0.5rem', background: '#f8fafc' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
};
