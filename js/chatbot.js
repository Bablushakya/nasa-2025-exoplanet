// AI Chatbot with Google Gemini API

class ExoPlanetChatbot {
  constructor() {
    this.apiKey = null;
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    this.conversationHistory = [];
    this.isOpen = false;
    this.isTyping = false;
    
    this.init();
  }
  
  init() {
    this.createChatbotUI();
    this.attachEventListeners();
    this.loadApiKey();
    this.showWelcomeMessage();
  }
  
  loadApiKey() {
    // Try to load API key from config
    if (window.CONFIG && window.CONFIG.GEMINI_API) {
      this.apiKey = window.CONFIG.GEMINI_API.API_KEY;
    } else if (window.CONFIG && window.CONFIG.GEMINI_API_KEY) {
      this.apiKey = window.CONFIG.GEMINI_API_KEY;
    } else {
      this.apiKey = localStorage.getItem('gemini_api_key');
    }
    
    // If no API key or placeholder, show setup message
    if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      this.showApiKeySetup();
    }
  }
  
  createChatbotUI() {
    const chatbotHTML = `
      <!-- Chatbot Button -->
      <button class="chatbot-button" id="chatbot-button" aria-label="Open AI Assistant">
        <i class="fas fa-robot"></i>
      </button>
      
      <!-- Chatbot Window -->
      <div class="chatbot-window" id="chatbot-window">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="chatbot-title">
              <h3>ExoPlanet AI Assistant</h3>
              <div class="chatbot-status">
                <span class="status-dot"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
          <button class="chatbot-close" id="chatbot-close" aria-label="Close chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Messages -->
        <div class="chatbot-messages" id="chatbot-messages">
          <!-- Messages will be added here -->
        </div>
        
        <!-- Input -->
        <div class="chatbot-input">
          <div class="quick-actions" id="quick-actions">
            <button class="quick-action" data-message="What are exoplanets?">
              What are exoplanets?
            </button>
            <button class="quick-action" data-message="How does AI detect exoplanets?">
              How does AI detect them?
            </button>
            <button class="quick-action" data-message="Tell me about habitable zones">
              Habitable zones
            </button>
          </div>
          <div class="input-wrapper">
            <textarea 
              id="chatbot-input" 
              placeholder="Ask me anything about exoplanets..."
              rows="1"
            ></textarea>
            <button class="send-button" id="send-button" aria-label="Send message">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }
  
  attachEventListeners() {
    const button = document.getElementById('chatbot-button');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('send-button');
    const input = document.getElementById('chatbot-input');
    const quickActions = document.getElementById('quick-actions');
    
    button.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.toggleChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
    
    // Quick actions
    quickActions.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-action')) {
        const message = e.target.dataset.message;
        this.sendMessage(message);
      }
    });
  }
  
  toggleChat() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatbot-window');
    const button = document.getElementById('chatbot-button');
    
    window.classList.toggle('active');
    button.classList.toggle('active');
    
    if (this.isOpen) {
      document.getElementById('chatbot-input').focus();
    }
  }
  
  showWelcomeMessage() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const welcomeHTML = `
      <div class="welcome-message">
        <i class="fas fa-robot"></i>
        <h4>Welcome to ExoPlanet AI Assistant!</h4>
        <p>I'm here to help you learn about exoplanets, AI detection methods, and answer any questions you have about space exploration.</p>
      </div>
    `;
    messagesContainer.innerHTML = welcomeHTML;
  }
  
  showApiKeySetup() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const setupHTML = `
      <div class="message bot">
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <p>✨ <strong>API Key Configuration</strong></p>
          <p style="margin-top: 10px;">The Gemini API key is already configured in <code>js/config.js</code>!</p>
          <p style="margin-top: 10px; font-size: 0.875rem;">If you want to use your own key:</p>
          <ol style="margin-top: 5px; padding-left: 20px; font-size: 0.875rem;">
            <li>Get a free API key at <a href="https://makersuite.google.com/app/apikey" target="_blank" style="color: var(--primary-color);">Google AI Studio</a></li>
            <li>Update <code>GEMINI_API.API_KEY</code> in <code>js/config.js</code></li>
            <li>Refresh the page</li>
          </ol>
          <p style="margin-top: 10px; font-size: 0.875rem; color: var(--success-color);">💡 The current key should work for testing!</p>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', setupHTML);
  }
  
  async sendMessage(text = null) {
    const input = document.getElementById('chatbot-input');
    const message = text || input.value.trim();
    
    if (!message) return;
    
    // Check API key
    if (!this.apiKey) {
      this.addMessage('bot', 'Please configure your Gemini API key first. Check the setup instructions above.');
      return;
    }
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Add user message
    this.addMessage('user', message);
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Send to Gemini API
    try {
      const response = await this.callGeminiAPI(message);
      this.hideTypingIndicator();
      this.addMessage('bot', response);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('bot', `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`);
      console.error('Chatbot error:', error);
    }
  }
  
  async callGeminiAPI(message) {
    // Build context for exoplanet-focused responses
    const systemContext = `You are an AI assistant for ExoPlanet AI, a platform for discovering and analyzing exoplanets. 
    You help users understand exoplanets, AI detection methods, transit photometry, habitable zones, and space exploration. 
    Keep responses concise, informative, and engaging. Use simple language when explaining complex concepts.`;
    
    const prompt = `${systemContext}\n\nUser question: ${message}\n\nProvide a helpful, accurate response:`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };
    
    const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from API');
    }
  }
  
  addMessage(type, text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const messageHTML = `
      <div class="message ${type}">
        <div class="message-avatar">
          <i class="fas fa-${type === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
          <p>${this.formatMessage(text)}</p>
          <div class="message-time">${time}</div>
        </div>
      </div>
    `;
    
    // Remove welcome message if exists
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
      welcomeMsg.remove();
    }
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in history
    this.conversationHistory.push({ type, text, time });
  }
  
  formatMessage(text) {
    // Convert markdown-style formatting to HTML
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`(.*?)`/g, '<code>$1</code>') // Code
      .replace(/\n/g, '<br>'); // Line breaks
    
    return formatted;
  }
  
  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingHTML = `
      <div class="message bot typing-message">
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.isTyping = true;
  }
  
  hideTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
      typingMessage.remove();
    }
    this.isTyping = false;
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.exoPlanetChatbot = new ExoPlanetChatbot();
});
