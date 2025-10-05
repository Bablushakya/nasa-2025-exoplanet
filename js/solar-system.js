// ExoPlanet AI - Solar System Visualization

/**
 * Solar System Manager
 */
class SolarSystemManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.solarSystemData = null;
    this.animationId = null;
    this.isPlaying = false;
    this.speed = 0.5; // Reduced default speed for more realistic motion
    this.scale = 'visual';
    this.view = 'overview';
    this.selectedPlanet = null;
    this.time = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.zoom = 1;
    this.isFullscreen = false;
    this.isDragging = false;
    this.lastMousePos = { x: 0, y: 0 };
    this.panOffset = { x: 0, y: 0 };
    this.isInitialized = false;
  }

  /**
   * Initialize solar system
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Get canvas and context
      this.canvas = document.getElementById('solar-system-canvas');
      if (!this.canvas) {
        console.error('Solar system canvas not found');
        return;
      }

      this.ctx = this.canvas.getContext('2d');
      this.setupCanvas();

      // Load solar system data
      await this.loadSolarSystemData();

      // Initialize controls
      this.initializeControls();

      // Initialize planet cards
      this.initializePlanetCards();

      // Start rendering
      this.render();

      this.isInitialized = true;
      console.log('Solar system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize solar system:', error);
    }
  }

  /**
   * Setup canvas
   */
  setupCanvas() {
    const container = this.canvas.parentElement;
    const resizeCanvas = () => {
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
      this.centerX = this.canvas.width / 2;
      this.centerY = this.canvas.height / 2;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Add click handler for planet selection
    this.canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e);
    });

    // Add mouse interaction handlers
    this.setupMouseInteractions();
  }

  /**
   * Load solar system data
   */
  async loadSolarSystemData() {
    try {
      const response = await apiService.getSolarSystemData();
      if (response.success) {
        this.solarSystemData = response.data;
      } else {
        // Fallback to local data
        this.solarSystemData = await this.loadLocalSolarSystemData();
      }
    } catch (error) {
      console.warn('Failed to load from API, using local data:', error);
      this.solarSystemData = await this.loadLocalSolarSystemData();
    }
  }

  /**
   * Load local solar system data (fallback)
   */
  async loadLocalSolarSystemData() {
    // Fallback solar system data
    return {
      planets: [
        {
          id: "mercury", name: "Mercury", order: 1, radius_km: 2439.7,
          semi_major_axis_au: 0.387, orbital_period_days: 87.97,
          color: "#8C7853", type: "terrestrial"
        },
        {
          id: "venus", name: "Venus", order: 2, radius_km: 6051.8,
          semi_major_axis_au: 0.723, orbital_period_days: 224.7,
          color: "#FFC649", type: "terrestrial"
        },
        {
          id: "earth", name: "Earth", order: 3, radius_km: 6371,
          semi_major_axis_au: 1.0, orbital_period_days: 365.25,
          color: "#4169E1", type: "terrestrial"
        },
        {
          id: "mars", name: "Mars", order: 4, radius_km: 3389.5,
          semi_major_axis_au: 1.524, orbital_period_days: 686.98,
          color: "#CD5C5C", type: "terrestrial"
        },
        {
          id: "jupiter", name: "Jupiter", order: 5, radius_km: 69911,
          semi_major_axis_au: 5.204, orbital_period_days: 4332.59,
          color: "#DAA520", type: "gas_giant"
        },
        {
          id: "saturn", name: "Saturn", order: 6, radius_km: 58232,
          semi_major_axis_au: 9.582, orbital_period_days: 10759.22,
          color: "#F4A460", type: "gas_giant"
        },
        {
          id: "uranus", name: "Uranus", order: 7, radius_km: 25362,
          semi_major_axis_au: 19.19, orbital_period_days: 30688.5,
          color: "#4FD0E0", type: "ice_giant"
        },
        {
          id: "neptune", name: "Neptune", order: 8, radius_km: 24622,
          semi_major_axis_au: 30.07, orbital_period_days: 60182,
          color: "#4169E1", type: "ice_giant"
        }
      ],
      sun: {
        id: "sun", name: "Sun", radius_km: 696000, color: "#FDB813"
      }
    };
  }

  /**
   * Initialize controls
   */
  initializeControls() {
    // Show loading screen
    this.showLoadingScreen();

    // Play/Pause button
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.toggleAnimation();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetSimulation();
      });
    }

    // Fullscreen button
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }

    // Speed slider and presets
    this.initializeSpeedControls();

    // View tabs
    this.initializeViewTabs();

    // Toggle switches
    this.initializeToggleSwitches();

    // Time controls
    this.initializeTimeControls();

    // Canvas interactions
    this.initializeCanvasInteractions();

    // Hide loading screen after initialization
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 2000);
  }

  /**
   * Show loading screen with progress
   */
  showLoadingScreen() {
    const loadingScreen = document.getElementById('canvas-loading');
    const progressFill = document.getElementById('loading-progress');
    const progressText = document.getElementById('loading-text');
    
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
      
      // Simulate loading progress
      let progress = 0;
      const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(loadingInterval);
        }
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${Math.round(progress)}%`;
      }, 100);
    }
  }

  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('canvas-loading');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }
  }

  /**
   * Initialize speed controls
   */
  initializeSpeedControls() {
    // Speed slider
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    
    if (speedSlider && speedValue) {
      speedSlider.addEventListener('input', (e) => {
        this.speed = parseFloat(e.target.value);
        speedValue.textContent = `${this.speed.toFixed(1)}x`;
        this.updateSpeedPresets();
      });
    }

    // Speed presets
    const speedPresets = document.querySelectorAll('.speed-preset');
    speedPresets.forEach(preset => {
      preset.addEventListener('click', () => {
        const speed = parseFloat(preset.dataset.speed);
        this.setSpeed(speed);
        
        // Update active preset
        speedPresets.forEach(p => p.classList.remove('active'));
        preset.classList.add('active');
      });
    });
  }

  /**
   * Set speed and update UI
   */
  setSpeed(speed) {
    this.speed = speed;
    
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    
    if (speedSlider) speedSlider.value = speed;
    if (speedValue) speedValue.textContent = `${speed.toFixed(1)}x`;
    
    // Show speed change feedback
    if (window.app && window.app.toastManager) {
      window.app.toastManager.show(`⚡ Speed set to ${speed.toFixed(1)}x`, 'info', 1500);
    }
  }

  /**
   * Update speed presets active state
   */
  updateSpeedPresets() {
    const speedPresets = document.querySelectorAll('.speed-preset');
    speedPresets.forEach(preset => {
      const presetSpeed = parseFloat(preset.dataset.speed);
      if (Math.abs(presetSpeed - this.speed) < 0.05) {
        preset.classList.add('active');
      } else {
        preset.classList.remove('active');
      }
    });
  }

  /**
   * Initialize view tabs
   */
  initializeViewTabs() {
    const viewTabs = document.querySelectorAll('.view-tab');
    viewTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        this.setView(view);
        
        // Update active tab
        viewTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }

  /**
   * Set view mode
   */
  setView(view) {
    this.view = view;
    this.updateView();
  }

  /**
   * Initialize toggle switches
   */
  initializeToggleSwitches() {
    // Scale toggle
    const scaleToggle = document.getElementById('scale-toggle');
    if (scaleToggle) {
      scaleToggle.addEventListener('change', (e) => {
        this.scale = e.target.checked ? 'visual' : 'realistic';
      });
    }

    // Orbits toggle
    const orbitsToggle = document.getElementById('orbits-toggle');
    if (orbitsToggle) {
      orbitsToggle.addEventListener('change', (e) => {
        this.showOrbits = e.target.checked;
      });
    }

    // Labels toggle
    const labelsToggle = document.getElementById('labels-toggle');
    if (labelsToggle) {
      labelsToggle.addEventListener('change', (e) => {
        this.showLabels = e.target.checked;
      });
    }

    // Trails toggle
    const trailsToggle = document.getElementById('trails-toggle');
    if (trailsToggle) {
      trailsToggle.addEventListener('change', (e) => {
        this.showTrails = e.target.checked;
        if (!this.showTrails) {
          this.clearTrails();
        }
      });
    }
  }

  /**
   * Initialize time controls
   */
  initializeTimeControls() {
    const timeBackward = document.getElementById('time-backward');
    const timeToday = document.getElementById('time-today');
    const timeForward = document.getElementById('time-forward');

    if (timeBackward) {
      timeBackward.addEventListener('click', () => {
        this.time -= 365; // Go back 1 year
        this.updateSimulationDate();
      });
    }

    if (timeToday) {
      timeToday.addEventListener('click', () => {
        this.time = 0; // Reset to today
        this.updateSimulationDate();
      });
    }

    if (timeForward) {
      timeForward.addEventListener('click', () => {
        this.time += 365; // Go forward 1 year
        this.updateSimulationDate();
      });
    }
  }

  /**
   * Initialize canvas interactions
   */
  initializeCanvasInteractions() {
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Mouse down
    this.canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      this.canvas.style.cursor = 'grabbing';
    });

    // Mouse move
    this.canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        this.centerX += deltaX;
        this.centerY += deltaY;
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });

    // Mouse up
    this.canvas.addEventListener('mouseup', () => {
      isDragging = false;
      this.canvas.style.cursor = 'crosshair';
    });

    // Mouse leave
    this.canvas.addEventListener('mouseleave', () => {
      isDragging = false;
      this.canvas.style.cursor = 'crosshair';
    });

    // Zoom with mouse wheel
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoom = Math.max(0.1, Math.min(5, this.zoom * zoomFactor));
    });
  }

  /**
   * Reset simulation
   */
  resetSimulation() {
    this.time = 0;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.zoom = 1;
    this.selectedPlanet = null;
    this.clearTrails();
    this.updateSimulationDate();
    this.hideSelectedPlanetInfo();
    
    // Show success feedback
    if (window.app && window.app.toastManager) {
      window.app.toastManager.show('Solar system reset to initial state', 'success');
    }
  }

  /**
   * Toggle animation
   */
  toggleAnimation() {
    this.isPlaying = !this.isPlaying;
    const playPauseBtn = document.getElementById('play-pause-btn');
    const icon = playPauseBtn?.querySelector('i');
    const text = playPauseBtn?.querySelector('span');

    if (this.isPlaying) {
      icon?.classList.replace('fa-play', 'fa-pause');
      if (text) text.textContent = 'Pause';
      this.animate();
    } else {
      icon?.classList.replace('fa-pause', 'fa-play');
      if (text) text.textContent = 'Play';
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isPlaying) return;

    this.time += this.speed * 0.002; // Much slower, more realistic speed
    this.render();
    this.updateSimulationDate();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Update simulation date
   */
  updateSimulationDate() {
    const dateElement = document.getElementById('simulation-date');
    if (dateElement) {
      const baseDate = new Date(2025, 0, 1); // January 1, 2025
      const daysElapsed = this.time * 365; // Convert time to days
      const currentDate = new Date(baseDate.getTime() + daysElapsed * 24 * 60 * 60 * 1000);
      dateElement.textContent = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  /**
   * Render solar system
   */
  render() {
    if (!this.ctx || !this.solarSystemData) return;

    // Clear canvas
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw stars background
    this.drawStars();

    // Draw sun
    this.drawSun();

    // Draw planet orbits
    this.drawOrbits();

    // Draw planets
    this.drawPlanets();

    // Draw labels
    this.drawLabels();
  }

  /**
   * Draw stars background
   */
  drawStars() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 2;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Draw sun
   */
  drawSun() {
    const sunRadius = (this.scale === 'realistic' ? 20 : 15) * this.zoom;
    const sunX = this.centerX + this.panOffset.x;
    const sunY = this.centerY + this.panOffset.y;
    
    // Sun glow
    const gradient = this.ctx.createRadialGradient(
      sunX, sunY, 0,
      sunX, sunY, sunRadius * 2
    );
    gradient.addColorStop(0, 'rgba(253, 184, 19, 0.8)');
    gradient.addColorStop(0.5, 'rgba(253, 184, 19, 0.4)');
    gradient.addColorStop(1, 'rgba(253, 184, 19, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Sun body
    this.ctx.fillStyle = this.solarSystemData.sun.color;
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw planet orbits
   */
  drawOrbits() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;

    this.solarSystemData.planets.forEach(planet => {
      const orbitRadius = this.getOrbitRadius(planet) * this.zoom;
      const sunX = this.centerX + this.panOffset.x;
      const sunY = this.centerY + this.panOffset.y;
      
      this.ctx.beginPath();
      this.ctx.arc(sunX, sunY, orbitRadius, 0, Math.PI * 2);
      this.ctx.stroke();
    });
  }

  /**
   * Draw planets
   */
  drawPlanets() {
    this.solarSystemData.planets.forEach(planet => {
      const orbitRadius = this.getOrbitRadius(planet) * this.zoom;
      const planetRadius = this.getPlanetRadius(planet) * this.zoom;
      const angle = this.getPlanetAngle(planet);
      
      const x = this.centerX + this.panOffset.x + Math.cos(angle) * orbitRadius;
      const y = this.centerY + this.panOffset.y + Math.sin(angle) * orbitRadius;

      // Planet shadow/glow
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, planetRadius * 2);
      gradient.addColorStop(0, planet.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, planetRadius * 1.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Planet body
      this.ctx.fillStyle = planet.color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, planetRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // Highlight selected planet
      if (this.selectedPlanet && this.selectedPlanet.id === planet.id) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, planetRadius + 3, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      // Store planet position for click detection
      planet._x = x;
      planet._y = y;
      planet._radius = planetRadius;
    });
  }

  /**
   * Draw labels
   */
  drawLabels() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px Inter';
    this.ctx.textAlign = 'center';

    this.solarSystemData.planets.forEach(planet => {
      if (planet._x && planet._y) {
        this.ctx.fillText(
          planet.name,
          planet._x,
          planet._y + planet._radius + 15
        );
      }
    });
  }

  /**
   * Get orbit radius for planet
   */
  getOrbitRadius(planet) {
    const baseRadius = 50;
    const scaleFactor = this.scale === 'realistic' ? 
      Math.log(planet.semi_major_axis_au + 1) * 40 :
      planet.semi_major_axis_au * 30;
    
    return Math.min(baseRadius + scaleFactor, this.canvas.width / 2 - 50);
  }

  /**
   * Get planet radius
   */
  getPlanetRadius(planet) {
    if (this.scale === 'realistic') {
      return Math.max(2, Math.log(planet.radius_km / 1000) * 2);
    } else {
      return Math.max(3, Math.log(planet.radius_km / 1000) * 3 + 5);
    }
  }

  /**
   * Get planet angle based on time and orbital period
   */
  getPlanetAngle(planet) {
    const period = planet.orbital_period_days;
    return (this.time * 365 / period) * Math.PI * 2;
  }

  /**
   * Handle canvas click
   */
  handleCanvasClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a planet
    for (const planet of this.solarSystemData.planets) {
      if (planet._x && planet._y) {
        const distance = Math.sqrt(
          Math.pow(x - planet._x, 2) + Math.pow(y - planet._y, 2)
        );
        
        if (distance <= planet._radius + 5) {
          this.selectPlanet(planet);
          return;
        }
      }
    }

    // Click on sun
    const sunDistance = Math.sqrt(
      Math.pow(x - this.centerX, 2) + Math.pow(y - this.centerY, 2)
    );
    if (sunDistance <= 20) {
      this.selectPlanet(this.solarSystemData.sun);
    }
  }

  /**
   * Select planet and show details
   */
  async selectPlanet(planet) {
    this.selectedPlanet = planet;
    
    // Get detailed planet data from API
    try {
      const response = await apiService.getPlanetDetails(planet.id);
      if (response.success) {
        this.showPlanetDetails(response.data);
      } else {
        this.showPlanetDetails(planet);
      }
    } catch (error) {
      console.warn('Failed to load planet details:', error);
      this.showPlanetDetails(planet);
    }
  }

  /**
   * Show planet details panel
   */
  showPlanetDetails(planet) {
    const infoSection = document.getElementById('planet-info-section');
    if (!infoSection) return;

    // Update planet information
    this.updatePlanetInfo(planet);
    
    // Show the section
    infoSection.style.display = 'block';
    infoSection.scrollIntoView({ behavior: 'smooth' });

    // Create comparison chart
    this.createPlanetComparisonChart(planet);
  }

  /**
   * Update planet information display
   */
  updatePlanetInfo(planet) {
    // Basic info
    const nameElement = document.getElementById('planet-name');
    const nameDescElement = document.getElementById('planet-name-desc');
    const typeElement = document.getElementById('planet-type');
    const descriptionElement = document.getElementById('planet-description');

    if (nameElement) nameElement.textContent = planet.name;
    if (nameDescElement) nameDescElement.textContent = planet.name;
    if (typeElement) typeElement.textContent = planet.type?.replace('_', ' ').toUpperCase() || 'CELESTIAL BODY';
    if (descriptionElement) descriptionElement.textContent = planet.description || 'No description available.';

    // Quick stats
    const distanceElement = document.getElementById('planet-distance');
    const periodElement = document.getElementById('planet-period');
    const radiusElement = document.getElementById('planet-radius');

    if (distanceElement) distanceElement.textContent = planet.semi_major_axis_au ? `${planet.semi_major_axis_au} AU` : 'N/A';
    if (periodElement) periodElement.textContent = planet.orbital_period_days ? `${planet.orbital_period_days.toFixed(1)} days` : 'N/A';
    if (radiusElement) radiusElement.textContent = planet.radius_km ? `${planet.radius_km.toLocaleString()} km` : 'N/A';

    // Detailed metrics
    const massElement = document.getElementById('planet-mass');
    const gravityElement = document.getElementById('planet-gravity');
    const temperatureElement = document.getElementById('planet-temperature');
    const escapeElement = document.getElementById('planet-escape');
    const rotationElement = document.getElementById('planet-rotation');
    const moonsElement = document.getElementById('planet-moons');

    if (massElement) massElement.textContent = planet.mass_kg ? `${planet.mass_kg.toExponential(2)} kg` : 'N/A';
    if (gravityElement) gravityElement.textContent = planet.surface_gravity_ms2 ? `${planet.surface_gravity_ms2} m/s²` : 'N/A';
    if (temperatureElement) temperatureElement.textContent = planet.surface_temp_k ? `${planet.surface_temp_k} K` : 'N/A';
    if (escapeElement) escapeElement.textContent = planet.escape_velocity_kms ? `${planet.escape_velocity_kms} km/s` : 'N/A';
    if (rotationElement) rotationElement.textContent = planet.rotation_period_hours ? `${planet.rotation_period_hours} hours` : 'N/A';
    if (moonsElement) moonsElement.textContent = planet.moons !== undefined ? planet.moons.toString() : 'N/A';

    // Interesting facts
    const factsList = document.getElementById('planet-facts-list');
    if (factsList && planet.interesting_facts) {
      factsList.innerHTML = planet.interesting_facts.map(fact => `<li>${fact}</li>`).join('');
    }

    // Update planet sphere color
    const planetSphere = document.getElementById('planet-sphere');
    if (planetSphere && planet.color) {
      planetSphere.style.background = `radial-gradient(circle at 30% 30%, ${planet.color}, ${this.darkenColor(planet.color, 0.3)})`;
    }
  }

  /**
   * Create planet comparison chart
   */
  createPlanetComparisonChart(planet) {
    const canvas = document.getElementById('planet-comparison-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (this.comparisonChart) {
      this.comparisonChart.destroy();
    }

    // Earth values for comparison
    const earthValues = {
      radius: 6371,
      mass: 5.972e24,
      gravity: 9.807,
      temperature: 288
    };

    // Planet values relative to Earth
    const planetValues = {
      radius: planet.radius_km / earthValues.radius,
      mass: planet.mass_kg / earthValues.mass,
      gravity: planet.surface_gravity_ms2 / earthValues.gravity,
      temperature: planet.surface_temp_k / earthValues.temperature
    };

    this.comparisonChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Radius', 'Mass', 'Gravity', 'Temperature'],
        datasets: [
          {
            label: 'Earth',
            data: [1, 1, 1, 1],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2
          },
          {
            label: planet.name,
            data: [
              planetValues.radius || 0,
              planetValues.mass || 0,
              planetValues.gravity || 0,
              planetValues.temperature || 0
            ],
            borderColor: planet.color || '#6366f1',
            backgroundColor: `${planet.color || '#6366f1'}20`,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 5,
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            angleLines: { color: 'rgba(148, 163, 184, 0.1)' }
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
   * Initialize planet cards
   */
  initializePlanetCards() {
    const planetsGrid = document.getElementById('planets-grid');
    if (!planetsGrid || !this.solarSystemData) return;

    planetsGrid.innerHTML = this.solarSystemData.planets.map(planet => `
      <div class="planet-card" data-planet-id="${planet.id}">
        <div class="planet-card-visual">
          <div class="planet-card-sphere" style="background: radial-gradient(circle at 30% 30%, ${planet.color}, ${this.darkenColor(planet.color, 0.3)})"></div>
        </div>
        <div class="planet-card-info">
          <h3>${planet.name}</h3>
          <p class="planet-card-type">${planet.type?.replace('_', ' ').toUpperCase() || 'PLANET'}</p>
          <div class="planet-card-stats">
            <div class="stat">
              <span class="label">Distance:</span>
              <span class="value">${planet.semi_major_axis_au} AU</span>
            </div>
            <div class="stat">
              <span class="label">Period:</span>
              <span class="value">${planet.orbital_period_days.toFixed(0)} days</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Add click handlers
    planetsGrid.querySelectorAll('.planet-card').forEach(card => {
      card.addEventListener('click', () => {
        const planetId = card.dataset.planetId;
        const planet = this.solarSystemData.planets.find(p => p.id === planetId);
        if (planet) {
          this.selectPlanet(planet);
        }
      });
    });
  }

  /**
   * Update view based on selection
   */
  updateView() {
    switch (this.view) {
      case 'inner':
        this.zoom = 2;
        break;
      case 'outer':
        this.zoom = 0.5;
        break;
      case 'follow':
        // Follow selected planet
        break;
      default:
        this.zoom = 1;
    }
  }

  /**
   * Setup mouse interactions for pan and zoom
   */
  setupMouseInteractions() {
    // Mouse wheel for zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoom = Math.max(0.1, Math.min(5, this.zoom * zoomFactor));
    });

    // Mouse drag for pan
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMousePos = { x: e.clientX, y: e.clientY };
      this.canvas.style.cursor = 'grabbing';
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastMousePos.x;
        const deltaY = e.clientY - this.lastMousePos.y;
        
        this.panOffset.x += deltaX;
        this.panOffset.y += deltaY;
        
        this.lastMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'default';
    });

    // Set initial cursor
    this.canvas.style.cursor = 'grab';
  }

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    const container = document.querySelector('.solar-system-canvas-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const icon = fullscreenBtn?.querySelector('i');
    const label = fullscreenBtn?.querySelector('.btn-label');
    const sublabel = fullscreenBtn?.querySelector('.btn-sublabel');

    if (!this.isFullscreen) {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      
      this.isFullscreen = true;
      container.classList.add('fullscreen-mode');
      
      if (icon) icon.className = 'fas fa-compress';
      if (label) label.textContent = 'Exit Fullscreen';
      if (sublabel) sublabel.textContent = 'Return to normal';
      
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      
      this.isFullscreen = false;
      container.classList.remove('fullscreen-mode');
      
      if (icon) icon.className = 'fas fa-expand';
      if (label) label.textContent = 'Fullscreen';
      if (sublabel) sublabel.textContent = 'Immersive view';
    }

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullscreen = false;
        container.classList.remove('fullscreen-mode');
        
        if (icon) icon.className = 'fas fa-expand';
        if (label) label.textContent = 'Fullscreen';
        if (sublabel) sublabel.textContent = 'Immersive view';
      }
    });

    // Resize canvas after fullscreen change
    setTimeout(() => {
      this.setupCanvas();
    }, 100);
  }

  /**
   * Reset simulation to initial state
   */
  resetSimulation() {
    this.time = 0;
    this.zoom = 1;
    this.panOffset = { x: 0, y: 0 };
    this.selectedPlanet = null;
    this.hideSelectedPlanetInfo();
    this.clearTrails();
    this.updateSimulationDate();
    
    // Show reset confirmation
    if (window.app && window.app.toastManager) {
      window.app.toastManager.show('🔄 Simulation reset to initial state', 'success', 2000);
    }
  }

  /**
   * Hide selected planet info
   */
  hideSelectedPlanetInfo() {
    const infoCard = document.getElementById('selected-planet-info');
    if (infoCard) {
      infoCard.style.display = 'none';
    }
  }

  /**
   * Darken color utility
   */
  darkenColor(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
    
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }
}

// Global solar system instance
const solarSystem = new SolarSystemManager();

// Initialize solar system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('solar-system.html')) {
    solarSystem.init();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SolarSystemManager, solarSystem };
}