// Enhanced Database System for Level Up IRL
// This replaces the existing main.js with complete database functionality

// Database class to handle all data operations
class LevelUpDatabase {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = null;
    this.initDatabase();
  }

  initDatabase() {
    // Initialize with demo data if empty
    if (Object.keys(this.users).length === 0) {
      this.createDemoUsers();
    }
  }

  // User Management
  createUser(userData) {
    const userId = this.generateUserId();
    const user = {
      id: userId,
      name: userData.name,
      email: userData.email,
      password: this.hashPassword(userData.password), // In production, use proper hashing
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profile: {
        avatar: userData.name.charAt(0).toUpperCase(),
        level: 1,
        xp: 0,
        streak: 0,
        bestStreak: 0,
        completedChallenges: 0,
        badges: ['getting-started'],
        selectedCategories: [],
        completedToday: [],
        lastCompletionDate: null,
        totalXP: 0,
        progressHistory: []
      }
    };
    
    this.users[userId] = user;
    this.saveUsers();
    return user;
  }

  authenticateUser(email, password) {
    const user = Object.values(this.users).find(u => u.email === email);
    if (user && this.verifyPassword(password, user.password)) {
      user.lastLogin = new Date().toISOString();
      this.saveUsers();
      this.currentUser = user;
      return user;
    }
    return null;
  }

  updateUserProgress(userId, progressData) {
    if (this.users[userId]) {
      const user = this.users[userId];
      
      // Update user profile with new progress
      Object.assign(user.profile, progressData);
      
      // Add to progress history
      user.profile.progressHistory.push({
        date: new Date().toISOString(),
        level: user.profile.level,
        xp: user.profile.xp,
        streak: user.profile.streak
      });

      // Keep only last 30 days of history
      user.profile.progressHistory = user.profile.progressHistory.slice(-30);
      
      this.saveUsers();
      return user;
    }
    return null;
  }

  getUserProfile(userId) {
    return this.users[userId] || null;
  }

  // Quest/Challenge Management
  completeChallenge(userId, challengeId, xpReward) {
    const user = this.users[userId];
    if (!user) return false;

    const today = new Date().toDateString();
    
    // Check if already completed today
    if (user.profile.completedToday.includes(challengeId)) {
      return false;
    }

    // Update completion data
    user.profile.completedToday.push(challengeId);
    user.profile.completedChallenges++;
    user.profile.xp += xpReward;
    user.profile.totalXP += xpReward;

    // Update streak
    if (user.profile.lastCompletionDate !== today) {
      const lastDate = new Date(user.profile.lastCompletionDate);
      const currentDate = new Date(today);
      const timeDiff = currentDate.getTime() - lastDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (dayDiff === 1) {
        user.profile.streak++;
      } else if (dayDiff > 1) {
        user.profile.streak = 1;
      }
      
      user.profile.bestStreak = Math.max(user.profile.streak, user.profile.bestStreak);
      user.profile.lastCompletionDate = today;
    }

    // Check for level up
    const newLevel = Math.floor(user.profile.xp / 100) + 1;
    const leveledUp = newLevel > user.profile.level;
    user.profile.level = newLevel;

    // Check and award badges
    this.checkAndAwardBadges(user);

    this.saveUsers();
    return { success: true, leveledUp, user };
  }

  checkAndAwardBadges(user) {
    const badges = user.profile.badges;
    
    // 7-day streak badge
    if (user.profile.streak >= 7 && !badges.includes('7-day-streak')) {
      badges.push('7-day-streak');
    }

    // Dedicated learner (10+ challenges)
    if (user.profile.completedChallenges >= 10 && !badges.includes('dedicated-learner')) {
      badges.push('dedicated-learner');
    }

    // Level master (level 5+)
    if (user.profile.level >= 5 && !badges.includes('level-master')) {
      badges.push('level-master');
    }

    // Fitness warrior (complete 5 fitness challenges)
    const fitnessCount = this.getCategoryCompletionCount(user.id, 'fitness');
    if (fitnessCount >= 5 && !badges.includes('fitness-warrior')) {
      badges.push('fitness-warrior');
    }

    // Knowledge seeker (complete 5 intelligence challenges)
    const intelligenceCount = this.getCategoryCompletionCount(user.id, 'intelligence');
    if (intelligenceCount >= 5 && !badges.includes('knowledge-seeker')) {
      badges.push('knowledge-seeker');
    }
  }

  getCategoryCompletionCount(userId, category) {
    // This would track category-specific completions in a real implementation
    // For now, return a placeholder
    return Math.floor(Math.random() * 10);
  }

  // Reset daily challenges (called at midnight or app start)
  resetDailyProgress(userId) {
    const user = this.users[userId];
    if (user) {
      const today = new Date().toDateString();
      if (user.profile.lastCompletionDate !== today) {
        user.profile.completedToday = [];
        this.saveUsers();
      }
    }
  }

  // Utility methods
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  hashPassword(password) {
    // Simple hash for demo - use proper hashing in production
    return btoa(password);
  }

  verifyPassword(password, hashedPassword) {
    return btoa(password) === hashedPassword;
  }

  loadUsers() {
    try {
      const data = JSON.parse(localStorage.getItem('levelup_users') || '{}');
      return data;
    } catch (error) {
      console.error('Error loading users:', error);
      return {};
    }
  }

  saveUsers() {
    try {
      localStorage.setItem('levelup_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  createDemoUsers() {
    // Create a demo user for testing
    const demoUser = {
      id: 'demo_user_001',
      name: 'Demo User',
      email: 'demo@levelup.com',
      password: this.hashPassword('demo123'),
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profile: {
        avatar: 'D',
        level: 3,
        xp: 250,
        streak: 5,
        bestStreak: 7,
        completedChallenges: 15,
        badges: ['getting-started', '7-day-streak', 'dedicated-learner'],
        selectedCategories: ['fitness', 'intelligence', 'confidence'],
        completedToday: [],
        lastCompletionDate: null,
        totalXP: 250,
        progressHistory: [
          { date: new Date(Date.now() - 86400000 * 6).toISOString(), level: 1, xp: 50, streak: 1 },
          { date: new Date(Date.now() - 86400000 * 5).toISOString(), level: 2, xp: 120, streak: 2 },
          { date: new Date(Date.now() - 86400000 * 4).toISOString(), level: 2, xp: 180, streak: 3 },
          { date: new Date(Date.now() - 86400000 * 3).toISOString(), level: 3, xp: 220, streak: 4 },
          { date: new Date(Date.now() - 86400000 * 2).toISOString(), level: 3, xp: 240, streak: 5 }
        ]
      }
    };
    
    this.users[demoUser.id] = demoUser;
    this.saveUsers();
  }

  // Analytics and statistics
  getUserStats(userId) {
    const user = this.users[userId];
    if (!user) return null;

    return {
      level: user.profile.level,
      totalXP: user.profile.totalXP,
      currentStreak: user.profile.streak,
      bestStreak: user.profile.bestStreak,
      totalChallenges: user.profile.completedChallenges,
      badges: user.profile.badges,
      joinDate: user.joinDate,
      daysActive: Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24)),
      averageXPPerDay: user.profile.totalXP / Math.max(1, Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24)))
    };
  }

  getProgressHistory(userId) {
    const user = this.users[userId];
    return user ? user.profile.progressHistory : [];
  }

  // Export user data
  exportUserData(userId) {
    const user = this.users[userId];
    if (!user) return null;

    return {
      ...user,
      password: '[PROTECTED]' // Don't export password
    };
  }

  // Delete user account
  deleteUser(userId) {
    if (this.users[userId]) {
      delete this.users[userId];
      this.saveUsers();
      return true;
    }
    return false;
  }
}

