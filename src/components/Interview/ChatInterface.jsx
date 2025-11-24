import React, { useEffect, useRef } from 'react';
import styles from './ChatInterface.module.css';

export function ChatInterface({ messages }) {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={styles.container}>
            {messages.length === 0 && (
                <div className={styles.emptyState}>
                    <p>The interview is starting...</p>
                </div>
            )}

            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}
                >
                    <div className={styles.bubble}>
                        {msg.content}
                    </div>
                </div>
            ))}
            <div ref={endRef} />
        </div>
    );
}
