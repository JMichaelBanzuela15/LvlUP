// Game state
let gameState = {
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

// User authentication state
let currentUser = null;

// Challenge database
const challenges = {
  fitness: [
    {
      id: "fitness_1",
      title: "Morning Energy Boost",
      description: "Do 20 push-ups as soon as you wake up",
      xp: 25,
      difficulty: 1,
    },
    {
      id: "fitness_2",
      title: "Hydration Hero",
      description: "Drink 8 glasses of water throughout the day",
      xp: 15,
      difficulty: 1,
    },
    {
      id: "fitness_3",
      title: "Step Counter",
      description: "Walk 10,000 steps today",
      xp: 30,
      difficulty: 2,
    },
    {
      id: "fitness_4",
      title: "Flexibility Focus",
      description: "Do a 15-minute stretching routine",
      xp: 20,
      difficulty: 1,
    },
    {
      id: "fitness_5",
      title: "Plank Power",
      description: "Hold a plank for 2 minutes total (can be broken up)",
      xp: 25,
      difficulty: 2,
    },
  ],
  intelligence: [
    {
      id: "intel_1",
      title: "Learning Sprint",
      description:
        "Spend 30 minutes learning something new on Khan Academy or similar",
      xp: 35,
      difficulty: 2,
    },
    {
      id: "intel_2",
      title: "Memory Palace",
      description:
        "Memorize and recite a 10-item grocery list without looking",
      xp: 25,
      difficulty: 2,
    },
    {
      id: "intel_3",
      title: "Speed Reader",
      description: "Read for 45 minutes straight without distractions",
      xp: 30,
      difficulty: 2,
    },
    {
      id: "intel_4",
      title: "Puzzle Master",
      description: "Complete a challenging sudoku or crossword puzzle",
      xp: 20,
      difficulty: 1,
    },
    {
      id: "intel_5",
      title: "Curiosity Quest",
      description:
        "Research and explain a random Wikipedia article to someone",
      xp: 25,
      difficulty: 1,
    },
  ],
  social: [
    {
      id: "social_1",
      title: "Conversation Starter",
      description: "Start a meaningful conversation with a stranger",
      xp: 40,
      difficulty: 3,
    },
    {
      id: "social_2",
      title: "Compliment Giver",
      description: "Give 3 genuine compliments to different people",
      xp: 20,
      difficulty: 1,
    },
    {
      id: "social_3",
      title: "Active Listener",
      description:
        "Have a 20-minute conversation where you ask more questions than you make statements",
      xp: 25,
      difficulty: 2,
    },
    {
      id: "social_4",
      title: "Network Builder",
      description: "Reach out to someone you haven't talked to in months",
      xp: 30,
      difficulty: 2,
    },
    {
      id: "social_5",
      title: "Public Speaker",
      description:
        "Record yourself giving a 2-minute speech on any topic",
      xp: 35,
      difficulty: 3,
    },
  ],
  productivity: [
    {
      id: "prod_1",
      title: "Time Blocker",
      description: "Plan your entire day in time blocks and stick to it",
      xp: 30,
      difficulty: 2,
    },
    {
      id: "prod_2",
      title: "Distraction Destroyer",
      description:
        "Work for 2 hours without checking social media or phone",
      xp: 35,
      difficulty: 3,
    },
    {
      id: "prod_3",
      title: "Task Terminator",
      description: "Complete your 3 most important tasks before noon",
      xp: 40,
      difficulty: 3,
    },
    {
      id: "prod_4",
      title: "Email Zero",
      description: "Clear your email inbox completely",
      xp: 20,
      difficulty: 1,
    },
    {
      id: "prod_5",
      title: "Future Self",
      description:
        "Prepare everything for tomorrow tonight (clothes, meals, schedule)",
      xp: 25,
      difficulty: 2,
    },
  ],
  confidence: [
    {
      id: "conf_1",
      title: "Power Pose",
      description:
        "Do confident power poses for 5 minutes in front of a mirror",
      xp: 15,
      difficulty: 1,
    },
    {
      id: "conf_2",
      title: "Fear Facer",
      description: "Do something that makes you slightly uncomfortable",
      xp: 35,
      difficulty: 3,
    },
    {
      id: "conf_3",
      title: "Affirmation Station",
      description: "Write down 5 things you're proud of accomplishing",
      xp: 20,
      difficulty: 1,
    },
    {
      id: "conf_4",
      title: "Comfort Zone Exit",
      description: "Try a new activity or hobby for 30 minutes",
      xp: 30,
      difficulty: 2,
    },
    {
      id: "conf_5",
      title: "Self Advocate",
      description:
        "Ask for something you want (raise, favor, opportunity)",
      xp: 45,
      difficulty: 3,
    },
  ],
  creativity: [
    {
      id: "creat_1",
      title: "Idea Generator",
      description:
        "Write down 20 ideas for anything (they can be terrible)",
      xp: 25,
      difficulty: 1,
    },
    {
      id: "creat_2",
      title: "Art Attack",
      description:
        "Create something artistic for 30 minutes (draw, write, compose)",
      xp: 30,
      difficulty: 2,
    },
    {
      id: "creat_3",
      title: "Problem Solver",
      description:
        "Find 5 creative solutions to a current problem in your life",
      xp: 35,
      difficulty: 2,
    },
    {
      id: "creat_4",
      title: "Story Spinner",
      description:
        "Write a 500-word short story about your day from your pet's perspective",
      xp: 25,
      difficulty: 2,
    },
    {
      id: "creat_5",
      title: "Innovation Station",
      description: "Design an improvement to something you use daily",
      xp: 30,
      difficulty: 2,
    },
  ],
  leadership: [
    {
      id: "lead_1",
      title: "Decision Maker",
      description: "Make 3 decisions you've been putting off",
      xp: 30,
      difficulty: 2,
    },
    {
      id: "lead_2",
      title: "Team Builder",
      description:
        "Organize a group activity or help coordinate a team project",
      xp: 40,
      difficulty: 3,
    },
    {
      id: "lead_3",
      title: "Mentor Mode",
      description: "Teach someone a skill you're good at",
      xp: 35,
      difficulty: 2,
    },
    {
      id: "lead_4",
      title: "Initiative Taker",
      description:
        "Volunteer to lead on something at work or in your community",
      xp: 45,
      difficulty: 3,
    },
    {
      id: "lead_5",
      title: "Feedback Giver",
      description:
        "Give constructive feedback to someone in a helpful way",
      xp: 25,
      difficulty: 2,
    },
  ],
  mindfulness: [
    {
      id: "mind_1",
      title: "Meditation Master",
      description: "Meditate for 15 minutes without guidance",
      xp: 25,
      difficulty: 2,
    },
    {
      id: "mind_2",
      title: "Gratitude List",
      description: "Write down 10 specific things you're grateful for",
      xp: 15,
      difficulty: 1,
    },
    {
      id: "mind_3",
      title: "Breath Focus",
      description:
        "Practice deep breathing for 10 minutes during a stressful moment",
      xp: 20,
      difficulty: 1,
    },
    {
      id: "mind_4",
      title: "Digital Detox",
      description: "Go 4 hours without any screens",
      xp: 35,
      difficulty: 3,
    },
    {
      id: "mind_5",
      title: "Nature Connection",
      description:
        "Spend 30 minutes outside without devices, just observing",
      xp: 25,
      difficulty: 2,
    },
  ],
};

// Chat responses
const chatResponses = [
  "That's a great question! Remember, small consistent actions lead to big transformations. What's one tiny step you could take today?",
  "I believe in your potential! Every challenge you complete is building the person you want to become. Keep pushing forward! 💪",
  "Struggling with motivation? That's totally normal! Try focusing on just the next 5 minutes instead of the whole task.",
  "You're already showing courage by being here and working on yourself. That's more than most people do!",
  "Remember: you don't have to be perfect, you just have to be better than yesterday. Progress over perfection!",
  "What would the future version of yourself thank you for doing today?",
  "Every expert was once a beginner. Every pro was once an amateur. Keep going!",
  "The magic happens outside your comfort zone. Which challenge will you tackle today?",
  "Your only competition is who you were yesterday. Focus on your own growth journey!",
  "Consistency beats perfection every time. Small daily improvements compound into amazing results!",
];

// Authentication Functions
function showAuthModal() {
  document.getElementById("authModal").style.display = "flex";
  document.getElementById("authModal").style.animation = "fadeIn 0.3s ease";
}

function closeAuthModal() {
  document.getElementById("authModal").style.display = "none";
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const authTitle = document.getElementById("authTitle");
  const tabs = document.querySelectorAll(".auth-tab");
  
  tabs.forEach(t => t.classList.remove("active"));
  
  if (tab === "login") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    authTitle.textContent = "Welcome Back";
    tabs[0].classList.add("active");
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    authTitle.textContent = "Join Level Up IRL";
    tabs[1].classList.add("active");
  }
}

