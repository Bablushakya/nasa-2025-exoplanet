// ExoPlanet AI - Enhanced Dashboard with Space Animations

/**
 * Enhanced Dashboard Manager with Space-Themed Animations
 */
class EnhancedDashboardManager extends DashboardManager {
  constructor() {
    super();
    this.animationQueue = [];
    this.isProcessing = false;
    this.predictionAnimations = new Map();
    this.chartAnimations = new Map();
  }

  /**
   * Initialize enhanced dashboard
   */
  async init() {
    await super.init();
    this.initializeEnhancedAnimations();
    this.setupAdvancedInteractions();
    this.createLiveDataStream();
  }

  /**
   * Initialize enhanced animations
   */
  initializeEnhancedAnimations() {
    this.createDashboardBackground();
    this.setupFormAnimations();
    this.setupResultAnimations();
    this.setupChartEnhancements();
    this.initializeLiveElements();
  }

  /**
   * Create animated dashboard background
   */
  createDashboardBackground() {
    const dashboard = document.querySelector('.dashboard-main');
    if (!dashboard) return;

    // Create constellation background
    const constellation = document.createElement('div');
    constellation.className = 'constellation-background';
    constellation.innerHTML = this.generateConstellationHTML();
    
    dashboard.appendChild(constellation);
    
    // Add constellation styles
    this.addConstellationStyles();
  }

  /**
   * Generate constellation HTML
   */
  generateConstellationHTML() {
    const stars = [];
    const connections = [];
    
    // Generate star positions
    const starPositions = [
      { x: 10, y: 20 }, { x: 25, y: 15 }, { x: 40, y: 25 },
      { x: 60, y: 10 }, { x: 75, y: 30 }, { x: 90, y: 20 },
      { x: 15, y: 60 }, { x: 35, y: 70 }, { x: 55, y: 65 },
      { x: 80, y: 75 }, { x: 20, y: 90 }, { x: 70, y: 85 }
    ];
    
    // Create stars
    starPositions.forEach((pos, i) => {
      stars.push(`
        <div class="constellation-star" 
             style="left: ${pos.x}%; top: ${pos.y}%;"
             data-star="${i}">
        </div>
      `);
    });
    
    // Create connections
    const connectionPairs = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
      [6, 7], [7, 8], [8, 9], [10, 11]
    ];
    
