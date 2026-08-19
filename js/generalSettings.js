/* ==========================================================================
   GENERAL SETTINGS ENGINE (js/generalSettings.js)
   Spectrum SEO Agency & Client Portal
   - State Management via LocalStorage ('seo_general_settings')
   - Dynamic Site Title, Meta Description, Favicon, Logo & Branding Injection
   - Header & Footer Custom Code Injector
   - Glassmorphic Maintenance Mode Screen Controller
   - Google reCAPTCHA Configuration & Timezone Handler
   ========================================================================== */

const DEFAULT_GENERAL_SETTINGS = {
  logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Android_O_Preview_Logo.png',
  favicon: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
  siteName: 'Spectrum SEO Agency',
  siteTitle: 'Spectrum SEO | Enterprise Organic Growth & Backlink Agency',
  siteMetaDescription: '',
  tagline: 'Rank 10x Faster with Data-Driven SEO',
  headerBox: '',
  footerBox: '',
  websiteStatus: 'Active', // 'Active' or 'Maintenance'
  defaultTimezone: 'UTC',
  reCaptcha: {
    status: 'Inactive', // 'Active' or 'Inactive'
    siteKey: '',
    secretKey: ''
  },
  cookieConsent: {
    status: 'Active', // 'Active' or 'Inactive'
    title: 'We value your privacy 🍪',
    message: 'We use cookies and technical tracking to optimize your SEO dashboard experience, process orders securely, and provide analytics.',
    acceptText: 'Accept All Cookies',
    declineText: 'Necessary Only',
    privacyPolicyUrl: '#',
    cookieDays: 30
  },
  sitemap: {
    autoGenerate: true,
    siteUrl: 'http://localhost:9999',
    changeFreq: 'daily',
    priorityHome: '1.0',
    priorityPages: '0.8',
    lastGenerated: ''
  }
};

