// ExoPlanet AI - Interactive Quiz System

/**
 * Interactive Quiz Manager
 */
class InteractiveQuiz {
  constructor() {
    this.questions = [];
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = [];
    this.timeLimit = 30; // seconds per question
    this.timeRemaining = 0;
    this.timerInterval = null;
    this.isActive = false;
    this.streakCount = 0;
    this.maxStreak = 0;
    this.hintsUsed = 0;
    this.achievements = [];
    this.difficulty = 'mixed'; // easy, medium, hard, mixed
    this.selectedAnswer = null;
  }

  /**
   * Initialize quiz
   */
  init() {
    this.loadQuestions();
    this.setupEventListeners();
    this.showStartScreen();
    console.log('Interactive quiz initialized');
  }

  /**
   * Load quiz questions with variety and difficulty levels
   */
  loadQuestions() {
    this.questions = [
      {
        id: 1,
        question: "What is the most successful method for detecting exoplanets?",
        options: [
          "Direct imaging",
          "Transit method",
          "Radial velocity",
          "Gravitational microlensing"
        ],
        correct: 1,
        explanation: "The transit method has discovered the most exoplanets by detecting the slight dimming of starlight when a planet passes in front of its host star.",
        hint: "Think about what happens when a planet passes between us and its star.",
        difficulty: "easy",
        category: "Detection Methods",
        points: 10
      },
      {
        id: 2,
        question: "What does the transit depth tell us about an exoplanet?",
        options: [
          "Its orbital period",
          "Its distance from Earth",
          "Its size relative to its star",
          "Its atmospheric composition"
        ],
        correct: 2,
        explanation: "Transit depth is the percentage decrease in starlight during a transit, which directly relates to the planet's size compared to its star.",
        hint: "The deeper the transit, the larger the planet compared to its star.",
        difficulty: "medium",
        category: "Transit Photometry",
        points: 15
      },
      {
        id: 3,
        question: "Which space telescope has discovered the most exoplanets?",
        options: [
          "Hubble Space Telescope",
          "Kepler Space Telescope",
          "James Webb Space Telescope",
          "Spitzer Space Telescope"
        ],
        correct: 1,
        explanation: "The Kepler Space Telescope discovered over 2,600 confirmed exoplanets during its mission from 2009 to 2018.",
        hint: "This telescope was specifically designed to hunt for exoplanets using the transit method.",
        difficulty: "easy",
        category: "Space Missions",
        points: 10
      },

      {
        id: 4,
        question: "What is the habitable zone around a star?",
        options: [
          "The region where liquid water can exist",
          "The area with the strongest magnetic field",
          "The zone with the most asteroids",
          "The region closest to the star"
        ],
        correct: 0,
        explanation: "The habitable zone, also called the Goldilocks zone, is the region around a star where temperatures allow liquid water to exist on a planet's surface.",
        hint: "Think about what conditions are necessary for life as we know it.",
        difficulty: "easy",
        category: "Habitability",
        points: 10
      },
      {
        id: 5,
        question: "What causes the radial velocity method to work?",
        options: [
          "Planet's gravitational pull on its star",
          "Planet's magnetic field",
          "Planet's atmospheric absorption",
          "Planet's rotation speed"
        ],
        correct: 0,
        explanation: "The radial velocity method detects the tiny wobble of a star caused by the gravitational pull of an orbiting planet, creating a Doppler shift in the star's light.",
        hint: "Newton's third law: for every action, there's an equal and opposite reaction.",
        difficulty: "medium",
        category: "Detection Methods",
        points: 15
      },
      {
        id: 6,
        question: "What is a 'Hot Jupiter'?",
        options: [
          "A very hot star",
          "A gas giant very close to its star",
          "A rocky planet with high temperature",
          "Jupiter during summer"
        ],
        correct: 1,
        explanation: "Hot Jupiters are gas giant exoplanets that orbit very close to their host stars, resulting in extremely high surface temperatures.",
        hint: "Think about a planet like Jupiter, but much closer to its star than Mercury is to our Sun.",
        difficulty: "medium",
        category: "Planet Types",
        points: 15
      },
      {
        id: 7,
        question: "What is the approximate size of Earth compared to Jupiter?",
        options: [
          "Earth is about 1/5 the size of Jupiter",
          "Earth is about 1/11 the size of Jupiter",
          "Earth is about 1/2 the size of Jupiter",
          "Earth is about the same size as Jupiter"
        ],
        correct: 1,
        explanation: "Earth's radius is about 6,371 km while Jupiter's radius is about 69,911 km, making Earth roughly 1/11th the size of Jupiter.",
        hint: "Jupiter is the largest planet in our solar system, much larger than Earth.",
        difficulty: "medium",
        category: "Planetary Science",
        points: 15
      },
      {
        id: 8,
        question: "What does 'AU' stand for in astronomy?",
        options: [
          "Absolute Unit",
          "Astronomical Unit",
          "Atomic Unit",
          "Angular Unit"
        ],
        correct: 1,
        explanation: "An Astronomical Unit (AU) is the average distance between Earth and the Sun, approximately 150 million kilometers or 93 million miles.",
        hint: "It's a unit of distance based on our own solar system.",
        difficulty: "easy",
        category: "Astronomy Basics",
        points: 10
      },
      {
        id: 9,
        question: "Which factor makes a planet more likely to be habitable?",
        options: [
          "Very fast rotation",
          "Presence of a magnetic field",
          "Extremely thick atmosphere",
          "Very elliptical orbit"
        ],
        correct: 1,
        explanation: "A magnetic field helps protect a planet's atmosphere from being stripped away by stellar wind, which is crucial for maintaining conditions suitable for life.",
        hint: "Think about what protects Earth's atmosphere from the solar wind.",
        difficulty: "hard",
        category: "Habitability",
        points: 20
      },
      {
        id: 10,
        question: "What is the main challenge in directly imaging exoplanets?",
        options: [
          "Planets are too small",
          "Stars are much brighter than planets",
          "Planets move too fast",
          "Space telescopes are not powerful enough"
        ],
        correct: 1,
        explanation: "Stars are billions of times brighter than the planets orbiting them, making it extremely difficult to see the faint light reflected by exoplanets.",
        hint: "Imagine trying to see a firefly next to a searchlight from miles away.",
        difficulty: "medium",
        category: "Detection Methods",
        points: 15
      },
      {
        id: 11,
        question: "What is a 'Super-Earth'?",
        options: [
          "A planet exactly like Earth but bigger",
          "A rocky planet larger than Earth but smaller than Neptune",
          "A planet with super powers",
          "The largest planet in any solar system"
        ],
        correct: 1,
        explanation: "Super-Earths are rocky planets that are larger than Earth (1.25-2 Earth radii) but smaller than Neptune. They're the most common type of exoplanet.",
        hint: "It's about size, not superpowers!",
        difficulty: "medium",
        category: "Planet Types",
        points: 15
      },
      {
        id: 12,
        question: "How long does light from Proxima Centauri take to reach Earth?",
        options: [
          "4.2 minutes",
          "4.2 hours",
          "4.2 days",
          "4.2 years"
        ],
        correct: 3,
        explanation: "Proxima Centauri is about 4.2 light-years away, meaning light from this star takes 4.2 years to reach Earth.",
        hint: "The term 'light-year' is a clue to the answer.",
        difficulty: "medium",
        category: "Astronomy Basics",
        points: 15
      },
      {
        id: 13,
        question: "What advantage do space telescopes have for exoplanet detection?",
        options: [
          "They're closer to the planets",
          "They avoid atmospheric interference",
          "They're larger than ground telescopes",
          "They can travel to other star systems"
        ],
        correct: 1,
        explanation: "Space telescopes avoid Earth's atmospheric turbulence and absorption, allowing for more precise measurements needed for exoplanet detection.",
        hint: "Think about what makes stars twinkle when viewed from Earth.",
        difficulty: "medium",
        category: "Space Missions",
        points: 15
      },
      {
        id: 14,
        question: "What is the 'Goldilocks principle' in exoplanet science?",
        options: [
          "Planets must be made of gold",
          "Conditions must be 'just right' for life",
          "Planets must have three moons",
          "Stars must be yellow like our Sun"
        ],
        correct: 1,
        explanation: "The Goldilocks principle refers to conditions being 'just right' - not too hot, not too cold, but just right for liquid water and potentially life.",
        hint: "Remember the fairy tale about porridge that was just right?",
        difficulty: "easy",
        category: "Habitability",
        points: 10
      },
      {
        id: 15,
        question: "Which method can determine an exoplanet's mass?",
        options: [
          "Transit method only",
          "Radial velocity method",
          "Direct imaging only",
          "Gravitational microlensing only"
        ],
        correct: 1,
        explanation: "The radial velocity method can determine a planet's mass by measuring how much the star wobbles due to the planet's gravitational pull.",
        hint: "Mass is related to gravitational force, which causes stellar motion.",
        difficulty: "hard",
        category: "Detection Methods",
        points: 20
      }
    ];
  }
  /**
  
 * Setup event listeners
   */
  setupEventListeners() {
    // Start quiz button
    const startBtn = document.getElementById('start-quiz-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuiz());
    }

    // Difficulty selection
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectDifficulty(btn.dataset.difficulty);
      });
    });
  }

  /**
   * Show start screen
   */
  showStartScreen() {
    const quizSection = document.querySelector('.quiz-section');
    if (!quizSection) return;

    quizSection.innerHTML = `
      <h2 class="section-title">🧠 Interactive Exoplanet Quiz</h2>
      <div class="quiz-start-screen" id="quiz-start-screen">
        <div class="quiz-intro">
          <div class="quiz-hero">
            <div class="quiz-icon">
              <i class="fas fa-rocket"></i>
            </div>
            <h3>Test Your Exoplanet Knowledge!</h3>
            <p>Challenge yourself with questions about exoplanet detection, types, and the latest discoveries. Choose your difficulty level and see how much you've learned!</p>
          </div>

          <div class="quiz-features">
            <div class="feature-card">
              <i class="fas fa-clock"></i>
              <h4>Timed Questions</h4>
              <p>30 seconds per question</p>
            </div>
            <div class="feature-card">
              <i class="fas fa-lightbulb"></i>
              <h4>Helpful Hints</h4>
              <p>Get hints when you need them</p>
            </div>
            <div class="feature-card">
              <i class="fas fa-trophy"></i>
              <h4>Achievements</h4>
              <p>Unlock badges and streaks</p>
            </div>
            <div class="feature-card">
              <i class="fas fa-chart-line"></i>
              <h4>Progress Tracking</h4>
              <p>See your improvement over time</p>
            </div>
          </div>

          <div class="difficulty-selection">
            <h4>Choose Your Challenge Level:</h4>
            <div class="difficulty-buttons">
              <button class="difficulty-btn easy" data-difficulty="easy">
                <i class="fas fa-seedling"></i>
                <span class="diff-title">Beginner</span>
                <span class="diff-desc">Basic concepts</span>
                <span class="diff-points">10 pts per question</span>
              </button>
              <button class="difficulty-btn medium" data-difficulty="medium">
                <i class="fas fa-star"></i>
                <span class="diff-title">Intermediate</span>
                <span class="diff-desc">Moderate challenge</span>
                <span class="diff-points">15 pts per question</span>
              </button>
              <button class="difficulty-btn hard" data-difficulty="hard">
                <i class="fas fa-fire"></i>
                <span class="diff-title">Expert</span>
                <span class="diff-desc">Advanced topics</span>
                <span class="diff-points">20 pts per question</span>
              </button>
              <button class="difficulty-btn mixed selected" data-difficulty="mixed">
                <i class="fas fa-random"></i>
                <span class="diff-title">Mixed</span>
                <span class="diff-desc">All levels</span>
                <span class="diff-points">Variable points</span>
              </button>
            </div>
          </div>

          <div class="quiz-stats">
            <div class="stat-item">
              <span class="stat-number">15+</span>
              <span class="stat-label">Questions</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">5</span>
              <span class="stat-label">Categories</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">10</span>
              <span class="stat-label">Questions per quiz</span>
            </div>
          </div>

          <button class="btn btn-primary btn-large start-quiz-btn" id="start-quiz-btn">
            <i class="fas fa-play"></i>
            Start Quiz Adventure
          </button>
        </div>
      </div>

      <!-- Quiz Container (hidden initially) -->
      <div class="quiz-container" id="quiz-container" style="display: none;">
        <div class="quiz-header">
          <div class="quiz-progress-section">
            <div class="progress-info">
              <span class="progress-text">
                Question <span id="current-question">1</span> of <span id="total-questions">10</span>
              </span>
              <div class="score-display">
                Score: <span id="current-score">0</span> pts
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" id="quiz-progress"></div>
            </div>
          </div>
          <div class="quiz-stats-bar">
            <div class="stat-badge">
              <i class="fas fa-fire"></i>
              <span id="streak-count">0</span>
            </div>
            <div class="stat-badge">
              <i class="fas fa-clock"></i>
              <span id="time-remaining">30</span>s
            </div>
            <div class="stat-badge">
              <i class="fas fa-lightbulb"></i>
              <span id="hints-remaining">3</span>
            </div>
          </div>
        </div>

        <div id="question-container">
          <!-- Questions will be populated by JavaScript -->
        </div>

        <div class="quiz-navigation">
          <button class="btn btn-secondary" id="prev-question" style="display: none;">
            <i class="fas fa-arrow-left"></i> Previous
          </button>
          <button class="btn btn-primary" id="next-question" style="display: none;">
            Next <i class="fas fa-arrow-right"></i>
          </button>
          <button class="btn btn-success" id="submit-quiz" style="display: none;">
            <i class="fas fa-check"></i> Submit Quiz
          </button>
        </div>
      </div>

      <!-- Results Container (hidden initially) -->
      <div class="quiz-results" id="quiz-results" style="display: none;">
        <!-- Results will be populated by JavaScript -->
      </div>
    `;

    // Re-setup event listeners
    this.setupEventListeners();
  }

  /**
   * Select difficulty level
   */
  selectDifficulty(difficulty) {
    this.difficulty = difficulty;
    
    // Update button states
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');
  }

  /**
   * Start quiz with selected difficulty
   */
  startQuiz() {
    this.isActive = true;
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = [];
    this.streakCount = 0;
    this.maxStreak = 0;
    this.hintsUsed = 0;
    this.selectedAnswer = null;
    
    // Filter questions by difficulty
    this.filterQuestionsByDifficulty();
    
    // Shuffle and select 10 questions
    this.shuffleQuestions();
    
    // Show quiz container
    this.showQuizContainer();
    this.showQuestion();
    this.startTimer();
  }

  /**
   * Filter questions by selected difficulty
   */
  filterQuestionsByDifficulty() {
    if (this.difficulty === 'mixed') {
      // Keep all questions for mixed mode
      return;
    }
    
    this.questions = this.questions.filter(q => q.difficulty === this.difficulty);
  }

  /**
   * Shuffle questions and select 10
   */
  shuffleQuestions() {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
    }
    // Take only 10 questions for the quiz
    this.questions = this.questions.slice(0, 10);
  }

  /**
   * Show quiz container
   */
  showQuizContainer() {
    const startScreen = document.getElementById('quiz-start-screen');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('quiz-results');
    
    if (startScreen) startScreen.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';
  } 
 /**
   * Show current question
   */
  showQuestion() {
    const question = this.questions[this.currentQuestion];
    if (!question) return;

    this.selectedAnswer = null;
    this.updateProgress();
    this.updateStats();

    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
      questionContainer.innerHTML = this.createQuestionHTML(question);
    }

    this.setupQuestionHandlers();
    this.resetTimer();
    this.startTimer();
  }

  /**
   * Create question HTML
   */
  createQuestionHTML(question) {
    return `
      <div class="question-card animate-in">
        <div class="question-header">
          <div class="question-meta">
            <span class="question-category">${question.category}</span>
            <span class="question-difficulty ${question.difficulty}">${question.difficulty.toUpperCase()}</span>
            <span class="question-points">+${question.points} pts</span>
          </div>
          <div class="timer-display">
            <div class="timer-circle">
              <svg class="timer-svg" viewBox="0 0 36 36">
                <path class="timer-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path class="timer-progress" id="timer-progress" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              </svg>
              <div class="timer-text" id="timer-text">30</div>
            </div>
          </div>
        </div>
        
        <h3 class="question-text">${question.question}</h3>
        
        <div class="question-options">
          ${question.options.map((option, index) => `
            <div class="option-card" data-option="${index}">
              <div class="option-indicator">
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
              </div>
              <div class="option-content">
                <span class="option-text">${option}</span>
              </div>
              <div class="option-status">
                <i class="fas fa-check"></i>
                <i class="fas fa-times"></i>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="question-actions">
          <button class="action-btn hint-btn" id="hint-btn" ${this.hintsUsed >= 3 ? 'disabled' : ''}>
            <i class="fas fa-lightbulb"></i>
            <span>Hint</span>
          </button>
          <button class="action-btn skip-btn" id="skip-btn">
            <i class="fas fa-forward"></i>
            <span>Skip</span>
          </button>
        </div>
        
        <div class="question-feedback" id="question-feedback" style="display: none;">
          <!-- Feedback will be inserted here -->
        </div>
      </div>
    `;
  }

  /**
   * Setup question event handlers
   */
  setupQuestionHandlers() {
    // Option selection
    const options = document.querySelectorAll('.option-card');
    options.forEach(option => {
      option.addEventListener('click', () => {
        if (this.selectedAnswer !== null) return; // Already answered
        
        const selectedIndex = parseInt(option.dataset.option);
        this.selectOption(selectedIndex);
      });
    });

    // Hint button
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.showHint());
    }

    // Skip button
    const skipBtn = document.getElementById('skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.skipQuestion());
    }
  }

  /**
   * Select an option
   */
  selectOption(selectedIndex) {
    if (this.selectedAnswer !== null || !this.isActive) return;

    this.selectedAnswer = selectedIndex;
    this.stopTimer();

    const question = this.questions[this.currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    // Record answer
    this.answers[this.currentQuestion] = {
      selected: selectedIndex,
      correct: question.correct,
      isCorrect: isCorrect,
      timeUsed: this.timeLimit - this.timeRemaining,
      points: isCorrect ? question.points : 0
    };

    // Update score and streak
    if (isCorrect) {
      this.score += question.points;
      this.streakCount++;
      this.maxStreak = Math.max(this.maxStreak, this.streakCount);
    } else {
      this.streakCount = 0;
    }

    // Show feedback and update UI
    this.showFeedback(isCorrect, question);
    this.updateOptionStyles(selectedIndex, question.correct);
    this.updateStats();

    // Auto-advance after delay
    setTimeout(() => {
      if (this.currentQuestion < this.questions.length - 1) {
        this.nextQuestion();
      } else {
        this.showSubmitButton();
      }
    }, 3000);
  }

  /**
   * Show feedback for answer
   */
  showFeedback(isCorrect, question) {
    const feedbackContainer = document.getElementById('question-feedback');
    if (!feedbackContainer) return;

    const streakBonus = this.streakCount > 1 ? `<div class="streak-bonus">🔥 ${this.streakCount} streak! +${this.streakCount} bonus points!</div>` : '';
    
    feedbackContainer.innerHTML = `
      <div class="feedback-content ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="feedback-header">
          <div class="feedback-icon">
            <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
          </div>
          <div class="feedback-title">
            <h4>${isCorrect ? 'Correct!' : 'Incorrect'}</h4>
            <span class="points-earned">${isCorrect ? `+${question.points} points` : '0 points'}</span>
          </div>
        </div>
        ${streakBonus}
        <div class="feedback-explanation">
          <p><strong>Explanation:</strong> ${question.explanation}</p>
        </div>
        <div class="feedback-encouragement">
          ${this.getRandomEncouragement(isCorrect)}
        </div>
      </div>
    `;

    feedbackContainer.style.display = 'block';
    feedbackContainer.classList.add('animate-in');
  }

  /**
   * Get random encouragement message
   */
  getRandomEncouragement(isCorrect) {
    const correctMessages = [
      "🌟 Excellent! You're becoming an exoplanet expert!",
      "🚀 Great job! Your knowledge is stellar!",
      "⭐ Perfect! Keep up the amazing work!",
      "🎯 Bullseye! You're on fire!",
      "🏆 Outstanding! You've got this!"
    ];

    const incorrectMessages = [
      "🤔 Don't worry! Every expert was once a beginner.",
      "💪 Keep going! Learning is a journey, not a destination.",
      "🧠 Good try! You're building valuable knowledge.",
      "🌱 Close! Every mistake is a step toward mastery.",
      "🔍 Keep exploring! The universe has so much to teach us!"
    ];

    const messages = isCorrect ? correctMessages : incorrectMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Update option styles after selection
   */
  updateOptionStyles(selectedIndex, correctIndex) {
    const options = document.querySelectorAll('.option-card');
    
    options.forEach((option, index) => {
      option.classList.add('answered');
      
      if (index === correctIndex) {
        option.classList.add('correct');
      } else if (index === selectedIndex && index !== correctIndex) {
        option.classList.add('incorrect');
      } else {
        option.classList.add('disabled');
      }
    });
  }  
/**
   * Show hint
   */
  showHint() {
    if (this.hintsUsed >= 3) return;

    const question = this.questions[this.currentQuestion];
    this.hintsUsed++;
    
    // Show hint in feedback area
    const feedbackContainer = document.getElementById('question-feedback');
    if (feedbackContainer) {
      feedbackContainer.innerHTML = `
        <div class="hint-content">
          <div class="hint-header">
            <i class="fas fa-lightbulb"></i>
            <h4>Hint</h4>
          </div>
          <p>${question.hint}</p>
        </div>
      `;
      feedbackContainer.style.display = 'block';
    }

    // Update hint button
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      if (this.hintsUsed >= 3) {
        hintBtn.disabled = true;
        hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i><span>No hints left</span>';
      } else {
        hintBtn.innerHTML = `<i class="fas fa-lightbulb"></i><span>Hint (${3 - this.hintsUsed} left)</span>`;
      }
    }

    this.updateStats();
  }

  /**
   * Skip question
   */
  skipQuestion() {
    this.stopTimer();
    this.selectedAnswer = -1; // Mark as skipped
    
    // Record as skipped
    this.answers[this.currentQuestion] = {
      selected: -1,
      correct: this.questions[this.currentQuestion].correct,
      isCorrect: false,
      skipped: true,
      timeUsed: this.timeLimit - this.timeRemaining,
      points: 0
    };

    this.streakCount = 0;

    // Show skip feedback
    const feedbackContainer = document.getElementById('question-feedback');
    if (feedbackContainer) {
      feedbackContainer.innerHTML = `
        <div class="feedback-content skipped">
          <div class="feedback-header">
            <i class="fas fa-forward"></i>
            <h4>Question Skipped</h4>
          </div>
          <p>The correct answer was: <strong>${this.questions[this.currentQuestion].options[this.questions[this.currentQuestion].correct]}</strong></p>
          <p>${this.questions[this.currentQuestion].explanation}</p>
        </div>
      `;
      feedbackContainer.style.display = 'block';
    }

    setTimeout(() => {
      if (this.currentQuestion < this.questions.length - 1) {
        this.nextQuestion();
      } else {
        this.showSubmitButton();
      }
    }, 2000);
  }

  /**
   * Timer functions
   */
  startTimer() {
    this.timeRemaining = this.timeLimit;
    this.updateTimerDisplay();
    
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.timeRemaining = this.timeLimit;
  }

  updateTimerDisplay() {
    const timerText = document.getElementById('timer-text');
    const timerProgress = document.getElementById('timer-progress');
    const timeRemainingSpan = document.getElementById('time-remaining');
    
    if (timerText) {
      timerText.textContent = this.timeRemaining;
    }
    
    if (timeRemainingSpan) {
      timeRemainingSpan.textContent = this.timeRemaining;
    }
    
    if (timerProgress) {
      const percentage = (this.timeRemaining / this.timeLimit) * 100;
      timerProgress.style.strokeDasharray = `${percentage}, 100`;
      
      // Change color when time is running out
      if (this.timeRemaining <= 5) {
        timerProgress.style.stroke = 'var(--error-color)';
      } else if (this.timeRemaining <= 10) {
        timerProgress.style.stroke = 'var(--warning-color)';
      } else {
        timerProgress.style.stroke = 'var(--success-color)';
      }
    }
  }

  timeUp() {
    if (this.selectedAnswer !== null) return; // Already answered
    
    this.stopTimer();
    this.selectedAnswer = -2; // Mark as timed out
    
    // Record as timed out
    this.answers[this.currentQuestion] = {
      selected: -2,
      correct: this.questions[this.currentQuestion].correct,
      isCorrect: false,
      timedOut: true,
      timeUsed: this.timeLimit,
      points: 0
    };

    this.streakCount = 0;

    // Show timeout feedback
    const feedbackContainer = document.getElementById('question-feedback');
    if (feedbackContainer) {
      feedbackContainer.innerHTML = `
        <div class="feedback-content timeout">
          <div class="feedback-header">
            <i class="fas fa-clock"></i>
            <h4>Time's Up!</h4>
          </div>
          <p>The correct answer was: <strong>${this.questions[this.currentQuestion].options[this.questions[this.currentQuestion].correct]}</strong></p>
          <p>${this.questions[this.currentQuestion].explanation}</p>
        </div>
      `;
      feedbackContainer.style.display = 'block';
    }

    setTimeout(() => {
      if (this.currentQuestion < this.questions.length - 1) {
        this.nextQuestion();
      } else {
        this.showSubmitButton();
      }
    }, 3000);
  }

  /**
   * Navigation functions
   */
  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.showQuestion();
    }
  }

  showSubmitButton() {
    const submitBtn = document.getElementById('submit-quiz');
    if (submitBtn) {
      submitBtn.style.display = 'block';
      submitBtn.addEventListener('click', () => this.submitQuiz());
    }
  }

  /**
   * Update progress and stats
   */
  updateProgress() {
    const progressFill = document.getElementById('quiz-progress');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');

    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;

    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    if (currentQuestionSpan) {
      currentQuestionSpan.textContent = this.currentQuestion + 1;
    }

    if (totalQuestionsSpan) {
      totalQuestionsSpan.textContent = this.questions.length;
    }
  }

  updateStats() {
    const currentScoreSpan = document.getElementById('current-score');
    const streakCountSpan = document.getElementById('streak-count');
    const hintsRemainingSpan = document.getElementById('hints-remaining');

    if (currentScoreSpan) {
      currentScoreSpan.textContent = this.score;
    }

    if (streakCountSpan) {
      streakCountSpan.textContent = this.streakCount;
    }

    if (hintsRemainingSpan) {
      hintsRemainingSpan.textContent = Math.max(0, 3 - this.hintsUsed);
    }
  }

  /**
   * Submit quiz and show results
   */
  submitQuiz() {
    this.isActive = false;
    this.stopTimer();
    
    const results = this.calculateResults();
    this.showResults(results);
    this.checkAchievements(results);
  }

  /**
   * Calculate quiz results
   */
  calculateResults() {
    const totalQuestions = this.questions.length;
    const correctAnswers = this.answers.filter(a => a.isCorrect).length;
    const skippedQuestions = this.answers.filter(a => a.skipped).length;
    const timedOutQuestions = this.answers.filter(a => a.timedOut).length;
    const totalPoints = this.answers.reduce((sum, a) => sum + (a.points || 0), 0);
    const maxPossiblePoints = this.questions.reduce((sum, q) => sum + q.points, 0);
    const averageTime = this.answers.reduce((sum, a) => sum + (a.timeUsed || 0), 0) / totalQuestions;
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    let grade = 'F';
    let message = 'Keep studying! You\'ll master this with practice.';
    let color = 'error';
    
    if (percentage >= 90) {
      grade = 'A+';
      message = '🏆 Outstanding! You\'re an exoplanet expert!';
      color = 'success';
    } else if (percentage >= 80) {
      grade = 'A';
      message = '🌟 Excellent work! You have great knowledge!';
      color = 'success';
    } else if (percentage >= 70) {
      grade = 'B';
      message = '👍 Good job! You\'re well on your way!';
      color = 'primary';
    } else if (percentage >= 60) {
      grade = 'C';
      message = '📚 Not bad! Keep learning to improve!';
      color = 'warning';
    } else if (percentage >= 50) {
      grade = 'D';
      message = '🤔 You\'re getting there! Review and try again!';
      color = 'warning';
    }

    return {
      totalQuestions,
      correctAnswers,
      skippedQuestions,
      timedOutQuestions,
      percentage,
      grade,
      message,
      color,
      totalPoints,
      maxPossiblePoints,
      maxStreak: this.maxStreak,
      hintsUsed: this.hintsUsed,
      averageTime: Math.round(averageTime),
      difficulty: this.difficulty
    };
  }  /**

   * Show quiz results
   */
  showResults(results) {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('quiz-results');
    
    if (quizContainer) quizContainer.style.display = 'none';
    if (resultsContainer) {
      resultsContainer.innerHTML = this.createResultsHTML(results);
      resultsContainer.style.display = 'block';
      
      // Setup results event listeners
      this.setupResultsHandlers();
    }
  }

  /**
   * Create results HTML
   */
  createResultsHTML(results) {
    return `
      <div class="results-content animate-in">
        <div class="results-header">
          <div class="grade-display ${results.color}">
            <div class="grade-circle">
              <span class="grade-text">${results.grade}</span>
            </div>
            <div class="grade-info">
              <h2>Quiz Complete!</h2>
              <p class="results-message">${results.message}</p>
            </div>
          </div>
        </div>
        
        <div class="results-stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon"><i class="fas fa-percentage"></i></div>
            <div class="stat-info">
              <span class="stat-value">${results.percentage}%</span>
              <span class="stat-label">Accuracy</span>
            </div>
          </div>
          
          <div class="stat-card success">
            <div class="stat-icon"><i class="fas fa-star"></i></div>
            <div class="stat-info">
              <span class="stat-value">${results.totalPoints}</span>
              <span class="stat-label">Points Earned</span>
            </div>
          </div>
          
          <div class="stat-card warning">
            <div class="stat-icon"><i class="fas fa-fire"></i></div>
            <div class="stat-info">
              <span class="stat-value">${results.maxStreak}</span>
              <span class="stat-label">Best Streak</span>
            </div>
          </div>
          
          <div class="stat-card info">
            <div class="stat-icon"><i class="fas fa-clock"></i></div>
            <div class="stat-info">
              <span class="stat-value">${results.averageTime}s</span>
              <span class="stat-label">Avg Time</span>
            </div>
          </div>
        </div>

        <div class="results-breakdown">
          <h3>Performance Breakdown</h3>
          <div class="breakdown-grid">
            <div class="breakdown-item correct">
              <i class="fas fa-check-circle"></i>
              <span class="breakdown-label">Correct</span>
              <span class="breakdown-value">${results.correctAnswers}</span>
            </div>
            <div class="breakdown-item incorrect">
              <i class="fas fa-times-circle"></i>
              <span class="breakdown-label">Incorrect</span>
              <span class="breakdown-value">${results.totalQuestions - results.correctAnswers - results.skippedQuestions - results.timedOutQuestions}</span>
            </div>
            <div class="breakdown-item skipped">
              <i class="fas fa-forward"></i>
              <span class="breakdown-label">Skipped</span>
              <span class="breakdown-value">${results.skippedQuestions}</span>
            </div>
            <div class="breakdown-item timeout">
              <i class="fas fa-clock"></i>
              <span class="breakdown-label">Timed Out</span>
              <span class="breakdown-value">${results.timedOutQuestions}</span>
            </div>
          </div>
        </div>
        
        ${this.achievements.length > 0 ? this.createAchievementsHTML() : ''}
        
        <div class="results-actions">
          <button class="btn btn-primary" id="restart-quiz">
            <i class="fas fa-redo"></i>
            Take Quiz Again
          </button>
          <button class="btn btn-secondary" id="review-answers">
            <i class="fas fa-eye"></i>
            Review Answers
          </button>
          <button class="btn btn-outline" id="change-difficulty">
            <i class="fas fa-cog"></i>
            Change Difficulty
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Create achievements HTML
   */
  createAchievementsHTML() {
    return `
      <div class="achievements-section">
        <h3><i class="fas fa-trophy"></i> Achievements Unlocked!</h3>
        <div class="achievements-grid">
          ${this.achievements.map(achievement => `
            <div class="achievement-card">
              <div class="achievement-icon">${achievement.icon}</div>
              <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Check for achievements
   */
  checkAchievements(results) {
    this.achievements = [];

    if (results.percentage === 100) {
      this.achievements.push({
        icon: '🏆',
        title: 'Perfect Score!',
        description: 'Answered all questions correctly'
      });
    }

    if (results.maxStreak >= 5) {
      this.achievements.push({
        icon: '🔥',
        title: 'Hot Streak!',
        description: 'Got 5 questions right in a row'
      });
    }

    if (results.hintsUsed === 0) {
      this.achievements.push({
        icon: '🧠',
        title: 'No Help Needed!',
        description: 'Completed without using hints'
      });
    }

    if (results.averageTime <= 10) {
      this.achievements.push({
        icon: '⚡',
        title: 'Speed Demon!',
        description: 'Average time under 10 seconds'
      });
    }

    if (results.difficulty === 'hard' && results.percentage >= 70) {
      this.achievements.push({
        icon: '🎓',
        title: 'Expert Level!',
        description: 'Scored 70%+ on hard difficulty'
      });
    }
  }

  /**
   * Setup results event handlers
   */
  setupResultsHandlers() {
    const restartBtn = document.getElementById('restart-quiz');
    const reviewBtn = document.getElementById('review-answers');
    const changeDiffBtn = document.getElementById('change-difficulty');

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.loadQuestions(); // Reload all questions
        this.startQuiz();
      });
    }

    if (reviewBtn) {
      reviewBtn.addEventListener('click', () => {
        this.showReviewMode();
      });
    }

    if (changeDiffBtn) {
      changeDiffBtn.addEventListener('click', () => {
        this.showStartScreen();
      });
    }
  }

  /**
   * Show review mode (placeholder for future implementation)
   */
  showReviewMode() {
    if (window.app && window.app.toastManager) {
      window.app.toastManager.show('Review mode coming soon! 📚', 'info', 3000);
    } else {
      alert('Review mode coming soon! 📚');
    }
  }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.quiz-section')) {
    const quiz = new InteractiveQuiz();
    quiz.init();
  }
});