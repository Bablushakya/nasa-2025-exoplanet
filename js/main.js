// ExoPlanet AI - Main Application JavaScript

/**
 * Main Application Class
 */
class ExoPlanetApp {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.navigation = null;
    this.toastManager = null;
    this.loadingManager = null;
    this.themeManager = null;
    this.isInitialized = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this);
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.isInitialized) return;
    
    try {
      // Initialize core managers
      this.themeManager = new ThemeManager();
      this.navigation = new Navigation();
      this.toastManager = new ToastManager();
      this.loadingManager = new LoadingManager();
      
      // Initialize managers
      await this.themeManager.init();
      await this.navigation.init();
      await this.toastManager.init();
      await this.loadingManager.init();
      
      // Initialize page-specific functionality
      this.initializePageSpecific();
      
      // Initialize particles if on home page
      if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        this.initializeParticles();
      }
      
      // Initialize AOS (Animate On Scroll)
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          offset: 100,
          disable: Utils.prefersReducedMotion()
        });
      }
      
      this.isInitialized = true;
      this.eventEmitter.emit('app:initialized');
      
      console.log('ExoPlanet AI application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.toastManager?.show('Failed to initialize application', 'error');
    }
  }

  /**
   * Handle DOM content loaded
   */
  handleDOMContentLoaded() {
    this.init();
  }

  /**
   * Initialize page-specific functionality
   */
  initializePageSpecific() {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/') {
      this.initializeHomePage();
    } else if (path.includes('dashboard.html')) {
      this.initializeDashboard();
    } else if (path.includes('explorer.html')) {
      this.initializeExplorer();
    } else if (path.includes('learn.html')) {
      this.initializeLearnPage();
    } else if (path.includes('model.html')) {
      this.initializeModelPage();
    } else if (path.includes('api.html')) {
      this.initializeApiPage();
    } else if (path.includes('about.html')) {
      this.initializeAboutPage();
    }
  }

  /**
   * Initialize home page functionality
   */
  initializeHomePage() {
    // Initialize counter animations
    this.initializeCounterAnimations();
    
    // Initialize smooth scrolling for CTA buttons
    this.initializeSmoothScrolling();
    
    // Initialize hero animations
    this.initializeHeroAnimations();
  }

  /**
   * Initialize counter animations
   */
  initializeCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounters = () => {
      statNumbers.forEach(element => {
        if (Utils.isInViewport(element) && !element.classList.contains('animated')) {
          element.classList.add('animated');
          const target = parseInt(element.dataset.target);
          
          // Format based on the target value
          const formatter = (value) => {
            if (target > 1000) {
              return Utils.formatNumber(Math.floor(value));
            } else if (target < 100) {
              return value.toFixed(1);
            } else {
              return Math.floor(value).toString();
            }
          };
          
          Utils.animateCounter(element, target, 2000, formatter);
        }
      });
    };
    
    // Initial check
    animateCounters();
    
    // Check on scroll
    const throttledAnimateCounters = Utils.throttle(animateCounters, 100);
    window.addEventListener('scroll', throttledAnimateCounters);
  }

  /**
   * Initialize smooth scrolling
   */
  initializeSmoothScrolling() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          Utils.smoothScrollTo(targetElement, 80, 1000);
        }
      });
    });
  }

  /**
   * Initialize hero animations
   */
  initializeHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
    
    heroElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  /**
   * Initialize particles background
   */
  initializeParticles() {
    if (typeof particlesJS === 'undefined') {
      console.warn('Particles.js not loaded');
      return;
    }

    const particlesConfig = {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#6366f1'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#6366f1',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    };

    // Reduce particles on mobile
    if (Utils.getDeviceType() === 'mobile') {
      particlesConfig.particles.number.value = 40;
      particlesConfig.particles.line_linked.distance = 100;
    }

    particlesJS('particles-js', particlesConfig);
  }

  /**
   * Initialize dashboard (placeholder for dashboard.js)
   */
  initializeDashboard() {
    // This will be handled by dashboard.js
    console.log('Dashboard page detected');
  }

  /**
   * Initialize explorer (placeholder for explorer.js)
   */
  initializeExplorer() {
    // This will be handled by explorer.js
    console.log('Explorer page detected');
  }

  /**
   * Initialize learn page
   */
  initializeLearnPage() {
    this.initializeAccordion();
    this.initializeQuiz();
    this.initializeTransitAnimation();
  }

  /**
   * Initialize model page
   */
  initializeModelPage() {
    this.initializeModelCharts();
  }

  /**
   * Initialize API page
   */
  initializeApiPage() {
    this.initializeCodeTabs();
    this.initializeCopyButtons();
    this.initializeApiTester();
  }

  /**
   * Initialize about page
   */
  initializeAboutPage() {
    this.initializeContactForm();
    this.initializeTeamCards();
  }

  /**
   * Initialize accordion functionality
   */
  initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          accordionItem.classList.add('active');
        }
      });
    });
  }

  /**
   * Initialize quiz functionality
   */
  initializeQuiz() {
    // Quiz questions data
    const quizQuestions = [
      {
        question: "What is the most successful method for detecting exoplanets?",
        options: [
          "Direct imaging",
          "Transit method",
          "Radial velocity",
          "Gravitational lensing"
        ],
        correct: 1,
        explanation: "The transit method has been the most successful, discovering thousands of exoplanets by detecting the dimming of starlight when a planet passes in front of its host star."
      },
      {
        question: "What does transit depth tell us about an exoplanet?",
        options: [
          "Its distance from Earth",
          "Its orbital period",
          "Its size relative to its host star",
          "Its atmospheric composition"
        ],
        correct: 2,
        explanation: "Transit depth is the percentage decrease in starlight and is directly related to the planet's size - larger planets block more light, creating deeper transits."
      },
      {
        question: "Which space mission has discovered the most exoplanets?",
        options: [
          "Hubble Space Telescope",
          "Kepler Space Telescope",
          "James Webb Space Telescope",
          "Spitzer Space Telescope"
        ],
        correct: 1,
        explanation: "The Kepler Space Telescope has discovered over 2,600 confirmed exoplanets using the transit method during its primary and extended K2 mission."
      },
      {
        question: "What is a 'Hot Jupiter'?",
        options: [
          "A rocky planet close to its star",
          "A gas giant with a very short orbital period",
          "A planet hotter than its host star",
          "A Jupiter-sized planet in the habitable zone"
        ],
        correct: 1,
        explanation: "Hot Jupiters are gas giant exoplanets that orbit very close to their host stars, completing an orbit in just a few days and reaching extremely high temperatures."
      },
      {
        question: "What is the habitable zone?",
        options: [
          "The region where liquid water can exist",
          "The area around a black hole",
          "The zone where planets form",
          "The region with the most asteroids"
        ],
        correct: 0,
        explanation: "The habitable zone, also called the 'Goldilocks zone,' is the region around a star where temperatures are just right for liquid water to exist on a planet's surface."
      }
    ];

    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];

    const questionContainer = Utils.getElementById('question-container');
    const currentQuestionSpan = Utils.getElementById('current-question');
    const totalQuestionsSpan = Utils.getElementById('total-questions');
    const progressFill = Utils.getElementById('quiz-progress');
    const nextButton = Utils.getElementById('next-question');
    const prevButton = Utils.getElementById('prev-question');
    const submitButton = Utils.getElementById('submit-quiz');
    const resultsDiv = Utils.getElementById('quiz-results');
    const finalScoreSpan = Utils.getElementById('final-score');
    const scoreMessageP = Utils.getElementById('score-message');
    const restartButton = Utils.getElementById('restart-quiz');

    if (!questionContainer) return;

    // Set total questions
    if (totalQuestionsSpan) {
      totalQuestionsSpan.textContent = quizQuestions.length;
    }

    const renderQuestion = () => {
      const question = quizQuestions[currentQuestion];
      
      questionContainer.innerHTML = `
        <div class="question">
          <h3>${question.question}</h3>
          <div class="options">
            ${question.options.map((option, index) => `
              <label class="option">
                <input type="radio" name="answer" value="${index}">
                <span class="option-text">${option}</span>
              </label>
            `).join('')}
          </div>
          <div class="feedback" id="feedback" style="display: none;"></div>
        </div>
      `;

      // Update progress
      if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestion + 1;
      }
      if (progressFill) {
        progressFill.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
      }

      // Update button states
      if (prevButton) {
        prevButton.style.display = currentQuestion > 0 ? 'block' : 'none';
      }
      if (nextButton) {
        nextButton.style.display = currentQuestion < quizQuestions.length - 1 ? 'block' : 'none';
        nextButton.disabled = true;
      }
      if (submitButton) {
        submitButton.style.display = currentQuestion === quizQuestions.length - 1 ? 'block' : 'none';
        submitButton.disabled = true;
      }

      // Add event listeners to options
      const options = questionContainer.querySelectorAll('input[name="answer"]');
      options.forEach(option => {
        option.addEventListener('change', () => {
          if (nextButton) nextButton.disabled = false;
          if (submitButton) submitButton.disabled = false;
        });
      });

      // Restore previous answer if exists
      if (userAnswers[currentQuestion] !== undefined) {
        const savedAnswer = userAnswers[currentQuestion];
        const savedOption = questionContainer.querySelector(`input[value="${savedAnswer}"]`);
        if (savedOption) {
          savedOption.checked = true;
          if (nextButton) nextButton.disabled = false;
          if (submitButton) submitButton.disabled = false;
        }
      }
    };

    const showFeedback = (selectedAnswer) => {
      const question = quizQuestions[currentQuestion];
      const feedbackDiv = Utils.getElementById('feedback');
      const isCorrect = selectedAnswer == question.correct;
      
      if (feedbackDiv) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackDiv.innerHTML = `
          <div class="feedback-result">
            <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
            ${isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
          <div class="feedback-explanation">${question.explanation}</div>
        `;
      }

      // Highlight correct answer
      const options = questionContainer.querySelectorAll('.option');
      options.forEach((option, index) => {
        if (index == question.correct) {
          option.classList.add('correct');
        } else if (index == selectedAnswer && !isCorrect) {
          option.classList.add('incorrect');
        }
      });
    };

    const nextQuestion = () => {
      const selectedAnswer = questionContainer.querySelector('input[name="answer"]:checked');
      if (selectedAnswer) {
        userAnswers[currentQuestion] = parseInt(selectedAnswer.value);
        if (userAnswers[currentQuestion] == quizQuestions[currentQuestion].correct) {
          score++;
        }
      }

      if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        renderQuestion();
      }
    };

    const prevQuestion = () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
      }
    };

    const submitQuiz = () => {
      const selectedAnswer = questionContainer.querySelector('input[name="answer"]:checked');
      if (selectedAnswer) {
        userAnswers[currentQuestion] = parseInt(selectedAnswer.value);
        if (userAnswers[currentQuestion] == quizQuestions[currentQuestion].correct) {
          score++;
        }
      }

      showResults();
    };

    const showResults = () => {
      const percentage = (score / quizQuestions.length) * 100;
      
      if (finalScoreSpan) {
        finalScoreSpan.textContent = `${score}/${quizQuestions.length}`;
      }
      
      if (scoreMessageP) {
        let message = '';
        if (percentage >= 80) {
          message = 'Excellent! You have a great understanding of exoplanets!';
        } else if (percentage >= 60) {
          message = 'Good job! You know quite a bit about exoplanets.';
        } else if (percentage >= 40) {
          message = 'Not bad! Keep learning about these fascinating worlds.';
        } else {
          message = 'Keep exploring! There\'s so much more to discover about exoplanets.';
        }
        scoreMessageP.textContent = message;
      }

      // Hide quiz content and show results
      document.querySelector('.quiz-content').style.display = 'none';
      if (resultsDiv) {
        resultsDiv.style.display = 'block';
      }
    };

    const restartQuiz = () => {
      currentQuestion = 0;
      score = 0;
      userAnswers = [];
      
      document.querySelector('.quiz-content').style.display = 'block';
      if (resultsDiv) {
        resultsDiv.style.display = 'none';
      }
      
      renderQuestion();
    };

    // Event listeners
    if (nextButton) {
      nextButton.addEventListener('click', nextQuestion);
    }
    if (prevButton) {
      prevButton.addEventListener('click', prevQuestion);
    }
    if (submitButton) {
      submitButton.addEventListener('click', submitQuiz);
    }
    if (restartButton) {
      restartButton.addEventListener('click', restartQuiz);
    }

    // Initialize first question
    renderQuestion();
  }

  /**
   * Initialize transit animation
   */
  initializeTransitAnimation() {
    const transitAnimation = Utils.getElementById('transit-animation');
    if (!transitAnimation) return;

    // Simple CSS animation will be handled by CSS
    // This is a placeholder for more complex animations if needed
  }

  /**
   * Initialize model page charts
   */
  initializeModelPage() {
    // This will be expanded when charts.js is implemented
    console.log('Model page initialized');
  }

  /**
   * Initialize code tabs
   */
  initializeCodeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  /**
   * Initialize copy buttons
   */
  initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const textToCopy = button.dataset.copy;
        if (textToCopy) {
          const success = await Utils.copyToClipboard(textToCopy);
          if (success) {
            this.toastManager.show('Copied to clipboard!', 'success');
            
            // Visual feedback
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
              button.innerHTML = originalIcon;
            }, 1000);
          } else {
            this.toastManager.show('Failed to copy to clipboard', 'error');
          }
        }
      });
    });
  }

  /**
   * Initialize API tester
   */
  initializeApiTester() {
    const apiForm = Utils.getElementById('api-test-form');
    const responseContainer = Utils.getElementById('api-response');
    
    if (!apiForm || !responseContainer) return;

    apiForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading
      this.loadingManager.show('Testing API...');
      
      try {
        // Get form data
        const formData = new FormData(apiForm);
        const data = {
          orbital_period: parseFloat(formData.get('orbitalPeriod') || Utils.getElementById('test-orbital-period').value),
          transit_duration: parseFloat(formData.get('transitDuration') || Utils.getElementById('test-transit-duration').value),
          planetary_radius: parseFloat(formData.get('planetaryRadius') || Utils.getElementById('test-planetary-radius').value),
          transit_depth: parseFloat(formData.get('transitDepth') || Utils.getElementById('test-transit-depth').value),
          stellar_magnitude: parseFloat(formData.get('stellarMagnitude') || Utils.getElementById('test-stellar-magnitude').value),
          equilibrium_temperature: parseFloat(formData.get('equilibriumTemperature') || Utils.getElementById('test-equilibrium-temperature').value)
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
          throw new Error(`Validation failed:\n${errorMessages}`);
        }

        // Make API call
        const response = await apiService.predictExoplanet(data);
        
        // Display response
        responseContainer.innerHTML = `
          <div class="api-response-success">
            <h4>✅ API Response</h4>
            <pre><code class="language-json">${JSON.stringify(response.data, null, 2)}</code></pre>
          </div>
        `;

        this.toastManager.show('API test completed successfully!', 'success');
      } catch (error) {
        console.error('API test failed:', error);
        
        // Display error
        responseContainer.innerHTML = `
          <div class="api-response-error">
            <h4>❌ API Error</h4>
            <pre><code class="language-json">${JSON.stringify({
              error: error.message,
              timestamp: new Date().toISOString()
            }, null, 2)}</code></pre>
          </div>
        `;

        this.toastManager.show(`API test failed: ${error.message}`, 'error');
      } finally {
        this.loadingManager.hide();
      }
    });
  }

  /**
   * Initialize contact form
   */
  initializeContactForm() {
    const contactForm = Utils.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading
      this.loadingManager.show('Sending message...');
      
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      contactForm.reset();
      
      this.loadingManager.hide();
      this.toastManager.show('Message sent successfully! We\'ll get back to you soon.', 'success');
    });
  }

  /**
   * Initialize team cards
   */
  initializeTeamCards() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
      member.addEventListener('mouseenter', () => {
        member.style.transform = 'translateY(-10px)';
      });
      
      member.addEventListener('mouseleave', () => {
        member.style.transform = 'translateY(0)';
      });
    });
  }
}

