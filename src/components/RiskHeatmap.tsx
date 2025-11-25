import React from 'react';
import styles from './RiskHeatmap.module.css';

interface HeatmapDataPoint {
    probability: number; // 1-5
    impact: number; // 1-5
    count: number;
}

interface RiskHeatmapProps {
    data: HeatmapDataPoint[];
    fullScreen?: boolean;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ data, fullScreen = false }) => {
    // Helper to get color based on risk score (prob * impact)
    const getCellColor = (prob: number, imp: number) => {
        const score = prob * imp;
        if (score >= 20) return '#ef4444'; // Critical (Red)
        if (score >= 12) return '#f97316'; // High (Orange)
        if (score >= 6) return '#f59e0b';  // Medium (Yellow)
        return '#10b981';                  // Low (Green)
    };

    // Helper to get data for a specific cell
    const getCellData = (prob: number, imp: number) => {
        return data.find(d => d.probability === prob && d.impact === imp);
    };

    // Generate grid cells (5x5)
    // Rows are Impact (5 down to 1), Cols are Probability (1 to 5)
    const renderGrid = () => {
        const grid = [];
        for (let impact = 5; impact >= 1; impact--) {
            for (let prob = 1; prob <= 5; prob++) {
                const cellData = getCellData(prob, impact);
                const count = cellData?.count || 0;
                const color = getCellColor(prob, impact);

                grid.push(
                    <div
                        key={`${prob}-${impact}`}
                        className={styles.cell}
                        style={{ backgroundColor: color }}
                    >
                        {count > 0 && count}
                        {count > 0 && (
                            <div className={styles.tooltip}>
                                Vjerojatnost: {prob}<br />
                                Utjecaj: {impact}<br />
                                Broj rizika: {count}
                            </div>
                        )}
                    </div>
                );
            }
        }
        return grid;
    };

    return (
        <div className={`${styles.container} ${fullScreen ? styles.fullScreen : ''}`}>
            <div className={styles.gridContainer}>
                <div className={styles.yAxisLabel}>Utjecaj</div>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div className={styles.yAxisTicks}>
                        <span>5</span>
                        <span>4</span>
                        <span>3</span>
                        <span>2</span>
                        <span>1</span>
                    </div>

                    <div className={styles.grid}>
                        {renderGrid()}
                    </div>
                </div>

                <div className={styles.xAxisLabel}>Vjerojatnost</div>
            </div>

            <div className={styles.xAxisTicks} style={{ paddingLeft: fullScreen ? '3rem' : '2rem', maxWidth: fullScreen ? 'none' : '500px' }}>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
                    <span>Nizak (1-5)</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#f59e0b' }}></div>
                    <span>Srednji (6-10)</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#f97316' }}></div>
                    <span>Visok (12-16)</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#ef4444' }}></div>
                    <span>Kritičan (20-25)</span>
                </div>
            </div>
        </div>
    );
};
