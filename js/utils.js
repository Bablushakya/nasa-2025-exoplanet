// ExoPlanet AI - Utility Functions

/**
 * Utility class for common helper functions
 */
class Utils {
  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Execute immediately
   * @returns {Function} Debounced function
   */
  static debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  /**
   * Throttle function to limit function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Generate a random ID
   * @param {number} length - Length of the ID
   * @returns {string} Random ID
   */
  static generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Format percentage
   * @param {number} value - Value to format as percentage
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage
   */
  static formatPercentage(value, decimals = 1) {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate number within range
   * @param {number} value - Value to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} Is valid number
   */
  static isValidNumber(value, min = -Infinity, max = Infinity) {
    return !isNaN(value) && value >= min && value <= max;
  }

  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = Utils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * Get element by ID with error handling
   * @param {string} id - Element ID
   * @returns {HTMLElement|null} Element or null
   */
  static getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID '${id}' not found`);
    }
    return element;
  }

  /**
   * Add event listener with error handling
   * @param {HTMLElement} element - Element to add listener to
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  static addEventListener(element, event, handler, options = {}) {
    if (!element) {
      console.warn('Cannot add event listener: element is null');
      return;
    }
    element.addEventListener(event, handler, options);
  }

  /**
   * Remove event listener with error handling
   * @param {HTMLElement} element - Element to remove listener from
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  static removeEventListener(element, event, handler) {
    if (!element) {
      console.warn('Cannot remove event listener: element is null');
      return;
    }
    element.removeEventListener(event, handler);
  }

  /**
   * Animate counter from 0 to target value
   * @param {HTMLElement} element - Element to animate
   * @param {number} target - Target value
   * @param {number} duration - Animation duration in milliseconds
   * @param {Function} formatter - Optional formatter function
   */
  static animateCounter(element, target, duration = 2000, formatter = null) {
    if (!element) return;

    const start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * easeOut;
      
      const value = formatter ? formatter(current) : Math.floor(current);
      element.textContent = value;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = formatter ? formatter(target) : target;
      }
    };
    
    requestAnimationFrame(animate);
  }

  /**
   * Smooth scroll to element
   * @param {HTMLElement|string} target - Target element or selector
   * @param {number} offset - Offset from top
   * @param {number} duration - Animation duration
   */
  static smoothScrollTo(target, offset = 0, duration = 1000) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const easeInOut = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOut);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element to check
   * @param {number} threshold - Threshold percentage (0-1)
   * @returns {boolean} Is in viewport
   */
  static isInViewport(element, threshold = 0.1) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    return vertInView && horInView;
  }

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }

  /**
   * Get device type based on screen width
   * @returns {string} Device type (mobile, tablet, desktop)
   */
  static getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Check if user prefers reduced motion
   * @returns {boolean} Prefers reduced motion
   */
  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Get random number between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Clamp number between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linear interpolation between two values
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  static lerp(start, end, t) {
    return start + (end - start) * t;
  }

  /**
   * Map value from one range to another
   * @param {number} value - Value to map
   * @param {number} inMin - Input minimum
   * @param {number} inMax - Input maximum
   * @param {number} outMin - Output minimum
   * @param {number} outMax - Output maximum
   * @returns {number} Mapped value
   */
  static map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  /**
   * Format file size in human readable format
   * @param {number} bytes - File size in bytes
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted file size
   */
  static formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Parse CSV string to array of objects
   * @param {string} csv - CSV string
   * @param {string} delimiter - Column delimiter
   * @returns {Array} Array of objects
   */
  static parseCSV(csv, delimiter = ',') {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(delimiter).map(header => header.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(delimiter).map(value => value.trim());
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  }

  /**
   * Validate exoplanet data
   * @param {Object} data - Exoplanet data object
   * @returns {Object} Validation result with errors
   */
  static validateExoplanetData(data) {
    const errors = {};
    
    // Orbital Period validation
    if (!data.orbitalPeriod || !Utils.isValidNumber(data.orbitalPeriod, 0.1, 10000)) {
      errors.orbitalPeriod = 'Orbital period must be between 0.1 and 10,000 days';
    }
    
    // Transit Duration validation
    if (!data.transitDuration || !Utils.isValidNumber(data.transitDuration, 0.1, 24)) {
      errors.transitDuration = 'Transit duration must be between 0.1 and 24 hours';
    }
    
    // Planetary Radius validation
    if (!data.planetaryRadius || !Utils.isValidNumber(data.planetaryRadius, 0.1, 50)) {
      errors.planetaryRadius = 'Planetary radius must be between 0.1 and 50 Earth radii';
    }
    
    // Transit Depth validation
    if (!data.transitDepth || !Utils.isValidNumber(data.transitDepth, 0.001, 10)) {
      errors.transitDepth = 'Transit depth must be between 0.001% and 10%';
    }
    
    // Stellar Magnitude validation
    if (data.stellarMagnitude === undefined || !Utils.isValidNumber(data.stellarMagnitude, -5, 20)) {
      errors.stellarMagnitude = 'Stellar magnitude must be between -5 and 20';
    }
    
    // Equilibrium Temperature validation
    if (!data.equilibriumTemperature || !Utils.isValidNumber(data.equilibriumTemperature, 50, 3000)) {
      errors.equilibriumTemperature = 'Equilibrium temperature must be between 50K and 3000K';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

/**
 * Local Storage Manager
 */
class StorageManager {
  /**
   * Set item in localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Get item from localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  static getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all localStorage
   * @returns {boolean} Success status
   */
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   * @returns {Object} Storage usage stats
   */
  static getStorageInfo() {
    let totalSize = 0;
    let itemCount = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
        itemCount++;
      }
    }
    
    return {
      itemCount,
      totalSize,
      formattedSize: Utils.formatFileSize(totalSize * 2) // Rough estimate (UTF-16)
    };
  }
}

/**
 * Event Emitter for custom events
 */
class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {...*} args - Event arguments
   */
  emit(event, ...args) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    });
  }

  /**
   * Add one-time event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Utils, StorageManager, EventEmitter };
}