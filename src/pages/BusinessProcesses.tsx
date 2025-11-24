import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { BusinessProcess } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const BusinessProcesses: React.FC = () => {
    const [processes, setProcesses] = useState<BusinessProcess[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getProcesses();
                setProcesses(data);
            } catch (error) {
                console.error('Failed to load processes', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<BusinessProcess>[] = [
        { header: 'Naziv procesa', accessor: 'name' },
        { header: 'Vrsta', accessor: 'type' },
        { header: 'Vlasnik (Org. jedinica)', accessor: 'ownerOrgUnitId' }, // In real app, map ID to name
        { header: 'Nadređeni proces', accessor: (item) => item.parentProcessId || '-' },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Poslovni procesi</h1>
                    <p className={styles.subtitle}>Katalog poslovnih procesa</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Novi proces
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={processes}
                    columns={columns}
                    onEdit={(item) => console.log('Edit', item)}
                    onDelete={(item) => console.log('Delete', item)}
                />
            )}
        </div>
    );
};
