// ExoPlanet AI - Explorer Functionality

/**
 * Explorer Manager Class
 */
class ExplorerManager {
  constructor() {
    this.exoplanets = [];
    this.filteredPlanets = [];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.currentView = 'grid';
    this.currentSort = 'name';
    this.filters = {
      search: '',
      missions: [],
      yearRange: [1995, 2025],
      sizes: [],
      periodRange: [0, 1000],
      distanceRange: [0, 5000]
    };
    
    // DOM elements
    this.searchInput = null;
    this.filterCheckboxes = null;
    this.rangeSliders = null;
    this.sortSelect = null;
    this.viewButtons = null;
    this.planetGrid = null;
    this.pagination = null;
    this.resultsCount = null;
    this.planetModal = null;
    
    this.init();
  }

  async init() {
    this.setupDOMReferences();
    await this.loadExoplanetData();
    this.setupEventListeners();
    this.setupRangeSliders();
    this.applyFilters();
    
    console.log('Explorer initialized');
  }

  setupDOMReferences() {
    this.searchInput = Utils.getElementById('search-input');
    this.filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    this.sortSelect = Utils.getElementById('sort-select');
    this.viewButtons = document.querySelectorAll('.view-btn');
    this.planetGrid = Utils.getElementById('exoplanet-grid');
    this.pagination = Utils.getElementById('pagination');
    this.resultsCount = Utils.getElementById('results-count');
    this.planetModal = Utils.getElementById('planet-modal');
    
    // Range sliders
    this.rangeSliders = {
      yearMin: Utils.getElementById('year-min'),
      yearMax: Utils.getElementById('year-max'),
      periodMin: Utils.getElementById('period-min'),
      periodMax: Utils.getElementById('period-max'),
      distanceMin: Utils.getElementById('distance-min'),
      distanceMax: Utils.getElementById('distance-max')
    };
  }

  async loadExoplanetData() {
    try {
      const response = await fetch('assets/data/sample-data.json');
      const data = await response.json();
      this.exoplanets = data.exoplanets;
      this.filteredPlanets = [...this.exoplanets];
    } catch (error) {
      console.error('Failed to load exoplanet data:', error);
      window.exoPlanetApp?.toastManager?.show('Failed to load exoplanet data', 'error');
    }
  }

