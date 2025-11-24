import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Incident } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const Incidents: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getIncidents();
                setIncidents(data);
            } catch (error) {
                console.error('Failed to load incidents', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<Incident>[] = [
        { header: 'ID Rizika', accessor: 'riskId' },
        { header: 'Datum', accessor: 'dateFrom' },
        { header: 'Opis događaja', accessor: 'eventDescription' },
        { header: 'Posljedica', accessor: 'consequenceDescription' },
        {
            header: 'Financijska šteta',
            accessor: (item) => item.financialConsequence.toLocaleString('hr-HR', { style: 'currency', currency: 'EUR' })
        },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Registar incidenata</h1>
                    <p className={styles.subtitle}>Evidencija ostvarenih rizika i incidenata</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Prijavi incident
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={incidents}
                    columns={columns}
                    onEdit={(item) => console.log('Edit', item)}
                    onDelete={(item) => console.log('Delete', item)}
                />
            )}
        </div>
    );
};
