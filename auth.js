function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  
  // Add password validation - minimum requirements
  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }
  
  if (window.gameManager) {
    window.gameManager.login(email, password).then(result => {
      // Here you should verify the password against a hashed version in your database
      // NEVER store plain text passwords
      if (result.success) {
        currentUser = result.user;
        gameState.user = result.user;
        
        if (result.user.role === 'admin') {
          showToast(`Welcome back, Administrator!`, "success");
          closeAuthModal();
          routeToAdminDashboard();
          return;
        }
        
        // Regular user flow
        loadUserGameState(result.user);
        showToast(`Welcome back, ${result.user.name}!`, "success");
        closeAuthModal();
        routeToUserDashboard();
        
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: result.user }));
      } else {
        showToast(result.error || "Invalid credentials", "error");
      }
    });
  } else {
    showToast("System not ready. Please refresh the page.", "error");
  }
}

// FIXED: Secure admin routing
function routeToAdminDashboard() {
  // Verify admin role
  if (!currentUser || currentUser.role !== 'admin') {
    showToast("Access denied", "error");
    routeToUserDashboard();
    return;
  }
  
  // Hide all user views
  document.getElementById("landing").style.display = "none";
  document.getElementById("app").style.display = "none";
  
  // Wait for secure admin manager to be initialized
  if (window.secureAdminManager) {
    window.secureAdminManager.showAdminDashboard();
  } else {
    // Wait for admin system to initialize
    setTimeout(() => {
      if (window.secureAdminManager) {
        window.secureAdminManager.showAdminDashboard();
      } else {
        showToast("Admin system not ready", "error");
        logout();
      }
    }, 1000);
  }
}

function routeToUserDashboard() {
  // Verify user role
  if (!currentUser || currentUser.role === 'admin') {
    showToast("Access denied", "error");
    return;
  }
  
  // Hide all other views
  document.getElementById("landing").style.display = "none";
  hideAdminDashboard();
  
  // Show user dashboard
  document.getElementById("app").style.display = "block";
  startApp(); // This loads the user interface
}

function hideAdminDashboard() {
  const adminDashboard = document.getElementById("adminDashboard");
  if (adminDashboard) {
    adminDashboard.style.display = "none";
  }
  if (window.secureAdminManager) {
    window.secureAdminManager.hideAdminDashboard();
  }
}

// Updated logout function
function logout() {
  const wasAdmin = currentUser && currentUser.role === 'admin';
  
  if (window.gameManager) {
    window.gameManager.logout();
  }
  
  // Hide appropriate dashboard
  if (wasAdmin) {
    hideAdminDashboard();
  }
  
  // Reset state
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
  
  // Show landing page
  document.getElementById("landing").style.display = "block";
  document.getElementById("app").style.display = "none";
  hideAdminDashboard();
  
  showToast("You've been logged out", "info");
}

// Rest of your auth functions remain the same...
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
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Please enter a valid email address", "error");
    return;
  }
  
  if (email.toLowerCase().includes('admin@')) {
    showToast("Admin accounts cannot be created through registration", "error");
    return;
  }
  
  if (window.gameManager) {
    const userData = { name, email, password };
    
    window.gameManager.register(userData).then(result => {
      if (result.success) {
        currentUser = result.user;
        gameState.user = result.user;
        
        loadUserGameState(result.user);
        
        showToast(`Account created successfully! Welcome, ${result.user.name}!`, "success");
        closeAuthModal();
        routeToUserDashboard();
        
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: result.user }));
      } else {
        showToast(result.error || "Registration failed", "error");
      }
    });
  } else {
    showToast("System not ready. Please refresh the page.", "error");
  }
}