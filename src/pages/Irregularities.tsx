import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Irregularity } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const Irregularities: React.FC = () => {
    const [irregularities, setIrregularities] = useState<Irregularity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getIrregularities();
                setIrregularities(data);
            } catch (error) {
                console.error('Failed to load irregularities', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<Irregularity>[] = [
        { header: 'Prijavio', accessor: 'reportedBy' },
        { header: 'Datum prijave', accessor: 'dateFrom' },
        { header: 'Opis', accessor: 'description' },
        { header: 'Zaprimio', accessor: 'receivedBy' },
        {
            header: 'Status',
            accessor: (item) => (
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: item.status === 'Resolved' ? '#dcfce7' : '#fef9c3',
                    color: item.status === 'Resolved' ? '#166534' : '#854d0e',
                    fontSize: '0.75rem',
                    fontWeight: 600
                }}>
                    {item.status}
                </span>
            )
        },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Registar nepravilnosti</h1>
                    <p className={styles.subtitle}>Prijave i praćenje nepravilnosti</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Nova nepravilnost
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={irregularities}
                    columns={columns}
                    onEdit={(item) => console.log('Edit', item)}
                    onDelete={(item) => console.log('Delete', item)}
                />
            )}
        </div>
    );
};
