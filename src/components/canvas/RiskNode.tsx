import React from 'react';
import { Handle, Position } from 'reactflow';
import type { Risk } from '../../types';
import styles from './NodeStyles.module.css';

interface RiskNodeProps {
    data: {
        label: string;
        entityData?: Risk;
        onEdit?: () => void;
        onDelete?: () => void;
    };
    selected?: boolean;
}

export const RiskNode: React.FC<RiskNodeProps> = ({ data, selected }) => {
    return (
        <div className={`${styles.riskNode} ${selected ? styles.selected : ''}`}>
            <Handle type="target" position={Position.Left} className={styles.handle} />
            <div className={styles.nodeContent}>
                <div className={styles.nodeHeader}>
                    <span className={styles.nodeIcon}>⚠️</span>
                    <span className={styles.nodeType}>Rizik</span>
                </div>
                <div className={styles.nodeLabel}>{data.label}</div>
                {data.entityData && (
                    <div className={styles.nodeInfo}>
                        <span className={styles.riskType}>{data.entityData.type}</span>
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </div>
    );
};