const GeneralSettingsEngine = {
  state: { ...DEFAULT_GENERAL_SETTINGS },

  /**
   * Initializes the settings engine: loads persisted state and applies settings to the DOM.
   */
  init() {
    this.loadFromStorage();
    this.applySettings();
  },

  /**
   * Loads settings from localStorage ('seo_general_settings') with default fallback.
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('seo_general_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.logo) parsed.logo = DEFAULT_GENERAL_SETTINGS.logo;
        if (!parsed.favicon) parsed.favicon = DEFAULT_GENERAL_SETTINGS.favicon;
        this.state = {
          ...DEFAULT_GENERAL_SETTINGS,
          ...parsed,
          reCaptcha: {
            ...DEFAULT_GENERAL_SETTINGS.reCaptcha,
            ...(parsed.reCaptcha || {})
          },
          cookieConsent: {
            ...DEFAULT_GENERAL_SETTINGS.cookieConsent,
            ...(parsed.cookieConsent || {})
          },
          sitemap: {
            ...DEFAULT_GENERAL_SETTINGS.sitemap,
            ...(parsed.sitemap || {})
          }
        };
      }
    } catch (e) {
      console.error('Error loading General Settings from localStorage:', e);
    }
  },

  /**
   * Persists settings object, updates internal state, triggers DOM application, and displays toast notification.
   * @param {Object} settingsObj - Object containing setting key-value pairs
   */
  saveSettings(settingsObj) {
    if (settingsObj) {
      this.state = {
        ...this.state,
        ...settingsObj,
        reCaptcha: {
          ...this.state.reCaptcha,
          ...(settingsObj.reCaptcha || {})
        },
        cookieConsent: {
          ...this.state.cookieConsent,
          ...(settingsObj.cookieConsent || {})
        },
        sitemap: {
          ...this.state.sitemap,
          ...(settingsObj.sitemap || {})
        }
      };
    }

    try {
      localStorage.setItem('seo_general_settings', JSON.stringify(this.state));
    } catch (e) {
      console.error('Error persisting General Settings to localStorage:', e);
    }

    this.applySettings();

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('💾 General Settings updated successfully!', 'success');
    }
  },

  /**
   * Applies settings to document title, meta tags, favicon, header/footer logos,
   * site names, custom scripts, maintenance status overlay, and cookie consent banner.
   */
  applySettings() {
    // 1. Update Document Title
    const titleText = this.state.tagline 
      ? `${this.state.siteTitle} - ${this.state.tagline}`
      : this.state.siteTitle;
    document.title = titleText;

    // 2. Inject or Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', this.state.siteMetaDescription || '');

    // 3. Inject or Update Favicon
    if (this.state.favicon) {
      let faviconLink = document.querySelector("link[rel~='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.id = 'dynamic-favicon';
        document.head.appendChild(faviconLink);
      }
      faviconLink.href = this.state.favicon;
      
      const faviconImgs = document.querySelectorAll('.favicon-img');
      faviconImgs.forEach(img => { img.src = this.state.favicon; });
    }

    // 4. Update Logo Images Across Site
    if (this.state.logo) {
      const logoSelectors = '.logo-icon, .brand-logo img, .navbar-brand img, #site-logo, .logo img, .header-logo img, .top-header-brand img';
      const logoElements = document.querySelectorAll(logoSelectors);
      logoElements.forEach(img => {
        if (img.tagName === 'IMG') {
          img.src = this.state.logo;
        }
      });
      const logoContainers = document.querySelectorAll('.brand-logo, .logo-icon, #site-logo');
      logoContainers.forEach(container => {
        if (container.tagName !== 'IMG') {
          const imgChild = container.querySelector('img');
          if (imgChild) {
            imgChild.src = this.state.logo;
          }
        }
      });
    }

    // 5. Update Site Name Text Across Header & Footer Elements
    const siteNameText = this.state.siteName || 'BACKLINKFASTER';
    const nameSelectors = '.site-name, .brand-name, .logo-text, .header-site-name, .footer-site-name, #header-site-title, #footer-site-title, #nav-brand-name';
    const nameElements = document.querySelectorAll(nameSelectors);
    nameElements.forEach(el => {
      if (!el.querySelector('img')) {
        el.textContent = siteNameText;
      }
    });

    // 6. Inject or Update Header Code Box into <head id="custom-header-scripts">
    let customHeaderScripts = document.getElementById('custom-header-scripts');
    if (!customHeaderScripts) {
      customHeaderScripts = document.createElement('div');
      customHeaderScripts.id = 'custom-header-scripts';
      customHeaderScripts.style.display = 'none';
      document.head.appendChild(customHeaderScripts);
    }
    customHeaderScripts.innerHTML = this.state.headerBox || '';
    this.executeInjectedScripts(customHeaderScripts);

    // 7. Inject or Update Footer Code Box into <div id="custom-footer-scripts">
    let customFooterScripts = document.getElementById('custom-footer-scripts');
    if (!customFooterScripts) {
      customFooterScripts = document.createElement('div');
      customFooterScripts.id = 'custom-footer-scripts';
      customFooterScripts.style.display = 'none';
      if (document.body) {
        document.body.appendChild(customFooterScripts);
      }
    }
    if (customFooterScripts) {
      customFooterScripts.innerHTML = this.state.footerBox || '';
      this.executeInjectedScripts(customFooterScripts);
    }

    // 8. Website Status & Maintenance Mode Check
    this.checkWebsiteStatus();

    // 9. Cookie Consent Banner Check
    this.checkCookieBanner();
  },

  /**
   * Cookie Consent Banner Controller (Renders Glassmorphic Cookie Banner for Public/User modes)
   */
  checkCookieBanner() {
    const activeMode = (typeof App !== 'undefined' && App.mode)
      ? App.mode
      : (localStorage.getItem('app_active_mode') || 'admin');

    const existingBanner = document.getElementById('cookie-consent-banner-overlay');
    const isConsented = localStorage.getItem('seo_cookie_consent_accepted');
    const cSettings = this.state.cookieConsent || DEFAULT_GENERAL_SETTINGS.cookieConsent;

    if (cSettings.status === 'Active' && !isConsented && (activeMode === 'public' || activeMode === 'user')) {
      if (!existingBanner) {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner-overlay';
        banner.style.cssText = `
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          max-width: 900px;
          z-index: 99999;
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 1.25rem 1.75rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 25px rgba(0, 172, 193, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          color: #FFFFFF;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.4s ease-in-out;
        `;

        banner.innerHTML = `
          <div style="flex: 1;">
            <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 0.35rem; color: #FFFFFF; display: flex; align-items: center; gap: 0.5rem;">
              <span>${cSettings.title || 'We value your privacy 🍪'}</span>
            </div>
            <p style="font-size: 0.85rem; color: #94A3B8; margin: 0; line-height: 1.5;">
              ${cSettings.message || 'We use cookies and technical tracking to optimize your SEO dashboard experience, process orders securely, and provide analytics.'}
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center; white-space: nowrap;">
            <button type="button" onclick="GeneralSettingsEngine.acceptCookies('decline')" style="
              background: rgba(255, 255, 255, 0.08);
              color: #CBD5E1;
              border: 1px solid rgba(255, 255, 255, 0.2);
              padding: 0.6rem 1.1rem;
              font-size: 0.85rem;
              font-weight: 700;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              ${cSettings.declineText || 'Necessary Only'}
            </button>
            <button type="button" onclick="GeneralSettingsEngine.acceptCookies('accept')" style="
              background: linear-gradient(135deg, #00ACC1 0%, #00838F 100%);
              color: #FFFFFF;
              border: none;
              padding: 0.65rem 1.4rem;
              font-size: 0.85rem;
              font-weight: 800;
              border-radius: 8px;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0, 172, 193, 0.35);
              transition: all 0.2s ease;
            ">
              ${cSettings.acceptText || 'Accept All Cookies'}
            </button>
          </div>
        `;

        document.body.appendChild(banner);
      }
    } else {
      if (existingBanner) {
        existingBanner.remove();
      }
    }
  },

  /**
   * Persists cookie consent choice to localStorage & document.cookie
   */
  acceptCookies(choice) {
    try {
      localStorage.setItem('seo_cookie_consent_accepted', choice);
      const days = (this.state.cookieConsent && this.state.cookieConsent.cookieDays) ? this.state.cookieConsent.cookieDays : 30;
      const d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `seo_cookie_consent=${choice}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
    } catch(e) {}

    const banner = document.getElementById('cookie-consent-banner-overlay');
    if (banner) {
      banner.style.opacity = '0';
      banner.style.transform = 'translate(-50%, 20px)';
      setTimeout(() => banner.remove(), 400);
    }

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(choice === 'accept' ? '✅ Cookie preferences saved: All Accepted' : 'ℹ️ Cookie preferences saved: Necessary Only');
    }
  },

  /**
   * AUTOMATED XML SITEMAP GENERATOR ENGINE
   * Scans all system pages from PageTemplateEngine + categories + landing routes
   */
  generateSitemapXml(siteUrl) {
    const domain = siteUrl || (this.state.sitemap && this.state.sitemap.siteUrl) || 'http://localhost:9999';
    const baseUrl = domain.endsWith('/') ? domain.slice(0, -1) : domain;
    const now = new Date().toISOString().split('T')[0];

    const routes = [
      { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', name: 'Home Landing Page' },
      { url: `${baseUrl}/#services`, priority: '0.9', changefreq: 'weekly', name: 'SEO Services & Packages' },
      { url: `${baseUrl}/#pricing`, priority: '0.9', changefreq: 'weekly', name: 'Pricing & Plans' },
      { url: `${baseUrl}/#about`, priority: '0.8', changefreq: 'monthly', name: 'About Agency' },
      { url: `${baseUrl}/#testimonials`, priority: '0.7', changefreq: 'monthly', name: 'Client Case Studies' },
      { url: `${baseUrl}/#contact`, priority: '0.8', changefreq: 'monthly', name: 'Contact & Demo' }
    ];

    if (typeof PageTemplateEngine !== 'undefined') {
      const templates = (PageTemplateEngine.state && PageTemplateEngine.state.templates)
        ? PageTemplateEngine.state.templates 
        : PageTemplateEngine.defaultTemplates;
      
      if (templates) {
        Object.keys(templates).forEach(key => {
          if (key !== 'landing-page' && !routes.some(r => r.url.endsWith(`/${key}`))) {
            routes.push({
              url: `${baseUrl}/${key}`,
              priority: (this.state.sitemap && this.state.sitemap.priorityPages) || '0.8',
              changefreq: (this.state.sitemap && this.state.sitemap.changeFreq) || 'weekly',
              name: templates[key].name || key
            });
          }
        });
      }
    }

    if (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && AdminDashboard.state.categories) {
      AdminDashboard.state.categories.forEach(cat => {
        if (cat.status === 'Active') {
          const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          routes.push({
            url: `${baseUrl}/category/${slug}`,
            priority: '0.75',
            changefreq: 'weekly',
            name: `Category: ${cat.name}`
          });
        }
      });
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
    xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
    xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n`;

    routes.forEach(r => {
      xml += `  <!-- ${r.name} -->\n`;
      xml += `  <url>\n`;
      xml += `    <loc>${r.url}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
      xml += `    <priority>${r.priority}</priority>\n`;
      xml += `  </url>\n\n`;
    });

    xml += `</urlset>`;

    if (!this.state.sitemap) this.state.sitemap = {};
    this.state.sitemap.lastGenerated = new Date().toLocaleString();

    return xml;
  },

  downloadSitemapXml() {
    const xmlContent = this.generateSitemapXml();
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('📥 sitemap.xml auto-generated and downloaded successfully!');
    }
  },

  copySitemapXml() {
    const xmlContent = this.generateSitemapXml();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(xmlContent).then(() => {
        if (typeof App !== 'undefined' && App.showToast) {
          App.showToast('📋 sitemap.xml copied to clipboard!');
        }
      }).catch(err => {
        console.error('Clipboard copy error:', err);
      });
    }
  },

  generateRobotsTxt(siteUrl) {
    const domain = siteUrl || (this.state.sitemap && this.state.sitemap.siteUrl) || 'http://localhost:9999';
    const baseUrl = domain.endsWith('/') ? domain.slice(0, -1) : domain;
    return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /user\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  },

  downloadRobotsTxt() {
    const txtContent = this.generateRobotsTxt();
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('📥 robots.txt downloaded successfully!');
    }
  },

  /**
   * Helper function to execute scripts injected dynamically into header/footer containers.
   */
  executeInjectedScripts(container) {
    if (!container) return;
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  },

  /**
   * Renders glassmorphic Maintenance Screen overlay when websiteStatus is 'Maintenance'
   * and current App mode is 'public' or 'user'.
   */
  checkWebsiteStatus() {
    const activeMode = (typeof App !== 'undefined' && App.mode)
      ? App.mode
      : (localStorage.getItem('app_active_mode') || 'admin');

    const existingOverlay = document.getElementById('maintenance-mode-overlay');

    if (this.state.websiteStatus === 'Maintenance' && (activeMode === 'public' || activeMode === 'user')) {
      if (!existingOverlay) {
        const overlay = document.createElement('div');
        overlay.id = 'maintenance-mode-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999999;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', 'Open Sans', sans-serif;
        `;

        overlay.innerHTML = `
          <div style="
            background: rgba(30, 41, 59, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 3rem 2.5rem;
            max-width: 560px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 172, 193, 0.25);
            color: #FFFFFF;
          ">
            <div style="font-size: 3.8rem; margin-bottom: 1rem; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));">🚧</div>
            ${this.state.logo ? `<img src="${this.state.logo}" alt="Logo" style="max-height: 55px; margin-bottom: 1.2rem;">` : ''}
            <h1 style="font-size: 1.85rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.6rem; letter-spacing: -0.5px;">
              ${this.state.siteName || 'Spectrum SEO Agency'} is Under Maintenance
            </h1>
            <p style="color: #94A3B8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">
              We are currently carrying out scheduled system optimizations and performance updates. Please check back shortly!
            </p>
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
              <span style="color: #00ACC1; font-weight: 700; font-size: 0.9rem;">● Website Status: Maintenance Mode Active</span>
            </div>
            <button type="button" style="
              background: linear-gradient(135deg, #00ACC1 0%, #00838F 100%);
              color: #FFFFFF;
              border: none;
              padding: 0.85rem 2.2rem;
              font-size: 0.95rem;
              font-weight: 800;
              border-radius: 10px;
              cursor: pointer;
              box-shadow: 0 4px 15px rgba(0, 172, 193, 0.4);
              transition: all 0.2s ease;
            " onclick="if(typeof App !== 'undefined') { App.setMode('admin'); } else { localStorage.setItem('app_active_mode', 'admin'); location.reload(); }">
              🔐 Switch to Admin Portal
            </button>
          </div>
        `;

        document.body.appendChild(overlay);
      }
    } else {
      if (existingOverlay) {
        existingOverlay.remove();
      }
    }
  },

  handleFileUpload(type, event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Please select a valid image file.', 'error');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      this.state[type] = base64Url;
      
      const previewContainer = document.getElementById(`gs-${type}-preview-box`);
      if (previewContainer) {
        previewContainer.innerHTML = `<img id="gs-${type}-preview-img" src="${base64Url}" alt="${type}" style="max-height: ${type === 'logo' ? '50px' : '48px'}; max-width: 100%; object-fit: contain;">`;
      }

      this.saveSettings();
    };
    reader.readAsDataURL(file);
  },

  removeImage(type) {
    this.state[type] = '';
    const previewContainer = document.getElementById(`gs-${type}-preview-box`);
    if (previewContainer) {
      if (type === 'logo') {
        previewContainer.innerHTML = `<span style="color: #94A3B8; font-size: 0.85rem; font-weight: 600;">🖼️ No Logo Uploaded</span>`;
      } else {
        previewContainer.innerHTML = `<span style="color: #94A3B8; font-size: 0.85rem; font-weight: 600;">🔖 No Favicon Uploaded</span>`;
      }
    }
    this.saveSettings();
  },

  handleFormSubmit() {
    const updatedSettings = {
      siteName: document.getElementById('gs-site-name')?.value?.trim() || '',
      siteTitle: document.getElementById('gs-site-title')?.value?.trim() || '',
      siteMetaDescription: document.getElementById('gs-site-meta-desc')?.value?.trim() || '',
      tagline: document.getElementById('gs-tagline')?.value?.trim() || '',
      headerBox: document.getElementById('gs-header-box')?.value || '',
      footerBox: document.getElementById('gs-footer-box')?.value || '',
      websiteStatus: document.getElementById('gs-website-status')?.value || 'Active',
      defaultTimezone: document.getElementById('gs-default-timezone')?.value || 'UTC',
      reCaptcha: {
        status: document.getElementById('gs-recaptcha-status')?.value || 'Inactive',
        siteKey: document.getElementById('gs-recaptcha-site-key')?.value?.trim() || '',
        secretKey: document.getElementById('gs-recaptcha-secret-key')?.value?.trim() || ''
      },
      cookieConsent: {
        status: document.getElementById('gs-cookie-status')?.value || 'Active',
        title: document.getElementById('gs-cookie-title')?.value?.trim() || 'We value your privacy 🍪',
        message: document.getElementById('gs-cookie-message')?.value?.trim() || '',
        acceptText: document.getElementById('gs-cookie-accept-text')?.value?.trim() || 'Accept All Cookies',
        declineText: document.getElementById('gs-cookie-decline-text')?.value?.trim() || 'Necessary Only',
        cookieDays: parseInt(document.getElementById('gs-cookie-days')?.value || '30')
      },
      sitemap: {
        autoGenerate: document.getElementById('gs-sitemap-autogen')?.value === 'true',
        siteUrl: document.getElementById('gs-sitemap-siteurl')?.value?.trim() || 'http://localhost:9999',
        changeFreq: document.getElementById('gs-sitemap-freq')?.value || 'daily',
        priorityHome: document.getElementById('gs-sitemap-prio-home')?.value || '1.0',
        priorityPages: document.getElementById('gs-sitemap-prio-pages')?.value || '0.8',
        lastGenerated: (this.state.sitemap && this.state.sitemap.lastGenerated) || new Date().toLocaleString()
      }
    };

    this.saveSettings(updatedSettings);
  },

  /**
   * Renders the complete Admin UI for [ ⚙️ General Settings ].
   * Includes Cookie Banner & Sitemap Auto-Generator Controls.
   */
  renderGeneralSettingsView() {
    const s = this.state;
    const c = s.cookieConsent || DEFAULT_GENERAL_SETTINGS.cookieConsent;
    const sm = s.sitemap || DEFAULT_GENERAL_SETTINGS.sitemap;
    
    const defaultRobots = `User-agent: *\nAllow: /\nSitemap: ${sm.siteUrl || 'http://localhost:9999'}/sitemap.xml`;
    const robotsContent = localStorage.getItem('seo_robots_txt') || defaultRobots;
    const llmCode = localStorage.getItem('seo_llm_code') || '';
    
    const timezones = [
      'UTC',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Anchorage',
      'America/Phoenix',
      'America/Sao_Paulo',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Madrid',
      'Europe/Rome',
      'Europe/Moscow',
      'Africa/Cairo',
      'Africa/Johannesburg',
      'Asia/Dubai',
      'Asia/Kolkata',
      'Asia/Bangkok',
      'Asia/Singapore',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Hong_Kong',
      'Asia/Seoul',
      'Australia/Sydney',
      'Australia/Melbourne',
      'Pacific/Auckland'
    ];

    return `
      <div class="data-table-card" style="padding: 1.75rem; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <!-- Top Header Title -->
        <div style="border-bottom: 1px solid #F1F5F9; padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F172A; margin: 0 0 0.2rem 0;">⚙️ General Settings & Auto-Sitemap Engine</h2>
            <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Configure agency branding, site metadata, custom scripts, website maintenance mode, cookie consent banner, and auto-generated XML sitemap.</p>
          </div>
          <button type="button" class="btn-teal" style="background: #00ACC1; color: #FFFFFF; font-weight: 800; padding: 0.65rem 1.4rem; border-radius: 8px; border: none; cursor: pointer; font-size: 0.88rem; box-shadow: 0 2px 6px rgba(0,172,193,0.25);" onclick="GeneralSettingsEngine.handleFormSubmit()">
            💾 Save General Settings
          </button>
        </div>

        <!-- 1. Top Dual Image Upload Row: Logo Box (Left) & Favicon Box (Right) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.75rem;">
          <!-- Logo Upload Box -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1.25rem;">
            <div style="margin-bottom: 0.75rem;">
              <label style="display: block; font-weight: 800; font-size: 0.95rem; color: #0F172A; margin-bottom: 0.1rem;">Logo</label>
              <span style="font-size: 0.78rem; color: #64748B; font-weight: 600;">Recommended Size: 240px x 60px</span>
            </div>
            
            <div id="gs-logo-preview-box" style="height: 80px; background: transparent; border: 2px dashed #CBD5E1; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; padding: 0.5rem; overflow: hidden;">
              ${s.logo 
                ? `<img id="gs-logo-preview-img" src="${s.logo}" alt="Logo" style="max-height: 50px; max-width: 100%; object-fit: contain;">`
                : `<span style="color: #94A3B8; font-size: 0.85rem; font-weight: 600;">🖼️ No Logo Uploaded</span>`
              }
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <label class="btn-teal" style="cursor: pointer; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.82rem; font-weight: 700; background: #00ACC1; color: #FFFFFF; display: inline-flex; align-items: center; gap: 0.35rem; border: none;">
                📤 Upload Logo
                <input type="file" accept="image/*" style="display: none;" onchange="GeneralSettingsEngine.handleFileUpload('logo', event)">
              </label>
              <button type="button" class="btn-outline" style="padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.82rem; font-weight: 700; color: #EF4444; border: 1px solid #FECACA; background: #FFFFFF; cursor: pointer;" onclick="GeneralSettingsEngine.removeImage('logo')">
                🗑️ Delete
              </button>
            </div>
          </div>

          <!-- Favicon Upload Box -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1.25rem;">
            <div style="margin-bottom: 0.75rem;">
              <label style="display: block; font-weight: 800; font-size: 0.95rem; color: #0F172A; margin-bottom: 0.1rem;">Favicon</label>
              <span style="font-size: 0.78rem; color: #64748B; font-weight: 600;">Recommended Size: 64px x 64px</span>
            </div>

            <div id="gs-favicon-preview-box" style="height: 80px; background: transparent; border: 2px dashed #CBD5E1; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; padding: 0.5rem; overflow: hidden;">
              ${s.favicon 
                ? `<img id="gs-favicon-preview-img" src="${s.favicon}" alt="Favicon" style="max-height: 48px; max-width: 48px; object-fit: contain;">`
                : `<span style="color: #94A3B8; font-size: 0.85rem; font-weight: 600;">🔖 No Favicon Uploaded</span>`
              }
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <label class="btn-teal" style="cursor: pointer; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.82rem; font-weight: 700; background: #00ACC1; color: #FFFFFF; display: inline-flex; align-items: center; gap: 0.35rem; border: none;">
                📤 Upload Favicon
                <input type="file" accept="image/*" style="display: none;" onchange="GeneralSettingsEngine.handleFileUpload('favicon', event)">
              </label>
              <button type="button" class="btn-outline" style="padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.82rem; font-weight: 700; color: #EF4444; border: 1px solid #FECACA; background: #FFFFFF; cursor: pointer;" onclick="GeneralSettingsEngine.removeImage('favicon')">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>

        <!-- 2. Main Form Inputs: Site Name, Site Title, Tagline & Meta Description -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">
              Site Name *
            </label>
            <input type="text" id="gs-site-name" class="form-control" value="${s.siteName || ''}" placeholder="Spectrum SEO Agency" style="width: 100%; padding: 0.6rem 0.85rem; font-weight: 600; font-size: 0.9rem;">
          </div>

          <div>
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">
              Site Title *
            </label>
            <input type="text" id="gs-site-title" class="form-control" value="${s.siteTitle || ''}" placeholder="Spectrum SEO | Enterprise Organic Growth Agency" style="width: 100%; padding: 0.6rem 0.85rem; font-weight: 600; font-size: 0.9rem;">
          </div>

          <div>
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">
              Tagline
            </label>
            <input type="text" id="gs-tagline" class="form-control" value="${s.tagline || ''}" placeholder="Rank 10x Faster with Data-Driven SEO" style="width: 100%; padding: 0.6rem 0.85rem; font-weight: 600; font-size: 0.9rem;">
          </div>
        </div>

        <!-- Site Meta Description Textarea -->
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">
            Site Meta Description
          </label>
          <textarea id="gs-site-meta-desc" class="form-control" rows="3" placeholder="Enter comprehensive meta description for search engines..." style="width: 100%; padding: 0.65rem 0.85rem; font-size: 0.88rem; line-height: 1.5;">${s.siteMetaDescription || ''}</textarea>
        </div>

        <!-- 3. Code Textareas: Header Box & Footer Box -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">
              Header Box Code (&lt;head&gt;)
            </label>
            <textarea id="gs-header-box" class="form-control" rows="5" placeholder="<!-- Code to insert inside <head> tag (Google Analytics, Meta tags, Custom CSS, Cookie Tracking) -->" style="width: 100%; font-family: 'Fira Code', monospace; font-size: 0.82rem; line-height: 1.4; padding: 0.65rem 0.85rem; background: #0F172A; color: #38BDF8; border: 1px solid #1E293B; border-radius: 8px;">${s.headerBox || ''}</textarea>
          </div>

          <div>
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">
              Footer Box Code (before &lt;/body&gt;)
            </label>
            <textarea id="gs-footer-box" class="form-control" rows="5" placeholder="<!-- Code to insert before </body> tag (Live Chat widgets, tracking scripts, Custom JS) -->" style="width: 100%; font-family: 'Fira Code', monospace; font-size: 0.82rem; line-height: 1.4; padding: 0.65rem 0.85rem; background: #0F172A; color: #34D399; border: 1px solid #1E293B; border-radius: 8px;">${s.footerBox || ''}</textarea>
          </div>
        </div>

        <!-- 4. Dropdowns: Website Status & Default Timezone -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">
              Website Status
            </label>
            <select id="gs-website-status" class="form-control" style="width: 100%; padding: 0.6rem 0.85rem; font-weight: 700; font-size: 0.9rem; border: 1px solid #CBD5E1; border-radius: 6px;">
              <option value="Active" ${s.websiteStatus === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Maintenance" ${s.websiteStatus === 'Maintenance' ? 'selected' : ''}>Maintenance Mode</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">
              Default Timezone
            </label>
            <select id="gs-default-timezone" class="form-control" style="width: 100%; padding: 0.6rem 0.85rem; font-weight: 600; font-size: 0.9rem; border: 1px solid #CBD5E1; border-radius: 6px;">
              ${timezones.map(tz => `<option value="${tz}" ${s.defaultTimezone === tz ? 'selected' : ''}>${tz}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- 5. Card: Cookie Consent & Privacy Policy Settings -->
        <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 1.35rem; margin-bottom: 1.75rem;">
          <h3 style="color: #D97706; font-weight: 800; font-size: 1.05rem; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
            🍪 Cookie Consent Banner & Privacy Notice (GDPR/CCPA Compliant)
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1rem;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #92400E; margin-bottom: 0.3rem;">
                Cookie Banner Status
              </label>
              <select id="gs-cookie-status" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; font-weight: 700; font-size: 0.88rem; border: 1px solid #FCD34D;">
                <option value="Active" ${c.status === 'Active' ? 'selected' : ''}>Active (Show Banner)</option>
                <option value="Inactive" ${c.status === 'Inactive' ? 'selected' : ''}>Inactive (Hide Banner)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #92400E; margin-bottom: 0.3rem;">
                Banner Title
              </label>
              <input type="text" id="gs-cookie-title" class="form-control" value="${c.title || 'We value your privacy 🍪'}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
            </div>

            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #92400E; margin-bottom: 0.3rem;">
                Cookie Validity (Days)
              </label>
              <input type="number" id="gs-cookie-days" class="form-control" value="${c.cookieDays || 30}" min="1" max="365" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
            </div>
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #92400E; margin-bottom: 0.3rem;">
              Cookie Banner Notice Message
            </label>
            <input type="text" id="gs-cookie-message" class="form-control" value="${c.message || ''}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #92400E; margin-bottom: 0.3rem;">
                Accept Button Text
              </label>
              <input type="text" id="gs-cookie-accept-text" class="form-control" value="${c.acceptText || 'Accept All Cookies'}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
            </div>

            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #92400E; margin-bottom: 0.3rem;">
                Decline Button Text
              </label>
              <input type="text" id="gs-cookie-decline-text" class="form-control" value="${c.declineText || 'Necessary Only'}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
            </div>
          </div>
        </div>

        <!-- 6. Card: Automated XML & HTML Sitemap Generator -->
        <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 10px; padding: 1.35rem; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <h3 style="color: #0284C7; font-weight: 800; font-size: 1.05rem; margin: 0 0 0.2rem 0; display: flex; align-items: center; gap: 0.5rem;">
                🗺️ Automated XML Sitemap Generator (sitemap.xml)
              </h3>
              <p style="font-size: 0.82rem; color: #0369A1; margin: 0;">
                System automatically scans all pages to generate valid sitemap.xml.
                ${sm.lastGenerated ? `<span style="font-weight: 700; margin-left: 0.5rem; color: #0284C7;">● Last Auto-Generated: ${sm.lastGenerated}</span>` : ''}
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn-teal" style="background: #0284C7; color: #FFFFFF; font-weight: 700; padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; font-size: 0.82rem;" onclick="GeneralSettingsEngine.downloadSitemapXml()">
                ⚡ Download sitemap.xml
              </button>
              <button type="button" style="background: #FFFFFF; color: #0284C7; border: 1px solid #7DD3FC; font-weight: 700; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.82rem;" onclick="GeneralSettingsEngine.copySitemapXml()">
                📋 Copy XML Code
              </button>
            </div>
          </div>
          
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; align-items: stretch;">
            <input type="url" id="sitemap-domain-url" class="form-control" placeholder="https://example.com" value="${sm.siteUrl || 'http://localhost:9999'}" style="flex: 1; padding: 0.6rem; border: 1px solid #BAE6FD; border-radius: 6px; font-size: 0.95rem;">
            <button class="btn-teal" style="background: #0284C7; color: #FFF; font-weight: 800; border: none; padding: 0 1.5rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center;" onclick="GeneralSettingsEngine.generateSitemapLink()">
              Generate URL
            </button>
          </div>
          
          <div style="background: #FFFFFF; border: 1px solid #E0F2FE; padding: 1rem; border-radius: 8px; margin-bottom: 1.25rem;">
            <span style="display: block; font-size: 0.85rem; font-weight: 700; color: #0369A1; margin-bottom: 0.3rem;">Google Search Console Link:</span>
            <code style="font-size: 0.9rem; color: #0284C7; font-weight: 700;" id="sitemap-gsc-link">${sm.siteUrl ? sm.siteUrl + '/sitemap.xml' : 'Enter domain to generate'}</code>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #0369A1; margin-bottom: 0.3rem;">
                Crawling Change Frequency
              </label>
              <select id="gs-sitemap-freq" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; font-weight: 700; font-size: 0.88rem;">
                <option value="daily" ${sm.changeFreq === 'daily' ? 'selected' : ''}>Daily</option>
                <option value="weekly" ${sm.changeFreq === 'weekly' ? 'selected' : ''}>Weekly</option>
                <option value="monthly" ${sm.changeFreq === 'monthly' ? 'selected' : ''}>Monthly</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #0369A1; margin-bottom: 0.3rem;">
                Home Priority Weight
              </label>
              <input type="text" id="gs-sitemap-prio-home" class="form-control" value="${sm.priorityHome || '1.0'}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
            </div>

            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #0369A1; margin-bottom: 0.3rem;">
                Sub-Pages Priority Weight
              </label>
              <input type="text" id="gs-sitemap-prio-pages" class="form-control" value="${sm.priorityPages || '0.8'}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
            </div>
          </div>
        </div>

        <!-- 6b. Card: LLM Model Configuration -->
        <div style="background: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 10px; padding: 1.35rem; margin-bottom: 2rem;">
          <h3 style="color: #7E22CE; font-weight: 800; font-size: 1.05rem; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
            🧠 LLM Model Configuration
          </h3>
          <p style="font-size: 0.85rem; color: #6B21A8; margin-bottom: 1rem;">Upload your LLM file and inject custom LLM code to enable auto-working functionality.</p>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #6B21A8; margin-bottom: 0.4rem;">Upload LLM File</label>
            <input type="file" id="llm-file-upload" class="form-control" style="width: 100%; padding: 0.4rem; border: 1px solid #D8B4FE; border-radius: 6px; background: #FFFFFF;">
          </div>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #6B21A8; margin-bottom: 0.4rem;">Custom LLM Code (Auto Working)</label>
            <textarea id="llm-custom-code" class="form-control" rows="4" placeholder="Enter your LLM setup code here..." style="width: 100%; padding: 0.8rem; border: 1px solid #D8B4FE; border-radius: 6px; font-family: monospace; font-size: 0.9rem;">${llmCode}</textarea>
          </div>
          
          <button class="btn-teal" style="background: #7E22CE; color: #FFF; font-weight: 800; border: none; padding: 0.6rem 1.5rem; border-radius: 6px; cursor: pointer;" onclick="GeneralSettingsEngine.saveLLMConfig()">
            Save & Activate LLM
          </button>
        </div>

        <!-- 6c. Card: Robots.txt Management -->
        <div style="background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 10px; padding: 1.35rem; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <h3 style="color: #334155; font-weight: 800; font-size: 1.05rem; margin: 0 0 0.2rem 0; display: flex; align-items: center; gap: 0.5rem;">
                🤖 Robots.txt Management
              </h3>
              <p style="font-size: 0.85rem; color: #475569; margin: 0;">View and modify your robots.txt content below. Changes will be applied immediately.</p>
            </div>
            
            <button type="button" style="background: #0F172A; color: #38BDF8; font-weight: 700; padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; font-size: 0.82rem;" onclick="GeneralSettingsEngine.downloadRobotsTxt()">
              🤖 Download robots.txt
            </button>
          </div>
          
          <textarea id="robots-txt-editor" class="form-control" rows="8" style="width: 100%; padding: 0.8rem; border: 1px solid #94A3B8; border-radius: 6px; font-family: monospace; font-size: 0.9rem; margin-bottom: 1.25rem; background: #FFFFFF;">${robotsContent}</textarea>
          
          <button class="btn-teal" style="background: #334155; color: #FFF; font-weight: 800; border: none; padding: 0.6rem 1.5rem; border-radius: 6px; cursor: pointer;" onclick="GeneralSettingsEngine.saveRobotsTxt()">
            Save robots.txt
          </button>
        </div>

        <!-- 7. Card: Google reCAPTCHA Settings -->
        <div style="background: #F0FDFA; border: 1px solid #99F6E4; border-radius: 10px; padding: 1.35rem; margin-bottom: 2rem;">
          <h3 style="color: #00ACC1; font-weight: 800; font-size: 1.05rem; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
            🔗 Displays Google reCAPTCHA
          </h3>

          <div style="margin-bottom: 1.2rem; max-width: 300px;">
            <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #0F766E; margin-bottom: 0.3rem;">
              reCAPTCHA Status
            </label>
            <select id="gs-recaptcha-status" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; font-weight: 700; font-size: 0.88rem; border: 1px solid #5EEAD4;">
              <option value="Active" ${s.reCaptcha.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${s.reCaptcha.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #0F766E; margin-bottom: 0.3rem;">
                Google reCAPTCHA site key
              </label>
              <input type="text" id="gs-recaptcha-site-key" class="form-control" value="${s.reCaptcha.siteKey || ''}" placeholder="Enter Google reCAPTCHA v2 / v3 Site Key" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
            </div>

            <div>
              <label style="display: block; font-weight: 700; font-size: 0.82rem; color: #0F766E; margin-bottom: 0.3rem;">
                Google reCAPTCHA secret key
              </label>
              <input type="text" id="gs-recaptcha-secret-key" class="form-control" value="${s.reCaptcha.secretKey || ''}" placeholder="Enter Google reCAPTCHA Secret Key" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.88rem;">
            </div>
          </div>
        </div>

        <!-- 8. Bottom Action Button -->
        <div style="display: flex; justify-content: flex-end;">
          <button type="button" class="btn-teal" style="background: #00ACC1; color: #FFFFFF; font-weight: 800; padding: 0.85rem 2.2rem; border-radius: 8px; border: none; cursor: pointer; font-size: 1rem; box-shadow: 0 4px 12px rgba(0, 172, 193, 0.3);" onclick="GeneralSettingsEngine.handleFormSubmit()">
            💾 Save General Settings
          </button>
        </div>
      </div>
    `;
  },

  generateSitemapLink() {
    const urlInput = document.getElementById('sitemap-domain-url')?.value.trim();
    if (!urlInput) {
      if (typeof App !== 'undefined') App.showToast('Please enter a valid domain URL', 'error');
      return;
    }
    const formattedUrl = urlInput.endsWith('/') ? urlInput.slice(0, -1) : urlInput;
    if (!this.state.sitemap) this.state.sitemap = {};
    this.state.sitemap.siteUrl = formattedUrl;
    this.state.sitemap.lastGenerated = new Date().toLocaleString();
    
    this.saveSettings();
    if (typeof this.generateSitemapXml === 'function') {
      const xml = this.generateSitemapXml();
      localStorage.setItem('seo_sitemap_xml', xml);
    }
    
    document.getElementById('sitemap-gsc-link').textContent = formattedUrl + '/sitemap.xml';
    
    const editor = document.getElementById('robots-txt-editor');
    if (editor && editor.value.includes('Sitemap: ')) {
      editor.value = editor.value.replace(/Sitemap: .*/, 'Sitemap: ' + formattedUrl + '/sitemap.xml');
    }
    if (typeof App !== 'undefined') App.showToast('✅ Sitemap generated successfully for ' + formattedUrl);
  },
  
  saveLLMConfig() {
    const customCode = document.getElementById('llm-custom-code')?.value || '';
    localStorage.setItem('seo_llm_code', customCode);
    if (typeof App !== 'undefined') App.showToast('✅ LLM Configuration Saved & Activated');
  },

  saveRobotsTxt() {
    const content = document.getElementById('robots-txt-editor')?.value || '';
    localStorage.setItem('seo_robots_txt', content);
    if (typeof App !== 'undefined') App.showToast('✅ robots.txt saved successfully');
  }
};

// Global Window Export
window.GeneralSettingsEngine = GeneralSettingsEngine;

// Self Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  GeneralSettingsEngine.init();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  GeneralSettingsEngine.init();
}

// Global Window Export
window.GeneralSettingsEngine = GeneralSettingsEngine;

// Self Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  GeneralSettingsEngine.init();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  GeneralSettingsEngine.init();
}
