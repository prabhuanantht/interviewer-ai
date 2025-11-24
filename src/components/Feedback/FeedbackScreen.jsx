import React, { useEffect, useState } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { generateFeedback } from '../../services/llm';
import { Button } from '../UI/Button';
import styles from './FeedbackScreen.module.css';
import { Trophy, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export function FeedbackScreen() {
    const { state, dispatch } = useInterview();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);

    useEffect(() => {
        async function fetchFeedback() {
            const data = await generateFeedback(
                state.userSettings.apiKey,
                state.messages,
                state.userSettings.role
            );
            setReport(data);
            dispatch({ type: 'SET_FEEDBACK', payload: data });
            setLoading(false);
        }
        fetchFeedback();
    }, []);

    const handleRestart = () => {
        dispatch({ type: 'RESET' });
    };

    if (loading) {
        return (
            <div className={`glass-panel ${styles.container} ${styles.loading}`}>
                <div className={styles.spinner}></div>
                <p>Generating your interview report...</p>
            </div>
        );
    }

    return (
        <div className={`glass-panel ${styles.container}`}>
            <div className={styles.header}>
                <Trophy size={48} color="var(--accent-warning)" />
                <h1>Interview Complete</h1>
                <div className={styles.score}>
                    <span className={styles.scoreValue}>{report.score}</span>
                    <span className={styles.scoreLabel}>/ 100</span>
                </div>
            </div>

            <div className={styles.section}>
                <h3><CheckCircle size={20} color="var(--accent-success)" /> Strengths</h3>
                <ul>
                    {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>

            <div className={styles.section}>
                <h3><AlertTriangle size={20} color="var(--accent-error)" /> Areas for Improvement</h3>
                <ul>
                    {report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
            </div>

            <div className={styles.summary}>
                <h3>Summary</h3>
                <p>{report.summary}</p>
            </div>

            <Button onClick={handleRestart} className={styles.restartButton}>
                <RefreshCw size={20} /> Start New Interview
            </Button>
        </div>
    );
}
