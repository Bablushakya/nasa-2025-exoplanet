// ExoPlanet AI - Explorer Page

/**
 * Explorer Manager
 */
class ExplorerManager {
  constructor() {
    this.exoplanets = [];
    this.filteredExoplanets = [];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.currentView = 'grid';
    this.currentSort = 'name';
    this.filters = {
      search: '',
      mission: [],
      size: [],
      yearRange: [1995, 2025],
      periodRange: [0, 1000],
      distanceRange: [0, 5000]
    };
    this.isInitialized = false;
  }

  /**
   * Initialize explorer
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Load exoplanet data
      await this.loadExoplanets();
      
      // Initialize UI components
      this.initializeFilters();
      this.initializeViewControls();
      this.initializePagination();
      this.initializeModal();
      
      // Apply initial filters and render
      this.applyFilters();
      
      this.isInitialized = true;
      console.log('Explorer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize explorer:', error);
      this.showError('Failed to load exoplanet data');
    }
  }

  /**
   * Load exoplanet data
   */
  async loadExoplanets() {
    try {
      // Try to load from API first
      const response = await apiService.getExoplanets({ limit: 1000 });
      
      if (response.success && response.data) {
        this.exoplanets = response.data.exoplanets || response.data;
      } else {
        // Fallback to sample data
        this.exoplanets = this.generateSampleExoplanets();
      }
      
      console.log(`Loaded ${this.exoplanets.length} exoplanets`);
    } catch (error) {
      console.warn('API failed, using sample data:', error);
      this.exoplanets = this.generateSampleExoplanets();
    }
  }

  /**
   * Generate sample exoplanet data
   */
  generateSampleExoplanets() {
    const missions = ['Kepler', 'K2', 'TESS', 'CoRoT', 'HAT'];
    const planetTypes = ['Rocky', 'Super-Earth', 'Neptune-like', 'Gas Giant'];
    const hostStarTypes = ['G', 'K', 'M', 'F'];
    
    const sampleData = [];
    
    for (let i = 1; i <= 100; i++) {
      const mission = missions[Math.floor(Math.random() * missions.length)];
      const planetType = planetTypes[Math.floor(Math.random() * planetTypes.length)];
      const hostStarType = hostStarTypes[Math.floor(Math.random() * hostStarTypes.length)];
      
      // Generate realistic values based on planet type
      let radius, period, temperature, transitDepth;
      
      switch (planetType) {
        case 'Rocky':
          radius = 0.5 + Math.random() * 1.5; // 0.5 - 2 Earth radii
          period = 1 + Math.random() * 100; // 1 - 100 days
          temperature = 200 + Math.random() * 800; // 200 - 1000 K
          transitDepth = 0.001 + Math.random() * 0.01; // 0.001 - 0.011%
          break;
        case 'Super-Earth':
          radius = 1.25 + Math.random() * 0.75; // 1.25 - 2 Earth radii
          period = 5 + Math.random() * 200; // 5 - 205 days
          temperature = 150 + Math.random() * 600; // 150 - 750 K
          transitDepth = 0.005 + Math.random() * 0.015; // 0.005 - 0.02%
          break;
        case 'Neptune-like':
          radius = 2 + Math.random() * 4; // 2 - 6 Earth radii
          period = 10 + Math.random() * 500; // 10 - 510 days
          temperature = 100 + Math.random() * 400; // 100 - 500 K
          transitDepth = 0.02 + Math.random() * 0.08; // 0.02 - 0.1%
          break;
        case 'Gas Giant':
          radius = 6 + Math.random() * 15; // 6 - 21 Earth radii
          period = 50 + Math.random() * 2000; // 50 - 2050 days
          temperature = 50 + Math.random() * 300; // 50 - 350 K
          transitDepth = 0.1 + Math.random() * 0.5; // 0.1 - 0.6%
          break;
      }
      
      const discoveryYear = 1995 + Math.floor(Math.random() * 30); // 1995 - 2024
      const distance = 10 + Math.random() * 4990; // 10 - 5000 light years
      const transitDuration = 1 + Math.random() * 10; // 1 - 11 hours
      
      sampleData.push({
        id: `exoplanet-${i}`,
        name: `${mission}-${i}${String.fromCharCode(97 + Math.floor(Math.random() * 26))}`,
        host_star: `${mission}-${i}`,
        discovery_method: 'Transit',
        discovery_year: discoveryYear,
        discovery_facility: mission,
        orbital_period: period,
        planetary_radius: radius,
        transit_duration: transitDuration,
        transit_depth: transitDepth,
        equilibrium_temperature: temperature,
        distance: distance,
        planet_type: planetType,
        host_star_type: hostStarType,
        disposition: Math.random() > 0.3 ? 'Confirmed' : 'Candidate',
        habitable_zone: Math.random() > 0.9 ? 'Yes' : 'No'
      });
    }
    
    return sampleData;
  }

