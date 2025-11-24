import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Project } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getProjects();
                setProjects(data);
            } catch (error) {
                console.error('Failed to load projects', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const columns: Column<Project>[] = [
        { header: 'Oznaka', accessor: 'code' },
        { header: 'Naziv projekta', accessor: 'name' },
        { header: 'Tip', accessor: 'type' },
        { header: 'Trajanje OD', accessor: 'durationFrom' },
        { header: 'Trajanje DO', accessor: 'durationTo' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Registar projekata</h1>
                    <p className={styles.subtitle}>Pregled svih projekata</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Novi projekt
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <Table
                    data={projects}
                    columns={columns}
                    onEdit={(p) => console.log('Edit', p)}
                    onDelete={(p) => console.log('Delete', p)}
                />
            )}
        </div>
    );
};
