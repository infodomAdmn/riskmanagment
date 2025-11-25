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
        if (score >= 20) return '#ef4444'; // Catastrophic (Red)
        if (score >= 16) return '#ef4444'; // Catastrophic (Red) - 16 is also red in the image
        if (score >= 15) return '#f97316'; // Unacceptable (Orange) - 15 is orange
        if (score >= 10) return '#f59e0b'; // Undesirable (Yellow) - 10, 12 are yellow
        if (score >= 8) return '#f59e0b';  // Undesirable (Yellow) - 8 is yellow
        if (score >= 4) return '#84cc16';  // Acceptable (Light Green) - 4, 5, 6 are light green
        return '#22c55e';                  // Desirable (Dark Green) - 1, 2, 3 are dark green
    };

    // Helper to get data for a specific cell
    const getCellData = (prob: number, imp: number) => {
        return data.find(d => d.probability === prob && d.impact === imp);
    };

    const impactLabels = [
        { value: 5, label: 'Katastrofalan' },
        { value: 4, label: 'Značajan' },
        { value: 3, label: 'Umjeren' },
        { value: 2, label: 'Nizak' },
        { value: 1, label: 'Zanemariv' },
    ];

    const probabilityLabels = [
        { value: 1, label: 'Nevjerojatan' },
        { value: 2, label: 'Malo vjerojatan' },
        { value: 3, label: 'Povremen' },
        { value: 4, label: 'Vjerojatan' },
        { value: 5, label: 'Čest' },
    ];

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
                        {count > 0 && <span className={styles.riskCount}>{count}</span>}
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
            <div className={styles.mainLayout}>
                {/* Y-axis Labels */}
                <div className={styles.yAxisContainer}>
                    <div className={styles.yAxisTitle}>Utjecaj</div>
                    <div className={styles.yAxisLabels}>
                        {impactLabels.map(l => (
                            <div key={l.value} className={styles.axisLabelItem}>
                                <span className={styles.labelText}>{l.label}</span>
                                <span className={styles.labelValue}>{l.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.gridAndXAxis}>
                    {/* The Grid */}
                    <div className={styles.grid}>
                        {renderGrid()}
                    </div>

                    {/* X-axis Labels */}
                    <div className={styles.xAxisContainer}>
                        <div className={styles.xAxisLabels}>
                            {probabilityLabels.map(l => (
                                <div key={l.value} className={styles.xAxisLabelItem}>
                                    <span className={styles.labelValue}>{l.value}</span>
                                    <span className={styles.labelTextVertical}>{l.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.xAxisTitle}>Vjerojatnost</div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <div className={styles.legendColumn}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: '#ef4444' }}></div>
                        <span>Stop</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: '#f97316' }}></div>
                        <span>Hitna akcija</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: '#f59e0b' }}></div>
                        <span>Akcija</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: '#84cc16' }}></div>
                        <span>Praćenje</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: '#22c55e' }}></div>
                        <span>Bez akcije</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
