import React from 'react';
import { Play, Pause, Square, Gauge } from 'lucide-react';
import styles from './SimulationControls.module.css';

interface SimulationControlsProps {
    isRunning: boolean;
    speed: number;
    currentStep: number;
    affectedNodesCount: number;
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
    onSpeedChange: (speed: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
    isRunning,
    speed,
    currentStep,
    affectedNodesCount,
    onPlay,
    onPause,
    onStop,
    onSpeedChange
}) => {
    return (
        <div className={styles.controls}>
            <div className={styles.header}>
                <h3>Simulacija propagacije rizika</h3>
                <div className={styles.status}>
                    <span className={`${styles.indicator} ${isRunning ? styles.running : ''}`} />
                    {isRunning ? 'Aktivna' : 'Pauzirana'}
                </div>
            </div>

            <div className={styles.infoBox}>
                <p className={styles.infoText}>
                    <strong>Kako radi:</strong> Simulacija prikazuje kako se rizik širi kroz povezane čvorove.
                    Utjecaj se smanjuje kroz svaki sloj propagacije.
                    Mjere ublažavanja reduciraju utjecaj za 50%, propisi za 30%, dok procesi i imovina smanjuju za 10%.
                </p>
            </div>

            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Korak:</span>
                    <span className={styles.statValue}>{currentStep}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Pogođeni čvorovi:</span>
                    <span className={styles.statValue}>{affectedNodesCount}</span>
                </div>
            </div>

            <div className={styles.buttons}>
                {!isRunning ? (
                    <button onClick={onPlay} className={styles.playButton}>
                        <Play size={18} />
                        Pokreni
                    </button>
                ) : (
                    <button onClick={onPause} className={styles.pauseButton}>
                        <Pause size={18} />
                        Pauziraj
                    </button>
                )}
                <button onClick={onStop} className={styles.stopButton}>
                    <Square size={18} />
                    Zaustavi
                </button>
            </div>

            <div className={styles.speedControl}>
                <div className={styles.speedLabel}>
                    <Gauge size={16} />
                    <span>Brzina simulacije</span>
                </div>
                <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={speed}
                    onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                    className={styles.speedSlider}
                />
                <span className={styles.speedValue}>{speed}x</span>
            </div>
        </div>
    );
};
