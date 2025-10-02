// path-integration.js - Integration layer for Development Path System
// This file connects the new path system with existing main.js functions

// Extend existing profile functionality
const originalShowProfile = window.showProfile;
window.showProfile = function() {
  if (originalShowProfile) {
    originalShowProfile();
  }
  
  // Add development path section to profile
  setTimeout(() => {
    updateProfileWithDevelopmentPath();
  }, 100);
};

function updateProfileWithDevelopmentPath() {
  // Remove existing path section if present
  const existingSection = document.querySelector('.development-path-section');
  if (existingSection) {
    existingSection.remove();
  }

  const currentPath = window.developmentPathManager ? window.developmentPathManager.getCurrentPath() : null;
  
  if (currentPath) {
    const pathData = window.developmentPathManager.pathData[currentPath.key];
    
    // Create path section
    const pathSection = document.createElement('div');
    pathSection.className = 'profile-section development-path-section';
    pathSection.innerHTML = `
      <h3>🛤️ Development Path</h3>
      <div class="current-path-display">
        <div class="current-path-card">
          <div class="path-header-info">
            <div class="path-icon-large">${pathData.icon}</div>
            <div class="current-path-info">
              <h4>${pathData.name}</h4>
              <p class="path-selected-date">Selected ${new Date(currentPath.selectedAt).toLocaleDateString()}</p>
              <p class="path-description-short">${pathData.description}</p>
            </div>
          </div>
          <div class="path-actions">
            <button class="btn btn-secondary" onclick="developmentPathManager.changeDevelopmentPath()">
              Change Path
            </button>
          </div>
        </div>
        
        <div class="path-progress-overview">
          <div class="path-categories-overview">
            <h5>Focus Areas Progress</h5>
            <div class="category-progress-grid">
              ${pathData.categories.map(category => {
                const progress = getCategoryProgress(category);
                return `
                  <div class="category-progress-item">
                    <div class="category-name">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                    <div class="category-progress-bar">
                      <div class="category-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="category-progress-text">${progress}%</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert before profile actions or at the end of profile content
    const profileContent = document.querySelector('.profile-content');
    const profileActions = document.querySelector('.profile-actions');
    
    if (profileContent) {
      if (profileActions) {
        profileContent.insertBefore(pathSection, profileActions.parentElement);
      } else {
        profileContent.appendChild(pathSection);
      }
    }

    // Add path-specific styles if not already added
    addPathProfileStyles();
  }
}

function getCategoryProgress(category) {
  // Calculate progress based on completed challenges in this category
  const gameState = window.gameManager ? window.gameManager.currentGameState : window.gameState;
  
  if (!gameState) return 0;
  
  const totalChallenges = gameState.completedChallenges || 0;
  const categoryWeight = gameState.selectedCategories.includes(category) ? 1 : 0.5;
  
  // Simple progress calculation - you can make this more detailed
  return Math.min(100, Math.floor(totalChallenges * categoryWeight * 10));
}

