// ExoPlanet AI - Charts and Visualizations

/**
 * Chart Manager for handling all chart visualizations
 */
class ChartManager {
  constructor() {
    this.charts = {};
    this.defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e2e8f0' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        y: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        }
      }
    };
  }

  /**
   * Initialize all charts
   */
  init() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded');
      return;
    }

    // Set global Chart.js defaults for dark theme
    Chart.defaults.color = '#e2e8f0';
    Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.1)';
    Chart.defaults.backgroundColor = 'rgba(99, 102, 241, 0.1)';
  }

  /**
   * Create accuracy chart for model page
   */
  createAccuracyChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Correct Predictions', 'Incorrect Predictions'],
        datasets: [{
          data: [94.7, 5.3],
          backgroundColor: [
            '#10b981', // Success green
            '#ef4444'  // Error red
          ],
          borderWidth: 2,
          borderColor: '#1e293b'
        }]
      },
      options: {
        ...this.defaultOptions,
        plugins: {
          ...this.defaultOptions.plugins,
          legend: {
            position: 'bottom',
            labels: {
              color: '#e2e8f0',
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create confusion matrix chart
   */
  createConfusionMatrix(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Confusion matrix data (normalized)
    const confusionData = [
      [0.94, 0.04, 0.02], // Confirmed
      [0.06, 0.89, 0.05], // Candidate
      [0.01, 0.01, 0.98]  // False Positive
    ];

    const labels = ['Confirmed', 'Candidate', 'False Positive'];
    
    // Create heatmap using scatter plot
    const datasets = [];
    const colors = ['#ef4444', '#f59e0b', '#10b981']; // Red to Green gradient
    
    confusionData.forEach((row, i) => {
      row.forEach((value, j) => {
        const intensity = value;
        const color = this.getHeatmapColor(intensity);
        
        datasets.push({
          label: `${labels[i]} → ${labels[j]}`,
          data: [{
            x: j,
            y: 2 - i, // Flip Y axis
            v: value
          }],
          backgroundColor: color,
          borderColor: '#1e293b',
          borderWidth: 1,
          pointRadius: 20,
          showLine: false
        });
      });
    });

    this.charts[canvasId] = new Chart(ctx, {
      type: 'scatter',
      data: { datasets },
      options: {
        ...this.defaultOptions,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: -0.5,
            max: 2.5,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return labels[value] || '';
              },
              color: '#94a3b8'
            },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y: {
            min: -0.5,
            max: 2.5,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return labels[2 - value] || '';
              },
              color: '#94a3b8'
            },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function(context) {
                const point = context[0];
                return `${labels[2 - point.parsed.y]} → ${labels[point.parsed.x]}`;
              },
              label: function(context) {
                return `Accuracy: ${(context.parsed.v * 100).toFixed(1)}%`;
              }
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Get heatmap color based on intensity
   */
  getHeatmapColor(intensity) {
    // Green to Red gradient based on intensity
    const red = Math.floor(255 * (1 - intensity));
    const green = Math.floor(255 * intensity);
    return `rgba(${red}, ${green}, 0, 0.8)`;
  }

  /**
   * Create ROC curves chart
   */
  createROCChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Generate ROC curve data for each class
    const generateROCData = (auc) => {
      const points = [];
      for (let i = 0; i <= 100; i++) {
        const fpr = i / 100;
        // Approximate TPR based on AUC
        const tpr = Math.min(1, fpr + (auc - 0.5) * 2 * (1 - fpr));
        points.push({ x: fpr, y: Math.max(0, tpr) });
      }
      return points;
    };

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Confirmed (AUC = 0.97)',
            data: generateROCData(0.97),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
          },
          {
            label: 'Candidate (AUC = 0.94)',
            data: generateROCData(0.94),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
          },
          {
            label: 'False Positive (AUC = 0.99)',
            data: generateROCData(0.99),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
          },
          {
            label: 'Random Classifier',
            data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
            borderColor: '#64748b',
            borderWidth: 1,
            borderDash: [5, 5],
            fill: false
          }
        ]
      },
      options: {
        ...this.defaultOptions,
        scales: {
          x: {
            title: {
              display: true,
              text: 'False Positive Rate',
              color: '#e2e8f0'
            },
            min: 0,
            max: 1,
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y: {
            title: {
              display: true,
              text: 'True Positive Rate',
              color: '#e2e8f0'
            },
            min: 0,
            max: 1,
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create training history chart
   */
  createTrainingHistory(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Generate training history data
    const epochs = Array.from({ length: 50 }, (_, i) => i + 1);
    const trainAccuracy = epochs.map(epoch => {
      const base = 0.7 + (epoch / 50) * 0.25;
      return Math.min(0.95, base + Math.random() * 0.02 - 0.01);
    });
    const valAccuracy = epochs.map((epoch, i) => {
      const base = trainAccuracy[i] - 0.02;
      return Math.max(0.65, base + Math.random() * 0.03 - 0.015);
    });

    const trainLoss = epochs.map(epoch => {
      const base = 1.2 - (epoch / 50) * 0.9;
      return Math.max(0.1, base + Math.random() * 0.05 - 0.025);
    });
    const valLoss = epochs.map((epoch, i) => {
      const base = trainLoss[i] + 0.05;
      return base + Math.random() * 0.08 - 0.04;
    });

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: epochs,
        datasets: [
          {
            label: 'Training Accuracy',
            data: trainAccuracy,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
            yAxisID: 'y'
          },
          {
            label: 'Validation Accuracy',
            data: valAccuracy,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
            yAxisID: 'y'
          },
          {
            label: 'Training Loss',
            data: trainLoss,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
            yAxisID: 'y1'
          },
          {
            label: 'Validation Loss',
            data: valLoss,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        ...this.defaultOptions,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Epoch',
              color: '#e2e8f0'
            },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Accuracy',
              color: '#e2e8f0'
            },
            min: 0,
            max: 1,
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Loss',
              color: '#e2e8f0'
            },
            min: 0,
            max: 2,
            ticks: { color: '#94a3b8' },
            grid: {
              drawOnChartArea: false,
              color: 'rgba(148, 163, 184, 0.1)'
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create light curve chart for dashboard
   */
  createLightCurveChart(canvasId, data = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Generate sample light curve data if not provided
    const lightCurveData = data || this.generateLightCurveData();

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lightCurveData.time,
        datasets: [{
          label: 'Relative Brightness',
          data: lightCurveData.flux,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 1,
          pointHoverRadius: 4
        }]
      },
      options: {
        ...this.defaultOptions,
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
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Generate sample light curve data
   */
  generateLightCurveData() {
    const time = [];
    const flux = [];
    
    for (let i = 0; i < 200; i++) {
      time.push((i * 0.1).toFixed(1));
      
      // Simulate transit dip
      let brightness = 1.0;
      if (i >= 80 && i <= 120) {
        const transitPhase = (i - 80) / 40;
        brightness = 1.0 - 0.01 * Math.sin(transitPhase * Math.PI);
      }
      
      // Add some noise
      brightness += (Math.random() - 0.5) * 0.002;
      flux.push(brightness);
    }
    
    return { time, flux };
  }

  /**
   * Create probability distribution chart
   */
  createProbabilityChart(canvasId, probabilities) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const labels = Object.keys(probabilities).map(key => 
      key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    );
    const values = Object.values(probabilities).map(val => (val * 100).toFixed(1));

    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
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
        ...this.defaultOptions,
        plugins: {
          ...this.defaultOptions.plugins,
          legend: {
            position: 'bottom',
            labels: {
              color: '#e2e8f0',
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create transit depth chart
   */
  createTransitChart(canvasId, data = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Generate sample transit data if not provided
    const transitData = data || {
      phases: ['Pre-Transit', 'Ingress', 'Transit', 'Egress', 'Post-Transit'],
      depths: [0, 0.2, 0.8, 0.2, 0]
    };

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: transitData.phases,
        datasets: [{
          label: 'Transit Depth (%)',
          data: transitData.depths,
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          borderColor: '#8b5cf6',
          borderWidth: 2
        }]
      },
      options: {
        ...this.defaultOptions,
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
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Destroy all charts
   */
  destroyAll() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};
  }

  /**
   * Destroy specific chart
   */
  destroy(canvasId) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
      delete this.charts[canvasId];
    }
  }
}

// Global chart manager instance
const chartManager = new ChartManager();

/**
 * Initialize model page charts
 */
function initializeModelPage() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, skipping chart initialization');
    return;
  }

  // Initialize chart manager
  chartManager.init();

  // Create model page charts
  chartManager.createAccuracyChart('accuracy-chart');
  chartManager.createConfusionMatrix('confusion-matrix');
  chartManager.createROCChart('roc-chart');
  chartManager.createTrainingHistory('training-history');

  console.log('Model page charts initialized');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChartManager, chartManager, initializeModelPage };
}