// development-path.js - Modular Development Path System
// Add-on for Level Up IRL that integrates with existing database system

class DevelopmentPathManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.pathData = this.getPathDefinitions();
    this.init();
  }

  init() {
    // Hook into existing login flow
    this.setupLoginHook();
    this.createPathSelectionUI();
  }

  setupLoginHook() {
    // Store original login function
    const originalLogin = window.gameManager.login.bind(window.gameManager);
    
    // Override login to check for development path
    window.gameManager.login = async (email, password) => {
      const result = await originalLogin(email, password);
      if (result.success) {
        this.handlePostLogin(result.user);
      }
      return result;
    };

    // Store original register function
    const originalRegister = window.gameManager.register.bind(window.gameManager);
    
    // Override register to redirect to path selection
    window.gameManager.register = async (userData) => {
      const result = await originalRegister(userData);
      if (result.success) {
        this.handlePostLogin(result.user);
      }
      return result;
    };
  }

  handlePostLogin(user) {
    // Check if user has a development path
    const hasPath = user.profile && user.profile.developmentPath;
    
    if (!hasPath) {
      // Hide main navigation and show path selection
      this.disableMainNavigation();
      this.showPathSelection();
    } else {
      // Enable main navigation and proceed normally
      this.enableMainNavigation();
      // Continue with existing app flow
      if (user.profile.selectedCategories.length === 0) {
        document.getElementById("quiz").style.display = "block";
      } else {
        document.getElementById("dashboard").style.display = "block";
      }
    }
  }

  disableMainNavigation() {
    // Hide main app elements until path is selected
    const elementsToHide = ['dashboard', 'quiz', 'profilePage'];
    elementsToHide.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = 'none';
      }
    });
    
    // Disable profile button in header
    const profileBtn = document.querySelector('[onclick="showProfile()"]');
    if (profileBtn) {
      profileBtn.disabled = true;
      profileBtn.style.opacity = '0.5';
    }
  }

  enableMainNavigation() {
    // Re-enable profile button
    const profileBtn = document.querySelector('[onclick="showProfile()"]');
    if (profileBtn) {
      profileBtn.disabled = false;
      profileBtn.style.opacity = '1';
    }
  }

  showPathSelection() {
    const pathSelectionEl = document.getElementById('pathSelection');
    if (pathSelectionEl) {
      pathSelectionEl.style.display = 'block';
    }
  }

  hidePathSelection() {
    const pathSelectionEl = document.getElementById('pathSelection');
    if (pathSelectionEl) {
      pathSelectionEl.style.display = 'none';
    }
  }

  createPathSelectionUI() {
    // Create path selection container
    const pathSelectionHTML = `
      <div class="path-selection-container" id="pathSelection" style="display: none;">
        <div class="path-selection-content">
          <div class="path-header">
            <h2 class="path-title">Choose Your Development Path</h2>
            <p class="path-subtitle">Select the journey that resonates with your goals. You can always change this later.</p>
          </div>
          
          <div class="development-paths">
            ${Object.entries(this.pathData).map(([key, path]) => `
              <div class="development-path-card" onclick="developmentPathManager.selectPath('${key}')" data-path="${key}">
                <div class="path-icon">${path.icon}</div>
                <div class="path-content">
                  <h3 class="path-name">${path.name}</h3>
                  <p class="path-description">${path.description}</p>
                  <div class="path-focus-areas">
                    <span class="path-focus-label">Focus Areas:</span>
                    <div class="path-categories">
                      ${path.categories.map(cat => `<span class="path-category-tag">${cat}</span>`).join('')}
                    </div>
                  </div>
                  <div class="path-outcomes">
                    <span class="path-outcomes-label">Expected Outcomes:</span>
                    <ul class="path-outcomes-list">
                      ${path.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="path-selection-actions">
            <button class="btn btn-secondary" onclick="developmentPathManager.showCustomPath()">
              Create Custom Path
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert into DOM after app container
    const appContainer = document.getElementById('app');
    appContainer.insertAdjacentHTML('beforeend', pathSelectionHTML);

    // Add styles
    this.addPathSelectionStyles();
  }

  selectPath(pathKey) {
    const path = this.pathData[pathKey];
    if (!path) return;

    // Update user profile with selected path
    const user = this.gameManager.currentGameState.user;
    if (user) {
      const updatedProfile = {
        ...user.profile,
        developmentPath: {
          key: pathKey,
          name: path.name,
          selectedAt: new Date().toISOString()
        },
        selectedCategories: path.categories
      };

      // Update in database
      this.gameManager.db.updateUserProgress(user.id, updatedProfile);
      
      // Update current game state
      this.gameManager.currentGameState.selectedCategories = path.categories;

      // Show success message
      showToast(`Development Path Selected: ${path.name}`, 'success');

      // Hide path selection and continue with app flow
      this.hidePathSelection();
      this.enableMainNavigation();
      
      // Continue to dashboard
      document.getElementById('dashboard').style.display = 'block';
      
      // Generate challenges based on new path
      if (typeof generateDailyChallenges === 'function') {
        generateDailyChallenges();
      }
    }
  }

  showCustomPath() {
    // Hide pre-defined paths and show custom path creator
    showToast('Custom path creation coming soon! For now, please select a pre-defined path.', 'info');
  }

  // Method to change path from profile page
  changeDevelopmentPath() {
    this.disableMainNavigation();
    this.showPathSelection();
  }

  // Get current user's development path
  getCurrentPath() {
    const user = this.gameManager.currentGameState.user;
    return user && user.profile ? user.profile.developmentPath : null;
  }

  getPathDefinitions() {
    return {
      warrior: {
        name: "The Warrior",
        icon: "⚔️",
        description: "Build physical and mental resilience. Master your body and mind through discipline and challenge.",
        categories: ['fitness', 'confidence', 'mindfulness'],
        outcomes: [
          "Increased physical strength and endurance",
          "Unshakeable mental toughness",
          "Better stress management and emotional regulation",
          "Heightened self-discipline and focus"
        ]
      },
      scholar: {
        name: "The Scholar",
        icon: "📚",
        description: "Pursue knowledge and intellectual growth. Become a master of learning and critical thinking.",
        categories: ['intelligence', 'creativity', 'productivity'],
        outcomes: [
          "Enhanced cognitive abilities and memory",
          "Improved problem-solving skills",
          "Greater creativity and innovation",
          "More efficient learning strategies"
        ]
      },
      leader: {
        name: "The Leader",
        icon: "👑",
        description: "Develop influence and inspire others. Build the skills to guide teams and create positive change.",
        categories: ['leadership', 'social', 'confidence'],
        outcomes: [
          "Strong communication and persuasion skills",
          "Ability to inspire and motivate others",
          "Enhanced emotional intelligence",
          "Effective team building and management"
        ]
      },
      artist: {
        name: "The Artist",
        icon: "🎨",
        description: "Unlock your creative potential. Express yourself and see the world through new perspectives.",
        categories: ['creativity', 'mindfulness', 'confidence'],
        outcomes: [
          "Enhanced creative expression and originality",
          "Greater appreciation for beauty and aesthetics",
          "Improved emotional processing and expression",
          "Increased openness to new experiences"
        ]
      },
      achiever: {
        name: "The Achiever",
        icon: "🚀",
        description: "Maximize productivity and goal attainment. Become a master of efficiency and results.",
        categories: ['productivity', 'leadership', 'intelligence'],
        outcomes: [
          "Exceptional time management and organization",
          "Consistent goal achievement and follow-through",
          "Improved focus and elimination of distractions",
          "Strategic thinking and planning abilities"
        ]
      },
      sage: {
        name: "The Sage",
        icon: "🧘",
        description: "Find inner peace and wisdom. Develop emotional mastery and spiritual awareness.",
        categories: ['mindfulness', 'intelligence', 'social'],
        outcomes: [
          "Deep inner peace and emotional stability",
          "Enhanced wisdom and life perspective",
          "Better relationships and empathy",
          "Reduced stress and anxiety"
        ]
      }
    };
  }

  addPathSelectionStyles() {
    const styles = `
      <style>
        .path-selection-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
          animation: slideInUp 0.5s ease;
        }

        .path-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .path-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .path-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .development-paths {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .development-path-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          padding: 2.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .development-path-card::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .development-path-card:hover {
          transform: translateY(-5px) scale(1.02);
          border-color: var(--primary);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
        }

        .development-path-card:hover::before {
          opacity: 1;
        }

        .path-icon {
          font-size: 4rem;
          text-align: center;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 20px currentColor);
        }

        .path-name {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--text-primary);
          text-align: center;
          margin-bottom: 1rem;
        }

        .path-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .path-focus-areas {
          margin-bottom: 1.5rem;
        }

        .path-focus-label {
          font-weight: 600;
          color: var(--text-primary);
          display: block;
          margin-bottom: 0.5rem;
        }

        .path-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .path-category-tag {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .path-outcomes {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
        }

        .path-outcomes-label {
          font-weight: 600;
          color: var(--text-primary);
          display: block;
          margin-bottom: 0.75rem;
        }

        .path-outcomes-list {
          list-style: none;
          padding: 0;
        }

        .path-outcomes-list li {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0.5rem;
          padding-left: 1rem;
          position: relative;
        }

        .path-outcomes-list li::before {
          content: "✓";
          color: var(--success);
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .path-selection-actions {
          text-align: center;
        }

        @media (max-width: 768px) {
          .development-paths {
            grid-template-columns: 1fr;
          }
          
          .development-path-card {
            padding: 2rem;
          }
          
          .path-title {
            font-size: 2rem;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }
}

// Profile page integration - Add this to the existing profile update function
function updateProfileWithDevelopmentPath() {
  // This function should be called when showing the profile page
  const currentPath = window.developmentPathManager ? window.developmentPathManager.getCurrentPath() : null;
  
  if (currentPath) {
    // Add development path section to profile
    const pathSection = document.createElement('div');
    pathSection.className = 'profile-section';
    pathSection.innerHTML = `
      <h3>Development Path</h3>
      <div class="current-path-display">
        <div class="current-path-card">
          <div class="current-path-info">
            <h4>${currentPath.name}</h4>
            <p>Selected on ${new Date(currentPath.selectedAt).toLocaleDateString()}</p>
          </div>
          <button class="btn btn-secondary" onclick="developmentPathManager.changeDevelopmentPath()">
            Change Path
          </button>
        </div>
      </div>
    `;

    // Insert before profile actions
    const profileActions = document.querySelector('.profile-actions');
    if (profileActions) {
      profileActions.parentNode.insertBefore(pathSection, profileActions);
    }

    // Add styles for current path display
    const pathStyles = `
      <style>
        .current-path-display {
          margin-top: 1rem;
        }

        .current-path-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .current-path-info h4 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .current-path-info p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .current-path-card {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      </style>
    `;

    if (!document.querySelector('#path-profile-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'path-profile-styles';
      styleEl.textContent = pathStyles;
      document.head.appendChild(styleEl);
    }
  }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait for gameManager to be available
  const initPathManager = () => {
    if (window.gameManager) {
      window.developmentPathManager = new DevelopmentPathManager(window.gameManager);
    } else {
      setTimeout(initPathManager, 100);
    }
  };
  
  initPathManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DevelopmentPathManager;
}