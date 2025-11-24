import React, { useEffect, useState, useRef } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { ChatInterface } from './ChatInterface';
import { AudioVisualizer } from './AudioVisualizer';
import { Controls } from './Controls';
import { generateResponse } from '../../services/llm';
import { voiceService } from '../../services/voice';
import styles from './InterviewScreen.module.css';

export function InterviewScreen() {
    const { state, dispatch } = useInterview();
    const [isProcessing, setIsProcessing] = useState(false);
    const hasStartedRef = useRef(false);

    // Start the interview with an intro
    useEffect(() => {
        if (!hasStartedRef.current) {
            hasStartedRef.current = true;
            startTurn("Hello! I'm your AI interviewer. I've reviewed your application for the " + state.userSettings.role + " position. Shall we begin with a brief introduction about yourself?");
        }
    }, []);

    const [agentThought, setAgentThought] = useState(null);

    const startTurn = async (assistantMessage, thoughtProcess = null) => {
        // 1. Add assistant message (only the spoken part)
        if (assistantMessage) {
            dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: assistantMessage } });

            // Update thought process state for visualization
            if (thoughtProcess) {
                setAgentThought(thoughtProcess);
            }

            // 2. Speak it
            dispatch({ type: 'SET_SPEAKING', payload: true });
            voiceService.speak(assistantMessage, () => {
                dispatch({ type: 'SET_SPEAKING', payload: false });
            });
        }
    };

    const handleUserResponse = async (text) => {
        // 1. Add user message
        dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: text } });
        setIsProcessing(true);

        try {
            // 2. Get LLM response (now returns a JSON object)
            const agentOutput = await generateResponse(
                state.userSettings.apiKey,
                [...state.messages, { role: 'user', content: text }],
                state.userSettings.role,
                state.userSettings.difficulty
            );

            // 3. Start next turn with extracted response and reasoning
            await startTurn(agentOutput.response, agentOutput);
        } catch (error) {
            console.error(error);
            alert("Error generating response: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleRecording = () => {
        if (state.isRecording) {
            voiceService.stopListening();
            dispatch({ type: 'SET_RECORDING', payload: false });
        } else {
            dispatch({ type: 'SET_RECORDING', payload: true });
            voiceService.startListening(
                (transcript, isFinal) => {
                    if (isFinal) {
                        voiceService.stopListening();
                        dispatch({ type: 'SET_RECORDING', payload: false });
                        handleUserResponse(transcript);
                    }
                },
                () => dispatch({ type: 'SET_RECORDING', payload: false }),
                (error) => {
                    console.error("Voice Error", error);
                    dispatch({ type: 'SET_RECORDING', payload: false });
                }
            );
        }
    };

    const endInterview = () => {
        voiceService.cancelSpeech();
        voiceService.stopListening();
        dispatch({ type: 'END_INTERVIEW' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{state.userSettings.role} Interview</h2>
                <span className={styles.badge}>{state.userSettings.difficulty}</span>
            </div>

            <div className={`glass-panel ${styles.chatArea}`}>
                <ChatInterface messages={state.messages} />
            </div>

            {agentThought && (
                <div className={styles.thoughtPanel}>
                    <div className={styles.thoughtHeader}>
                        <span className={styles.thoughtLabel}>Agent Brain</span>
                    </div>
                    <div className={styles.thoughtContent}>
                        <p><strong>Observation:</strong> {agentThought.observation}</p>
                        <p><strong>Analysis:</strong> {agentThought.analysis}</p>
                        <p><strong>Strategy:</strong> {agentThought.strategy}</p>
                    </div>
                </div>
            )}

            <div className={styles.visualizerArea}>
                <AudioVisualizer isRecording={state.isRecording || state.isSpeaking} />
            </div>

            <Controls
                isRecording={state.isRecording}
                onToggleRecording={toggleRecording}
                onEndInterview={endInterview}
                onSendMessage={handleUserResponse}
                disabled={isProcessing || state.isSpeaking}
            />
        </div>
    );
}
