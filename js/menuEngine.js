/* ==========================================================================
   DYNAMIC MENU & AUTOMATED ROUTE ENGINE (js/menuEngine.js)
   - Expanded Schema: Link Type, Open In, Visibility, Status, Meta Tags, Order Index
   - Real-Time Live Sync Event Broadcaster (App.broadcastMenuUpdate())
   - Drag & Drop & Up/Down Reordering System
   ========================================================================== */

const MenuEngine = {
  baseUrl: window.location.origin || 'https://admin.hqrentalpanel.com',
  filterState: 'All', // 'All', 'Logged-in', 'Logged-out'

  state: {
    menuItems: [
      { id: 1, name: 'Affiliate', icon: '🔔', slug: '/affiliate', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 1, metaTitle: 'Affiliate Program | Spectrum SEO', metaDescription: 'Join our high-paying SEO affiliate program.', metaKeywords: 'affiliate, seo agency, commission' },
      { id: 2, name: 'New Order', icon: '🛒', slug: '/new_order', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 2, metaTitle: 'Place New SEO Order | Client Portal', metaDescription: 'Select and order technical SEO & backlink campaigns.', metaKeywords: 'new order, seo packages' },
      { id: 3, name: 'Orders', icon: '📦', slug: '/orders', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 3, metaTitle: 'My SEO Orders | Client Portal', metaDescription: 'Track active SEO project deliverables and status.', metaKeywords: 'my orders, seo tracking' },
      { id: 4, name: 'Login', icon: '🔑', slug: '/login', linkType: 'Internal', openIn: 'Same tab', visibility: 'Logged out', status: 'Active', active: true, isExternal: false, orderIndex: 4, metaTitle: 'Client Login | Spectrum SEO', metaDescription: 'Log in to your SEO agency client account.', metaKeywords: 'login, client portal' },
      { id: 5, name: 'Services', icon: '≡', slug: '/services', linkType: 'Internal', openIn: 'Same tab', visibility: 'All', status: 'Active', active: true, isExternal: false, orderIndex: 5, metaTitle: 'SEO Services & Pricing Catalog', metaDescription: 'Explore our data-driven organic ranking services.', metaKeywords: 'seo services, link building, technical seo' },
      { id: 6, name: 'API', icon: '🔀', slug: '/api', linkType: 'Internal', openIn: 'Same tab', visibility: 'All', status: 'Active', active: true, isExternal: false, orderIndex: 6, metaTitle: 'API Documentation & Access', metaDescription: 'Integrate SEO audit crawlers with our API.', metaKeywords: 'api, crawlers, integration' },
      { id: 7, name: 'Signup', icon: '⚙️', slug: '/signup', linkType: 'Internal', openIn: 'Same tab', visibility: 'Logged out', status: 'Active', active: true, isExternal: false, orderIndex: 7, metaTitle: 'Create Client Account', metaDescription: 'Sign up for a free SEO agency client account.', metaKeywords: 'register, signup, client account' },
      { id: 8, name: 'Add Funds', icon: '💳', slug: '/add_funds', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 8, metaTitle: 'Deposit Funds | Client Wallet', metaDescription: 'Top up your account balance to order services.', metaKeywords: 'add funds, wallet deposit' },
      { id: 9, name: 'Balance Logs', icon: '📅', slug: '/balance_logs', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 9, metaTitle: 'Account Balance Logs', metaDescription: 'View historical deposit and order charges.', metaKeywords: 'balance logs, invoices' },
      { id: 10, name: 'Mass Order', icon: '👥', slug: '/mass_order', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Disabled', active: false, isExternal: false, orderIndex: 10, metaTitle: 'Mass Order Bulk Importer', metaDescription: 'Import bulk SEO orders via CSV.', metaKeywords: 'mass order, bulk csv' },
      { id: 11, name: 'Subscriptions', icon: '📋', slug: '/subscriptions', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Disabled', active: false, isExternal: false, orderIndex: 11, metaTitle: 'Monthly Retainer Subscriptions', metaDescription: 'Manage recurring monthly SEO retainers.', metaKeywords: 'subscriptions, retainers' },
      { id: 12, name: 'Dripfeed', icon: '💧', slug: '/dripfeed', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Disabled', active: false, isExternal: false, orderIndex: 12, metaTitle: 'Dripfeed Campaign Schedule', metaDescription: 'Schedule automated dripfeed backlinks.', metaKeywords: 'dripfeed, scheduled links' },
      { id: 13, name: 'Reviews', icon: '⭐', slug: '/reviews', linkType: 'Internal', openIn: 'Same tab', visibility: 'All', status: 'Disabled', active: false, isExternal: false, orderIndex: 13, metaTitle: 'Client Testimonials & Case Studies', metaDescription: 'See real organic growth results from our clients.', metaKeywords: 'reviews, testimonials' },
      { id: 14, name: 'Updates', icon: '🔄', slug: '/updates', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Disabled', active: false, isExternal: false, orderIndex: 14, metaTitle: 'System & Ranking Updates', metaDescription: 'View algorithm update notices and system news.', metaKeywords: 'updates, algorithm news' },
      { id: 15, name: 'Terms', icon: 'ℹ️', slug: '/terms', linkType: 'Internal', openIn: 'Same tab', visibility: 'All', status: 'Disabled', active: false, isExternal: false, orderIndex: 15, metaTitle: 'Terms of Service & Privacy Policy', metaDescription: 'Read our legal terms and privacy disclosures.', metaKeywords: 'terms, privacy policy' },
      { id: 16, name: 'Tickets', icon: '🗣️', slug: '/tickets', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Disabled', active: false, isExternal: false, orderIndex: 16, metaTitle: 'Client Support Tickets', metaDescription: 'Create and respond to support tickets.', metaKeywords: 'support, tickets, helpdesk' },
      { id: 17, name: 'Blog', icon: '📝', slug: '/blog', linkType: 'Internal', openIn: 'Same tab', visibility: 'All', status: 'Disabled', active: false, isExternal: false, orderIndex: 17, metaTitle: 'SEO Insights & Growth Blog', metaDescription: 'Actionable guides on search engine optimization.', metaKeywords: 'blog, seo guides' },
      { id: 18, name: 'Child Panel', icon: '🗂️', slug: '/childpanel', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Disabled', active: false, isExternal: false, orderIndex: 18, metaTitle: 'Child Panel Rental', metaDescription: 'Order a standalone child panel website.', metaKeywords: 'child panel, white label' },
      { id: 19, name: 'Contact Us', icon: '📞', slug: '/contact_us', linkType: 'Internal', openIn: 'Same tab', visibility: 'All', status: 'Disabled', active: false, isExternal: false, orderIndex: 19, metaTitle: 'Contact Strategy Team', metaDescription: 'Get in touch with our senior SEO strategists.', metaKeywords: 'contact, strategy call' },
      { id: 20, name: 'Cookie Policy', icon: '🍪', slug: '/cookie-policy', linkType: 'Internal', openIn: 'Same tab', visibility: 'All', status: 'Disabled', active: false, isExternal: false, orderIndex: 20, metaTitle: 'Cookie Policy', metaDescription: 'Details on website cookies and data usage.', metaKeywords: 'cookies, privacy' },
      { id: 21, name: 'FAQs', icon: '❓', slug: '/faq', linkType: 'Internal', openIn: 'Same tab', visibility: 'All', status: 'Disabled', active: false, isExternal: false, orderIndex: 21, metaTitle: 'Frequently Asked Questions', metaDescription: 'Answers to common SEO campaign questions.', metaKeywords: 'faq, questions' },
      { id: 22, name: 'Free Services', icon: '♦️', slug: '/free', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Disabled', active: false, isExternal: false, orderIndex: 22, metaTitle: 'Free SEO Audit Scanner', metaDescription: 'Scan website speed and CWV metrics for free.', metaKeywords: 'free audit, speed tool' },
      { id: 23, name: 'Transfer Balance', icon: '🔄', slug: '/funds_transfer', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Disabled', active: false, isExternal: false, orderIndex: 23, metaTitle: 'Transfer Funds Between Accounts', metaDescription: 'Transfer client wallet balance.', metaKeywords: 'transfer funds' },
      { id: 24, name: 'Account', icon: '👤', slug: '/account', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 24, metaTitle: 'Account Settings & API Keys', metaDescription: 'Manage profile details and security keys.', metaKeywords: 'account, settings, api key' },
      { id: 25, name: 'LogOut', icon: '↪️', slug: '/login/logout', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 25, metaTitle: 'Logged Out', metaDescription: 'Successfully logged out.', metaKeywords: 'logout' },
      { id: 26, name: 'Audit', icon: '🔍', slug: '/audit', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 26, metaTitle: 'SEO Site Audit | Client Portal', metaDescription: 'Free Complete Technical SEO Scan.', metaKeywords: 'seo audit, scan, report' },
      { id: 27, name: 'Audit History', icon: '📊', slug: '/audit-history', linkType: 'Internal', openIn: 'Same tab', visibility: 'Only logged in', status: 'Active', active: true, isExternal: false, orderIndex: 27, metaTitle: 'Audit History | Client Portal', metaDescription: 'View historical SEO audit reports.', metaKeywords: 'audit history, seo reports' }
    ]
  },

  init() {
    this.loadFromStorage();
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('seo_menu_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sync missing phase 4 menus into existing cache
          const defaultAudit = this.state.menuItems.find(m => m.slug === '/audit');
          const defaultAuditHist = this.state.menuItems.find(m => m.slug === '/audit-history');
          if (!parsed.find(m => m.slug === '/audit')) parsed.push(JSON.parse(JSON.stringify(defaultAudit)));
          if (!parsed.find(m => m.slug === '/audit-history')) parsed.push(JSON.parse(JSON.stringify(defaultAuditHist)));

          this.state.menuItems = parsed;
          this.sortItems();
        }
      }
    } catch(e) {
      console.error('Error loading menu items from localStorage:', e);
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem('seo_menu_items', JSON.stringify(this.state.menuItems));
    } catch(e) {
      console.error('Error saving menu items to localStorage:', e);
    }
  },

  // Auto-Generate Full System URL
  getFullUrl(item) {
    if (item.isExternal && item.externalUrl) {
      return item.externalUrl;
    }
    const cleanBase = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const cleanSlug = item.slug.startsWith('/') ? item.slug : `/${item.slug}`;
    return `${cleanBase}${cleanSlug}`;
  },

  // Security Route Guard
  isRouteAllowed(slug) {
    if (!slug) return true;
    const cleanSlug = slug.toLowerCase();
    const item = this.state.menuItems.find(m => 
      m.slug.toLowerCase().includes(cleanSlug) || 
      m.name.toLowerCase().includes(cleanSlug)
    );
    if (!item) return true;
    return item.status === 'Active' && item.active;
  },

  // Dynamic Meta Tag Injection in <head>
  injectMetaTags(pageSlug) {
    if (!pageSlug) return;
    const cleanSlug = pageSlug.toLowerCase();
    const item = this.state.menuItems.find(m => 
      m.slug.toLowerCase().includes(cleanSlug) || 
      m.name.toLowerCase().includes(cleanSlug)
    );
    if (!item) return;

    // Inject Title
    if (item.metaTitle) {
      document.title = item.metaTitle;
    }

    // Inject Description Meta Tag
    if (item.metaDescription) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.name = 'description';
        document.head.appendChild(descMeta);
      }
      descMeta.content = item.metaDescription;
    }

    // Inject Keywords Meta Tag
    if (item.metaKeywords) {
      let kwMeta = document.querySelector('meta[name="keywords"]');
      if (!kwMeta) {
        kwMeta = document.createElement('meta');
        kwMeta.name = 'keywords';
        document.head.appendChild(kwMeta);
      }
      kwMeta.content = item.metaKeywords;
    }
  },

  // Sort items by orderIndex ascending
  sortItems() {
    this.state.menuItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  },

  // Move Item Up by 1 Position
  // Move Item Up by 1 Position
  moveItemUp(id) {
    this.sortItems();
    const idx = this.state.menuItems.findIndex(m => m.id === id);
    if (idx > 0) {
      const tempOrder = this.state.menuItems[idx].orderIndex;
      this.state.menuItems[idx].orderIndex = this.state.menuItems[idx - 1].orderIndex;
      this.state.menuItems[idx - 1].orderIndex = tempOrder;
      
      this.sortItems();
      this.saveToStorage();
      App.showToast(`Moved "${this.state.menuItems[idx - 1].name}" UP!`);

      // BROADCAST REAL-TIME SYNC
      if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
        App.broadcastMenuUpdate();
      }
    }
  },

  // Move Item Down by 1 Position
  moveItemDown(id) {
    this.sortItems();
    const idx = this.state.menuItems.findIndex(m => m.id === id);
    if (idx >= 0 && idx < this.state.menuItems.length - 1) {
      const tempOrder = this.state.menuItems[idx].orderIndex;
      this.state.menuItems[idx].orderIndex = this.state.menuItems[idx + 1].orderIndex;
      this.state.menuItems[idx + 1].orderIndex = tempOrder;
      
      this.sortItems();
      this.saveToStorage();
      App.showToast(`Moved "${this.state.menuItems[idx + 1].name}" DOWN!`);

      // BROADCAST REAL-TIME SYNC
      if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
        App.broadcastMenuUpdate();
      }
    }
  },

  // HTML5 Drag-and-Drop Reorder Handler
  reorderItems(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    this.sortItems();
    
    const [movedItem] = this.state.menuItems.splice(fromIndex, 1);
    this.state.menuItems.splice(toIndex, 0, movedItem);

    // Reassign sequential orderIndex values
    this.state.menuItems.forEach((item, index) => {
      item.orderIndex = index + 1;
    });

    this.saveToStorage();
    App.showToast(`Reordered "${movedItem.name}" to position #${toIndex + 1}!`);

    // BROADCAST REAL-TIME SYNC TO USER & PUBLIC VIEWS
    if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
      App.broadcastMenuUpdate();
    }
  },

  // Toggle Page Enable / Disable Status with INSTANT BROADCAST SYNC
  toggleStatus(id) {
    const item = this.state.menuItems.find(m => m.id === id);
    if (item) {
      const isCurrentlyActive = item.status === 'Active' || item.active;
      item.status = isCurrentlyActive ? 'Disabled' : 'Active';
      item.active = !isCurrentlyActive;
      
      this.saveToStorage();
      const statusText = item.status === 'Active' ? 'ACTIVE & ENABLED' : 'DISABLED';
      App.showToast(`Page "${item.name}" is now ${statusText}`);
      
      // BROADCAST REAL-TIME SYNC TO USER DASHBOARD & PUBLIC NAVBAR INSTANTLY
      if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
        App.broadcastMenuUpdate();
      }
    }
  },

  // Single Item Field Update with INSTANT BROADCAST SYNC
  updateMenuItem(id, updatedFields) {
    const item = this.state.menuItems.find(m => m.id === id);
    if (!item) return { success: false, message: 'Menu item not found.' };

    if (updatedFields.name) item.name = updatedFields.name;
    if (updatedFields.icon) item.icon = updatedFields.icon;
    if (updatedFields.openIn) item.openIn = updatedFields.openIn;
    if (updatedFields.visibility) item.visibility = updatedFields.visibility;
    if (updatedFields.status) {
      item.status = updatedFields.status;
      item.active = (updatedFields.status === 'Active');
    }
    if (updatedFields.metaTitle !== undefined) item.metaTitle = updatedFields.metaTitle;
    if (updatedFields.metaDescription !== undefined) item.metaDescription = updatedFields.metaDescription;
    if (updatedFields.metaKeywords !== undefined) item.metaKeywords = updatedFields.metaKeywords;
    if (updatedFields.externalUrl) item.externalUrl = updatedFields.externalUrl;

    this.saveToStorage();
    App.showToast(`Updated menu settings for "${item.name}"!`);

    // BROADCAST REAL-TIME SYNC
    if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
      App.broadcastMenuUpdate();
    }

    return { success: true, item: item };
  },

  // Set Filter State ('All', 'Logged-in', 'Logged-out')
  setFilter(filter) {
    this.filterState = filter;
    if (typeof ThemeEngine !== 'undefined' && ThemeEngine.renderView) {
      ThemeEngine.renderView();
    }
  },

  // Filter & Sort Items
  getFilteredItems() {
    this.sortItems();
    if (this.filterState === 'Logged-in') {
      return this.state.menuItems.filter(m => m.visibility === 'Only logged in' || m.visibility === 'Logged In' || m.visibility === 'All');
    }
    if (this.filterState === 'Logged-out') {
      return this.state.menuItems.filter(m => m.visibility === 'Logged out' || m.visibility === 'Logged Out' || m.visibility === 'All');
    }
    return this.state.menuItems;
  },

  // Open Edit Menu Modal (Screenshots 1 & 2 Match)
  openEditMenuModal(id) {
    const item = this.state.menuItems.find(m => m.id === id);
    if (!item) return;

    const fullUrl = this.getFullUrl(item);

    App.openModal(`
      <div style="font-family: var(--font-body); padding: 0.2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00ACC1; padding-bottom: 0.6rem; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #00ACC1; font-weight: 700; font-size: 1.15rem;">✏️ Edit (${item.name})</h3>
        </div>

        <!-- Basic Info Box (Screenshot 1 Match) -->
        <div style="background: #FFFFFF; border: 1px solid #00ACC1; border-radius: 8px; overflow: hidden; margin-bottom: 1.2rem;">
          <div style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 0.6rem 1rem; font-weight: 700; font-size: 0.9rem; color: #0F172A;">
            ≡ Basic Info
          </div>

          <div style="padding: 1.2rem;">
            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Link Type</label>
              <span style="background: #00ACC1; color: #FFFFFF; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; display: inline-block;">${item.linkType || (item.isExternal ? 'External' : 'Internal')}</span>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Name</label>
              <input type="text" id="edit-name" class="form-control" value="${item.name}">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">Icon</label>
                <a style="color: #00ACC1; font-size: 0.8rem; font-weight: 700; text-decoration: none; cursor: pointer;" onclick="App.showToast('FontAwesome icon class or Emoji supported e.g. fa-solid fa-tree')">Get icons</a>
              </div>
              <input type="text" id="edit-icon" class="form-control" value="${item.icon}">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">URL (read-only)</label>
              <input type="text" readonly class="form-control" style="background: #F1F5F9; color: #64748B; cursor: not-allowed;" value="${fullUrl}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Open In</label>
                <select id="edit-openin" class="form-control">
                  <option value="Same tab" ${item.openIn === 'Same tab' ? 'selected' : ''}>Same tab</option>
                  <option value="New tab" ${item.openIn === 'New tab' ? 'selected' : ''}>New tab</option>
                </select>
              </div>

              <div class="form-group">
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Visibility</label>
                <select id="edit-vis" class="form-control">
                  <option value="Only logged in" ${item.visibility === 'Only logged in' || item.visibility === 'Logged In' ? 'selected' : ''}>Only logged in</option>
                  <option value="Logged out" ${item.visibility === 'Logged out' || item.visibility === 'Logged Out' ? 'selected' : ''}>Logged out</option>
                  <option value="All" ${item.visibility === 'All' ? 'selected' : ''}>All</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0.5rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Status</label>
              <select id="edit-status" class="form-control">
                <option value="Active" ${item.status === 'Active' || item.active ? 'selected' : ''}>Active</option>
                <option value="Disabled" ${item.status === 'Disabled' || !item.active ? 'selected' : ''}>Disabled</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Collapsible SEO (optional) Accordion (Screenshot 2 Match) -->
        <div style="background: #FFFFFF; border: 1px solid #00ACC1; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
          <div style="background: #F8FAFC; padding: 0.75rem 1rem; font-weight: 700; font-size: 0.9rem; color: #0F172A; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="MenuEngine.toggleSeoAccordion()">
            <span>🔍 SEO (optional)</span>
            <span id="seo-accordion-arrow">▲</span>
          </div>

          <div id="seo-accordion-content" style="padding: 1.2rem;">
            <div class="form-group" style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                <label style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">Meta Title</label>
                <span style="font-size: 0.75rem; color: #94A3B8;" id="cnt-title">${(item.metaTitle || '').length}/120</span>
              </div>
              <input type="text" id="edit-metatitle" class="form-control" maxlength="120" value="${item.metaTitle || ''}" oninput="MenuEngine.updateSeoCounters()">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                <label style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">Meta Description</label>
                <span style="font-size: 0.75rem; color: #94A3B8;" id="cnt-desc">${(item.metaDescription || '').length}/500</span>
              </div>
              <textarea id="edit-metadesc" class="form-control" rows="3" maxlength="500" oninput="MenuEngine.updateSeoCounters()">${item.metaDescription || ''}</textarea>
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                <label style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">Meta Keywords <span style="color:#64748B; font-weight: normal;">(comma separated)</span></label>
                <span style="font-size: 0.75rem; color: #94A3B8;" id="cnt-kw">Keywords: ${item.metaKeywords ? item.metaKeywords.split(',').filter(k => k.trim()).length : 0}</span>
              </div>
              <textarea id="edit-metakw" class="form-control" rows="2" placeholder="seo agency, backlinks, ranking" oninput="MenuEngine.updateSeoCounters()">${item.metaKeywords || ''}</textarea>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn-teal" style="background: #00ACC1; color: #FFFFFF; font-weight: 700; border: none; padding: 0.75rem; border-radius: 6px; flex: 1; cursor: pointer;" onclick="MenuEngine.submitEditMenu(${item.id})">
            Submit
          </button>
          <button style="background: #EF4444; color: #FFFFFF; font-weight: 700; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;" onclick="App.closeModal()">
            Cancel
          </button>
        </div>
      </div>
    `);
  },

  toggleSeoAccordion() {
    const content = document.getElementById('seo-accordion-content');
    const arrow = document.getElementById('seo-accordion-arrow');
    if (!content || !arrow) return;
    if (content.style.display === 'none') {
      content.style.display = 'block';
      arrow.innerText = '▲';
    } else {
      content.style.display = 'none';
      arrow.innerText = '▼';
    }
  },

  updateSeoCounters() {
    const titleVal = document.getElementById('edit-metatitle')?.value || '';
    const descVal = document.getElementById('edit-metadesc')?.value || '';
    const kwVal = document.getElementById('edit-metakw')?.value || '';

    const titleCnt = document.getElementById('cnt-title');
    const descCnt = document.getElementById('cnt-desc');
    const kwCnt = document.getElementById('cnt-kw');

    if (titleCnt) titleCnt.innerText = `${titleVal.length}/120`;
    if (descCnt) descCnt.innerText = `${descVal.length}/500`;
    if (kwCnt) {
      const numKw = kwVal.split(',').filter(k => k.trim().length > 0).length;
      kwCnt.innerText = `Keywords: ${numKw}`;
    }
  },

  submitEditMenu(id) {
    const name = document.getElementById('edit-name')?.value?.trim();
    const icon = document.getElementById('edit-icon')?.value?.trim();
    const openIn = document.getElementById('edit-openin')?.value;
    const visibility = document.getElementById('edit-vis')?.value;
    const status = document.getElementById('edit-status')?.value;
    const metaTitle = document.getElementById('edit-metatitle')?.value?.trim();
    const metaDescription = document.getElementById('edit-metadesc')?.value?.trim();
    const metaKeywords = document.getElementById('edit-metakw')?.value?.trim();

    if (!name) {
      App.showToast('Please enter Page Name.', 'error');
      return;
    }

    this.updateMenuItem(id, {
      name,
      icon,
      openIn,
      visibility,
      status,
      metaTitle,
      metaDescription,
      metaKeywords
    });

    App.closeModal();
  },

  // Open Add External Link Modal (Screenshot 3 Match)
  openAddExternalLinkModal() {
    App.openModal(`
      <div style="font-family: var(--font-body); padding: 0.2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00ACC1; padding-bottom: 0.6rem; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #00ACC1; font-weight: 700; font-size: 1.15rem;">➕ Add External Link</h3>
        </div>

        <!-- Basic Info Box (Screenshot 3 Match) -->
        <div style="background: #FFFFFF; border: 1px solid #00ACC1; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
          <div style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 0.6rem 1rem; font-weight: 700; font-size: 0.9rem; color: #0F172A;">
            ≡ Basic Info
          </div>

          <div style="padding: 1.2rem;">
            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Link Type</label>
              <span style="background: #3B82F6; color: #FFFFFF; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; display: inline-block;">External</span>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Name</label>
              <input type="text" id="ext-name" class="form-control" placeholder="e.g. WhatsApp Support">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">Icon</label>
                <a style="color: #00ACC1; font-size: 0.8rem; font-weight: 700; text-decoration: none; cursor: pointer;" onclick="App.showToast('Enter emoji or icon class e.g. fa fa-home')">Get icons</a>
              </div>
              <input type="text" id="ext-icon" class="form-control" placeholder="fa fa-home">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">External URL</label>
              <input type="text" id="ext-url" class="form-control" placeholder="https://example.com">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Open In</label>
                <select id="ext-openin" class="form-control">
                  <option value="Same tab">Same tab</option>
                  <option value="New tab">New tab</option>
                </select>
              </div>

              <div class="form-group">
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Visibility</label>
                <select id="ext-vis" class="form-control">
                  <option value="All">All</option>
                  <option value="Only logged in">Only logged in</option>
                  <option value="Logged out">Logged out</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0.5rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Status</label>
              <select id="ext-status" class="form-control">
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn-teal" style="background: #00ACC1; color: #FFFFFF; font-weight: 700; border: none; padding: 0.75rem; border-radius: 6px; flex: 1; cursor: pointer;" onclick="MenuEngine.submitExternalLink()">
            Submit
          </button>
          <button style="background: #EF4444; color: #FFFFFF; font-weight: 700; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;" onclick="App.closeModal()">
            Cancel
          </button>
        </div>
      </div>
    `);
  },

  submitExternalLink() {
    const name = document.getElementById('ext-name')?.value?.trim();
    const url = document.getElementById('ext-url')?.value?.trim();
    const icon = document.getElementById('ext-icon')?.value?.trim() || '🔗';
    const openIn = document.getElementById('ext-openin')?.value || 'Same tab';
    const visibility = document.getElementById('ext-vis')?.value || 'All';
    const status = document.getElementById('ext-status')?.value || 'Active';

    if (!name || !url) {
      App.showToast('Please fill out Link Name and External URL.', 'error');
      return;
    }

    const nextId = Math.max(...this.state.menuItems.map(m => m.id)) + 1;
    const maxOrder = Math.max(...this.state.menuItems.map(m => m.orderIndex || 0)) + 1;

    const newItem = {
      id: nextId,
      name: name,
      icon: icon,
      slug: url,
      externalUrl: url.includes('http') ? url : `https://${url}`,
      linkType: 'External',
      openIn: openIn,
      visibility: visibility,
      status: status,
      active: status === 'Active',
      isExternal: true,
      orderIndex: maxOrder,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    };

    this.state.menuItems.push(newItem);
    App.closeModal();
    App.showToast(`External link "${name}" added successfully!`);

    // BROADCAST REAL-TIME SYNC
    if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
      App.broadcastMenuUpdate();
    }
  }
};