// Enhanced Game State Manager
class GameStateManager {
  constructor() {
    this.db = new LevelUpDatabase();
    this.currentGameState = this.getDefaultGameState();
    this.challenges = this.getChallengeDatabase();
    this.chatResponses = this.getChatResponses();
  }

  getDefaultGameState() {
    return {
      selectedCategories: [],
      level: 1,
      xp: 0,
      streak: 0,
      completedChallenges: 0,
      completedToday: [],
      lastCompletionDate: null,
      user: null,
      badges: ['getting-started'],
      bestStreak: 0,
      totalXP: 0
    };
  }

  // User authentication
  async login(email, password) {
    const user = this.db.authenticateUser(email, password);
    if (user) {
      this.currentGameState.user = user;
      this.loadUserGameState(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  async register(userData) {
    // Check if email already exists
    const existingUser = Object.values(this.db.users).find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const user = this.db.createUser(userData);
    this.currentGameState.user = user;
    this.loadUserGameState(user);
    return { success: true, user };
  }

  logout() {
    this.currentGameState = this.getDefaultGameState();
    this.db.currentUser = null;
    return { success: true };
  }

  loadUserGameState(user) {
    if (user && user.profile) {
      Object.assign(this.currentGameState, user.profile);
      this.currentGameState.user = user;
    }
  }

  // Challenge completion
  completeChallenge(challengeId, xpReward) {
    if (!this.currentGameState.user) return { success: false, error: 'Not logged in' };

    const result = this.db.completeChallenge(this.currentGameState.user.id, challengeId, xpReward);
    if (result.success) {
      this.loadUserGameState(result.user);
      return result;
    }
    return { success: false, error: 'Challenge already completed or user not found' };
  }

  // Update user preferences
  updateSelectedCategories(categories) {
    if (!this.currentGameState.user) return false;

    this.currentGameState.selectedCategories = categories;
    return this.db.updateUserProgress(this.currentGameState.user.id, {
      selectedCategories: categories
    });
  }

  // Generate daily challenges
  generateDailyChallenges() {
    if (!this.currentGameState.selectedCategories.length) return [];

    const dailyChallenges = [];
    const numChallenges = Math.min(5, Math.max(3, this.currentGameState.selectedCategories.length));

    this.currentGameState.selectedCategories.forEach(category => {
      const categoryTasks = this.challenges[category];
      if (categoryTasks) {
        const availableTasks = categoryTasks.filter(task => 
          !this.currentGameState.completedToday.includes(task.id)
        );
        
        if (availableTasks.length > 0) {
          const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
          dailyChallenges.push({ ...randomTask, category });
        }
      }
    });

    // Fill remaining slots if needed
    while (dailyChallenges.length < numChallenges && dailyChallenges.length < 5) {
      const randomCategory = this.currentGameState.selectedCategories[
        Math.floor(Math.random() * this.currentGameState.selectedCategories.length)
      ];
      const categoryTasks = this.challenges[randomCategory];
      const availableTasks = categoryTasks.filter(task => 
        !dailyChallenges.find(challenge => challenge.id === task.id) &&
        !this.currentGameState.completedToday.includes(task.id)
      );

      if (availableTasks.length > 0) {
        const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
        dailyChallenges.push({ ...randomTask, category: randomCategory });
      } else {
        break;
      }
    }

    return dailyChallenges;
  }

  getChallengeDatabase() {
    return {
      fitness: [
        { id: "fitness_1", title: "Morning Energy Boost", description: "Do 20 push-ups as soon as you wake up", xp: 25, difficulty: 1 },
        { id: "fitness_2", title: "Hydration Hero", description: "Drink 8 glasses of water throughout the day", xp: 15, difficulty: 1 },
        { id: "fitness_3", title: "Step Counter", description: "Walk 10,000 steps today", xp: 30, difficulty: 2 },
        { id: "fitness_4", title: "Flexibility Focus", description: "Do a 15-minute stretching routine", xp: 20, difficulty: 1 },
        { id: "fitness_5", title: "Plank Power", description: "Hold a plank for 2 minutes total (can be broken up)", xp: 25, difficulty: 2 }
      ],
      intelligence: [
        { id: "intel_1", title: "Learning Sprint", description: "Spend 30 minutes learning something new on Khan Academy or similar", xp: 35, difficulty: 2 },
        { id: "intel_2", title: "Memory Palace", description: "Memorize and recite a 10-item grocery list without looking", xp: 25, difficulty: 2 },
        { id: "intel_3", title: "Speed Reader", description: "Read for 45 minutes straight without distractions", xp: 30, difficulty: 2 },
        { id: "intel_4", title: "Puzzle Master", description: "Complete a challenging sudoku or crossword puzzle", xp: 20, difficulty: 1 },
        { id: "intel_5", title: "Curiosity Quest", description: "Research and explain a random Wikipedia article to someone", xp: 25, difficulty: 1 }
      ],
      social: [
        { id: "social_1", title: "Conversation Starter", description: "Start a meaningful conversation with a stranger", xp: 40, difficulty: 3 },
        { id: "social_2", title: "Compliment Giver", description: "Give 3 genuine compliments to different people", xp: 20, difficulty: 1 },
        { id: "social_3", title: "Active Listener", description: "Have a 20-minute conversation where you ask more questions than you make statements", xp: 25, difficulty: 2 },
        { id: "social_4", title: "Network Builder", description: "Reach out to someone you haven't talked to in months", xp: 30, difficulty: 2 },
        { id: "social_5", title: "Public Speaker", description: "Record yourself giving a 2-minute speech on any topic", xp: 35, difficulty: 3 }
      ],
      productivity: [
        { id: "prod_1", title: "Time Blocker", description: "Plan your entire day in time blocks and stick to it", xp: 30, difficulty: 2 },
        { id: "prod_2", title: "Distraction Destroyer", description: "Work for 2 hours without checking social media or phone", xp: 35, difficulty: 3 },
        { id: "prod_3", title: "Task Terminator", description: "Complete your 3 most important tasks before noon", xp: 40, difficulty: 3 },
        { id: "prod_4", title: "Email Zero", description: "Clear your email inbox completely", xp: 20, difficulty: 1 },
        { id: "prod_5", title: "Future Self", description: "Prepare everything for tomorrow tonight (clothes, meals, schedule)", xp: 25, difficulty: 2 }
      ],
      confidence: [
        { id: "conf_1", title: "Power Pose", description: "Do confident power poses for 5 minutes in front of a mirror", xp: 15, difficulty: 1 },
        { id: "conf_2", title: "Fear Facer", description: "Do something that makes you slightly uncomfortable", xp: 35, difficulty: 3 },
        { id: "conf_3", title: "Affirmation Station", description: "Write down 5 things you're proud of accomplishing", xp: 20, difficulty: 1 },
        { id: "conf_4", title: "Comfort Zone Exit", description: "Try a new activity or hobby for 30 minutes", xp: 30, difficulty: 2 },
        { id: "conf_5", title: "Self Advocate", description: "Ask for something you want (raise, favor, opportunity)", xp: 45, difficulty: 3 }
      ],
      creativity: [
        { id: "creat_1", title: "Idea Generator", description: "Write down 20 ideas for anything (they can be terrible)", xp: 25, difficulty: 1 },
        { id: "creat_2", title: "Art Attack", description: "Create something artistic for 30 minutes (draw, write, compose)", xp: 30, difficulty: 2 },
        { id: "creat_3", title: "Problem Solver", description: "Find 5 creative solutions to a current problem in your life", xp: 35, difficulty: 2 },
        { id: "creat_4", title: "Story Spinner", description: "Write a 500-word short story about your day from your pet's perspective", xp: 25, difficulty: 2 },
        { id: "creat_5", title: "Innovation Station", description: "Design an improvement to something you use daily", xp: 30, difficulty: 2 }
      ],
      leadership: [
        { id: "lead_1", title: "Decision Maker", description: "Make 3 decisions you've been putting off", xp: 30, difficulty: 2 },
        { id: "lead_2", title: "Team Builder", description: "Organize a group activity or help coordinate a team project", xp: 40, difficulty: 3 },
        { id: "lead_3", title: "Mentor Mode", description: "Teach someone a skill you're good at", xp: 35, difficulty: 2 },
        { id: "lead_4", title: "Initiative Taker", description: "Volunteer to lead on something at work or in your community", xp: 45, difficulty: 3 },
        { id: "lead_5", title: "Feedback Giver", description: "Give constructive feedback to someone in a helpful way", xp: 25, difficulty: 2 }
      ],
      mindfulness: [
        { id: "mind_1", title: "Meditation Master", description: "Meditate for 15 minutes without guidance", xp: 25, difficulty: 2 },
        { id: "mind_2", title: "Gratitude List", description: "Write down 10 specific things you're grateful for", xp: 15, difficulty: 1 },
        { id: "mind_3", title: "Breath Focus", description: "Practice deep breathing for 10 minutes during a stressful moment", xp: 20, difficulty: 1 },
        { id: "mind_4", title: "Digital Detox", description: "Go 4 hours without any screens", xp: 35, difficulty: 3 },
        { id: "mind_5", title: "Nature Connection", description: "Spend 30 minutes outside without devices, just observing", xp: 25, difficulty: 2 }
      ]
    };
  }

  getChatResponses() {
    return [
      "That's a great question! Remember, small consistent actions lead to big transformations. What's one tiny step you could take today?",
      "I believe in your potential! Every challenge you complete is building the person you want to become. Keep pushing forward!",
      "Struggling with motivation? That's totally normal! Try focusing on just the next 5 minutes instead of the whole task.",
      "You're already showing courage by being here and working on yourself. That's more than most people do!",
      "Remember: you don't have to be perfect, you just have to be better than yesterday. Progress over perfection!",
      "What would the future version of yourself thank you for doing today?",
      "Every expert was once a beginner. Every pro was once an amateur. Keep going!",
      "The magic happens outside your comfort zone. Which challenge will you tackle today?",
      "Your only competition is who you were yesterday. Focus on your own growth journey!",
      "Consistency beats perfection every time. Small daily improvements compound into amazing results!"
    ];
  }
}

// Initialize the enhanced system
const gameManager = new GameStateManager();

// Export for global access
window.gameManager = gameManager;