// Initialize the enhanced system with proper security
const gameManager = new GameStateManager();

// Global initialization function
function initializeSecureSystem() {
  // Ensure proper database initialization
  gameManager.db.createDemoData();
  
  // Set up security monitoring
  setupSecurityMonitoring();
  
  // Initialize route protection
  if (typeof window !== 'undefined') {
    window.gameManager = gameManager;
    
    // Monitor for unauthorized admin access attempts
    monitorAdminAccess();
    
    console.log('🔒 Secure Level Up IRL System Initialized');
    console.log('📊 Admin Login: admin@levelupirl.com / SecureAdmin2024!');
  }
}

// Security monitoring setup
function setupSecurityMonitoring() {
  // Override console methods to detect potential security bypass attempts
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  };

  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('admin') || message.includes('role') || message.includes('unauthorized')) {
      gameManager.db.logSecurityEvent('CONSOLE_SECURITY_WARNING', gameManager.currentGameState.user?.id);
    }
    originalConsole.warn.apply(console, args);
  };
}

// Monitor for unauthorized admin dashboard access
function monitorAdminAccess() {
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target;
          if (target.id === 'adminDashboard' && target.style.display !== 'none') {
            // Someone is trying to show admin dashboard
            const currentUser = gameManager.currentGameState.user;
            if (!currentUser || currentUser.role !== 'admin') {
              gameManager.db.logSecurityEvent('UNAUTHORIZED_ADMIN_UI_ACCESS', currentUser?.id);
              target.style.display = 'none';
              
              if (typeof showToast === 'function') {
                showToast('Access denied. Admin privileges required.', 'error');
              }
            }
          }
        }
      });
    });

    // Start observing when admin dashboard is created
    setTimeout(() => {
      const adminDashboard = document.getElementById('adminDashboard');
      if (adminDashboard) {
        observer.observe(adminDashboard, { 
          attributes: true, 
          attributeFilter: ['style'] 
        });
      }
    }, 1000);
  }
}

// Secure routing functions
function secureRouteToUserDashboard() {
  const currentUser = gameManager.currentGameState.user;
  
  if (!currentUser || currentUser.role !== 'user') {
    gameManager.db.logSecurityEvent('UNAUTHORIZED_USER_DASHBOARD_ACCESS', currentUser?.id);
    return false;
  }

  // Hide all other views
  const landing = document.getElementById('landing');
  const adminDashboard = document.getElementById('adminDashboard');
  const app = document.getElementById('app');

  if (landing) landing.style.display = 'none';
  if (adminDashboard) adminDashboard.style.display = 'none';
  if (app) app.style.display = 'block';

  return true;
}

function secureRouteToAdminDashboard() {
  const currentUser = gameManager.currentGameState.user;
  
  if (!currentUser || currentUser.role !== 'admin') {
    gameManager.db.logSecurityEvent('UNAUTHORIZED_ADMIN_DASHBOARD_ACCESS', currentUser?.id);
    return false;
  }

  // Hide all other views
  const landing = document.getElementById('landing');
  const app = document.getElementById('app');
  
  if (landing) landing.style.display = 'none';
  if (app) app.style.display = 'none';

  // Show admin dashboard through secure admin manager
  if (window.secureAdminManager) {
    return window.secureAdminManager.showAdminDashboard();
  }

  return false;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecureSystem);
  } else {
    initializeSecureSystem();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LevelUpDatabase,
    GameStateManager,
    gameManager
  };
}