/* ==========================================================================
   MAIN APPLICATION CONTROLLER (js/app.js)
   Direct 1-Click Access for Admin Portal, Public Agency Site & User Dashboard
   ========================================================================== */

const App = {
  mode: 'admin', // 'admin', 'public', 'user'

  init() {
    if (typeof UserAdminEngine !== 'undefined' && UserAdminEngine.init) {
      UserAdminEngine.init();
    }
    if (typeof UserDashboard !== 'undefined' && UserDashboard.loadSession) {
      UserDashboard.loadSession();
    }
    const savedMode = localStorage.getItem('app_active_mode');
    if (savedMode && (savedMode === 'admin' || savedMode === 'public' || savedMode === 'user')) {
      this.mode = savedMode;
    }
    if (typeof MenuEngine !== 'undefined') {
      MenuEngine.init();
    }
    if (typeof UserAuthEngine !== 'undefined') {
      UserAuthEngine.init();
    }
    this.renderLayout();
  },

  broadcastMenuUpdate() {
    if (this.mode === 'user' && typeof UserDashboard !== 'undefined') {
      UserDashboard.renderUserDashboard();
    } else if (this.mode === 'public' && typeof PublicWebsite !== 'undefined') {
      const root = document.getElementById('app-container');
      if (root) root.innerHTML = PublicWebsite.renderPublicView();
    } else if (this.mode === 'admin' && typeof ThemeEngine !== 'undefined') {
      ThemeEngine.renderView();
    }
  },

  setMode(newMode) {
    if (this.mode === 'public' && typeof PublicWebsite !== 'undefined' && PublicWebsite.stopProofTimer) {
      PublicWebsite.stopProofTimer();
    }
    this.mode = newMode;
    try {
      localStorage.setItem('app_active_mode', newMode);
    } catch(e) {}
    
    if (newMode === 'user' && typeof UserDashboard !== 'undefined' && UserDashboard.loadSession) {
      UserDashboard.loadSession();
    }

    const root = document.getElementById('app-container');
    if (root) root.innerHTML = '';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderLayout();
    
    let modeText = 'Admin Portal';
    if (newMode === 'public') modeText = 'Public Agency Website';
    if (newMode === 'user') modeText = 'Client User Dashboard';

    this.showToast(`Switched view to ${modeText}`);
  },

  renderLayout() {
    const root = document.getElementById('app-container');
    if (!root) return;

    try {
      if (this.mode === 'admin') {
        root.innerHTML = `
          <!-- 2-Row Horizontal Navigation Menu -->
          <nav class="top-nav-container">
            <div class="top-nav-menu">
              <!-- Row 1 -->
              <div class="top-nav-row" style="flex-wrap: wrap;">
                <a class="nav-link-pill active" data-tab="dashboard" onclick="AdminDashboard.switchTab('dashboard')">Dashboard</a>
                <a class="nav-link-pill" data-tab="reports" onclick="AdminDashboard.switchTab('reports')">SEO Reports</a>
                
                <div class="dropdown-wrapper">
                  <a class="nav-link-pill" data-tab="users" onclick="AdminDashboard.switchTab('users')">Users</a>
                  <div class="dropdown-menu-list">
                    <a href="#" class="dropdown-item" onclick="AdminDashboard.switchTab('users')">All Clients</a>
                    <a href="#" class="dropdown-item" onclick="UserAdminEngine.openAddUserModal()">Add New Client</a>
                  </div>
                </div>

                <a class="nav-link-pill" data-tab="orders" onclick="AdminDashboard.switchTab('orders')">Orders</a>
                <a class="nav-link-pill" data-tab="categories" onclick="AdminDashboard.switchTab('categories')">Categories</a>
                <a class="nav-link-pill" data-tab="services" onclick="AdminDashboard.switchTab('services')">Services</a>
                <a class="nav-link-pill" data-tab="tickets" onclick="AdminDashboard.switchTab('tickets')">Ticket <span class="nav-badge">0</span></a>
                <a class="nav-link-pill" data-tab="transactions" onclick="AdminDashboard.switchTab('transactions')">Funds</a>
                
                <div class="dropdown-wrapper">
                  <a class="nav-link-pill" data-tab="tools" onclick="AdminDashboard.switchTab('tools')">SEO Tools</a>
                  <div class="dropdown-menu-list">
                    <a href="#" class="dropdown-item" onclick="AdminDashboard.switchTab('tools')">Dashboard</a>
                  </div>
                </div>

                <a class="nav-link-pill" data-tab="referrals" onclick="AdminDashboard.switchTab('referrals')">Referral System</a>
                <a class="nav-link-pill" data-tab="appearance" onclick="AdminDashboard.switchTab('appearance')">Theme</a>
                <a class="nav-link-pill" data-tab="settings" onclick="AdminDashboard.switchTab('settings')">Settings</a>
                <a class="nav-link-pill" data-tab="logs" onclick="AdminDashboard.switchTab('logs')">System Logs</a>
                <a class="nav-link-pill" onclick="App.showToast('Logged out successfully.')">Logout</a>
                
                <!-- Quick View Mode Switchers -->
                <a href="javascript:void(0)" class="nav-link-pill" style="background: #F1F5F9; border: 1px solid #CBD5E1; color: #0F172A; font-weight: 700; margin-left: auto;" onclick="openPublicSite(event)">Public Site →</a>
                <a href="javascript:void(0)" class="nav-link-pill" style="background: #00ACC1; color: #FFFFFF; font-weight: 800;" onclick="openClientPortal(event)">Client Portal →</a>
              </div>
            </div>
          </nav>

          <!-- Main Content Area -->
          <main class="main-dashboard-body" id="admin-main-view">
            <!-- Rendered by AdminDashboard -->
          </main>
        `;
        if (typeof AdminDashboard !== 'undefined') AdminDashboard.init();
      } else if (this.mode === 'user') {
        if (typeof UserDashboard !== 'undefined') {
          UserDashboard.renderUserDashboard();
        } else {
          throw new Error('UserDashboard engine module not loaded');
        }
      } else {
        root.innerHTML = `
          <div class="top-header-bar" style="background: #1F2937; padding: 0.6rem 2rem; display: flex; justify-content: space-between; align-items: center;">
            <a href="javascript:void(0)" class="top-header-brand" style="color: #FFF; font-weight: 800; text-decoration: none;">SPECTRUM PUBLIC SITE</a>
            <div style="display: flex; gap: 0.75rem;">
              <button type="button" class="btn-teal" style="background: #00BCD4; color: #000; font-weight: bold; padding: 0.4rem 0.9rem; border-radius: 6px; border: none; cursor: pointer;" onclick="openClientPortal(event)">👤 User Dashboard →</button>
              <button type="button" class="btn-teal" style="padding: 0.4rem 0.9rem; border-radius: 6px; cursor: pointer;" onclick="openAdminPortal(event)">🔐 Back to Admin Portal →</button>
            </div>
          </div>

          <main>
            ${PublicWebsite.renderPublicView()}
          </main>
        `;
        if (typeof PublicWebsite !== 'undefined') PublicWebsite.init();
      }
    } catch(err) {
      console.error('Render layout error:', err);
      root.innerHTML = `
        <div style="min-height: 100vh; background: #0F0A1C; color: #FFF; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 3rem; max-width: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Dashboard Rendering Notice</h2>
            <p style="color: #9CA3AF; font-size: 0.9rem; margin-bottom: 1.5rem;">An unexpected view initialization state occurred: ${err ? err.message : 'Error'}. Please click below to reset to Admin Portal.</p>
            <button class="btn-teal" style="background: #00BCD4; color: #000; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 8px; border: none; cursor: pointer;" onclick="openAdminPortal(event)">
              🔐 Return to Admin Portal →
            </button>
          </div>
        </div>
      `;
    }

    if (typeof GeneralSettingsEngine !== 'undefined') {
      GeneralSettingsEngine.applySettings();
    }
  },

  openModal(htmlContent) {
    const modalBackdrop = document.getElementById('global-modal-backdrop');
    const modalBody = document.getElementById('global-modal-content');
    if (modalBackdrop && modalBody) {
      modalBody.innerHTML = htmlContent;
      modalBackdrop.classList.add('open');
    }
  },

  closeModal() {
    const modalBackdrop = document.getElementById('global-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
    }
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Global Window Bindings & Fail-Safe Navigation Wrappers
window.App = App;

window.openPublicSite = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (e && e.stopPropagation) e.stopPropagation();
  try { localStorage.setItem('app_active_mode', 'public'); } catch(err) {}
  App.setMode('public');
  return false;
};

window.openClientPortal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (e && e.stopPropagation) e.stopPropagation();
  try { localStorage.setItem('app_active_mode', 'user'); } catch(err) {}
  App.setMode('user');
  return false;
};

window.openAdminPortal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (e && e.stopPropagation) e.stopPropagation();
  try { localStorage.setItem('app_active_mode', 'admin'); } catch(err) {}
  App.setMode('admin');
  return false;
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
