import React from 'react';
import { Handle, Position } from 'reactflow';
import type { Incident } from '../../types';
import styles from './NodeStyles.module.css';

interface IncidentNodeProps {
    data: {
        label: string;
        entityData?: Incident;
        onEdit?: () => void;
        onDelete?: () => void;
    };
    selected?: boolean;
}

export const IncidentNode: React.FC<IncidentNodeProps> = ({ data, selected }) => {
    return (
        <div className={`${styles.incidentNode} ${selected ? styles.selected : ''}`}>
            <Handle type="target" position={Position.Left} className={styles.handle} />
            <div className={styles.nodeContent}>
                <div className={styles.nodeHeader}>
                    <span className={styles.nodeIcon}>🔥</span>
                    <span className={styles.nodeType}>Incident</span>
                </div>
                <div className={styles.nodeLabel}>{data.label}</div>
                {data.entityData && (
                    <div className={styles.nodeInfo}>
                        <span className={styles.incidentDate}>
                            {new Date(data.entityData.dateFrom).toLocaleDateString('hr-HR')}
                        </span>
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </div>
    );
};
