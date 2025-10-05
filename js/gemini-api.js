/**
 * Google Gemini API Integration Service
 * Handles AI-powered analysis and content generation
 */

class GeminiAPIService {
    constructor() {
        this.apiKey = CONFIG.GEMINI_API.API_KEY;
        this.baseUrl = CONFIG.GEMINI_API.BASE_URL;
        this.model = CONFIG.GEMINI_API.MODEL;
        this.requestQueue = [];
        this.isProcessing = false;
    }

    /**
     * Generate content using Gemini AI
     */
    async generateContent(prompt, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: options.temperature || 0.7,
                        topK: options.topK || 40,
                        topP: options.topP || 0.95,
                        maxOutputTokens: options.maxTokens || 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return {
                    success: true,
                    text: data.candidates[0].content.parts[0].text,
                    usage: data.usageMetadata || null
                };
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Gemini API request failed:', error);
            return {
                success: false,
                error: error.message,
                text: null
            };
        }
    }

    /**
     * Analyze exoplanet data with AI insights
     */
    async analyzeExoplanet(exoplanetData) {
        const prompt = `
        As an expert astronomer and exoplanet researcher, analyze the following exoplanet data and provide comprehensive insights:

        Exoplanet: ${exoplanetData.name}
        Host Star: ${exoplanetData.hostStar}
        Distance: ${exoplanetData.distance} parsecs
        Orbital Period: ${exoplanetData.orbitalPeriod} days
        Radius: ${exoplanetData.radius} Earth radii
        Mass: ${exoplanetData.mass} Earth masses
        Equilibrium Temperature: ${exoplanetData.equilibriumTemp} K
        Discovery Year: ${exoplanetData.discoveryYear}
        Discovery Method: ${exoplanetData.discoveryMethod}

        Please provide:
        1. A detailed analysis of this exoplanet's characteristics
        2. Habitability assessment based on the data
        3. Comparison to Earth and other known exoplanets
        4. Significance of its discovery method
        5. Interesting facts and scientific implications
        6. Potential for future study or missions

        Format your response in a clear, educational manner suitable for both scientists and the general public.
        `;

        const result = await this.generateContent(prompt, {
            temperature: 0.8,
            maxTokens: 1500
        });

        if (result.success) {
            return {
                success: true,
                analysis: result.text,
                exoplanet: exoplanetData.name,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                error: result.error,
                analysis: null
            };
        }
    }

    /**
     * Generate educational content about exoplanets
     */
    async generateEducationalContent(topic, level = 'intermediate') {
        const levelPrompts = {
            beginner: 'Explain in simple terms suitable for high school students',
            intermediate: 'Provide a comprehensive explanation suitable for college students',
            advanced: 'Give a detailed scientific explanation suitable for researchers'
        };

        const prompt = `
        ${levelPrompts[level]} about the following exoplanet topic: "${topic}"

        Include:
        1. Clear definitions and explanations
        2. Real examples from current research
        3. Why this topic is important in astronomy
        4. Recent discoveries and developments
        5. Future research directions
        6. Interactive questions to engage learners

        Make the content engaging, accurate, and educational.
        `;

        const result = await this.generateContent(prompt, {
            temperature: 0.7,
            maxTokens: 1200
        });

        if (result.success) {
            return {
                success: true,
                content: result.text,
                topic: topic,
                level: level,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                error: result.error,
                content: null
            };
        }
    }

    /**
     * Generate problem statements and explanations
     */
    async generateProblemExplanation(problemType, context = {}) {
        const prompt = `
        Generate a comprehensive explanation for the following exoplanet research problem:

        Problem Type: ${problemType}
        Context: ${JSON.stringify(context, null, 2)}

        Please provide:
        1. Clear problem statement
        2. Why this problem is important
        3. Current challenges and obstacles
        4. Potential solutions and approaches
        5. Required resources and methods
        6. Expected outcomes and implications

        Make the explanation suitable for audio narration - use clear, flowing language that sounds natural when spoken aloud.
        `;

        const result = await this.generateContent(prompt, {
            temperature: 0.6,
            maxTokens: 800
        });

        if (result.success) {
            return {
                success: true,
                explanation: result.text,
                problemType: problemType,
                audioReady: true,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                error: result.error,
                explanation: null
            };
        }
    }

    /**
     * Generate research insights from NASA data
     */
    async analyzeNASAData(nasaData, analysisType = 'general') {
        let prompt = '';

        switch (analysisType) {
            case 'trends':
                prompt = `
                Analyze the following NASA exoplanet data for trends and patterns:
                ${JSON.stringify(nasaData, null, 2)}

                Identify:
                1. Discovery trends over time
                2. Most common detection methods
                3. Patterns in planetary characteristics
                4. Significant discoveries and outliers
                5. Implications for future research
                `;
                break;

            case 'habitability':
                prompt = `
                Assess the habitability potential of exoplanets in this NASA dataset:
                ${JSON.stringify(nasaData, null, 2)}

                Evaluate:
                1. Planets in habitable zones
                2. Earth-like characteristics
                3. Atmospheric considerations
                4. Potential for life as we know it
                5. Recommendations for further study
                `;
                break;

            default:
                prompt = `
                Provide a comprehensive analysis of this NASA exoplanet data:
                ${JSON.stringify(nasaData, null, 2)}

                Include scientific insights, interesting findings, and educational value.
                `;
        }

        const result = await this.generateContent(prompt, {
            temperature: 0.7,
            maxTokens: 1000
        });

        if (result.success) {
            return {
                success: true,
                insights: result.text,
                analysisType: analysisType,
                dataSource: 'NASA',
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                error: result.error,
                insights: null
            };
        }
    }

    /**
     * Generate quiz questions based on content
     */
    async generateQuiz(topic, difficulty = 'medium', questionCount = 5) {
        const prompt = `
        Create ${questionCount} multiple-choice quiz questions about: "${topic}"

        Difficulty: ${difficulty}
        
        Format each question as:
        Q: [Question text]
        A) [Option A]
        B) [Option B]
        C) [Option C]
        D) [Option D]
        Correct: [Letter]
        Explanation: [Brief explanation of the correct answer]

        Make questions educational and engaging, covering different aspects of the topic.
        `;

        const result = await this.generateContent(prompt, {
            temperature: 0.8,
            maxTokens: 1200
        });

        if (result.success) {
            return {
                success: true,
                quiz: this.parseQuizContent(result.text),
                topic: topic,
                difficulty: difficulty,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                error: result.error,
                quiz: null
            };
        }
    }

    /**
     * Parse quiz content into structured format
     */
    parseQuizContent(quizText) {
        const questions = [];
        const questionBlocks = quizText.split(/Q\d*:/).filter(block => block.trim());

        questionBlocks.forEach(block => {
            const lines = block.trim().split('\n').filter(line => line.trim());
            if (lines.length >= 6) {
                const question = {
                    question: lines[0].trim(),
                    options: [],
                    correct: '',
                    explanation: ''
                };

                lines.forEach(line => {
                    if (line.match(/^[A-D]\)/)) {
                        question.options.push(line.trim());
                    } else if (line.startsWith('Correct:')) {
                        question.correct = line.replace('Correct:', '').trim();
                    } else if (line.startsWith('Explanation:')) {
                        question.explanation = line.replace('Explanation:', '').trim();
                    }
                });

                if (question.options.length === 4) {
                    questions.push(question);
                }
            }
        });

        return questions;
    }

    /**
     * Generate welcome message variations
     */
    async generateWelcomeMessage(userContext = {}) {
        const prompt = `
        Generate a warm, professional welcome message for the ExoPlanet AI Enhanced platform.
        
        Context: ${JSON.stringify(userContext)}
        
        The message should:
        1. Welcome users to the platform
        2. Briefly explain the NASA and Gemini AI integration
        3. Highlight key features and capabilities
        4. Encourage exploration and learning
        5. Be suitable for audio narration (natural, flowing speech)
        
        Keep it engaging but concise (30-45 seconds when spoken).
        `;

        const result = await this.generateContent(prompt, {
            temperature: 0.8,
            maxTokens: 300
        });

        if (result.success) {
            return {
                success: true,
                message: result.text,
                audioReady: true,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                error: result.error,
                message: CONFIG.AUDIO.WELCOME_MESSAGE // Fallback to default
            };
        }
    }
}

// Create global instance
window.geminiAPI = new GeminiAPIService();