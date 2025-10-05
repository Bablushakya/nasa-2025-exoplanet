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
      // Initialize tab system first
      this.initializeTabSystem();
      
      // Initialize file upload
      this.initializeFileUpload();
      
      // Initialize sample data
      this.initializeSampleData();
      
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
   * Initialize tab system
   */
  initializeTabSystem() {
    const tabButtons = document.querySelectorAll('.input-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const targetContent = document.getElementById(`${targetTab}-tab`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  /**
   * Initialize file upload functionality
   */
  initializeFileUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const fileSelectBtn = document.getElementById('file-select-btn');

    if (!uploadZone || !fileInput || !fileSelectBtn) return;

    // File select button click
    fileSelectBtn.addEventListener('click', () => {
      fileInput.click();
    });

    // Drag and drop functionality
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      
      const files = Array.from(e.dataTransfer.files);
      this.handleFileUpload(files);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.handleFileUpload(files);
    });
  }

  /**
   * Handle file upload
   */
  async handleFileUpload(files) {
    if (!files.length) return;

    try {
      // Show loading
      if (window.app && window.app.loadingManager) {
        window.app.loadingManager.show('Processing files...');
      }

      for (const file of files) {
        if (!this.isValidFileType(file)) {
          throw new Error(`Invalid file type: ${file.name}. Only CSV and JSON files are supported.`);
        }

        const data = await this.parseFile(file);
        await this.processUploadedData(data, file.name);
      }

      // Show success message
      if (window.app && window.app.toastManager) {
        window.app.toastManager.show(`Successfully processed ${files.length} file(s)`, 'success');
      }

    } catch (error) {
      console.error('File upload error:', error);
      if (window.app && window.app.toastManager) {
        window.app.toastManager.show(`Upload failed: ${error.message}`, 'error');
      }
    } finally {
      if (window.app && window.app.loadingManager) {
        window.app.loadingManager.hide();
      }
    }
  }

  /**
   * Check if file type is valid
   */
  isValidFileType(file) {
    const validTypes = ['text/csv', 'application/json', '.csv', '.json'];
    return validTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type)
    );
  }

  /**
   * Parse uploaded file
   */
  async parseFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          
          if (file.name.toLowerCase().endsWith('.json')) {
            resolve(JSON.parse(content));
          } else if (file.name.toLowerCase().endsWith('.csv')) {
            resolve(this.parseCSV(content));
          } else {
            reject(new Error('Unsupported file format'));
          }
        } catch (error) {
          reject(new Error(`Failed to parse ${file.name}: ${error.message}`));
        }
      };
      
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsText(file);
    });
  }

  /**
   * Parse CSV content
   */
  parseCSV(content) {
    const lines = content.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(value) ? value : parseFloat(value);
      });
      
      data.push(row);
    }
    
    return data;
  }

  /**
   * Process uploaded data
   */
  async processUploadedData(data, filename) {
    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array of objects');
    }

    // Process each row
    for (const row of data.slice(0, 10)) { // Limit to first 10 rows for demo
      try {
        const prediction = await this.makePredictionFromData(row);
        this.data.predictions.unshift(prediction);
      } catch (error) {
        console.warn(`Failed to process row:`, row, error);
      }
    }

    // Update UI
    this.updatePredictionsTable();
    
    // Show results section
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.style.display = 'block';
    }
  }

  /**
   * Make prediction from uploaded data
   */
  async makePredictionFromData(row) {
    // Map common field names
    const fieldMapping = {
      'orbital_period': ['orbital_period', 'period', 'pl_orbper'],
      'transit_duration': ['transit_duration', 'duration', 'pl_trandur'],
      'planetary_radius': ['planetary_radius', 'radius', 'pl_rade'],
      'transit_depth': ['transit_depth', 'depth', 'pl_trandep'],
      'stellar_magnitude': ['stellar_magnitude', 'magnitude', 'st_optmag'],
      'equilibrium_temperature': ['equilibrium_temperature', 'temperature', 'pl_eqt']
    };

    const mappedData = {};
    
    for (const [targetField, possibleFields] of Object.entries(fieldMapping)) {
      for (const field of possibleFields) {
        if (row[field] !== undefined && row[field] !== null && row[field] !== '') {
          mappedData[targetField] = parseFloat(row[field]);
          break;
        }
      }
    }

    // Use API service to make prediction
    const response = await apiService.predictExoplanet(mappedData);
    return response.data;
  }

  /**
   * Initialize sample data functionality
   */
  initializeSampleData() {
    const sampleCards = document.querySelectorAll('.sample-card');
    
    sampleCards.forEach(card => {
      const button = card.querySelector('.btn');
      if (button) {
        button.addEventListener('click', () => {
          const sampleType = card.dataset.sample;
          this.loadSampleData(sampleType);
        });
      }
    });
  }

  /**
   * Load sample data
   */
  async loadSampleData(sampleType) {
    try {
      // Show loading
      if (window.app && window.app.loadingManager) {
        window.app.loadingManager.show('Loading sample data...');
      }

      const sampleData = this.getSampleDataByType(sampleType);
      
      // Fill form with sample data
      this.fillFormWithSampleData(sampleData);
      
      // Switch to manual tab
      const manualTab = document.querySelector('.tab-btn[data-tab="manual"]');
      if (manualTab) {
        manualTab.click();
      }

      // Show success message
      if (window.app && window.app.toastManager) {
        window.app.toastManager.show(`Loaded ${sampleType.toUpperCase()} sample data`, 'success');
      }

    } catch (error) {
      console.error('Error loading sample data:', error);
      if (window.app && window.app.toastManager) {
        window.app.toastManager.show(`Failed to load sample data: ${error.message}`, 'error');
      }
    } finally {
      if (window.app && window.app.loadingManager) {
        window.app.loadingManager.hide();
      }
    }
  }

  /**
   * Get sample data by type
   */
  getSampleDataByType(type) {
    const sampleData = {
      kepler: {
        orbital_period: 365.25,
        transit_duration: 6.5,
        planetary_radius: 1.0,
        transit_depth: 0.01,
        stellar_magnitude: 12.5,
        equilibrium_temperature: 288
      },
      tess: {
        orbital_period: 10.5,
        transit_duration: 2.1,
        planetary_radius: 2.3,
        transit_depth: 0.05,
        stellar_magnitude: 8.2,
        equilibrium_temperature: 1200
      },
      k2: {
        orbital_period: 88.0,
        transit_duration: 4.2,
        planetary_radius: 0.8,
        transit_depth: 0.008,
        stellar_magnitude: 14.1,
        equilibrium_temperature: 450
      }
    };

    return sampleData[type] || sampleData.kepler;
  }

  /**
   * Fill form with sample data
   */
  fillFormWithSampleData(data) {
    const form = document.getElementById('detection-form');
    if (!form) return;

    Object.entries(data).forEach(([key, value]) => {
      const input = form.querySelector(`[name="${key}"], #${key.replace('_', '-')}`);
      if (input) {
        input.value = value;
        // Trigger validation
        this.validateInput(input);
      }
    });
  }

  /**
   * Initialize prediction form
   */
  initializePredictionForm() {
    const form = document.getElementById('detection-form');
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
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

      // Get form data
      const formData = new FormData(form);
      const data = {
        orbital_period: parseFloat(formData.get('orbitalPeriod')),
        transit_duration: parseFloat(formData.get('transitDuration')),
        planetary_radius: parseFloat(formData.get('planetaryRadius')),
        transit_depth: parseFloat(formData.get('transitDepth')),
        stellar_magnitude: parseFloat(formData.get('stellarMagnitude')),
        equilibrium_temperature: parseFloat(formData.get('equilibriumTemperature'))
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
        this.displayDashboardResult(response.data);
        this.data.predictions.unshift(response.data);
        this.updateRecentPredictions();
        
        // Show results section
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.style.display = 'block';
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Show success message
        if (window.app && window.app.toastManager) {
          window.app.toastManager.show('Analysis completed successfully!', 'success');
        }
      }

    } catch (error) {
      console.error('Prediction failed:', error);
      
      // Show error message
      if (window.app && window.app.toastManager) {
        window.app.toastManager.show(`Analysis failed: ${error.message}`, 'error');
      }
    } finally {
      // Reset button
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  /**
   * Display dashboard result
   */
  displayDashboardResult(prediction) {
    const confidence = prediction.confidence || 0;
    const classification = prediction.classification || 'Unknown';
    
    // Update result badge
    const resultBadge = document.getElementById('result-badge');
    if (resultBadge) {
      resultBadge.textContent = classification;
      resultBadge.className = `result-badge ${classification.toLowerCase().replace(' ', '-')}`;
    }
    
    // Update confidence meter
    const confidenceProgress = document.getElementById('confidence-progress');
    const confidenceValue = document.getElementById('confidence-value');
    if (confidenceProgress && confidenceValue) {
      confidenceProgress.style.width = `${confidence}%`;
      confidenceValue.textContent = `${confidence.toFixed(1)}%`;
    }
    
    // Update metrics table
    const metricsTable = document.getElementById('metrics-table');
    if (metricsTable && prediction.metrics) {
      metricsTable.innerHTML = Object.entries(prediction.metrics).map(([key, value]) => `
        <div class="metric-row">
          <span class="metric-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
          <span class="metric-value">${typeof value === 'number' ? value.toFixed(3) : value}</span>
        </div>
      `).join('');
    }
    
    // Update charts if available
    this.updateResultCharts(prediction);
  }

  /**
   * Update result charts
   */
  updateResultCharts(prediction) {
    // Update probability chart
    if (prediction.probability && typeof Chart !== 'undefined') {
      this.updateProbabilityChart(prediction.probability);
    }
    
    // Update light curve chart
    if (prediction.light_curve_data) {
      this.updateLightCurveChart(prediction.light_curve_data);
    }
    
    // Update transit chart
    if (prediction.transit_data) {
      this.updateTransitChart(prediction.transit_data);
    }
  }

  /**
   * Update probability chart
   */
  updateProbabilityChart(probabilities) {
    const canvas = document.getElementById('probability-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts.probability) {
      this.charts.probability.destroy();
    }
    
    this.charts.probability = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(probabilities).map(key => 
          key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        ),
        datasets: [{
          data: Object.values(probabilities).map(val => (val * 100).toFixed(1)),
          backgroundColor: [
            '#10b981', // Success green
            '#f59e0b', // Warning yellow
            '#ef4444'  // Error red
          ],
          borderWidth: 2,
          borderColor: '#1e293b'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e2e8f0',
              padding: 20
            }
          }
        }
      }
    });
  }

  /**
   * Update light curve chart
   */
  updateLightCurveChart(lightCurveData) {
    const canvas = document.getElementById('light-curve-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts.lightCurve) {
      this.charts.lightCurve.destroy();
    }
    
    // Generate sample light curve data if not provided
    const data = lightCurveData || this.generateSampleLightCurve();
    
    this.charts.lightCurve = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.time,
        datasets: [{
          label: 'Relative Brightness',
          data: data.flux,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (hours)',
              color: '#e2e8f0'
            },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y: {
            title: {
              display: true,
              text: 'Relative Flux',
              color: '#e2e8f0'
            },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#e2e8f0' }
          }
        }
      }
    });
  }

  /**
   * Update transit chart
   */
  updateTransitChart(transitData) {
    const canvas = document.getElementById('transit-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts.transit) {
      this.charts.transit.destroy();
    }
    
    // Generate sample transit data if not provided
    const data = transitData || this.generateSampleTransitData();
    
    this.charts.transit = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.phases,
        datasets: [{
          label: 'Transit Depth (%)',
          data: data.depths,
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          borderColor: '#8b5cf6',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Transit Phase',
              color: '#e2e8f0'
            },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y: {
            title: {
              display: true,
              text: 'Depth (%)',
              color: '#e2e8f0'
            },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#e2e8f0' }
          }
        }
      }
    });
  }

  /**
   * Generate sample light curve data
   */
  generateSampleLightCurve() {
    const time = [];
    const flux = [];
    
    for (let i = 0; i < 100; i++) {
      time.push(i * 0.1);
      // Simulate transit dip
      let brightness = 1.0;
      if (i >= 40 && i <= 60) {
        brightness = 0.99 - 0.005 * Math.sin((i - 40) * Math.PI / 20);
      }
      // Add some noise
      brightness += (Math.random() - 0.5) * 0.001;
      flux.push(brightness);
    }
    
    return { time, flux };
  }

  /**
   * Generate sample transit data
   */
  generateSampleTransitData() {
    return {
      phases: ['Pre-Transit', 'Ingress', 'Transit', 'Egress', 'Post-Transit'],
      depths: [0, 0.2, 0.8, 0.2, 0]
    };
  }

  /**
   * Update recent predictions in sidebar
   */
  updateRecentPredictions() {
    const container = document.getElementById('recent-predictions');
    if (!container || !this.data.predictions.length) return;

    container.innerHTML = this.data.predictions.slice(0, 5).map(prediction => `
      <div class="recent-prediction-item">
        <div class="prediction-header">
          <span class="prediction-classification ${(prediction.classification || '').toLowerCase().replace(' ', '-')}">
            ${prediction.classification || 'Unknown'}
          </span>
          <span class="prediction-confidence">${(prediction.confidence || 0).toFixed(1)}%</span>
        </div>
        <div class="prediction-time">
          ${new Date(prediction.created_at || Date.now()).toLocaleTimeString()}
        </div>
      </div>
    `).join('');
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
      case 'orbitalPeriod':
        isValid = Utils.isValidNumber(value, 0.1, 10000);
        errorMessage = 'Must be between 0.1 and 10,000 days';
        break;
      case 'transitDuration':
        isValid = Utils.isValidNumber(value, 0.1, 24);
        errorMessage = 'Must be between 0.1 and 24 hours';
        break;
      case 'planetaryRadius':
        isValid = Utils.isValidNumber(value, 0.1, 50);
        errorMessage = 'Must be between 0.1 and 50 Earth radii';
        break;
      case 'transitDepth':
        isValid = Utils.isValidNumber(value, 0.001, 10);
        errorMessage = 'Must be between 0.001% and 10%';
        break;
      case 'stellarMagnitude':
        isValid = Utils.isValidNumber(value, -5, 20);
        errorMessage = 'Must be between -5 and 20';
        break;
      case 'equilibriumTemperature':
        isValid = Utils.isValidNumber(value, 50, 3000);
        errorMessage = 'Must be between 50K and 3000K';
        break;
    }

    // Update input styling
    input.classList.toggle('error', !isValid);
    
    // Show/hide error message
    let errorElement = input.parentNode.querySelector('.form-error');
    if (!isValid) {
      if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'form-error';
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