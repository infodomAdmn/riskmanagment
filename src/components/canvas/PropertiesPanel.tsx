import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CanvasNodeType } from '../../types';
import styles from './PropertiesPanel.module.css';

interface PropertiesPanelProps {
    nodeId: string;
    nodeType: CanvasNodeType;
    nodeData: any;
    onClose: () => void;
    onSave: (nodeId: string, data: any) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    nodeId,
    nodeType,
    nodeData,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState<any>(nodeData?.entityData || {});
    const [label, setLabel] = useState(nodeData?.label || '');

    useEffect(() => {
        setFormData(nodeData?.entityData || {});
        setLabel(nodeData?.label || '');
    }, [nodeData, nodeId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(nodeId, { label, entityData: formData });
        onClose();
    };

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const renderFormFields = () => {
        switch (nodeType) {
            case 'risk':
                return (
                    <>
                        <div className={styles.field}>
                            <label>Naziv rizika</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Opis</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Tip rizika</label>
                            <select
                                value={formData.type || 'Operational'}
                                onChange={(e) => handleChange('type', e.target.value)}
                            >
                                <option value="Strategic">Strategic</option>
                                <option value="Operational">Operational</option>
                                <option value="Financial">Financial</option>
                                <option value="Compliance">Compliance</option>
                                <option value="Reputational">Reputational</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Uzrok</label>
                            <textarea
                                value={formData.cause || ''}
                                onChange={(e) => handleChange('cause', e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Financijska procjena (EUR)</label>
                            <input
                                type="number"
                                value={formData.financialEstimate || 0}
                                onChange={(e) => handleChange('financialEstimate', parseFloat(e.target.value))}
                            />
                        </div>
                    </>
                );

            case 'process':
                return (
                    <>
                        <div className={styles.field}>
                            <label>Naziv procesa</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Tip procesa</label>
                            <select
                                value={formData.type || 'Process'}
                                onChange={(e) => handleChange('type', e.target.value)}
                            >
                                <option value="Process">Process</option>
                                <option value="Subprocess">Subprocess</option>
                                <option value="Activity">Activity</option>
                            </select>
                        </div>
                    </>
                );

            case 'asset':
                return (
                    <>
                        <div className={styles.field}>
                            <label>Naziv imovine</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Tip</label>
                            <input
                                type="text"
                                value={formData.type || ''}
                                onChange={(e) => handleChange('type', e.target.value)}
                                placeholder="npr. Physical, Software"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Vrijednost (EUR)</label>
                            <input
                                type="number"
                                value={formData.value || 0}
                                onChange={(e) => handleChange('value', parseFloat(e.target.value))}
                            />
                        </div>
                    </>
                );

            case 'measure':
                return (
                    <>
                        <div className={styles.field}>
                            <label>Naziv mjere</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Opis</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Status</label>
                            <select
                                value={formData.status || 'Planned'}
                                onChange={(e) => handleChange('status', e.target.value)}
                            >
                                <option value="Planned">Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Implemented">Implemented</option>
                                <option value="Delayed">Delayed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Rok</label>
                            <input
                                type="date"
                                value={formData.deadline || ''}
                                onChange={(e) => handleChange('deadline', e.target.value)}
                            />
                        </div>
                    </>
                );

            case 'incident':
                return (
                    <>
                        <div className={styles.field}>
                            <label>Opis događaja</label>
                            <textarea
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                rows={2}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Datum od</label>
                            <input
                                type="date"
                                value={formData.dateFrom || ''}
                                onChange={(e) => handleChange('dateFrom', e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Datum do</label>
                            <input
                                type="date"
                                value={formData.dateTo || ''}
                                onChange={(e) => handleChange('dateTo', e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Financijska posljedica (EUR)</label>
                            <input
                                type="number"
                                value={formData.financialConsequence || 0}
                                onChange={(e) => handleChange('financialConsequence', parseFloat(e.target.value))}
                            />
                        </div>
                    </>
                );

            case 'regulation':
                return (
                    <>
                        <div className={styles.field}>
                            <label>Naziv propisa</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Klasifikacija</label>
                            <input
                                type="text"
                                value={formData.classification || ''}
                                onChange={(e) => handleChange('classification', e.target.value)}
                                placeholder="npr. Zakon, Uredba"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Datum stupanja na snagu</label>
                            <input
                                type="date"
                                value={formData.effectiveDate || ''}
                                onChange={(e) => handleChange('effectiveDate', e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Tijelo koje izdaje</label>
                            <input
                                type="text"
                                value={formData.issuingBody || ''}
                                onChange={(e) => handleChange('issuingBody', e.target.value)}
                            />
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h3>Uredi čvor</h3>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {renderFormFields()}

                <div className={styles.actions}>
                    <button type="button" onClick={onClose} className={styles.cancelButton}>
                        Odustani
                    </button>
                    <button type="submit" className={styles.saveButton}>
                        Spremi
                    </button>
                </div>
            </form>
        </div>
    );
};
