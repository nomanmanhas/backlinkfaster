/* ==========================================================================
   SPECTRUM MOTHER PANEL USER MANAGEMENT SYSTEM (js/userAdmin.js)
   - Sequential Numeric Integer IDs (1, 2, 3, 4, 5...)
   - Search Bar with Filter Dropdown (User Email, Username, Phone Number, Referral ID)
   - Reference Empty State ("Look like there are no results in here!")
   - Detailed Action Inspection Popup Modal with all registration details & Panel Launcher
   ========================================================================== */

const UserAdminEngine = {
  state: {
    users: []
  },

  init() {
    this.loadUsers();
  },

  loadUsers() {
    try {
      const saved = localStorage.getItem('seo_users_database');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.state.users = parsed;
          return;
        }
      }
      // Seed Initial Default Users if database is empty
      if (!this.state.users || this.state.users.length === 0) {
        this.state.users = [
          {
            id: 1,
            username: 'sarahjenkins',
            fullName: 'Sarah Jenkins',
            companyName: 'Apex Growth Agency',
            email: 'sarah.j@apextech.com',
            phone: '+1 555-234-5678',
            referralId: 'REF-1001',
            country: 'United States',
            passwordHash: 'sha256_mock_seed1',
            signupDate: 'Jul 30, 2026 09:15 AM',
            lastLogin: 'Aug 10, 2026 08:30 PM',
            emailVerified: true,
            accountStatus: 'Active',
            subscription: 'Pro SEO Suite',
            role: 'Client User',
            balance: '250.0000',
            ipAddress: '192.168.1.104',
            avatar: 'SJ',
            avatarColor: '#0097A7',
            apiKey: 'sk_live_spec_98412840921849021'
          },
          {
            id: 2,
            username: 'johnsmith',
            fullName: 'John Smith',
            companyName: 'Digital Edge Labs',
            email: 'john@digitaledge.io',
            phone: '+1 555-987-6543',
            referralId: 'REF-1002',
            country: 'Canada',
            passwordHash: 'sha256_mock_seed2',
            signupDate: 'Aug 01, 2026 02:45 PM',
            lastLogin: 'Aug 09, 2026 11:20 AM',
            emailVerified: true,
            accountStatus: 'Active',
            subscription: 'Enterprise SEO',
            role: 'Client User',
            balance: '1200.5000',
            ipAddress: '192.168.1.188',
            avatar: 'JS',
            avatarColor: '#DB2777',
            apiKey: 'sk_live_spec_77182390184019284'
          }
        ];
        this.saveUsers();
      }
    } catch(e) {
      console.error('Error loading users database:', e);
    }
  },

  saveUsers() {
    try {
      localStorage.setItem('seo_users_database', JSON.stringify(this.state.users));
    } catch(e) {
      console.error('Error saving users database:', e);
    }
  },

  getNextUserId() {
    if (this.state.users.length === 0) return 1;
    const maxId = Math.max(...this.state.users.map(u => parseInt(u.id) || 0));
    return maxId + 1;
  },

  renderView() {
    this.loadUsers();
    const container = document.getElementById('admin-main-view');
    if (!container) return;

    container.innerHTML = `
      <div class="data-table-card">
        <!-- Top Search Bar & Filter Selector -->
        <div style="display: flex; align-items: center; border: 1px solid #00ACC1; border-radius: 4px; overflow: hidden; background: #FFFFFF; margin-bottom: 1.5rem;">
          <input type="text" id="user-search-input" class="form-control" placeholder="Search for..." style="border: none; padding: 0.65rem 1rem; flex: 1; font-size: 0.92rem;" onkeyup="UserAdminEngine.applySearchFilter()">
          
          <select id="user-search-filter-type" style="border: none; border-left: 1px solid #D1D5DB; padding: 0.65rem 1rem; background: #FFFFFF; font-size: 0.88rem; outline: none; font-weight: 600; color: #374151; cursor: pointer;" onchange="UserAdminEngine.applySearchFilter()">
            <option value="email">User Email</option>
            <option value="username">Username</option>
            <option value="phone">Phone Number</option>
            <option value="referral">Referral ID</option>
          </select>

          <button style="border: none; background: #FFFFFF; border-left: 1px solid #D1D5DB; padding: 0.65rem 1rem; cursor: pointer; color: #6B7280;" onclick="UserAdminEngine.applySearchFilter()">
            🔍
          </button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="font-size: 1.15rem; font-weight: 700; color: #111827;">User Management Database</h2>
          <button class="btn-teal" onclick="UserAdminEngine.openAddUserModal()">+ Register New User</button>
        </div>

        <!-- Table Container -->
        <div class="table-responsive" id="users-table-container">
          ${this.renderUsersTableContent(this.state.users)}
        </div>
      </div>
    `;
  },

  renderUsersTableContent(usersList) {
    if (!usersList || usersList.length === 0) {
      return `
        <div style="text-align: center; padding: 4.5rem 1.5rem; background: #FFFFFF;">
          <div style="width: 110px; height: 80px; background: #F3F4F6; border: 2px dashed #D1D5DB; border-radius: 8px; margin: 0 auto 1.2rem auto; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 2.5rem; color: #9CA3AF;">🖼️</span>
          </div>
          <div style="font-size: 1.1rem; font-weight: 600; color: #9CA3AF;">Look like there are no results in here!</div>
        </div>
      `;
    }

    return `
      <table class="custom-table" id="users-data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Balance</th>
            <th>Signup Date</th>
            <th style="text-align: center;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${usersList.map(u => `
            <tr>
              <td style="font-weight: 700; color: #000;">${u.id}</td>
              <td style="font-weight: 700;">${u.username}</td>
              <td style="color: #DB2777; font-size: 0.88rem;">${u.email}</td>
              <td>${u.fullName}</td>
              <td style="font-size: 0.85rem; color: #4B5563; font-weight: 600;">${u.phone}</td>
              <td>
                <span class="nav-badge" style="background: ${u.accountStatus === 'Active' ? '#D1FAE5' : '#FEE2E2'}; color: ${u.accountStatus === 'Active' ? '#065F46' : '#991B1B'}; font-size: 0.78rem; padding: 0.2rem 0.6rem;">
                  ${u.accountStatus}
                </span>
              </td>
              <td style="font-weight: 700; color: #10B981;">$${Number(u.balance || 0).toFixed(2)}</td>
              <td style="color: #6B7280; font-size: 0.82rem;">${u.signupDate}</td>
              <td style="text-align: center;">
                <button class="btn-teal" style="padding: 0.3rem 0.75rem; font-size: 0.82rem;" onclick="UserAdminEngine.openUserActionPopup(${u.id})">
                  👁️ Action / View
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  applySearchFilter() {
    const query = document.getElementById('user-search-input')?.value.toLowerCase().trim() || '';
    const filterType = document.getElementById('user-search-filter-type')?.value || 'email';

    const filtered = this.state.users.filter(u => {
      if (!query) return true;
      if (filterType === 'email') return u.email.toLowerCase().includes(query);
      if (filterType === 'username') return u.username.toLowerCase().includes(query);
      if (filterType === 'phone') return u.phone.toLowerCase().includes(query);
      if (filterType === 'referral') return u.referralId.toLowerCase().includes(query);
      return true;
    });

    const container = document.getElementById('users-table-container');
    if (container) {
      container.innerHTML = this.renderUsersTableContent(filtered);
    }
  },

  /* ==========================================================================
     ACTION POPUP MODAL (ALL REGISTRATION DETAILS & PANEL LAUNCHER)
     ========================================================================== */
  openUserActionPopup(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    const symbol = AdminDashboard.state.activeCurrency === 'INR' ? '₹' : '$';

    App.openModal(`
      <div style="border-bottom: 2px solid #00ACC1; padding-bottom: 0.8rem; margin-bottom: 1.2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #111827; margin: 0;">
            User Registration Details <span style="color: #0097A7;">[#${user.id}]</span>
          </h2>
          <span class="nav-badge" style="background: ${user.accountStatus === 'Active' ? '#D1FAE5' : '#FEE2E2'}; color: ${user.accountStatus === 'Active' ? '#065F46' : '#991B1B'}; font-size: 0.85rem; padding: 0.25rem 0.75rem;">
            ${user.accountStatus}
          </span>
        </div>
      </div>

      <!-- Complete Registration Details Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; text-align: left;">
        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">User Numeric ID</label>
          <input type="text" class="form-control" value="#${user.id}" readonly style="font-weight:bold; background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Username</label>
          <input type="text" class="form-control" value="${user.username}" readonly style="font-weight:bold; color:#0097A7; background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Full Name</label>
          <input type="text" class="form-control" value="${user.fullName}" readonly style="background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Email Address</label>
          <input type="text" class="form-control" value="${user.email}" readonly style="color:#DB2777; background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Phone Number (With Country Code)</label>
          <input type="text" class="form-control" value="${user.phone}" readonly style="font-weight:600; background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Referral ID</label>
          <input type="text" class="form-control" value="${user.referralId}" readonly style="background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Country Location</label>
          <input type="text" class="form-control" value="${user.country || 'United States'}" readonly style="background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Available Balance</label>
          <input type="text" class="form-control" value="${symbol}${parseFloat(user.balance || 0).toFixed(4)}" readonly style="color:#059669; font-weight:bold; background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Signup Date</label>
          <input type="text" class="form-control" value="${user.signupDate}" readonly style="background:#F9FAFB;">
        </div>

        <div class="form-group">
          <label style="font-weight:700; font-size:0.82rem; color:#4B5563;">Last Login Timestamp</label>
          <input type="text" class="form-control" value="${user.lastLogin}" readonly style="background:#F9FAFB;">
        </div>
      </div>

      <!-- Popup Action Options -->
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; background: #F9FAFB; padding: 1rem; border-radius: 6px; border: 1px solid #E5E7EB;">
        <button class="btn-teal" style="flex: 1;" onclick="UserAdminEngine.openUserDashboardPanel('${user.username}')">
          🌐 Open User Panel
        </button>

        <button class="btn-outline" style="flex: 1; border-color: ${user.accountStatus === 'Active' ? '#EF4444' : '#10B981'}; color: ${user.accountStatus === 'Active' ? '#EF4444' : '#10B981'}; font-weight: bold;" onclick="UserAdminEngine.toggleUserStatus(${user.id})">
          ${user.accountStatus === 'Active' ? '🚫 Disable Account Access' : '✓ Enable Account Access'}
        </button>
      </div>
    `);
  },

  toggleUserStatus(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (user) {
      user.accountStatus = user.accountStatus === 'Active' ? 'Disabled' : 'Active';
      this.saveUsers();
      
      // If toggled user is currently logged in and now disabled, clear session
      try {
        const activeStored = localStorage.getItem('active_client_user');
        if (activeStored) {
          const activeUser = JSON.parse(activeStored);
          if (activeUser && (activeUser.id === user.id || activeUser.username === user.username) && user.accountStatus === 'Disabled') {
            localStorage.removeItem('active_client_user');
          }
        }
      } catch(e) {}

      App.closeModal();
      App.showToast(`User #${user.id} (${user.username}) status updated to ${user.accountStatus}!`);
      this.renderView();
    }
  },

  openUserDashboardPanel(username) {
    const user = this.state.users.find(u => u.username === username);
    if (!user) return;

    if (user.accountStatus === 'Disabled') {
      const msg = 'Admin ke taraf se aapka account block kiya gaya hai. Please admin se rabta karein.';
      App.showToast(`⚠️ ${msg}`, 'error');
      alert(`⚠️ Account Blocked:\n\n${msg}`);
      return;
    }

    App.closeModal();
    if (typeof UserDashboard !== 'undefined') {
      UserDashboard.state.currentUser = user;
    }
    try {
      localStorage.setItem('active_client_user', JSON.stringify(user));
    } catch(e) {}
    App.showToast(`Logged in as @${username} & switched to Client Portal!`);
    App.setMode('user');
  },

  openAddUserModal() {
    App.openModal(`
      <h2 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">Register New <span class="text-gradient">User Account</span></h2>
      <p style="color: #6B7280; font-size: 0.85rem; margin-bottom: 1.2rem;">Sequential Numeric ID will be assigned automatically (#${this.getNextUserId()}).</p>

      <div class="form-group"><label>Full Name *</label><input type="text" id="reg-fullname" class="form-control" placeholder="e.g. John Smith"></div>
      <div class="form-group"><label>Unique Username *</label><input type="text" id="reg-username" class="form-control" placeholder="e.g. johnsmith"></div>
      <div class="form-group"><label>Email Address *</label><input type="email" id="reg-email" class="form-control" placeholder="john@smith.com"></div>
      
      <div style="display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem;" class="form-group">
        <div>
          <label>Code *</label>
          <input type="text" id="reg-code" class="form-control" value="+91">
        </div>
        <div>
          <label>Phone Number *</label>
          <input type="text" id="reg-phone" class="form-control" placeholder="9876543210">
        </div>
      </div>

      <div class="form-group"><label>Referral ID (Optional)</label><input type="text" id="reg-referral" class="form-control" placeholder="REF-1004"></div>
      <div class="form-group"><label>Password *</label><input type="password" id="reg-pass" class="form-control" placeholder="••••••••"></div>

      <button class="btn-teal" style="width: 100%; margin-top: 1rem;" onclick="UserAdminEngine.submitAddUser()">
        🚀 Register User & Issue Sequential ID #${this.getNextUserId()}
      </button>
    `);
  },

  async submitAddUser() {
    const res = await UserAuthEngine.handleSignup({
      fullName: document.getElementById('reg-fullname')?.value,
      username: document.getElementById('reg-username')?.value,
      email: document.getElementById('reg-email')?.value,
      countryCode: document.getElementById('reg-code')?.value,
      phone: document.getElementById('reg-phone')?.value,
      referralId: document.getElementById('reg-referral')?.value,
      password: document.getElementById('reg-pass')?.value
    });

    if (res.success) {
      App.closeModal();
      App.showToast(res.message);
      this.renderView();
    } else {
      App.showToast(res.message, 'error');
    }
  }
};