function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  
  // Simulate authentication (in real app, this would call an API)
  const user = {
    id: Date.now(),
    name: email.split('@')[0], // Use part of email as name for demo
    email: email,
    joinDate: new Date()
  };
  
  currentUser = user;
  gameState.user = user;
  
  showToast(`Welcome back, ${user.name}!`, "success");
  closeAuthModal();
  startApp();
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
  
  // Simulate account creation
  const user = {
    id: Date.now(),
    name: name,
    email: email,
    joinDate: new Date()
  };
  
  currentUser = user;
  gameState.user = user;
  
  showToast(`Account created successfully! Welcome, ${user.name}!`, "success");
  closeAuthModal();
  startApp();
}

function logout() {
  currentUser = null;
  gameState.user = null;
  document.getElementById("landing").style.display = "";
  document.getElementById("app").style.display = "none";
  showToast("You've been logged out", "info");
}

// Profile Functions
function showProfile() {
  // Hide dashboard and show profile
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("quiz").style.display = "none";
  document.getElementById("profilePage").style.display = "block";
  
  // Update profile information
  updateProfileDisplay();
}

function updateProfileDisplay() {
  if (!currentUser) return;
  
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  document.getElementById("avatarInitials").textContent = initials;
  document.getElementById("profileName").textContent = currentUser.name;
  document.getElementById("profileEmail").textContent = currentUser.email;
  document.getElementById("userName").textContent = currentUser.name;
  
  // Update stats
  document.getElementById("profileLevel").textContent = gameState.level;
  document.getElementById("profileXP").textContent = gameState.xp;
  document.getElementById("profileStreak").textContent = Math.max(gameState.streak, gameState.bestStreak);
  
  // Update focus areas
  updateProfileFocusAreas();
  
  // Draw progress chart (simple implementation)
  drawProgressChart();
}

