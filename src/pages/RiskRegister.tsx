import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Risk } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const RiskRegister: React.FC = () => {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getRisks();
                setRisks(data);
            } catch (error) {
                console.error('Failed to load risks', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<Risk>[] = [
        { header: 'Naziv rizika', accessor: 'name' },
        { header: 'Tip', accessor: 'type' },
        { header: 'Uzrok', accessor: 'cause' },
        {
            header: 'Financijska procjena',
            accessor: (risk) => risk.financialEstimate.toLocaleString('hr-HR', { style: 'currency', currency: 'EUR' })
        },
        {
            header: 'Reputacijski',
            accessor: (risk) => risk.reputationalRisk ? 'DA' : 'NE'
        },
        {
            header: 'Neusklađenost',
            accessor: (risk) => risk.complianceRisk ? 'DA' : 'NE'
        },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Registar rizika</h1>
                    <p className={styles.subtitle}>Pregled i upravljanje identificiranim rizicima</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Novi rizik
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={risks}
                    columns={columns}
                    onEdit={(risk) => console.log('Edit', risk)}
                    onDelete={(risk) => console.log('Delete', risk)}
                />
            )}
        </div>
    );
};
