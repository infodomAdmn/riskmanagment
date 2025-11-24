import React from 'react';
import { Handle, Position } from 'reactflow';
import type { Asset } from '../../types';
import styles from './NodeStyles.module.css';

interface AssetNodeProps {
    data: {
        label: string;
        entityData?: Asset;
        onEdit?: () => void;
        onDelete?: () => void;
    };
    selected?: boolean;
}

export const AssetNode: React.FC<AssetNodeProps> = ({ data, selected }) => {
    return (
        <div className={`${styles.assetNode} ${selected ? styles.selected : ''}`}>
            <Handle type="target" position={Position.Left} className={styles.handle} />
            <div className={styles.nodeContent}>
                <div className={styles.nodeHeader}>
                    <span className={styles.nodeIcon}>💎</span>
                    <span className={styles.nodeType}>Imovina</span>
                </div>
                <div className={styles.nodeLabel}>{data.label}</div>
                {data.entityData && (
                    <div className={styles.nodeInfo}>
                        <span className={styles.assetType}>{data.entityData.type}</span>
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </div>
    );
};