function updateProfileFocusAreas() {
  const container = document.getElementById("profileFocusAreas");
  container.innerHTML = "";
  
  if (gameState.selectedCategories.length === 0) {
    container.innerHTML = "<p>No focus areas selected yet. Complete onboarding to choose your path!</p>";
    return;
  }
  
  gameState.selectedCategories.forEach(category => {
    const focusArea = document.createElement("div");
    focusArea.className = "focus-area-tag";
    
    const emojis = {
      fitness: "💪",
      intelligence: "🧠", 
      social: "💬",
      productivity: "⚡",
      confidence: "✨",
      creativity: "🎨",
      leadership: "👑",
      mindfulness: "🧘"
    };
    
    focusArea.innerHTML = `
      <span class="focus-emoji">${emojis[category] || "📊"}</span>
      <span class="focus-name">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
    `;
    
    container.appendChild(focusArea);
  });
}

function drawProgressChart() {
  const canvas = document.getElementById("progressChart");
  const ctx = canvas.getContext("2d");
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Simple progress visualization
  const data = [10, 25, 15, 40, 30, 60, 45]; // Sample data
  const maxValue = Math.max(...data);
  const barWidth = canvas.width / data.length - 10;
  
  ctx.fillStyle = "#6366f1";
  
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * (canvas.height - 40);
    const x = index * (barWidth + 10);
    const y = canvas.height - barHeight - 20;
    
    ctx.fillRect(x, y, barWidth, barHeight);
  });
  
  // Add labels
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "12px sans-serif";
  ctx.fillText("Week", 20, canvas.height - 5);
  ctx.fillText("Progress", canvas.width - 50, canvas.height - 5);
}

function editProfile() {
  showToast("Profile editing feature coming soon!", "info");
}

function editAvatar() {
  showToast("Avatar editing feature coming soon!", "info");
}

function backToDashboard() {
  document.getElementById("profilePage").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

// Initialize app
function startApp() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("quiz").style.display = "block";
  setTimeout(() => updateXPBar(), 500);
  
  // Update user info in header
  if (currentUser) {
    document.getElementById("userName").textContent = currentUser.name;
  }
}

function scrollToFeatures() {
  // In a real app, this would scroll to a features section
  showToast("Check out the features by starting your journey!", "info");
}

function toggleSelection(element) {
  const category = element.dataset.category;
  const isSelected = element.classList.contains("selected");

  if (isSelected) {
    element.classList.remove("selected");
    gameState.selectedCategories = gameState.selectedCategories.filter(
      (cat) => cat !== category
    );
  } else {
    element.classList.add("selected");
    gameState.selectedCategories.push(category);
  }

  updateStartButton();
}

