import React from 'react';
import { Handle, Position } from 'reactflow';
import type { Regulation } from '../../types';
import styles from './NodeStyles.module.css';

interface RegulationNodeProps {
    data: {
        label: string;
        entityData?: Regulation;
        onEdit?: () => void;
        onDelete?: () => void;
    };
    selected?: boolean;
}

export const RegulationNode: React.FC<RegulationNodeProps> = ({ data, selected }) => {
    return (
        <div className={`${styles.regulationNode} ${selected ? styles.selected : ''}`}>
            <Handle type="target" position={Position.Left} className={styles.handle} />
            <div className={styles.nodeContent}>
                <div className={styles.nodeHeader}>
                    <span className={styles.nodeIcon}>📜</span>
                    <span className={styles.nodeType}>Propis</span>
                </div>
                <div className={styles.nodeLabel}>{data.label}</div>
                {data.entityData && (
                    <div className={styles.nodeInfo}>
                        <span className={styles.regulationClass}>{data.entityData.classification}</span>
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </div>
    );
};