/**
 * Navigation Manager
 */
class Navigation {
  constructor() {
    this.navbar = null;
    this.navToggle = null;
    this.navMenu = null;
    this.isMenuOpen = false;
  }

  async init() {
    this.navbar = Utils.getElementById('navbar');
    this.navToggle = Utils.getElementById('nav-toggle');
    this.navMenu = Utils.getElementById('nav-menu');
    
    if (this.navToggle && this.navMenu) {
      this.setupMobileMenu();
    }
    
    this.setupScrollEffect();
    this.highlightActivePage();
  }

  setupMobileMenu() {
    this.navToggle.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navbar.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close menu when clicking on a link
    const navLinks = this.navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
  }

  setupScrollEffect() {
    let lastScrollY = window.scrollY;
    
    const handleScroll = Utils.throttle(() => {
      const currentScrollY = window.scrollY;
      
      if (this.navbar) {
        if (currentScrollY > 100) {
          this.navbar.style.background = 'rgba(30, 41, 59, 0.95)';
          this.navbar.style.backdropFilter = 'blur(20px)';
        } else {
          this.navbar.style.background = 'rgba(30, 41, 59, 0.7)';
          this.navbar.style.backdropFilter = 'blur(10px)';
        }
      }
      
      lastScrollY = currentScrollY;
    }, 100);

    window.addEventListener('scroll', handleScroll);
  }

  highlightActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath || 
          (currentPath === '/' && linkPath.includes('index.html'))) {
        link.classList.add('active');
      }
    });
  }
}

/**
 * Theme Manager
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'dark';
    this.themeToggle = null;
  }

  async init() {
    this.themeToggle = Utils.getElementById('theme-toggle');
    
    // Load saved theme
    const savedTheme = StorageManager.getItem('theme', 'dark');
    this.setTheme(savedTheme);
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
    
    StorageManager.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getTheme() {
    return this.currentTheme;
  }
}

/**
 * Toast Manager
 */
class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = [];
  }

  async init() {
    this.container = Utils.getElementById('toast-container');
    if (!this.container) {
      this.createContainer();
    }
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 4000) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Auto remove
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);

    return toast;
  }

  createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    toast.innerHTML = `
      <div class="toast-content">
        <i class="toast-icon fas ${iconMap[type] || iconMap.info}"></i>
        <p class="toast-message">${message}</p>
        <button class="toast-close" aria-label="Close notification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.removeToast(toast);
    });

    return toast;
  }

  removeToast(toast) {
    if (!toast || !toast.parentElement) return;
    
    toast.classList.remove('show');
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
      
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }

  clear() {
    this.toasts.forEach(toast => this.removeToast(toast));
  }
}

/**
 * Loading Manager
 */
class LoadingManager {
  constructor() {
    this.overlay = null;
    this.isVisible = false;
  }

  async init() {
    this.overlay = Utils.getElementById('loading-overlay');
    if (!this.overlay) {
      this.createOverlay();
    }
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'loading-overlay';
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-text">Loading...</div>
      </div>
    `;
    document.body.appendChild(this.overlay);
  }

  show(text = 'Loading...') {
    if (!this.overlay) return;
    
    const spinnerText = this.overlay.querySelector('.spinner-text');
    if (spinnerText) {
      spinnerText.textContent = text;
    }
    
    this.overlay.classList.add('active');
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
  }

  hide() {
    if (!this.overlay) return;
    
    this.overlay.classList.remove('active');
    this.isVisible = false;
    document.body.style.overflow = 'auto';
  }

  isShowing() {
    return this.isVisible;
  }
}

