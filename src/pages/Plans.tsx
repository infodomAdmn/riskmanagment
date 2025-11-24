import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import type { Plan, Goal } from '../types';
import { Table, type Column } from '../components/Table';
import styles from './Page.module.css';

export const Plans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [plansData, goalsData] = await Promise.all([
                    api.getPlans(),
                    api.getGoals()
                ]);
                setPlans(plansData);
                setGoals(goalsData);
            } catch (error) {
                console.error('Failed to load plans', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const planColumns: Column<Plan>[] = [
        { header: 'Naziv plana', accessor: 'name' },
        { header: 'Tip', accessor: 'type' },
        { header: 'Razdoblje', accessor: 'period' },
        { header: 'Tijelo', accessor: 'adoptingBody' },
        { header: 'Status', accessor: 'status' },
    ];

    const goalColumns: Column<Goal>[] = [
        { header: 'Cilj', accessor: 'name' },
        { header: 'Mjera', accessor: 'measure' },
        { header: 'Ciljana vrijednost', accessor: 'value' },
        { header: 'Vezani plan', accessor: (goal) => plans.find(p => p.id === goal.planId)?.name || goal.planId },
    ];

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>Planovi i ciljevi</h1>
                    <p className={styles.subtitle}>Strateški i operativni planovi</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={20} />
                    Novi plan
                </button>
            </div>

            {loading ? (
                <div>Učitavanje...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Registar planova</h3>
                        <Table
                            data={plans}
                            columns={planColumns}
                            onEdit={(item) => console.log('Edit', item)}
                            onDelete={(item) => console.log('Delete', item)}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>Registar ciljeva</h3>
                            <button className={styles.addButton} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                                <Plus size={16} />
                                Novi cilj
                            </button>
                        </div>
                        <Table
                            data={goals}
                            columns={goalColumns}
                            onEdit={(item) => console.log('Edit', item)}
                            onDelete={(item) => console.log('Delete', item)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
