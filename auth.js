// Replace the existing authentication functions in main.js with these updated versions

function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  
  // Use the database system for authentication
  if (window.gameManager) {
    window.gameManager.login(email, password).then(result => {
      if (result.success) {
        currentUser = result.user;
        gameState.user = result.user;
        
        // Load user's game state from database
        loadUserGameState(result.user);
        
        showToast(`Welcome back, ${result.user.name}!`, "success");
        closeAuthModal();
        startApp();
        
        // Trigger custom event for other systems
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: result.user }));
      } else {
        showToast(result.error || "Invalid credentials", "error");
      }
    });
  } else {
    showToast("System not ready. Please refresh the page.", "error");
  }
}

function handleRegister() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  if (!name || !email || !password || !confirmPassword) {
    showToast("Please fill in all fields", "error");
    return;
  }
  
  if (password !== confirmPassword) {
    showToast("Passwords don't match", "error");
    return;
  }
  
  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Please enter a valid email address", "error");
    return;
  }
  
  // Use the database system for registration
  if (window.gameManager) {
    const userData = { name, email, password };
    
    window.gameManager.register(userData).then(result => {
      if (result.success) {
        currentUser = result.user;
        gameState.user = result.user;
        
        // Load user's game state from database
        loadUserGameState(result.user);
        
        showToast(`Account created successfully! Welcome, ${result.user.name}!`, "success");
        closeAuthModal();
        startApp();
        
        // Trigger custom event for other systems
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: result.user }));
      } else {
        showToast(result.error || "Registration failed", "error");
      }
    });
  } else {
    showToast("System not ready. Please refresh the page.", "error");
  }
}

function logout() {
  if (window.gameManager) {
    window.gameManager.logout();
  }
  
  currentUser = null;
  gameState = {
    selectedCategories: [],
    level: 1,
    xp: 0,
    streak: 0,
    completedChallenges: 0,
    completedToday: [],
    lastCompletionDate: null,
    user: null,
    badges: ['getting-started'],
    bestStreak: 0
  };
  
  // Clear any path indicators
  const pathIndicator = document.querySelector('.path-indicator');
  if (pathIndicator) {
    pathIndicator.remove();
  }
  
  document.getElementById("landing").style.display = "";
  document.getElementById("app").style.display = "none";
  showToast("You've been logged out", "info");
}

// Function to load user's game state from database
function loadUserGameState(user) {
  if (user && user.profile) {
    // Update gameState with user's profile data
    gameState.selectedCategories = user.profile.selectedCategories || [];
    gameState.level = user.profile.level || 1;
    gameState.xp = user.profile.xp || 0;
    gameState.streak = user.profile.streak || 0;
    gameState.completedChallenges = user.profile.completedChallenges || 0;
    gameState.completedToday = user.profile.completedToday || [];
    gameState.lastCompletionDate = user.profile.lastCompletionDate;
    gameState.badges = user.profile.badges || ['getting-started'];
    gameState.bestStreak = user.profile.bestStreak || 0;
    gameState.user = user;
    
    // Update UI elements
    updateUI();
  }
}

// Updated challenge completion function to save to database
function completeChallenge(challengeId, xpReward) {
  if (gameState.completedToday.includes(challengeId)) return;

  // Use the database system to complete challenge
  if (window.gameManager && currentUser) {
    const result = window.gameManager.completeChallenge(challengeId, xpReward);
    
    if (result.success) {
      // Update local gameState with new data
      loadUserGameState(result.user);
      
      if (result.leveledUp) {
        showToast(`Level Up! You're now level ${gameState.level}!`, "success");
        createLevelUpEffect();
      } else {
        showToast(`+${xpReward} XP earned! Great job!`, "success");
      }
      
      updateUI();
      regenerateChallengeCard(challengeId);
      checkBadges();
    } else {
      showToast(result.error || "Failed to complete challenge", "error");
    }
  } else {
    showToast("Please log in to complete challenges", "error");
  }
}

// Initialize database connection check
function checkDatabaseConnection() {
  if (!window.gameManager) {
    console.error("Game Manager not initialized");
    showToast("System initializing... Please wait", "info");
    
    // Try to initialize after a delay
    setTimeout(() => {
      if (window.gameManager) {
        showToast("System ready!", "success");
      } else {
        showToast("System initialization failed. Please refresh the page.", "error");
      }
    }, 2000);
  }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(checkDatabaseConnection, 500);
});

// Add demo login functionality for testing
function loginAsDemo() {
  document.getElementById("loginEmail").value = "demo@levelup.com";
  document.getElementById("loginPassword").value = "demo123";
  handleLogin();
}

// Add this button to your login form for easy testing
function addDemoLoginButton() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm && !document.getElementById("demoLoginBtn")) {
    const demoBtn = document.createElement("button");
    demoBtn.type = "button";
    demoBtn.id = "demoLoginBtn";
    demoBtn.className = "btn btn-secondary full-width";
    demoBtn.style.marginTop = "1rem";
    demoBtn.textContent = "Try Demo Account";
    demoBtn.onclick = loginAsDemo;
    
    loginForm.appendChild(demoBtn);
  }
}

// Call this to add demo button
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(addDemoLoginButton, 100);
});