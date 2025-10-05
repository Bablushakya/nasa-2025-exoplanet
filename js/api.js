// ExoPlanet AI - API Service

/**
 * API Service for communicating with the backend
 */
class ApiService {
    constructor() {
        this.baseURL = (window.CONFIG?.APP?.BACKEND_URL || 'https://bablushakya-nasa-2025-backend.onrender.com') + '/api/v1';
        this.timeout = 30000;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Make HTTP request with error handling
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        config.signal = controller.signal;

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                data,
                status: response.status,
                statusText: response.statusText
            };
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }

            throw error;
        }
    }

    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} API response
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        return this.request(url);
    }

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @returns {Promise<Object>} API response
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @returns {Promise<Object>} API response
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>} API response
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Health Check
    async healthCheck() {
        return this.get('/health');
    }

    // Authentication endpoints
    async login(credentials) {
        return this.post('/auth/login', credentials);
    }

    async register(userData) {
        return this.post('/auth/register', userData);
    }

    async logout() {
        return this.post('/auth/logout');
    }

    async refreshToken() {
        return this.post('/auth/refresh');
    }

    // Exoplanet endpoints
    async getExoplanets(params = {}) {
        return this.get('/exoplanets', params);
    }

    async getExoplanet(id) {
        return this.get(`/exoplanets/${id}`);
    }

    async searchExoplanets(query) {
        return this.get('/exoplanets/search', { q: query });
    }

    // Prediction endpoints
    async predictExoplanet(data) {
        return this.post('/predictions', data);
    }

    async getPredictions(params = {}) {
        return this.get('/predictions', params);
    }

    async getPrediction(id) {
        return this.get(`/predictions/${id}`);
    }

    // Solar System endpoints
    async getSolarSystemData() {
        return this.get('/solar-system');
    }

    async getPlanetDetails(planetId) {
        return this.get(`/solar-system/planets/${planetId}`);
    }

    async getPlanetPositions(date = null) {
        const params = date ? { date } : {};
        return this.get('/solar-system/positions', params);
    }

    async getOrbitalData(planetId, timeRange = null) {
        const params = timeRange ? { timeRange } : {};
        return this.get(`/solar-system/planets/${planetId}/orbit`, params);
    }

    // Model endpoints
    async getModels() {
        return this.get('/models');
    }

    async getModel(id) {
        return this.get(`/models/${id}`);
    }

    async getModelMetrics(id) {
        return this.get(`/models/${id}/metrics`);
    }

    // Statistics endpoints
    async getStatistics() {
        return this.get('/status');
    }

    async getDiscoveryTrends() {
        return this.get('/exoplanets');
    }

    async getDetectionMethods() {
        return this.get('/exoplanets');
    }
}

/**
 * Authentication Manager
 */
class AuthManager {
    constructor(apiService) {
        this.api = apiService;
        this.token = null;
        this.user = null;
        this.refreshTimer = null;

        // Load saved auth data
        this.loadAuthData();
    }

    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @returns {Promise<Object>} Login result
     */
    async login(credentials) {
        try {
            const response = await this.api.login(credentials);

            if (response.success && response.data.access_token) {
                this.setAuthData(response.data);
                this.startTokenRefresh();
                return { success: true, user: this.user };
            }

            throw new Error('Invalid login response');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registration result
     */
    async register(userData) {
        try {
            const response = await this.api.register(userData);

            if (response.success) {
                return { success: true, message: 'Registration successful' };
            }

            throw new Error('Registration failed');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (this.token) {
                await this.api.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuthData();
            this.stopTokenRefresh();
        }
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Is authenticated
     */
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    /**
     * Get current user
     * @returns {Object|null} Current user
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Get auth token
     * @returns {string|null} Auth token
     */
    getToken() {
        return this.token;
    }

    /**
     * Set authentication data
     * @param {Object} authData - Authentication data
     */
    setAuthData(authData) {
        this.token = authData.access_token;
        this.user = authData.user || { email: authData.email };

        // Update API headers
        this.api.defaultHeaders['Authorization'] = `Bearer ${this.token}`;

        // Save to storage
        StorageManager.setItem('auth_token', this.token);
        StorageManager.setItem('auth_user', this.user);
    }

    /**
     * Clear authentication data
     */
    clearAuthData() {
        this.token = null;
        this.user = null;

        // Remove from API headers
        delete this.api.defaultHeaders['Authorization'];

        // Clear from storage
        StorageManager.removeItem('auth_token');
        StorageManager.removeItem('auth_user');
    }

    /**
     * Load authentication data from storage
     */
    loadAuthData() {
        const token = StorageManager.getItem('auth_token');
        const user = StorageManager.getItem('auth_user');

        if (token && user) {
            this.token = token;
            this.user = user;
            this.api.defaultHeaders['Authorization'] = `Bearer ${this.token}`;
            this.startTokenRefresh();
        }
    }

    /**
     * Start token refresh timer
     */
    startTokenRefresh() {
        // Refresh token every 50 minutes (assuming 1 hour expiry)
        this.refreshTimer = setInterval(async () => {
            try {
                const response = await this.api.refreshToken();
                if (response.success && response.data.access_token) {
                    this.setAuthData(response.data);
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
                this.logout();
            }
        }, 50 * 60 * 1000);
    }

    /**
     * Stop token refresh timer
     */
    stopTokenRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }
}

/**
 * Data Cache Manager
 */
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.ttl = 5 * 60 * 1000; // 5 minutes default TTL
    }

    /**
     * Set cache entry
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    set(key, data, ttl = this.ttl) {
        const expiry = Date.now() + ttl;
        this.cache.set(key, { data, expiry });
    }

    /**
     * Get cache entry
     * @param {string} key - Cache key
     * @returns {*} Cached data or null
     */
    get(key) {
        const entry = this.cache.get(key);

        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Check if key exists and is valid
     * @param {string} key - Cache key
     * @returns {boolean} Has valid entry
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Delete cache entry
     * @param {string} key - Cache key
     */
    delete(key) {
        this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Clean expired entries
     */
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiry) {
                this.cache.delete(key);
            }
        }
    }
}

// Global instances
const apiService = new ApiService();
const authManager = new AuthManager(apiService);
const cacheManager = new CacheManager();

// Cleanup cache every 10 minutes
setInterval(() => cacheManager.cleanup(), 10 * 60 * 1000);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiService, AuthManager, CacheManager, apiService, authManager, cacheManager };
}