import React from 'react';
import { Handle, Position } from 'reactflow';
import type { MitigationMeasure } from '../../types';
import styles from './NodeStyles.module.css';

interface MeasureNodeProps {
    data: {
        label: string;
        entityData?: MitigationMeasure;
        onEdit?: () => void;
        onDelete?: () => void;
    };
    selected?: boolean;
}

export const MeasureNode: React.FC<MeasureNodeProps> = ({ data, selected }) => {
    return (
        <div className={`${styles.measureNode} ${selected ? styles.selected : ''}`}>
            <Handle type="target" position={Position.Left} className={styles.handle} />
            <div className={styles.nodeContent}>
                <div className={styles.nodeHeader}>
                    <span className={styles.nodeIcon}>🛡️</span>
                    <span className={styles.nodeType}>Mjera</span>
                </div>
                <div className={styles.nodeLabel}>{data.label}</div>
                {data.entityData && (
                    <div className={styles.nodeInfo}>
                        <span className={styles.measureStatus}>{data.entityData.status}</span>
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </div>
    );
};
