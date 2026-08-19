/* ==========================================================================
   PRODUCTION THEME MANAGEMENT & CSS FILE EDITOR (js/themeEditor.js)
   Full Rich CSS for BOTH Public Agency Website & Client User Dashboard Panel
   Admin Dashboard remains 100% untouched & protected.
   ========================================================================== */

const ThemeEngine = {
  state: {
    viewState: 'themes-list',
    subTab: 'menu', // 'default', 'themes', 'menu', 'pages', 'integrations', 'footer'
    activeCssFile: 'theme_style.css',
    activeTab: 'home',
    editorMode: 'code',
    isFullScreen: false,
    autoSaveEnabled: false,
    activeTheme: {
      id: 'theme-spectrum-v2',
      name: 'Spectrum Ultra Glass',
      version: '2.4.0',
      description: 'Production dark glassmorphism theme featuring purple-pink-orange mesh gradients & smooth animations.',
      author: 'Spectrum Agency Core System',
      status: 'Activated',
      cssFiles: {
        'core.css': `/* core.css - User Side & Public Site Base System */\n.public-layout, .user-panel-layout {\n  --user-bg: #0F0A1C;\n  --user-card: rgba(255, 255, 255, 0.04);\n  --user-pink: #DB2777;\n  --user-orange: #F97316;\n  --user-teal: #00BCD4;\n  --user-green: #10B981;\n  background-color: #0F0A1C;\n  color: #F3F4F6;\n  font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;\n  min-height: 100vh;\n}`,
        
        'footer.css': `/* footer.css - Navigation Links & Public Footer */\n.user-nav-link {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  color: #9CA3AF;\n  font-size: 0.88rem;\n  font-weight: 600;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.user-nav-link:hover {\n  background: rgba(255, 255, 255, 0.05);\n  color: #FFFFFF;\n}\n.user-nav-link.active {\n  background: linear-gradient(135deg, #DB2777 0%, #F97316 100%);\n  color: #FFFFFF;\n  font-weight: 700;\n  box-shadow: 0 4px 12px rgba(219, 39, 119, 0.3);\n}\n.public-footer, footer {\n  background: #080511;\n  border-top: 1px solid rgba(255, 255, 255, 0.08);\n  color: #9CA3AF;\n  padding: 3rem 1.5rem;\n  text-align: center;\n}`,
        
        'header.css': `/* header.css - Public Navbar & User Dashboard Header */\n.public-navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.2rem 3rem;\n  background: rgba(15, 10, 28, 0.95);\n  backdrop-filter: blur(12px);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n  position: sticky;\n  top: 0;\n  z-index: 100;\n}\n.public-navbar .brand-logo {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.public-navbar .logo-icon {\n  width: 38px;\n  height: 38px;\n  background: linear-gradient(135deg, #DB2777 0%, #F97316 100%);\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 800;\n  font-size: 1.2rem;\n  color: #FFF;\n}\n.public-navbar .logo-text {\n  font-weight: 800;\n  font-size: 1.3rem;\n  letter-spacing: -0.3px;\n  color: #FFF;\n}\n.nav-links-public {\n  display: flex;\n  gap: 2rem;\n  list-style: none;\n}\n.nav-links-public a {\n  color: #9CA3AF;\n  text-decoration: none;\n  font-weight: 600;\n  font-size: 0.92rem;\n  transition: color 0.2s;\n}\n.nav-links-public a:hover {\n  color: #FFF;\n}\n.user-panel-layout header {\n  background: rgba(18, 13, 28, 0.8);\n  backdrop-filter: blur(12px);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n}`,
        
        'layout.css': `/* layout.css - Hero Section, ROI Calculator & Grid Containers */\n.public-layout .hero-section {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 5rem 1.5rem 4rem 1.5rem;\n  text-align: center;\n}\n.public-layout .hero-title {\n  font-size: 3.5rem;\n  font-weight: 800;\n  line-height: 1.15;\n  letter-spacing: -1px;\n  margin: 1.5rem 0 1rem 0;\n  color: #FFF;\n}\n.public-layout .hero-subtitle {\n  font-size: 1.15rem;\n  color: #9CA3AF;\n  max-width: 720px;\n  margin: 0 auto 2.5rem auto;\n  line-height: 1.6;\n}\n.public-layout .hero-audit-form {\n  display: flex;\n  gap: 0.75rem;\n  max-width: 650px;\n  margin: 0 auto;\n  background: rgba(255, 255, 255, 0.04);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  padding: 0.5rem;\n  border-radius: 12px;\n}\n.public-layout .hero-audit-form input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  outline: none;\n  color: #FFF;\n  padding: 0.75rem 1rem;\n  font-size: 0.95rem;\n}\n.roi-calculator-section {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 4rem 1.5rem;\n}\n.calculator-card {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 3rem;\n  align-items: center;\n}`,
        
        'theme_style.css': `/* theme_style.css - Glass Cards, Gradient Buttons & Badges */\n.public-layout .glass-card, .user-stat-card {\n  background: rgba(255, 255, 255, 0.03) !important;\n  backdrop-filter: blur(16px) !important;\n  border: 1px solid rgba(255, 255, 255, 0.08) !important;\n  border-radius: 16px !important;\n  padding: 2rem !important;\n}\n.public-layout .text-gradient {\n  background: linear-gradient(135deg, #DB2777 0%, #F97316 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n.public-layout .btn-gradient {\n  background: linear-gradient(135deg, #DB2777 0%, #F97316 100%);\n  color: #FFFFFF !important;\n  font-weight: 800 !important;\n  border-radius: 8px !important;\n  padding: 0.75rem 1.6rem !important;\n  border: none !important;\n  cursor: pointer !important;\n  box-shadow: 0 4px 15px rgba(219, 39, 119, 0.35);\n}\n.hero-tag {\n  display: inline-block;\n  background: rgba(219, 39, 119, 0.15);\n  border: 1px solid #DB2777;\n  color: #F472B6;\n  padding: 0.4rem 1.1rem;\n  border-radius: 20px;\n  font-size: 0.85rem;\n  font-weight: 700;\n}`
      },
      pages: {
        home: {
          name: 'Home Page',
          code: `<!-- SPECTRUM SEO AGENCY HOME PAGE -->\n<section class="hero-section">\n  <div class="hero-tag">✨ Ranked #1 SEO & Organic Growth Agency</div>\n</section>`,
          seo: { title: 'Spectrum SEO | Enterprise Organic Growth Agency' }
        }
      },
      backups: [
        { id: 'BAK-1001', timestamp: '2026-07-30T22:10:00Z', author: 'Sarah Jenkins', pageName: 'core.css', codeSnippet: 'Initial core.css backup snapshot.' }
      ],
      assets: [
        { id: 'AST-1', name: 'logo-gradient.svg', type: 'Image', url: 'css/logo-gradient.svg', size: '24 KB' }
      ]
    }
  },

  init() {
    this.applyCompiledCss();
  },

  applyCompiledCss() {
    let combinedCss = '';
    const files = this.state.activeTheme.cssFiles;

    ['core.css', 'header.css', 'footer.css', 'layout.css', 'theme_style.css'].forEach(fn => {
      if (files[fn]) {
        combinedCss += `\n/* --- User Side: ${fn} --- */\n` + files[fn] + '\n';
      }
    });

    let styleTag = document.getElementById('user-side-compiled-theme-css');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'user-side-compiled-theme-css';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = combinedCss;
  },

  switchSubTab(subTabName) {
    this.state.subTab = subTabName;
    localStorage.setItem('appearance_sub_tab', subTabName);
    this.renderView();
  },

  renderView() {
    const container = document.getElementById('admin-main-view');
    if (!container) return;

    if (this.state.viewState === 'themes-list') {
      container.innerHTML = this.renderThemesLayoutView();
    } else if (this.state.viewState === 'css-files-list') {
      container.innerHTML = this.renderCssFilesListView();
    } else if (this.state.viewState === 'code-editor') {
      container.innerHTML = this.renderCodeEditorView();
    }
  },

  renderThemesLayoutView() {
    return `
      <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
        <!-- Left Sub-Sidebar (Exact Reference Match) -->
        <div style="width: 220px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <div style="display: flex; flex-direction: column;">
            <a class="appearance-sub-link ${this.state.subTab === 'default' ? 'active' : ''}" onclick="ThemeEngine.switchSubTab('default')">Default</a>
            <a class="appearance-sub-link ${this.state.subTab === 'themes' ? 'active' : ''}" onclick="ThemeEngine.switchSubTab('themes')">Themes</a>
            <a class="appearance-sub-link ${this.state.subTab === 'menu' ? 'active' : ''}" onclick="ThemeEngine.switchSubTab('menu')">Menu</a>
            <a class="appearance-sub-link ${this.state.subTab === 'pages-code' ? 'active' : ''}" onclick="ThemeEngine.switchSubTab('pages-code')">All Menu Pages Code</a>
            <a class="appearance-sub-link ${this.state.subTab === 'pages' ? 'active' : ''}" onclick="ThemeEngine.switchSubTab('pages')">Pages Text & Notes</a>
            <a class="appearance-sub-link ${this.state.subTab === 'integrations' ? 'active' : ''}" onclick="ThemeEngine.switchSubTab('integrations')">integrations</a>
            <a class="appearance-sub-link ${this.state.subTab === 'footer' ? 'active' : ''}" onclick="ThemeEngine.switchSubTab('footer')">Footer</a>
          </div>

          <!-- Shortcuts to View Public Site & Client Portal -->
          <div style="padding: 0.85rem; border-top: 1px solid #E2E8F0; background: #F8FAFC; display: flex; flex-direction: column; gap: 0.5rem;">
            <button type="button" class="btn-outline" style="width: 100%; font-size: 0.78rem; padding: 0.4rem; background: #FFFFFF; color: #0F172A; border: 1px solid #CBD5E1; font-weight: 700; border-radius: 6px; cursor: pointer;" onclick="openPublicSite(event)">
              🌐 View Public Site →
            </button>
            <button type="button" class="btn-teal" style="width: 100%; font-size: 0.78rem; padding: 0.4rem; background: #00ACC1; color: #FFFFFF; font-weight: 800; border: none; border-radius: 6px; cursor: pointer;" onclick="openClientPortal(event)">
              👤 Launch Client Portal →
            </button>
          </div>
        </div>

        <!-- Main Body Area -->
        <div style="flex: 1;">
          ${this.renderSubTabContent()}
        </div>
      </div>
    `;
  },

  renderSubTabContent() {
    if (this.state.subTab === 'menu') {
      return this.renderMenuView();
    }
    if (this.state.subTab === 'pages-code') {
      return this.renderPagesCodeView();
    }
    if (this.state.subTab === 'themes') {
      return this.renderThemesListInner();
    }
    return `
      <div class="data-table-card">
        <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.5rem; text-transform: capitalize;">${this.state.subTab} Configuration</h2>
        <p style="color: #64748B; font-size: 0.9rem;">Manage settings and customizations for ${this.state.subTab}.</p>
      </div>
    `;
  },

  renderPagesCodeView() {
    if (typeof PageTemplateEngine === 'undefined') {
      return `<div class="data-table-card"><p>Loading Page Template Engine...</p></div>`;
    }

    PageTemplateEngine.loadFromStorage();
    const allKeys = Object.keys(PageTemplateEngine.state.templates);
    const activeKey = PageTemplateEngine.state.activeEditingPage || 'landing-page';
    const tmplObj = PageTemplateEngine.state.templates[activeKey] || PageTemplateEngine.defaultTemplates[activeKey];

    const mode = this.state.pageEditorMode || 'code'; // 'code', 'preview'

    const publicKeys = ['landing-page', 'services', 'blog', 'faq', 'terms', 'contact_us', 'cookie-policy'];
    const clientKeys = ['new-order', 'orders', 'add-funds', 'tickets', 'account', 'affiliate', 'balance_logs', 'mass_order', 'subscriptions', 'dripfeed', 'reviews', 'updates', 'childpanel', 'free', 'funds_transfer'];
    const customKeys = allKeys.filter(k => !publicKeys.includes(k) && !clientKeys.includes(k));

    return `
      <div class="data-table-card" style="padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">All Menu Pages <span class="text-gradient">Frontend Code Editor</span></h2>
            <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Customize HTML/CSS templates for all 22+ system pages & Main Landing Page, or create custom pages.</p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <button class="btn-teal" style="background: #00ACC1; color: #FFFFFF; font-weight: 700; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.88rem;" onclick="ThemeEngine.openCreatePageModal()">
              ➕ Add New Custom Page
            </button>

            <select style="background: #FFFFFF; border: 2px solid #00ACC1; color: #0F172A; font-weight: 700; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.88rem; max-width: 260px;" onchange="ThemeEngine.selectPageToEdit(this.value)">
              <optgroup label="🌐 Public Website Pages">
                ${publicKeys.map(k => {
                  const item = PageTemplateEngine.state.templates[k] || PageTemplateEngine.defaultTemplates[k];
                  return `<option value="${k}" ${k === activeKey ? 'selected' : ''}>${item ? item.name : k}</option>`;
                }).join('')}
              </optgroup>

              <optgroup label="👤 Client Dashboard Pages">
                ${clientKeys.map(k => {
                  const item = PageTemplateEngine.state.templates[k] || PageTemplateEngine.defaultTemplates[k];
                  return `<option value="${k}" ${k === activeKey ? 'selected' : ''}>${item ? item.name : k}</option>`;
                }).join('')}
              </optgroup>

              ${customKeys.length > 0 ? `
                <optgroup label="⚡ Custom Created Pages">
                  ${customKeys.map(k => {
                    const item = PageTemplateEngine.state.templates[k];
                    return `<option value="${k}" ${k === activeKey ? 'selected' : ''}>${item ? item.name : k}</option>`;
                  }).join('')}
                </optgroup>
              ` : ''}
            </select>

            <div style="display: flex; background: #E2E8F0; padding: 3px; border-radius: 6px;">
              <button class="btn-filter-pill ${mode === 'code' ? 'active' : ''}" onclick="ThemeEngine.switchPageEditorMode('code')">📄 HTML Code</button>
              <button class="btn-filter-pill ${mode === 'preview' ? 'active' : ''}" onclick="ThemeEngine.switchPageEditorMode('preview')">👁️ Live Preview</button>
            </div>
          </div>
        </div>

        ${mode === 'code' ? `
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.82rem; color: #334155; display: flex; justify-content: space-between; align-items: center;">
            <span><strong>💡 Dynamic Data Variables:</strong> <code>{{user_name}}</code>, <code>{{user_balance}}</code>, <code>{{user_email}}</code>, <code>{{services_table}}</code>, <code>{{orders_table}}</code>, <code>{{tickets_list}}</code>, <code>{{referral_link}}</code></span>
            <span style="color: #00ACC1; font-weight: 700;">Editing: ${tmplObj ? tmplObj.name : activeKey}</span>
          </div>

          <textarea id="page-code-editor-textarea" style="width: 100%; height: 440px; background: #0F172A; color: #38BDF8; font-family: 'Fira Code', monospace, Consolas; font-size: 0.88rem; line-height: 1.5; padding: 1.25rem; border-radius: 8px; border: 1px solid #1E293B; outline: none; margin-bottom: 1.2rem; resize: vertical;" spellcheck="false">${tmplObj ? tmplObj.html : ''}</textarea>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn-teal" style="background: #00ACC1; color: #FFFFFF; font-weight: 700; font-size: 0.95rem; padding: 0.75rem 1.8rem; border-radius: 8px; border: none; cursor: pointer;" onclick="ThemeEngine.savePageCode('${activeKey}')">
              💾 Save Page Template Code
            </button>

            <button style="background: #F1F5F9; color: #EF4444; border: 1px solid #FECACA; font-weight: 700; font-size: 0.85rem; padding: 0.75rem 1.4rem; border-radius: 8px; cursor: pointer;" onclick="ThemeEngine.resetPageCode('${activeKey}')">
              🔄 Reset to Factory Default
            </button>
          </div>
        ` : `
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1.5rem; min-height: 440px;">
            <div style="background: #ECFEFF; border: 1px solid #A5F3FC; padding: 0.6rem 1rem; border-radius: 6px; margin-bottom: 1rem; color: #0891B2; font-size: 0.85rem; font-weight: 700;">
              👁️ Live Real-time Render Preview for Client User View
            </div>
            ${PageTemplateEngine.compileAndRender(activeKey, {
              user_name: 'John Smith (Sample Client)',
              user_email: 'john@example.com',
              user_balance: '₹5,000.00',
              calculated_price: '₹1,500.00',
              referral_link: 'https://spectrumseo.com/ref/john101',
              category_select_dropdown: '<select class="form-control"><option>Technical SEO</option></select>',
              service_select_dropdown: '<select class="form-control"><option>50 High DA Backlinks (₹1500)</option></select>',
              services_table: '<div style="padding:1rem; text-align:center; color:#64748B; background:#F8FAFC; border-radius:8px;">[Sample Services Table Render]</div>',
              orders_table: '<div style="padding:1rem; text-align:center; color:#64748B; background:#F8FAFC; border-radius:8px;">[Sample Orders Table Render]</div>',
              tickets_list: '<div style="padding:1rem; text-align:center; color:#64748B; background:#F8FAFC; border-radius:8px;">[Sample Tickets List Render]</div>'
            })}
          </div>
        `}
      </div>
    `;
  },

  selectPageToEdit(pageKey) {
    if (typeof PageTemplateEngine !== 'undefined') {
      PageTemplateEngine.state.activeEditingPage = pageKey;
    }
    this.renderView();
  },

  switchPageEditorMode(mode) {
    this.state.pageEditorMode = mode;
    this.renderView();
  },

  savePageCode(pageKey) {
    const textarea = document.getElementById('page-code-editor-textarea');
    if (!textarea) return;

    const newHtml = textarea.value;
    if (typeof PageTemplateEngine !== 'undefined') {
      if (!PageTemplateEngine.state.templates[pageKey]) {
        PageTemplateEngine.state.templates[pageKey] = { name: pageKey, html: '' };
      }
      PageTemplateEngine.state.templates[pageKey].html = newHtml;
      PageTemplateEngine.saveToStorage();
      App.showToast(`✅ Saved Template Code for "${pageKey}" successfully!`);
      if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
        App.broadcastMenuUpdate();
      }
    }
  },

  resetPageCode(pageKey) {
    if (confirm(`Are you sure you want to reset "${pageKey}" to factory default code?`)) {
      if (typeof PageTemplateEngine !== 'undefined') {
        PageTemplateEngine.resetTemplate(pageKey);
      }
      this.renderView();
    }
  },

  openCreatePageModal() {
    App.openModal(`
      <div style="font-family: var(--font-body); padding: 0.2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00ACC1; padding-bottom: 0.6rem; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #00ACC1; font-weight: 700; font-size: 1.15rem;">➕ Create New Custom Page</h3>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #00ACC1; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
          <div style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 0.6rem 1rem; font-weight: 700; font-size: 0.9rem; color: #0F172A;">
            ≡ Basic Page Details
          </div>

          <div style="padding: 1.2rem;">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Page Name *</label>
              <input type="text" id="newpage-name" class="form-control" placeholder="e.g. VIP Case Studies">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">URL Slug *</label>
              <input type="text" id="newpage-slug" class="form-control" placeholder="e.g. /vip-case-studies">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Icon Emoji</label>
                <input type="text" id="newpage-icon" class="form-control" placeholder="⭐">
              </div>

              <div class="form-group">
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">Visibility *</label>
                <select id="newpage-vis" class="form-control">
                  <option value="All">All Visitors</option>
                  <option value="Only logged in">Only logged in</option>
                  <option value="Logged out">Logged out</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button class="btn-teal" style="background: #00ACC1; color: #FFFFFF; font-weight: 700; border: none; padding: 0.75rem; border-radius: 6px; flex: 1; cursor: pointer;" onclick="ThemeEngine.submitCreateCustomPage()">
            ➕ Create & Open Code Editor
          </button>
          <button style="background: #EF4444; color: #FFFFFF; font-weight: 700; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;" onclick="App.closeModal()">
            Cancel
          </button>
        </div>
      </div>
    `);
  },

  submitCreateCustomPage() {
    const name = document.getElementById('newpage-name')?.value?.trim();
    const slug = document.getElementById('newpage-slug')?.value?.trim();
    const icon = document.getElementById('newpage-icon')?.value?.trim() || '📄';
    const visibility = document.getElementById('newpage-vis')?.value || 'All';

    if (!name || !slug) {
      App.showToast('Please enter Page Name and URL Slug.', 'error');
      return;
    }

    if (typeof PageTemplateEngine !== 'undefined') {
      const res = PageTemplateEngine.createCustomPage(name, slug, icon, visibility);
      if (res.success) {
        PageTemplateEngine.state.activeEditingPage = res.pageKey;
        App.closeModal();
        this.renderView();
      }
    }
  },

  renderThemesListInner() {
    const theme = this.state.activeTheme;
    return `
      <div class="data-table-card" style="padding: 0; overflow: hidden; margin-bottom: 1.5rem;">
        <table class="custom-table">
          <thead>
            <tr>
              <th style="width: 80px; color: #00ACC1;">No</th>
              <th style="color: #00ACC1;">Theme Name</th>
              <th style="text-align: right; color: #00ACC1; padding-right: 2rem;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: 600;">1</td>
              <td style="font-weight: 700; font-size: 1rem; color: #0F172A;">${theme.name}</td>
              <td style="text-align: right; padding-right: 2rem;">
                <div style="display: inline-flex; gap: 0.5rem; align-items: center;">
                  <span style="background: #10B981; color: #FFFFFF; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 1.1rem; border-radius: 20px;">
                    ✓ ACTIVATED
                  </span>
                  <button class="btn-teal" onclick="ThemeEngine.openCssFilesList()">
                    ✏️ EDIT CSS
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  },

  renderMenuView() {
    const items = typeof MenuEngine !== 'undefined' ? MenuEngine.getFilteredItems() : [];
    const currentFilter = typeof MenuEngine !== 'undefined' ? MenuEngine.filterState : 'All';

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
        <button class="btn-teal" style="background: #00ACC1; color: #FFFFFF; font-weight: 700; border-radius: 4px; border: none; padding: 0.5rem 1.1rem; cursor: pointer; font-size: 0.85rem;" onclick="MenuEngine.openAddExternalLinkModal()">
          + Add New External Link
        </button>

        <div style="display: flex; background: #E2E8F0; padding: 3px; border-radius: 6px;">
          <button class="btn-filter-pill ${currentFilter === 'All' ? 'active' : ''}" onclick="MenuEngine.setFilter('All')">All</button>
          <button class="btn-filter-pill ${currentFilter === 'Logged-in' ? 'active' : ''}" onclick="MenuEngine.setFilter('Logged-in')">Logged-in</button>
          <button class="btn-filter-pill ${currentFilter === 'Logged-out' ? 'active' : ''}" onclick="MenuEngine.setFilter('Logged-out')">Logged-out</button>
        </div>
      </div>

      <div class="data-table-card" style="padding: 0; overflow: hidden; border: 1px solid #E2E8F0; border-radius: 8px;">
        <table class="custom-table">
          <thead>
            <tr>
              <th style="width: 240px; color: #00ACC1;">⋮ Icon/Name</th>
              <th style="color: #00ACC1;">Url</th>
              <th style="width: 130px; color: #00ACC1;">Visibility</th>
              <th style="width: 100px; color: #00ACC1; text-align: center;">Status</th>
              <th style="width: 110px; color: #00ACC1; text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, idx) => `
              <tr draggable="true" ondragstart="ThemeEngine.handleDragStart(event, ${idx})" ondragover="ThemeEngine.handleDragOver(event)" ondrop="ThemeEngine.handleDrop(event, ${idx})" style="cursor: move;">
                <td style="font-weight: 700; color: #0F172A;">
                  <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
                    <span style="color: #94A3B8; font-size: 1.1rem; cursor: grab;" title="Drag to re-order">⋮⋮</span>
                    <div style="display: inline-flex; flex-direction: column; gap: 1px; margin-right: 0.2rem;">
                      <button style="border:none; background:transparent; cursor:pointer; font-size: 0.65rem; color: #64748B; padding:0; line-height: 1;" onclick="MenuEngine.moveItemUp(${item.id})" title="Move Up">▲</button>
                      <button style="border:none; background:transparent; cursor:pointer; font-size: 0.65rem; color: #64748B; padding:0; line-height: 1;" onclick="MenuEngine.moveItemDown(${item.id})" title="Move Down">▼</button>
                    </div>
                    <span>${item.icon}</span> <span>${item.name}</span>
                  </div>
                </td>
                <td style="color: #0284C7; font-size: 0.85rem; font-family: monospace;">
                  ${MenuEngine.getFullUrl(item)}
                </td>
                <td style="color: #334155; font-weight: 600; font-size: 0.85rem;">
                  ${item.visibility}
                </td>
                <td style="text-align: center;">
                  <label class="toggle-switch">
                    <input type="checkbox" ${item.status === 'Active' || item.active ? 'checked' : ''} onchange="MenuEngine.toggleStatus(${item.id})">
                    <span class="toggle-slider"></span>
                  </label>
                </td>
                <td style="text-align: center;">
                  <button class="btn-action-cyan" onclick="MenuEngine.openEditMenuModal(${item.id})">Action</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  handleDragStart(e, idx) {
    e.dataTransfer.setData('text/plain', idx);
  },

  handleDragOver(e) {
    e.preventDefault();
  },

  handleDrop(e, toIdx) {
    e.preventDefault();
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIdx) && typeof MenuEngine !== 'undefined') {
      MenuEngine.reorderItems(fromIdx, toIdx);
    }
  },

  renderCssFilesListView() {
    const theme = this.state.activeTheme;
    const files = Object.keys(theme.cssFiles);

    return `
      <div style="background: #FFE4E6; border: 1px solid #FDA4AF; border-radius: 6px; padding: 0.9rem 1.25rem; margin-bottom: 1.2rem; color: #9F1239; font-size: 0.9rem; line-height: 1.4;">
        <strong>Warning:</strong> If you are <span style="text-decoration: underline;">not</span> a developer or do not have experience with HTML/CSS, please <strong>do not</strong> edit theme files. Incorrect changes may break your panel's layout or functionality. Always take a backup before making any changes.
      </div>

      <div class="data-table-card" style="padding: 0; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 1.5rem; border-bottom: 2px solid #00ACC1;">
          <h2 style="font-size: 1.15rem; font-weight: 700; color: #0097A7; margin: 0;">
            CSS Editor: Spectrum Ultra Glass (User Side Theme)
          </h2>
          <button class="btn-outline" style="padding: 0.3rem 0.8rem; font-size: 0.85rem;" onclick="ThemeEngine.backToThemesList()">
            ← Back
          </button>
        </div>

        <table class="custom-table">
          <thead>
            <tr>
              <th style="color: #0097A7; padding-left: 1.5rem;">File (User Side Target)</th>
              <th style="text-align: right; color: #0097A7; padding-right: 2rem;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${files.map(fileName => `
              <tr>
                <td style="padding-left: 1.5rem;">
                  <span style="background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 4px; padding: 0.25rem 0.6rem; font-family: monospace; font-size: 0.88rem; font-weight: 600; color: #1F2937;">
                    ${fileName}
                  </span>
                </td>
                <td style="text-align: right; padding-right: 2rem;">
                  <button style="background: #00BCD4; color: #FFFFFF; border: none; font-weight: 700; font-size: 0.82rem; padding: 0.35rem 0.95rem; border-radius: 4px; cursor: pointer;" onclick="ThemeEngine.openCodeEditorForFile('${fileName}')">
                    Edit
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderCodeEditorView() {
    const fileName = this.state.activeCssFile;
    const code = this.state.activeTheme.cssFiles[fileName] || '';
    const lines = code.split('\n');
    const lineNumbersHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');

    return `
      <div class="data-table-card" style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <h2 style="font-size: 1.15rem; font-weight: 700; color: #0097A7; margin: 0;">
              User Side CSS: <span style="font-family: monospace; background: #E0F2FE; color: #0369A1; padding: 0.2rem 0.6rem; border-radius: 4px;">${fileName}</span>
            </h2>
            <span style="font-size: 0.82rem; color: #6B7280;">(${lines.length} Lines)</span>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-outline" style="padding: 0.35rem 0.8rem; font-size: 0.82rem;" onclick="ThemeEngine.backToCssFilesList()">← Back to Files</button>
            <button class="btn-teal" style="padding: 0.35rem 0.9rem; font-size: 0.82rem;" onclick="ThemeEngine.saveCssFileDraft()">💾 Save CSS</button>
          </div>
        </div>

        <div style="display: flex; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 6px; overflow: hidden; min-height: 480px;">
          <div id="editor-line-numbers" style="background: #F1F5F9; padding: 1rem 0.6rem; color: #64748B; font-family: monospace; font-size: 0.88rem; line-height: 1.5; text-align: right; user-select: none; border-right: 1px solid #CBD5E1;">
            ${lineNumbersHTML}
          </div>

          <div style="flex: 1;">
            <textarea id="theme-css-editor" style="width: 100%; height: 100%; min-height: 480px; background: #FFFFFF; color: #0F172A; border: none; outline: none; padding: 1rem; font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.92rem; font-weight: 600; line-height: 1.5; resize: vertical;" oninput="ThemeEngine.handleCssInput(this.value)">${code}</textarea>
          </div>
        </div>
      </div>
    `;
  },

  openCssFilesList() {
    this.state.viewState = 'css-files-list';
    this.renderView();
  },

  backToThemesList() {
    this.state.viewState = 'themes-list';
    this.renderView();
  },

  openCodeEditorForFile(fileName) {
    this.state.activeCssFile = fileName;
    this.state.viewState = 'code-editor';
    this.renderView();
  },

  backToCssFilesList() {
    this.state.viewState = 'css-files-list';
    this.renderView();
  },

  handleCssInput(newCode) {
    const fileName = this.state.activeCssFile;
    this.state.activeTheme.cssFiles[fileName] = newCode;

    const lineNumbers = document.getElementById('editor-line-numbers');
    if (lineNumbers) {
      const lineCount = newCode.split('\n').length;
      lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => `<div>${i + 1}</div>`).join('');
    }
  },

  saveCssFileDraft() {
    const fileName = this.state.activeCssFile;
    const editor = document.getElementById('theme-css-editor');
    const newCode = editor ? editor.value : this.state.activeTheme.cssFiles[fileName];

    this.state.activeTheme.cssFiles[fileName] = newCode;
    this.applyCompiledCss();

    SecurityEngine.logAction('Super Admin', `Updated User-Side CSS File: ${fileName}`);
    App.showToast(`Saved User-Side CSS changes for ${fileName}! Applied live to User Site.`);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ThemeEngine.init();
});
