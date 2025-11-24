import React from 'react';
import styles from './Input.module.css';

export function Input({ label, value, onChange, placeholder, type = 'text', required = false }) {
    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={styles.input}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

export function Select({ label, value, onChange, options }) {
    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            <select className={styles.select} value={value} onChange={onChange}>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
