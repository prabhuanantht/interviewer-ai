import React, { useState } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { Button } from '../UI/Button';
import { Input, Select } from '../UI/Input';
import { Modal } from '../UI/Modal';
import styles from './SetupScreen.module.css';
import { Mic, Info } from 'lucide-react';

export function SetupScreen() {
    const { state, dispatch } = useInterview();
    const [role, setRole] = useState(state.userSettings.role || 'Software Engineer');
    const [difficulty, setDifficulty] = useState(state.userSettings.difficulty);
    const [apiKey, setApiKey] = useState(state.userSettings.apiKey);
    const [showApiHelp, setShowApiHelp] = useState(false);

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

                <div className={styles.apiKeyInputWrapper}>
                    <Input
                        label={
                            <span className={styles.labelWithIcon}>
                                Gemini API Key
                                <button
                                    className={styles.infoButton}
                                    onClick={() => setShowApiHelp(true)}
                                    title="How to get an API Key"
                                >
                                    <Info size={14} />
                                </button>
                            </span>
                        }
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        type="password"
                    />
                </div>

                <div className={styles.actions}>
                    <Button onClick={handleStart} className={styles.startButton}>
                        Start Interview
                    </Button>
                </div>

                <p className={styles.disclaimer}>
                    Your API key is stored locally in your browser.
                </p>
                <p className={styles.disclaimer}>
                    Made by <a href="https://ananthprabhut.vercel.app" target="_blank" rel="noopener noreferrer">Ananth</a>
                </p>
            </div>

            <Modal
                isOpen={showApiHelp}
                onClose={() => setShowApiHelp(false)}
                title="How to get a Gemini API Key"
            >
                <ol className={styles.helpList}>
                    <li>
                        Go to <a href="https://aistudio.google.com/app/api-keys" target="_blank" rel="noopener noreferrer" className={styles.link}>Google AI Studio</a>.
                    </li>
                    <li>Click on <strong>Create API key</strong>.</li>
                    <li>Select <strong>Create API key in new project</strong> (or select an existing one).</li>
                    <li>Copy the generated key and paste it here.</li>
                </ol>
                <div className={styles.modalNote}>
                    <p>Note: The API is free for personal use within rate limits.</p>
                </div>
            </Modal>
        </div>
    );
}
