/* ==========================================================================
   PUBLIC AGENCY WEBSITE MODULE (js/public.js)
   Auto-submits real orders to AdminDashboard.state.orders & launches User Panel
   GSAP ScrollTrigger & Engine Specialist Integration
   ========================================================================== */

// Global Financial Engine Fallback Definition
if (typeof window.FinancialEngine === 'undefined') {
  window.FinancialEngine = {
    toCents(amount) {
      if (typeof amount === 'number') return Math.round(amount * 100);
      if (!amount) return 0;
      const clean = String(amount).replace(/[^0-9.-]/g, '');
      const parsed = parseFloat(clean);
      return isNaN(parsed) ? 0 : Math.round(parsed * 100);
    },
    fromCents(cents) {
      return (cents / 100);
    },
    format(amount, currency = 'USD') {
      const numeric = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]/g, '')) || 0;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numeric);
    },
    formatCompact(amount) {
      const numeric = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]/g, '')) || 0;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(numeric);
    }
  };
}

const PublicWebsite = {
  // Client-side SPA Router
  _currentPage: 'home',

  navigateTo(page) {
    this._currentPage = page;
    const root = document.getElementById('app-container');
    if (!root) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'home') {
      root.innerHTML = `<div class="top-header-bar" style="background:#1F2937;padding:0.6rem 2rem;display:flex;justify-content:space-between;align-items:center;"><a href="javascript:void(0)" class="top-header-brand" style="color:#FFF;font-weight:800;text-decoration:none;">SPECTRUM PUBLIC SITE</a><div style="display:flex;gap:0.75rem;"><button type="button" class="btn-teal" style="background:#00BCD4;color:#000;font-weight:bold;padding:0.4rem 0.9rem;border-radius:6px;border:none;cursor:pointer;" onclick="openClientPortal(event)">👤 User Dashboard →</button><button type="button" class="btn-teal" style="padding:0.4rem 0.9rem;border-radius:6px;cursor:pointer;" onclick="openAdminPortal(event)">🔐 Back to Admin Portal →</button></div></div><main>${this.renderPublicView()}</main>`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        this.init3DWebGLCanvasEngine();
        this.initScrollAnimations();
        this.initHeroV2();
        this.initProofGallerySlideshow();
        this.bindRoiCalculator();
      }));
    } else if (page === 'services') {
      root.innerHTML = this.renderServicesPage();
      requestAnimationFrame(() => this.initServicesPage());
    } else if (page === 'login') {
      root.innerHTML = this.renderLoginPage();
      requestAnimationFrame(() => this.initLoginPage());
    } else if (page === 'register') {
      root.innerHTML = this.renderRegisterPage();
      requestAnimationFrame(() => this.initRegisterPage());
    }

    if (typeof GeneralSettingsEngine !== 'undefined') {
      GeneralSettingsEngine.applySettings();
    }
  },

  _webglAnimId: null,
  _webglResizeBound: false,
  _webglMouseBound: false,
  _canvasScrollState: null,
  _canvasScrollTrigger: null,
  _proofTimer: null,
  _currentProofIndex: 0,
  _proofItems: [],
  _updateProofSlide: null,
  _heroParallaxBound: false,
  _heroScrollTriggers: [],

  init() {
    this.bindRoiCalculator();
    this.initProofGallerySlideshow();
    this.initScrollAnimations();
    this.initMouseGlowEngine();
    this.init3DWebGLCanvasEngine();
    this.initHeroV2();
  },

  // --------------------------------------------------------------------------
  // 1. Hero Full BG Canvas Particle & Glow Engine
  // --------------------------------------------------------------------------
  initHeroFullBgCanvas() {
    let canvas = document.getElementById('hero-full-bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let dpr = window.devicePixelRatio || 1;
    
    const resize = () => {
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight; 
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const numParticles = 100;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: ['#A855F7', '#EC4899', '#06B6D4'][Math.floor(Math.random() * 3)]
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const scrollVel = Math.sin(scrollY * 0.005) * 0.5;
      
      particles.forEach((p) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 2.2;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }
      });

      particles.forEach((p, i) => {
        p.x += p.vx + (mouseX - width/2) * 0.001;
        p.y += p.vy + scrollVel;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const alpha = (1 - dist/120) * 0.5;
            const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            const getCol = (c, a) => c === '#A855F7' ? ('rgba(168,85,247,' + a + ')') : c === '#EC4899' ? ('rgba(236,72,153,' + a + ')') : ('rgba(6,182,212,' + a + ')');
            grad.addColorStop(0, getCol(particles[i].color, alpha));
            grad.addColorStop(1, getCol(particles[j].color, alpha));
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      const sorted = [...particles].map(p => ({ p, dist: Math.hypot(mouseX - p.x, mouseY - p.y) })).sort((a,b) => a.dist - b.dist).slice(0, 3);
      sorted.forEach(item => {
        if (item.dist < 180) {
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(item.p.x, item.p.y);
          ctx.strokeStyle = `rgba(255, 77, 184, ${(1 - item.dist/180) * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };
    animate();
  },

  // --------------------------------------------------------------------------
  // 1. 3D WebGL Canvas Scrollytelling Particle & Mesh Engine
  // --------------------------------------------------------------------------
  init3DWebGLCanvasEngine() {
    let canvas = document.getElementById('webgl-scrollytelling-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'webgl-scrollytelling-canvas';
      canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;';
      (document.getElementById('scrollytelling-3d') || document.body).appendChild(canvas);
    }

    if (this._webglAnimId) {
      cancelAnimationFrame(this._webglAnimId);
      this._webglAnimId = null;
    }

    let gl = null;
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true }) || canvas.getContext('experimental-webgl', { alpha: true, antialias: true });
    } catch (e) {
      gl = null;
    }

    const ctx2d = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    if (!this._webglResizeBound) {
      window.addEventListener('resize', () => resize());
      this._webglResizeBound = true;
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    if (!this._webglMouseBound) {
      window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
      });
      this._webglMouseBound = true;
    }

    // Generate 3D Particle Mesh Nodes
    const particleCount = 75;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 1.5,
        phase: Math.random() * Math.PI * 2
      });
    }

    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    const renderFrame = () => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const rawScrollRatio = Math.min(1, Math.max(0, scrollY / maxScroll));

      const scrollState = PublicWebsite._canvasScrollState || {};
      const scrollRatio = (typeof scrollState.progress === 'number') ? scrollState.progress : rawScrollRatio;

      // Dynamic 3D Geometry Transformations based on GSAP scroll scrub & mouse
      const baseRotX = (typeof scrollState.rotX === 'number') ? scrollState.rotX : scrollRatio * Math.PI * 2.5;
      const baseRotY = (typeof scrollState.rotY === 'number') ? scrollState.rotY : scrollRatio * Math.PI * 3.5;
      rotX = baseRotX + mouseY * 0.4;
      rotY = baseRotY + mouseX * 0.4;
      rotZ = scrollRatio * Math.PI * 0.5;

      const scaleFactor = (typeof scrollState.scale === 'number') ? scrollState.scale : 1;
      const meshScale = (1 + Math.sin(scrollRatio * Math.PI) * 0.4 + (mouseX * 0.05)) * scaleFactor;

      const densityFactor = (typeof scrollState.density === 'number') ? scrollState.density : 1;
      const maxLineDist = (135 + Math.sin(scrollRatio * Math.PI * 2) * 35) * densityFactor;

      const baseHueCyan = 185;
      const baseHuePurple = 275;
      const hueShift = scrollRatio * 90;

      if (ctx2d) {
        ctx2d.save();
        ctx2d.scale(dpr, dpr);
        ctx2d.clearRect(0, 0, width, height);

        const cx = canvas.offsetWidth / 2;
        const cy = canvas.offsetHeight / 2;
        const fov = 400;

        const projected = [];

        for (let i = 0; i < particleCount; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          if (Math.abs(p.x) > 350) p.vx *= -1;
          if (Math.abs(p.y) > 350) p.vy *= -1;
          if (Math.abs(p.z) > 350) p.vz *= -1;

          // 3D Matrix Rotations
          const y1 = p.y * Math.cos(rotX) - p.z * Math.sin(rotX);
          const z1 = p.y * Math.sin(rotX) + p.z * Math.cos(rotX);

          const x2 = p.x * Math.cos(rotY) + z1 * Math.sin(rotY);
          const z2 = -p.x * Math.sin(rotY) + z1 * Math.cos(rotY);

          const x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
          const y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

          const sx3 = x3 * meshScale;
          const sy3 = y3 * meshScale;
          const sz2 = z2 * meshScale;

          const perspective = fov / (fov + sz2 + 450);
          const sx = cx + sx3 * perspective;
          const sy = cy + sy3 * perspective;

          projected.push({
            sx, sy, sz2, perspective,
            radius: p.radius * perspective,
            phase: p.phase
          });
        }

        // Draw Glowing Cyan-Purple Mesh Lines
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const p1 = projected[i];
            const p2 = projected[j];
            const dx = p1.sx - p2.sx;
            const dy = p1.sy - p2.sy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxLineDist) {
              const alpha = (1 - dist / maxLineDist) * 0.5 * Math.min(p1.perspective, p2.perspective);
              const grad = ctx2d.createLinearGradient(p1.sx, p1.sy, p2.sx, p2.sy);

              const color1 = `hsla(${baseHueCyan + hueShift}, 100%, 65%, ${alpha})`;
              const color2 = `hsla(${baseHuePurple + hueShift}, 90%, 65%, ${alpha})`;

              grad.addColorStop(0, color1);
              grad.addColorStop(1, color2);

              ctx2d.beginPath();
              ctx2d.moveTo(p1.sx, p1.sy);
              ctx2d.lineTo(p2.sx, p2.sy);
              ctx2d.strokeStyle = grad;
              ctx2d.lineWidth = 1.2 * Math.min(p1.perspective, p2.perspective);
              ctx2d.stroke();
            }
          }
        }

        // Draw Animated 3D Particle Nodes
        for (let i = 0; i < particleCount; i++) {
          const p = projected[i];
          if (p.sx < -50 || p.sx > width + 50 || p.sy < -50 || p.sy > height + 50) continue;

          const nodeHue = (i % 2 === 0) ? (baseHueCyan + hueShift) : (baseHuePurple + hueShift);

          ctx2d.beginPath();
          ctx2d.arc(p.sx, p.sy, Math.max(1, p.radius), 0, Math.PI * 2);
          ctx2d.fillStyle = `hsl(${nodeHue}, 100%, 70%)`;
          ctx2d.shadowColor = `hsl(${nodeHue}, 100%, 60%)`;
          ctx2d.shadowBlur = 10 * p.perspective;
          ctx2d.fill();
          ctx2d.shadowBlur = 0;
        }

        ctx2d.restore();
      }

      PublicWebsite._webglAnimId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  },

  // --------------------------------------------------------------------------
  // 2. REAL CLIENT PROOF GALLERY SLIDESHOW BOX (Fade In / Fade Out)
  // --------------------------------------------------------------------------
  initProofGallerySlideshow() {
    this._currentProofIndex = 0;
    this.startProofTimer();
  },

  startProofTimer() {
    this.stopProofTimer();
    this._proofTimer = setInterval(() => {
      this.nextProofSlide();
    }, 5000);
  },

  stopProofTimer() {
    if (this._proofTimer) {
      clearInterval(this._proofTimer);
      this._proofTimer = null;
    }
  },

  nextProofSlide() {
    const items = this.getProofItems();
    const nextIdx = (this._currentProofIndex + 1) % items.length;
    this.switchProofSlide(nextIdx);
  },

  prevProofSlide() {
    const items = this.getProofItems();
    const prevIdx = (this._currentProofIndex - 1 + items.length) % items.length;
    this.switchProofSlide(prevIdx);
  },

  getProofItems() {
    return [
      { src: 'https://i.ibb.co/cSJSXHnv/HEZZdvia-IAAGa67.jpg', title: '🚀 +350% Organic Traffic Surge', metric: 'E-Commerce Retail Brand (60 Days Campaign)' },
      { src: 'https://i.ibb.co/SD2JBmsP/HEHNv22a-IAAMh-Ny.jpg', title: '📈 15,000 → 85,000 Monthly Visitors Growth', metric: 'B2B Enterprise SaaS Platform' },
      { src: 'https://i.ibb.co/HT4HnfSz/HDq-Id-Xoa8-AA6-Zjv.png', title: '🥇 #1 Rank for Commercial Search Terms', metric: 'Fintech & Mobile App Client' },
      { src: 'https://i.ibb.co/Jw6G2fYQ/HDUhla1a-MAA8s27.jpg', title: '⚡ Sub-Second Core Web Vitals Optimization', metric: 'PageSpeed 45 → 98 Performance Jump' },
      { src: 'https://i.ibb.co/wNrw9y1S/HDUgj-JXXk-AAAt9i.jpg', title: '💰 4.8x Organic Lead Conversion Boost', metric: 'Legal & Professional Services Firm' },
      { src: 'https://i.ibb.co/NnyZrLFc/HDUgj-N9a-MAEEYr-L.jpg', title: '🔗 High-DR 80+ Contextual Link Placements', metric: 'White-Hat Tier-1 Press Outreach' },
      { src: 'https://i.ibb.co/p6rGMf73/HDUgj-NSWg-AAxru8.jpg', title: '⏱️ Instant Google Search Console Indexing', metric: 'Automated Crawler API Sync' },
      { src: 'https://i.ibb.co/Rp9gx1wz/HDUgj-Un-WEAA6p-Wx.jpg', title: '🛡️ Enterprise Domain Rating Compound Growth', metric: 'DR 24 → DR 68 Domain Scaling' }
    ];
  },

  switchProofSlide(index) {
    const proofItems = this.getProofItems();
    if (index < 0 || index >= proofItems.length) return;
    this._currentProofIndex = index;
    const item = proofItems[index];

    const imgEl = document.getElementById('proof-featured-img');
    const titleEl = document.getElementById('proof-slide-title');
    const metricEl = document.getElementById('proof-slide-metric');
    const counterEl = document.getElementById('proof-slide-counter');

    if (imgEl) {
      imgEl.style.opacity = '0';
      imgEl.style.transform = 'scale(0.97)';

      setTimeout(() => {
        imgEl.src = item.src;
        imgEl.alt = item.title;
        if (titleEl) titleEl.innerText = item.title;
        if (metricEl) metricEl.innerText = item.metric;
        if (counterEl) counterEl.innerText = `${index + 1} / ${proofItems.length}`;

        imgEl.style.opacity = '1';
        imgEl.style.transform = 'scale(1)';
      }, 200);
    }

    const thumbs = document.querySelectorAll('.proof-thumb-btn');
    thumbs.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('active');
        btn.style.borderColor = '#FF5555';
        btn.style.opacity = '1';
        btn.style.transform = 'scale(1.08)';
        btn.style.boxShadow = '0 0 15px rgba(255, 85, 85, 0.6)';
      } else {
        btn.classList.remove('active');
        btn.style.borderColor = 'rgba(255,255,255,0.2)';
        btn.style.opacity = '0.6';
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = 'none';
      }
    });
  },

  // --------------------------------------------------------------------------
  // 3. Render Public View Engine
  // --------------------------------------------------------------------------
  renderDynamicPublicNavLinks() {
    if (typeof MenuEngine === 'undefined') return '';
    const isLoggedIn = !!localStorage.getItem('seo_logged_user');
    const items = MenuEngine.state.menuItems.filter(item => {
      const isActive = item.status === 'Active' || item.active;
      if (!isActive) return false; // "agr admin nay disable kia howe hai tu pher wo menu he show nehe hona chahiya"
      
      // "admin panel ma jo menu all hai ... wo landing page menu pay show hone chahiya"
      if (item.visibility === 'All') return true;
      if ((item.visibility === 'Logged out' || item.visibility === 'Logged Out') && !isLoggedIn) return true;
      
      return false;
    }).sort((a, b) => a.orderIndex - b.orderIndex);

    return items.map(item => `
      <li>
        <a href="javascript:void(0)"
           onclick="PublicWebsite.handleNavClick('${SecurityEngine.sanitizeHTML(item.slug)}')"
           title="${SecurityEngine.sanitizeHTML(item.name)}">
          ${item.icon ? `<span aria-hidden="true">${item.icon}</span>` : ''}
          ${SecurityEngine.sanitizeHTML(item.name)}
        </a>
      </li>
    `).join('');
  },

  handleNavClick(slug) {
    const routeMap = {
      '/services': 'services',
      '/login':    'login',
      '/signup':   'register',
      '/register': 'register',
    };
    const page = routeMap[slug];
    if (page) {
      this.navigateTo(page);
    } else {
      // For other slugs, scroll to section or show toast
      const sectionId = slug.replace('/', '');
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  renderPublicView() {
    const navLinksHtml = this.renderDynamicPublicNavLinks();
    let servicesGridHtml = '';

    const adminCategories = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && AdminDashboard.state.categories) ? AdminDashboard.state.categories : [];
    const activeCategories = adminCategories.filter(c => c.status === 'Active').map(c => c.name);

    const allServices = (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && AdminDashboard.state.servicesList) ? AdminDashboard.state.servicesList : [];
    const activeServices = allServices.filter(s => s.status === 'Active' && (activeCategories.length === 0 || activeCategories.includes(s.category)));

    if (activeServices.length > 0) {
      servicesGridHtml = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          ${activeServices.map(s => {
            const formattedPrice = (typeof FinancialEngine !== 'undefined' && FinancialEngine.format)
              ? FinancialEngine.format(s.rate || s.originalPrice)
              : (s.rate || `$${s.originalPrice}`);
            return `
              <div class="glass-card" style="padding: 1.8rem; border-radius: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.78rem; color: #F472B6; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${s.category}</span>
                    <span style="background: rgba(0, 172, 193, 0.15); color: #38BDF8; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 12px; border: 1px solid rgba(0, 172, 193, 0.3);">${s.serviceType || 'Package'}</span>
                  </div>
                  <h3 style="font-size: 1.25rem; font-weight: 800; color: #FFF; margin: 0.4rem 0 0.6rem 0;">${s.name}</h3>
                  <p style="font-size: 0.88rem; color: #9CA3AF; margin-bottom: 1rem; line-height: 1.5;">${s.description || 'Enterprise SEO campaign deliverable with full performance reporting.'}</p>
                  <div style="font-size: 0.82rem; color: #64748B; margin-bottom: 1.2rem; font-weight: 600;">⚡ Scope: ${s.minMax}</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem; margin-top: 0.5rem;">
                  <div>
                    <div style="font-size: 0.75rem; color: #9CA3AF; text-transform: uppercase; font-weight: 700;">Package Rate</div>
                    <div style="font-size: 1.4rem; font-weight: 900; color: #34D399;">${formattedPrice}</div>
                  </div>
                  <button class="btn-gradient" style="padding: 0.55rem 1.2rem; font-size: 0.88rem; font-weight: 800;" onclick="PublicWebsite.openBookingModal('${s.name} (${formattedPrice})')">Order Package</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      servicesGridHtml = `
        <div style="text-align:center; padding: 3rem 1.5rem; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15); border-radius: 16px; color: #9CA3AF;">
          <h3 style="color: #FFF; font-size: 1.2rem; margin-bottom: 0.5rem;">No Public Services Added Yet</h3>
          <p style="font-size: 0.9rem;">Admin can add new SEO packages via the Admin Portal.</p>
        </div>
      `;
    }

    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.init3DWebGLCanvasEngine();
      this.initScrollAnimations();
      this.initHeroV2();
      this.initProofGallerySlideshow();
      this.bindRoiCalculator();
    }));

    if (typeof PageTemplateEngine !== 'undefined') {
      return PageTemplateEngine.compileAndRender('landing-page', {
        public_navbar_links: this.renderDynamicPublicNavLinks(),
        services_grid: servicesGridHtml
      });
    }

    return this.getFallbackLandingHtml(navLinksHtml, servicesGridHtml);
  },

  // --------------------------------------------------------------------------
  // 4. Interactive Handlers & Modals
  // --------------------------------------------------------------------------
  updateRoiCalculations() {
    const trafficInput = document.getElementById('range-traffic');
    const convInput = document.getElementById('range-conv');
    const aovInput = document.getElementById('range-aov');

    const traffic = parseFloat(trafficInput?.value || 25000);
    const conv = parseFloat(convInput?.value || 2.5);
    const aov = parseFloat(aovInput?.value || 450);

    const elT = document.getElementById('val-traffic');
    const elC = document.getElementById('val-conv');
    const elA = document.getElementById('val-aov');

    if (elT) elT.innerText = traffic.toLocaleString();
    if (elC) elC.innerText = conv.toFixed(1) + '%';
    if (elA) elA.innerText = FinancialEngine.format(aov);

    const newTraffic = traffic * 3;
    const newLeads = Math.round((newTraffic * (conv / 100)));

    // Accurate revenue growth calculation via FinancialEngine.toCents()
    const aovCents = FinancialEngine.toCents(aov);
    const annualRevCents = newLeads * aovCents * 12;
    const annualRevDollars = FinancialEngine.fromCents(annualRevCents);

    const formattedAnnualRev = FinancialEngine.format(annualRevDollars);

    const elR = document.getElementById('output-projected-rev');
    const elNT = document.getElementById('output-new-traffic');
    const elNL = document.getElementById('output-new-leads');

    if (elR) elR.innerText = '+' + formattedAnnualRev;
    if (elNT) elNT.innerText = '+' + newTraffic.toLocaleString() + ' /mo';
    if (elNL) elNL.innerText = '+' + newLeads.toLocaleString() + ' /mo';
  },

  bindRoiCalculator() {
    setTimeout(() => this.updateRoiCalculations(), 200);
  },

  runLiveAudit() {
    const input = document.getElementById('hero-audit-input') || document.getElementById('audit-url-input');
    const url = input ? input.value.trim() : '';

    if (!url) {
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Please enter a website URL first!', 'error');
      }
      return;
    }

    let scanContainer = document.getElementById('scan-progress-container');
    let progressBar = document.getElementById('scan-progress-bar');
    let stepText = document.getElementById('scan-step-text');
    let pctText = document.getElementById('scan-percentage');
    let resultsPanel = document.getElementById('audit-results-display');

    if (!scanContainer) {
      const parent = (input.closest('.hero-audit-form') || input.parentElement)?.parentNode || document.querySelector('.hero-section');
      if (parent) {
        const containerDiv = document.createElement('div');
        containerDiv.innerHTML = `
          <div id="scan-progress-container" class="glass-card scan-progress-box" style="max-width: 650px; margin: 1.5rem auto 0 auto; display: none;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 0.5rem;">
              <span id="scan-step-text" style="color: #F472B6;">Initiating Crawler engines...</span>
              <span id="scan-percentage" style="color: #FB923C;">0%</span>
            </div>
            <div class="progress-bar-track" style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden;">
              <div id="scan-progress-bar" class="progress-bar-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #00ACC1, #F472B6); transition: width 0.3s ease;"></div>
            </div>
          </div>

          <div id="audit-results-display" class="glass-card audit-results-panel" style="max-width: 900px; margin: 2rem auto 0 auto; display: none;"></div>
        `;
        parent.appendChild(containerDiv);

        scanContainer = document.getElementById('scan-progress-container');
        progressBar = document.getElementById('scan-progress-bar');
        stepText = document.getElementById('scan-step-text');
        pctText = document.getElementById('scan-percentage');
        resultsPanel = document.getElementById('audit-results-display');
      }
    }

    if (!scanContainer || !progressBar || !resultsPanel) return;

    scanContainer.style.display = 'block';
    scanContainer.classList.add('active');
    resultsPanel.style.display = 'none';
    resultsPanel.classList.remove('active');

    let currentPct = 0;
    const steps = [
      "Crawling DOM & JavaScript rendering...",
      "Analyzing PageSpeed & Core Web Vitals...",
      "Evaluating Schema markup & meta tags...",
      "Checking Backlink profile & domain trust...",
      "Finalizing SEO Score calculation..."
    ];

    const timer = setInterval(() => {
      currentPct += 20;
      if (progressBar) progressBar.style.width = currentPct + '%';
      if (pctText) pctText.innerText = currentPct + '%';
      if (stepText) stepText.innerText = steps[Math.min(Math.floor(currentPct / 20) - 1, 4)];

      if (currentPct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          scanContainer.classList.remove('active');
          this.renderAuditResults(url);
        }, 500);
      }
    }, 400);
  },

  runFreeAuditScanner() {
    const heroInput = document.getElementById('audit-url-input');
    const scannerInput = document.getElementById('hero-audit-input');
    if (heroInput && heroInput.value && scannerInput) {
      scannerInput.value = heroInput.value;
    }
    const auditSection = document.getElementById('audit-tool-section') || document.getElementById('audit-tool');
    if (auditSection) {
      auditSection.scrollIntoView({ behavior: 'smooth' });
    }
    this.runLiveAudit();
  },

  renderAuditResults(url) {
    const resultsPanel = document.getElementById('audit-results-display');
    if (!resultsPanel) return;

    resultsPanel.style.display = 'block';
    resultsPanel.innerHTML = `
      <div style="background: rgba(15, 10, 28, 0.85); border: 1px solid rgba(0, 172, 193, 0.4); border-radius: 16px; padding: 2rem; color: #FFF; backdrop-filter: blur(16px);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #FFF; margin: 0 0 0.2rem 0;">Audit Report for <span class="text-gradient">${url}</span></h3>
            <p style="color: #9CA3AF; font-size: 0.88rem; margin: 0;">Scan generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          <span class="nav-badge" style="background:#D1FAE5; color:#065F46; font-size: 0.85rem; padding: 0.35rem 0.85rem; font-weight: 700; border-radius: 20px;">✓ Analysis Complete</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; margin: 1.8rem 0; text-align: center;">
          <div style="background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 2.4rem; font-weight: 900; color: #F59E0B;">64 / 100</div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #9CA3AF; margin-top: 0.2rem;">Overall Technical SEO</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 2.4rem; font-weight: 900; color: #EF4444;">42 / 100</div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #9CA3AF; margin-top: 0.2rem;">Core Web Vitals Speed</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 2.4rem; font-weight: 900; color: #34D399;">DR 58</div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #9CA3AF; margin-top: 0.2rem;">Domain Authority Rating</div>
          </div>
        </div>

        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 1.2rem; margin-bottom: 1.8rem;">
          <div style="font-weight: 800; color: #FCA5A5; font-size: 0.95rem; margin-bottom: 0.5rem;">⚠️ Critical SEO Action Items Identified:</div>
          <ul style="margin: 0; padding-left: 1.2rem; color: #E5E7EB; font-size: 0.88rem; line-height: 1.6;">
            <li>LCP (Largest Contentful Paint) exceeds 3.8s target (Unoptimized web font & image payloads)</li>
            <li>14 commercial landing pages missing structured JSON-LD schema markup</li>
            <li>Backlink velocity gap detected compared to top 3 SERP competitors</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <button class="btn-gradient" style="padding: 0.85rem 1.8rem; font-size: 1rem; font-weight: 800;" onclick="PublicWebsite.openBookingModal('Free SEO Fix Strategy Session', '${url}')">
            🚀 Order Custom Strategy Audit to Fix These Issues →
          </button>
        </div>
      </div>
    `;

    resultsPanel.classList.add('active');
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('SEO Audit generated successfully!');
    }
  },

  toggleFaq(el) {
    if (!el) return;
    const answer = el.querySelector('.faq-answer');
    const icon = el.querySelector('.faq-icon') || el.querySelector('.faq-toggle-icon');

    el.classList.toggle('active');
    if (answer) {
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
      } else {
        answer.style.display = 'block';
      }
    }
    if (icon) {
      if (icon.innerText === '+' || icon.innerText === '▼') {
        icon.innerText = (icon.innerText === '+') ? '−' : '▲';
      } else {
        icon.innerText = (icon.innerText === '−') ? '+' : '▼';
      }
    }
  },

  openImageLightbox(src) {
    if (typeof App !== 'undefined' && App.openModal) {
      App.openModal(`
        <div style="text-align: center; max-width: 90vw;">
          <h3 style="color: #FFF; font-size: 1.2rem; margin-bottom: 0.8rem; font-weight: 800;">📈 Real Client SEO Growth Proof</h3>
          <img src="${src}" style="max-width: 100%; max-height: 80vh; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 15px 35px rgba(0,0,0,0.6);">
        </div>
      `);
    }
  },

  openBookMeetingModal() {
    if (typeof App !== 'undefined' && App.openModal) {
      App.openModal(`
        <div style="max-width: 540px; text-align: left; color: #0F172A; font-family: var(--font-body);">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #FF5555, #6025F5); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #FFF; margin-bottom: 0.8rem; box-shadow: 0 8px 20px rgba(96, 37, 245, 0.3);">
              📅
            </div>
            <h2 style="font-size: 1.8rem; font-weight: 900; color: #0F172A; margin: 0 0 0.4rem 0;">Book a 1-on-1 Strategy Call</h2>
            <p style="color: #64748B; font-size: 0.92rem; margin: 0;">Schedule a 30-min SEO roadmap & backlink consultation with our USA specialists.</p>
          </div>

          <form onsubmit="PublicWebsite.submitBookMeetingForm(event)">
            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">Full Name *</label>
              <input type="text" id="bm-name" required placeholder="e.g. Alex Morgan" style="width: 100%; border: 1px solid #CBD5E1; border-radius: 8px; padding: 0.65rem 0.9rem; font-size: 0.92rem; outline: none; font-weight: 600;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">Work Email *</label>
                <input type="email" id="bm-email" required placeholder="alex@company.com" style="width: 100%; border: 1px solid #CBD5E1; border-radius: 8px; padding: 0.65rem 0.9rem; font-size: 0.92rem; outline: none; font-weight: 600;">
              </div>
              <div>
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">Company / Website *</label>
                <input type="text" id="bm-company" required placeholder="company.com" style="width: 100%; border: 1px solid #CBD5E1; border-radius: 8px; padding: 0.65rem 0.9rem; font-size: 0.92rem; outline: none; font-weight: 600;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
              <div>
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">Preferred Date *</label>
                <input type="date" id="bm-date" required style="width: 100%; border: 1px solid #CBD5E1; border-radius: 8px; padding: 0.65rem 0.9rem; font-size: 0.92rem; outline: none; font-weight: 600;">
              </div>
              <div>
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">Time Slot (EST) *</label>
                <select id="bm-time" required style="width: 100%; border: 1px solid #CBD5E1; border-radius: 8px; padding: 0.65rem 0.9rem; font-size: 0.92rem; outline: none; font-weight: 600; background: #FFF;">
                  <option value="10:00 AM EST">10:00 AM EST</option>
                  <option value="01:00 PM EST">01:00 PM EST</option>
                  <option value="03:30 PM EST">03:30 PM EST</option>
                  <option value="05:00 PM EST">05:00 PM EST</option>
                </select>
              </div>
            </div>

            <button type="submit" id="book-meeting-submit" class="btn-meeting" style="width: 100%; padding: 0.85rem; font-size: 1rem; font-weight: 800; cursor: pointer;">
              🚀 Confirm & Schedule Strategy Call
            </button>
          </form>
        </div>
      `);
    }
  },

  submitBookMeetingForm(event) {
    if (event) event.preventDefault();
    const fullName = document.getElementById('bm-name')?.value || 'Client';
    const workEmail = document.getElementById('bm-email')?.value || 'No Email';
    const website = document.getElementById('bm-company')?.value || 'No Website';
    const date = document.getElementById('bm-date')?.value || 'Upcoming Date';
    const timeSlot = document.getElementById('bm-time')?.value || '10:00 AM EST';

    const adminEmail = (typeof GeneralSettingsEngine !== 'undefined' && GeneralSettingsEngine.state.adminEmail) || 'admin@spectrumseo.com';
    if (typeof EmailEngine !== 'undefined' && EmailEngine.sendEmail) {
      EmailEngine.sendEmail({
        to: adminEmail,
        subject: `📅 Strategy Call Booking: ${fullName}`,
        body: `Full Name: ${fullName}\nWork Email: ${workEmail}\nWebsite: ${website}\nDate: ${date}\nTime Slot: ${timeSlot}`
      });
    }

    if (typeof App !== 'undefined') {
      App.closeModal();
      App.showToast(`🎉 Strategy Call Confirmed for ${fullName} on ${date} at ${timeSlot}! Calendar invite sent.`);
    }
  },

  openBookingModal(pkgName = 'Growth SEO Plan ($2,500/mo)', presetDomain = '') {
    if (typeof App !== 'undefined' && App.openModal) {
      App.openModal(`
        <div style="max-width: 500px; text-align: left; color: #0F172A;">
          <h2 style="font-family: var(--font-heading); margin-bottom: 0.5rem; font-weight: 800;">Place Order / <span class="text-gradient">Book Session</span></h2>
          <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 1.2rem;">Selected Package: <strong>${pkgName}</strong></p>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">Your Full Name *</label>
            <input type="text" id="lead-name" class="form-control" placeholder="John Smith" style="width: 100%; padding: 0.65rem 0.9rem;">
          </div>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">Business Email Address *</label>
            <input type="email" id="lead-email" class="form-control" placeholder="john@smithdigital.com" style="width: 100%; padding: 0.65rem 0.9rem;">
          </div>
          <div class="form-group" style="margin-bottom: 1.2rem;">
            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.35rem;">Website Domain URL *</label>
            <input type="text" id="lead-domain" class="form-control" placeholder="smithdigital.com" value="${presetDomain}" style="width: 100%; padding: 0.65rem 0.9rem;">
          </div>
          <button class="btn-teal" style="width: 100%; margin-top: 0.5rem; padding: 0.85rem; font-size: 1rem; font-weight: 800; cursor: pointer;" onclick="PublicWebsite.submitBooking('${pkgName}')">
            🚀 Submit Order & Launch User Panel
          </button>
        </div>
      `);
    }
  },

  submitBooking(serviceName) {
    const name = document.getElementById('lead-name')?.value?.trim();
    const email = document.getElementById('lead-email')?.value?.trim();
    const domain = document.getElementById('lead-domain')?.value?.trim();

    if (!name || !email || !domain) {
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Please fill out all required fields.', 'error');
      }
      return;
    }

    const price = serviceName.includes('5,000') ? '$5,000.00' : '$2,500.00';

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      username: name,
      email: email,
      serviceName: serviceName,
      targetLink: domain.includes('http') ? domain : `https://${domain}`,
      charge: price,
      quantity: 1,
      status: 'Processing',
      orderDate: new Date().toLocaleString()
    };

    if (typeof AdminDashboard !== 'undefined' && AdminDashboard.state && AdminDashboard.state.orders) {
      AdminDashboard.state.orders.unshift(newOrder);
      if (AdminDashboard.saveOrders) AdminDashboard.saveOrders();
    }

    if (typeof App !== 'undefined') {
      App.closeModal();
      App.showToast(`Order #${newOrder.id} active! Launching User Dashboard...`);
      App.setMode('user');
    }
  },

  openRegisterModal() {
    if (typeof UserAuthEngine !== 'undefined') {
      UserAuthEngine.loadFormSettings();
    }

    const settings = (typeof UserAuthEngine !== 'undefined' && UserAuthEngine.formSettings) ? UserAuthEngine.formSettings : { masterEnable: true, fields: [] };

    if (!settings.masterEnable) {
      if (typeof App !== 'undefined' && App.openModal) {
        App.openModal(`
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚫</div>
            <h2 style="font-size: 1.3rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">Registrations Currently Closed</h2>
            <p style="color: #64748B; font-size: 0.9rem; max-width: 400px; margin: 0 auto 1.5rem auto;">New client account registrations have been temporarily disabled by the Administrator.</p>
            <button class="btn-teal" onclick="App.closeModal()">Understood</button>
          </div>
        `);
      }
      return;
    }

    const enabledFields = (settings.fields || []).filter(f => f.enabled);

    if (typeof App !== 'undefined' && App.openModal) {
      App.openModal(`
        <h2 style="font-family: var(--font-heading); margin-bottom: 0.4rem; color: #0F172A; font-weight: 800;">Create Client <span class="text-gradient">Account</span></h2>
        <p style="color: #64748B; font-size: 0.85rem; margin-bottom: 1.2rem;">Sign up to access your SEO Agency dashboard, track rankings, and order services.</p>

        <form id="public-signup-dynamic-form" onsubmit="event.preventDefault(); PublicWebsite.submitRegister();">
          <div style="display: flex; flex-direction: column; gap: 0.9rem;">
            ${enabledFields.map(f => `
              <div class="form-group" style="margin: 0;">
                <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">
                  ${f.label} ${f.required ? '<span style="color: #EF4444;">*</span>' : '<span style="color: #94A3B8; font-weight: normal;">(Optional)</span>'}
                </label>
                ${f.type === 'select' ? `
                  <select id="reg-field-${f.key}" class="form-control" ${f.required ? 'required' : ''}>
                    ${(f.options || []).map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                  </select>
                ` : `
                  <input type="${f.type}" id="reg-field-${f.key}" class="form-control" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}>
                `}
              </div>
            `).join('')}

            <div class="form-group" style="margin: 0;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.3rem;">
                Password <span style="color: #EF4444;">*</span>
              </label>
              <input type="password" id="reg-field-password" class="form-control" placeholder="••••••••" required minlength="6">
            </div>

            <button class="btn-teal" type="submit" style="width: 100%; padding: 0.85rem; font-size: 1rem; font-weight: 800; margin-top: 0.5rem; cursor: pointer;">
              ✍️ Complete Signup & Access Dashboard
            </button>
          </div>
        </form>

        <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: #64748B;">
          Forgot your password? <a href="#" style="color: #00ACC1; font-weight: bold; text-decoration: underline;" onclick="EmailEngine.openForgotPasswordModal()">🔑 Reset Password via Email OTP</a>
        </div>
      `);
    }
  },

  async submitRegister() {
    if (typeof UserAuthEngine !== 'undefined') {
      UserAuthEngine.loadFormSettings();
    }
    const settings = (typeof UserAuthEngine !== 'undefined' && UserAuthEngine.formSettings) ? UserAuthEngine.formSettings : { fields: [] };
    const enabledFields = (settings.fields || []).filter(f => f.enabled);

    const formData = {};
    let missingRequired = false;

    enabledFields.forEach(f => {
      const el = document.getElementById(`reg-field-${f.key}`);
      const val = el ? el.value.trim() : '';
      formData[f.key] = val;
      if (f.required && !val) {
        missingRequired = true;
      }
    });

    const passwordEl = document.getElementById('reg-field-password');
    formData.password = passwordEl ? passwordEl.value : '';
    if (!formData.password) missingRequired = true;

    if (missingRequired) {
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Please fill out all required fields marked with *', 'error');
      }
      return;
    }

    const firstName = formData.firstName || '';
    const lastName = formData.lastName || '';
    formData.fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : (formData.username || 'Client');

    if (typeof UserAuthEngine !== 'undefined' && UserAuthEngine.handleSignup) {
      const res = await UserAuthEngine.handleSignup(formData);
      if (res.success) {
        if (typeof App !== 'undefined') {
          App.closeModal();
          App.showToast(`🎉 Registration successful! Welcome ${res.user.fullName}!`);
          App.setMode('user');
        }
      } else {
        if (typeof App !== 'undefined' && App.showToast) {
          App.showToast(res.message, 'error');
        }
      }
    }
  },

  // --------------------------------------------------------------------------
  // 5. Utility Animations & Glow
  // --------------------------------------------------------------------------
  initMouseGlowEngine() {
    // Disabled mouse glow follower as per user request
  },

  initScrollAnimations() {
      // 1. GSAP & ScrollTrigger Clean Initialization
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Canvas Scroll Scrubbing Binding
        this._canvasScrollState = {
          progress: 0,
          rotX: 0,
          rotY: 0,
          scale: 1,
          density: 1
        };

        const triggerTarget = document.querySelector('.public-layout') || document.body;

        if (this._canvasScrollTrigger) {
          try { this._canvasScrollTrigger.kill(); } catch (e) {}
        }

        this._canvasScrollTrigger = gsap.to(this._canvasScrollState, {
          progress: 1,
          rotX: Math.PI * 2.5,
          rotY: Math.PI * 3.5,
          scale: 1.5,
          density: 1.8,
          ease: "none",
          scrollTrigger: {
            trigger: triggerTarget,
            start: "top top",
            end: "bottom bottom",
            scrub: 1
          }
        });

        // 2. GSAP ScrollTrigger timeline reveals (gsap.from())
        // a. Scrollytelling cards
        gsap.utils.toArray('.webgl-stage-card').forEach((card, index) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        // b. ROI Calculator box
        const roiCard = document.querySelector('#roi-calculator .calculator-card') || document.querySelector('#roi-calculator [style*="grid"]');
        if (roiCard) {
          gsap.from(roiCard, {
            y: 60,
            opacity: 0,
            scale: 0.95,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: roiCard,
              start: 'top 82%',
              toggleActions: 'play none none reverse'
            }
          });
        }

        // c. Services cards
        gsap.utils.toArray('#services .glass-card').forEach((card, index) => {
          gsap.from(card, {
            y: 45,
            opacity: 0,
            scale: 0.95,
            duration: 0.75,
            delay: (index % 3) * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        // d. Team member cards
        gsap.utils.toArray('.team-card').forEach((card, index) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        // e. FAQ items
        gsap.utils.toArray('.faq-item').forEach((faq, index) => {
          gsap.from(faq, {
            y: 35,
            opacity: 0,
            duration: 0.65,
            delay: index * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: faq,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        ScrollTrigger.refresh();
      }

      // IntersectionObserver Fallback for reveal states
      const revealElements = document.querySelectorAll('.scroll-reveal-up, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => observer.observe(el));
      } else {
        revealElements.forEach(el => el.classList.add('revealed'));
      }

      window.addEventListener('scroll', () => {
        const bar = document.getElementById('scroll-progress-bar');
        if (!bar) return;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (height > 0) ? (winScroll / height) * 100 : 0;
        bar.style.width = scrolled + '%';
      });
  },

  // --------------------------------------------------------------------------
  // Hero V2 — Premium Cinematic Load Sequence + Parallax + GSAP Scroll
  // --------------------------------------------------------------------------
  initHeroV2() {
    this.initHeroFullBgCanvas();
    const hero = document.getElementById('hero');
    if (!hero) return;

    const heroNav   = document.getElementById('hero-navbar');
    const centerPill = document.getElementById('nav-center-pill');
    const brandName  = document.getElementById('nav-brand-name');
    const circleBar  = document.getElementById('nav-scroll-circle-bar');
    const circleDot  = document.getElementById('nav-scroll-circle-dot');

    let idleAnimTime = 0;
    const animateIdleGlow = () => {
      const scrolled = window.scrollY;
      if (scrolled < 70 && circleBar && typeof circleBar.getTotalLength === 'function') {
        const length = circleBar.getTotalLength();
        idleAnimTime += 2; // Speed of the looping animation
        const start_pos = idleAnimTime % length;
        const W = 80; // Length of the trailing white line
        
        circleBar.style.strokeDasharray = `${W} ${Math.max(0, length - W)}`;
        circleBar.style.strokeDashoffset = -start_pos;
        
        if (circleDot) {
          circleDot.style.strokeDasharray = `0.1 ${Math.max(0, length - 0.1)}`;
          circleDot.style.strokeDashoffset = -(start_pos + W);
        }
      }
      requestAnimationFrame(animateIdleGlow);
    };
    animateIdleGlow();

    window.addEventListener('scroll', () => {
      const scrolled  = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio     = Math.min(1, Math.max(0, scrolled / maxScroll));

      // Only apply scroll progress if we are scrolled past the hero section
      if (scrolled >= 70 && circleBar && typeof circleBar.getTotalLength === 'function') {
        const length = circleBar.getTotalLength();
        const W = length * ratio;
        
        circleBar.style.strokeDasharray = `${W} ${Math.max(0, length - W)}`;
        circleBar.style.strokeDashoffset = 0;
        
        if (circleDot) {
          circleDot.style.strokeDasharray = `0.1 ${Math.max(0, length - 0.1)}`;
          circleDot.style.strokeDashoffset = -W;
        }
      }
      if (heroNav && centerPill && brandName) {
        if (scrolled > 70) {
          heroNav.classList.add('docked');
          centerPill.classList.add('collapsed');
        } else {
          heroNav.classList.remove('docked');
          centerPill.classList.remove('collapsed');
        }
      }
    }, { passive: true });

    // ── STEP 1–8: Cinematic Load Sequence ──────────────────────────────────
    // Collect all animatable elements in the hero
    const animEls = hero.querySelectorAll('.hero-v2__anim');

    // Trigger reveal after a tiny paint delay so transitions actually run
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animEls.forEach(el => el.classList.add('h-revealed'));
      });
    });

    // ── Scroll Cue: hide when user scrolls ──────────────────────────────────
    const scrollCue = document.getElementById('hero-scroll-cue');
    const onScroll = () => {
      if (!scrollCue) return;
      if (window.scrollY > 80) {
        scrollCue.classList.add('hidden');
      } else {
        scrollCue.classList.remove('hidden');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── MOUSE PARALLAX ──────────────────────────────────────────────────────
    if (!this._heroParallaxBound) {
      this._heroParallaxBound = true;

      // Detect reduced-motion preference
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        let mouseX = 0, mouseY = 0;
        let rafId = null;

        const seoCore = document.getElementById('seo-core');
        const floatCards = hero.querySelectorAll('.hero-v2__float-card');
        const auditCard  = document.getElementById('hero-audit-card');
        const bgOrbs     = hero.querySelectorAll('.hero-v2__orb');

        const applyParallax = () => {
          // Normalized mouse: -1 to +1
          const nx = (mouseX / window.innerWidth  - 0.5) * 2;
          const ny = (mouseY / window.innerHeight - 0.5) * 2;

          // SEO Core — subtle 3D tilt
          if (seoCore) {
            seoCore.style.transform = `rotateX(${ny * -6}deg) rotateY(${nx * 8}deg)`;
          }

          // Floating cards — different depth layers
          floatCards.forEach((card, i) => {
            const depth = (i % 2 === 0) ? 10 : 7;
            const dx = nx * depth;
            const dy = ny * depth;
            card.style.transform = `translate(${dx}px, ${dy}px)`;
          });

          // Audit card — very subtle
          if (auditCard) {
            auditCard.style.transform = `translate(${nx * 3.5}px, ${ny * 2.5}px)`;
          }

          // Background orbs — slow drift
          bgOrbs.forEach((orb, i) => {
            const d = (i + 1) * 12;
            orb.style.transform = `translate(${nx * d}px, ${ny * d * 0.7}px)`;
          });

          rafId = null;
        };

        document.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (!rafId) rafId = requestAnimationFrame(applyParallax);
        }, { passive: true });
      }
    }

    // ── GSAP SCROLL-DRIVEN HERO PHASES ─────────────────────────────────────
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    // Kill old hero triggers if re-initialised
    this._heroScrollTriggers.forEach(t => { try { t.kill(); } catch(e) {} });
    this._heroScrollTriggers = [];

    const leftCol  = document.getElementById('hero-left-col');
    const rightCol = document.getElementById('hero-right-col');
    const seoCore2 = document.getElementById('seo-core');
    const auditCard2 = document.getElementById('hero-audit-card');

    // Phase 1: Headline + CTA slide up as hero exits
    if (leftCol) {
      const t1 = gsap.to(leftCol, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '40% top',
          scrub: 1.4
        }
      });
      this._heroScrollTriggers.push(t1.scrollTrigger);
    }

    // Phase 2 & 3: SEO Core rotates + scales on scroll
    if (seoCore2) {
      const t2 = gsap.to(seoCore2, {
        rotationY: 180,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '60% top',
          scrub: 1.8
        }
      });
      this._heroScrollTriggers.push(t2.scrollTrigger);
    }

    // Phase 5: Audit card slightly comes forward
    if (auditCard2) {
      const t3 = gsap.to(auditCard2, {
        scale: 1.03,
        boxShadow: '0 32px 80px rgba(90,15,160,0.28)',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '35% top',
          scrub: 1
        }
      });
      this._heroScrollTriggers.push(t3.scrollTrigger);
    }

    // Phase 6: Right column scale-down
    if (rightCol) {
      const t4 = gsap.to(rightCol, {
        scale: 0.94,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: '20% top',
          end: '70% top',
          scrub: 2
        }
      });
      this._heroScrollTriggers.push(t4.scrollTrigger);
    }

    ScrollTrigger.refresh();
  },

  getFallbackLandingHtml(navLinksHtml, servicesGridHtml) {
    return `
      <div class="public-layout">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-tag">
            <span>✨ Ranked #1 SEO & Organic Growth Agency</span>
          </div>
          <h1 class="hero-title">
            Dominate Search Engine Rankings & <br>
            <span class="text-gradient">Scale Organic Revenue 10X</span>
          </h1>
          <p class="hero-subtitle">
            We help ambitious brands turn search traffic into millions in revenue using data-backed technical SEO, high-authority digital PR, and conversion-focused content strategies.
          </p>

          <div class="hero-audit-form" id="audit-tool">
            <input type="url" id="hero-audit-input" placeholder="Enter your website URL (e.g. yourcompany.com)" required>
            <button class="btn-gradient" onclick="PublicWebsite.runLiveAudit()">
              <span>⚡ Analyze Website Free</span>
            </button>
          </div>

          <div id="scan-progress-container" class="glass-card scan-progress-box" style="max-width: 650px; margin: 1.5rem auto 0 auto; display: none;">
            <div style="display: flex; justify-content: space-between; font-weight: 700;">
              <span id="scan-step-text" style="color: #F472B6;">Initiating Crawler engines...</span>
              <span id="scan-percentage" style="color: #FB923C;">0%</span>
            </div>
            <div class="progress-bar-track">
              <div id="scan-progress-bar" class="progress-bar-fill"></div>
            </div>
          </div>

          <div id="audit-results-display" class="glass-card audit-results-panel" style="max-width: 900px; margin: 2rem auto 0 auto; display: none;">
          </div>
        </section>

        <!-- Services Grid -->
        <section id="services" style="max-width: 1200px; margin: 0 auto; padding: 4rem 1.5rem;">
          <h2 style="font-size: 2.2rem; font-weight: 800; text-align: center; margin-bottom: 0.5rem; color: #FFF;">High-Impact <span class="text-gradient">SEO Services</span></h2>
          <p style="text-align: center; color: #9CA3AF; max-width: 600px; margin: 0 auto 3rem auto;">Choose from our enterprise organic growth solutions.</p>
          ${servicesGridHtml}
        </section>

        <!-- Interactive ROI Calculator Section -->
        <section id="roi-calculator" class="roi-calculator-section" style="padding: 5rem 1.5rem; max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 2.5rem;">
            <div class="hero-tag">📈 Interactive Revenue Projection</div>
            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; color: #FFF;">
              Calculate Your Potential <span class="text-gradient">SEO Growth</span>
            </h2>
            <p style="color: #9CA3AF;">Adjust the sliders below to estimate your 6 to 12-month organic revenue bump.</p>
          </div>

          <div class="glass-card calculator-card" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
            <div>
              <div class="slider-group" style="margin-bottom: 1.8rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #FFF; font-weight: 700;">
                  <span>Current Monthly Organic Visitors</span>
                  <span id="val-traffic" class="text-gradient" style="font-weight: 800; font-size: 1.1rem;">25,000</span>
                </div>
                <input type="range" id="range-traffic" class="custom-range" min="2000" max="200000" step="1000" value="25000" oninput="PublicWebsite.updateRoiCalculations()" style="width: 100%;">
              </div>

              <div class="slider-group" style="margin-bottom: 1.8rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #FFF; font-weight: 700;">
                  <span>Website Lead / Ecomm Conversion Rate (%)</span>
                  <span id="val-conv" style="font-weight: 800; color: #F472B6; font-size: 1.1rem;">2.5%</span>
                </div>
                <input type="range" id="range-conv" class="custom-range" min="0.5" max="8.0" step="0.1" value="2.5" oninput="PublicWebsite.updateRoiCalculations()" style="width: 100%;">
              </div>

              <div class="slider-group" style="margin-bottom: 1.8rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #FFF; font-weight: 700;">
                  <span>Average Deal / Customer Lifetime Value ($)</span>
                  <span id="val-aov" style="font-weight: 800; color: #FB923C; font-size: 1.1rem;">$450</span>
                </div>
                <input type="range" id="range-aov" class="custom-range" min="50" max="5000" step="50" value="450" oninput="PublicWebsite.updateRoiCalculations()" style="width: 100%;">
              </div>
            </div>

            <div class="roi-output-box" style="background: rgba(0,0,0,0.4); padding: 2.2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.12);">
              <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; font-weight: 700;">Projected 12-Month Organic Revenue</div>
              <div id="output-projected-rev" class="text-gradient" style="font-size: 3rem; font-weight: 900; margin: 0.5rem 0 1.2rem 0;">
                +$337,500
              </div>
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <div style="font-size: 0.8rem; color: #9CA3AF;">Estimated New Visitors</div>
                  <div id="output-new-traffic" style="font-size: 1.3rem; font-weight: 800; color: #FFF;">+75,000 /mo</div>
                </div>
                <div>
                  <div style="font-size: 0.8rem; color: #9CA3AF;">Estimated New Leads</div>
                  <div id="output-new-leads" style="font-size: 1.3rem; font-weight: 800; color: #34D399;">+1,875 /mo</div>
                </div>
              </div>
              <button class="btn-gradient" style="margin-top: 1.5rem; width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem; font-weight: 800;" onclick="PublicWebsite.openBookMeetingModal()">
                Claim Your Custom Growth Blueprint →
              </button>
            </div>
          </div>
        </section>

        <!-- Client Proof Gallery Section -->
        <section id="results" style="padding: 5.5rem 1.5rem; background: #0F172A; color: #FFF;">
          <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
            <div class="scroll-reveal-up" style="margin-bottom: 2.5rem;">
              <span style="background: rgba(0, 172, 193, 0.12); border: 1px solid #00ACC1; color: #00ACC1; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px; text-transform: uppercase;">
                📈 PROVEN SEARCH CONSOLE PROOF
              </span>
              <h2 style="font-size: 2.5rem; font-weight: 900; color: #FFF; margin: 1rem 0 0.5rem 0;">Real Client <span style="color: #00ACC1;">SEO Proof Gallery</span></h2>
              <p style="color: #94A3B8; font-size: 1.05rem; max-width: 650px; margin: 0 auto;">Click any screenshot below to inspect full resolution Google Search Console traffic spike graphs.</p>
            </div>

            <!-- Main Display Box & Thumbnail Gallery -->
            <div class="scroll-reveal-scale" style="max-width: 950px; margin: 0 auto 2.5rem auto;">
              <div id="proof-main-display" style="background: #0F172A; border-radius: 20px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25); position: relative; transition: opacity 0.35s ease, transform 0.35s ease;">
                <div style="position: relative; height: 420px; overflow: hidden;">
                  <img id="proof-main-img" src="https://i.ibb.co/cSJSXHnv/HEZZdvia-IAAGa67.jpg" alt="SEO Proof Main" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" onclick="PublicWebsite.openImageLightbox(this.src)">
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 60%, transparent 100%); padding: 1.8rem 2rem; text-align: left;">
                    <h3 id="proof-main-title" style="font-size: 1.35rem; font-weight: 800; color: #FFF; margin-bottom: 0.3rem;">📈 Organic Search Traffic Spike (+350% Impressions)</h3>
                    <p id="proof-main-subtitle" style="font-size: 0.9rem; color: #94A3B8; margin: 0;">Client E-Commerce Platform - Verified Google Search Console Data</p>
                  </div>
                </div>
              </div>

              <!-- Thumbnail Grid Navigation -->
              <div id="proof-thumbnails" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1.2rem;"></div>
            </div>
          </div>
        </section>

        <!-- FAQ Accordion Section -->
        <section id="faq-section" style="padding: 5rem 1.5rem; max-width: 1000px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 3.5rem;">
            <span style="background: rgba(168, 85, 247, 0.15); border: 1px solid #A855F7; color: #C084FC; font-weight: 700; font-size: 0.82rem; padding: 0.35rem 1rem; border-radius: 20px;">
              ❓ FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style="font-size: 2.3rem; font-weight: 800; color: #FFF; margin: 1rem 0 0.5rem 0;">Got Questions? <span class="text-gradient">We've Got Answers</span></h2>
            <p style="color: #9CA3AF; font-size: 1rem;">Everything you need to know about our organic search engine strategy and delivery guarantees.</p>
          </div>

          <div class="faq-accordion-container" style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="faq-item glass-card" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; cursor: pointer;" onclick="PublicWebsite.toggleFaq(this)">
              <div style="padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #FFF; font-size: 1.05rem;">
                <span>⚡ How fast will my website see ranking improvements?</span>
                <span class="faq-icon" style="font-size: 1.3rem; transition: transform 0.3s ease; color: #00ACC1;">+</span>
              </div>
              <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.25rem 1.5rem; color: #9CA3AF; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 0.5rem;">
                Initial indexing and ranking movements typically occur within 14 to 30 days of campaign deployment. High-competition keywords usually see compound growth within 60 to 90 days as domain authority builds.
              </div>
            </div>

            <div class="faq-item glass-card" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; cursor: pointer;" onclick="PublicWebsite.toggleFaq(this)">
              <div style="padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #FFF; font-size: 1.05rem;">
                <span>🔗 Are the backlinks 100% white-hat and Google algorithm safe?</span>
                <span class="faq-icon" style="font-size: 1.3rem; transition: transform 0.3s ease; color: #00ACC1;">+</span>
              </div>
              <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.25rem 1.5rem; color: #9CA3AF; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 0.5rem;">
                Yes, 100%. We acquire editorial link placements on real traffic US publications with verified organic search traffic. Zero PBNs, zero spam networks, and zero automated link spam.
              </div>
            </div>

            <div class="faq-item glass-card" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; cursor: pointer;" onclick="PublicWebsite.toggleFaq(this)">
              <div style="padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #FFF; font-size: 1.05rem;">
                <span>📊 How do I track deliverable progress and keyword rankings?</span>
                <span class="faq-icon" style="font-size: 1.3rem; transition: transform 0.3s ease; color: #00ACC1;">+</span>
              </div>
              <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.25rem 1.5rem; color: #9CA3AF; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 0.5rem;">
                Upon placing an order, you gain instant access to your Client Portal Dashboard where live status updates, live GSC links, keyword reports, and downloadable PDF audits are available 24/7.
              </div>
            </div>
          </div>
        </section>

        <footer class="public-footer">
          <p>© 2026 SPECTRUM SEO Agency. All Rights Reserved. Powered by Spectrum Panel Engine.</p>
        </footer>
      </div>
    `;
  },

  handleHeroLogin(event) {
    if (event) event.preventDefault();
    const emailEl = document.getElementById('hero-login-email');
    const passEl  = document.getElementById('hero-login-pass');
    const errEl   = document.getElementById('hero-login-error');
    const btnEl   = document.getElementById('hero-login-submit');

    if (!emailEl || !passEl) return;

    const identifier = emailEl.value.trim();
    const password   = passEl.value;

    if (!identifier || !password) {
      if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Please fill in all fields.'; }
      return;
    }

    if (btnEl) { btnEl.disabled = true; btnEl.textContent = '⏳ Signing in...'; }
    if (errEl) errEl.style.display = 'none';

    // Simulate async login (replace with real auth call)
    setTimeout(() => {
      try {
        // Try to find user in localStorage users list
        const users = JSON.parse(localStorage.getItem('seo_users') || '[]');
        const user = users.find(u =>
          (u.email === identifier || u.username === identifier) &&
          u.password === password &&
          u.status !== 'Disabled'
        );

        if (user) {
          try { localStorage.setItem('seo_logged_user', JSON.stringify(user)); } catch(e) {}
          try { localStorage.setItem('app_active_mode', 'user'); } catch(e) {}
          if (typeof App !== 'undefined') App.setMode('user');
        } else {
          if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Invalid credentials. Please try again.'; }
          if (btnEl) { btnEl.disabled = false; btnEl.textContent = '🚀 Sign In to Dashboard'; }
        }
      } catch(e) {
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Login error. Please try again.'; }
        if (btnEl) { btnEl.disabled = false; btnEl.textContent = '🚀 Sign In to Dashboard'; }
      }
    }, 600);
  },

  renderServicesPage() {
    const settings = typeof GeneralSettingsEngine !== 'undefined' ? GeneralSettingsEngine.state : {};
    const siteName = settings.siteName || 'Spectrum SEO';

    // Get services from admin
    let services = [];
    let categories = [];
    try {
      if (typeof AdminDashboard !== 'undefined') {
        services   = (AdminDashboard.state.servicesList || []).filter(s => s.status === 'Active' || s.isActive);
        categories = (AdminDashboard.state.categories   || []).filter(c => c.status === 'Active' || c.isActive);
      }
    } catch(e) {}

    const catOptions = ['All', ...new Set(services.map(s => s.category || s.categoryName || 'General').filter(Boolean))];

    const serviceCards = services.length > 0 ? services.map(s => {
      const name     = SecurityEngine.sanitizeHTML(s.name || s.serviceName || 'SEO Service');
      const desc     = SecurityEngine.sanitizeHTML(s.description || s.desc || 'Professional SEO service to boost your rankings.');
      const price    = s.price || s.rate || '0';
      const minPrice = s.minPrice || s.minOrder || '';
      const category = SecurityEngine.sanitizeHTML(s.category || s.categoryName || 'General');
      return `
        <div class="svc-card" data-category="${category}">
          <div class="svc-card__header">
            <span class="svc-card__cat">${category}</span>
          </div>
          <h3 class="svc-card__name">${name}</h3>
          <p class="svc-card__desc">${desc}</p>
          <div class="svc-card__meta">
            <span class="svc-card__price">$${parseFloat(price).toFixed(2)} <small>/ unit</small></span>
            ${minPrice ? `<span class="svc-card__min">Min: ${minPrice}</span>` : ''}
          </div>
          <button class="svc-card__order-btn" onclick="PublicWebsite.handleOrderNow('${name.replace(/'/g,"\\'")}')">
            Order Now →
          </button>
        </div>`;
    }).join('') : `<div class="svc-empty"><p>No services available at this time.</p><button class="hero-v2__btn-primary" onclick="PublicWebsite.navigateTo('home')">← Back to Home</button></div>`;

    return `
      <div class="public-page services-page">
        <!-- Navbar -->
        <nav class="svc-navbar">
          <a href="javascript:void(0)" class="svc-navbar__logo" onclick="PublicWebsite.navigateTo('home')">
            <span style="background:linear-gradient(135deg,#7B2FFF,#FF4DB8);color:#fff;width:36px;height:36px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:900;">⚡</span>
            <span class="site-name" style="font-weight:900;font-size:1.1rem;color:#1A0A3C;">BACKLINK<span style="color:#B52090;">FASTER</span></span>
          </a>
          <div class="svc-navbar__actions">
            <a href="javascript:void(0)" class="svc-navbar__link" onclick="PublicWebsite.navigateTo('home')">← Home</a>
            <button class="hero-v2__nav-btn-signup" onclick="PublicWebsite.navigateTo('login')" style="font-size:0.82rem;padding:0.45rem 1rem;">Sign In</button>
            <button class="hero-v2__nav-btn-signup" onclick="PublicWebsite.navigateTo('register')" style="font-size:0.82rem;padding:0.45rem 1rem;">Register</button>
          </div>
        </nav>

        <!-- Hero Banner -->
        <div class="svc-hero">
          <div class="svc-hero__orb svc-hero__orb--1"></div>
          <div class="svc-hero__orb svc-hero__orb--2"></div>
          <div class="svc-hero__content">
            <span class="hero-v2__badge" style="margin-bottom:1rem;"><span class="hero-v2__badge-dot"></span>ALL SERVICES</span>
            <h1 class="svc-hero__title">Our <span style="color:#FFB347;">SEO Services</span></h1>
            <p class="svc-hero__sub">Premium data-driven SEO solutions to dominate Google rankings</p>
            <!-- Search -->
            <div class="svc-search-wrap">
              <input type="search" id="svc-search" class="svc-search" placeholder="🔍 Search services..." oninput="PublicWebsite.filterServices()" aria-label="Search services">
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="svc-filters" id="svc-filter-bar">
          ${catOptions.map((cat, i) => `<button class="svc-filter-btn${i===0?' active':''}" data-filter="${cat}" onclick="PublicWebsite.filterByCategory('${cat}', this)">${cat}</button>`).join('')}
        </div>

        <!-- Grid -->
        <div class="svc-grid" id="svc-grid">
          ${serviceCards}
        </div>
      </div>`;
  },

  initServicesPage() {
    if (typeof GeneralSettingsEngine !== 'undefined') GeneralSettingsEngine.applySettings();
  },

  filterServices() {
    const query = (document.getElementById('svc-search')?.value || '').toLowerCase();
    const cards  = document.querySelectorAll('.svc-card');
    const active = document.querySelector('.svc-filter-btn.active')?.dataset.filter || 'All';
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cat  = card.dataset.category || '';
      const matchSearch = !query || text.includes(query);
      const matchCat    = active === 'All' || cat === active;
      card.style.display = (matchSearch && matchCat) ? '' : 'none';
    });
  },

  filterByCategory(cat, btn) {
    document.querySelectorAll('.svc-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const query = (document.getElementById('svc-search')?.value || '').toLowerCase();
    document.querySelectorAll('.svc-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      const cardCat = card.dataset.category || '';
      const matchSearch = !query || text.includes(query);
      const matchCat    = cat === 'All' || cardCat === cat;
      card.style.display = (matchSearch && matchCat) ? '' : 'none';
    });
  },

  handleOrderNow(serviceName) {
    const isLoggedIn = !!localStorage.getItem('seo_logged_user');
    if (!isLoggedIn) {
      this.navigateTo('login');
      return;
    }
    // If logged in, go to user dashboard new order
    if (typeof App !== 'undefined') {
      App.setMode('user');
    }
  },

  renderLoginPage() {
    return `
      <div class="auth-page">
        <div class="auth-page__bg">
          <div class="hero-v2__orb hero-v2__orb--1" style="opacity:0.35"></div>
          <div class="hero-v2__orb hero-v2__orb--2" style="opacity:0.25"></div>
        </div>
        <div class="auth-card">
          <div class="auth-card__logo">
            <span style="background:linear-gradient(135deg,#7B2FFF,#FF4DB8);color:#fff;width:48px;height:48px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;box-shadow:0 4px 18px rgba(123,47,255,0.4);">⚡</span>
            <span class="site-name" style="font-weight:900;font-size:1.25rem;color:#1A0A3C;">BACKLINK<span style="color:#B52090;">FASTER</span></span>
          </div>
          <h1 class="auth-card__title">Welcome Back</h1>
          <p class="auth-card__sub">Sign in to your client dashboard</p>
          <div id="login-error" class="hero-v2__login-error" role="alert" style="display:none;margin-bottom:1rem;"></div>
          <form id="login-page-form" onsubmit="event.preventDefault(); PublicWebsite.submitLoginPage();" novalidate>
            <div class="auth-field">
              <label for="login-email" class="hero-v2__login-label">Email or Username *</label>
              <input type="text" id="login-email" class="hero-v2__login-input" placeholder="your@email.com" autocomplete="username" required>
            </div>
            <div class="auth-field">
              <label for="login-pass" class="hero-v2__login-label">Password *</label>
              <input type="password" id="login-pass" class="hero-v2__login-input" placeholder="••••••••" autocomplete="current-password" required>
            </div>
            <button type="submit" class="hero-v2__login-btn" id="login-page-btn" style="margin-top:0.5rem;">
              🚀 Sign In to Dashboard
            </button>
          </form>
          <p class="hero-v2__login-register" style="margin-top:1.2rem;">
            Don't have an account?
            <a href="javascript:void(0)" onclick="PublicWebsite.navigateTo('register')">Register Free →</a>
          </p>
          <p style="text-align:center;margin-top:0.5rem;">
            <a href="javascript:void(0)" onclick="PublicWebsite.navigateTo('home')" style="font-size:0.78rem;color:#7B2FFF;font-weight:600;">← Back to Home</a>
          </p>
        </div>
      </div>`;
  },

  initLoginPage() {
    if (typeof GeneralSettingsEngine !== 'undefined') GeneralSettingsEngine.applySettings();
  },

  submitLoginPage() {
    const emailEl = document.getElementById('login-email');
    const passEl  = document.getElementById('login-pass');
    const errEl   = document.getElementById('login-error');
    const btnEl   = document.getElementById('login-page-btn');
    if (!emailEl || !passEl) return;

    const identifier = emailEl.value.trim();
    const password   = passEl.value;
    if (!identifier || !password) {
      if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Please fill in all fields.'; }
      return;
    }

    if (btnEl) { btnEl.disabled = true; btnEl.textContent = '⏳ Signing in...'; }
    if (errEl) errEl.style.display = 'none';

    setTimeout(() => {
      if (typeof UserAuthEngine !== 'undefined') {
        const res = UserAuthEngine.attemptUserLogin(identifier, password);
        if (res.success) {
          if (typeof App !== 'undefined') App.setMode('user');
        } else {
          if (errEl) { errEl.style.display = 'block'; errEl.textContent = res.message; }
          if (btnEl) { btnEl.disabled = false; btnEl.textContent = '🚀 Sign In to Dashboard'; }
        }
      } else {
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Authentication engine unavailable.'; }
        if (btnEl) { btnEl.disabled = false; btnEl.textContent = '🚀 Sign In to Dashboard'; }
      }
    }, 400);
  },

  renderRegisterPage() {
    const fields = (typeof UserAuthEngine !== 'undefined' && UserAuthEngine.formSettings?.fields)
      ? UserAuthEngine.formSettings.fields.filter(f => f.enabled)
      : [
          { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true },
          { key: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Smith', required: true },
          { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
          { key: 'username', label: 'Username', type: 'text', placeholder: 'johnsmith101', required: true }
        ];

    const formFields = fields.map(f => {
      const label  = SecurityEngine.sanitizeHTML(f.label || '');
      const req    = f.required ? ' *' : '';
      const reqAttr = f.required ? 'required' : '';
      const ph     = SecurityEngine.sanitizeHTML(f.placeholder || '');
      const ftype  = f.type || 'text';
      const fkey   = f.key || '';
      if (f.type === 'select' && f.options) {
        const opts = (f.options || []).map(o => {
          const ov = SecurityEngine.sanitizeHTML(String(o));
          return '<option value="' + ov + '">' + ov + '</option>';
        }).join('');
        return '<div class="auth-field">' +
          '<label for="reg-' + fkey + '" class="hero-v2__login-label">' + label + req + '</label>' +
          '<select id="reg-' + fkey + '" class="hero-v2__login-input" ' + reqAttr + '>' +
            '<option value="">Select...</option>' + opts +
          '</select></div>';
      }
      return '<div class="auth-field">' +
        '<label for="reg-' + fkey + '" class="hero-v2__login-label">' + label + req + '</label>' +
        '<input type="' + ftype + '" id="reg-' + fkey + '" class="hero-v2__login-input" placeholder="' + ph + '" ' + reqAttr + ' autocomplete="' + fkey + '">' +
        '</div>';
    }).join('');

    return `
      <div class="auth-page">
        <div class="auth-page__bg">
          <div class="hero-v2__orb hero-v2__orb--1" style="opacity:0.35"></div>
          <div class="hero-v2__orb hero-v2__orb--2" style="opacity:0.25"></div>
        </div>
        <div class="auth-card auth-card--wide">
          <div class="auth-card__logo">
            <span style="background:linear-gradient(135deg,#7B2FFF,#FF4DB8);color:#fff;width:48px;height:48px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;box-shadow:0 4px 18px rgba(123,47,255,0.4);">⚡</span>
            <span class="site-name" style="font-weight:900;font-size:1.25rem;color:#1A0A3C;">BACKLINK<span style="color:#B52090;">FASTER</span></span>
          </div>
          <h1 class="auth-card__title">Create Account</h1>
          <p class="auth-card__sub">Start growing your search traffic today</p>
          <div id="reg-error" class="hero-v2__login-error" role="alert" style="display:none;margin-bottom:1rem;"></div>
          <div id="reg-success" style="display:none;background:#ECFDF5;border:1px solid #6EE7B7;color:#065F46;padding:0.75rem 1rem;border-radius:10px;font-size:0.84rem;margin-bottom:1rem;font-weight:600;"></div>
          <form id="register-page-form" onsubmit="event.preventDefault(); PublicWebsite.submitRegisterPage();" novalidate>
            <div class="auth-fields-grid">
              ${formFields}
              <div class="auth-field auth-field--full">
                <label for="reg-password" class="hero-v2__login-label">Password *</label>
                <input type="password" id="reg-password" class="hero-v2__login-input" placeholder="Min 8 characters" required autocomplete="new-password">
              </div>
            </div>
            <button type="submit" class="hero-v2__login-btn" id="reg-btn" style="margin-top:0.75rem;">
              ✍️ Create My Account
            </button>
          </form>
          <p class="hero-v2__login-register" style="margin-top:1rem;">
            Already have an account?
            <a href="javascript:void(0)" onclick="PublicWebsite.navigateTo('login')">Sign In →</a>
          </p>
          <p style="text-align:center;margin-top:0.5rem;">
            <a href="javascript:void(0)" onclick="PublicWebsite.navigateTo('home')" style="font-size:0.78rem;color:#7B2FFF;font-weight:600;">← Back to Home</a>
          </p>
        </div>
      </div>`;
  },

  initRegisterPage() {
    if (typeof GeneralSettingsEngine !== 'undefined') GeneralSettingsEngine.applySettings();
  },

  async submitRegisterPage() {
    const errEl     = document.getElementById('reg-error');
    const successEl = document.getElementById('reg-success');
    const btnEl     = document.getElementById('reg-btn');

    const firstName = document.getElementById('reg-firstName')?.value.trim() || '';
    const lastName  = document.getElementById('reg-lastName')?.value.trim() || '';
    const fullName  = ((firstName + ' ' + lastName).trim()) || 'New Client User';
    const email     = document.getElementById('reg-email')?.value.trim().toLowerCase() || '';
    const username  = document.getElementById('reg-username')?.value.trim().toLowerCase() || email.split('@')[0];
    const password  = document.getElementById('reg-password')?.value || '';

    if (!email || !password || password.length < 8) {
      if (errEl) { errEl.style.display = 'block'; errEl.textContent = !email ? 'Email is required.' : 'Password must be at least 8 characters.'; }
      return;
    }

    if (btnEl) { btnEl.disabled = true; btnEl.textContent = '⏳ Creating account...'; }
    if (errEl) errEl.style.display = 'none';

    if (typeof UserAuthEngine !== 'undefined') {
      const res = await UserAuthEngine.handleSignup({
        fullName,
        username,
        email,
        password,
        phone: 'Not Provided',
        referralId: 'REF-PUBLIC'
      });

      if (!res.success) {
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = res.message; }
        if (btnEl) { btnEl.disabled = false; btnEl.textContent = '✍️ Create My Account'; }
        return;
      }

      if (successEl) { successEl.style.display = 'block'; successEl.textContent = '✅ Account created successfully! Launching Client Portal...'; }

      if (typeof UserDashboard !== 'undefined') {
        UserDashboard.state.currentUser = res.user;
      }
      try {
        localStorage.setItem('active_client_user', JSON.stringify(res.user));
      } catch(e) {}

      setTimeout(() => {
        if (typeof App !== 'undefined') App.setMode('user');
      }, 1000);
    } else {
      if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Auth engine unavailable.'; }
      if (btnEl) { btnEl.disabled = false; btnEl.textContent = '✍️ Create My Account'; }
    }
  }
};

