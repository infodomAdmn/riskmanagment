import React from 'react';
import { Plus, Save, FolderOpen, Play, Trash2 } from 'lucide-react';
import type { CanvasNodeType } from '../../types';
import styles from './CanvasToolbar.module.css';

interface CanvasToolbarProps {
    onAddNode: (type: CanvasNodeType) => void;
    onSave: () => void;
    onLoad: () => void;
    onClear: () => void;
    onToggleSimulation: () => void;
    isSimulationRunning: boolean;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
    onAddNode,
    onSave,
    onLoad,
    onClear,
    onToggleSimulation,
    isSimulationRunning
}) => {
    const nodeTypes: { type: CanvasNodeType; label: string; icon: string }[] = [
        { type: 'risk', label: 'Rizik', icon: '⚠️' },
        { type: 'process', label: 'Proces', icon: '⚙️' },
        { type: 'asset', label: 'Imovina', icon: '💎' },
        { type: 'measure', label: 'Mjera', icon: '🛡️' },
        { type: 'incident', label: 'Incident', icon: '🔥' },
        { type: 'regulation', label: 'Propis', icon: '📜' }
    ];

    return (
        <div className={styles.toolbar}>
            <div className={styles.section}>
                <span className={styles.sectionLabel}>Dodaj čvor:</span>
                <div className={styles.buttonGroup}>
                    {nodeTypes.map(({ type, label, icon }) => (
                        <button
                            key={type}
                            onClick={() => onAddNode(type)}
                            className={styles.addButton}
                            title={`Dodaj ${label}`}
                        >
                            <span className={styles.icon}>{icon}</span>
                            <span className={styles.label}>{label}</span>
                            <Plus size={14} />
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={onToggleSimulation}
                        className={`${styles.actionButton} ${isSimulationRunning ? styles.active : ''}`}
                        title={isSimulationRunning ? 'Zaustavi simulaciju' : 'Pokreni simulaciju - prikazuje propagaciju rizika kroz povezane čvorove'}
                    >
                        <Play size={16} />
                        {isSimulationRunning ? 'Zaustavi' : 'Simulacija'}
                    </button>

                    <button onClick={onSave} className={styles.actionButton} title="Spremi canvas">
                        <Save size={16} />
                        Spremi
                    </button>

                    <button onClick={onLoad} className={styles.actionButton} title="Učitaj canvas">
                        <FolderOpen size={16} />
                        Učitaj
                    </button>

                    <button onClick={onClear} className={styles.actionButton} title="Očisti canvas">
                        <Trash2 size={16} />
                        Očisti
                    </button>
                </div>
            </div>
        </div>
    );
};