  /**
   * Initialize filter controls
   */
  initializeFilters() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.applyFilters();
      }, 300));
    }

    // Mission checkboxes
    const missionCheckboxes = document.querySelectorAll('input[name="mission"]');
    missionCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateCheckboxFilter('mission');
        this.applyFilters();
      });
    });

    // Size checkboxes
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]');
    sizeCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateCheckboxFilter('size');
        this.applyFilters();
      });
    });

    // Range sliders
    this.initializeRangeSliders();

    // Reset button
    const resetButton = document.getElementById('filter-reset');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // Apply filters button
    const applyButton = document.getElementById('apply-filters');
    if (applyButton) {
      applyButton.addEventListener('click', () => {
        this.applyFilters();
      });
    }
  }

  /**
   * Initialize range sliders
   */
  initializeRangeSliders() {
    // Year range
    this.initializeRangeSlider('year', 1995, 2025, [1995, 2025]);
    
    // Period range
    this.initializeRangeSlider('period', 0, 1000, [0, 1000]);
    
    // Distance range
    this.initializeRangeSlider('distance', 0, 5000, [0, 5000]);
  }

  /**
   * Initialize individual range slider
   */
  initializeRangeSlider(name, min, max, defaultValues) {
    const minSlider = document.getElementById(`${name}-min`);
    const maxSlider = document.getElementById(`${name}-max`);
    const minValue = document.getElementById(`${name}-min-value`);
    const maxValue = document.getElementById(`${name}-max-value`);

    if (!minSlider || !maxSlider || !minValue || !maxValue) return;

    const updateValues = () => {
      let minVal = parseInt(minSlider.value);
      let maxVal = parseInt(maxSlider.value);

      // Ensure min doesn't exceed max
      if (minVal >= maxVal) {
        minVal = maxVal - 1;
        minSlider.value = minVal;
      }

      // Ensure max doesn't go below min
      if (maxVal <= minVal) {
        maxVal = minVal + 1;
        maxSlider.value = maxVal;
      }

      minValue.textContent = minVal;
      maxValue.textContent = maxVal;

      // Update filter
      this.filters[`${name}Range`] = [minVal, maxVal];
    };

    minSlider.addEventListener('input', updateValues);
    maxSlider.addEventListener('input', updateValues);
    
    // Set initial values
    minSlider.value = defaultValues[0];
    maxSlider.value = defaultValues[1];
    updateValues();
  }

  /**
   * Update checkbox filter
   */
  updateCheckboxFilter(filterName) {
    const checkboxes = document.querySelectorAll(`input[name="${filterName}"]:checked`);
    this.filters[filterName] = Array.from(checkboxes).map(cb => cb.value);
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    // Reset search
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });

    // Reset range sliders
    document.getElementById('year-min').value = 1995;
    document.getElementById('year-max').value = 2025;
    document.getElementById('period-min').value = 0;
    document.getElementById('period-max').value = 1000;
    document.getElementById('distance-min').value = 0;
    document.getElementById('distance-max').value = 5000;

    // Reset filter object
    this.filters = {
      search: '',
      mission: [],
      size: [],
      yearRange: [1995, 2025],
      periodRange: [0, 1000],
      distanceRange: [0, 5000]
    };

    // Update displays and apply
    this.initializeRangeSliders();
    this.applyFilters();
  }

  /**
   * Apply current filters
   */
  applyFilters() {
    this.filteredExoplanets = this.exoplanets.filter(planet => {
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        if (!planet.name.toLowerCase().includes(searchTerm) &&
            !planet.host_star.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Mission filter
      if (this.filters.mission.length > 0) {
        if (!this.filters.mission.includes(planet.discovery_facility)) {
          return false;
        }
      }

      // Size filter
      if (this.filters.size.length > 0) {
        const planetSize = this.getPlanetSizeCategory(planet.planetary_radius);
        if (!this.filters.size.includes(planetSize)) {
          return false;
        }
      }

      // Year range filter
      if (planet.discovery_year < this.filters.yearRange[0] || 
          planet.discovery_year > this.filters.yearRange[1]) {
        return false;
      }

      // Period range filter
      if (planet.orbital_period < this.filters.periodRange[0] || 
          planet.orbital_period > this.filters.periodRange[1]) {
        return false;
      }

      // Distance range filter
      if (planet.distance < this.filters.distanceRange[0] || 
          planet.distance > this.filters.distanceRange[1]) {
        return false;
      }

      return true;
    });

    // Sort filtered results
    this.sortExoplanets();

    // Reset to first page
    this.currentPage = 1;

    // Update UI
    this.updateResultsCount();
    this.renderExoplanets();
    this.updatePagination();
  }

  /**
   * Get planet size category
   */
  getPlanetSizeCategory(radius) {
    if (radius < 1.25) return 'Small';
    if (radius < 2) return 'Medium';
    return 'Large';
  }

  /**
   * Sort exoplanets
   */
  sortExoplanets() {
    this.filteredExoplanets.sort((a, b) => {
      switch (this.currentSort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'year':
          return b.discovery_year - a.discovery_year;
        case 'distance':
          return a.distance - b.distance;
        case 'radius':
          return b.planetary_radius - a.planetary_radius;
        case 'period':
          return a.orbital_period - b.orbital_period;
        default:
          return 0;
      }
    });
  }

  /**
   * Initialize view controls
   */
  initializeViewControls() {
    // View toggle buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;
        this.setView(view);
        
        // Update button states
        viewButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applyFilters();
      });
    }
  }

  /**
   * Set view mode
   */
  setView(view) {
    this.currentView = view;
    const grid = document.getElementById('exoplanet-grid');
    if (grid) {
      grid.className = `exoplanet-grid ${view === 'list' ? 'list-view' : ''}`;
    }
    this.renderExoplanets();
  }

  /**
   * Update results count
   */
  updateResultsCount() {
    const countElement = document.getElementById('results-count');
    if (countElement) {
      const total = this.filteredExoplanets.length;
      const start = (this.currentPage - 1) * this.itemsPerPage + 1;
      const end = Math.min(start + this.itemsPerPage - 1, total);
      
      if (total === 0) {
        countElement.textContent = 'No exoplanets found';
      } else {
        countElement.textContent = `Showing ${start}-${end} of ${total} exoplanets`;
      }
    }
  }

  /**
   * Render exoplanets
   */
  renderExoplanets() {
    const grid = document.getElementById('exoplanet-grid');
    if (!grid) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageExoplanets = this.filteredExoplanets.slice(startIndex, endIndex);

    if (pageExoplanets.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No exoplanets found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = pageExoplanets.map(planet => this.createPlanetCard(planet)).join('');
  }

  /**
   * Create planet card HTML
   */
  createPlanetCard(planet) {
    const planetIcon = this.getPlanetIcon(planet.planet_type);
    const sizeCategory = this.getPlanetSizeCategory(planet.planetary_radius);
    
    return `
      <div class="planet-card" data-planet-id="${planet.id}">
        <div class="planet-header">
          <h3 class="planet-name">${planet.name}</h3>
          <span class="planet-badge ${planet.disposition.toLowerCase()}">${planet.disposition}</span>
        </div>
        
        <div class="planet-visual">
          <div class="planet-icon ${planet.planet_type.toLowerCase().replace('-', '')}">
            <i class="${planetIcon}"></i>
          </div>
          ${planet.habitable_zone === 'Yes' ? '<i class="fas fa-leaf habitable-icon" title="In Habitable Zone"></i>' : ''}
        </div>
        
        <div class="planet-info">
          <div class="info-row">
            <span class="info-label">Host Star:</span>
            <span class="info-value">${planet.host_star}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Discovery Year:</span>
            <span class="info-value">${planet.discovery_year}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Mission:</span>
            <span class="info-value">${planet.discovery_facility}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Radius:</span>
            <span class="info-value">${planet.planetary_radius.toFixed(2)} R⊕</span>
          </div>
          <div class="info-row">
            <span class="info-label">Period:</span>
            <span class="info-value">${planet.orbital_period.toFixed(1)} days</span>
          </div>
          <div class="info-row">
            <span class="info-label">Distance:</span>
            <span class="info-value">${planet.distance.toFixed(0)} ly</span>
          </div>
        </div>
        
        <div class="planet-footer">
          <span class="planet-type">${planet.planet_type}</span>
          <button class="btn btn-outline btn-small view-details" data-planet-id="${planet.id}">
            View Details
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Get planet icon based on type
   */
  getPlanetIcon(planetType) {
    switch (planetType) {
      case 'Rocky':
        return 'fas fa-mountain';
      case 'Super-Earth':
        return 'fas fa-globe';
      case 'Neptune-like':
        return 'fas fa-cloud';
      case 'Gas Giant':
        return 'fas fa-circle';
      default:
        return 'fas fa-circle';
    }
  }

  /**
   * Initialize pagination
   */
  initializePagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderExoplanets();
          this.updatePagination();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(this.filteredExoplanets.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderExoplanets();
          this.updatePagination();
        }
      });
    }
  }

  /**
   * Update pagination controls
   */
  updatePagination() {
    const totalPages = Math.ceil(this.filteredExoplanets.length / this.itemsPerPage);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const numbersContainer = document.getElementById('pagination-numbers');

    // Update button states
    if (prevBtn) {
      prevBtn.disabled = this.currentPage <= 1;
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentPage >= totalPages;
    }

    // Update page numbers
    if (numbersContainer) {
      const maxVisiblePages = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust start page if we're near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      let numbersHTML = '';
      
      for (let i = startPage; i <= endPage; i++) {
        numbersHTML += `
          <button class="pagination-number ${i === this.currentPage ? 'active' : ''}" 
                  data-page="${i}">${i}</button>
        `;
      }

      numbersContainer.innerHTML = numbersHTML;

      // Add click listeners to page numbers
      numbersContainer.querySelectorAll('.pagination-number').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.currentPage = parseInt(e.target.dataset.page);
          this.renderExoplanets();
          this.updatePagination();
        });
      });
    }
  }

  /**
   * Initialize modal
   */
  initializeModal() {
    const modal = document.getElementById('planet-modal');
    const closeBtn = document.getElementById('modal-close');
    const backdrop = modal?.querySelector('.modal-backdrop');

    // Close modal handlers
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeModal());
    }

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) {
        this.closeModal();
      }
    });

    // Planet card click handlers (delegated)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-details') || 
          e.target.closest('.planet-card')) {
        const planetId = e.target.dataset.planetId || 
                        e.target.closest('.planet-card')?.dataset.planetId;
        if (planetId) {
          this.showPlanetDetails(planetId);
        }
      }
    });
  }

  /**
   * Show planet details modal
   */
  showPlanetDetails(planetId) {
    const planet = this.exoplanets.find(p => p.id === planetId);
    if (!planet) return;

    // Update modal content
    this.updateModalContent(planet);

    // Show modal
    const modal = document.getElementById('planet-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Update modal content
   */
  updateModalContent(planet) {
    // Basic info
    const nameElement = document.getElementById('modal-planet-name');
    if (nameElement) nameElement.textContent = planet.name;

    const hostStarElement = document.getElementById('modal-host-star');
    if (hostStarElement) hostStarElement.textContent = planet.host_star;

    const yearElement = document.getElementById('modal-discovery-year');
    if (yearElement) yearElement.textContent = planet.discovery_year;

    const missionElement = document.getElementById('modal-mission');
    if (missionElement) missionElement.textContent = planet.discovery_facility;

    // Metrics
    const radiusElement = document.getElementById('modal-radius');
    if (radiusElement) radiusElement.textContent = `${planet.planetary_radius.toFixed(2)} R⊕`;

    const periodElement = document.getElementById('modal-period');
    if (periodElement) periodElement.textContent = `${planet.orbital_period.toFixed(1)} days`;

    const durationElement = document.getElementById('modal-duration');
    if (durationElement) durationElement.textContent = `${planet.transit_duration.toFixed(1)} hours`;

    const depthElement = document.getElementById('modal-depth');
    if (depthElement) depthElement.textContent = `${(planet.transit_depth * 100).toFixed(3)}%`;

    const temperatureElement = document.getElementById('modal-temperature');
    if (temperatureElement) temperatureElement.textContent = `${planet.equilibrium_temperature.toFixed(0)} K`;

    const distanceElement = document.getElementById('modal-distance');
    if (distanceElement) distanceElement.textContent = `${planet.distance.toFixed(0)} light years`;

    // Planet visualization
    this.updatePlanetVisualization(planet);

    // Comparison chart
    this.updateComparisonChart(planet);
  }

  /**
   * Update planet visualization
   */
  updatePlanetVisualization(planet) {
    const planetImage = document.getElementById('planet-image');
    if (!planetImage) return;

    const planetIcon = this.getPlanetIcon(planet.planet_type);
    const planetClass = planet.planet_type.toLowerCase().replace('-', '');

    planetImage.innerHTML = `
      <div class="planet-visual-large ${planetClass}">
        <i class="${planetIcon}"></i>
        ${planet.habitable_zone === 'Yes' ? '<div class="habitable-indicator">Habitable Zone</div>' : ''}
      </div>
    `;
  }

  /**
   * Update comparison chart
   */
  updateComparisonChart(planet) {
    const canvas = document.getElementById('comparison-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (this.comparisonChart) {
      this.comparisonChart.destroy();
    }

    this.comparisonChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Radius', 'Orbital Period', 'Temperature', 'Distance'],
        datasets: [
          {
            label: 'Earth',
            data: [1, 365, 288, 0], // Normalized Earth values
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2
          },
          {
            label: planet.name,
            data: [
              planet.planetary_radius,
              Math.min(planet.orbital_period / 365, 10), // Normalize to years, cap at 10
              planet.equilibrium_temperature / 288, // Relative to Earth
              Math.min(planet.distance / 1000, 5) // Normalize to thousands of ly, cap at 5
            ],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
            max: 10,
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
   * Close modal
   */
  closeModal() {
    const modal = document.getElementById('planet-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const grid = document.getElementById('exoplanet-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Error</h3>
          <p>${message}</p>
          <button class="btn btn-primary" onclick="location.reload()">
            Retry
          </button>
        </div>
      `;
    }
  }
}

// Global explorer instance
const explorer = new ExplorerManager();

// Initialize explorer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('explorer.html')) {
    explorer.init();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExplorerManager, explorer };
}