function addPathProfileStyles() {
  if (document.querySelector('#path-profile-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'path-profile-styles';
  styles.textContent = `
    .development-path-section {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .current-path-display {
      margin-top: 1rem;
    }

    .current-path-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 2rem;
      margin-bottom: 1.5rem;
    }

    .path-header-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .path-icon-large {
      font-size: 3rem;
      filter: drop-shadow(0 0 10px currentColor);
    }

    .current-path-info h4 {
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .path-selected-date {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .path-description-short {
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    .path-actions {
      text-align: center;
    }

    .path-progress-overview {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 15px;
      padding: 1.5rem;
    }

    .path-categories-overview h5 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .category-progress-grid {
      display: grid;
      gap: 1rem;
    }

    .category-progress-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .category-name {
      min-width: 100px;
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .category-progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .category-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .category-progress-text {
      min-width: 40px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .no-challenges-message {
      text-align: center;
      padding: 3rem 2rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      color: var(--text-secondary);
    }

    .no-challenges-message h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .path-header-info {
        flex-direction: column;
        text-align: center;
      }
      
      .category-progress-item {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
      }
      
      .category-name {
        min-width: unset;
        text-align: center;
      }
    }
  `;
  
  document.head.appendChild(styles);
}

// Extend database functionality to handle development paths
if (window.gameManager && window.gameManager.db) {
  const originalUpdateUserProgress = window.gameManager.db.updateUserProgress;
  
  window.gameManager.db.updateUserProgress = function(userId, progressData) {
    const result = originalUpdateUserProgress.call(this, userId, progressData);
    
    // If development path was updated, trigger UI updates
    if (progressData.developmentPath) {
      setTimeout(() => {
        updateProfileWithDevelopmentPath();
      }, 100);
    }
    
    return result;
  };
}

// Helper function to get path-specific challenge recommendations
function getPathBasedChallenges() {
  const user = window.gameManager ? window.gameManager.currentGameState.user : null;
  const path = user && user.profile ? user.profile.developmentPath : null;
  
  if (!path) return [];
  
  const pathData = window.developmentPathManager ? window.developmentPathManager.pathData[path.key] : null;
  if (!pathData) return [];
  
  // Generate challenges focused on path categories
  const challenges = [];
  const availableCategories = pathData.categories;
  
  availableCategories.forEach(category => {
    const categoryTasks = window.challenges ? window.challenges[category] : [];
    if (categoryTasks && categoryTasks.length > 0) {
      const availableTasks = categoryTasks.filter(task => 
        !window.gameState.completedToday.includes(task.id)
      );
      
      if (availableTasks.length > 0) {
        const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
        challenges.push({ ...randomTask, category });
      }
    }
  });
  
  return challenges;
}

// Enhanced challenge generation that considers development path
const originalGenerateDailyChallenges = window.generateDailyChallenges;
window.generateDailyChallenges = function() {
  const pathBasedChallenges = getPathBasedChallenges();
  
  if (pathBasedChallenges.length > 0) {
    // Use path-based challenges
    const challengesContainer = document.getElementById("dailyChallenges");
    if (challengesContainer) {
      challengesContainer.innerHTML = "";
      
      pathBasedChallenges.forEach(challenge => {
        const challengeCard = createChallengeCard(challenge);
        challengesContainer.appendChild(challengeCard);
      });
    }
  } else if (originalGenerateDailyChallenges) {
    // Fallback to original challenge generation
    originalGenerateDailyChallenges();
  }
};

// Add path indicator to header
function addPathIndicatorToHeader() {
  const user = window.gameManager ? window.gameManager.currentGameState.user : null;
  const path = user && user.profile ? user.profile.developmentPath : null;
  
  if (path && window.developmentPathManager) {
    const pathData = window.developmentPathManager.pathData[path.key];
    
    // Remove existing indicator
    const existing = document.querySelector('.path-indicator');
    if (existing) existing.remove();
    
    // Add path indicator to user info section
    const userInfo = document.querySelector('.user-info');
    if (userInfo && pathData) {
      const pathIndicator = document.createElement('div');
      pathIndicator.className = 'path-indicator';
      pathIndicator.innerHTML = `
        <div class="current-path-badge">
          <span class="path-icon-small">${pathData.icon}</span>
          <span class="path-name-small">${pathData.name}</span>
        </div>
      `;
      
      userInfo.insertBefore(pathIndicator, userInfo.firstChild);
      
      // Add styles for path indicator
      if (!document.querySelector('#path-indicator-styles')) {
        const styles = document.createElement('style');
        styles.id = 'path-indicator-styles';
        styles.textContent = `
          .path-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .current-path-badge {
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            color: #fff;
            border-radius: 12px;
            padding: 0.3rem 0.8rem;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 2px 8px rgba(99,102,241,0.1);
          }
          .path-icon-small {
            font-size: 1rem;
          }
          .path-name-small {
            font-weight: 600;
          }
        `;
        document.head.appendChild(styles);
      }
    }
  }
}

// Initialize path indicator when user is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up interval to update path indicator when data is available
  const checkForPathData = setInterval(() => {
    if (window.gameManager && window.gameManager.currentGameState.user) {
      addPathIndicatorToHeader();
      clearInterval(checkForPathData);
    }
  }, 1000);
  
  // Clear after 10 seconds to prevent infinite checking
  setTimeout(() => clearInterval(checkForPathData), 10000);
});

// Listen for user login/registration events to update path indicator
document.addEventListener('userLoggedIn', function() {
  setTimeout(() => {
    addPathIndicatorToHeader();
  }, 500);
});