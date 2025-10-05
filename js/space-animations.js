// ExoPlanet AI - Space-Themed Animations & Interactive Elements

/**
 * Space Animation Manager
 */
class SpaceAnimationManager {
  constructor() {
    this.particles = [];
    this.stars = [];
    this.isAnimating = false;
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    
    // Animation settings
    this.settings = {
      particles: {
        count: 50,
        speed: 0.5,
        size: { min: 1, max: 3 },
        opacity: { min: 0.1, max: 0.8 }
      },
      stars: {
        count: 100,
        twinkleSpeed: 0.02,
        size: { min: 0.5, max: 2 }
      },
      nebula: {
        colors: ['#6366f1', '#8b5cf6', '#3b82f6'],
        intensity: 0.1
      }
    };
  }

  /**
   * Initialize space animations
   */
  init() {
    this.createCosmicBackground();
    this.initializeParticleSystem();
    this.setupInteractiveElements();
    this.startAnimationLoop();
    
    // Reduce animations on mobile for performance
    if (Utils.getDeviceType() === 'mobile') {
      this.settings.particles.count = 25;
      this.settings.stars.count = 50;
    }
  }

  /**
   * Create cosmic background canvas
   */
  createCosmicBackground() {
    // Check if canvas already exists
    if (document.getElementById('cosmic-canvas')) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cosmic-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Resize canvas to match window size
   */
  resizeCanvas() {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Initialize particle system
   */
  initializeParticleSystem() {
    // Create particles
    for (let i = 0; i < this.settings.particles.count; i++) {
      this.particles.push(this.createParticle());
    }
    
    // Create stars
    for (let i = 0; i < this.settings.stars.count; i++) {
      this.stars.push(this.createStar());
    }
  }

  /**
   * Create a particle
   */
  createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * this.settings.particles.speed,
      vy: (Math.random() - 0.5) * this.settings.particles.speed,
      size: Math.random() * (this.settings.particles.size.max - this.settings.particles.size.min) + this.settings.particles.size.min,
      opacity: Math.random() * (this.settings.particles.opacity.max - this.settings.particles.opacity.min) + this.settings.particles.opacity.min,
      color: this.settings.nebula.colors[Math.floor(Math.random() * this.settings.nebula.colors.length)],
      life: Math.random() * 100
    };
  }

