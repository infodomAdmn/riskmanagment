import React, { useState, useEffect } from 'react';
import {
    Shield,
    Activity,
    AlertTriangle,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    Clock
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    ScatterChart,
    Scatter,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ZAxis
} from 'recharts';
import { api } from '../services/api';
import type { Risk, Incident, MitigationMeasure } from '../types';
import styles from './Dashboard.module.css';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        risks: 0,
        incidents: 0,
        measures: 0,
        projects: 0,
        highRisks: 0,
        complianceRisks: 0,
        totalExposure: 0,
        avgRiskLevel: 0
    });

    const [riskTypeData, setRiskTypeData] = useState<{ name: string, value: number }[]>([]);
    const [riskLevelData, setRiskLevelData] = useState<{ name: string, level: number }[]>([]);
    const [heatMapData, setHeatMapData] = useState<{ probability: number, impact: number, count: number, z: number }[]>([]);
    const [measureStatus, setMeasureStatus] = useState<{ name: string, value: number, color: string }[]>([]);
    const [recentActivity, setRecentActivity] = useState<{ type: string, title: string, date: string, severity: string }[]>([]);
    const [trendData, setTrendData] = useState<{ month: string, risks: number, incidents: number }[]>([]);

    useEffect(() => {
        const loadStats = async () => {
            const [risks, incidents, measures, projects, assessments] = await Promise.all([
                api.getRisks(),
                api.getIncidents(),
                api.getMitigationMeasures(),
                api.getProjects(),
                api.getRiskAssessments()
            ]);

            // Calculate enhanced statistics
            const highRisks = assessments.filter(a => a.riskLevel >= 12).length;
            const complianceRisks = risks.filter(r => r.complianceRisk).length;
            const totalExposure = risks.reduce((sum, r) => sum + r.financialEstimate, 0);
            const avgRiskLevel = assessments.length > 0
                ? assessments.reduce((sum, a) => sum + a.riskLevel, 0) / assessments.length
                : 0;

            setStats({
                risks: risks.length,
                incidents: incidents.length,
                measures: measures.length,
                projects: projects.length,
                highRisks,
                complianceRisks,
                totalExposure,
                avgRiskLevel
            });

            // Risk type distribution
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

            // Heat map data (probability vs impact)
            const heatMap = new Map<string, number>();
            assessments.forEach(a => {
                const key = `${a.probability}-${a.impact}`;
                heatMap.set(key, (heatMap.get(key) || 0) + 1);
            });
            const heatMapArray = Array.from(heatMap.entries()).map(([key, count]) => {
                const [probability, impact] = key.split('-').map(Number);
                return { probability, impact, count, z: count * 100 };
            });
            setHeatMapData(heatMapArray);

            // Measure status distribution
            const statusCount = measures.reduce((acc, m) => {
                acc[m.status] = (acc[m.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const statusColors: Record<string, string> = {
                'Implemented': '#10b981',
                'In Progress': '#3b82f6',
                'Planned': '#f59e0b',
                'Delayed': '#ef4444',
                'Cancelled': '#6b7280'
            };

            setMeasureStatus(
                Object.entries(statusCount).map(([name, value]) => ({
                    name,
                    value,
                    color: statusColors[name] || '#6b7280'
                }))
            );

            // Recent activity timeline
            const activities: { type: string, title: string, date: string, severity: string }[] = [];

            incidents.forEach((inc: Incident) => {
                const risk = risks.find((r: Risk) => r.id === inc.riskId);
                activities.push({
                    type: 'incident',
                    title: risk?.name || 'Nepoznat rizik',
                    date: inc.dateFrom,
                    severity: inc.financialConsequence > 1000 ? 'high' : 'medium'
                });
            });

            measures.slice(0, 5).forEach((m: MitigationMeasure) => {
                activities.push({
                    type: 'measure',
                    title: m.name,
                    date: m.deadline,
                    severity: m.status === 'Delayed' ? 'high' : 'low'
                });
            });

            setRecentActivity(activities.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            ).slice(0, 6));

            // Trend data (mock - in real app, this would be historical data)
            setTrendData([
                { month: 'Siječanj', risks: 8, incidents: 2 },
                { month: 'Veljača', risks: 10, incidents: 1 },
                { month: 'Ožujak', risks: 9, incidents: 3 },
                { month: 'Travanj', risks: 12, incidents: 2 },
                { month: 'Svibanj', risks: 11, incidents: 1 },
                { month: 'Lipanj', risks: risks.length, incidents: incidents.length }
            ]);
        };
        loadStats();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('hr-HR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const getRiskLevelColor = (level: number) => {
        if (level >= 15) return '#dc2626';
        if (level >= 12) return '#ef4444';
        if (level >= 8) return '#f97316';
        if (level >= 4) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Nadzorna ploča</h1>
                <p className={styles.subtitle}>Pregled ključnih pokazatelja sustava upravljanja rizicima</p>
            </div>

            {/* Main KPI Cards */}
            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Shield className={styles.cardIcon} style={{ color: '#3b82f6' }} />
                        <span className={styles.cardTitle}>Ukupno rizika</span>
                    </div>
                    <span className={styles.cardValue}>{stats.risks}</span>
                    <div className={styles.cardFooter}>
                        <TrendingUp size={16} style={{ color: '#10b981' }} />
                        <span className={styles.cardTrend}>+2 ovaj mjesec</span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <AlertTriangle className={styles.cardIcon} style={{ color: '#ef4444' }} />
                        <span className={styles.cardTitle}>Visoki rizici</span>
                    </div>
                    <span className={styles.cardValue}>{stats.highRisks}</span>
                    <div className={styles.cardFooter}>
                        <AlertCircle size={16} style={{ color: '#ef4444' }} />
                        <span className={styles.cardTrend}>Zahtijevaju pažnju</span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <CheckCircle2 className={styles.cardIcon} style={{ color: '#10b981' }} />
                        <span className={styles.cardTitle}>Aktivne mjere</span>
                    </div>
                    <span className={styles.cardValue}>{stats.measures}</span>
                    <div className={styles.cardFooter}>
                        <Target size={16} style={{ color: '#10b981' }} />
                        <span className={styles.cardTrend}>{Math.round((stats.measures / stats.risks) * 100)}% pokrivenost</span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Activity className={styles.cardIcon} style={{ color: '#f59e0b' }} />
                        <span className={styles.cardTitle}>Incidenti</span>
                    </div>
                    <span className={styles.cardValue}>{stats.incidents}</span>
                    <div className={styles.cardFooter}>
                        <TrendingDown size={16} style={{ color: '#10b981' }} />
                        <span className={styles.cardTrend}>-15% u odnosu na prošli mjesec</span>
                    </div>
                </div>
            </div>

            {/* Financial & Compliance Row */}
            <div className={styles.financialGrid}>
                <div className={`${styles.card} ${styles.financialCard}`}>
                    <div className={styles.cardHeader}>
                        <DollarSign className={styles.cardIcon} style={{ color: '#10b981' }} />
                        <span className={styles.cardTitle}>Ukupna financijska izloženost</span>
                    </div>
                    <span className={styles.cardValue} style={{ fontSize: '1.75rem' }}>
                        {formatCurrency(stats.totalExposure)}
                    </span>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '65%', backgroundColor: '#10b981' }}></div>
                    </div>
                    <span className={styles.cardSubtext}>65% pokriveno mjerama</span>
                </div>

                <div className={`${styles.card} ${styles.complianceCard}`}>
                    <div className={styles.cardHeader}>
                        <Shield className={styles.cardIcon} style={{ color: '#8b5cf6' }} />
                        <span className={styles.cardTitle}>Usklađenost s propisima</span>
                    </div>
                    <span className={styles.cardValue}>{stats.complianceRisks}</span>
                    <span className={styles.cardSubtext}>rizika vezanih uz compliance</span>
                    <div className={styles.complianceBadges}>
                        <span className={styles.badge} style={{ backgroundColor: '#10b981' }}>GDPR ✓</span>
                        <span className={styles.badge} style={{ backgroundColor: '#f59e0b' }}>ISO 27001 ⏳</span>
                    </div>
                </div>

                <div className={`${styles.card} ${styles.avgRiskCard}`}>
                    <div className={styles.cardHeader}>
                        <Target className={styles.cardIcon} style={{ color: getRiskLevelColor(stats.avgRiskLevel) }} />
                        <span className={styles.cardTitle}>Prosječna razina rizika</span>
                    </div>
                    <span className={styles.cardValue} style={{ color: getRiskLevelColor(stats.avgRiskLevel) }}>
                        {stats.avgRiskLevel.toFixed(1)}
                    </span>
                    <div className={styles.riskGauge}>
                        <div className={styles.gaugeFill} style={{
                            width: `${(stats.avgRiskLevel / 25) * 100}%`,
                            backgroundColor: getRiskLevelColor(stats.avgRiskLevel)
                        }}></div>
                    </div>
                    <span className={styles.cardSubtext}>Cilj: {'<'} 8.0</span>
                </div>
            </div>

            {/* Charts Grid */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>
                        <Activity size={20} style={{ marginRight: '8px' }} />
                        Trend rizika i incidenata
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="risks" name="Rizici" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="incidents" name="Incidenti" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>
                        <AlertTriangle size={20} style={{ marginRight: '8px' }} />
                        Matrica rizika (Vjerojatnost vs Utjecaj)
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    type="number"
                                    dataKey="probability"
                                    name="Vjerojatnost"
                                    domain={[0, 6]}
                                    stroke="#6b7280"
                                />
                                <YAxis
                                    type="number"
                                    dataKey="impact"
                                    name="Utjecaj"
                                    domain={[0, 6]}
                                    stroke="#6b7280"
                                />
                                <ZAxis type="number" dataKey="z" range={[100, 1000]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Rizici" data={heatMapData} fill="#ef4444" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>
                        <Shield size={20} style={{ marginRight: '8px' }} />
                        Rizici po vrsti
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={riskTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string, percent?: number }) =>
                                        `${name || ''} ${(percent ? percent * 100 : 0).toFixed(0)}%`
                                    }
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
                    <h3 className={styles.chartTitle}>
                        <CheckCircle2 size={20} style={{ marginRight: '8px' }} />
                        Status mjera ublažavanja
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={measureStatus} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis type="category" dataKey="name" width={120} stroke="#6b7280" />
                                <Tooltip />
                                <Bar dataKey="value" name="Broj mjera">
                                    {measureStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Critical Risks & Recent Activity */}
            <div className={styles.bottomGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>
                        <AlertCircle size={20} style={{ marginRight: '8px', color: '#ef4444' }} />
                        Top 5 najkritičnijih rizika
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={riskLevelData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="level" name="Razina rizika" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>
                        <Clock size={20} style={{ marginRight: '8px' }} />
                        Nedavna aktivnost
                    </h3>
                    <div className={styles.activityTimeline}>
                        {recentActivity.map((activity, index) => (
                            <div key={index} className={styles.activityItem}>
                                <div className={`${styles.activityDot} ${styles[`severity-${activity.severity}`]}`}></div>
                                <div className={styles.activityContent}>
                                    <div className={styles.activityTitle}>
                                        {activity.type === 'incident' ? '🔴' : '🛡️'} {activity.title}
                                    </div>
                                    <div className={styles.activityDate}>
                                        {new Date(activity.date).toLocaleDateString('hr-HR')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