function updateStartButton() {
  const button = document.getElementById("startJourneyBtn");
  if (gameState.selectedCategories.length > 0) {
    button.style.display = "block";
    button.style.animation = "bounceIn 0.5s ease";
  } else {
    button.style.display = "none";
  }
}

function completeOnboarding() {
  if (gameState.selectedCategories.length === 0) {
    showToast("Please select at least one area to focus on!", "error");
    return;
  }

  document.getElementById("quiz").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  generateDailyChallenges();
  showToast(
    `Welcome to your journey! You've selected ${gameState.selectedCategories.length} focus areas.`,
    "success"
  );
}

function generateDailyChallenges() {
  const challengesContainer = document.getElementById("dailyChallenges");
  challengesContainer.innerHTML = "";

  // Generate 3-5 challenges from selected categories
  const numChallenges = Math.min(
    5,
    Math.max(3, gameState.selectedCategories.length)
  );
  const todaysChallenges = [];

  gameState.selectedCategories.forEach((category) => {
    const categoryTasks = challenges[category];
    if (categoryTasks) {
      const randomTask =
        categoryTasks[Math.floor(Math.random() * categoryTasks.length)];
      if (!todaysChallenges.find((task) => task.id === randomTask.id)) {
        todaysChallenges.push({ ...randomTask, category });
      }
    }
  });

  // Fill remaining slots with random challenges from selected categories
  while (
    todaysChallenges.length < numChallenges &&
    todaysChallenges.length < 5
  ) {
    const randomCategory =
      gameState.selectedCategories[
        Math.floor(Math.random() * gameState.selectedCategories.length)
      ];
    const categoryTasks = challenges[randomCategory];
    const randomTask =
      categoryTasks[Math.floor(Math.random() * categoryTasks.length)];

    if (!todaysChallenges.find((task) => task.id === randomTask.id)) {
      todaysChallenges.push({ ...randomTask, category: randomCategory });
    }
  }

  todaysChallenges.forEach((challenge) => {
    const challengeCard = createChallengeCard(challenge);
    challengesContainer.appendChild(challengeCard);
  });
}

function createChallengeCard(challenge) {
  const isCompleted = gameState.completedToday.includes(challenge.id);
  const card = document.createElement("div");
  card.className = `daily-card ${
    isCompleted ? "completed-challenge" : ""
  }`;

  const stars =
    "★".repeat(challenge.difficulty) +
    "☆".repeat(3 - challenge.difficulty);

  card.innerHTML = `
            <div class="daily-card-header">
                <div class="challenge-badge">${challenge.category}</div>
                <div class="difficulty-indicator">
                    ${stars
                      .split("")
                      .map(
                        (star) =>
                          `<span class="difficulty-star">${star}</span>`
                      )
                      .join("")}
                </div>
            </div>
            <h3 class="challenge-title">${challenge.title}</h3>
            <p class="challenge-description">${challenge.description}</p>
            <div class="challenge-rewards">
                <div class="reward-item">
                    <div class="reward-value">+${challenge.xp}</div>
                    <div class="reward-label">XP</div>
                </div>
                <div class="reward-item">
                    <div class="reward-value">+${
                      challenge.difficulty * 10
                    }</div>
                    <div class="reward-label">Coins</div>
                </div>
            </div>
            <div class="challenge-actions">
                <button class="complete-btn" onclick="completeChallenge('${
                  challenge.id
                }', ${challenge.xp})" 
                        ${isCompleted ? "disabled" : ""}>
                    ${isCompleted ? "✅ Completed!" : "Complete Challenge"}
                </button>
                <button class="skip-btn" onclick="skipChallenge('${
                  challenge.id
                }')">Skip</button>
            </div>
        `;

  return card;
}

function completeChallenge(challengeId, xpReward) {
  if (gameState.completedToday.includes(challengeId)) return;

  gameState.completedToday.push(challengeId);
  gameState.completedChallenges++;
  gameState.xp += xpReward;

  // Update streak
  const today = new Date().toDateString();
  if (gameState.lastCompletionDate !== today) {
    gameState.streak++;
    gameState.bestStreak = Math.max(gameState.streak, gameState.bestStreak);
    gameState.lastCompletionDate = today;
  }

  // Level up check
  const newLevel = Math.floor(gameState.xp / 100) + 1;
  if (newLevel > gameState.level) {
    gameState.level = newLevel;
    showToast(
      `Level Up! You're now level ${gameState.level}!`,
      "success"
    );
    createLevelUpEffect();
  } else {
    showToast(`+${xpReward} XP earned! Great job!`, "success");
  }

  updateUI();
  regenerateChallengeCard(challengeId);
  checkBadges();
}