  setupEventListeners() {
    // Search input
    if (this.searchInput) {
      const debouncedSearch = Utils.debounce((e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.applyFilters();
      }, 300);
      
      this.searchInput.addEventListener('input', debouncedSearch);
    }

    // Filter checkboxes
    this.filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateFiltersFromCheckboxes();
        this.applyFilters();
      });
    });

    // Sort select
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.sortPlanets();
        this.renderPlanets();
      });
    }

    // View toggle buttons
    this.viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.currentView = button.dataset.view;
        this.updateViewButtons();
        this.renderPlanets();
      });
    });

    // Apply filters button
    const applyFiltersBtn = Utils.getElementById('apply-filters');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', () => {
        this.updateFiltersFromSliders();
        this.applyFilters();
      });
    }

    // Reset filters button
    const resetFiltersBtn = Utils.getElementById('filter-reset');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // Modal close
    const modalClose = Utils.getElementById('modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Modal backdrop click
    if (this.planetModal) {
      const backdrop = this.planetModal.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => {
          this.closeModal();
        });
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.planetModal?.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  setupRangeSliders() {
    // Year range sliders
    if (this.rangeSliders.yearMin && this.rangeSliders.yearMax) {
      this.setupDualRangeSlider('year', 1995, 2025);
    }

    // Period range sliders
    if (this.rangeSliders.periodMin && this.rangeSliders.periodMax) {
      this.setupDualRangeSlider('period', 0, 1000);
    }

    // Distance range sliders
    if (this.rangeSliders.distanceMin && this.rangeSliders.distanceMax) {
      this.setupDualRangeSlider('distance', 0, 5000);
    }
  }

  setupDualRangeSlider(type, min, max) {
    const minSlider = this.rangeSliders[`${type}Min`];
    const maxSlider = this.rangeSliders[`${type}Max`];
    const minValue = Utils.getElementById(`${type}-min-value`);
    const maxValue = Utils.getElementById(`${type}-max-value`);

    if (!minSlider || !maxSlider) return;

    const updateValues = () => {
      let minVal = parseInt(minSlider.value);
      let maxVal = parseInt(maxSlider.value);

      // Ensure min is not greater than max
      if (minVal > maxVal) {
        minVal = maxVal;
        minSlider.value = minVal;
      }

      // Update display values
      if (minValue) {
        minValue.textContent = type === 'distance' ? minVal : minVal;
      }
      if (maxValue) {
        maxValue.textContent = type === 'distance' ? maxVal : maxVal;
      }

      // Update filters
      this.filters[`${type}Range`] = [minVal, maxVal];
    };

    minSlider.addEventListener('input', updateValues);
    maxSlider.addEventListener('input', updateValues);

    // Initialize values
    updateValues();
  }

  updateFiltersFromCheckboxes() {
    // Mission filters
    const missionCheckboxes = document.querySelectorAll('input[name="mission"]:checked');
    this.filters.missions = Array.from(missionCheckboxes).map(cb => cb.value);

    // Size filters
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
    this.filters.sizes = Array.from(sizeCheckboxes).map(cb => cb.value);
  }

  updateFiltersFromSliders() {
    // Range filters are updated in real-time by setupDualRangeSlider
    // This method is called when Apply Filters is clicked
  }

  applyFilters() {
    this.filteredPlanets = this.exoplanets.filter(planet => {
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search;
        const searchableText = `${planet.name} ${planet.hostStar} ${planet.planetType}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Mission filter
      if (this.filters.missions.length > 0) {
        if (!this.filters.missions.includes(planet.mission)) {
          return false;
        }
      }

      // Year range filter
      const [minYear, maxYear] = this.filters.yearRange;
      if (planet.discoveryYear < minYear || planet.discoveryYear > maxYear) {
        return false;
      }

      // Size filter
      if (this.filters.sizes.length > 0) {
        const planetSize = this.getPlanetSize(planet.planetaryRadius);
        if (!this.filters.sizes.includes(planetSize)) {
          return false;
        }
      }

      // Period range filter
      const [minPeriod, maxPeriod] = this.filters.periodRange;
      if (planet.orbitalPeriod < minPeriod || planet.orbitalPeriod > maxPeriod) {
        return false;
      }

      // Distance range filter
      const [minDistance, maxDistance] = this.filters.distanceRange;
      if (planet.distance < minDistance || planet.distance > maxDistance) {
        return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.sortPlanets();
    this.renderPlanets();
    this.updateResultsCount();
    this.renderPagination();
  }

  getPlanetSize(radius) {
    if (radius < 1.25) return 'Small';
    if (radius <= 2) return 'Medium';
    return 'Large';
  }

  sortPlanets() {
    this.filteredPlanets.sort((a, b) => {
      switch (this.currentSort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'year':
          return b.discoveryYear - a.discoveryYear;
        case 'distance':
          return a.distance - b.distance;
        case 'radius':
          return b.planetaryRadius - a.planetaryRadius;
        case 'period':
          return a.orbitalPeriod - b.orbitalPeriod;
        default:
          return 0;
      }
    });
  }

  renderPlanets() {
    if (!this.planetGrid) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const planetsToShow = this.filteredPlanets.slice(startIndex, endIndex);

    if (planetsToShow.length === 0) {
      this.planetGrid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No exoplanets found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      `;
      return;
    }

    this.planetGrid.className = `exoplanet-grid ${this.currentView}-view`;
    this.planetGrid.innerHTML = planetsToShow.map(planet => 
      this.createPlanetCard(planet)
    ).join('');

    // Add click listeners to cards
    this.planetGrid.querySelectorAll('.planet-card').forEach(card => {
      card.addEventListener('click', () => {
        const planetId = card.dataset.planetId;
        this.showPlanetDetails(planetId);
      });
    });
  }

  createPlanetCard(planet) {
    const habitableIcon = planet.habitableZone ? 
      '<i class="fas fa-leaf habitable-icon" title="In Habitable Zone"></i>' : '';
    
    const confirmedBadge = planet.confirmed ? 
      '<span class="confirmed-badge">Confirmed</span>' : 
      '<span class="candidate-badge">Candidate</span>';

    return `
      <div class="planet-card" data-planet-id="${planet.id}">
        <div class="planet-header">
          <h3 class="planet-name">${planet.name}</h3>
          ${confirmedBadge}
        </div>
        
        <div class="planet-visual">
          <div class="planet-icon ${planet.planetType.toLowerCase().replace(' ', '-')}">
            <i class="fas fa-circle"></i>
          </div>
          ${habitableIcon}
        </div>
        
        <div class="planet-info">
          <div class="info-item">
            <span class="info-label">Host Star</span>
            <span class="info-value">${planet.hostStar}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Discovery Year</span>
            <span class="info-value">${planet.discoveryYear}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Mission</span>
            <span class="info-value">${planet.mission}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Distance</span>
            <span class="info-value">${planet.distance} ly</span>
          </div>
        </div>
        
        <div class="planet-metrics">
          <div class="metric">
            <span class="metric-label">Radius</span>
            <span class="metric-value">${planet.planetaryRadius} R⊕</span>
          </div>
          <div class="metric">
            <span class="metric-label">Period</span>
            <span class="metric-value">${planet.orbitalPeriod.toFixed(1)} days</span>
          </div>
          <div class="metric">
            <span class="metric-label">Temperature</span>
            <span class="metric-value">${planet.equilibriumTemperature} K</span>
          </div>
        </div>
        
        <button class="btn btn-outline view-details-btn">
          <i class="fas fa-eye"></i>
          View Details
        </button>
      </div>
    `;
  }

  showPlanetDetails(planetId) {
    const planet = this.exoplanets.find(p => p.id === planetId);
    if (!planet || !this.planetModal) return;

    // Update modal content
    this.updateModalContent(planet);
    
    // Show modal
    this.planetModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Create comparison chart
    setTimeout(() => {
      this.createComparisonChart(planet);
    }, 100);
  }

  updateModalContent(planet) {
    // Update planet name
    const planetName = Utils.getElementById('modal-planet-name');
    if (planetName) planetName.textContent = planet.name;

    // Update basic info
    const hostStar = Utils.getElementById('modal-host-star');
    if (hostStar) hostStar.textContent = planet.hostStar;

    const discoveryYear = Utils.getElementById('modal-discovery-year');
    if (discoveryYear) discoveryYear.textContent = planet.discoveryYear;

    const mission = Utils.getElementById('modal-mission');
    if (mission) mission.textContent = planet.mission;

    // Update metrics
    const metrics = {
      'modal-radius': `${planet.planetaryRadius} R⊕`,
      'modal-period': `${planet.orbitalPeriod.toFixed(1)} days`,
      'modal-duration': `${planet.transitDuration.toFixed(1)} hours`,
      'modal-depth': `${planet.transitDepth.toFixed(4)}%`,
      'modal-temperature': `${planet.equilibriumTemperature} K`,
      'modal-distance': `${planet.distance} light years`
    };

    Object.entries(metrics).forEach(([id, value]) => {
      const element = Utils.getElementById(id);
      if (element) element.textContent = value;
    });

    // Update planet image/visualization
    const planetImage = Utils.getElementById('planet-image');
    if (planetImage) {
      planetImage.innerHTML = `
        <div class="planet-visualization ${planet.planetType.toLowerCase().replace(' ', '-')}">
          <div class="planet-sphere">
            <div class="planet-surface"></div>
            <div class="planet-atmosphere"></div>
          </div>
          <div class="planet-info-overlay">
            <span class="planet-type">${planet.planetType}</span>
            ${planet.habitableZone ? '<span class="habitable-indicator">Habitable Zone</span>' : ''}
          </div>
        </div>
      `;
    }
  }

  createComparisonChart(planet) {
    const canvas = Utils.getElementById('comparison-chart');
    if (!canvas || !window.chartManager) return;

    const comparisonData = [
      { name: 'Earth', radius: 1.0, period: 365.25, color: '#10b981' },
      { name: 'Mars', radius: 0.53, period: 687, color: '#ef4444' },
      { name: 'Jupiter', radius: 11.2, period: 4333, color: '#f59e0b' },
      { name: planet.name, radius: planet.planetaryRadius, period: planet.orbitalPeriod, color: '#6366f1' }
    ];

    const data = {
      datasets: [{
        label: 'Planetary Comparison',
        data: comparisonData.map(p => ({
          x: p.period,
          y: p.radius,
          label: p.name,
          backgroundColor: p.color,
          borderColor: p.color
        })),
        backgroundColor: comparisonData.map(p => p.color),
        borderColor: comparisonData.map(p => p.color),
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    };

    const options = {
      scales: {
        x: {
          type: 'logarithmic',
          title: {
            display: true,
            text: 'Orbital Period (days)'
          }
        },
        y: {
          type: 'logarithmic',
          title: {
            display: true,
            text: 'Planetary Radius (Earth Radii)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: (context) => context[0].raw.label,
            label: (context) => [
              `Radius: ${context.parsed.y.toFixed(2)} R⊕`,
              `Period: ${context.parsed.x.toFixed(1)} days`
            ]
          }
        }
      }
    };

    window.chartManager.createChart('comparison-chart', 'scatter', data, options);
  }

  closeModal() {
    if (!this.planetModal) return;
    
    this.planetModal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Destroy comparison chart
    window.chartManager?.destroyChart('comparison-chart');
  }

  updateViewButtons() {
    this.viewButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.view === this.currentView);
    });
  }

  updateResultsCount() {
    if (!this.resultsCount) return;
    
    const count = this.filteredPlanets.length;
    const total = this.exoplanets.length;
    
    this.resultsCount.textContent = count === total ? 
      `Showing all ${count} exoplanets` : 
      `Showing ${count} of ${total} exoplanets`;
  }

  renderPagination() {
    if (!this.pagination) return;

    const totalPages = Math.ceil(this.filteredPlanets.length / this.itemsPerPage);
    
    if (totalPages <= 1) {
      this.pagination.style.display = 'none';
      return;
    }

    this.pagination.style.display = 'flex';

    const prevBtn = Utils.getElementById('prev-btn');
    const nextBtn = Utils.getElementById('next-btn');
    const numbersContainer = Utils.getElementById('pagination-numbers');

    // Update prev/next buttons
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
      prevBtn.onclick = () => this.goToPage(this.currentPage - 1);
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentPage === totalPages;
      nextBtn.onclick = () => this.goToPage(this.currentPage + 1);
    }

    // Update page numbers
    if (numbersContainer) {
      const pageNumbers = this.generatePageNumbers(this.currentPage, totalPages);
      numbersContainer.innerHTML = pageNumbers.map(page => {
        if (page === '...') {
          return '<span class="pagination-ellipsis">...</span>';
        }
        
        return `
          <button class="pagination-number ${page === this.currentPage ? 'active' : ''}" 
                  onclick="window.explorerManager.goToPage(${page})">
            ${page}
          </button>
        `;
      }).join('');
    }
  }

  generatePageNumbers(current, total) {
    const pages = [];
    
    if (total <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (current > 4) {
        pages.push('...');
      }
      
      // Show pages around current
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < total - 3) {
        pages.push('...');
      }
      
      // Show last page
      if (total > 1) {
        pages.push(total);
      }
    }
    
    return pages;
  }

  goToPage(page) {
    const totalPages = Math.ceil(this.filteredPlanets.length / this.itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    this.currentPage = page;
    this.renderPlanets();
    this.renderPagination();
    
    // Scroll to top of results
    if (this.planetGrid) {
      this.planetGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  resetFilters() {
    // Reset filter values
    this.filters = {
      search: '',
      missions: [],
      yearRange: [1995, 2025],
      sizes: [],
      periodRange: [0, 1000],
      distanceRange: [0, 5000]
    };

    // Reset UI elements
    if (this.searchInput) this.searchInput.value = '';
    
    this.filterCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Reset range sliders
    Object.entries(this.rangeSliders).forEach(([key, slider]) => {
      if (slider) {
        if (key.includes('year')) {
          slider.value = key.includes('Min') ? 1995 : 2025;
        } else if (key.includes('period')) {
          slider.value = key.includes('Min') ? 0 : 1000;
        } else if (key.includes('distance')) {
          slider.value = key.includes('Min') ? 0 : 5000;
        }
      }
    });

    // Update range displays
    this.setupRangeSliders();
    
    // Apply filters
    this.applyFilters();
    
    window.exoPlanetApp?.toastManager?.show('Filters reset', 'info');
  }
}

// Initialize explorer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('explorer.html')) {
    window.explorerManager = new ExplorerManager();
  }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExplorerManager };
}