// Global functions for page-specific initialization
window.initializeLearnPage = function() {
  if (window.exoPlanetApp) {
    window.exoPlanetApp.initializeLearnPage();
  }
};

window.initializeModelPage = function() {
  if (window.exoPlanetApp) {
    window.exoPlanetApp.initializeModelPage();
  }
};

window.initializeApiPage = function() {
  if (window.exoPlanetApp) {
    window.exoPlanetApp.initializeApiPage();
  }
};

// Test backend connection
async function testBackendConnection() {
  try {
    console.log('🔗 Testing backend connection...');
    const response = await fetch(`${CONFIG.APP.BACKEND_URL}/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connected successfully:', data);
      
      // Show success notification if toast manager is available
      if (window.exoPlanetApp && window.exoPlanetApp.toastManager) {
        window.exoPlanetApp.toastManager.show('🚀 Backend connected successfully!', 'success', 3000);
      }
      
      return true;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    
    // Show error notification if toast manager is available
    if (window.exoPlanetApp && window.exoPlanetApp.toastManager) {
      window.exoPlanetApp.toastManager.show('⚠️ Backend connection failed. Some features may not work.', 'error', 5000);
    }
    
    return false;
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.exoPlanetApp = new ExoPlanetApp();
  window.exoPlanetApp.handleDOMContentLoaded();
  
  // Test backend connection after a short delay
  setTimeout(() => {
    testBackendConnection();
  }, 2000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden
    console.log('Page hidden');
  } else {
    // Page is visible
    console.log('Page visible');
  }
});

// Handle errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  if (window.exoPlanetApp && window.exoPlanetApp.toastManager) {
    window.exoPlanetApp.toastManager.show('An unexpected error occurred', 'error');
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (window.exoPlanetApp && window.exoPlanetApp.toastManager) {
    window.exoPlanetApp.toastManager.show('An unexpected error occurred', 'error');
  }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExoPlanetApp, Navigation, ThemeManager, ToastManager, LoadingManager };
}