import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Asset } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const Assets: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getAssets();
                setAssets(data);
            } catch (error) {
                console.error('Failed to load assets', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<Asset>[] = [
        { header: 'Naziv imovine', accessor: 'name' },
        { header: 'Tip', accessor: 'type' },
        { header: 'Status', accessor: 'status' },
        {
            header: 'Vrijednost',
            accessor: (item) => item.value.toLocaleString('hr-HR', { style: 'currency', currency: 'EUR' })
        },
        { header: 'Org. Jedinica', accessor: 'orgUnitId' },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Registar imovine</h1>
                    <p className={styles.subtitle}>Pregled materijalne i nematerijalne imovine</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Nova imovina
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={assets}
                    columns={columns}
                    onEdit={(item) => console.log('Edit', item)}
                    onDelete={(item) => console.log('Delete', item)}
                />
            )}
        </div>
    );
};
