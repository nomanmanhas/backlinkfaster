/* ==========================================================================
   PRODUCTION CLIENT USER DASHBOARD PANEL ENGINE (js/userDashboard.js)
   Phase 3 Execution:
   - Deposit Funds Payment Gateways (Razorpay, Paytm, Stripe, Crypto) & Real-Time Balance Top-Up
   - Support Tickets Console (Ticket Creation, Priority & Real-Time Sync with Admin)
   - Account Settings & API Key Generator
   ========================================================================== */

const UserDashboard = {
  state: {
    activeTab: 'new-order',
    currentUser: {
      id: 1,
      username: 'sarahjenkins',
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@apextech.com',
      phone: '+1 555-234-5678',
      referralId: 'REF-1001',
      balance: '250.0000',
      accountStatus: 'Active',
      apiKey: 'sk_live_spec_98412840921849021',
      role: 'Client User'
    },
    orderForm: {
      selectedCategory: 'Technical SEO',
      selectedServiceId: 101,
      quantity: 1,
      targetLink: '',
      calculatedPrice: 1500.00
    },
    tickets: [
      { id: 'TCK-801', subject: 'Speed Optimization Speed Score Question', priority: 'Medium', status: 'Open', date: '2026-07-31 19:20' }
    ],
    userOrderSearchQuery: '',
    userOrderStatusFilter: 'ALL',
    lastOrderSuccess: null
  },

  toggleSidebar() {
    this.state.isSidebarCollapsed = !this.state.isSidebarCollapsed;
    this.renderUserDashboard();
  },

  loadSession() {
    try {
      if (typeof UserAdminEngine !== 'undefined' && UserAdminEngine.loadUsers) {
        UserAdminEngine.loadUsers();
      }
      if (typeof AdminDashboard !== 'undefined') {
        if (AdminDashboard.loadCategories) AdminDashboard.loadCategories();
        if (AdminDashboard.loadServices) AdminDashboard.loadServices();
        if (AdminDashboard.loadOrders) AdminDashboard.loadOrders();
      }
      const savedSession = localStorage.getItem('active_client_user');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && (parsed.id || parsed.username)) {
          let freshUser = null;
          if (typeof UserAdminEngine !== 'undefined' && Array.isArray(UserAdminEngine.state.users)) {
            freshUser = UserAdminEngine.state.users.find(u => u.id === parsed.id || u.username === parsed.username || u.email === parsed.email);
          }
          if (freshUser) {
            if (freshUser.accountStatus === 'Disabled') {
              localStorage.removeItem('active_client_user');
              const msg = 'Admin ke taraf se aapka account block kiya gaya hai. Please admin se rabta karein.';
              if (typeof App !== 'undefined' && App.showToast) App.showToast(`⚠️ ${msg}`, 'error');
              alert(`⚠️ Account Blocked:\n\n${msg}`);
              if (typeof App !== 'undefined' && App.setMode) App.setMode('public');
              return false;
            }
            this.state.currentUser = freshUser;
            localStorage.setItem('active_client_user', JSON.stringify(freshUser));
            return true;
          } else if (parsed.accountStatus !== 'Disabled') {
            this.state.currentUser = parsed;
            return true;
          }
        }
      }
      
      // Fallback: If no session saved, select first active user from UserAdminEngine
      if (typeof UserAdminEngine !== 'undefined' && Array.isArray(UserAdminEngine.state.users) && UserAdminEngine.state.users.length > 0) {
        const firstActive = UserAdminEngine.state.users.find(u => u.accountStatus === 'Active') || UserAdminEngine.state.users[0];
        if (firstActive && firstActive.accountStatus !== 'Disabled') {
          this.state.currentUser = firstActive;
          localStorage.setItem('active_client_user', JSON.stringify(firstActive));
          return true;
        }
      }
    } catch(e) {
      console.error('Error loading user session:', e);
    }
    return false;
  },

  logoutUser() {
    try {
      localStorage.removeItem('active_client_user');
    } catch(e) {}
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('Logged out of Client Portal successfully.');
      App.setMode('public');
    }
  },

  switchTab(tabKey) {
    this.state.activeTab = tabKey;
    localStorage.setItem('seo_user_active_tab', tabKey);
    if (typeof MenuEngine !== 'undefined' && MenuEngine.injectMetaTags) {
      MenuEngine.injectMetaTags(tabKey);
    }
    this.renderUserDashboard();
  },

  renderUserSidebarLinks() {
    const defaultNavs = [
      { key: 'new-order', icon: '🚀', name: 'New Order' },
      { key: 'orders', icon: '📦', name: 'Order History' },
      { key: 'audit-history', icon: '📋', name: 'Audit History' },
      { key: 'add-funds', icon: '💳', name: 'Add Funds' },
      { key: 'services-catalog', icon: '≡', name: 'Services' },
      { key: 'tickets', icon: '🗣️', name: 'Tickets' },
      { key: 'account', icon: '👤', name: 'Account' }
    ];

    if (typeof MenuEngine === 'undefined') {
      return defaultNavs.map(n => `
        <a class="user-nav-link ${this.state.activeTab === n.key ? 'active' : ''}" onclick="UserDashboard.switchTab('${n.key}')" title="${n.name}">
          <span style="min-width: 24px; text-align: center;">${n.icon}</span> 
          <span style="${this.state.isSidebarCollapsed ? 'display: none;' : ''}">${n.name}</span>
        </a>
      `).join('');
    }

    const filteredDefaults = defaultNavs.filter(n => {
      const item = MenuEngine.state.menuItems.find(m => m.name.toLowerCase().includes(n.name.toLowerCase()) || m.slug.toLowerCase().includes(n.key));
      if (!item) {
        return MenuEngine.isRouteAllowed(n.name) || MenuEngine.isRouteAllowed(n.key);
      }
      const isActive = item.status === 'Active' || item.active;
      if (!isActive) return false;
      
      // "jo login wale menu hai ... wo user dashboard ma show hone chahiya"
      // Wait, menus marked as 'All' should ALSO show up in User Dashboard (like 'Services').
      if (item.visibility !== 'Only logged in' && item.visibility !== 'Logged In' && item.visibility !== 'All') {
        return false;
      }
      return true;
    }).map(n => {
      const item = MenuEngine.state.menuItems.find(m => m.name.toLowerCase().includes(n.name.toLowerCase()) || m.slug.toLowerCase().includes(n.key));
      return {
        ...n,
        displayName: item ? item.name : n.name,
        icon: item ? item.icon : n.icon,
        openIn: item ? item.openIn : 'Same tab',
        targetUrl: item ? MenuEngine.getFullUrl(item) : '#',
        isExternal: item ? item.isExternal : false,
        orderIndex: item ? item.orderIndex : 99
      };
    });

    const dynamicItems = MenuEngine.state.menuItems.filter(m => {
      const isActive = m.status === 'Active' || m.active;
      if (!isActive) return false;
      if (m.visibility !== 'Only logged in' && m.visibility !== 'Logged In' && m.visibility !== 'All') return false;
      
      if (!m.isExternal) {
        const isInDefault = defaultNavs.some(n => m.name.toLowerCase().includes(n.name.toLowerCase()) || m.slug.toLowerCase().includes(n.key));
        if (isInDefault) return false;
      }
      return true;
    }).map(m => ({
      key: m.isExternal ? `ext-${m.id}` : (m.slug ? m.slug.replace('/', '') : `menu-${m.id}`),
      icon: m.icon,
      displayName: m.name,
      openIn: m.openIn,
      targetUrl: MenuEngine.getFullUrl(m),
      isExternal: m.isExternal || m.linkType === 'External',
      orderIndex: m.orderIndex || 99
    }));

    const combined = [...filteredDefaults, ...dynamicItems].sort((a, b) => a.orderIndex - b.orderIndex);

    return combined.map(n => {
      if (n.isExternal) {
        return `
          <a class="user-nav-link" href="${n.targetUrl}" target="${n.openIn === 'New tab' ? '_blank' : '_self'}" rel="${n.openIn === 'New tab' ? 'noopener noreferrer' : ''}" title="${n.displayName}">
            <span style="min-width: 24px; text-align: center;">${n.icon}</span> 
            <span style="${this.state.isSidebarCollapsed ? 'display: none;' : ''}">${n.displayName}</span>
          </a>
        `;
      }
      return `
        <a class="user-nav-link ${this.state.activeTab === n.key ? 'active' : ''}" onclick="UserDashboard.switchTab('${n.key}')" title="${n.displayName}">
          <span style="min-width: 24px; text-align: center;">${n.icon}</span> 
          <span style="${this.state.isSidebarCollapsed ? 'display: none;' : ''}">${n.displayName}</span>
        </a>
      `;
    }).join('');
  },

  init() {
    this.loadSession();
    const savedTab = localStorage.getItem('seo_user_active_tab');
    if (savedTab) {
      this.state.activeTab = savedTab;
    }
    this.renderUserDashboard();
  },

  handleOrderSearch(query) {
    this.state.orderSearchQuery = query;
    this.renderUserDashboard();
  },

  downloadReports(orderId) {
    const allOrders = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && Array.isArray(AdminDashboard.state.orders)) ? AdminDashboard.state.orders : [];
    const order = allOrders.find(o => o.id === orderId);
    if (order && order.reports && order.reports.length > 0) {
      App.showToast('Starting download...', 'success');
      order.reports.forEach((r, idx) => {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = r.dataUrl;
          a.download = r.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, idx * 500); // Stagger downloads slightly
      });
    } else {
      App.showToast('No reports found for this order.', 'error');
    }
  },

  renderUserDashboard() {
    this.loadSession();
    const root = document.getElementById('app-container');
    if (!root) return;

    const user = this.state.currentUser || {
      id: 1,
      username: 'sarahjenkins',
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@apextech.com',
      phone: '+1 555-234-5678',
      referralId: 'REF-1001',
      balance: '250.0000',
      accountStatus: 'Active',
      apiKey: 'sk_live_spec_98412840921849021',
      role: 'Client User'
    };

    const symbol = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && AdminDashboard.state.activeCurrency === 'INR') ? '₹' : '$';
    const userInitials = ((user && user.username) ? user.username : 'CU').slice(0, 2).toUpperCase();
    const userBalance = parseFloat((user && user.balance) || 0).toFixed(4);
    const userId = (user && user.id) || 1;
    const username = (user && user.username) || 'user';
    const fullName = (user && user.fullName) || username;
    const accountStatus = (user && user.accountStatus) || 'Active';
    const siteName = (typeof window.GeneralSettingsEngine !== 'undefined' && window.GeneralSettingsEngine.state && window.GeneralSettingsEngine.state.siteName) ? window.GeneralSettingsEngine.state.siteName : 'SPECTRUM';
    const siteLogo = (typeof window.GeneralSettingsEngine !== 'undefined' && window.GeneralSettingsEngine.state && window.GeneralSettingsEngine.state.logo) ? window.GeneralSettingsEngine.state.logo : '';

    root.innerHTML = `
      <div class="user-panel-layout" style="display: flex; height: 100vh; overflow: hidden; background: #F8FAFC; color: #0F172A;">
        
        <!-- User Sidebar Navigation (Hero Section Colors) -->
        <aside style="width: ${this.state.isSidebarCollapsed ? '80px' : '260px'}; transition: width 0.3s ease; background: linear-gradient(135deg, #0a0514 0%, #1a0b2e 100%); border-right: 1px solid rgba(255, 255, 255, 0.08); padding: 1.5rem ${this.state.isSidebarCollapsed ? '0.5rem' : '1rem'}; display: flex; flex-direction: column; justify-content: space-between; color: #F3F4F6; overflow-y: auto; overflow-x: hidden;">
          <div>
            <div style="display: flex; align-items: center; justify-content: ${this.state.isSidebarCollapsed ? 'center' : 'space-between'}; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 1.5rem;">
              <span class="brand-logo" style="${this.state.isSidebarCollapsed ? 'display: none;' : 'display: flex; align-items: center;'}">
                ${siteLogo ? `<img src="${siteLogo}" alt="Logo" style="height: 45px; max-width: 100%; object-fit: contain;">` : '<span style="font-weight:800; font-size: 1.2rem;">SEO</span>'}
              </span>
              <button onclick="UserDashboard.toggleSidebar()" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; color: #0F172A !important; cursor: pointer; font-size: 1.1rem; padding: 0.4rem 0.6rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='#FFFFFF'" title="Toggle Sidebar">
                <i class="fa-solid fa-bars" style="color: #0F172A !important;"></i>
              </button>
            </div>

            <!-- Client Wallet Balance Card -->
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: ${this.state.isSidebarCollapsed ? '0.8rem' : '1.2rem'}; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: ${this.state.isSidebarCollapsed ? 'center' : 'left'};">
              <div style="${this.state.isSidebarCollapsed ? 'display: none;' : 'display: block;'}">
                <div style="font-size: 0.78rem; color: #64748B; text-transform: uppercase; font-weight: 700;">Wallet Balance</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: #10B981; margin: 0.3rem 0;">${symbol}${userBalance}</div>
                <button type="button" class="btn-teal" style="width: 100%; font-size: 0.85rem; padding: 0.5rem; background: #00ACC1; border: none; color: #FFF; font-weight: 700; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#0284C7'" onmouseout="this.style.background='#00ACC1'" onclick="UserDashboard.switchTab('add-funds')">
                  + Add Funds
                </button>
              </div>
              <div style="${this.state.isSidebarCollapsed ? 'display: block;' : 'display: none;'}">
                <i class="fa-solid fa-wallet" style="font-size: 1.5rem; color: #10B981; cursor: pointer;" title="Wallet: ${symbol}${userBalance}" onclick="UserDashboard.switchTab('add-funds')"></i>
              </div>
            </div>

            <nav class="user-sidebar-menu" style="display: flex; flex-direction: column; gap: 0.35rem;">
              ${this.renderUserSidebarLinks()}
            </nav>
          </div>
        </aside>

        <!-- Main Body Area (White/Light Theme) -->
        <main style="flex: 1; display: flex; flex-direction: column; overflow-y: auto;">
          <header style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            <div style="font-size: 1.2rem; font-weight: 700; color: #0F172A;">
              Welcome to ${siteName}, <span style="color: #DB2777;">${fullName}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="text-align: right;">
                <div style="font-weight: 700; font-size: 0.9rem; color: #0F172A;">${fullName}</div>
                <div style="font-size: 0.78rem; color: ${accountStatus === 'Active' ? '#10B981' : '#EF4444'}; font-weight: 600;">● Account ${accountStatus}</div>
              </div>
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #00ACC1 0%, #0284C7 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #FFF; cursor:pointer; box-shadow: 0 2px 4px rgba(0,172,193,0.3);" onclick="UserDashboard.switchTab('account')" title="Account Settings">
                ${userInitials}
              </div>
              <button type="button" class="btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; background: rgba(239,68,68,0.15); color: #EF4444; border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; cursor: pointer;" onclick="UserDashboard.logoutUser()">
                Logout
              </button>
            </div>
          </header>

          <div style="padding: 2rem; flex: 1;">
            ${this.renderActiveTabContent()}
          </div>
        </main>
      </div>
    `;

    this.attachLiveInputListeners();
  },

  attachLiveInputListeners() {
    setTimeout(() => {
      const linkInput = document.getElementById('usr-link-input');
      const kwInput = document.getElementById('usr-kw-input');
      const qtyInput = document.getElementById('user-order-qty');

      const liveLink = document.getElementById('summary-live-link');
      const liveKw = document.getElementById('summary-live-kw');

      if (linkInput && liveLink) {
        linkInput.oninput = (e) => {
          const val = e.target.value.trim();
          liveLink.innerText = val ? val : '-';
        };
      }

      if (kwInput && liveKw) {
        kwInput.oninput = (e) => {
          const val = e.target.value.trim();
          liveKw.innerText = val ? val : '-';
        };
      }

      if (qtyInput) {
        qtyInput.oninput = (e) => {
          UserDashboard.onQuantityChange(e.target.value);
        };
      }
    }, 50);
  },

  renderActiveTabContent() {
    const symbol = '$';
    const user = this.state.currentUser || { fullName: 'Valued Client', email: 'client@domain.com', balance: 0, id: 101, username: 'client' };

    // 1. Prepare dynamic helper context data
    const allOrders = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && Array.isArray(AdminDashboard.state.orders)) ? AdminDashboard.state.orders : [];
    const myOrders = allOrders.filter(o => o && (o.username === user.fullName || o.username === user.username || o.email === user.email));
    
    // Services & Categories helper (Strict Active Filtering)
    const adminCategories = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && Array.isArray(AdminDashboard.state.categories)) ? AdminDashboard.state.categories : [];
    const activeCategories = adminCategories.filter(c => c && c.status === 'Active').sort((a, b) => (a.sort || 0) - (b.sort || 0));
    const activeCategoryNames = activeCategories.map(c => c.name);

    const allServices = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && Array.isArray(AdminDashboard.state.servicesList)) ? AdminDashboard.state.servicesList : [];
    const activeServices = allServices.filter(s => s.status === 'Active' && (activeCategoryNames.length === 0 || activeCategoryNames.includes(s.category)));

    const categoriesForDropdown = activeCategories.length > 0 ? activeCategories.map(c => c.name) : [...new Set(activeServices.map(s => s.category))];
    const activeCat = this.state.orderForm.selectedCategory || categoriesForDropdown[0] || 'Technical SEO';
    const servicesInCat = activeServices.filter(s => s.category === activeCat);
    const activeService = this.state.orderForm.selectedServiceId ? servicesInCat.find(s => s.id === this.state.orderForm.selectedServiceId) : null;

    let isPackageService = false;
    let formattedPrice = '$0.00';
    let serviceDescriptionBox = '';
    let serviceCustomCardHtml = '';
    let serviceAvgTime = 'N/A';
    let quantityLimitsBadgeHtml = '';

    if (activeService) {
      isPackageService = activeService.serviceType === 'Package';
      if (!isPackageService) {
        const unitRateCents = typeof FinancialEngine !== 'undefined' ? FinancialEngine.toCents(activeService.rate) : (parseFloat(String(activeService.rate).replace(/[^0-9.-]+/g, '')) || 100) * 100;
        const totalPriceCents = unitRateCents * (this.state.orderForm.quantity || 1);
        formattedPrice = typeof FinancialEngine !== 'undefined' ? FinancialEngine.formatCents(totalPriceCents) : `$${(totalPriceCents / 100).toFixed(2)}`;
      } else {
        formattedPrice = activeService.rate;
      }

      serviceDescriptionBox = (activeService.description && activeService.description.trim() !== '') ? `
        <div class="form-group" style="margin-bottom: 1.2rem;">
          <label class="text-gradient" style="font-weight: 800; margin-bottom: 0.4rem; display: block;">Service Description</label>
          <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-left: 4px solid #00ACC1; padding: 0.85rem 1rem; border-radius: 6px; font-size: 0.85rem; color: #334155; line-height: 1.5; white-space: pre-wrap;">
            ${activeService.description}
          </div>
        </div>
      ` : '';
      
      
      if (!isPackageService && activeService.serviceType !== 'Subscriptions') {
        const minQty = activeService.minAmount || 10;
        const maxQty = activeService.maxAmount || 10000;
        quantityLimitsBadgeHtml = `
        <div style="margin-bottom: 0.5rem; display: flex; gap: 0.5rem;">
          <span style="background: #E0F2FE; color: #0369A1; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; border: 1px solid #BAE6FD;">Min: ${minQty}</span>
          <span style="background: #FEF3C7; color: #92400E; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; border: 1px solid #FDE68A;">Max: ${maxQty}</span>
        </div>
        `;
      }

      const defaultCardCode = (typeof AdminDashboard !== 'undefined' && AdminDashboard.getDefaultCustomCardCode) ? AdminDashboard.getDefaultCustomCardCode() : '';
      serviceCustomCardHtml = activeService.customCardCode ? activeService.customCardCode : defaultCardCode;
      serviceAvgTime = activeService.avgTime || '24 Hours';
    }

    const quantityDisplay = isPackageService ? 'none' : 'block';
    const summaryDisplay = activeService ? 'block' : 'none';
    const keywordsDisplay = isPackageService ? 'none' : 'block';
    const linkInputHtml = isPackageService 
      ? `<input type="url" id="usr-link-input" class="form-control" placeholder="http://example.com/page.html" style="font-size: 0.9rem; padding: 0.75rem; color: #64748B; width: 100%; border: 1px solid #CBD5E1; border-radius: 6px;">`
      : `<textarea id="usr-link-input" class="form-control" rows="4" placeholder="http://example.com/page-one.html&#10;http://example.com/page-two.html&#10;http://example.com/page-three.html" style="font-size: 0.9rem; padding: 0.75rem; color: #64748B; width: 100%;"></textarea>`;

    const catSelectHtml = `<select id="usr-cat-select" class="form-control" style="background: #FFFFFF; color: #0F172A; border: 1px solid #E2E8F0;" onchange="UserDashboard.onCategoryChange(this.value)">
      ${categoriesForDropdown.map(c => `<option value="${c}" ${c === activeCat ? 'selected' : ''}>${c}</option>`).join('')}
    </select>`;

    const svcSelectHtml = `<select id="usr-svc-select" class="form-control" style="background: #FFFFFF; color: #0F172A; border: 1px solid #E2E8F0;" onchange="UserDashboard.onServiceChange(this.value)">
      <option value="" disabled ${!activeService ? 'selected' : ''}>-- Select a Service --</option>
      ${servicesInCat.map(s => `<option value="${s.id}" ${activeService && s.id === activeService.id ? 'selected' : ''}>${s.name} (${s.rate})</option>`).join('')}
    </select>`;

    // Client Services Catalog with Live Search & Category Filter
    const servicesTableHtml = `
      <div style="margin-bottom: 1.5rem;">
        <!-- Live Search Bar & Category Filter -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
          <div style="flex: 2; min-width: 250px;">
            <input type="text" id="usr-svc-search-input" class="form-control" placeholder="🔍 Search service title or keyword..." oninput="UserDashboard.filterClientServicesView(this.value, document.getElementById('usr-svc-cat-filter')?.value)" style="background: #FFFFFF; color: #0F172A; border: 1px solid #CBD5E1; padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.9rem;">
          </div>
          <div style="flex: 1; min-width: 200px;">
            <select id="usr-svc-cat-filter" class="form-control" onchange="UserDashboard.filterClientServicesView(document.getElementById('usr-svc-search-input')?.value, this.value)" style="background: #FFFFFF; color: #0F172A; border: 1px solid #CBD5E1; padding: 0.6rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem;">
              <option value="ALL">All Categories (${categoriesForDropdown.length})</option>
              ${activeCategories.map(c => `<option value="${c.name}">${c.icon || '⚡'} ${c.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Services Grouped by Category -->
        <div id="usr-services-catalog-list" style="display: flex; flex-direction: column; gap: 2rem;">
          ${activeServices.length === 0 ? `
            <div style="text-align:center; padding: 3.5rem 1.5rem; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px; color: #64748B;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">≡</div>
              <div style="font-weight: 700; font-size: 1.1rem; color: #0F172A;">No Active SEO Services Available</div>
              <p style="font-size: 0.88rem; margin-top: 0.3rem;">Please check back later or contact support.</p>
            </div>
          ` : categoriesForDropdown.map(catName => {
            const catObj = activeCategories.find(c => c.name === catName) || { icon: '⚡' };
            const catServices = activeServices.filter(s => s.category === catName);
            if (catServices.length === 0) return '';

            return `
              <div class="usr-category-block" data-category="${catName}" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 0.75rem; margin-bottom: 1rem;">
                  <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>${catObj.icon || '⚡'}</span> ${catName}
                  </h3>
                  <span style="font-size: 0.78rem; font-weight: 700; color: #00ACC1; background: #E0F2FE; padding: 0.2rem 0.6rem; border-radius: 12px;">
                    ${catServices.length} Packages
                  </span>
                </div>

                <table class="custom-table" style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #F8FAFC; text-align: left; font-size: 0.78rem; color: #475569; text-transform: uppercase;">
                      <th style="padding: 0.65rem 0.85rem;">ID</th>
                      <th style="padding: 0.65rem 0.85rem;">Service Package</th>
                      <th style="padding: 0.65rem 0.85rem;">Type</th>
                      <th style="padding: 0.65rem 0.85rem;">Rate</th>
                      <th style="padding: 0.65rem 0.85rem;">Min / Max</th>
                      <th style="padding: 0.65rem 0.85rem; text-align: right;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${catServices.map(s => `
                      <tr class="usr-svc-row" data-name="${s.name.toLowerCase()}" data-category="${s.category}" style="border-bottom: 1px solid #F1F5F9; font-size: 0.88rem;">
                        <td style="padding: 0.65rem 0.85rem; font-weight: 700; color: #00ACC1;">#${s.id}</td>
                        <td style="padding: 0.65rem 0.85rem;">
                          <div style="font-weight: 700; color: #0F172A;">${s.name}</div>
                          ${s.description ? `<button type="button" onclick="UserDashboard.viewServiceDescription('${s.id}')" style="margin-top:0.4rem; padding:0.2rem 0.6rem; font-size:0.75rem; background:#F1F5F9; border:1px solid #CBD5E1; border-radius:4px; color:#0F172A; cursor:pointer; font-weight:600;">Description</button>` : ''}
                        </td>
                        <td style="padding: 0.65rem 0.85rem;">
                          <span style="background: #F1F5F9; border: 1px solid #CBD5E1; color: #0F172A; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">
                            ${s.serviceType || 'Default'}
                          </span>
                        </td>
                        <td style="padding: 0.65rem 0.85rem; font-weight: 800; color: #059669;">${s.rate}</td>
                        <td style="padding: 0.65rem 0.85rem; color: #64748B; font-size: 0.8rem;">${s.minMax || (s.minAmount + ' / ' + s.maxAmount)}</td>
                        <td style="padding: 0.65rem 0.85rem; text-align: right;">
                          <button type="button" class="btn-teal" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; background: #00ACC1; border: none; color: #FFF; border-radius: 6px; font-weight: 700; cursor: pointer;" onclick="UserDashboard.selectServiceForOrder(${s.id}, '${s.category}')">
                            🚀 Order Package
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const ordersTableHtml = myOrders.length === 0 ? `
      <div style="text-align: center; padding: 3.5rem 1.5rem; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px;">
        <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">📦</div>
        <div style="font-weight: 700; font-size: 1.1rem; color: #0F172A;">No Orders Placed Yet</div>
        <button class="btn-teal" style="margin-top: 1rem;" onclick="UserDashboard.switchTab('new-order')">🚀 Place First Order</button>
      </div>
    ` : `
      <table class="custom-table">
        <thead><tr><th>Order ID</th><th>Service Details</th><th>Details</th><th>Quantity</th><th>Charge</th><th>Status</th><th>Order Date</th><th style="text-align: right;">Action</th></tr></thead>
        <tbody>
          ${myOrders.map(o => {
            const sId = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(o.id) : o.id;
            const sName = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(o.serviceName) : o.serviceName;
            const rawLink = o.targetLink || '';
            const sLink = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeUrl(rawLink) : rawLink;
            const sLinkDisp = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(rawLink) : rawLink;
            const sCharge = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(o.charge) : o.charge;
            const sStatus = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(o.status) : o.status;
            const sDate = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(o.orderDate) : o.orderDate;

            return `
            <tr>
              <td style="font-weight: 700; color: #00ACC1;">#${sId}</td>
              <td style="font-weight: 600;">${sName}</td>
              <td style="font-size: 1.1rem; display: flex; gap: 0.5rem; align-items: center; justify-content: center;">
                <button onclick="UserDashboard.viewOrderDetails('${sId}', 'link')" style="border:none; background:#E0F2FE; color:#0284C7; font-weight: 700; padding:0.4rem; border-radius:6px; cursor:pointer;" title="View Links">🔗</button>
                <button onclick="UserDashboard.viewOrderDetails('${sId}', 'keywords')" style="border:none; background:#FEF3C7; color:#D97706; font-weight: 700; padding:0.4rem; border-radius:6px; cursor:pointer;" title="View Keywords">🔑</button>
              </td>
              <td>${o.quantity || 1}</td>
              <td style="font-weight: 800; color: #059669;">${sCharge}</td>
              <td><span style="background:${o.status === 'Completed' ? '#D1FAE5' : (o.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7')}; color:${o.status === 'Completed' ? '#065F46' : (o.status === 'Cancelled' ? '#991B1B' : '#92400E')}; padding:0.2rem 0.6rem; border-radius:12px; font-size:0.75rem; font-weight:700;">${sStatus}</span></td>
              <td style="color: #64748B; font-size: 0.82rem;">${sDate}</td>
              <td style="text-align: right;">
                ${(o.status === 'Pending' || o.status === 'Processing') ? `
                  <button type="button" class="btn-outline" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; color: #DC2626; border: 1px solid #FCA5A5; border-radius: 4px; font-weight: bold; cursor: pointer;" onclick="UserDashboard.cancelUserOrder('${sId}')">
                    🔴 Cancel & Refund
                  </button>
                ` : `<span style="font-size: 0.78rem; color: #94A3B8;">Locked (${sStatus})</span>`}
              </td>
            </tr>
          `;}).join('')}
        </tbody>
      </table>
    `;

    const ticketsListHtml = (this.state.tickets || []).length === 0 ? `
      <div style="text-align: center; padding: 3.5rem 1.5rem; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px;">
        <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">🗣️</div>
        <div style="font-weight: 700; font-size: 1.1rem; color: #0F172A;">No Open Tickets</div>
      </div>
    ` : `
      <table class="custom-table">
        <thead><tr><th>Ticket ID</th><th>Subject</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          ${(this.state.tickets || []).map(t => `
            <tr>
              <td style="font-weight: 700; color: #00ACC1;">#${t.id}</td>
              <td style="font-weight: 600;">${t.subject}</td>
              <td>${t.priority}</td>
              <td><span style="background:#D1FAE5; color:#065F46; padding:0.2rem 0.6rem; border-radius:12px; font-size:0.75rem; font-weight:700;">${t.status}</span></td>
              <td style="color: #64748B; font-size: 0.82rem;">${t.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Fetch all site audits from localStorage
    let allAudits = [];
    try {
      const savedAudits = localStorage.getItem('seo_site_audits');
      if (savedAudits) allAudits = JSON.parse(savedAudits);
    } catch(e) {}
    
    const myAudits = allAudits.filter(a => a && (a.username === user.username || a.username === user.fullName || a.email === user.email));

    const auditHistoryTableHtml = myAudits.length === 0 ? `
      <div style="text-align: center; padding: 3.5rem 1.5rem; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
        <div style="font-weight: 700; font-size: 1.1rem; color: #0F172A;">No Website Audits Submitted Yet</div>
        <p style="color: #64748B; font-size: 0.88rem; margin: 0.5rem 0 1.2rem 0;">Submit your target domain URL and get a 54-metric agency technical report.</p>
        <button type="button" class="btn-teal" style="padding: 0.6rem 1.2rem; font-weight: 800; font-size: 0.9rem; background: #00ACC1; border: none; color: #FFF; border-radius: 6px; cursor: pointer;" onclick="UserDashboard.switchTab('audit')">
          + Audit Your Website
        </button>
      </div>
    ` : `
      <table class="custom-table" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #F8FAFC; text-align: left; font-size: 0.78rem; color: #475569; text-transform: uppercase;">
            <th style="padding: 0.75rem 1rem;">Audit ID</th>
            <th style="padding: 0.75rem 1rem;">Link (Website Domain)</th>
            <th style="padding: 0.75rem 1rem;">Status</th>
            <th style="padding: 0.75rem 1rem; text-align: right;">Report</th>
          </tr>
        </thead>
        <tbody>
          ${myAudits.map(a => {
            const auditId = a.id || a.auditId;
            const targetLink = a.link || a.targetLink;
            const status = a.status || 'Pending';
            let badgeClass = 'pending';
            if (status === 'Process' || status === 'Inprogress' || status === 'In Progress') badgeClass = 'process';
            if (status === 'Complete' || status === 'Completed') badgeClass = 'complete';

            return `
              <tr style="border-bottom: 1px solid #F1F5F9; font-size: 0.9rem;">
                <td style="padding: 0.85rem 1rem; font-weight: 800; color: #00ACC1;">#${auditId}</td>
                <td style="padding: 0.85rem 1rem;">
                  <a href="${targetLink}" target="_blank" rel="noopener noreferrer" style="color: #0284C7; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;">
                    ${targetLink} <span style="font-size: 0.78rem;">↗</span>
                  </a>
                </td>
                <td style="padding: 0.85rem 1rem;">
                  <span class="audit-status-badge ${badgeClass}">${status}</span>
                </td>
                <td style="padding: 0.85rem 1rem; text-align: right;">
                  <button type="button" class="btn-teal" style="font-size: 0.8rem; padding: 0.4rem 0.85rem; background: #00ACC1; border: none; color: #FFF; font-weight: 700; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,172,193,0.2);" onclick="UserDashboard.viewAuditReport('${auditId}')">
                    View Report
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // Map tab key to template key
    let templateKey = this.state.activeTab;
    if (templateKey === 'order-history') templateKey = 'orders';
    if (templateKey === 'services-catalog') templateKey = 'services';
    if (templateKey === 'audit-report-view') templateKey = 'audit_report_view';

    // ALWAYS delegate 100% to PageTemplateEngine
    if (typeof PageTemplateEngine !== 'undefined') {
      let refSettings = { commissionRate: 10, minPayout: 50, payouts: [] };
      try {
        const savedSettings = localStorage.getItem('seo_admin_referral_settings');
        if (savedSettings) {
          refSettings = { ...refSettings, ...JSON.parse(savedSettings) };
        } else if (typeof AdminDashboard !== 'undefined' && AdminDashboard.state.referralSettings) {
          refSettings = AdminDashboard.state.referralSettings;
        }
      } catch(e) { console.error('Error loading referral settings', e); }
      const myPayouts = (refSettings.payouts || []).filter(p => p.referrer === user.username);
      const totalEarned = myPayouts.filter(p => p.status === 'Approved').reduce((sum, p) => sum + (parseFloat(String(p.commission).replace(/[^0-9.-]+/g, '')) || 0), 0);

      const refPayoutsTableHtml = myPayouts.length === 0 ? `
        <div style="text-align: center; padding: 2rem; color: #9CA3AF;">No referral commissions earned yet. Share your link to start earning!</div>
      ` : `
        <table class="custom-table">
          <thead><tr><th>Payout ID</th><th>Referred Client</th><th>Deposit Amount</th><th>Commission</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            ${myPayouts.map(p => `
              <tr>
                <td style="font-weight:700; color:#00ACC1;">${p.id}</td>
                <td style="color:#FFF;">${p.referredClient}</td>
                <td>${p.depositAmount}</td>
                <td style="font-weight:800; color:#10B981;">${p.commission}</td>
                <td><span style="background:${p.status === 'Approved' ? '#D1FAE5' : '#FEF3C7'}; color:${p.status === 'Approved' ? '#065F46' : '#92400E'}; padding:0.2rem 0.6rem; border-radius:12px; font-size:0.75rem; font-weight:700;">${p.status}</span></td>
                <td style="color:#9CA3AF; font-size:0.82rem;">${p.date}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      let orderSuccessBoxHtml = '';
      const symbol = '$';
      if (this.state.lastOrderSuccess) {
        const o = this.state.lastOrderSuccess;
        orderSuccessBoxHtml = `
          <div style="background: #E6F4EA; border: 1px solid #10B981; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; width: 100%;">
            <div style="font-weight: 800; color: #065F46; font-size: 1.1rem; margin-bottom: 0.5rem;">🎉 Order Placed Successfully!</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem; color: #047857;">
              <div><strong>Order ID:</strong> ${o.id}</div>
              <div><strong>Service Name:</strong> ${o.serviceName}</div>
              <div style="grid-column: 1 / -1;"><strong>Link:</strong> <a href="${o.targetLink}" target="_blank" rel="noopener noreferrer" style="color: #059669; text-decoration: underline;">${o.targetLink}</a></div>
              <div><strong>Quantity:</strong> ${o.quantity}</div>
              <div><strong>Amount Charged:</strong> ${o.charge}</div>
              <div style="grid-column: 1 / -1; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #A7F3D0;">
                <strong>Remaining Wallet Balance:</strong> ${symbol}${parseFloat(user.balance || 0).toFixed(2)}
              </div>
            </div>
          </div>
        `;
        this.state.lastOrderSuccess = null; // Clear after showing
      }

      const adminOrders = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state.orders) ? AdminDashboard.state.orders : [];
      let myOrders = adminOrders.filter(o => o.username === user.username || o.email === user.email);
      
      const q = (this.state.userOrderSearchQuery || '').toLowerCase();
      if (q) {
        myOrders = myOrders.filter(o => o.id.toLowerCase().includes(q) || (o.targetLink && o.targetLink.toLowerCase().includes(q)) || (o.keywords && o.keywords.toLowerCase().includes(q)));
      }
      const st = this.state.userOrderStatusFilter || 'ALL';
      if (st !== 'ALL') {
        myOrders = myOrders.filter(o => o.status === st);
      }

      const ordersTableHtml = myOrders.length === 0 ? `
        <div style="text-align: center; padding: 2rem; color: #9CA3AF;">No orders found matching your criteria.</div>
      ` : `
        <table class="custom-table">
          <thead><tr><th>Order ID</th><th>Service Name</th><th>Details</th><th>Qty</th><th>Charge</th><th>Date</th><th>Status</th><th>Report</th><th>Action</th></tr></thead>
          <tbody>
            ${myOrders.map(o => `
              <tr>
                <td style="font-weight:700; color:#00ACC1;">${o.id}</td>
                <td style="font-weight:600;">${o.serviceName || '-'}</td>
                <td style="font-size: 1.1rem; display: flex; gap: 0.5rem; align-items: center; justify-content: center; padding-top: 1rem;">
                  <button type="button" onclick="UserDashboard.viewOrderDetails('${o.id}', 'link')" style="border:none; background:#E0F2FE; color:#0284C7; font-weight: 700; padding:0.4rem; border-radius:6px; cursor:pointer;" title="View Links">🔗</button>
                  <button type="button" onclick="UserDashboard.viewOrderDetails('${o.id}', 'keywords')" style="border:none; background:#FEF3C7; color:#D97706; font-weight: 700; padding:0.4rem; border-radius:6px; cursor:pointer;" title="View Keywords">🔑</button>
                </td>
                <td style="color:#000; font-weight:700;">${o.quantity || 1}</td>
                <td style="font-weight:700; color:#10B981;">${o.charge || '-'}</td>
                <td style="color:#9CA3AF; font-size:0.82rem;">${o.orderDate || '-'}</td>
                <td><span style="background:${o.status === 'Completed' ? '#D1FAE5' : (o.status === 'In Progress' || o.status === 'Processing' ? '#E0F2FE' : (o.status === 'Partial' ? '#E0E7FF' : '#FEF3C7'))}; color:${o.status === 'Completed' ? '#065F46' : (o.status === 'In Progress' || o.status === 'Processing' ? '#0369A1' : (o.status === 'Partial' ? '#3730A3' : '#92400E'))}; padding:0.2rem 0.6rem; border-radius:12px; font-size:0.75rem; font-weight:700;">${o.status}</span></td>
                <td>
                  ${(o.reports && o.reports.length > 0) ? `
                    <button type="button" style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: #059669; color: #FFF; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;" onclick="UserDashboard.downloadReports('${o.id}')">
                      ⬇️ Download
                    </button>
                  ` : '<span style="color: #9CA3AF; font-size: 0.75rem;">N/A</span>'}
                </td>
                <td>
                  ${(o.allowCancel && o.status.toLowerCase() === 'pending') ? `
                    <button type="button" style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: #EF4444; color: #FFF; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;" onclick="UserDashboard.cancelUserOrder('${o.id}')">
                      Cancel
                    </button>
                  ` : '<span style="color: #9CA3AF; font-size: 0.75rem;">-</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      let balanceLogsTableHtml = '';
      try {
        const allLogs = JSON.parse(localStorage.getItem('seo_balance_logs') || '[]');
        const myLogs = allLogs.filter(log => log.user === user.username);
        
        balanceLogsTableHtml = myLogs.length === 0 ? `
          <div style="text-align: center; padding: 2rem; color: #9CA3AF;">No balance logs found for this account.</div>
        ` : `
          <table class="custom-table">
            <thead><tr><th>Transaction ID</th><th>Type</th><th>Description</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              ${myLogs.map(log => `
                <tr>
                  <td style="font-weight:700; color:#00ACC1;">${log.id}</td>
                  <td style="color:#FFF;">${log.type}</td>
                  <td style="color:#9CA3AF;">${log.description}</td>
                  <td style="font-weight:800; color:${log.amount.startsWith('+') ? '#10B981' : '#EF4444'};">${log.amount}</td>
                  <td><span style="background:${log.status === 'Credited' ? '#D1FAE5' : '#E0F2FE'}; color:${log.status === 'Credited' ? '#065F46' : '#0369A1'}; padding:0.2rem 0.6rem; border-radius:12px; font-size:0.75rem; font-weight:700;">${log.status}</span></td>
                  <td style="color:#9CA3AF; font-size:0.82rem;">${log.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } catch(e) { console.error('Error generating balance logs', e); }

      let auditData = {};
      if (this.state.activeAuditId) {
        let allAudits = [];
        try {
          const saved = localStorage.getItem('seo_site_audits');
          if (saved) allAudits = JSON.parse(saved);
        } catch(e) {}
        const cleanActiveId = this.state.activeAuditId.toString().replace(/^#/, '');
        const audit = allAudits.find(a => {
          if (!a) return false;
          const aId = (a.id || a.auditId || '').toString().replace(/^#/, '');
          return aId === cleanActiveId;
        });
        if (audit) {
          const r = audit.report || {};
          auditData = {
            audit_site_link: r.siteLink || audit.link || '#',
            audit_site_link_text: r.siteLink || audit.link || 'Website Link',
            audit_client_name: audit.username || user.username || 'Client',
            agency_logo_url: (typeof window.GeneralSettingsEngine !== 'undefined' && window.GeneralSettingsEngine.state && window.GeneralSettingsEngine.state.logo) ? window.GeneralSettingsEngine.state.logo : '',
            audit_ip: r.ip || '34.160.17.71',
            audit_score: r.score || '84',
            audit_crawled_pages: r.crawledPages || '15',
            audit_indexable_pages: r.googleIndexablePages || '15',
            audit_safe_browsing_html: (r.googleSafeBrowsing || 'Site is safe') === 'Site is safe' ? `<span style="color: #10B981;">Site is safe</span>` : `<span style="color: #EF4444;">${r.googleSafeBrowsing || 'Site is not safe'}</span>`,
            audit_domain_authority: r.domainAuthority || '24',
            audit_page_authority: r.pageAuthority || '35',
            audit_domain_rating: r.domainRating || '42',
            audit_ranking_keywords: r.organicKeywords || r.rankingKeywords || '57',
            audit_spam_score: r.spamScore || '1%',
            audit_domain_age: r.domainAge || '4 Years',
            audit_total_backlinks: r.backlinks || r.totalBacklinks || '1,204',
            audit_referring_domains: r.referringDomainsCount || r.referringDomains || '294',
            audit_organic_traffic: r.organicTraffic || '2.55K',
            audit_perf_score: r.perfScore || '67',
            audit_perf_color: parseInt(r.perfScore || '67') >= 90 ? '#0cce6b' : '#ffaa33',
            audit_perf_dash: (parseFloat(r.perfScore || '67') * 100.53 / 100).toFixed(2),
            audit_a11y_score: r.a11yScore || '82',
            audit_a11y_color: parseInt(r.a11yScore || '82') >= 90 ? '#0cce6b' : '#ffaa33',
            audit_a11y_dash: (parseFloat(r.a11yScore || '82') * 100.53 / 100).toFixed(2),
            audit_bp_score: r.bpScore || '96',
            audit_bp_color: parseInt(r.bpScore || '96') >= 90 ? '#0cce6b' : '#ffaa33',
            audit_bp_dash: (parseFloat(r.bpScore || '96') * 100.53 / 100).toFixed(2),
            audit_seo_score: r.seoScore || '83',
            audit_seo_color: parseInt(r.seoScore || '83') >= 90 ? '#0cce6b' : '#ffaa33',
            audit_seo_dash: (parseFloat(r.seoScore || '83') * 100.53 / 100).toFixed(2),
            audit_fcp: r.fcp || '0.9 s',
            audit_tbt: r.tbt || '90 ms',
            audit_si: r.si || '2.1 s',
            audit_cls: r.cls || '0.016',
            audit_http_status_code: r.httpStatusCode || 'N/A',
            audit_ssl_details: r.sslDetails || 'N/A',
            audit_www_redirect: r.wwwRedirect || 'N/A',
            audit_https_redirect: r.httpsRedirect || 'N/A',
            audit_html_size: r.htmlSize || 'N/A',
            audit_compression: r.compression || 'N/A',
            audit_security_headers: r.securityHeaders || 'N/A'
          };
        }
      }

      return PageTemplateEngine.compileAndRender(templateKey, {
        user_name: user.fullName || user.username,
        user_username: user.username,
        user_email: user.email,
        user_balance: `${symbol}${parseFloat(user.balance || 0).toFixed(2)}`,
        user_api_key: user.apiKey || 'sk_live_seo_99812489124',
        calculated_price: formattedPrice,
        quantity_display: quantityDisplay,
        keywords_display: keywordsDisplay,
        link_input_html: linkInputHtml,
        quantity_limits_badge: quantityLimitsBadgeHtml || '',
        summary_display: summaryDisplay,
        service_description_box: serviceDescriptionBox,
        service_custom_card_box: serviceCustomCardHtml,
        service_avg_time: serviceAvgTime,
        referral_link: `http://${window.location.host || 'localhost:9999'}/signup?ref=${user.username || 'client'}`,
        referral_commission_rate: `${refSettings.commissionRate || 10}%`,
        referral_min_payout: `$${(refSettings.minPayout || 50).toFixed(2)} USD`,
        referral_earnings_total: `$${totalEarned.toFixed(2)} USD`,
        referral_payouts_table: refPayoutsTableHtml,
        balance_logs_table: balanceLogsTableHtml,
        category_select_dropdown: catSelectHtml,
        service_select_dropdown: svcSelectHtml,
        order_success_box: orderSuccessBoxHtml,
        orders_table: ordersTableHtml,
        services_table: servicesTableHtml,
        tickets_list: ticketsListHtml,
        audit_history_table: auditHistoryTableHtml,
        ...auditData
      });
    }

    return `<div class="data-table-card"><h2>${this.state.activeTab}</h2></div>`;
  },

  onCategoryChange(cat) {
    this.state.orderForm.selectedCategory = cat;
    const services = AdminDashboard.state.servicesList.filter(s => s.category === cat);
    if (services.length > 0) {
      this.state.orderForm.selectedServiceId = services[0].id;
    }
    this.renderUserDashboard();
  },

  onServiceChange(svcId) {
    this.state.orderForm.selectedServiceId = parseInt(svcId);
    this.renderUserDashboard();
  },

  onQuantityChange(qtyVal) {
    const qty = parseInt(qtyVal) || 1;
    this.state.orderForm.quantity = qty;

    let activeService = null;
    if (typeof AdminDashboard !== 'undefined' && AdminDashboard.state.servicesList) {
      activeService = AdminDashboard.state.servicesList.find(s => s.id === this.state.orderForm.selectedServiceId) || AdminDashboard.state.servicesList[0];
    }

    let priceTextStr = '$0.00';
    if (activeService) {
      if (activeService.serviceType !== 'Package') {
        const unitRateCents = typeof FinancialEngine !== 'undefined' ? FinancialEngine.toCents(activeService.rate) : (parseFloat(String(activeService.rate).replace(/[^0-9.-]+/g, '')) || 100) * 100;
        const totalPriceCents = unitRateCents * qty;
        const symbol = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && AdminDashboard.state.activeCurrency === 'INR') ? '₹' : '$';
        priceTextStr = typeof FinancialEngine !== 'undefined' ? FinancialEngine.formatCents(totalPriceCents, symbol) : `${symbol}${(totalPriceCents / 100).toFixed(2)}`;
      } else {
        priceTextStr = activeService.rate;
      }
    }

    const priceText = document.getElementById('usr-live-price-text');
    if (priceText) priceText.innerText = priceTextStr;

    // Dynamic Validation on Input
    if (activeService && activeService.serviceType !== 'Package' && activeService.serviceType !== 'Subscriptions') {
      const minQty = parseInt(activeService.minAmount) || 10;
      const maxQty = parseInt(activeService.maxAmount) || 10000;
      const qtyErrorEl = document.getElementById('user-qty-error');
      
      if (qty < minQty || qty > maxQty) {
        if (qtyErrorEl) {
          qtyErrorEl.innerText = `Please enter a quantity between minimum ${minQty} and maximum ${maxQty}.`;
          qtyErrorEl.style.display = 'block';
        }
      } else {
        if (qtyErrorEl) qtyErrorEl.style.display = 'none';
      }
    }

    const priceDisplay = document.getElementById('order-total-price-display');
    if (priceDisplay) priceDisplay.innerText = priceTextStr;
  },

  submitUserOrder() {
    const user = this.state.currentUser;

    if (user.accountStatus === 'Disabled') {
      const blockMessage = 'Admin ke taraf se aapka account block kiya gaya hai. Please admin se rabta karein.';
      App.showToast(`⚠️ ${blockMessage}`, 'error');
      alert(`⚠️ Account Blocked:\n\n${blockMessage}`);
      return;
    }

    const linkInput = document.getElementById('usr-link-input') || document.getElementById('user-order-link');
    const kwInput = document.getElementById('usr-kw-input') || document.getElementById('user-order-kw');
    const rawLink = linkInput?.value?.trim() || '';
    const rawKeywords = kwInput?.value?.trim() || '';

    if (!rawLink) {
      App.showToast('Please enter your target website URL link.', 'error');
      return;
    }

    // Security Protocol & URL Sanitization
    const sanitizedLink = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeUrl(rawLink) : rawLink;
    if (sanitizedLink === '#') {
      App.showToast('⚠️ Invalid or malicious target URL. Please enter a valid http/https website address.', 'error');
      return;
    }

    const sanitizedKeywords = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(rawKeywords) : rawKeywords;

    const activeService = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state.servicesList) ? (AdminDashboard.state.servicesList.find(s => s.id === this.state.orderForm.selectedServiceId) || AdminDashboard.state.servicesList[0]) : { name: 'SEO Package', rate: '$100.00' };
    const unitRateCents = typeof FinancialEngine !== 'undefined' ? FinancialEngine.toCents(activeService.rate) : 10000;
    const isPackage = activeService.serviceType === 'Package';
    const qty = isPackage ? 1 : (this.state.orderForm.quantity || 1);

    // Min/Max Validation
    if (!isPackage && activeService.serviceType !== 'Subscriptions') {
      const minQty = parseInt(activeService.minAmount) || 10;
      const maxQty = parseInt(activeService.maxAmount) || 10000;
      
      const qtyErrorEl = document.getElementById('user-qty-error');
      if (qty < minQty || qty > maxQty) {
        const errorMsg = `Please enter a quantity between minimum ${minQty} and maximum ${maxQty}.`;
        if (qtyErrorEl) { qtyErrorEl.innerText = errorMsg; qtyErrorEl.style.display = 'block'; }
        App.showToast(errorMsg, 'error');
        return;
      }
      if (qtyErrorEl) qtyErrorEl.style.display = 'none';
    }
    const totalPriceCents = isPackage ? unitRateCents : (unitRateCents * qty);
    const currentBalanceCents = typeof FinancialEngine !== 'undefined' ? FinancialEngine.toCents(user.balance) : Math.round(parseFloat(user.balance || 0) * 100);

    // 1. Low Balance Guard
    if (currentBalanceCents < totalPriceCents) {
      const orderAmountStr = `$${(totalPriceCents / 100).toFixed(2)} USD`;
      const modalHtml = `
        <div style="text-align: center; padding: 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
          <h2 style="color: #0F172A; font-weight: 800; font-size: 1.5rem; margin-bottom: 0.5rem;">Insufficient wallet balance</h2>
          <p style="color: #64748B; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            You are trying to place an order for <strong style="color: #059669;">${orderAmountStr}</strong>, but your current balance is insufficient. Please add funds to proceed.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn-outline" style="padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; border: 1px solid #CBD5E1; background: #FFF; color: #475569;" onclick="App.closeModal()">Cancel</button>
            <button class="btn-cta-gradient" style="padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; color: #FFF; background: linear-gradient(135deg, #FF5555, #6025F5);" onclick="App.closeModal(); UserDashboard.switchTab('add-funds')">Add fund</button>
          </div>
        </div>
      `;
      if (typeof App !== 'undefined' && App.openModal) {
        App.openModal(modalHtml);
      } else {
        alert("Insufficient wallet balance. Order amount: " + orderAmountStr + ". Please add funds.");
      }
      return;
    }

    // 2. Auto-Deduct Balance via FinancialEngine
    user.balance = typeof FinancialEngine !== 'undefined' ? FinancialEngine.deductCents(user.balance, totalPriceCents / 100) : ((currentBalanceCents - totalPriceCents) / 100).toFixed(2);
    if (typeof UserAdminEngine !== 'undefined') {
      if (typeof UserAdminEngine.saveUsers === 'function') UserAdminEngine.saveUsers();
      else if (typeof UserAdminEngine.saveState === 'function') UserAdminEngine.saveState();
    }

    const symbol = '$';
    const totalChargeFormatted = typeof FinancialEngine !== 'undefined' ? FinancialEngine.formatCents(totalPriceCents, symbol) : `${symbol}${(totalPriceCents / 100).toFixed(2)}`;

    const orderId = typeof SecurityEngine !== 'undefined' && SecurityEngine.generateUniqueOrderId ? SecurityEngine.generateUniqueOrderId() : Math.random().toString(36).substring(2, 8).toUpperCase();

    const newOrder = {
      id: orderId,
      username: user.fullName || user.username,
      email: user.email,
      serviceName: activeService.name,
      targetLink: sanitizedLink,
      keywords: sanitizedKeywords,
      charge: totalChargeFormatted,
      chargeVal: totalPriceCents / 100,
      quantity: qty,
      status: 'Pending',
      allowCancel: activeService.cancelButton === 'Active',
      orderDate: new Date().toLocaleString()
    };

    let currentOrders = [];
    try {
      const saved = localStorage.getItem('seo_admin_orders');
      if (saved) currentOrders = JSON.parse(saved);
    } catch(e) {}
    
    currentOrders.unshift(newOrder);
    
    if (typeof AdminDashboard !== 'undefined') {
      AdminDashboard.state.orders = currentOrders;
    }
    localStorage.setItem('seo_admin_orders', JSON.stringify(currentOrders));

    this.state.orderForm.targetLink = '';

    // 3. Automated Confirmation Email
    if (typeof EmailEngine !== 'undefined') {
      EmailEngine.sendOrderConfirmationEmail(user, newOrder, activeService);
    }

    this.state.lastOrderSuccess = newOrder;
    // App.showToast(`🚀 Order #${newOrder.id} placed! $${(totalPriceCents / 100).toFixed(2)} deducted from wallet balance.`);
    this.switchTab('new-order');
  },

  cancelUserOrder(orderId) {
    const user = this.state.currentUser;
    const order = (AdminDashboard.state.orders || []).find(o => o.id === orderId);
    if (!order) return;

    // Security IDOR Protection: Verify Order Ownership
    const isOwner = (order.email && user.email && order.email.toLowerCase() === user.email.toLowerCase()) ||
                    (order.username && (order.username === user.fullName || order.username === user.username));
    
    if (!isOwner) {
      App.showToast('⚠️ Unauthorized Action: You can only cancel your own orders.', 'error');
      if (typeof SecurityEngine !== 'undefined' && SecurityEngine.logAction) {
        SecurityEngine.logAction(user.username || user.fullName, `SECURITY ALERT: IDOR attempt to cancel Order #${orderId} (Owner: ${order.email || order.username})`);
      }
      return;
    }

    if (order.status === 'In Progress' || order.status === 'Completed' || order.status === 'Cancelled') {
      App.showToast(`⚠️ Cannot cancel order that is ${order.status}.`, 'error');
      return;
    }

    const content = `
      <div style="padding: 2rem; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h3 style="margin-top:0; color:#0F172A; font-weight: 800; font-size: 1.5rem;">Cancel Order</h3>
        <p style="color:#64748B; margin-bottom:1.5rem; line-height: 1.6;">Are you sure you want to cancel order <strong>#${orderId}</strong>?<br>The full charge (${order.charge}) will be automatically refunded to your wallet balance.</p>
        <div style="display:flex; justify-content:center; gap:1rem;">
          <button type="button" onclick="UserDashboard.confirmCancelUserOrder('${orderId}')" style="background:#EF4444; color:#FFF; border:none; padding:0.6rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:800; font-size: 0.9rem;">Yes, Cancel & Refund</button>
          <button type="button" onclick="App.closeModal()" style="background:#E2E8F0; color:#475569; border:none; padding:0.6rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:800; font-size: 0.9rem;">No, Keep Order</button>
        </div>
      </div>
    `;
    App.showModal(content);
  },

  confirmCancelUserOrder(orderId) {
    App.closeModal();
    const user = this.state.currentUser;
    const order = (AdminDashboard.state.orders || []).find(o => o.id === orderId);
    if (!order) return;

    const chargeVal = typeof FinancialEngine !== 'undefined' ? FinancialEngine.fromCents(FinancialEngine.toCents(order.charge)) : (parseFloat(String(order.charge).replace(/[^0-9.-]+/g, '')) || 0);

    // Auto Refund to User Balance via FinancialEngine
    user.balance = typeof FinancialEngine !== 'undefined' ? FinancialEngine.addCents(user.balance, chargeVal) : (parseFloat(user.balance || 0) + chargeVal).toFixed(2);
    if (typeof UserAdminEngine !== 'undefined') {
      if (typeof UserAdminEngine.saveUsers === 'function') UserAdminEngine.saveUsers();
      else if (typeof UserAdminEngine.saveState === 'function') UserAdminEngine.saveState();
    }

    order.status = 'Cancelled and Refunded';
    
    // Explicitly persist orders after modification so admin dashboard and reloads show it
    if (typeof AdminDashboard !== 'undefined' && AdminDashboard.state.orders) {
      localStorage.setItem('seo_admin_orders', JSON.stringify(AdminDashboard.state.orders));
    }

    App.showToast(`✅ Order #${orderId} cancelled! $${chargeVal.toFixed(2)} refunded to your wallet.`);

    // Automated Cancellation & Refund Email
    if (typeof EmailEngine !== 'undefined') {
      EmailEngine.sendOrderCancellationEmail(user, order);
    }

    this.renderUserDashboard();
  },

  /* ==========================================================================
     PHASE 3 PAYMENT & TICKET HANDLERS
     ========================================================================== */
  submitDepositPayment() {
    const gateway = document.getElementById('usr-gw-select')?.value || 'Razorpay';
    const amount = parseFloat(document.getElementById('usr-dep-amount')?.value || 0);

    if (!amount || amount < 10) {
      App.showToast('Please enter a valid deposit amount (min $10 / ₹500).', 'error');
      return;
    }

    const user = this.state.currentUser;
    const symbol = AdminDashboard.state.activeCurrency === 'INR' ? '₹' : '$';
    user.balance = typeof FinancialEngine !== 'undefined' ? FinancialEngine.addCents(user.balance, amount) : (parseFloat(user.balance || 0) + amount).toFixed(2);

    // Record in Admin Transactions Audit Trail
    AdminDashboard.state.transactions.unshift({
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      email: user.email,
      amount: `${symbol}${amount.toFixed(2)}`,
      method: gateway,
      date: new Date().toLocaleString()
    });

    App.showToast(`🎉 Payment of ${symbol}${amount} via ${gateway} successful! Balance updated.`);
    this.switchTab('overview');
  },

  openNewTicketModal() {
    App.openModal(`
      <h2 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">Open Support <span class="text-gradient">Ticket</span></h2>
      <div class="form-group"><label>Subject / Issue Title *</label><input type="text" id="tck-sub" class="form-control" placeholder="e.g. Question regarding Order #ORD-10842"></div>
      <div class="form-group">
        <label>Priority Level *</label>
        <select id="tck-prio" class="form-control">
          <option value="Low">Low</option>
          <option value="Medium" selected>Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>
      <div class="form-group"><label>Message Details *</label><textarea id="tck-msg" class="form-control" style="min-height: 100px;" placeholder="Describe your issue or question..."></textarea></div>
      <button class="btn-teal" style="width: 100%; margin-top: 1rem;" onclick="UserDashboard.submitNewTicket()">🚀 Submit Ticket to Admin</button>
    `);
  },

  submitNewTicket() {
    const sub = document.getElementById('tck-sub')?.value?.trim();
    const prio = document.getElementById('tck-prio')?.value || 'Medium';

    if (!sub) {
      App.showToast('Please enter a ticket subject.', 'error');
      return;
    }

    const newTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      subject: sub,
      priority: prio,
      status: 'Open',
      date: new Date().toLocaleString()
    };

    this.state.tickets.unshift(newTicket);
    AdminDashboard.state.ticketsCount = (AdminDashboard.state.ticketsCount || 0) + 1;

    App.closeModal();
    App.showToast(`Ticket #${newTicket.id} created! Admin notified.`);
    this.switchTab('tickets');
  },

  regenerateApiKey() {
    const user = this.state.currentUser;
    user.apiKey = `sk_live_spec_${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
    App.showToast('Generated new Developer API Key!');
    this.renderUserDashboard();
  },

  filterClientServicesView(searchQuery = '', selectedCat = 'ALL') {
    const q = (searchQuery || '').toLowerCase().trim();
    const blocks = document.querySelectorAll('.usr-category-block');

    blocks.forEach(block => {
      const catName = block.getAttribute('data-category');
      const rows = block.querySelectorAll('.usr-svc-row');
      let visibleRowsInBlock = 0;

      rows.forEach(row => {
        const name = (row.getAttribute('data-name') || '').toLowerCase();
        const matchesCategory = (selectedCat === 'ALL' || catName === selectedCat);
        const matchesQuery = (!q || name.includes(q) || catName.toLowerCase().includes(q));

        if (matchesCategory && matchesQuery) {
          row.style.display = '';
          visibleRowsInBlock++;
        } else {
          row.style.display = 'none';
        }
      });

      if (visibleRowsInBlock > 0) {
        block.style.display = '';
      } else {
        block.style.display = 'none';
      }
    });
  },

  selectServiceForOrder(serviceId, catName) {
    this.state.orderForm.selectedCategory = catName;
    this.state.orderForm.selectedServiceId = serviceId;
    App.showToast(`Selected Package #${serviceId}! Redirecting to Order form...`);
    this.switchTab('new-order');
  },

  submitSiteAuditRequest() {
    const user = this.state.currentUser || { username: 'client', email: 'client@domain.com' };
    const urlInput = document.getElementById('usr-audit-website-url');
    if (!urlInput) return;
    
    let url = urlInput.value.trim();
    if (!url) {
      if (typeof App !== 'undefined' && App.showToast) App.showToast('Please enter a target website URL.', 'error');
      alert('Please enter a target website URL (e.g. https://yourdomain.com)');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Generate Unique Audit ID
    const auditId = `AUD-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toLocaleString();

    const defaultReportData = {
      executiveSummary: `Technical diagnostic scan initialized for ${url}. Site structure, Core Web Vitals, and backlink authority check pending manual verification.`,
      overallHealthScore: "85",
      organicVisibility: "72%",
      estimatedTraffic: "38,400",
      indexedPages: "850",
      rankingKeywords: "2,910",
      referringDomains: "340",
      backlinkProfile: "Clean High-DA Contextual Backlinks",
      technicalHealth: "86/100 Optimal",
      onPageHealth: "90/100 Pass",
      contentQuality: "High Quality Original Content",
      localSeoStatus: "GBP Optimized",
      coreWebVitals: "Pass (LCP 1.9s, CLS 0.04)",
      mainOpportunities: "Scale long-tail transactional keyword landing pages",
      criticalProblems: "Minor 404 broken links & missing meta descriptions",
      overallRecommendation: "Fix broken redirect links and launch high-DR outreach campaign",
      perfScore: "67",
      a11yScore: "82",
      bpScore: "96",
      seoScore: "83",
      fcp: "0.9 s",
      tbt: "90 ms",
      si: "2.1 s",
      cls: "0.016",
      organicTraffic: "38,400/mo",
      organicKeywords: "2,910",
      topKeywords: "seo audit, digital growth, backlinks",
      topLandingPages: "/services, /blog, /about",
      clicks: "9,850",
      impressions: "142,000",
      ctr: "6.93%",
      avgPosition: "9.2",
      indexedPagesTech: "850",
      nonIndexedPages: "24",
      backlinks: "11,200",
      referringDomainsCount: "340",
      domainAuthority: "DR 62 / DA 58",
      organicConversions: "280 leads/mo",
      revenueOrganic: "$34,200/mo",
      robotsTxt: "Valid robots.txt file",
      xmlSitemap: "Valid XML sitemap detected",
      sitemapIndex: "sitemap_index.xml active",
      crawlErrors: "0 critical crawl errors",
      brokenInternalLinks: "2 internal broken links",
      orphanPages: "0 orphan pages",
      crawlDepth: "Max crawl depth: 3 clicks",
      redirectChains: "0 redirect chains",
      redirectLoops: "0 redirect loops",
      "404Pages": "2 pages returning 404",
      "5xxErrors": "0 server errors",
      mobileResponsiveness: "100% Mobile Responsive",
      textReadability: "Optimal Flesch-Kincaid Score",
      buttonSpacing: "Touch target spacing compliant",
      navigation: "Structured menu navigation",
      mobileMenu: "Hamburger mobile menu active",
      horizontalScrolling: "No horizontal scroll overflow",
      intrusivePopups: "No intrusive popups",
      mobilePageSpeed: "92/100 Mobile Speed",
      contentParity: "100% Desktop/Mobile content parity",
      images: "WebP compressed with alt attributes",
      forms: "All contact forms accessible",
      ctaUsability: "High contrast CTA buttons"
    };

    const newAudit = {
      id: auditId,
      auditId: auditId,
      username: user.username || user.fullName || 'client',
      email: user.email || 'client@domain.com',
      link: url,
      targetLink: url,
      status: 'Pending',
      createdAt: nowStr,
      isLocked: false,
      report: defaultReportData
    };

    // Load existing audits from localStorage
    let allAudits = [];
    try {
      const saved = localStorage.getItem('seo_site_audits');
      if (saved) allAudits = JSON.parse(saved);
    } catch(e) {}

    allAudits.unshift(newAudit);
    localStorage.setItem('seo_site_audits', JSON.stringify(allAudits));

    // Dispatch automated Email 1 notification
    if (typeof EmailEngine !== 'undefined' && EmailEngine.sendSiteAuditSubmittedEmail) {
      EmailEngine.sendSiteAuditSubmittedEmail(newAudit, user);
    }

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`✅ Audit Request #${auditId} submitted successfully! Your report will be ready within 24 hours.`);
    }

    this.switchTab('audit-history');
  },

  viewAuditReport(auditId) {
    let allAudits = [];
    try {
      const saved = localStorage.getItem('seo_site_audits');
      if (saved) allAudits = JSON.parse(saved);
    } catch(e) {}

    const cleanAuditId = auditId.toString().replace(/^#/, '');

    const audit = allAudits.find(a => {
      if (!a) return false;
      const aId = (a.id || a.auditId || '').toString().replace(/^#/, '');
      return aId === cleanAuditId;
    });

    if (!audit) {
      if (typeof App !== 'undefined' && App.showToast) App.showToast('Audit record not found.', 'error');
      return;
    }

    const status = audit.status || 'Pending';
    const lowerStatus = status.toLowerCase();

    // IF STATUS IS PENDING / PROCESS / INPROGRESS: Render Animated Staff Working Laptop Popup
    if (lowerStatus !== 'complete' && lowerStatus !== 'completed') {
      const pendingModalHtml = `
        <div style="background: linear-gradient(135deg, #1E054A 0%, #5C0E9E 35%, #A52090 65%, #C83090 85%, #6A0E90 100%); padding: 3.5rem 2rem; border-radius: 16px; position: relative; overflow: hidden; text-align: center; box-shadow: 0 20px 50px rgba(92,14,158,0.4);">
          <!-- Decorative Background Elements -->
          <div style="position: absolute; top: -50px; right: -50px; width: 180px; height: 180px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(40px);"></div>
          <div style="position: absolute; bottom: -50px; left: -50px; width: 180px; height: 180px; background: rgba(0,172,193,0.3); border-radius: 50%; filter: blur(40px);"></div>
          
          <div style="display: flex; justify-content: center; gap: 1rem; align-items: center; margin-bottom: 1.5rem; position: relative; z-index: 2;">
            <div style="font-size: 4rem; filter: drop-shadow(0 0 15px rgba(255,255,255,0.3));">👨‍💻</div>
            <div style="font-size: 3.5rem; filter: drop-shadow(0 0 20px rgba(0,172,193,0.6));">💻</div>
            <div style="font-size: 4rem; filter: drop-shadow(0 0 15px rgba(255,255,255,0.3));">👩‍💻</div>
          </div>
          
          <h2 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin-bottom: 0.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.3); position: relative; z-index: 2;">Audit In Progress!</h2>
          
          <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem 1.5rem; border-radius: 30px; display: inline-block; font-size: 0.95rem; color: #E0F2FE; font-weight: 700; margin-bottom: 2.5rem; backdrop-filter: blur(10px); position: relative; z-index: 2;">
            <span style="color: #38BDF8;">Audit ID:</span> <span style="color: #FFF; margin-right: 1.2rem;">#${audit.id}</span> 
            <span style="color: #38BDF8;">Target:</span> <span style="color: #FFF;">${audit.link}</span>
          </div>

          <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 1.8rem; margin-bottom: 2.5rem; backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); position: relative; z-index: 2;">
            <p style="font-size: 1.15rem; color: #FFFFFF; line-height: 1.7; margin: 0; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
              Aapki Audit request par humari expert team kaam kar rahi hai. Bohat jald aapko yahan detailed report show hogi aur email ke zariye bhi update kar diya jayega.
            </p>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; color: #CBD5E1; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 1.5rem; position: relative; z-index: 2;">
            <span style="background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.4); padding: 0.5rem 1.2rem; border-radius: 20px; color: #FCD34D; font-weight: 800; text-transform: uppercase; display: flex; align-items: center;">
              <span style="display:inline-block; width:10px; height:10px; background:#FCD34D; border-radius:50%; margin-right:8px; box-shadow: 0 0 10px #FCD34D;"></span>
              ${status}
            </span>
            <span style="font-weight: 600; background: rgba(255,255,255,0.1); padding: 0.5rem 1.2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15);">
              Est. Completion: <strong style="color: #FFF;">Within 24 Hours</strong>
            </span>
          </div>
        </div>
      `;
      if (typeof App !== 'undefined' && App.openModal) {
        App.openModal(pendingModalHtml);
      }
      return;
    }

    // IF STATUS IS COMPLETE: Switch to full page Audit Report View tab
    if (typeof App !== 'undefined' && App.closeModal) App.closeModal();
    this.state.activeAuditId = auditId;
    this.switchTab('audit-report-view');
  },

  changePassword() {
    const currentPassEl = document.getElementById('usr-current-pass');
    const newPassEl = document.getElementById('usr-new-pass');
    const msgEl = document.getElementById('pass-change-msg');
    
    if (!currentPassEl || !newPassEl || !msgEl) return;
    
    const currentPass = currentPassEl.value;
    const newPass = newPassEl.value;
    
    if (!currentPass || !newPass) {
      msgEl.style.color = '#EF4444';
      msgEl.innerText = 'Please fill out both fields.';
      return;
    }
    
    const user = this.state.currentUser;
    if (!user) return;
    
    // Check if current password matches
    if (user.password !== currentPass) {
      msgEl.style.color = '#EF4444';
      msgEl.innerText = 'Aap current password galt laga rahy hai.'; // Client requested specific feedback
      return;
    }
    
    // Update password
    user.password = newPass;
    
    // Update active user in localStorage
    localStorage.setItem('active_client_user', JSON.stringify(user));
    
    // Update main database if UserAdminEngine is available
    if (typeof UserAdminEngine !== 'undefined') {
      const dbUser = UserAdminEngine.state.users.find(u => u.username === user.username);
      if (dbUser) {
        dbUser.password = newPass;
        UserAdminEngine.saveState();
      } else {
        // Fallback to direct localStorage if not loaded in state
        let users = JSON.parse(localStorage.getItem('seo_users_database') || '[]');
        let fallbackDbUser = users.find(u => u.username === user.username);
        if (fallbackDbUser) {
          fallbackDbUser.password = newPass;
          localStorage.setItem('seo_users_database', JSON.stringify(users));
        }
      }
    } else {
      let users = JSON.parse(localStorage.getItem('seo_users_database') || '[]');
      let fallbackDbUser = users.find(u => u.username === user.username);
      if (fallbackDbUser) {
        fallbackDbUser.password = newPass;
        localStorage.setItem('seo_users_database', JSON.stringify(users));
      }
    }
    
    msgEl.style.color = '#10B981';
    msgEl.innerText = 'Password updated successfully!';
    currentPassEl.value = '';
    newPassEl.value = '';
  },
  viewServiceDescription(serviceId) {
    const service = (this.state.servicesList || []).find(s => String(s.id) === String(serviceId));
    if (!service) {
      App.showToast('Service not found.');
      return;
    }
    
    const descHtml = `
      <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%; position: relative; margin: 10vh auto;">
        <h3 style="margin-top: 0; color: #0F172A; font-weight: 800; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.8rem; margin-bottom: 1.2rem;">
          ${service.name}
        </h3>
        <div style="font-size: 0.95rem; color: #475569; line-height: 1.6;">
          ${service.description || 'No description available for this service package.'}
        </div>
        <div style="margin-top: 1.5rem; text-align: right;">
          <button class="btn-teal" style="padding: 0.5rem 1rem;" onclick="App.closeModal()">Close</button>
        </div>
      </div>
    `;
    App.showModal(descHtml);
  },

  viewOrderDetails(orderId, type) {
    const allOrders = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && Array.isArray(AdminDashboard.state.orders)) ? AdminDashboard.state.orders : (JSON.parse(localStorage.getItem('seo_admin_orders') || '[]'));
    const order = allOrders.find(o => String(o.id).replace(/^(ORD-|#)/, '') === String(orderId).replace(/^(ORD-|#)/, ''));
    if (!order) {
      App.showToast('⚠️ Could not load order details.', 'error');
      return;
    }
    
    if (type === 'link') {
      const sLinkDisp = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(order.targetLink || 'No links provided.') : (order.targetLink || 'No links provided.');
      App.openModal(`
        <div style="padding: 1rem;">
          <h2 style="color: #0F172A; font-weight: 800; font-size: 1.2rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">🔗 Order Links</h2>
          <div style="background: #F8FAFC; border: 1px solid #CBD5E1; padding: 1rem; border-radius: 6px; font-size: 0.9rem; color: #334155; line-height: 1.6; white-space: pre-wrap; word-break: break-all; max-height: 300px; overflow-y: auto;">
            ${sLinkDisp}
          </div>
          <button class="btn-outline" style="width: 100%; margin-top: 1rem; padding: 0.75rem;" onclick="App.closeModal()">Close</button>
        </div>
      `);
    } else if (type === 'keywords') {
      const sKwDisp = typeof SecurityEngine !== 'undefined' ? SecurityEngine.sanitizeHTML(order.keywords || 'No keywords provided.') : (order.keywords || 'No keywords provided.');
      App.openModal(`
        <div style="padding: 1rem;">
          <h2 style="color: #0F172A; font-weight: 800; font-size: 1.2rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">🔑 Target Keywords</h2>
          <div style="background: #FFFBEB; border: 1px solid #FDE68A; padding: 1rem; border-radius: 6px; font-size: 0.9rem; color: #92400E; line-height: 1.6; white-space: pre-wrap; word-break: break-all; max-height: 300px; overflow-y: auto;">
            ${sKwDisp}
          </div>
          <button class="btn-outline" style="width: 100%; margin-top: 1rem; padding: 0.75rem;" onclick="App.closeModal()">Close</button>
        </div>
      `);
    }
  }
};

window.UserDashboard = UserDashboard;

