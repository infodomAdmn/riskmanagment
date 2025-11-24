import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Authority } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const Authorities: React.FC = () => {
    const [authorities, setAuthorities] = useState<Authority[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getAuthorities();
                setAuthorities(data);
            } catch (error) {
                console.error('Failed to load authorities', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<Authority>[] = [
        { header: 'Naziv ovlasti', accessor: 'name' },
        { header: 'Tip', accessor: 'type' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Registar ovlasti</h1>
                    <p className={styles.subtitle}>Upravljanje ovlastima i zaduženjima</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Nova ovlast
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={authorities}
                    columns={columns}
                    onEdit={(item) => console.log('Edit', item)}
                    onDelete={(item) => console.log('Delete', item)}
                />
            )}
        </div>
    );
};
