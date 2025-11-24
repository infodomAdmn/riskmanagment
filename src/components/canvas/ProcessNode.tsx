import React from 'react';
import { Handle, Position } from 'reactflow';
import type { BusinessProcess } from '../../types';
import styles from './NodeStyles.module.css';

interface ProcessNodeProps {
    data: {
        label: string;
        entityData?: BusinessProcess;
        onEdit?: () => void;
        onDelete?: () => void;
    };
    selected?: boolean;
}

export const ProcessNode: React.FC<ProcessNodeProps> = ({ data, selected }) => {
    return (
        <div className={`${styles.processNode} ${selected ? styles.selected : ''}`}>
            <Handle type="target" position={Position.Left} className={styles.handle} />
            <div className={styles.nodeContent}>
                <div className={styles.nodeHeader}>
                    <span className={styles.nodeIcon}>⚙️</span>
                    <span className={styles.nodeType}>Proces</span>
                </div>
                <div className={styles.nodeLabel}>{data.label}</div>
                {data.entityData && (
                    <div className={styles.nodeInfo}>
                        <span className={styles.processType}>{data.entityData.type}</span>
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </div>
    );
};