    connectionPairs.forEach(([start, end], i) => {
      const startPos = starPositions[start];
      const endPos = starPositions[end];
      const length = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));
      const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x) * 180 / Math.PI;
      
      connections.push(`
        <div class="constellation-line" 
             style="left: ${startPos.x}%; top: ${startPos.y}%; 
                    width: ${length}%; transform: rotate(${angle}deg);"
             data-connection="${i}">
        </div>
      `);
    });
    
    return `
      <div class="constellation-container">
        ${stars.join('')}
        ${connections.join('')}
      </div>
    `;
  }

  /**
   * Add constellation styles
   */
  addConstellationStyles() {
    if (document.getElementById('constellation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'constellation-styles';
    style.textContent = `
      .constellation-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
      }
      
      .constellation-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .constellation-star {
        position: absolute;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #6366f1, #4f46e5);
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
        animation: starTwinkle 3s ease-in-out infinite;
      }
      
      .constellation-star:nth-child(odd) {
        animation-delay: -1.5s;
      }
      
      .constellation-line {
        position: absolute;
        height: 1px;
        background: linear-gradient(90deg, rgba(99, 102, 241, 0.4), rgba(99, 102, 241, 0.1));
        transform-origin: left center;
        animation: lineGlow 4s ease-in-out infinite;
      }
      
      .constellation-line:nth-child(even) {
        animation-delay: -2s;
      }
      
      @keyframes lineGlow {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.8; }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Setup form animations
   */
  setupFormAnimations() {
    const form = document.getElementById('detection-form');
    if (!form) return;

    // Animate form inputs on focus
    const inputs = form.querySelectorAll('input[type="number"]');
    inputs.forEach((input, index) => {
      input.addEventListener('focus', () => {
        this.animateInputFocus(input, index);
      });
      
      input.addEventListener('input', () => {
        this.validateInputWithAnimation(input);
      });
    });

    // Enhanced submit animation
    const submitBtn = form.querySelector('.btn-analyze');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.triggerAnalysisAnimation();
      });
    }
  }

  /**
   * Animate input focus with space theme
   */
  animateInputFocus(input, index) {
    // Create orbital rings around input
    const orbitalRing = document.createElement('div');
    orbitalRing.className = 'input-orbital-ring';
    orbitalRing.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 120%;
      height: 120%;
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: 8px;
      transform: translate(-50%, -50%);
      animation: orbitPulse 2s ease-in-out infinite;
      pointer-events: none;
      z-index: -1;
    `;
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(orbitalRing);
    
    // Remove on blur
    input.addEventListener('blur', () => {
      if (orbitalRing.parentNode) {
        orbitalRing.remove();
      }
    }, { once: true });
  }

  /**
   * Validate input with animation
   */
  validateInputWithAnimation(input) {
    const value = parseFloat(input.value);
    const isValid = this.validateInput(input);
    
    if (isValid) {
      this.createValidationSuccessEffect(input);
    } else {
      this.createValidationErrorEffect(input);
    }
  }

  /**
   * Create validation success effect
   */
  createValidationSuccessEffect(input) {
    const effect = document.createElement('div');
    effect.className = 'validation-success-effect';
    effect.innerHTML = '✓';
    effect.style.cssText = `
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      color: #10b981;
      font-weight: bold;
      animation: validationSuccess 0.5s ease-out;
      pointer-events: none;
    `;
    
    input.parentNode.appendChild(effect);
    
    setTimeout(() => {
      if (effect.parentNode) {
        effect.remove();
      }
    }, 2000);
  }

  /**
   * Create validation error effect
   */
  createValidationErrorEffect(input) {
    input.style.animation = 'inputShake 0.5s ease-in-out';
    
    setTimeout(() => {
      input.style.animation = '';
    }, 500);
  }

  /**
   * Trigger analysis animation
   */
  async triggerAnalysisAnimation() {
    const form = document.getElementById('detection-form');
    const submitBtn = form.querySelector('.btn-analyze');
    
    // Start processing animation
    this.isProcessing = true;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <div class="processing-animation">
        <div class="ai-brain">
          <div class="neuron"></div>
          <div class="neuron"></div>
          <div class="neuron"></div>
        </div>
        <span>AI Analyzing...</span>
      </div>
    `;
    
    // Add processing styles
    this.addProcessingStyles();
    
    // Simulate AI processing
    await this.simulateAIProcessing();
    
    // Handle form submission
    await this.handlePredictionSubmit(form);
    
    // Reset button
    this.isProcessing = false;
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <i class="fas fa-search"></i>
      Analyze Data
    `;
  }

  /**
   * Add processing animation styles
   */
  addProcessingStyles() {
    if (document.getElementById('processing-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'processing-styles';
    style.textContent = `
      .processing-animation {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .ai-brain {
        display: flex;
        gap: 4px;
      }
      
      .neuron {
        width: 8px;
        height: 8px;
        background: #ffffff;
        border-radius: 50%;
        animation: neuronPulse 1.5s ease-in-out infinite;
      }
      
      .neuron:nth-child(1) { animation-delay: 0s; }
      .neuron:nth-child(2) { animation-delay: 0.3s; }
      .neuron:nth-child(3) { animation-delay: 0.6s; }
      
      @keyframes neuronPulse {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes orbitPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
      }
      
      @keyframes validationSuccess {
        0% { transform: translateY(-50%) scale(0); opacity: 0; }
        50% { transform: translateY(-50%) scale(1.2); opacity: 1; }
        100% { transform: translateY(-50%) scale(1); opacity: 1; }
      }
      
      @keyframes inputShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Simulate AI processing with visual effects
   */
  async simulateAIProcessing() {
    const processingSteps = [
      'Analyzing orbital parameters...',
      'Processing transit data...',
      'Running neural network...',
      'Calculating probabilities...',
      'Generating results...'
    ];
    
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update processing text
      const processingText = document.querySelector('.processing-animation span');
      if (processingText) {
        processingText.textContent = processingSteps[i];
      }
      
      // Create processing particle effect
      this.createProcessingParticles();
    }
  }

  /**
   * Create processing particles
   */
  createProcessingParticles() {
    const dashboard = document.querySelector('.dashboard-content');
    if (!dashboard) return;
    
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'processing-particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #6366f1;
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particleFlow 2s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;
      
      dashboard.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 2000);
    }
  }

  /**
   * Setup result animations
   */
  setupResultAnimations() {
    // Override parent method to add enhanced animations
    const originalDisplayResult = this.displayPredictionResult.bind(this);
    
    this.displayPredictionResult = (prediction) => {
      // Call original method
      originalDisplayResult(prediction);
      
      // Add enhanced animations
      this.animateResultsReveal(prediction);
    };
  }

  /**
   * Animate results reveal with space theme
   */
  animateResultsReveal(prediction) {
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection) return;
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.classList.add('animate-discovery');
    
    // Create exoplanet discovery effect
    spaceAnimations.createDiscoveryEffect(resultsSection);
    
    // Animate individual result elements
    const resultElements = resultsSection.querySelectorAll('.result-card, .metrics-card, .probability-card');
    resultElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 200);
    });
    
    // Animate confidence meter
    this.animateConfidenceMeter(prediction.confidence);
    
    // Animate probability bars
    this.animateProbabilityBars(prediction.probability);
  }

  /**
   * Animate confidence meter
   */
  animateConfidenceMeter(confidence) {
    const progressFill = document.getElementById('confidence-progress');
    const confidenceValue = document.getElementById('confidence-value');
    
    if (!progressFill || !confidenceValue) return;
    
    // Reset and animate
    progressFill.style.width = '0%';
    confidenceValue.textContent = '0%';
    
    setTimeout(() => {
      progressFill.style.transition = 'width 2s ease-out';
      progressFill.style.width = `${confidence}%`;
      
      // Animate counter
      Utils.animateCounter(confidenceValue, confidence, 2000, (val) => `${val.toFixed(1)}%`);
    }, 500);
  }

  /**
   * Animate probability bars
   */
  animateProbabilityBars(probabilities) {
    if (!probabilities) return;
    
    const probabilityBars = document.querySelectorAll('.probability-bar .fill');
    
    Object.entries(probabilities).forEach(([key, value], index) => {
      const bar = probabilityBars[index];
      if (!bar) return;
      
      bar.style.width = '0%';
      
      setTimeout(() => {
        bar.style.transition = 'width 1.5s ease-out';
        bar.style.width = `${(value * 100).toFixed(1)}%`;
      }, index * 300);
    });
  }

  /**
   * Setup chart enhancements
   */
  setupChartEnhancements() {
    // Enhanced chart animations will be handled by the chart manager
    const charts = document.querySelectorAll('canvas[id*="chart"]');
    
    charts.forEach(canvas => {
      this.enhanceChart(canvas);
    });
  }

  /**
   * Enhance individual chart
   */
  enhanceChart(canvas) {
    if (!canvas) return;
    
    // Add hover effects
    canvas.addEventListener('mouseenter', () => {
      canvas.style.filter = 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.4))';
      canvas.style.transform = 'scale(1.02)';
      canvas.style.transition = 'all 0.3s ease';
    });
    
    canvas.addEventListener('mouseleave', () => {
      canvas.style.filter = '';
      canvas.style.transform = '';
    });
    
    // Add click animation
    canvas.addEventListener('click', () => {
      this.createChartClickEffect(canvas);
    });
  }

  /**
   * Create chart click effect
   */
  createChartClickEffect(canvas) {
    const effect = document.createElement('div');
    effect.className = 'chart-click-effect';
    effect.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border: 2px solid #6366f1;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: chartRipple 0.6s ease-out forwards;
      pointer-events: none;
    `;
    
    canvas.parentNode.style.position = 'relative';
    canvas.parentNode.appendChild(effect);
    
    setTimeout(() => {
      if (effect.parentNode) {
        effect.remove();
      }
    }, 600);
  }

  /**
   * Initialize live elements
   */
  initializeLiveElements() {
    this.createLiveStatusIndicator();
    this.setupRealtimeUpdates();
  }

  /**
   * Create live status indicator
   */
  createLiveStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'live-status-indicator';
    indicator.innerHTML = `
      <div class="status-pulse"></div>
      <span>Live Data</span>
    `;
    indicator.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #10b981;
      z-index: 1000;
    `;
    
    document.body.appendChild(indicator);
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      .status-pulse {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        animation: statusPulse 2s ease-in-out infinite;
      }
      
      @keyframes statusPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(1.2); }
      }
      
      @keyframes chartRipple {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
      }
      
      @keyframes particleFlow {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0) translateY(-50px); }
      }
    `;
    
    if (!document.getElementById('live-status-styles')) {
      style.id = 'live-status-styles';
      document.head.appendChild(style);
    }
  }

  /**
   * Setup realtime updates
   */
  setupRealtimeUpdates() {
    // Simulate live data updates
    setInterval(() => {
      this.updateLiveStatistics();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Update live statistics with animation
   */
  updateLiveStatistics() {
    const statCards = document.querySelectorAll('.quick-stat .stat-value');
    
    statCards.forEach(card => {
      const currentValue = parseInt(card.textContent);
      const newValue = currentValue + Math.floor(Math.random() * 5);
      
      // Animate value change
      card.style.animation = 'statUpdate 0.5s ease-in-out';
      
      setTimeout(() => {
        Utils.animateCounter(card, newValue, 1000, (val) => Math.floor(val).toString());
        card.style.animation = '';
      }, 250);
    });
  }

  /**
   * Create live data stream visualization
   */
  createLiveDataStream() {
    const dashboard = document.querySelector('.dashboard-main');
    if (!dashboard) return;
    
    const dataStream = document.createElement('div');
    dataStream.className = 'live-data-stream';
    dataStream.innerHTML = this.generateDataStreamHTML();
    
    dashboard.appendChild(dataStream);
    
    // Add data stream styles
    this.addDataStreamStyles();
  }

  /**
   * Generate data stream HTML
   */
  generateDataStreamHTML() {
    const dataPoints = [
      '01001010', '11010011', '00110101', '10101010',
      '01110010', '11001100', '00101101', '10011001'
    ];
    
    return `
      <div class="data-stream-container">
        ${dataPoints.map((data, i) => `
          <div class="data-point" style="animation-delay: ${i * 0.5}s;">
            ${data}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Add data stream styles
   */
  addDataStreamStyles() {
    if (document.getElementById('data-stream-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'data-stream-styles';
    style.textContent = `
      .live-data-stream {
        position: fixed;
        top: 0;
        right: 0;
        width: 200px;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
        opacity: 0.1;
      }
      
      .data-stream-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .data-point {
        position: absolute;
        right: 20px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #6366f1;
        animation: dataFlow 8s linear infinite;
      }
      
      .data-point:nth-child(odd) {
        right: 40px;
        color: #8b5cf6;
      }
      
      @keyframes dataFlow {
        0% { transform: translateY(100vh); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100px); opacity: 0; }
      }
      
      @keyframes statUpdate {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); color: #6366f1; }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Enhanced prediction submission with space effects
   */
  async handlePredictionSubmit(form) {
    try {
      // Get form data
      const formData = new FormData(form);
      const data = {
        orbital_period: parseFloat(formData.get('orbitalPeriod') || document.getElementById('orbital-period').value),
        transit_duration: parseFloat(formData.get('transitDuration') || document.getElementById('transit-duration').value),
        planetary_radius: parseFloat(formData.get('planetaryRadius') || document.getElementById('planetary-radius').value),
        transit_depth: parseFloat(formData.get('transitDepth') || document.getElementById('transit-depth').value),
        stellar_magnitude: parseFloat(formData.get('stellarMagnitude') || document.getElementById('stellar-magnitude').value),
        equilibrium_temperature: parseFloat(formData.get('equilibriumTemperature') || document.getElementById('equilibrium-temperature').value)
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

      // Make prediction with enhanced animation
      const response = await apiService.predictExoplanet(data);
      
      if (response.success) {
        // Display results with enhanced animations
        this.displayPredictionResult(response.data);
        
        // Add to predictions history
        this.data.predictions.unshift(response.data);
        this.updatePredictionsTable();
        
        // Show success message with space effect
        if (window.app && window.app.toastManager) {
          window.app.toastManager.show('🌟 Exoplanet analysis complete!', 'success');
        }
        
        // Trigger celebration animation for high confidence
        if (response.data.confidence > 90) {
          this.triggerCelebrationAnimation();
        }
      }

    } catch (error) {
      console.error('Prediction failed:', error);
      
      // Show error with space-themed animation
      if (window.app && window.app.toastManager) {
        window.app.toastManager.show(`🚀 Analysis failed: ${error.message}`, 'error');
      }
      
      // Shake form on error
      form.style.animation = 'formShake 0.5s ease-in-out';
      setTimeout(() => {
        form.style.animation = '';
      }, 500);
    }
  }

  /**
   * Trigger celebration animation for high confidence predictions
   */
  triggerCelebrationAnimation() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration-animation';
    celebration.innerHTML = `
      <div class="celebration-stars">
        ${Array.from({length: 12}, (_, i) => `
          <div class="celebration-star" style="--delay: ${i * 0.1}s; --angle: ${i * 30}deg;">
            ⭐
          </div>
        `).join('')}
      </div>
      <div class="celebration-text">
        Exoplanet Discovered! 🌟
      </div>
    `;
    
    celebration.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      pointer-events: none;
    `;
    
    document.body.appendChild(celebration);
    
    // Add celebration styles
    this.addCelebrationStyles();
    
    // Remove after animation
    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.remove();
      }
    }, 3000);
  }

  /**
   * Add celebration animation styles
   */
  addCelebrationStyles() {
    if (document.getElementById('celebration-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'celebration-styles';
    style.textContent = `
      .celebration-stars {
        position: relative;
        width: 200px;
        height: 200px;
      }
      
      .celebration-star {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 24px;
        animation: celebrationStar 2s ease-out forwards;
        animation-delay: var(--delay);
        transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-100px);
      }
      
      .celebration-text {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #6366f1;
        margin-top: 20px;
        animation: celebrationText 1s ease-out;
      }
      
      @keyframes celebrationStar {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(0);
        }
        50% {
          opacity: 1;
          transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-100px) scale(1.2);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-200px) scale(0);
        }
      }
      
      @keyframes celebrationText {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1.1); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes formShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Setup advanced interactions
   */
  setupAdvancedInteractions() {
    // Add keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Add gesture support for mobile
    this.setupGestureSupport();
    
    // Add voice commands (if supported)
    this.setupVoiceCommands();
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter to analyze
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const analyzeBtn = document.querySelector('.btn-analyze');
        if (analyzeBtn && !analyzeBtn.disabled) {
          analyzeBtn.click();
        }
      }
      
      // Escape to clear form
      if (e.key === 'Escape') {
        const form = document.getElementById('detection-form');
        if (form) {
          form.reset();
        }
      }
    });
  }

  /**
   * Setup gesture support
   */
  setupGestureSupport() {
    if (Utils.getDeviceType() !== 'mobile') return;
    
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].screenY;
      this.handleGesture();
    });
    
    const handleGesture = () => {
      const swipeDistance = touchStartY - touchEndY;
      
      // Swipe up to analyze (if form is filled)
      if (swipeDistance > 50) {
        const form = document.getElementById('detection-form');
        const analyzeBtn = document.querySelector('.btn-analyze');
        
        if (form && analyzeBtn && !analyzeBtn.disabled) {
          // Check if form has data
          const inputs = form.querySelectorAll('input[required]');
          const hasData = Array.from(inputs).every(input => input.value.trim() !== '');
          
          if (hasData) {
            analyzeBtn.click();
          }
        }
      }
    };
  }

  /**
   * Setup voice commands (experimental)
   */
  setupVoiceCommands() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      
      if (command.includes('analyze') || command.includes('detect')) {
        const analyzeBtn = document.querySelector('.btn-analyze');
        if (analyzeBtn && !analyzeBtn.disabled) {
          analyzeBtn.click();
        }
      }
    };
    
    // Add voice command button
    this.addVoiceCommandButton(recognition);
  }

  /**
   * Add voice command button
   */
  addVoiceCommandButton(recognition) {
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'voice-command-btn';
    voiceBtn.innerHTML = '🎤';
    voiceBtn.title = 'Voice Commands';
    voiceBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.9);
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s ease;
    `;
    
    voiceBtn.addEventListener('click', () => {
      recognition.start();
      voiceBtn.style.background = 'rgba(239, 68, 68, 0.9)';
      
      setTimeout(() => {
        voiceBtn.style.background = 'rgba(99, 102, 241, 0.9)';
      }, 3000);
    });
    
    document.body.appendChild(voiceBtn);
  }
}

// Initialize enhanced dashboard
const enhancedDashboard = new EnhancedDashboardManager();

// Export for global use
window.enhancedDashboard = enhancedDashboard;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('dashboard.html')) {
    enhancedDashboard.init();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnhancedDashboardManager, enhancedDashboard };
}