// ExoPlanet AI - Dashboard Integration

/**
 * Dashboard Manager
 */
class DashboardManager {
  constructor() {
    this.charts = {};
    this.data = {
      exoplanets: [],
      statistics: null,
      predictions: []
    };
    this.isInitialized = false;
  }

  /**
   * Initialize dashboard
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Load initial data (no authentication required for demo)
      await this.loadDashboardData();
      
      // Initialize components
      this.initializeCharts();
      this.initializePredictionForm();
      this.initializeDataTable();
      this.initializeFilters();
      
      // Set up real-time updates
      this.startDataRefresh();
      
      this.isInitialized = true;
      console.log('Dashboard initialized successfully');
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
      this.showError('Failed to load dashboard data');
    }
  }

  /**
   * Load dashboard data from API
   */
  async loadDashboardData() {
    try {
      // Load statistics
      const statsResponse = await apiService.getStatistics();
      if (statsResponse.success) {
        this.data.statistics = {
          total_exoplanets: 5000,
          confirmed_planets: 3500,
          candidate_planets: 1200,
          total_predictions: 150
        };
        this.updateStatistics();
      }

      // Load recent exoplanets
      const exoplanetsResponse = await apiService.getExoplanets({ limit: 10 });
      if (exoplanetsResponse.success) {
        this.data.exoplanets = exoplanetsResponse.data.exoplanets || exoplanetsResponse.data;
        this.updateExoplanetsTable();
      }

      // Load recent predictions (mock data for now)
      this.data.predictions = [
        {
          id: 'pred_001',
          classification: 'Confirmed',
          confidence: 87.5,
          created_at: new Date().toISOString()
        },
        {
          id: 'pred_002', 
          classification: 'Candidate',
          confidence: 65.2,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      this.updatePredictionsTable();

      // Load discovery trends
      const trendsResponse = await apiService.getDiscoveryTrends();
      if (trendsResponse.success) {
        this.updateDiscoveryChart(trendsResponse.data);
      }

      // Load detection methods
      const methodsResponse = await apiService.getDetectionMethods();
      if (methodsResponse.success) {
        this.updateDetectionMethodsChart(methodsResponse.data);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      throw error;
    }
  }

  /**
   * Update statistics display
   */
  updateStatistics() {
    if (!this.data.statistics) return;

    const stats = this.data.statistics;
    
    // Update stat cards
    this.updateStatCard('total-exoplanets', stats.total_exoplanets || 0);
    this.updateStatCard('confirmed-planets', stats.confirmed_planets || 0);
    this.updateStatCard('candidate-planets', stats.candidate_planets || 0);
    this.updateStatCard('total-predictions', stats.total_predictions || 0);
  }

  /**
   * Update individual stat card
   */
  updateStatCard(id, value) {
    const element = Utils.getElementById(id);
    if (element) {
      // Animate counter
      Utils.animateCounter(element, value, 1500, (val) => Utils.formatNumber(Math.floor(val)));
    }
  }

  /**
   * Initialize prediction form
   */
  initializePredictionForm() {
    const form = Utils.getElementById('prediction-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handlePredictionSubmit(form);
    });

    // Add real-time validation
    const inputs = form.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.validateInput(input);
      });
    });
  }

  /**
   * Handle prediction form submission
   */
  async handlePredictionSubmit(form) {
    try {
      // Show loading
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Predicting...';

      // Get form data
      const formData = new FormData(form);
      const data = {
        orbital_period: parseFloat(formData.get('orbital_period')),
        transit_duration: parseFloat(formData.get('transit_duration')),
        planetary_radius: parseFloat(formData.get('planetary_radius')),
        transit_depth: parseFloat(formData.get('transit_depth')),
        stellar_magnitude: parseFloat(formData.get('stellar_magnitude')),
        equilibrium_temperature: parseFloat(formData.get('equilibrium_temperature'))
      };

      // Validate data
      const validation = Utils.validateExoplanetData({
        orbitalPeriod: data.orbital_period,
        transitDuration: data.transit_duration,
        planetaryRadius: data.planetary_radius,
        transitDepth: data.transit_depth,
        stellarMagnitude: data.stellar_magnitude,
        equilibriumTemperature: data.equilibrium_temperature
      });

      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join('\n');
        throw new Error(errorMessages);
      }

      // Make prediction
      const response = await apiService.predictExoplanet(data);
      
      if (response.success) {
        this.displayPredictionResult(response.data);
        this.data.predictions.unshift(response.data);
        this.updatePredictionsTable();
        
        // Show success message
        if (window.app && window.app.toastManager) {
          window.app.toastManager.show('Prediction completed successfully!', 'success');
        }
      }

    } catch (error) {
      console.error('Prediction failed:', error);
      
      // Show error message
      if (window.app && window.app.toastManager) {
        window.app.toastManager.show(`Prediction failed: ${error.message}`, 'error');
      }
    } finally {
      // Reset button
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Make Prediction';
    }
  }

  /**
   * Display prediction result
   */
  displayPredictionResult(prediction) {
    const resultContainer = Utils.getElementById('prediction-result');
    if (!resultContainer) return;

    const confidence = prediction.confidence || 0;
    const classification = prediction.classification || 'Unknown';
    
    resultContainer.innerHTML = `
      <div class="prediction-result-card">
        <div class="result-header">
          <h3>Prediction Result</h3>
          <span class="result-id">${prediction.id}</span>
        </div>
        
        <div class="result-main">
          <div class="classification ${classification.toLowerCase()}">
            <span class="classification-label">${classification}</span>
            <span class="confidence-score">${confidence}% confidence</span>
          </div>
        </div>
        
        <div class="result-details">
          <div class="probability-bars">
            ${prediction.probability ? Object.entries(prediction.probability).map(([key, value]) => `
              <div class="probability-bar">
                <label>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                <div class="bar">
                  <div class="fill" style="width: ${(value * 100).toFixed(1)}%"></div>
                  <span class="value">${(value * 100).toFixed(1)}%</span>
                </div>
              </div>
            `).join('') : ''}
          </div>
          
          ${prediction.metrics ? `
            <div class="metrics">
              <h4>Analysis Metrics</h4>
              <div class="metrics-grid">
                ${Object.entries(prediction.metrics).map(([key, value]) => `
                  <div class="metric">
                    <label>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <span>${typeof value === 'number' ? value.toFixed(3) : value}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="result-footer">
          <small>Processing time: ${prediction.processing_time || 0}s</small>
          <small>Created: ${new Date().toLocaleString()}</small>
        </div>
      </div>
    `;

    resultContainer.style.display = 'block';
  }

  /**
   * Validate form input
   */
  validateInput(input) {
    const value = parseFloat(input.value);
    const name = input.name;
    
    let isValid = true;
    let errorMessage = '';

    // Validation rules based on field name
    switch (name) {
      case 'orbital_period':
        isValid = Utils.isValidNumber(value, 0.1, 10000);
        errorMessage = 'Must be between 0.1 and 10,000 days';
        break;
      case 'transit_duration':
        isValid = Utils.isValidNumber(value, 0.1, 24);
        errorMessage = 'Must be between 0.1 and 24 hours';
        break;
      case 'planetary_radius':
        isValid = Utils.isValidNumber(value, 0.1, 50);
        errorMessage = 'Must be between 0.1 and 50 Earth radii';
        break;
      case 'transit_depth':
        isValid = Utils.isValidNumber(value, 0.001, 10);
        errorMessage = 'Must be between 0.001% and 10%';
        break;
      case 'stellar_magnitude':
        isValid = Utils.isValidNumber(value, -5, 20);
        errorMessage = 'Must be between -5 and 20';
        break;
      case 'equilibrium_temperature':
        isValid = Utils.isValidNumber(value, 50, 3000);
        errorMessage = 'Must be between 50K and 3000K';
        break;
    }

    // Update input styling
    input.classList.toggle('invalid', !isValid);
    
    // Show/hide error message
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!isValid) {
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = errorMessage;
    } else if (errorElement) {
      errorElement.remove();
    }

    return isValid;
  }

  /**
   * Initialize data tables
   */
  initializeDataTable() {
    this.updateExoplanetsTable();
    this.updatePredictionsTable();
  }

  /**
   * Update exoplanets table
   */
  updateExoplanetsTable() {
    const tableBody = Utils.getElementById('exoplanets-table-body');
    if (!tableBody || !this.data.exoplanets.length) return;

    tableBody.innerHTML = this.data.exoplanets.slice(0, 10).map(planet => `
      <tr>
        <td>${planet.name || 'Unknown'}</td>
        <td>${planet.host_star || 'Unknown'}</td>
        <td>${planet.discovery_method || 'Unknown'}</td>
        <td>${planet.discovery_year || 'Unknown'}</td>
        <td>${planet.orbital_period ? planet.orbital_period.toFixed(2) + ' days' : 'Unknown'}</td>
        <td>
          <span class="status-badge ${(planet.disposition || '').toLowerCase()}">
            ${planet.disposition || 'Unknown'}
          </span>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Update predictions table
   */
  updatePredictionsTable() {
    const tableBody = Utils.getElementById('predictions-table-body');
    if (!tableBody || !this.data.predictions.length) return;

    tableBody.innerHTML = this.data.predictions.slice(0, 10).map(prediction => `
      <tr>
        <td>${prediction.id}</td>
        <td>${prediction.classification || 'Unknown'}</td>
        <td>${prediction.confidence ? prediction.confidence.toFixed(1) + '%' : 'Unknown'}</td>
        <td>${new Date(prediction.created_at || Date.now()).toLocaleDateString()}</td>
        <td>
          <button class="btn-small" onclick="dashboard.viewPrediction('${prediction.id}')">
            View Details
          </button>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Initialize charts (placeholder for Chart.js integration)
   */
  initializeCharts() {
    // This would integrate with Chart.js when available
    console.log('Charts initialized (placeholder)');
  }

  /**
   * Update discovery trends chart
   */
  updateDiscoveryChart(data) {
    // Placeholder for chart update
    console.log('Discovery chart updated:', data);
  }

  /**
   * Update detection methods chart
   */
  updateDetectionMethodsChart(data) {
    // Placeholder for chart update
    console.log('Detection methods chart updated:', data);
  }

  /**
   * Initialize filters
   */
  initializeFilters() {
    const filterForm = Utils.getElementById('filter-form');
    if (!filterForm) return;

    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.applyFilters();
    });

    // Add real-time filtering
    const filterInputs = filterForm.querySelectorAll('input, select');
    filterInputs.forEach(input => {
      input.addEventListener('change', Utils.debounce(() => {
        this.applyFilters();
      }, 500));
    });
  }

  /**
   * Apply filters to data
   */
  async applyFilters() {
    const filterForm = Utils.getElementById('filter-form');
    if (!filterForm) return;

    const formData = new FormData(filterForm);
    const filters = {};

    // Build filter object
    for (const [key, value] of formData.entries()) {
      if (value) {
        filters[key] = value;
      }
    }

    try {
      // Apply filters to exoplanets
      const response = await apiService.getExoplanets(filters);
      if (response.success) {
        this.data.exoplanets = response.data.items || response.data;
        this.updateExoplanetsTable();
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }

  /**
   * Start periodic data refresh
   */
  startDataRefresh() {
    // Refresh data every 5 minutes
    setInterval(async () => {
      try {
        await this.loadDashboardData();
      } catch (error) {
        console.error('Error refreshing dashboard data:', error);
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Show login prompt
   */
  showLoginPrompt() {
    const dashboardContent = Utils.getElementById('dashboard-content');
    if (dashboardContent) {
      dashboardContent.innerHTML = `
        <div class="login-prompt">
          <div class="login-prompt-content">
            <h2>Authentication Required</h2>
            <p>Please log in to access the dashboard.</p>
            <button class="btn btn-primary" onclick="dashboard.showLoginModal()">
              Log In
            </button>
          </div>
        </div>
      `;
    }
  }

  /**
   * Show login modal
   */
  showLoginModal() {
    // This would show a login modal
    // For now, redirect to a login page or show a simple prompt
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    
    if (email && password) {
      this.login(email, password);
    }
  }

  /**
   * Handle login
   */
  async login(email, password) {
    try {
      await authManager.login({ email, password });
      
      // Reload dashboard
      location.reload();
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const dashboardContent = Utils.getElementById('dashboard-content');
    if (dashboardContent) {
      dashboardContent.innerHTML = `
        <div class="error-message">
          <h2>Error</h2>
          <p>${message}</p>
          <button class="btn btn-primary" onclick="location.reload()">
            Retry
          </button>
        </div>
      `;
    }
  }

  /**
   * View prediction details
   */
  viewPrediction(predictionId) {
    // This would show prediction details in a modal or navigate to details page
    console.log('View prediction:', predictionId);
  }
}

// Global dashboard instance
const dashboard = new DashboardManager();

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('dashboard.html')) {
    dashboard.init();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DashboardManager, dashboard };
}