import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { MitigationMeasure } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const MitigationMeasures: React.FC = () => {
    const [measures, setMeasures] = useState<MitigationMeasure[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getMitigationMeasures();
                setMeasures(data);
            } catch (error) {
                console.error('Failed to load measures', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<MitigationMeasure>[] = [
        { header: 'Naziv mjere', accessor: 'name' },
        { header: 'Opis', accessor: 'description' },
        { header: 'Rok', accessor: 'deadline' }, // Should format date
        { header: 'Status', accessor: 'status' },
        { header: 'Dokumentacija', accessor: 'documentationMethod' },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Registar mjera</h1>
                    <p className={styles.subtitle}>Mjere za ublažavanje rizika</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Nova mjera
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={measures}
                    columns={columns}
                    onEdit={(m) => console.log('Edit', m)}
                    onDelete={(m) => console.log('Delete', m)}
                />
            )}
        </div>
    );
};
