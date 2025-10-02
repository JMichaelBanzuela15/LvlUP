// Secure Admin System - Separate dashboard with proper authorization
class SecureAdminManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.currentAdmin = null;
    this.initSecureAdmin();
  }

  initSecureAdmin() {
    // Create admin dashboard UI (separate from user UI)
    this.createAdminDashboardUI();
    
    // Initialize role-based access control
    this.setupAccessControl();
  }

  // Secure admin authentication - role must come from database
  authenticateAdmin(user) {
    if (!user || user.role !== 'admin') {
      console.warn('Unauthorized admin access attempt');
      return false;
    }
    
    this.currentAdmin = user;
    return true;
  }

  // Show admin dashboard - only if properly authenticated
  showAdminDashboard() {
    // Double-check authorization
    if (!this.requireAdminAccess()) {
      return false;
    }
    
    // Hide all user interface elements
    document.getElementById("landing").style.display = "none";
    document.getElementById("app").style.display = "none";
    
    // Show admin dashboard
    const adminDashboard = document.getElementById("adminDashboard");
    if (adminDashboard) {
      adminDashboard.style.display = "block";
      this.loadAdminData();
      return true;
    }
    
    return false;
  }

  hideAdminDashboard() {
    const adminDashboard = document.getElementById("adminDashboard");
    if (adminDashboard) {
      adminDashboard.style.display = "none";
    }
  }

  // Authorization guard - critical security function
  requireAdminAccess() {
    const currentUser = this.gameManager.currentGameState.user;
    
    if (!currentUser || currentUser.role !== 'admin') {
      console.warn('Access denied: Admin role required');
      this.handleUnauthorizedAccess();
      return false;
    }
    
    if (!this.authenticateAdmin(currentUser)) {
      this.handleUnauthorizedAccess();
      return false;
    }
    
    return true;
  }

  handleUnauthorizedAccess() {
    showToast('Access denied. Admin privileges required.', 'error');
    this.hideAdminDashboard();
    
    // Redirect to appropriate dashboard
    if (window.currentUser) {
      window.routeToUserDashboard();
    } else {
      // Redirect to login
      document.getElementById("landing").style.display = "block";
    }
  }

  loadAdminData() {
    if (!this.requireAdminAccess()) return;
    
    this.updateAdminStats();
    this.loadUsersList();
    this.loadSystemLogs();
  }

  updateAdminStats() {
    if (!this.requireAdminAccess()) return;
    
    const users = Object.values(this.gameManager.db.users).filter(u => u.role !== 'admin');
    const totalUsers = users.length;
    const activeUsers = users.filter(u => {
      const lastLogin = new Date(u.lastLogin);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastLogin > weekAgo;
    }).length;
    
    const totalChallenges = users.reduce((sum, user) => sum + (user.profile?.completedChallenges || 0), 0);
    const avgLevel = users.length > 0 ? (users.reduce((sum, user) => sum + (user.profile?.level || 1), 0) / users.length).toFixed(1) : 0;

    document.getElementById('adminTotalUsers').textContent = totalUsers;
    document.getElementById('adminActiveUsers').textContent = activeUsers;
    document.getElementById('adminTotalChallenges').textContent = totalChallenges;
    document.getElementById('adminAvgLevel').textContent = avgLevel;
  }

  loadUsersList() {
    if (!this.requireAdminAccess()) return;
    
    const usersList = document.getElementById('adminUsersList');
    const users = Object.values(this.gameManager.db.users).filter(u => u.role !== 'admin');
    
    usersList.innerHTML = users.map(user => `
      <tr class="admin-user-row">
        <td>
          <div class="user-info">
            <div class="user-avatar">${user.profile?.avatar || user.name.charAt(0)}</div>
            <div>
              <div class="user-name">${this.escapeHtml(user.name)}</div>
              <div class="user-email">${this.escapeHtml(user.email)}</div>
            </div>
          </div>
        </td>
        <td>Level ${user.profile?.level || 1}</td>
        <td>${user.profile?.xp || 0} XP</td>
        <td>${user.profile?.streak || 0} days</td>
        <td>${user.profile?.completedChallenges || 0}</td>
        <td>${new Date(user.lastLogin).toLocaleDateString()}</td>
        <td>
          <div class="admin-user-actions">
            <button class="btn-small btn-primary" onclick="secureAdminManager.viewUserDetail('${user.id}')">View</button>
            <button class="btn-small btn-danger" onclick="secureAdminManager.deleteUser('${user.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  loadSystemLogs() {
    if (!this.requireAdminAccess()) return;
    
    // Generate realistic system logs
    const logs = [
      { time: new Date(), type: 'info', message: 'Admin dashboard accessed' },
      { time: new Date(Date.now() - 1800000), type: 'user', message: 'New user registration completed' },
      { time: new Date(Date.now() - 3600000), type: 'challenge', message: 'Daily challenges reset completed' },
      { time: new Date(Date.now() - 7200000), type: 'security', message: 'Failed admin access attempt blocked' },
      { time: new Date(Date.now() - 10800000), type: 'info', message: 'Database backup completed' },
      { time: new Date(Date.now() - 14400000), type: 'user', message: 'User data export requested' }
    ];

    const logsList = document.getElementById('adminSystemLogs');
    logsList.innerHTML = logs.map(log => `
      <div class="log-entry log-${log.type}">
        <span class="log-time">${log.time.toLocaleTimeString()}</span>
        <span class="log-type">${log.type.toUpperCase()}</span>
        <span class="log-message">${this.escapeHtml(log.message)}</span>
      </div>
    `).join('');
  }

  viewUserDetail(userId) {
    if (!this.requireAdminAccess()) return;
    
    const user = this.gameManager.db.users[userId];
    if (!user || user.role === 'admin') return;

    // Create modal for user details
    const modal = document.createElement('div');
    modal.className = 'admin-modal-overlay';
    modal.innerHTML = `
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h3>User Details: ${this.escapeHtml(user.name)}</h3>
          <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="admin-modal-content">
          <div class="user-detail-grid">
            <div class="user-detail-section">
              <h4>Basic Information</h4>
              <p><strong>Name:</strong> ${this.escapeHtml(user.name)}</p>
              <p><strong>Email:</strong> ${this.escapeHtml(user.email)}</p>
              <p><strong>Role:</strong> ${user.role || 'user'}</p>
              <p><strong>Join Date:</strong> ${new Date(user.joinDate).toLocaleDateString()}</p>
              <p><strong>Last Login:</strong> ${new Date(user.lastLogin).toLocaleDateString()}</p>
            </div>
            <div class="user-detail-section">
              <h4>Progress Stats</h4>
              <p><strong>Level:</strong> ${user.profile?.level || 1}</p>
              <p><strong>Total XP:</strong> ${user.profile?.totalXP || 0}</p>
              <p><strong>Current Streak:</strong> ${user.profile?.streak || 0} days</p>
              <p><strong>Best Streak:</strong> ${user.profile?.bestStreak || 0} days</p>
              <p><strong>Completed Challenges:</strong> ${user.profile?.completedChallenges || 0}</p>
            </div>
            <div class="user-detail-section">
              <h4>Focus Areas</h4>
              <p>${(user.profile?.selectedCategories || []).join(', ') || 'None selected'}</p>
            </div>
            <div class="user-detail-section">
              <h4>Account Status</h4>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Account Type:</strong> Standard User</p>
            </div>
            <div class="user-detail-section full-width">
              <h4>Badges</h4>
              <div class="user-badges">
                ${(user.profile?.badges || []).map(badge => `<span class="badge-tag">${badge}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="admin-actions">
            <button class="btn btn-primary" onclick="secureAdminManager.resetUserProgress('${user.id}')">Reset Progress</button>
            <button class="btn btn-secondary" onclick="secureAdminManager.exportUserData('${user.id}')">Export Data</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  deleteUser(userId) {
    if (!this.requireAdminAccess()) return;
    
    const user = this.gameManager.db.users[userId];
    if (!user || user.role === 'admin') {
      showToast('Cannot delete admin users or invalid user', 'error');
      return;
    }
    
    if (confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      const success = this.gameManager.db.deleteUser(userId);
      if (success) {
        showToast('User deleted successfully', 'success');
        this.loadUsersList();
        this.updateAdminStats();
      } else {
        showToast('Failed to delete user', 'error');
      }
    }
  }

  resetUserProgress(userId) {
    if (!this.requireAdminAccess()) return;
    
    const user = this.gameManager.db.users[userId];
    if (!user || user.role === 'admin') return;
    
    if (confirm(`Are you sure you want to reset progress for "${user.name}"?`)) {
      // Reset user progress
      user.profile = {
        ...user.profile,
        level: 1,
        xp: 0,
        streak: 0,
        completedChallenges: 0,
        completedToday: [],
        lastCompletionDate: null,
        totalXP: 0,
        progressHistory: []
      };
      
      this.gameManager.db.saveUsers();
      showToast('User progress reset successfully', 'success');
      
      // Close modal and refresh data
      document.querySelector('.admin-modal-overlay')?.remove();
      this.loadUsersList();
      this.updateAdminStats();
    }
  }

  exportUserData(userId) {
    if (!this.requireAdminAccess()) return;
    
    const userData = this.gameManager.db.exportUserData(userId);
    if (userData && userData.role !== 'admin') {
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `user_${userData.name}_${userData.id}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      showToast('User data exported successfully', 'success');
    }
  }

  adminLogout() {
    this.currentAdmin = null;
    this.hideAdminDashboard();
    
    // Use the main logout function
    if (window.logout) {
      window.logout();
    }
  }

  // Security helper - escape HTML to prevent XSS
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupAccessControl() {
    // Monitor for unauthorized access attempts
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('admin'))) {
        // Log security events
        this.logSecurityEvent('Unauthorized access attempt detected');
      }
      originalConsoleWarn.apply(console, args);
    };
  }

  logSecurityEvent(message) {
    // In production, send to security monitoring service
    console.log(`[SECURITY] ${new Date().toISOString()}: ${message}`);
  }

  createAdminDashboardUI() {
    const adminHTML = `
      <div class="admin-dashboard" id="adminDashboard" style="display: none;">
        <div class="admin-header">
          <div class="admin-title">
            <h1>Level Up IRL - Admin Dashboard</h1>
            <p>System Administration & User Management</p>
          </div>
          <div class="admin-user-info">
            <span class="admin-badge">ADMINISTRATOR</span>
            <button class="btn btn-danger" onclick="secureAdminManager.adminLogout()">Logout</button>
          </div>
        </div>

        <div class="admin-content">
          <div class="admin-stats-grid">
            <div class="admin-stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-number" id="adminTotalUsers">0</div>
                <div class="stat-label">Total Users</div>
              </div>
            </div>
            <div class="admin-stat-card">
              <div class="stat-icon">🟢</div>
              <div class="stat-content">
                <div class="stat-number" id="adminActiveUsers">0</div>
                <div class="stat-label">Active Users</div>
              </div>
            </div>
            <div class="admin-stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-content">
                <div class="stat-number" id="adminTotalChallenges">0</div>
                <div class="stat-label">Total Challenges</div>
              </div>
            </div>
            <div class="admin-stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-number" id="adminAvgLevel">0</div>
                <div class="stat-label">Avg Level</div>
              </div>
            </div>
          </div>

          <div class="admin-sections">
            <div class="admin-section">
              <div class="admin-section-header">
                <h2>User Management</h2>
                <div class="admin-section-actions">
                  <button class="btn btn-primary" onclick="secureAdminManager.loadUsersList()">Refresh</button>
                </div>
              </div>
              <div class="admin-table-container">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Level</th>
                      <th>XP</th>
                      <th>Streak</th>
                      <th>Challenges</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="adminUsersList">
                    <!-- Users will be populated here -->
                  </tbody>
                </table>
              </div>
            </div>

            <div class="admin-section">
              <div class="admin-section-header">
                <h2>System Logs</h2>
                <div class="admin-section-actions">
                  <button class="btn btn-secondary" onclick="secureAdminManager.loadSystemLogs()">Refresh</button>
                </div>
              </div>
              <div class="admin-logs-container" id="adminSystemLogs">
                <!-- Logs will be populated here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert admin dashboard into DOM
    document.body.insertAdjacentHTML('beforeend', adminHTML);
    
    // Add admin styles
    this.addAdminStyles();
  }

  addAdminStyles() {
    const styles = `
      <style id="admin-styles">
        .admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .admin-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-title h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .admin-title p {
          margin: 0;
          color: #cbd5e1;
        }

        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-badge {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .admin-content {
          padding: 2rem;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .admin-stat-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s;
        }

        .admin-stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .admin-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .admin-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .admin-section-header {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-section-header h2 {
          margin: 0;
          font-size: 1.3rem;
        }

        .admin-table-container {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th,
        .admin-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-table th {
          background: rgba(255, 255, 255, 0.05);
          font-weight: 600;
          color: #cbd5e1;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-name {
          font-weight: 600;
        }

        .user-email {
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .admin-user-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-small {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-small.btn-primary {
          background: #6366f1;
          color: white;
        }

        .btn-small.btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-small:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .admin-logs-container {
          padding: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .log-entry {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.9rem;
        }

        .log-time {
          color: #cbd5e1;
          min-width: 80px;
        }

        .log-type {
          min-width: 80px;
          font-weight: 600;
        }

        .log-info .log-type { color: #3b82f6; }
        .log-user .log-type { color: #10b981; }
        .log-challenge .log-type { color: #8b5cf6; }
        .log-security .log-type { color: #f59e0b; }

        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .admin-modal {
          background: #1e1b4b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .admin-modal-header {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-close {
          background: none;
          border: none;
          color: #f8fafc;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .admin-modal-content {
          padding: 2rem;
        }

        .user-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .user-detail-section {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
        }

        .user-detail-section.full-width {
          grid-column: 1 / -1;
        }

        .user-detail-section h4 {
          margin: 0 0 1rem 0;
          color: #cbd5e1;
        }

        .user-detail-section p {
          margin: 0.5rem 0;
        }

        .user-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .badge-tag {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .admin-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .admin-stats-grid {
            grid-template-columns: 1fr;
          }

          .user-detail-grid {
            grid-template-columns: 1fr;
          }

          .admin-actions {
            flex-direction: column;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }
}

// Initialize secure admin system
function initializeSecureAdminSystem() {
  if (window.gameManager) {
    window.secureAdminManager = new SecureAdminManager(window.gameManager);
    console.log('Secure admin system initialized');
  } else {
    setTimeout(initializeSecureAdminSystem, 100);
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeSecureAdminSystem, 500);
});

