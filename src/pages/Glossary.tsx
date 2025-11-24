import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { GlossaryTerm } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const Glossary: React.FC = () => {
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getGlossary();
                setTerms(data);
            } catch (error) {
                console.error('Failed to load glossary', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<GlossaryTerm>[] = [
        { header: 'Pojam', accessor: 'term', width: '200px' },
        { header: 'Objašnjenje', accessor: 'explanation' },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Rječnik pojmova</h1>
                    <p className={styles.subtitle}>Definicije ključnih pojmova sustava</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Novi pojam
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={terms}
                    columns={columns}
                    onEdit={(item) => console.log('Edit', item)}
                    onDelete={(item) => console.log('Delete', item)}
                />
            )}
        </div>
    );
};
