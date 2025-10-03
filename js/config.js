// ExoPlanet AI - Configuration

/**
 * Application Configuration
 */
const Config = {
  // API Configuration
  api: {
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Authentication Configuration
  auth: {
    tokenRefreshInterval: 50 * 60 * 1000, // 50 minutes
    sessionTimeout: 60 * 60 * 1000, // 1 hour
    rememberMeDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Cache Configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // Maximum number of cached items
    cleanupInterval: 10 * 60 * 1000, // 10 minutes
  },

  // Status Monitoring
  status: {
    checkInterval: 30 * 1000, // 30 seconds
    maxRetries: 3,
    timeout: 5000, // 5 seconds
  },

  // Dashboard Configuration
  dashboard: {
    dataRefreshInterval: 5 * 60 * 1000, // 5 minutes
    chartUpdateInterval: 30 * 1000, // 30 seconds
    maxPredictions: 50,
    maxExoplanets: 100,
  },

  // UI Configuration
  ui: {
    animationDuration: 300,
    toastDuration: 4000,
    loadingDelay: 500,
    debounceDelay: 300,
    throttleDelay: 100,
  },

  // Validation Rules
  validation: {
    exoplanet: {
      orbitalPeriod: { min: 0.1, max: 10000 },
      transitDuration: { min: 0.1, max: 24 },
      planetaryRadius: { min: 0.1, max: 50 },
      transitDepth: { min: 0.001, max: 10 },
      stellarMagnitude: { min: -5, max: 20 },
      equilibriumTemperature: { min: 50, max: 3000 },
    },
  },

  // Feature Flags
  features: {
    authentication: true,
    realTimeUpdates: true,
    statusIndicator: true,
    dataExport: true,
    advancedFilters: true,
    chartAnimations: true,
    darkMode: true,
    notifications: true,
  },

  // Development Configuration
  development: {
    enableLogging: true,
    enableDebugMode: false,
    mockAPI: false,
    showPerformanceMetrics: false,
  },

  // Production Configuration
  production: {
    enableLogging: false,
    enableDebugMode: false,
    mockAPI: false,
    showPerformanceMetrics: false,
    compressionEnabled: true,
    cacheEnabled: true,
  },

  // Environment Detection
  get environment() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'development';
    }
    return 'production';
  },

  // Get environment-specific config
  get env() {
    return this[this.environment] || this.development;
  },

  // Sample Data for Testing
  sampleData: {
    exoplanet: {
      orbital_period: 3.52,
      transit_duration: 2.8,
      planetary_radius: 1.2,
      transit_depth: 0.15,
      stellar_magnitude: 12.5,
      equilibrium_temperature: 1200,
    },
    
    user: {
      email: 'test@example.com',
      password: 'testpassword123',
      full_name: 'Test User',
    },
  },

  // API Endpoints
  endpoints: {
    health: '/health',
    
    // Authentication
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    
    // Exoplanets
    exoplanets: '/exoplanets',
    exoplanetById: '/exoplanets/{id}',
    searchExoplanets: '/exoplanets/search',
    
    // Predictions
    predict: '/predictions/predict',
    predictions: '/predictions',
    predictionById: '/predictions/{id}',
    
    // Models
    models: '/models',
    modelById: '/models/{id}',
    modelMetrics: '/models/{id}/metrics',
    
    // Statistics
    statistics: '/statistics',
    discoveryTrends: '/statistics/discovery-trends',
    detectionMethods: '/statistics/detection-methods',
  },

  // Error Messages
  errors: {
    network: 'Network connection failed. Please check your internet connection.',
    timeout: 'Request timed out. Please try again.',
    unauthorized: 'Authentication required. Please log in.',
    forbidden: 'Access denied. You do not have permission to perform this action.',
    notFound: 'The requested resource was not found.',
    serverError: 'Server error occurred. Please try again later.',
    validationError: 'Please check your input and try again.',
    unknown: 'An unexpected error occurred. Please try again.',
  },

  // Success Messages
  messages: {
    loginSuccess: 'Successfully logged in!',
    logoutSuccess: 'Successfully logged out!',
    registrationSuccess: 'Account created successfully!',
    predictionSuccess: 'Prediction completed successfully!',
    dataLoaded: 'Data loaded successfully!',
    settingsSaved: 'Settings saved successfully!',
  },

  // Utility Methods
  getApiUrl(endpoint) {
    return this.api.baseURL + endpoint;
  },

  isFeatureEnabled(feature) {
    return this.features[feature] === true;
  },

  getValidationRule(field) {
    return this.validation.exoplanet[field] || null;
  },

  getSampleData(type) {
    return this.sampleData[type] || null;
  },

  log(...args) {
    if (this.env.enableLogging) {
      console.log('[ExoPlanet AI]', ...args);
    }
  },

  debug(...args) {
    if (this.env.enableDebugMode) {
      console.debug('[DEBUG]', ...args);
    }
  },

  error(...args) {
    console.error('[ERROR]', ...args);
  },
};

// Freeze configuration to prevent accidental modifications
Object.freeze(Config);
Object.freeze(Config.api);
Object.freeze(Config.auth);
Object.freeze(Config.cache);
Object.freeze(Config.validation);
Object.freeze(Config.features);
Object.freeze(Config.sampleData);
Object.freeze(Config.endpoints);
Object.freeze(Config.errors);
Object.freeze(Config.messages);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Config;
}