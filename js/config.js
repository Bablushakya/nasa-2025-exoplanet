/**
 * Configuration for ExoPlanet AI Enhanced
 * NASA & Google Gemini API Integration
 */

const CONFIG = {
    // API Configuration
    NASA_API: {
        BASE_URL: 'https://api.nasa.gov',
        API_KEY: 'OyiVQJCms9JiO36lyV9iGD56Gfhcx3ZX7oQiEXyy',
        ENDPOINTS: {
            EXOPLANET_ARCHIVE: '/planetary/exoplanet/PS/ps.json',
            APOD: '/planetary/apod',
            NEO: '/neo/rest/v1/feed',
            MARS_WEATHER: '/insight_weather/',
            EARTH_IMAGERY: '/planetary/earth/imagery'
        }
    },
    
    GEMINI_API: {
        API_KEY: 'AIzaSyCegaaD-LnnpopMb56d9ZqUl9QNRyccnTY',
        BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
        MODEL: 'gemini-pro'
    },
    
    // Audio Configuration (DISABLED)
    AUDIO: {
        WELCOME_ENABLED: false,
        SPEECH_ENABLED: false,
        VOICE_SETTINGS: {
            rate: 0.9,
            pitch: 1.0,
            volume: 0.8,
            lang: 'en-US'
        },
        WELCOME_MESSAGE: ''
    },
    
    // Application Settings
    APP: {
        NAME: 'ExoPlanet AI Enhanced',
        VERSION: '2.0.0',
        DESCRIPTION: 'NASA & Gemini AI Integration Platform',
        BACKEND_URL: 'http://localhost:8001',
        FRONTEND_URL: 'http://localhost:3000'
    },
    
    // Feature Flags
    FEATURES: {
        REAL_TIME_NASA_DATA: true,
        GEMINI_ANALYSIS: true,
        AUDIO_NARRATION: false,
        VOICE_COMMANDS: false,
        OFFLINE_MODE: false
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}