  /**
   * Create a star
   */
  createStar() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * (this.settings.stars.size.max - this.settings.stars.size.min) + this.settings.stars.size.min,
      opacity: Math.random(),
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: this.settings.stars.twinkleSpeed + Math.random() * 0.01
    };
  }

  /**
   * Animation loop
   */
  startAnimationLoop() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.animate();
  }

  /**
   * Main animation function
   */
  animate() {
    if (!this.ctx || !this.canvas) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw stars
    this.drawStars();
    
    // Draw particles
    this.drawParticles();
    
    // Update particles
    this.updateParticles();
    
    // Continue animation
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Draw stars
   */
  drawStars() {
    this.stars.forEach(star => {
      // Update twinkle
      star.twinkle += star.twinkleSpeed;
      const twinkleOpacity = (Math.sin(star.twinkle) + 1) / 2;
      
      this.ctx.save();
      this.ctx.globalAlpha = star.opacity * twinkleOpacity;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  /**
   * Draw particles
   */
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  /**
   * Update particles
   */
  updateParticles() {
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update life
      particle.life += 0.5;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Reset particle if life exceeded
      if (particle.life > 100) {
        this.particles[index] = this.createParticle();
      }
    });
  }

  /**
   * Setup interactive elements
   */
  setupInteractiveElements() {
    this.setupPlanetHoverEffects();
    this.setupTransitAnimations();
    this.setupDataVisualizationEffects();
    this.setupFormInteractions();
    this.setupNavigationEffects();
  }

  /**
   * Planet hover effects
   */
  setupPlanetHoverEffects() {
    const planetElements = document.querySelectorAll('.planet-card, .floating-planet, .planet-icon');
    
    planetElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.createOrbitEffect(e.target);
        this.addGlowEffect(e.target);
      });
      
      element.addEventListener('mouseleave', (e) => {
        this.removeOrbitEffect(e.target);
        this.removeGlowEffect(e.target);
      });
    });
  }

  /**
   * Create orbit effect around element
   */
  createOrbitEffect(element) {
    const orbit = document.createElement('div');
    orbit.className = 'orbit-effect';
    orbit.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 150%;
      height: 150%;
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: planetOrbit 3s linear infinite;
      pointer-events: none;
      z-index: -1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(orbit);
  }

  /**
   * Remove orbit effect
   */
  removeOrbitEffect(element) {
    const orbit = element.querySelector('.orbit-effect');
    if (orbit) {
      orbit.remove();
    }
  }

  /**
   * Add glow effect
   */
  addGlowEffect(element) {
    element.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
    element.style.transition = 'box-shadow 0.3s ease';
  }

  /**
   * Remove glow effect
   */
  removeGlowEffect(element) {
    element.style.boxShadow = '';
  }

  /**
   * Transit animations for exoplanet detection
   */
  setupTransitAnimations() {
    const transitElements = document.querySelectorAll('.transit-animation, .light-curve-demo');
    
    transitElements.forEach(element => {
      this.createTransitVisualization(element);
    });
  }

  /**
   * Create transit visualization
   */
  createTransitVisualization(container) {
    if (!container) return;
    
    container.innerHTML = `
      <div class="transit-system">
        <div class="host-star"></div>
        <div class="exoplanet"></div>
        <div class="light-rays">
          <div class="ray"></div>
          <div class="ray"></div>
          <div class="ray"></div>
          <div class="ray"></div>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .transit-system {
        position: relative;
        width: 200px;
        height: 200px;
        margin: 0 auto;
      }
      
      .host-star {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, #fbbf24, #f59e0b);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
        animation: starPulse 2s ease-in-out infinite;
      }
      
      .exoplanet {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #6366f1, #4f46e5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: transitOrbit 8s linear infinite;
      }
      
      .light-rays {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        transform: translate(-50%, -50%);
      }
      
      .ray {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 50px;
        background: linear-gradient(to bottom, rgba(251, 191, 36, 0.8), transparent);
        transform-origin: bottom center;
        animation: rayRotate 4s linear infinite;
      }
      
      .ray:nth-child(1) { transform: translate(-50%, -100%) rotate(0deg); }
      .ray:nth-child(2) { transform: translate(-50%, -100%) rotate(90deg); }
      .ray:nth-child(3) { transform: translate(-50%, -100%) rotate(180deg); }
      .ray:nth-child(4) { transform: translate(-50%, -100%) rotate(270deg); }
      
      @keyframes starPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
      }
      
      @keyframes transitOrbit {
        0% { transform: translate(-50%, -50%) translateX(-80px); }
        50% { transform: translate(-50%, -50%) translateX(80px); }
        100% { transform: translate(-50%, -50%) translateX(-80px); }
      }
      
      @keyframes rayRotate {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
    `;
    
    if (!document.getElementById('transit-styles')) {
      style.id = 'transit-styles';
      document.head.appendChild(style);
    }
  }

  /**
   * Data visualization effects
   */
  setupDataVisualizationEffects() {
    const charts = document.querySelectorAll('canvas[id*="chart"]');
    
    charts.forEach(canvas => {
      this.addChartAnimations(canvas);
    });
  }

  /**
   * Add chart animations
   */
  addChartAnimations(canvas) {
    if (!canvas) return;
    
    // Add glow effect on hover
    canvas.addEventListener('mouseenter', () => {
      canvas.style.filter = 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))';
      canvas.style.transition = 'filter 0.3s ease';
    });
    
    canvas.addEventListener('mouseleave', () => {
      canvas.style.filter = '';
    });
  }

  /**
   * Form interaction effects
   */
  setupFormInteractions() {
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        this.createInputAura(e.target);
      });
      
      input.addEventListener('blur', (e) => {
        this.removeInputAura(e.target);
      });
    });
  }

  /**
   * Create input aura effect
   */
  createInputAura(input) {
    const aura = document.createElement('div');
    aura.className = 'input-aura';
    aura.style.cssText = `
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #6366f1, #8b5cf6, #3b82f6, #6366f1);
      background-size: 400% 400%;
      border-radius: inherit;
      z-index: -1;
      animation: gradientShift 3s ease infinite;
    `;
    
    input.style.position = 'relative';
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(aura);
  }

  /**
   * Remove input aura effect
   */
  removeInputAura(input) {
    const aura = input.parentNode.querySelector('.input-aura');
    if (aura) {
      aura.remove();
    }
  }

  /**
   * Navigation effects
   */
  setupNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.createNavLinkEffect(link);
      });
    });
  }

  /**
   * Create navigation link effect
   */
  createNavLinkEffect(link) {
    // Create shooting star effect
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.cssText = `
      position: absolute;
      top: 50%;
      left: -10px;
      width: 2px;
      height: 2px;
      background: #6366f1;
      border-radius: 50%;
      box-shadow: 0 0 6px #6366f1;
      animation: shootingStar 0.6s ease-out forwards;
    `;
    
    link.style.position = 'relative';
    link.appendChild(star);
    
    // Remove after animation
    setTimeout(() => {
      if (star.parentNode) {
        star.remove();
      }
    }, 600);
  }

  /**
   * Create exoplanet discovery effect
   */
  createDiscoveryEffect(element) {
    const discovery = document.createElement('div');
    discovery.className = 'discovery-effect';
    discovery.innerHTML = `
      <div class="discovery-rings">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
      </div>
      <div class="discovery-particles">
        ${Array.from({length: 8}, (_, i) => `<div class="particle particle-${i}"></div>`).join('')}
      </div>
    `;
    
    discovery.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.appendChild(discovery);
    
    // Add styles for discovery effect
    this.addDiscoveryStyles();
    
    // Remove after animation
    setTimeout(() => {
      if (discovery.parentNode) {
        discovery.remove();
      }
    }, 2000);
  }

  /**
   * Add discovery effect styles
   */
  addDiscoveryStyles() {
    if (document.getElementById('discovery-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'discovery-styles';
    style.textContent = `
      .discovery-rings {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .ring {
        position: absolute;
        border: 2px solid rgba(99, 102, 241, 0.6);
        border-radius: 50%;
        animation: discoveryRing 2s ease-out forwards;
      }
      
      .ring-1 {
        width: 20px;
        height: 20px;
        top: -10px;
        left: -10px;
        animation-delay: 0s;
      }
      
      .ring-2 {
        width: 40px;
        height: 40px;
        top: -20px;
        left: -20px;
        animation-delay: 0.3s;
      }
      
      .ring-3 {
        width: 60px;
        height: 60px;
        top: -30px;
        left: -30px;
        animation-delay: 0.6s;
      }
      
      .discovery-particles {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #6366f1;
        border-radius: 50%;
        animation: discoveryParticle 1.5s ease-out forwards;
      }
      
      .particle-0 { animation-delay: 0.2s; }
      .particle-1 { animation-delay: 0.3s; }
      .particle-2 { animation-delay: 0.4s; }
      .particle-3 { animation-delay: 0.5s; }
      .particle-4 { animation-delay: 0.6s; }
      .particle-5 { animation-delay: 0.7s; }
      .particle-6 { animation-delay: 0.8s; }
      .particle-7 { animation-delay: 0.9s; }
      
      @keyframes discoveryRing {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(3);
          opacity: 0;
        }
      }
      
      @keyframes discoveryParticle {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) translate(var(--dx, 30px), var(--dy, 30px)) scale(0);
          opacity: 0;
        }
      }
      
      @keyframes shootingStar {
        0% {
          transform: translateX(0) scale(0);
          opacity: 1;
        }
        50% {
          transform: translateX(50px) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateX(100px) scale(0);
          opacity: 0;
        }
      }
      
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Trigger prediction animation
   */
  triggerPredictionAnimation(element) {
    element.classList.add('animate-discovery');
    this.createDiscoveryEffect(element);
    
    // Add AI thinking effect
    const aiEffect = document.createElement('div');
    aiEffect.className = 'ai-thinking-effect';
    aiEffect.innerHTML = `
      <div class="neural-nodes">
        ${Array.from({length: 6}, (_, i) => `<div class="node node-${i}"></div>`).join('')}
      </div>
      <div class="neural-connections">
        ${Array.from({length: 8}, (_, i) => `<div class="connection connection-${i}"></div>`).join('')}
      </div>
    `;
    
    element.appendChild(aiEffect);
    
    setTimeout(() => {
      element.classList.remove('animate-discovery');
      if (aiEffect.parentNode) {
        aiEffect.remove();
      }
    }, 3000);
  }

  /**
   * Stop all animations
   */
  stop() {
    this.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  /**
   * Destroy animation manager
   */
  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    // Remove all created elements
    document.querySelectorAll('.orbit-effect, .input-aura, .shooting-star, .discovery-effect').forEach(el => {
      el.remove();
    });
  }
}

// Global space animation manager instance
const spaceAnimations = new SpaceAnimationManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if not on mobile or if user prefers motion
  if (Utils.getDeviceType() !== 'mobile' && !Utils.prefersReducedMotion()) {
    spaceAnimations.init();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpaceAnimationManager, spaceAnimations };
}