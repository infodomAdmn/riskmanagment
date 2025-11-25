import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RiskHeatmap } from '../components/RiskHeatmap';
import styles from './RiskMatrixPage.module.css';

export const RiskMatrixPage: React.FC = () => {
    const [heatMapData, setHeatMapData] = useState<{ probability: number, impact: number, count: number }[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const assessments = await api.getRiskAssessments();

            // Heat map data (probability vs impact)
            const heatMap = new Map<string, number>();
            assessments.forEach(a => {
                const key = `${a.probability}-${a.impact}`;
                heatMap.set(key, (heatMap.get(key) || 0) + 1);
            });
            const heatMapArray = Array.from(heatMap.entries()).map(([key, count]) => {
                const [probability, impact] = key.split('-').map(Number);
                return { probability, impact, count };
            });
            setHeatMapData(heatMapArray);
        };
        loadData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Matrica rizika</h1>
                <p className={styles.subtitle}>Detaljan pregled distribucije rizika prema vjerojatnosti i utjecaju</p>
            </div>
            <div className={styles.content}>
                <div style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '800px' }}>
                    <RiskHeatmap data={heatMapData} />
                </div>
            </div>
        </div>
    );
};
