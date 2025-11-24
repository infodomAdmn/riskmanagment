import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Regulation } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const Regulations: React.FC = () => {
    const [regulations, setRegulations] = useState<Regulation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getRegulations();
                setRegulations(data);
            } catch (error) {
                console.error('Failed to load regulations', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<Regulation>[] = [
        { header: 'Naziv propisa', accessor: 'name' },
        { header: 'Klasifikacija', accessor: 'classification' },
        { header: 'Donositelj', accessor: 'issuingBody' },
        { header: 'Datum stupanja na snagu', accessor: 'effectiveDate' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Registar propisa</h1>
                    <p className={styles.subtitle}>Pregled zakonskih i internih propisa</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Novi propis
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={regulations}
                    columns={columns}
                    onEdit={(item) => console.log('Edit', item)}
                    onDelete={(item) => console.log('Delete', item)}
                />
            )}
        </div>
    );
};
