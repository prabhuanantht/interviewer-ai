import { createContext, useContext, useReducer, useEffect } from 'react';

const InterviewContext = createContext();

const initialState = {
    userSettings: {
        apiKey: localStorage.getItem('ipp_api_key') || '',
        role: '',
        difficulty: 'Intermediate', // Beginner, Intermediate, Expert
    },
    interviewStatus: 'setup', // setup, active, feedback
    messages: [], // { role: 'user' | 'assistant', content: '' }
    feedback: null, // { score, strengths, weaknesses }
    isRecording: false,
    isSpeaking: false,
};

function interviewReducer(state, action) {
    switch (action.type) {
        case 'SET_API_KEY':
            localStorage.setItem('ipp_api_key', action.payload);
            return { ...state, userSettings: { ...state.userSettings, apiKey: action.payload } };
        case 'START_INTERVIEW':
            return {
                ...state,
                interviewStatus: 'active',
                userSettings: { ...state.userSettings, ...action.payload },
                messages: []
            };
        case 'END_INTERVIEW':
            return { ...state, interviewStatus: 'feedback' };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'SET_FEEDBACK':
            return { ...state, feedback: action.payload };
        case 'SET_RECORDING':
            return { ...state, isRecording: action.payload };
        case 'SET_SPEAKING':
            return { ...state, isSpeaking: action.payload };
        case 'RESET':
            return { ...initialState, userSettings: { ...state.userSettings } }; // Keep settings
        default:
            return state;
    }
}

export function InterviewProvider({ children }) {
    const [state, dispatch] = useReducer(interviewReducer, initialState);

    return (
        <InterviewContext.Provider value={{ state, dispatch }}>
            {children}
        </InterviewContext.Provider>
    );
}

export function useInterview() {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider');
    }
    return context;
}
