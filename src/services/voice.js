// Utilities for Web Speech API

export class VoiceService {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false; // We want to stop after each sentence/turn
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
        } else {
            console.warn("Speech Recognition not supported in this browser.");
        }
    }

    startListening(onResult, onEnd, onError) {
        if (!this.recognition) return;
        if (this.isListening) {
            console.warn("Recognition already started");
            return;
        }

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            const isFinal = event.results[0].isFinal;
            onResult(transcript, isFinal);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (onEnd) onEnd();
        };

        this.recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                // Ignore no-speech errors, just stop listening
                return;
            }
            console.error("Speech recognition error", event.error);
            if (onError) onError(event.error);
        };

        try {
            this.recognition.start();
            this.isListening = true;
        } catch (e) {
            if (e.name === 'InvalidStateError') {
                console.warn("Recognition already active, ignoring start request");
                this.isListening = true; // Sync state just in case
            } else {
                console.error("Failed to start recognition:", e);
                if (onError) onError(e);
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    speak(text, onEnd) {
        if (!this.synthesis) return;

        // Cancel any current speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to find a good voice
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
            if (onEnd) onEnd();
        };

        this.synthesis.speak(utterance);
    }

    cancelSpeech() {
        this.synthesis.cancel();
    }
}

export const voiceService = new VoiceService();
