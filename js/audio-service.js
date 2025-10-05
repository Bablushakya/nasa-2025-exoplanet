/**
 * Audio Service for ExoPlanet AI Enhanced
 * Handles text-to-speech, audio narration, and voice interactions
 */

class AudioService {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.voices = [];
        this.currentUtterance = null;
        this.isPlaying = false;
        this.settings = CONFIG.AUDIO.VOICE_SETTINGS;
        this.welcomePlayed = false;

        if (this.isSupported) {
            this.initializeVoices();
        }
    }

    /**
     * Initialize available voices
     */
    initializeVoices() {
        const loadVoices = () => {
            this.voices = speechSynthesis.getVoices();
            if (this.voices.length === 0) {
                // Voices not loaded yet, try again
                setTimeout(loadVoices, 100);
            }
        };

        loadVoices();

        // Handle voice changes
        speechSynthesis.onvoiceschanged = loadVoices;
    }

    /**
     * Get the best available voice for the specified language
     */
    getBestVoice(lang = 'en-US') {
        if (!this.voices.length) return null;

        // Prefer female voices for better accessibility
        const preferredVoices = this.voices.filter(voice =>
            voice.lang.startsWith(lang.split('-')[0]) &&
            (voice.name.toLowerCase().includes('female') ||
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('susan'))
        );

        if (preferredVoices.length > 0) {
            return preferredVoices[0];
        }

        // Fallback to any voice in the language
        const langVoices = this.voices.filter(voice =>
            voice.lang.startsWith(lang.split('-')[0])
        );

        return langVoices.length > 0 ? langVoices[0] : this.voices[0];
    }

    /**
     * Speak text with customizable options
     */
    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('Speech synthesis not supported');
            return Promise.reject(new Error('Speech synthesis not supported'));
        }

        return new Promise((resolve, reject) => {
            // Stop any current speech
            this.stop();

            const utterance = new SpeechSynthesisUtterance(text);

            // Apply settings
            utterance.rate = options.rate || this.settings.rate;
            utterance.pitch = options.pitch || this.settings.pitch;
            utterance.volume = options.volume || this.settings.volume;
            utterance.lang = options.lang || this.settings.lang;

            // Set voice
            const voice = this.getBestVoice(utterance.lang);
            if (voice) {
                utterance.voice = voice;
            }

            // Event handlers
            utterance.onstart = () => {
                this.isPlaying = true;
                this.currentUtterance = utterance;
                if (options.onStart) options.onStart();
            };

            utterance.onend = () => {
                this.isPlaying = false;
                this.currentUtterance = null;
                if (options.onEnd) options.onEnd();
                resolve();
            };

            utterance.onerror = (event) => {
                this.isPlaying = false;
                this.currentUtterance = null;
                console.error('Speech synthesis error:', event);
                if (options.onError) options.onError(event);
                reject(event);
            };

            utterance.onpause = () => {
                if (options.onPause) options.onPause();
            };

            utterance.onresume = () => {
                if (options.onResume) options.onResume();
            };

            // Start speaking
            speechSynthesis.speak(utterance);
        });
    }

    /**
     * Stop current speech
     */
    stop() {
        if (this.isSupported && this.isPlaying) {
            speechSynthesis.cancel();
            this.isPlaying = false;
            this.currentUtterance = null;
        }
    }

    /**
     * Pause current speech
     */
    pause() {
        if (this.isSupported && this.isPlaying) {
            speechSynthesis.pause();
        }
    }

    /**
     * Resume paused speech
     */
    resume() {
        if (this.isSupported) {
            speechSynthesis.resume();
        }
    }

    /**
     * Play welcome message
     */
    async playWelcomeMessage(customMessage = null) {
        if (this.welcomePlayed && !customMessage) {
            return; // Don't repeat welcome unless explicitly requested
        }

        const message = customMessage || CONFIG.AUDIO.WELCOME_MESSAGE;

        try {
            await this.speak(message, {
                rate: 0.85,
                onStart: () => {
                    this.showAudioIndicator('Welcome Message Playing...');
                },
                onEnd: () => {
                    this.hideAudioIndicator();
                    this.welcomePlayed = true;
                }
            });
        } catch (error) {
            console.error('Failed to play welcome message:', error);
        }
    }

    /**
     * Create audio controls for any text element
     */
    createAudioControls(textElement, options = {}) {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'audio-controls';

        const speakButton = document.createElement('button');
        speakButton.className = 'audio-btn speak-btn';
        speakButton.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
        speakButton.title = 'Listen to this content';

        const stopButton = document.createElement('button');
        stopButton.className = 'audio-btn stop-btn';
        stopButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
        stopButton.title = 'Stop audio';
        stopButton.style.display = 'none';

        // Event listeners
        speakButton.addEventListener('click', async () => {
            const text = textElement.textContent || textElement.innerText;
            if (!text.trim()) return;

            speakButton.style.display = 'none';
            stopButton.style.display = 'inline-block';

            try {
                await this.speak(text, {
                    ...options,
                    onEnd: () => {
                        speakButton.style.display = 'inline-block';
                        stopButton.style.display = 'none';
                        if (options.onEnd) options.onEnd();
                    },
                    onError: () => {
                        speakButton.style.display = 'inline-block';
                        stopButton.style.display = 'none';
                    }
                });
            } catch (error) {
                speakButton.style.display = 'inline-block';
                stopButton.style.display = 'none';
            }
        });

        stopButton.addEventListener('click', () => {
            this.stop();
            speakButton.style.display = 'inline-block';
            stopButton.style.display = 'none';
        });

        controlsContainer.appendChild(speakButton);
        controlsContainer.appendChild(stopButton);

        return controlsContainer;
    }

    /**
     * Add audio controls to elements with specific class
     */
    addAudioControlsToElements(selector = '.audio-enabled') {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            if (!element.querySelector('.audio-controls')) {
                const controls = this.createAudioControls(element);
                element.appendChild(controls);
            }
        });
    }

    /**
     * Show audio indicator
     */
    showAudioIndicator(message = 'Audio Playing...') {
        let indicator = document.getElementById('audio-indicator');

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'audio-indicator';
            indicator.className = 'audio-indicator';
            document.body.appendChild(indicator);
        }

        indicator.innerHTML = `
            <div class="audio-indicator-content">
                <i class="fas fa-volume-up audio-icon"></i>
                <span class="audio-message">${message}</span>
                <button class="audio-stop-btn" onclick="audioService.stop()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        indicator.style.display = 'block';
    }

    /**
     * Hide audio indicator
     */
    hideAudioIndicator() {
        const indicator = document.getElementById('audio-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    /**
     * Speak exoplanet analysis with enhanced formatting
     */
    async speakExoplanetAnalysis(analysis, exoplanetName) {
        const formattedText = this.formatTextForSpeech(analysis);
        const introText = `Here's an AI analysis of the exoplanet ${exoplanetName}. `;

        try {
            await this.speak(introText + formattedText, {
                rate: 0.8,
                onStart: () => {
                    this.showAudioIndicator(`Speaking analysis of ${exoplanetName}...`);
                },
                onEnd: () => {
                    this.hideAudioIndicator();
                }
            });
        } catch (error) {
            console.error('Failed to speak analysis:', error);
        }
    }

    /**
     * Format text for better speech synthesis
     */
    formatTextForSpeech(text) {
        return text
            .replace(/\d+\.\s/g, '') // Remove numbered lists
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
            .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
            .replace(/\n\n+/g, '. ') // Replace paragraph breaks with pauses
            .replace(/\n/g, ', ') // Replace line breaks with commas
            .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure pauses between sentences
            .trim();
    }

    /**
     * Get audio settings for user customization
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Update audio settings
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };

        // Save to localStorage
        localStorage.setItem('audioSettings', JSON.stringify(this.settings));
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const saved = localStorage.getItem('audioSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.error('Failed to load audio settings:', error);
            }
        }
    }

    /**
     * Check if audio is supported and enabled
     */
    isAudioEnabled() {
        return this.isSupported && CONFIG.AUDIO.SPEECH_ENABLED;
    }

    /**
     * Get available voices for user selection
     */
    getAvailableVoices() {
        return this.voices.map(voice => ({
            name: voice.name,
            lang: voice.lang,
            gender: this.detectVoiceGender(voice.name)
        }));
    }

    /**
     * Detect voice gender from name (heuristic)
     */
    detectVoiceGender(voiceName) {
        const femaleNames = ['female', 'woman', 'samantha', 'karen', 'susan', 'victoria', 'allison'];
        const maleNames = ['male', 'man', 'alex', 'daniel', 'tom', 'fred'];

        const name = voiceName.toLowerCase();

        if (femaleNames.some(n => name.includes(n))) return 'female';
        if (maleNames.some(n => name.includes(n))) return 'male';

        return 'unknown';
    }
}

// Create global instance
window.audioService = new AudioService();

// Load saved settings on initialization
window.audioService.loadSettings();