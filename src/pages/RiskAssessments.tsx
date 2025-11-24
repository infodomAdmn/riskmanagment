import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { RiskAssessment } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const RiskAssessments: React.FC = () => {
    const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getRiskAssessments();
                setAssessments(data);
            } catch (error) {
                console.error('Failed to load assessments', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<RiskAssessment>[] = [
        { header: 'ID Rizika', accessor: 'riskId' },
        { header: 'Razdoblje OD', accessor: 'periodFrom' },
        { header: 'Razdoblje DO', accessor: 'periodTo' },
        { header: 'Vjerojatnost', accessor: 'probability' },
        { header: 'Utjecaj', accessor: 'impact' },
        {
            header: 'Razina rizika',
            accessor: (item) => (
                <span style={{
                    fontWeight: 'bold',
                    color: item.riskLevel > 12 ? 'var(--danger-color)' : item.riskLevel > 8 ? 'var(--warning-color)' : 'var(--success-color)'
                }}>
                    {item.riskLevel}
                </span>
            )
        },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Procjene rizika</h1>
                    <p className={styles.subtitle}>Povijest i status procjena rizika</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Nova procjena
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={assessments}
                    columns={columns}
                    onEdit={(item) => console.log('Edit', item)}
                    onDelete={(item) => console.log('Delete', item)}
                />
            )}
        </div>
    );
};
