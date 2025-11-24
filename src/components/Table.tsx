import React from 'react';
import styles from './Table.module.css';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    width?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export function Table<T extends { id: string }>({ data, columns, onEdit, onDelete }: TableProps<T>) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={styles.th} style={{ width: col.width }}>
                                {col.header}
                            </th>
                        ))}
                        {(onEdit || onDelete) && <th className={styles.th} style={{ width: '100px' }}>Akcije</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className={styles.tr}>
                            {columns.map((col, index) => (
                                <td key={index} className={styles.td}>
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className={styles.td}>
                                    <div className={styles.actions}>
                                        {onEdit && (
                                            <button className={styles.actionButton} onClick={() => onEdit(item)}>
                                                Uredi
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button className={styles.actionButton} onClick={() => onDelete(item)}>
                                                Obriši
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className={styles.td} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Nema podataka
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