function checkBadges() {
  const newBadges = [];
  
  // Check for various achievements
  if (gameState.streak >= 7 && !gameState.badges.includes('7-day-streak')) {
    gameState.badges.push('7-day-streak');
    newBadges.push('7-Day Streak');
  }
  
  if (gameState.completedChallenges >= 10 && !gameState.badges.includes('dedicated-learner')) {
    gameState.badges.push('dedicated-learner');
    newBadges.push('Dedicated Learner');
  }
  
  if (gameState.level >= 5 && !gameState.badges.includes('level-master')) {
    gameState.badges.push('level-master');
    newBadges.push('Level Master');
  }
  
  // Show badge notifications
  newBadges.forEach(badge => {
    setTimeout(() => {
      showToast(`New Badge Earned: ${badge}!`, "success");
    }, 1000);
  });
}

function skipChallenge(challengeId) {
  const card = document
    .querySelector(`[onclick*="${challengeId}"]`)
    .closest(".daily-card");
  card.style.opacity = "0.3";
  showToast("Challenge skipped. Try another one!", "info");
}

function regenerateChallengeCard(challengeId) {
  const card = document
    .querySelector(`[onclick*="${challengeId}"]`)
    .closest(".daily-card");
  card.classList.add("completed-challenge");

  const completeBtn = card.querySelector(".complete-btn");
  completeBtn.disabled = true;
  completeBtn.textContent = "✅ Completed!";
  completeBtn.style.background = "var(--success)";
}

function createLevelUpEffect() {
  // Create sparkle effect
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.innerHTML = "✨";
      sparkle.style.position = "fixed";
      sparkle.style.left = Math.random() * window.innerWidth + "px";
      sparkle.style.top = Math.random() * window.innerHeight + "px";
      sparkle.style.fontSize = "2rem";
      sparkle.style.pointerEvents = "none";
      sparkle.style.zIndex = "10000";
      sparkle.style.animation = "fadeInUp 2s ease forwards";
      document.body.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 2000);
    }, i * 100);
  }
}

function updateUI() {
  document.getElementById("totalXP").textContent = gameState.xp;
  document.getElementById("completedChallenges").textContent =
    gameState.completedChallenges;
  document.getElementById("currentStreak").textContent = gameState.streak;
  document.getElementById("currentLevel").textContent = gameState.level;
  document.getElementById(
    "levelDisplay"
  ).textContent = `Level ${gameState.level}`;
  document.getElementById(
    "streakCounter"
  ).textContent = `🔥 ${gameState.streak} Day Streak`;

  updateXPBar();
}

function updateXPBar() {
  const xpBar = document.getElementById("xpBar");
  const currentLevelXP = gameState.xp % 100;
  const currentWidth = parseInt(xpBar.style.width) || 0;
  
  // Only animate if there's a significant change (more than 5%)
  if (Math.abs(currentLevelXP - currentWidth) > 5) {
    setTimeout(() => {
      xpBar.style.width = currentLevelXP + "%";
    }, 100);
  } else {
    // Set immediately without animation for small changes
    xpBar.style.width = currentLevelXP + "%";
  }
}

// Chat functionality
function toggleChat() {
  const chatWindow = document.getElementById("chatWindow");
  const isVisible = chatWindow.style.display === "flex";

  if (isVisible) {
    chatWindow.style.display = "none";
  } else {
    chatWindow.style.display = "flex";
  }
}

function handleChatKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  // Simulate AI response
  setTimeout(() => {
    const response =
      chatResponses[Math.floor(Math.random() * chatResponses.length)];
    addMessage(response, "ai");
  }, 1000);
}

function addMessage(text, sender) {
  const messagesContainer = document.getElementById("chatMessages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Toast notifications
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = "flex";

  setTimeout(() => {
    toast.style.display = "none";
  }, 4000);
}

// Initialize UI updates
setTimeout(() => {
  updateUI();
}, 1000);

// Auto-generate new challenges daily (simulation)
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    gameState.completedToday = [];
    generateDailyChallenges();
    showToast("New daily challenges available!", "info");
  }
}, 60000); // Check every minute