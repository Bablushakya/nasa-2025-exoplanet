// ExoPlanet AI - Status Indicator

/**
 * Status Indicator for Backend Connectivity
 */
class StatusIndicator {
  constructor() {
    this.isOnline = false;
    this.checkInterval = null;
    this.indicator = null;
    this.lastCheck = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  /**
   * Initialize status indicator
   */
  init() {
    this.createIndicator();
    this.startMonitoring();
    
    // Check immediately
    this.checkStatus();
  }

  /**
   * Create status indicator element
   */
  createIndicator() {
    // Check if indicator already exists
    if (document.getElementById('status-indicator')) return;

    const indicator = document.createElement('div');
    indicator.id = 'status-indicator';
    indicator.className = 'status-indicator offline';
    indicator.innerHTML = `
      <div class="status-dot"></div>
      <span class="status-text">Checking...</span>
      <div class="status-details">
        <small class="status-time">Never</small>
      </div>
    `;

    // Add styles
    const styles = `
      .status-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 12px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        color: #e2e8f0;
        z-index: 1000;
        transition: all 0.3s ease;
        cursor: pointer;
        min-width: 140px;
      }

      .status-indicator:hover {
        background: rgba(30, 41, 59, 1);
        border-color: rgba(99, 102, 241, 0.5);
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ef4444;
        animation: pulse 2s infinite;
      }

      .status-indicator.online .status-dot {
        background: #10b981;
      }

      .status-indicator.checking .status-dot {
        background: #f59e0b;
      }

      .status-text {
        font-weight: 500;
        flex: 1;
      }

      .status-details {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .status-time {
        font-size: 11px;
        color: #94a3b8;
        margin-top: 2px;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      @media (max-width: 768px) {
        .status-indicator {
          top: 10px;
          right: 10px;
          padding: 8px 12px;
          font-size: 12px;
          min-width: 120px;
        }
        
        .status-details {
          display: none;
        }
      }
    `;

    // Add styles to head if not already added
    if (!document.getElementById('status-indicator-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'status-indicator-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    // Add click handler for manual check
    indicator.addEventListener('click', () => {
      this.checkStatus(true);
    });

    document.body.appendChild(indicator);
    this.indicator = indicator;
  }

  /**
   * Start monitoring backend status
   */
  startMonitoring() {
    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkStatus();
    }, 30000);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check backend status
   */
  async checkStatus(manual = false) {
    if (!this.indicator) return;

    // Update UI to checking state
    this.indicator.className = 'status-indicator checking';
    this.indicator.querySelector('.status-text').textContent = 'Checking...';

    try {
      const startTime = Date.now();
      const response = await fetch('http://localhost:8000/api/v1/health', {
        method: 'GET',
        timeout: 5000,
        signal: AbortSignal.timeout(5000)
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        this.updateStatus(true, responseTime, data);
        this.retryCount = 0;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('Backend status check failed:', error.message);
      this.updateStatus(false, null, { error: error.message });
      
      // Increment retry count
      this.retryCount++;
      
      // If manual check or too many failures, show notification
      if (manual || this.retryCount >= this.maxRetries) {
        this.showNotification('Backend connection failed', 'error');
      }
    }

    this.lastCheck = new Date();
  }

  /**
   * Update status indicator
   */
  updateStatus(online, responseTime, data) {
    if (!this.indicator) return;

    this.isOnline = online;
    
    const statusClass = online ? 'online' : 'offline';
    const statusText = online ? 'Online' : 'Offline';
    const timeText = this.formatTime(this.lastCheck);
    
    this.indicator.className = `status-indicator ${statusClass}`;
    this.indicator.querySelector('.status-text').textContent = statusText;
    this.indicator.querySelector('.status-time').textContent = timeText;

    // Add response time for online status
    if (online && responseTime) {
      const responseTimeEl = this.indicator.querySelector('.status-time');
      responseTimeEl.textContent = `${timeText} (${responseTime}ms)`;
    }

    // Update tooltip
    const tooltipText = online 
      ? `Backend is online\nLast check: ${timeText}\nResponse time: ${responseTime}ms`
      : `Backend is offline\nLast check: ${timeText}\nError: ${data.error || 'Connection failed'}`;
    
    this.indicator.title = tooltipText;
  }

  /**
   * Format time for display
   */
  formatTime(date) {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else {
      return date.toLocaleTimeString();
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Use existing toast manager if available
    if (window.app && window.app.toastManager) {
      window.app.toastManager.show(message, type);
    } else {
      // Fallback to console
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      lastCheck: this.lastCheck,
      retryCount: this.retryCount
    };
  }

  /**
   * Destroy status indicator
   */
  destroy() {
    this.stopMonitoring();
    
    if (this.indicator) {
      this.indicator.remove();
      this.indicator = null;
    }
  }
}

// Global status indicator instance
const statusIndicator = new StatusIndicator();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on pages that need backend connectivity
  const needsBackend = [
    'dashboard.html',
    'api.html',
    'integration-test.html'
  ].some(page => window.location.pathname.includes(page));

  if (needsBackend || window.location.pathname === '/') {
    statusIndicator.init();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StatusIndicator, statusIndicator };
}