/**
 * Enhanced Integration Service
 * Combines NASA API and Gemini AI features (Audio Disabled)
 */

class EnhancedIntegrationService {
    constructor() {
        this.nasaAPI = window.nasaAPI;
        this.geminiAPI = window.geminiAPI;
        this.cache = new Map();
        this.isInitialized = false;
    }

    /**
     * Initialize the enhanced integration system
     */
    async initialize() {
        try {
            console.log('🚀 Initializing ExoPlanet AI Enhanced...');
            
            // Check API availability
            await this.checkAPIStatus();
            
            // Audio features disabled
            console.log('🔇 Audio features are disabled');
            
            // Initialize enhanced features
            this.initializeEnhancedFeatures();
            
            this.isInitialized = true;
            console.log('✅ ExoPlanet AI Enhanced initialized successfully');
            
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to initialize Enhanced Integration:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Check API status and connectivity
     */
    async checkAPIStatus() {
        const status = {
            nasa: false,
            gemini: false,
            audio: false
        };

        try {
            // Test NASA API
            const nasaTest = await this.nasaAPI.getAPOD();
            status.nasa = nasaTest.success;
        } catch (error) {
            console.warn('NASA API test failed:', error);
        }

        try {
            // Test Gemini API
            const geminiTest = await this.geminiAPI.generateContent('Test connection', { maxTokens: 10 });
            status.gemini = geminiTest.success;
        } catch (error) {
            console.warn('Gemini API test failed:', error);
        }

        // Test Audio
        status.audio = this.audioService.isAudioEnabled();

        this.apiStatus = status;
        return status;
    }

    /**
     * Play enhanced welcome message with AI generation
     */
    async playEnhancedWelcome() {
        try {
            // Try to generate a personalized welcome with Gemini
            const welcomeResult = await this.geminiAPI.generateWelcomeMessage({
                platform: 'ExoPlanet AI Enhanced',
                features: ['NASA data integration', 'AI analysis', 'audio narration']
            });

            const message = welcomeResult.success ? 
                welcomeResult.message : 
                CONFIG.AUDIO.WELCOME_MESSAGE;

            await this.audioService.playWelcomeMessage(message);
        } catch (error) {
            console.error('Failed to play enhanced welcome:', error);
            // Fallback to default welcome
            await this.audioService.playWelcomeMessage();
        }
    }

    /**
     * Get enhanced exoplanet data with AI analysis
     */
    async getEnhancedExoplanetData(filters = {}, includeAnalysis = true) {
        try {
            // Get NASA data
            const nasaResult = await this.nasaAPI.getExoplanets(50, filters);
            
            if (!nasaResult.success) {
                throw new Error('Failed to fetch NASA data');
            }

            const enhancedData = {
                ...nasaResult,
                aiInsights: null,
                audioReady: true
            };

            // Add AI analysis if requested
            if (includeAnalysis && this.apiStatus.gemini) {
                try {
                    const analysisResult = await this.geminiAPI.analyzeNASAData(
                        nasaResult.exoplanets.slice(0, 10), // Analyze first 10 for performance
                        'trends'
                    );
                    
                    if (analysisResult.success) {
                        enhancedData.aiInsights = analysisResult.insights;
                    }
                } catch (error) {
                    console.warn('AI analysis failed:', error);
                }
            }

            return enhancedData;
        } catch (error) {
            console.error('Failed to get enhanced exoplanet data:', error);
            return {
                success: false,
                error: error.message,
                exoplanets: []
            };
        }
    }

    /**
     * Analyze specific exoplanet with full AI integration
     */
    async analyzeExoplanetWithAI(exoplanetName) {
        try {
            // Search for the exoplanet in NASA data
            const searchResult = await this.nasaAPI.searchExoplanets(exoplanetName, 'name');
            
            if (!searchResult.success || searchResult.results.length === 0) {
                throw new Error(`Exoplanet "${exoplanetName}" not found in NASA database`);
            }

            const exoplanet = searchResult.results[0];
            
            // Get AI analysis
            const analysisResult = await this.geminiAPI.analyzeExoplanet(exoplanet);
            
            if (!analysisResult.success) {
                throw new Error('AI analysis failed');
            }

            return {
                success: true,
                exoplanet: exoplanet,
                analysis: analysisResult.analysis,
                audioReady: true,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Exoplanet analysis failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate and speak problem explanations
     */
    async explainProblem(problemType, context = {}, speakAloud = true) {
        try {
            // Generate explanation with Gemini
            const explanationResult = await this.geminiAPI.generateProblemExplanation(problemType, context);
            
            if (!explanationResult.success) {
                throw new Error('Failed to generate explanation');
            }

            const result = {
                success: true,
                explanation: explanationResult.explanation,
                problemType: problemType,
                audioReady: true
            };

            // Speak the explanation if requested
            if (speakAloud && this.audioService.isAudioEnabled()) {
                await this.audioService.speak(explanationResult.explanation, {
                    rate: 0.8,
                    onStart: () => {
                        this.audioService.showAudioIndicator(`Explaining: ${problemType}`);
                    },
                    onEnd: () => {
                        this.audioService.hideAudioIndicator();
                    }
                });
            }

            return result;
        } catch (error) {
            console.error('Problem explanation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create interactive learning module
     */
    async createLearningModule(topic, level = 'intermediate') {
        try {
            // Generate educational content
            const contentResult = await this.geminiAPI.generateEducationalContent(topic, level);
            
            if (!contentResult.success) {
                throw new Error('Failed to generate educational content');
            }

            // Generate quiz questions
            const quizResult = await this.geminiAPI.generateQuiz(topic, level, 5);

            return {
                success: true,
                content: contentResult.content,
                quiz: quizResult.success ? quizResult.quiz : [],
                topic: topic,
                level: level,
                audioReady: true,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Learning module creation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get real-time space data dashboard
     */
    async getRealTimeSpaceDashboard() {
        try {
            const dashboardData = {
                timestamp: new Date().toISOString(),
                data: {},
                insights: null
            };

            // Fetch multiple NASA data sources
            const [apodResult, neoResult, exoplanetStats] = await Promise.allSettled([
                this.nasaAPI.getAPOD(),
                this.nasaAPI.getNearEarthObjects(),
                this.nasaAPI.getDiscoveryStatistics()
            ]);

            // Process results
            if (apodResult.status === 'fulfilled' && apodResult.value.success) {
                dashboardData.data.apod = apodResult.value.data[0];
            }

            if (neoResult.status === 'fulfilled' && neoResult.value.success) {
                dashboardData.data.nearEarthObjects = neoResult.value.data;
            }

            if (exoplanetStats.status === 'fulfilled' && exoplanetStats.value.success) {
                dashboardData.data.exoplanetStats = exoplanetStats.value.statistics;
            }

            // Generate AI insights about the dashboard data
            if (this.apiStatus.gemini) {
                try {
                    const insightsResult = await this.geminiAPI.analyzeNASAData(dashboardData.data, 'general');
                    if (insightsResult.success) {
                        dashboardData.insights = insightsResult.insights;
                    }
                } catch (error) {
                    console.warn('Dashboard insights generation failed:', error);
                }
            }

            return {
                success: true,
                dashboard: dashboardData
            };
        } catch (error) {
            console.error('Dashboard data fetch failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Initialize enhanced features for the UI
     */
    initializeEnhancedFeatures() {
        // Add enhanced search functionality
        this.addEnhancedSearch();
        
        // Add AI analysis buttons
        this.addAIAnalysisButtons();
        
        // Add audio controls to content sections
        this.addAudioControlsToContent();
        
        // Initialize real-time updates
        this.initializeRealTimeUpdates();
    }

    /**
     * Add enhanced search with AI suggestions
     */
    addEnhancedSearch() {
        const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
        
        searchInputs.forEach(input => {
            // Add AI-powered search suggestions
            input.addEventListener('input', debounce(async (e) => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    await this.showSearchSuggestions(input, query);
                }
            }, 300));
        });
    }

    /**
     * Add AI analysis buttons to exoplanet cards
     */
    addAIAnalysisButtons() {
        const exoplanetCards = document.querySelectorAll('.exoplanet-card, .planet-card');
        
        exoplanetCards.forEach(card => {
            if (!card.querySelector('.ai-analysis-btn')) {
                const button = document.createElement('button');
                button.className = 'ai-analysis-btn btn btn-secondary';
                button.innerHTML = '<i class="fas fa-brain"></i> AI Analysis';
                button.title = 'Get AI-powered analysis';
                
                button.addEventListener('click', async () => {
                    const planetName = card.dataset.planetName || 
                                     card.querySelector('.planet-name, .exoplanet-name')?.textContent;
                    
                    if (planetName) {
                        await this.showAIAnalysis(planetName, card);
                    }
                });
                
                card.appendChild(button);
            }
        });
    }

    /**
     * Add audio controls to content sections
     */
    addAudioControlsToContent() {
        // Add to problem statements
        const problemSections = document.querySelectorAll('.problem-statement, .challenge-description');
        problemSections.forEach(section => {
            section.classList.add('audio-enabled');
        });

        // Add to educational content
        const educationalSections = document.querySelectorAll('.educational-content, .learn-section');
        educationalSections.forEach(section => {
            section.classList.add('audio-enabled');
        });

        // Refresh audio controls
        this.audioService.addAudioControlsToElements('.audio-enabled');
    }

    /**
     * Initialize real-time updates
     */
    initializeRealTimeUpdates() {
        // Update dashboard data every 30 minutes
        setInterval(async () => {
            if (document.querySelector('.dashboard-container')) {
                await this.updateDashboardData();
            }
        }, 30 * 60 * 1000);

        // Update APOD daily
        setInterval(async () => {
            await this.updateAPOD();
        }, 24 * 60 * 60 * 1000);
    }

    /**
     * Show AI analysis in a modal or card
     */
    async showAIAnalysis(planetName, targetElement) {
        try {
            // Show loading state
            const loadingIndicator = this.createLoadingIndicator('Analyzing with AI...');
            targetElement.appendChild(loadingIndicator);

            // Get AI analysis
            const analysisResult = await this.analyzeExoplanetWithAI(planetName);
            
            // Remove loading indicator
            loadingIndicator.remove();

            if (analysisResult.success) {
                // Create analysis modal or expand card
                this.displayAnalysisResult(analysisResult, targetElement);
            } else {
                this.showError('AI analysis failed: ' + analysisResult.error, targetElement);
            }
        } catch (error) {
            console.error('Failed to show AI analysis:', error);
            this.showError('Analysis failed', targetElement);
        }
    }

    /**
     * Display analysis result with audio option
     */
    displayAnalysisResult(analysisResult, targetElement) {
        const modal = document.createElement('div');
        modal.className = 'ai-analysis-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-brain"></i> AI Analysis: ${analysisResult.exoplanet.name}</h3>
                    <button class="close-btn" onclick="this.closest('.ai-analysis-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="analysis-content audio-enabled">
                        ${analysisResult.analysis.replace(/\n/g, '<br>')}
                    </div>
                    <div class="analysis-actions">
                        <button class="btn btn-primary speak-analysis-btn">
                            <i class="fas fa-volume-up"></i> Listen to Analysis
                        </button>
                        <button class="btn btn-secondary share-btn">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        const speakBtn = modal.querySelector('.speak-analysis-btn');
        speakBtn.addEventListener('click', async () => {
            await this.audioService.speakExoplanetAnalysis(
                analysisResult.analysis, 
                analysisResult.exoplanet.name
            );
        });

        document.body.appendChild(modal);
    }

    /**
     * Create loading indicator
     */
    createLoadingIndicator(message = 'Loading...') {
        const indicator = document.createElement('div');
        indicator.className = 'loading-indicator';
        indicator.innerHTML = `
            <div class="loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                <span>${message}</span>
            </div>
        `;
        return indicator;
    }

    /**
     * Show error message
     */
    showError(message, targetElement) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        targetElement.appendChild(error);
        
        setTimeout(() => error.remove(), 5000);
    }

    /**
     * Get API status for display
     */
    getAPIStatus() {
        return this.apiStatus;
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create global instance
window.enhancedIntegration = new EnhancedIntegrationService();