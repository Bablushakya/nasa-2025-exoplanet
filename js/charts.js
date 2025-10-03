// ExoPlanet AI - Chart Configurations and Utilities

/**
 * Chart Manager Class
 */
class ChartManager {
  constructor() {
    this.charts = new Map();
    this.defaultOptions = this.getDefaultOptions();
  }

  /**
   * Get default chart options for consistent theming
   */
  getDefaultOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#e2e8f0',
            font: {
              family: 'Inter, sans-serif',
              size: 12
            },
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          titleColor: '#e2e8f0',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(148, 163, 184, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          titleFont: {
            family: 'Inter, sans-serif',
            size: 13,
            weight: '600'
          },
          bodyFont: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#94a3b8',
            font: {
              family: 'Inter, sans-serif',
              size: 11
            }
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.1)',
            drawBorder: false
          },
          title: {
            color: '#e2e8f0',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              weight: '500'
            }
          }
        },
        y: {
          ticks: {
            color: '#94a3b8',
            font: {
              family: 'Inter, sans-serif',
              size: 11
            }
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.1)',
            drawBorder: false
          },
          title: {
            color: '#e2e8f0',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              weight: '500'
            }
          }
        }
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
          borderWidth: 2
        },
        line: {
          borderWidth: 2,
          tension: 0.4
        },
        bar: {
          borderRadius: 4,
          borderSkipped: false
        }
      },
      animation: {
        duration: Utils.prefersReducedMotion() ? 0 : 1000,
        easing: 'easeInOutQuart'
      }
    };
  }

  /**
   * Create or update a chart
   */
  createChart(canvasId, type, data, options = {}) {
    const canvas = Utils.getElementById(canvasId);
    if (!canvas) {
      console.warn(`Canvas with ID '${canvasId}' not found`);
      return null;
    }

    // Destroy existing chart
    this.destroyChart(canvasId);

    const ctx = canvas.getContext('2d');
    const mergedOptions = this.mergeOptions(type, options);

    const chart = new Chart(ctx, {
      type,
      data,
      options: mergedOptions
    });

    // Store chart reference
    this.charts.set(canvasId, chart);
    canvas.chart = chart;

    return chart;
  }

  /**
   * Update existing chart data
   */
  updateChart(canvasId, newData, newOptions = {}) {
    const chart = this.charts.get(canvasId);
    if (!chart) {
      console.warn(`Chart with ID '${canvasId}' not found`);
      return;
    }

    // Update data
    if (newData.labels) chart.data.labels = newData.labels;
    if (newData.datasets) chart.data.datasets = newData.datasets;

    // Update options if provided
    if (Object.keys(newOptions).length > 0) {
      chart.options = this.mergeOptions(chart.config.type, newOptions);
    }

    chart.update();
  }

  /**
   * Destroy a chart
   */
  destroyChart(canvasId) {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.destroy();
      this.charts.delete(canvasId);
    }

    const canvas = Utils.getElementById(canvasId);
    if (canvas && canvas.chart) {
      canvas.chart.destroy();
      delete canvas.chart;
    }
  }

  /**
   * Destroy all charts
   */
  destroyAllCharts() {
    this.charts.forEach((chart, canvasId) => {
      this.destroyChart(canvasId);
    });
  }

  /**
   * Merge default options with custom options
   */
  mergeOptions(type, customOptions) {
    const typeSpecificOptions = this.getTypeSpecificOptions(type);
    return Utils.deepClone({
      ...this.defaultOptions,
      ...typeSpecificOptions,
      ...customOptions
    });
  }

  /**
   * Get type-specific default options
   */
  getTypeSpecificOptions(type) {
    const options = {
      line: {
        elements: {
          point: {
            radius: 3,
            hoverRadius: 5
          }
        }
      },
      bar: {
        plugins: {
          legend: {
            display: false
          }
        }
      },
      doughnut: {
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      },
      pie: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      },
      scatter: {
        elements: {
          point: {
            radius: 5,
            hoverRadius: 7
          }
        }
      }
    };

    return options[type] || {};
  }

  /**
   * Create light curve chart
   */
  createLightCurveChart(canvasId, lightCurveData, options = {}) {
    const data = {
      labels: lightCurveData.map(point => point.time.toFixed(2)),
      datasets: [{
        label: 'Normalized Flux',
        data: lightCurveData.map(point => point.flux),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    const chartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (days)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Normalized Flux'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (context) => `Time: ${context[0].label} days`,
            label: (context) => `Flux: ${context.parsed.y.toFixed(6)}`
          }
        }
      },
      ...options
    };

    return this.createChart(canvasId, 'line', data, chartOptions);
  }

  /**
   * Create probability distribution chart
   */
  createProbabilityChart(canvasId, probabilities, options = {}) {
    const data = {
      labels: ['Confirmed', 'Candidate', 'False Positive'],
      datasets: [{
        data: [
          probabilities.confirmed * 100,
          probabilities.candidate * 100,
          probabilities.falsePositive * 100
        ],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    };

    const chartOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label;
              const value = context.parsed;
              return `${label}: ${value.toFixed(1)}%`;
            }
          }
        }
      },
      ...options
    };

    return this.createChart(canvasId, 'doughnut', data, chartOptions);
  }

  /**
   * Create accuracy chart
   */
  createAccuracyChart(canvasId, accuracyData, options = {}) {
    const data = {
      labels: ['Precision', 'Recall', 'F1-Score', 'Accuracy'],
      datasets: [{
        label: 'Performance Metrics',
        data: [
          accuracyData.precision * 100,
          accuracyData.recall * 100,
          accuracyData.f1Score * 100,
          accuracyData.accuracy
        ],
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#3b82f6',
          '#10b981'
        ],
        borderRadius: 4
      }]
    };

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Percentage (%)'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed.y.toFixed(1)}%`
          }
        }
      },
      ...options
    };

    return this.createChart(canvasId, 'bar', data, chartOptions);
  }

  /**
   * Create confusion matrix chart
   */
  createConfusionMatrixChart(canvasId, confusionMatrix, options = {}) {
    const labels = ['Confirmed', 'Candidate', 'False Positive'];
    const datasets = [];

    // Create dataset for each row of confusion matrix
    confusionMatrix.forEach((row, i) => {
      datasets.push({
        label: `Actual ${labels[i]}`,
        data: row,
        backgroundColor: [
          i === 0 ? '#10b981' : 'rgba(16, 185, 129, 0.3)',
          i === 1 ? '#f59e0b' : 'rgba(245, 158, 11, 0.3)',
          i === 2 ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'
        ]
      });
    });

    const data = {
      labels: labels.map(label => `Predicted ${label}`),
      datasets
    };

    const chartOptions = {
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Predicted Class'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Number of Samples'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (context) => `${context[0].dataset.label} → ${context[0].label}`,
            label: (context) => `Count: ${context.parsed.y}`
          }
        }
      },
      ...options
    };

    return this.createChart(canvasId, 'bar', data, chartOptions);
  }

  /**
   * Create ROC curve chart
   */
  createROCChart(canvasId, rocData, options = {}) {
    const datasets = Object.keys(rocData).map((className, index) => {
      const colors = ['#10b981', '#f59e0b', '#ef4444'];
      return {
        label: `${className} (AUC: ${rocData[className].auc.toFixed(3)})`,
        data: rocData[className].points.map(point => ({
          x: point.fpr,
          y: point.tpr
        })),
        borderColor: colors[index],
        backgroundColor: colors[index] + '20',
        fill: false,
        tension: 0.1
      };
    });

    // Add diagonal reference line
    datasets.push({
      label: 'Random Classifier',
      data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      borderColor: '#64748b',
      borderDash: [5, 5],
      fill: false,
      pointRadius: 0
    });

    const data = { datasets };

    const chartOptions = {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 1,
          title: {
            display: true,
            text: 'False Positive Rate'
          }
        },
        y: {
          min: 0,
          max: 1,
          title: {
            display: true,
            text: 'True Positive Rate'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: () => 'ROC Curve',
            label: (context) => {
              const point = context.parsed;
              return `${context.dataset.label}: (${point.x.toFixed(3)}, ${point.y.toFixed(3)})`;
            }
          }
        }
      },
      ...options
    };

    return this.createChart(canvasId, 'line', data, chartOptions);
  }

  /**
   * Create training history chart
   */
  createTrainingHistoryChart(canvasId, historyData, options = {}) {
    const data = {
      labels: historyData.epochs,
      datasets: [
        {
          label: 'Training Accuracy',
          data: historyData.accuracy,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          yAxisID: 'y'
        },
        {
          label: 'Validation Accuracy',
          data: historyData.valAccuracy,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          yAxisID: 'y'
        },
        {
          label: 'Training Loss',
          data: historyData.loss,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          yAxisID: 'y1'
        },
        {
          label: 'Validation Loss',
          data: historyData.valLoss,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          yAxisID: 'y1'
        }
      ]
    };

    const chartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Epoch'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Accuracy'
          },
          min: 0,
          max: 1
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Loss'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (context) => `Epoch ${context[0].label}`,
            label: (context) => {
              const value = context.parsed.y.toFixed(4);
              return `${context.dataset.label}: ${value}`;
            }
          }
        }
      },
      ...options
    };

    return this.createChart(canvasId, 'line', data, chartOptions);
  }

  /**
   * Create planet comparison chart
   */
  createPlanetComparisonChart(canvasId, planetData, comparisonPlanets, options = {}) {
    const planets = ['This Planet', ...comparisonPlanets.map(p => p.name)];
    const radii = [planetData.planetaryRadius, ...comparisonPlanets.map(p => p.radius)];
    const periods = [planetData.orbitalPeriod, ...comparisonPlanets.map(p => p.period)];

    const data = {
      datasets: [
        {
          label: 'Planetary Radius (R⊕)',
          data: planets.map((planet, i) => ({
            x: periods[i],
            y: radii[i],
            label: planet
          })),
          backgroundColor: planets.map((_, i) => 
            i === 0 ? '#6366f1' : 'rgba(99, 102, 241, 0.6)'
          ),
          borderColor: '#6366f1',
          borderWidth: 2
        }
      ]
    };

    const chartOptions = {
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
        tooltip: {
          callbacks: {
            title: (context) => context[0].raw.label,
            label: (context) => [
              `Radius: ${context.parsed.y.toFixed(2)} R⊕`,
              `Period: ${context.parsed.x.toFixed(1)} days`
            ]
          }
        },
        legend: {
          display: false
        }
      },
      ...options
    };

    return this.createChart(canvasId, 'scatter', data, chartOptions);
  }

  /**
   * Resize all charts (useful for responsive design)
   */
  resizeAllCharts() {
    this.charts.forEach(chart => {
      chart.resize();
    });
  }

  /**
   * Update chart theme (for dark/light mode switching)
   */
  updateChartTheme(isDark = true) {
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.3)';
    const tooltipBg = isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)';

    this.charts.forEach(chart => {
      // Update legend colors
      if (chart.options.plugins?.legend?.labels) {
        chart.options.plugins.legend.labels.color = textColor;
      }

      // Update tooltip colors
      if (chart.options.plugins?.tooltip) {
        chart.options.plugins.tooltip.backgroundColor = tooltipBg;
        chart.options.plugins.tooltip.titleColor = textColor;
        chart.options.plugins.tooltip.bodyColor = textColor;
      }

      // Update scale colors
      ['x', 'y', 'y1'].forEach(scaleId => {
        const scale = chart.options.scales?.[scaleId];
        if (scale) {
          if (scale.ticks) scale.ticks.color = textColor;
          if (scale.title) scale.title.color = textColor;
          if (scale.grid) scale.grid.color = gridColor;
        }
      });

      chart.update();
    });
  }
}

// Create global chart manager instance
window.chartManager = new ChartManager();

// Handle window resize
window.addEventListener('resize', Utils.throttle(() => {
  window.chartManager.resizeAllCharts();
}, 250));

// Handle theme changes
document.addEventListener('themeChanged', (event) => {
  window.chartManager.updateChartTheme(event.detail.theme === 'dark');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChartManager };
}