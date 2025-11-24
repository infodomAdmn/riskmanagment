import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import styles from './Dashboard.module.css';
import { api } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        risks: 0,
        incidents: 0,
        measures: 0,
        projects: 0
    });

    const [riskTypeData, setRiskTypeData] = useState<{ name: string, value: number }[]>([]);
    const [riskLevelData, setRiskLevelData] = useState<{ name: string, level: number }[]>([]);

    useEffect(() => {
        const loadStats = async () => {
            const [risks, incidents, measures, projects, assessments] = await Promise.all([
                api.getRisks(),
                api.getIncidents(),
                api.getMitigationMeasures(),
                api.getProjects(),
                api.getRiskAssessments()
            ]);

            setStats({
                risks: risks.length,
                incidents: incidents.length,
                measures: measures.length,
                projects: projects.length
            });

            // Prepare chart data
            const typeCount = risks.reduce((acc, risk) => {
                acc[risk.type] = (acc[risk.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            setRiskTypeData(Object.entries(typeCount).map(([name, value]) => ({ name, value })));

            // Top 5 risks by level
            const topRisks = assessments
                .sort((a, b) => b.riskLevel - a.riskLevel)
                .slice(0, 5)
                .map(a => {
                    const risk = risks.find(r => r.id === a.riskId);
                    return {
                        name: risk?.name.substring(0, 20) + '...' || 'Unknown',
                        level: a.riskLevel
                    };
                });

            setRiskLevelData(topRisks);
        };
        loadStats();
    }, []);

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Nadzorna ploča</h1>
                <p className={styles.subtitle}>Pregled ključnih pokazatelja sustava upravljanja rizicima</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <span className={styles.cardTitle}>Ukupno rizika</span>
                    <span className={styles.cardValue}>{stats.risks}</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.cardTitle}>Aktivne mjere</span>
                    <span className={styles.cardValue}>{stats.measures}</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.cardTitle}>Prijavljeni incidenti</span>
                    <span className={styles.cardValue}>{stats.incidents}</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.cardTitle}>Aktivni projekti</span>
                    <span className={styles.cardValue}>{stats.projects}</span>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Rizici po vrsti</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={riskTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string, percent?: number }) => `${name || ''} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {riskTypeData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Top 5 najkritičnijih rizika</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={riskLevelData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="level" name="Razina rizika" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
