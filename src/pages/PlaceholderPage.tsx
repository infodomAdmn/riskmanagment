import React from 'react';
import styles from './Page.module.css';

interface PlaceholderPageProps {
    title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>Ova funkcionalnost je u pripremi.</p>
                </div>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                Sadržaj za {title} će biti ovdje.
            </div>
        </div>
    );
};
