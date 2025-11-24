import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import styles from './Controls.module.css';
import { Mic, MicOff, Square, Send, Keyboard } from 'lucide-react';

export function Controls({
    isRecording,
    onToggleRecording,
    onEndInterview,
    onSendMessage,
    disabled
}) {
    const [textMode, setTextMode] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className={`glass-panel ${styles.container}`}>
            <div className={styles.mainControls}>
                {!textMode && (
                    <button
                        className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
                        onClick={onToggleRecording}
                        disabled={disabled}
                    >
                        {isRecording ? <Mic size={32} /> : <MicOff size={32} />}
                    </button>
                )}

                {textMode && (
                    <form onSubmit={handleSubmit} className={styles.inputForm}>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your answer..."
                        />
                        <Button type="submit" disabled={!inputValue.trim() || disabled}>
                            <Send size={20} />
                        </Button>
                    </form>
                )}
            </div>

            <div className={styles.secondaryControls}>
                <button
                    className={styles.iconButton}
                    onClick={() => setTextMode(!textMode)}
                    title={textMode ? "Switch to Voice" : "Switch to Text"}
                >
                    <Keyboard size={20} />
                </button>

                <Button variant="danger" onClick={onEndInterview}>
                    <Square size={16} fill="currentColor" /> End
                </Button>
            </div>
        </div>
    );
}
