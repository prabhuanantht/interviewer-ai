import React, { useState } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { Button } from '../UI/Button';
import { Input, Select } from '../UI/Input';
import styles from './SetupScreen.module.css';
import { Mic, Settings } from 'lucide-react';

export function SetupScreen() {
    const { state, dispatch } = useInterview();
    const [role, setRole] = useState(state.userSettings.role || 'Software Engineer');
    const [difficulty, setDifficulty] = useState(state.userSettings.difficulty);
    const [apiKey, setApiKey] = useState(state.userSettings.apiKey);

    const handleStart = () => {
        if (!apiKey) {
            alert('Please enter a Gemini API Key to proceed.');
            return;
        }
        dispatch({ type: 'SET_API_KEY', payload: apiKey });
        dispatch({
            type: 'START_INTERVIEW',
            payload: { role, difficulty }
        });
    };

    return (
        <div className={`glass-panel ${styles.container}`}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Mic size={32} color="var(--color-primary)" />
                </div>
                <h1>Interview Partner</h1>
                <p className={styles.subtitle}>Practice your interview skills with AI</p>
            </div>

            <div className={styles.form}>
                <Input
                    label="Target Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Product Manager, Sales Rep"
                />

                <Select
                    label="Difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    options={[
                        { value: 'Beginner', label: 'Beginner' },
                        { value: 'Intermediate', label: 'Intermediate' },
                        { value: 'Expert', label: 'Expert' },
                    ]}
                />

                <Input
                    label="Gemini API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    type="password"
                />

                <div className={styles.actions}>
                    <Button onClick={handleStart} className={styles.startButton}>
                        Start Interview
                    </Button>
                </div>

                <p className={styles.disclaimer}>
                    Your API key is stored locally in your browser.
                </p>
            </div>
        </div>
    );
}
