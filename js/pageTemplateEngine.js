/* ==========================================================================
   CENTRALIZED PAGE TEMPLATE & DYNAMIC DATA BINDING ENGINE (js/pageTemplateEngine.js)
   - Pre-loaded Production Code Templates for All 22+ System Pages & Public Landing Page
   - Custom Page Creation Wizard (createCustomPage)
   - Dynamic Data Compiler ({{user_name}}, {{user_balance}}, {{services_table}}, etc.)
   - 100% LocalStorage Persistence & Factory Reset Capability
   ========================================================================== */

const PageTemplateEngine = {
  // Default Factory Production Templates for All 22+ Pages
  defaultTemplates: {
    'landing-page': {
      name: '🌐 Main Landing Page (Public Home)',
      html: `<div class="public-layout" style="background-color:#FFFFFF;color:#0F172A;font-family:var(--font-main);margin:0;padding:0;width:100%;">

  <!-- SECTION 01 — HERO with integrated navbar -->
  <section id="hero" class="hero-v2" aria-label="Hero — Turn Search Traffic Into Real Business Growth">

    <!-- Gradient Background -->
    <div class="hero-v2__bg" aria-hidden="true" style="background: linear-gradient(135deg, #1E054A 0%, #5C0E9E 35%, #A52090 65%, #C83090 85%, #6A0E90 100%);">
      <div class="hero-v2__orb hero-v2__orb--1"></div>
      <div class="hero-v2__orb hero-v2__orb--2"></div>
      <div class="hero-v2__orb hero-v2__orb--3"></div>
      <div class="hero-v2__noise"></div>
    </div>
    <canvas id="hero-full-bg-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></canvas>

    <!-- Scroll Progress Bar (inside hero, at very top) -->
    <div class="scroll-progress-container" style="position:absolute;top:0;left:0;width:100%;z-index:200;" aria-hidden="true">
      <div id="scroll-progress-bar" class="scroll-progress-bar"></div>
    </div>

    <!-- Global Top Left Logo -->
    <div style="position: absolute; top: 2.5rem; left: 3rem; z-index: 300;">
      <span class="brand-logo" style="display: flex; align-items: center;"><img src="" alt="Logo" style="height: 45px; max-width: 180px; object-fit: contain;"></span>
    </div>

    <!-- ── NAVBAR INSIDE HERO ── -->
    <nav class="antimetal-nav" id="hero-navbar" role="navigation">
      <!-- Left Pill: Nav Links -->
      <div class="antimetal-pill antimetal-pill--left">
        <ul class="antimetal-nav-links" id="hero-nav-links">
          {{public_navbar_links}}
        </ul>
      </div>

      <!-- Center Pill: Dynamic Favicon + Name + Circular Progress -->
      <div class="antimetal-pill antimetal-pill--center" id="nav-center-pill">
        <!-- Circular Progress SVG Ring around Entire Card -->
        <svg class="pill-scroll-svg" style="position: absolute; top: -1px; left: -1px; width: calc(100% + 2px); height: calc(100% + 2px); pointer-events: none; overflow: visible; z-index: 0;">
          <defs>
            <filter id="nav-glow-dot" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2"/>
              <feMerge>
                <feMergeNode in="blur1"/>
                <feMergeNode in="blur2"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect class="circle-bg" x="0" y="0" width="100%" height="100%" rx="24" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
          <rect class="circle-bar" id="nav-scroll-circle-bar" x="0" y="0" width="100%" height="100%" rx="24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="0" stroke-dashoffset="0" stroke-linecap="round"/>
          <rect class="circle-bar-dot" id="nav-scroll-circle-dot" x="0" y="0" width="100%" height="100%" rx="24" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-dasharray="0.1 9999" stroke-dashoffset="0" stroke-linecap="round" filter="url(#nav-glow-dot)"/>
        </svg>
        <a href="javascript:void(0)" class="antimetal-logo-link" onclick="PublicWebsite.navigateTo('home')" style="position: relative; z-index: 1;">
          <div class="antimetal-logo-wrapper">
            <img class="favicon-img" src="" alt="Favicon" style="width: 32px; height: 32px; border-radius: 50%; object-fit: contain; z-index: 2;">
          </div>
          <span class="antimetal-brand-name site-name" id="nav-brand-name">BACKLINK<span style="color:#FF9BDD;">FASTER</span></span>
        </a>
      </div>

      <!-- Right Pill: Actions -->
      <div class="antimetal-pill antimetal-pill--right">
        <a href="javascript:void(0)" class="antimetal-link-signin" onclick="PublicWebsite.navigateTo('login')">Sign In</a>
        <button type="button" class="antimetal-btn-action" onclick="PublicWebsite.openBookMeetingModal()">Book a Demo</button>
      </div>
    </nav>

    <!-- ── HERO CONTENT GRID ── -->
    <div class="hero-v2__inner" style="position: relative; z-index: 2;">

      <!-- LEFT: Messaging -->
      <div class="hero-v2__left" id="hero-left-col">

        <!-- Badge -->
        <div class="hero-v2__anim hero-v2__anim--badge">
          <span class="hero-v2__badge" role="text">
            <span class="hero-v2__badge-dot" aria-hidden="true"></span>
            RESULT-DRIVEN SEO AGENCY
          </span>
        </div>

        <!-- Headline -->
        <h1 class="hero-v2__headline hero-v2__anim hero-v2__anim--headline">
          <span style="color:#FFFFFF;display:block;">Turn Search Traffic Into</span>
          <span style="color:#FF9D47;display:block;-webkit-text-fill-color:#FF9D47;background:none;">Real Business Growth.</span>
        </h1>

        <!-- Subtext -->
        <p class="hero-v2__subtext hero-v2__anim hero-v2__anim--subtext" style="color:rgba(255,255,255,0.95);">
          Strategic SEO, high-quality backlinks aur data-driven optimization se businesses ko Google mein top rankings, qualified organic traffic aur sustainable revenue growth milti hai.
        </p>

        <!-- CTA: Only "View SEO Services" -->
        <div class="hero-v2__ctas hero-v2__anim hero-v2__anim--ctas">
          <button class="hero-v2__btn-primary" onclick="PublicWebsite.navigateTo('services')" aria-label="View SEO Services">
            <span class="hero-v2__btn-glow" aria-hidden="true"></span>
            View SEO Services
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="hero-v2__btn-secondary" onclick="PublicWebsite.openBookMeetingModal()" aria-label="Book a Strategy Call">
            📅 Free Strategy Call
          </button>
        </div>

        <!-- Trust Pills -->
        <div class="hero-v2__trust hero-v2__anim hero-v2__anim--trust" role="list">
          <span class="hero-v2__trust-pill" role="listitem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#22C55E"/><path d="M4 7l2 2 4-4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Monthly SEO
          </span>
          <span class="hero-v2__trust-pill" role="listitem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#22C55E"/><path d="M4 7l2 2 4-4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Technical SEO
          </span>
          <span class="hero-v2__trust-pill" role="listitem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#22C55E"/><path d="M4 7l2 2 4-4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Link Building
          </span>
          <span class="hero-v2__trust-pill" role="listitem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#22C55E"/><path d="M4 7l2 2 4-4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Local SEO
          </span>
        </div>

      </div><!-- /hero-v2__left -->

      <!-- RIGHT: Visual + Login Card -->
      <div class="hero-v2__right" id="hero-right-col">


        <!-- LOGIN CARD (replaces audit card) -->
        <div class="hero-v2__login-card hero-v2__anim hero-v2__anim--card" id="hero-login-card">
          <div class="hero-v2__login-header">
            <span class="hero-v2__login-icon">🔑</span>
            <div>
              <h2 class="hero-v2__login-title">Client Portal Login</h2>
              <p class="hero-v2__login-sub">Live SEO deliverables &amp; real-time ranking reports access karein.</p>
            </div>
          </div>
          <div id="hero-login-error" class="hero-v2__login-error" role="alert"></div>
          <form class="hero-v2__login-form" id="hero-login-form" onsubmit="event.preventDefault(); PublicWebsite.handleHeroLogin(event);" novalidate>
            <div>
              <label for="hero-login-email" class="hero-v2__login-label">Email or Username *</label>
              <input type="text" id="hero-login-email" class="hero-v2__login-input" placeholder="your@email.com" autocomplete="username" required>
            </div>
            <div>
              <label for="hero-login-pass" class="hero-v2__login-label">Password *</label>
              <input type="password" id="hero-login-pass" class="hero-v2__login-input" placeholder="••••••••" autocomplete="current-password" required>
            </div>
            <button type="submit" class="hero-v2__login-btn" id="hero-login-submit">
              🚀 Sign In to Dashboard
            </button>
          </form>
          <p class="hero-v2__login-register">
            New client?
            <a href="javascript:void(0)" onclick="PublicWebsite.navigateTo('register')">Create Account →</a>
          </p>
        </div><!-- /hero-v2__login-card -->

      </div><!-- /hero-v2__right -->

    </div><!-- /hero-v2__inner -->

    <!-- Scroll Cue -->
    <div class="hero-v2__scroll-cue" id="hero-scroll-cue" aria-hidden="true">
      <span class="hero-v2__scroll-text">Scroll to explore</span>
      <div class="hero-v2__scroll-arrow">
        <div class="hero-v2__scroll-line"></div>
        <div class="hero-v2__scroll-chevron"></div>
      </div>
    </div>

    <!-- Animated Water Wave (Transparent, No White) -->
    <div class="hero-water-wave-wrap" aria-hidden="true" style="position: absolute; bottom: 0; left: 0; right: 0; height: 120px; overflow: hidden; pointer-events: none; z-index: 4;">
      <style>
        .animated-wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          display: flex;
          animation: waveTranslate 12s linear infinite;
        }
        .animated-wave-container.slower {
          animation: waveTranslate 18s linear infinite reverse;
          opacity: 0.7;
        }
        @keyframes waveTranslate {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .wave-svg {
          width: 50%;
          height: 100%;
        }
      </style>
      
      <!-- Back wave (slower) -->
      <div class="animated-wave-container slower">
        <svg class="wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 V120 H0 Z" fill="rgba(255,255,255,0.04)"/>
        </svg>
        <svg class="wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 V120 H0 Z" fill="rgba(255,255,255,0.04)"/>
        </svg>
      </div>

      <!-- Front wave (faster) -->
      <div class="animated-wave-container">
        <svg class="wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,80 C320,20 420,140 720,80 C1020,20 1120,140 1440,80 V120 H0 Z" fill="rgba(255,255,255,0.06)"/>
        </svg>
        <svg class="wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,80 C320,20 420,140 720,80 C1020,20 1120,140 1440,80 V120 H0 Z" fill="rgba(255,255,255,0.06)"/>
        </svg>
      </div>
    </div>

  </section><!-- /hero-v2 -->

  <!-- SECTION 02 — Trust & Authority Ribbon -->
  <section id="trust-ribbon" class="trust-ribbon-v3 scroll-reveal-up" style="background: #FFFFFF; width: 100%; padding: 4rem 2rem; border-bottom: 1px solid #F1F5F9;">
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
      <span class="trust-badge">TRUSTED BY 500+ HIGH-GROWTH TECH BRANDS & AGENCIES WORLDWIDE</span>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin: 2rem 0;">
        <div>
          <div style="font-size: 2.5rem; font-weight: 900; color: #0F172A;">99.4%</div>
          <div style="color: #64748B; font-weight: 700; font-size: 0.9rem; text-transform: uppercase;">Indexing Accuracy</div>
        </div>
        <div>
          <div style="font-size: 2.5rem; font-weight: 900; color: #0F172A;">+350%</div>
          <div style="color: #64748B; font-weight: 700; font-size: 0.9rem; text-transform: uppercase;">Avg Traffic Surge</div>
        </div>
        <div>
          <div style="font-size: 2.5rem; font-weight: 900; color: #0F172A;">15,000+</div>
          <div style="color: #64748B; font-weight: 700; font-size: 0.9rem; text-transform: uppercase;">DR80+ Backlinks</div>
        </div>
        <div>
          <div style="font-size: 2.5rem; font-weight: 900; color: #0F172A;">#1</div>
          <div style="color: #64748B; font-weight: 700; font-size: 0.9rem; text-transform: uppercase;">SERP Rankings</div>
        </div>
      </div>

      <div style="overflow: hidden; white-space: nowrap; margin-top: 3rem; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);">
        <div class="marquee-content">
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Vercel</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Stripe</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Ahrefs</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">HubSpot</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Shopify</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Webflow</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Vercel</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Stripe</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Ahrefs</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">HubSpot</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Shopify</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #94A3B8; letter-spacing: -1px;">Webflow</span>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 03 — Problem vs Solution Matrix -->
  <section id="problem-solution" class="prob-sol-section scroll-reveal-up" style="background: #FFFFFF; width: 100%; padding: 5.5rem 2rem; border-bottom: 1px solid #F1F5F9;">
    <div style="max-width: 1200px; margin: 0 auto;">
      
      <div style="text-align: center; margin-bottom: 4rem;">
        <span style="background: rgba(96, 37, 245, 0.1); border: 1px solid rgba(96, 37, 245, 0.2); color: #6025F5; font-weight: 800; font-size: 0.85rem; padding: 0.5rem 1.2rem; border-radius: 20px; text-transform: uppercase;">
          ⚡ THE PARADIGM SHIFT
        </span>
        <h2 style="font-size: 2.8rem; font-weight: 900; color: #0F172A; margin: 1.5rem 0 1rem 0; letter-spacing: -1px;">
          Stop Wasting Budget on Traditional SEO Agencies.
        </h2>
        <p style="color: #64748B; font-size: 1.15rem; max-width: 700px; margin: 0 auto; line-height: 1.6;">
          See why 500+ SaaS founders and growth marketers switched to BacklinkFaster's automated organic engine.
        </p>
      </div>

      <div class="prob-sol-grid">
        
        <!-- Card 1: Old Way -->
        <div class="prob-card-old">
          <div style="margin-bottom: 2rem;">
            <span style="background: rgba(239, 68, 68, 0.15); color: #EF4444; padding: 0.4rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem;">❌ THE OLD SLOW WAY</span>
            <h3 style="color: #FFFFFF; font-size: 1.8rem; font-weight: 800; margin-top: 1.5rem;">Traditional SEO Agencies</h3>
          </div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.5rem; flex-grow: 1;">
            <li style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.2rem;">🐌</span>
              <span style="font-size: 1.05rem; line-height: 1.5;">6-Month delays before any ranking movement</span>
            </li>
            <li style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.2rem;">🕵️</span>
              <span style="font-size: 1.05rem; line-height: 1.5;">Zero transparency — static PDF reports once a month</span>
            </li>
            <li style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.2rem;">💸</span>
              <span style="font-size: 1.05rem; line-height: 1.5;">High $5k/mo retainers with manual, outdated outreach</span>
            </li>
            <li style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.2rem;">⚠️</span>
              <span style="font-size: 1.05rem; line-height: 1.5;">High risk of PBN link penalties from Google</span>
            </li>
          </ul>
        </div>

        <!-- Card 2: New Way -->
        <div class="prob-card-new">
          <div style="margin-bottom: 2rem;">
            <span style="background: rgba(16, 185, 129, 0.2); color: #34D399; padding: 0.4rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem; border: 1px solid rgba(16, 185, 129, 0.3);">⚡ GUARANTEED GROWTH</span>
            <h3 style="color: #FFFFFF; font-size: 1.8rem; font-weight: 800; margin-top: 1.5rem;">BacklinkFaster Organic Engine</h3>
          </div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.5rem; flex-grow: 1;">
            <li style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.2rem;">🚀</span>
              <span style="font-size: 1.05rem; line-height: 1.5; font-weight: 600;">Rapid indexing & keyword movement within 14 days</span>
            </li>
            <li style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.2rem;">📊</span>
              <span style="font-size: 1.05rem; line-height: 1.5; font-weight: 600;">24/7 Live Client Portal — real-time SERP tracking & backlink metrics</span>
            </li>
            <li style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.2rem;">💎</span>
              <span style="font-size: 1.05rem; line-height: 1.5; font-weight: 600;">DR 80+ High-Authority Editorial Links & White-Hat Digital PR</span>
            </li>
            <li style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.2rem;">🛡️</span>
              <span style="font-size: 1.05rem; line-height: 1.5; font-weight: 600;">100% Risk-Free Guarantee & Pay-For-Results flexibility</span>
            </li>
          </ul>
          <button class="hero-v2__btn-primary" onclick="PublicWebsite.navigateTo('register')" style="margin-top: 2rem; width: 100%; justify-content: center;">Start Scaling Traffic Now →</button>
        </div>

      </div>
    </div>
  </section>

  <!-- 3. 3D WEBGL SCROLLYTELLING SHOWCASE (Dark Background & Neon Glowing Cards) -->
  <section id="scrollytelling-3d" style="padding: 5.5rem 1.5rem; background: #0F0A1C; border-bottom: 1px solid rgba(255,255,255,0.1); width: 100%; color: #FFF;">
    <div style="max-width: 1250px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3rem;" class="scroll-reveal-up">
        <span style="background: rgba(96, 37, 245, 0.25); border: 1px solid #6025F5; color: #38BDF8; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
          🌐 3D WEBGL ENGINE SHOWCASE
        </span>
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #FFF; margin: 1.2rem 0 0.6rem 0; letter-spacing: -0.5px;">
          Automated Scrollytelling <span style="background: linear-gradient(135deg, #FF5555, #6025F5); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Architecture</span>
        </h2>
        <p style="color: #94A3B8; font-size: 1.05rem; max-width: 720px; margin: 0 auto; line-height: 1.6;">
          Experience how our proprietary 3D crawler nodes, backlink network mesh, and traffic expansion engines process your search footprint in real-time.
        </p>
      </div>

      <div class="webgl-stage-container scroll-reveal-scale" style="background: #0F0A1C; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 50px rgba(96, 37, 245, 0.3); border-radius: 24px;">
        <canvas id="webgl-scrollytelling-canvas" class="webgl-canvas-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; border-radius: 24px;"></canvas>
        
        <div class="webgl-content-wrapper">
          <div class="webgl-stage-grid">
            
            <!-- Stage 1 -->
            <div class="webgl-stage-card" style="background: linear-gradient(135deg, rgba(96, 37, 245, 0.3), rgba(255, 85, 85, 0.2)); border: 1px solid rgba(255,255,255,0.25); border-radius: 16px; padding: 1.8rem; color: #FFF; box-shadow: 0 8px 32px rgba(96, 37, 245, 0.2); backdrop-filter: blur(12px);">
              <span class="webgl-stage-badge">Stage 1</span>
              <h3 style="font-size: 1.3rem; font-weight: 800; color: #FFF; margin-bottom: 0.6rem;">🕷️ Crawler Node Analysis</h3>
              <p style="color: #CBD5E1; font-size: 0.92rem; line-height: 1.6; margin: 0;">
                Deep DOM parsing, JS rendering inspection, JSON-LD schema validation, and Core Web Vitals speed bottleneck identification.
              </p>
            </div>

            <!-- Stage 2 -->
            <div class="webgl-stage-card" style="background: linear-gradient(135deg, rgba(96, 37, 245, 0.3), rgba(255, 85, 85, 0.2)); border: 1px solid rgba(255,255,255,0.25); border-radius: 16px; padding: 1.8rem; color: #FFF; box-shadow: 0 8px 32px rgba(96, 37, 245, 0.2); backdrop-filter: blur(12px);">
              <span class="webgl-stage-badge" style="background: linear-gradient(135deg, #00ACC1, #00838F);">Stage 2</span>
              <h3 style="font-size: 1.3rem; font-weight: 800; color: #FFF; margin-bottom: 0.6rem;">🔗 Backlink Network Mesh</h3>
              <p style="color: #CBD5E1; font-size: 0.92rem; line-height: 1.6; margin: 0;">
                Contextually relevant editorial link acquisition across real-traffic tier-1 news outlets, high-DR blogs, and niche industry authority sites.
              </p>
            </div>

            <!-- Stage 3 -->
            <div class="webgl-stage-card" style="background: linear-gradient(135deg, rgba(96, 37, 245, 0.3), rgba(255, 85, 85, 0.2)); border: 1px solid rgba(255,255,255,0.25); border-radius: 16px; padding: 1.8rem; color: #FFF; box-shadow: 0 8px 32px rgba(96, 37, 245, 0.2); backdrop-filter: blur(12px);">
              <span class="webgl-stage-badge" style="background: linear-gradient(135deg, #10B981, #059669);">Stage 3</span>
              <h3 style="font-size: 1.3rem; font-weight: 800; color: #FFF; margin-bottom: 0.6rem;">🚀 Traffic & Revenue Expansion</h3>
              <p style="color: #CBD5E1; font-size: 0.92rem; line-height: 1.6; margin: 0;">
                Rapid keyword velocity boost, top 3 Google SERP positions, organic lead multiplication, and sustained compound growth.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. INTERACTIVE ROI REVENUE CALCULATOR (White Section + Rich Gradient Glass Card) -->
  <section id="roi-calculator" style="padding: 5.5rem 1.5rem; background: #FFFFFF; border-bottom: 1px solid #E2E8F0; width: 100%;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3.5rem;" class="scroll-reveal-up">
        <span style="background: rgba(96, 37, 245, 0.12); border: 1px solid #6025F5; color: #6025F5; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px; text-transform: uppercase;">
          📈 REVENUE PROJECTION ENGINE
        </span>
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #0F172A; margin: 1.2rem 0 0.6rem 0; letter-spacing: -0.5px;">
          Calculate Your Potential <span style="color: #6025F5;">SEO Growth</span>
        </h2>
        <p style="color: #64748B; font-size: 1.05rem; max-width: 650px; margin: 0 auto;">
          Adjust the parameters below to project your 12-month organic search revenue boost.
        </p>
      </div>

      <!-- Rich Gradient Glass Card Container -->
      <div class="roi-calculator-container scroll-reveal-scale" style="background: linear-gradient(135deg, #0F0A1C 0%, #1E1B4B 100%); color: #FFF; border-radius: 24px; padding: 3rem 2rem; box-shadow: 0 20px 50px rgba(96, 37, 245, 0.25); border: 1px solid rgba(255,255,255,0.15); display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: center;">
        <div>
          <div style="margin-bottom: 1.8rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 700; color: #FFF;">
              <span>Current Monthly Organic Visitors</span>
              <span id="val-traffic" style="font-weight: 800; color: #00ACC1; font-size: 1.1rem;">25,000</span>
            </div>
            <input type="range" id="range-traffic" min="2000" max="200000" step="1000" value="25000" oninput="PublicWebsite.updateRoiCalculations()" style="width: 100%; height: 8px; border-radius: 4px; accent-color: #00ACC1; cursor: pointer;">
          </div>

          <div style="margin-bottom: 1.8rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 700; color: #FFF;">
              <span>Website Conversion Rate (%)</span>
              <span id="val-conv" style="font-weight: 800; color: #FF5555; font-size: 1.1rem;">2.5%</span>
            </div>
            <input type="range" id="range-conv" min="0.5" max="8.0" step="0.1" value="2.5" oninput="PublicWebsite.updateRoiCalculations()" style="width: 100%; height: 8px; border-radius: 4px; accent-color: #FF5555; cursor: pointer;">
          </div>

          <div style="margin-bottom: 1.8rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 700; color: #FFF;">
              <span>Average Customer Lifetime Value ($)</span>
              <span id="val-aov" style="font-weight: 800; color: #FFE259; font-size: 1.1rem;">$450</span>
            </div>
            <input type="range" id="range-aov" min="50" max="5000" step="50" value="450" oninput="PublicWebsite.updateRoiCalculations()" style="width: 100%; height: 8px; border-radius: 4px; accent-color: #FFE259; cursor: pointer;">
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 2.2rem; color: #FFF; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);">
          <div>
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 800;">Projected 12-Month Organic Revenue</div>
            <div id="output-projected-rev" style="font-size: 3.2rem; font-weight: 900; background: linear-gradient(135deg, #FF5555, #6025F5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0.6rem 0 1.2rem 0; line-height: 1.1;">
              +$337,500
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 1.2rem; display: flex; justify-content: space-between;">
              <div>
                <div style="font-size: 0.8rem; color: #94A3B8;">Estimated New Traffic</div>
                <div id="output-new-traffic" style="font-size: 1.2rem; font-weight: 800; color: #FFF;">+75,000 /mo</div>
              </div>
              <div>
                <div style="font-size: 0.8rem; color: #94A3B8;">Estimated New Leads</div>
                <div id="output-new-leads" style="font-size: 1.2rem; font-weight: 800; color: #34D399;">+1,875 /mo</div>
              </div>
            </div>
          </div>
          <button class="btn-cta-gradient" style="margin-top: 1.8rem; width: 100%; justify-content: center;" onclick="PublicWebsite.openBookMeetingModal()">
            Claim Your Custom Growth Blueprint →
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. DYNAMIC SEO PACKAGES & SERVICES GRID (White Section + Vibrant Gradient Cards) -->
  <section id="services" style="padding: 5.5rem 1.5rem; background: #FFFFFF; border-bottom: 1px solid #E2E8F0; width: 100%;">
    <div style="max-width: 1250px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3.5rem;" class="scroll-reveal-up">
        <span style="background: rgba(96, 37, 245, 0.12); border: 1px solid #6025F5; color: #6025F5; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px; text-transform: uppercase;">
          💎 ENTERPRISE SOLUTIONS
        </span>
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #0F172A; margin: 1.2rem 0 0.6rem 0; letter-spacing: -0.5px;">
          High-Impact <span style="color: #6025F5;">SEO Services & Packages</span>
        </h2>
        <p style="color: #64748B; font-size: 1.05rem; max-width: 650px; margin: 0 auto;">
          Choose from our enterprise organic growth solutions built for agencies and business owners.
        </p>
      </div>

      {{services_grid}}
    </div>
  </section>

  <!-- 6. LIVE INTERACTIVE AUDIT ENGINE (Full-Width Gradient Background) -->
  <section id="audit-tool-section" style="padding: 5.5rem 1.5rem; background: linear-gradient(135deg, #6025F5 0%, #00ACC1 100%); border-bottom: 1px solid rgba(255,255,255,0.2); width: 100%; color: #FFF;">
    <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
      <div class="scroll-reveal-up" style="margin-bottom: 2.5rem;">
        <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.35); color: #FFF; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px; text-transform: uppercase;">
          ⚡ AUTOMATED AUDIT ENGINE
        </span>
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #FFF; margin: 1rem 0 0.5rem 0;">
          Run Your Live <span style="color: #FFE259;">Technical SEO Audit</span>
        </h2>
        <p style="color: rgba(255,255,255,0.92); font-size: 1.05rem;">Instant analysis of PageSpeed, Core Web Vitals, Schema markup, and backlink trust.</p>
      </div>

      <div class="scroll-reveal-scale" style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 24px; padding: 2.5rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
        <div style="display: flex; gap: 0.8rem; max-width: 750px; margin: 0 auto;">
          <input type="url" id="hero-audit-input" placeholder="Enter your domain (e.g. https://yourcompany.com)" style="flex: 1; border: none; border-radius: 12px; padding: 0.9rem 1.2rem; font-size: 1rem; outline: none; font-weight: 600; color: #0F172A; background: #FFFFFF;">
          <button class="btn-cyan-accent" style="white-space: nowrap; font-size: 1rem; padding: 0.9rem 1.8rem; border-radius: 12px; background: #0F172A; color: #FFF; border: none; font-weight: 800;" onclick="PublicWebsite.runLiveAudit()">
            ⚡ Scan Website Now
          </button>
        </div>

        <!-- Audit Scanning Progress Overlay -->
        <div id="scan-progress-container" class="glass-card scan-progress-box" style="max-width: 750px; margin: 1.8rem auto 0 auto; display: none; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.5rem; color: #0F172A;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 0.6rem;">
            <span id="scan-step-text" style="color: #6025F5;">Initiating Crawler engines...</span>
            <span id="scan-percentage" style="color: #FF5555;">0%</span>
          </div>
          <div class="progress-bar-track" style="height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden;">
            <div id="scan-progress-bar" class="progress-bar-fill" style="height: 100%; width: 0%; background: linear-gradient(135deg, #FF5555, #6025F5); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Audit Results Panel -->
        <div id="audit-results-display" class="glass-card audit-results-panel" style="max-width: 850px; margin: 2rem auto 0 auto; display: none; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 2rem; text-align: left; color: #0F172A;">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </div>
  </section>

  <!-- 7. TEAM MEMBERS SHOWCASE (White Section + Gradient Border Rings & Badges) -->
  <section id="team" style="padding: 5.5rem 1.5rem; background: #FFFFFF; border-bottom: 1px solid #E2E8F0; width: 100%;">
    <div style="max-width: 1250px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3.5rem;" class="scroll-reveal-up">
        <span style="background: rgba(96, 37, 245, 0.12); border: 1px solid #6025F5; color: #6025F5; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px; text-transform: uppercase;">
          👥 OUR DEDICATED EXPERTS
        </span>
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #0F172A; margin: 1.2rem 0 0.6rem 0; letter-spacing: -0.5px;">
          Meet Our <span style="color: #6025F5;">SEO Leadership Team</span>
        </h2>
        <p style="color: #64748B; font-size: 1.05rem; max-width: 650px; margin: 0 auto;">
          Dedicated link building executives, quality analysts, and technical strategists powering your organic growth.
        </p>
      </div>

      <div class="team-member-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem;">
        
        <!-- Team Member 1: Alexander Wright -->
        <div class="team-card scroll-reveal-scale delay-1">
          <div class="team-avatar-wrapper">
            <img src="css/team_1.png" alt="Alexander Wright" class="team-avatar-img" loading="lazy">
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin-bottom: 0.4rem;">Alexander Wright</h3>
          <div class="team-badge">LEAD TECHNICAL SEO SPECIALIST</div>
          <p style="font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0;">
            Expert in JS rendering, complex crawl budget optimization, and enterprise site architecture restructuring.
          </p>
        </div>

        <!-- Team Member 2: Sophia Chen -->
        <div class="team-card scroll-reveal-scale delay-2">
          <div class="team-avatar-wrapper">
            <img src="css/team_2.png" alt="Sophia Chen" class="team-avatar-img" loading="lazy">
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin-bottom: 0.4rem;">Sophia Chen</h3>
          <div class="team-badge">DIGITAL PR & OUTREACH MANAGER</div>
          <p style="font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0;">
            Direct relationships with tier-1 publishers to secure contextual high-DR backlinks and editorial brand mentions.
          </p>
        </div>

        <!-- Team Member 3: Marcus Vance -->
        <div class="team-card scroll-reveal-scale delay-3">
          <div class="team-avatar-wrapper">
            <img src="css/team_3.png" alt="Marcus Vance" class="team-avatar-img" loading="lazy">
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin-bottom: 0.4rem;">Marcus Vance</h3>
          <div class="team-badge">CORE WEB VITALS & SPEED ARCHITECT</div>
          <p style="font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0;">
            Specializes in sub-second LCP, CLS elimination, and high-performance server edge caching optimization.
          </p>
        </div>

        <!-- Team Member 4: Elena Rostova -->
        <div class="team-card scroll-reveal-scale delay-4">
          <div class="team-avatar-wrapper">
            <img src="css/team_4.png" alt="Elena Rostova" class="team-avatar-img" loading="lazy">
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin-bottom: 0.4rem;">Elena Rostova</h3>
          <div class="team-badge">HEAD OF CLIENT SUCCESS & GROWTH</div>
          <p style="font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0;">
            Dedicated client strategy, custom KPI reporting, and transparent ROI organic growth campaign management.
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- 8. REAL CLIENT SEO PROOF GALLERY (Single Dedicated Showcase Box with Smooth Fade-In/Out Slideshow) -->
  <section id="results" style="padding: 5.5rem 1.5rem; background: #FFFFFF; border-bottom: 1px solid #E2E8F0; width: 100%;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3rem;" class="scroll-reveal-up">
        <span style="background: rgba(0, 172, 193, 0.12); border: 1px solid #00ACC1; color: #00838F; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
          📈 PROVEN SEARCH CONSOLE PROOF
        </span>
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #0F172A; margin: 1.2rem 0 0.6rem 0; letter-spacing: -0.5px;">
          Real Client <span style="background: linear-gradient(135deg, #FF5555, #6025F5); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SEO Proof Gallery</span>
        </h2>
        <p style="color: #64748B; font-size: 1.05rem; max-width: 650px; margin: 0 auto;">
          Interactive showcase box featuring verified Google Search Console ranking spikes and traffic growth logs.
        </p>
      </div>

      <!-- Single Dedicated Showcase Box with Smooth Fade-In/Out Slideshow Animation -->
      <div class="proof-showcase-box scroll-reveal-scale" onmouseenter="PublicWebsite.pauseProofTimer()" onmouseleave="PublicWebsite.startProofTimer()" style="max-width: 1050px; margin: 0 auto; background: #0F0A1C; border-radius: 24px; padding: 2.2rem; color: #FFF; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 50px rgba(15, 10, 28, 0.3); text-align: center;">
        
        <!-- Active Slide Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
          <div style="text-align: left;">
            <h3 id="proof-slide-title" style="font-size: 1.35rem; font-weight: 800; color: #FFF; margin: 0 0 0.2rem 0;">🚀 +350% Organic Traffic Surge</h3>
            <div id="proof-slide-metric" style="font-size: 0.88rem; color: #00ACC1; font-weight: 700;">E-Commerce Retail Brand (60 Days Campaign)</div>
          </div>
          <div id="proof-slide-counter" style="background: rgba(255,255,255,0.1); padding: 0.35rem 0.9rem; border-radius: 20px; font-weight: 800; font-size: 0.85rem; color: #FF5555; border: 1px solid rgba(255,255,255,0.2);">
            1 / 8
          </div>
        </div>

        <!-- Main Featured Proof Image Container -->
        <div class="proof-featured-frame" style="position: relative; width: 100%; border-radius: 16px; overflow: hidden; border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 12px 30px rgba(0,0,0,0.5); background: #000; margin-bottom: 1.5rem;">
          
          <!-- Previous Button -->
          <button class="proof-nav-prev" onclick="PublicWebsite.prevProofSlide()" title="Previous Proof" style="position: absolute; top: 50%; left: 1rem; transform: translateY(-50%); background: rgba(15, 10, 28, 0.75); backdrop-filter: blur(8px); color: #FFF; border: 1px solid rgba(255,255,255,0.3); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.3rem; z-index: 10; transition: all 0.2s;">❮</button>

          <!-- Main Featured Image -->
          <img id="proof-featured-img" src="https://i.ibb.co/cSJSXHnv/HEZZdvia-IAAGa67.jpg" alt="SEO Proof Featured" style="width: 100%; height: 420px; object-fit: contain; background: #000; transition: opacity 0.35s ease, transform 0.35s ease; cursor: pointer; display: block;" onclick="PublicWebsite.openImageLightbox(this.src)">

          <!-- Next Button -->
          <button class="proof-nav-next" onclick="PublicWebsite.nextProofSlide()" title="Next Proof" style="position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); background: rgba(15, 10, 28, 0.75); backdrop-filter: blur(8px); color: #FFF; border: 1px solid rgba(255,255,255,0.3); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.3rem; z-index: 10; transition: all 0.2s;">❯</button>
        </div>

        <!-- Thumbnail Strip Buttons -->
        <div class="proof-thumbnail-row" style="display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap;">
          <div class="proof-thumb-btn active" onclick="PublicWebsite.switchProofSlide(0)"><img src="https://i.ibb.co/cSJSXHnv/HEZZdvia-IAAGa67.jpg" alt="Thumb 1"></div>
          <div class="proof-thumb-btn" onclick="PublicWebsite.switchProofSlide(1)"><img src="https://i.ibb.co/SD2JBmsP/HEHNv22a-IAAMh-Ny.jpg" alt="Thumb 2"></div>
          <div class="proof-thumb-btn" onclick="PublicWebsite.switchProofSlide(2)"><img src="https://i.ibb.co/HT4HnfSz/HDq-Id-Xoa8-AA6-Zjv.png" alt="Thumb 3"></div>
          <div class="proof-thumb-btn" onclick="PublicWebsite.switchProofSlide(3)"><img src="https://i.ibb.co/Jw6G2fYQ/HDUhla1a-MAA8s27.jpg" alt="Thumb 4"></div>
          <div class="proof-thumb-btn" onclick="PublicWebsite.switchProofSlide(4)"><img src="https://i.ibb.co/wNrw9y1S/HDUgj-JXXk-AAAt9i.jpg" alt="Thumb 5"></div>
          <div class="proof-thumb-btn" onclick="PublicWebsite.switchProofSlide(5)"><img src="https://i.ibb.co/NnyZrLFc/HDUgj-N9a-MAEEYr-L.jpg" alt="Thumb 6"></div>
          <div class="proof-thumb-btn" onclick="PublicWebsite.switchProofSlide(6)"><img src="https://i.ibb.co/p6rGMf73/HDUgj-NSWg-AAxru8.jpg" alt="Thumb 7"></div>
          <div class="proof-thumb-btn" onclick="PublicWebsite.switchProofSlide(7)"><img src="https://i.ibb.co/Rp9gx1wz/HDUgj-Un-WEAA6p-Wx.jpg" alt="Thumb 8"></div>
        </div>

      </div>
    </div>
  </section>

  <!-- 9. CLIENT TESTIMONIALS & FAQS (White Section + Gradient Accordions & Cards) -->
  <section id="reviews" style="padding: 5.5rem 1.5rem; background: #FFFFFF; border-bottom: 1px solid #E2E8F0; width: 100%;">
    <div style="max-width: 1250px; margin: 0 auto;">
      
      <!-- Testimonials Header -->
      <div style="text-align: center; margin-bottom: 3.5rem;" class="scroll-reveal-up">
        <span style="background: rgba(16, 185, 129, 0.12); border: 1px solid #10B981; color: #059669; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px;">
          ⭐ GOOGLE VERIFIED CLIENT REVIEWS
        </span>
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #0F172A; margin: 1.2rem 0 0.6rem 0;">
          What Agency Clients Say About <span style="color: #6025F5;">Our Deliverables</span>
        </h2>
        <p style="color: #64748B; font-size: 1.05rem; max-width: 600px; margin: 0 auto;">
          Trusted by digital agencies, SaaS founders, and e-commerce brands worldwide.
        </p>
      </div>

      <!-- Testimonial Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-bottom: 5rem;">
        
        <!-- Review Card 1 -->
        <div class="testimonial-gradient-card scroll-reveal-scale delay-1" style="background: #FFFFFF; border-radius: 18px; padding: 2rem; border: 1px solid #E2E8F0; color: #0F172A; text-align: left; box-shadow: 0 10px 25px rgba(96,37,245,0.08); border-top: 4px solid #6025F5;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #00ACC1, #00838F); color: #FFF; font-weight: 800; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                MJ
              </div>
              <div>
                <div style="font-weight: 800; font-size: 1.05rem; color: #0F172A; display: flex; align-items: center; gap: 0.35rem;">
                  Mark Jenkins <span style="color: #4285F4; font-size: 0.9rem;">✓</span>
                </div>
                <div style="font-size: 0.8rem; color: #64748B;">Founder, Apex Digital Agency</div>
              </div>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" style="width: 24px; height: 24px;">
          </div>
          <div style="color: #F59E0B; font-size: 1.1rem; margin-bottom: 0.8rem;">⭐⭐⭐⭐⭐ <span style="color: #64748B; font-size: 0.8rem; font-weight: 600; margin-left: 0.4rem;">2 weeks ago</span></div>
          <p style="font-size: 0.94rem; color: #334155; line-height: 1.65; margin: 0;">"Backlinkfaster transformed our agency clients' rankings! Within 60 days of launching their high-DR outreach campaign, our target keywords moved straight to Page 1."</p>
        </div>

        <!-- Review Card 2 -->
        <div class="testimonial-gradient-card scroll-reveal-scale delay-2" style="background: #FFFFFF; border-radius: 18px; padding: 2rem; border: 1px solid #E2E8F0; color: #0F172A; text-align: left; box-shadow: 0 10px 25px rgba(96,37,245,0.08); border-top: 4px solid #6025F5;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #FF5555, #6025F5); color: #FFF; font-weight: 800; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                RP
              </div>
              <div>
                <div style="font-weight: 800; font-size: 1.05rem; color: #0F172A; display: flex; align-items: center; gap: 0.35rem;">
                  Rachel Patel <span style="color: #4285F4; font-size: 0.9rem;">✓</span>
                </div>
                <div style="font-size: 0.8rem; color: #64748B;">CMO, CloudSaaS Global</div>
              </div>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" style="width: 24px; height: 24px;">
          </div>
          <div style="color: #F59E0B; font-size: 1.1rem; margin-bottom: 0.8rem;">⭐⭐⭐⭐⭐ <span style="color: #64748B; font-size: 0.8rem; font-weight: 600; margin-left: 0.4rem;">1 month ago</span></div>
          <p style="font-size: 0.94rem; color: #334155; line-height: 1.65; margin: 0;">"The Technical SEO audit and Core Web Vitals speed optimization delivered incredible results. Our desktop PageSpeed score jumped from 45 to 98!"</p>
        </div>

        <!-- Review Card 3 -->
        <div class="testimonial-gradient-card scroll-reveal-scale delay-3" style="background: #FFFFFF; border-radius: 18px; padding: 2rem; border: 1px solid #E2E8F0; color: #0F172A; text-align: left; box-shadow: 0 10px 25px rgba(96,37,245,0.08); border-top: 4px solid #6025F5;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #6025F5, #00ACC1); color: #FFF; font-weight: 800; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                DK
              </div>
              <div>
                <div style="font-weight: 800; font-size: 1.05rem; color: #0F172A; display: flex; align-items: center; gap: 0.35rem;">
                  David Kroll <span style="color: #4285F4; font-size: 0.9rem;">✓</span>
                </div>
                <div style="font-size: 0.8rem; color: #64748B;">VP Marketing, OmniEcom</div>
              </div>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" style="width: 24px; height: 24px;">
          </div>
          <div style="color: #F59E0B; font-size: 1.1rem; margin-bottom: 0.8rem;">⭐⭐⭐⭐⭐ <span style="color: #64748B; font-size: 0.8rem; font-weight: 600; margin-left: 0.4rem;">3 weeks ago</span></div>
          <p style="font-size: 0.94rem; color: #334155; line-height: 1.65; margin: 0;">"Hands down the best white-label SEO partner we have worked with. Clean API integrations, fast indexing, and transparent client reporting."</p>
        </div>

      </div>

      <!-- FAQ Sub-Section -->
      <div id="faq-section" style="max-width: 950px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 3rem;" class="scroll-reveal-up">
          <span style="background: rgba(96, 37, 245, 0.12); border: 1px solid #6025F5; color: #6025F5; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 1.2rem; border-radius: 20px; text-transform: uppercase;">
            ❓ FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 style="font-size: 2.3rem; font-weight: 900; color: #0F172A; margin: 1rem 0 0.5rem 0;">Got Questions? <span style="color: #6025F5;">We've Got Answers</span></h2>
          <p style="color: #64748B; font-size: 1rem;">Everything you need to know about our organic search engine strategy and delivery guarantees.</p>
        </div>

        <div class="faq-accordion-container" style="display: flex; flex-direction: column; gap: 1rem;">
          
          <div class="faq-item faq-gradient-item" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; cursor: pointer; border-left: 4px solid #6025F5;" onclick="PublicWebsite.toggleFaq(this)">
            <div class="faq-question faq-gradient-header" style="padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 800; color: #0F172A; font-size: 1.05rem; background: linear-gradient(135deg, rgba(96, 37, 245, 0.05), rgba(255, 85, 85, 0.04));">
              <span>⚡ How fast will my website see ranking improvements?</span>
              <span class="faq-icon" style="font-size: 1.3rem; transition: transform 0.3s ease; color: #6025F5;">+</span>
            </div>
            <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.25rem 1.5rem; color: #475569; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid #E2E8F0; margin-top: 0.5rem; background: #F8FAFC;">
              Initial indexing and ranking movements typically occur within 14 to 30 days of campaign deployment. High-competition keywords usually see compound growth within 60 to 90 days as domain authority builds.
            </div>
          </div>

          <div class="faq-item faq-gradient-item" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; cursor: pointer; border-left: 4px solid #6025F5;" onclick="PublicWebsite.toggleFaq(this)">
            <div class="faq-question faq-gradient-header" style="padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 800; color: #0F172A; font-size: 1.05rem; background: linear-gradient(135deg, rgba(96, 37, 245, 0.05), rgba(255, 85, 85, 0.04));">
              <span>🔗 Are the backlinks 100% white-hat and Google algorithm safe?</span>
              <span class="faq-icon" style="font-size: 1.3rem; transition: transform 0.3s ease; color: #6025F5;">+</span>
            </div>
            <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.25rem 1.5rem; color: #475569; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid #E2E8F0; margin-top: 0.5rem; background: #F8FAFC;">
              Yes, 100%. We acquire editorial link placements on real traffic US publications with verified organic search traffic. Zero PBNs, zero spam networks, and zero automated link spam.
            </div>
          </div>

          <div class="faq-item faq-gradient-item" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; cursor: pointer; border-left: 4px solid #6025F5;" onclick="PublicWebsite.toggleFaq(this)">
            <div class="faq-question faq-gradient-header" style="padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 800; color: #0F172A; font-size: 1.05rem; background: linear-gradient(135deg, rgba(96, 37, 245, 0.05), rgba(255, 85, 85, 0.04));">
              <span>📊 How do I track deliverable progress and keyword rankings?</span>
              <span class="faq-icon" style="font-size: 1.3rem; transition: transform 0.3s ease; color: #6025F5;">+</span>
            </div>
            <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.25rem 1.5rem; color: #475569; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid #E2E8F0; margin-top: 0.5rem; background: #F8FAFC;">
              Upon placing an order, you gain instant access to your Client Portal Dashboard where live status updates, live GSC links, keyword reports, and downloadable PDF audits are available 24/7.
            </div>
          </div>

          <div class="faq-item faq-gradient-item" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; cursor: pointer; border-left: 4px solid #6025F5;" onclick="PublicWebsite.toggleFaq(this)">
            <div class="faq-question faq-gradient-header" style="padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 800; color: #0F172A; font-size: 1.05rem; background: linear-gradient(135deg, rgba(96, 37, 245, 0.05), rgba(255, 85, 85, 0.04));">
              <span>🛡️ What is your 30-day auto-refill guarantee?</span>
              <span class="faq-icon" style="font-size: 1.3rem; transition: transform 0.3s ease; color: #6025F5;">+</span>
            </div>
            <div class="faq-answer" style="display: none; padding: 0 1.5rem 1.25rem 1.5rem; color: #475569; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid #E2E8F0; margin-top: 0.5rem; background: #F8FAFC;">
              In the rare event that a published backlink is removed or lost within 30 days of placement, our automated monitoring engine flags it and our team replaces it free of charge.
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>

  <!-- 10. CTA BANNER (Full-Width Red-Purple Gradient) & DARK FOOTER -->
  <section class="cta-section" style="background: linear-gradient(135deg, #FF5555 0%, #6025F5 100%); width: 100%; padding: 5.5rem 1.5rem; color: #FFFFFF; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); margin: 0;">
    <div style="max-width: 900px; margin: 0 auto;" class="scroll-reveal-up">
      <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.35); color: #FFF; padding: 0.4rem 1.2rem; border-radius: 20px; font-weight: 800; font-size: 0.85rem; text-transform: uppercase;">
        🚀 ACCELERATE YOUR SEARCH REVENUE
      </span>
      <h2 style="font-size: 3rem; font-weight: 900; margin: 1.2rem 0 0.8rem 0; color: #FFF; letter-spacing: -0.8px;">
        Ready to Dominate Search Rankings & Scale Traffic 10X?
      </h2>
      <p style="font-size: 1.15rem; color: rgba(255,255,255,0.92); margin-bottom: 2.2rem; line-height: 1.6;">
        Join 1,200+ agency owners and enterprise brands using our white-hat backlink engine to claim #1 positions.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button type="button" class="btn-meeting" style="background: #00ACC1; color: #FFF; font-size: 1rem; padding: 0.85rem 1.8rem; border-radius: 12px; font-weight: 800; border: none; cursor: pointer; box-shadow: 0 6px 20px rgba(0, 172, 193, 0.4);" onclick="PublicWebsite.openBookMeetingModal()">
          📅 Schedule 1-on-1 Strategy Call
        </button>
        <button type="button" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.4); color: #FFF; font-weight: 800; border-radius: 12px; padding: 0.85rem 1.8rem; cursor: pointer; font-size: 1rem; transition: background 0.2s;" onclick="PublicWebsite.openRegisterModal()">
          ⚡ Instant Client Signup →
        </button>
      </div>
    </div>
  </section>

  <!-- Dark Footer -->
  <footer style="background: #080511; border-top: 1px solid rgba(255, 255, 255, 0.08); color: #9CA3AF; padding: 3.5rem 1.5rem 2.5rem 1.5rem; text-align: center; width: 100%;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 0.65rem; margin-bottom: 1.2rem;">
        <span class="brand-logo" style="display: flex; align-items: center;"><img src="" alt="Logo" style="height: 38px; object-fit: contain;"></span>
        <span style="font-weight: 900; font-size: 1.25rem; color: #FFF; letter-spacing: -0.5px;">BACKLINK<span style="color: #FF5555;">FASTER</span></span>
      </div>
      <p style="font-size: 0.88rem; color: #64748B; max-width: 550px; margin: 0 auto 1.5rem auto;">
        Premier white-hat backlink outreach, Core Web Vitals speed optimization, and enterprise technical SEO audit platform.
      </p>
      <div style="font-size: 0.85rem; color: #475569;">
        © 2026 SPECTRUM SEO Agency Mother Panel. All Rights Reserved.
      </div>
    </div>
  </footer>
</div>`
    },

    'new-order': {
      name: '🛒 New Order Page',
      html: `<div class="data-table-card">
  <!-- Audit CTA Header Banner -->
  <div style="background: linear-gradient(135deg, #1E054A 0%, #5C0E9E 35%, #A52090 65%, #C83090 85%, #6A0E90 100%); border-radius: 12px; padding: 1.25rem 1.5rem; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(92, 14, 158, 0.25); border: 1px solid rgba(255,255,255,0.2);">
    <div style="display: flex; align-items: center; gap: 1rem;">
      <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #00ACC1 0%, #0284C7 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800;">🔍</div>
      <div>
        <div style="font-weight: 800; font-size: 1.05rem; letter-spacing: -0.2px;">Want a 100% Free Complete Technical SEO Scan?</div>
        <div style="font-size: 0.8rem; color: #CBD5E1;">Analyze your domain's Core Web Vitals, crawl errors, backlinks & ranking opportunities.</div>
      </div>
    </div>
    <button type="button" class="btn-teal" style="padding: 0.6rem 1.25rem; font-weight: 800; font-size: 0.88rem; background: linear-gradient(135deg, #00ACC1 0%, #0284C7 100%); border: none; color: #FFF; border-radius: 8px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,172,193,0.3);" onclick="UserDashboard.switchTab('audit')">
      Audit your website →
    </button>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 1rem;">
    <div>
      {{order_success_box}}
      <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">Place New <span class="text-gradient">SEO Order</span></h2>
      <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Select an SEO campaign package below and launch organic ranking deliverables.</p>
    </div>
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; color: #00ACC1;">
      💳 Wallet Balance: {{user_balance}}
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
    <div>
      <div class="form-group" style="margin-bottom: 1.2rem;">
        <label class="text-gradient" style="font-weight: 800; margin-bottom: 0.4rem; display: block;">Category *</label>
        {{category_select_dropdown}}
      </div>

      <div class="form-group" style="margin-bottom: 1.2rem;">
        <label class="text-gradient" style="font-weight: 800; margin-bottom: 0.4rem; display: block;">Services *</label>
        {{service_select_dropdown}}
      </div>

      {{service_description_box}}

      <div class="form-group" style="margin-bottom: 1.2rem;">
        <label style="font-weight: 400; color: #1F2937; margin-bottom: 0.4rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.4rem;">
          Links: 
          <div style="position: relative; display: inline-flex;" onmouseenter="this.querySelector('.cust-tip').style.display='block'" onmouseleave="this.querySelector('.cust-tip').style.display='none'">
            <span style="display:inline-flex; align-items:center; justify-content:center; width: 14px; height: 14px; border: 1px solid #FCA5A5; color: #EF4444; border-radius: 50%; font-size: 0.6rem; font-weight: bold; cursor: help;">?</span>
            <div class="cust-tip" style="display: none; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background: #1E293B; color: #FFF; padding: 0.4rem 0.7rem; border-radius: 6px; font-size: 0.75rem; white-space: nowrap; z-index: 1000; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);">
              One Link/URL per line
            </div>
          </div>
          <div style="position: relative; display: inline-flex;" onmouseenter="this.querySelector('.cust-tip').style.display='block'" onmouseleave="this.querySelector('.cust-tip').style.display='none'">
            <span style="display:inline-flex; align-items:center; justify-content:center; color: #94A3B8; font-size: 0.9rem; cursor: help;">⚠️</span>
            <div class="cust-tip" style="display: none; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background: #1E293B; color: #FFF; padding: 0.4rem 0.7rem; border-radius: 6px; font-size: 0.75rem; white-space: nowrap; z-index: 1000; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);">
              All links will be used for all keywords randomly.
            </div>
          </div>
        </label>
        {{link_input_html}}
      </div>

      <div class="form-group" style="margin-bottom: 1.2rem; display: {{keywords_display}};">
        <label style="font-weight: 400; color: #1F2937; margin-bottom: 0.4rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.4rem;">
          Keywords: 
          <div style="position: relative; display: inline-flex;" onmouseenter="this.querySelector('.cust-tip').style.display='block'" onmouseleave="this.querySelector('.cust-tip').style.display='none'">
            <span style="display:inline-flex; align-items:center; justify-content:center; width: 14px; height: 14px; border: 1px solid #FCA5A5; color: #EF4444; border-radius: 50%; font-size: 0.6rem; font-weight: bold; cursor: help;">?</span>
            <div class="cust-tip" style="display: none; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background: #1E293B; color: #FFF; padding: 0.4rem 0.7rem; border-radius: 6px; font-size: 0.75rem; white-space: nowrap; z-index: 1000; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);">
              One keyword per line or comma separated
            </div>
          </div>
          <div style="position: relative; display: inline-flex;" onmouseenter="this.querySelector('.cust-tip').style.display='block'" onmouseleave="this.querySelector('.cust-tip').style.display='none'">
            <span style="display:inline-flex; align-items:center; justify-content:center; color: #94A3B8; font-size: 0.9rem; cursor: help;">⚠️</span>
            <div class="cust-tip" style="display: none; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background: #1E293B; color: #FFF; padding: 0.4rem 0.7rem; border-radius: 6px; font-size: 0.75rem; white-space: nowrap; z-index: 1000; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);">
              All keywords will be used for all links randomly.
            </div>
          </div>
        </label>
        <textarea id="usr-kw-input" class="form-control" rows="4" placeholder="Keyword Example (1 keyword for each 20 links)" style="font-size: 0.9rem; padding: 0.75rem; color: #64748B;"></textarea>
      </div>

      <!-- Price Card Field (Inside Form flow) -->
      <div class="form-group" style="margin-bottom: 1.5rem; background: #E6F4EA; border: 1px solid #10B981; border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <label style="font-weight: 800; color: #065F46; font-size: 1rem; margin: 0;">Price</label>
        <span style="font-size: 1.6rem; font-weight: 900; color: #059669;" id="usr-live-price-text">{{calculated_price}}</span>
      </div>

      <div id="usr-qty-container" class="form-group" style="margin-bottom: 1.5rem; display: {{quantity_display}};">
        <label style="font-weight: 700; color: #0F172A; margin-bottom: 0.4rem; display: block;">Quantity *</label>
        <input type="number" id="user-order-qty" class="form-control" value="1" min="1" onchange="UserDashboard.onQuantityChange(this.value)" oninput="UserDashboard.onQuantityChange(this.value)">
        {{quantity_limits_badge}}
        <div id="user-qty-error" style="color: #EF4444; font-size: 0.85rem; font-weight: 700; margin-top: 0.5rem; display: none;"></div>
      </div>

      <button class="btn-cta-gradient" style="width: 100%; padding: 0.85rem; font-size: 1rem; font-weight: 700; border-radius: 8px; color: #FFF; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;" onclick="UserDashboard.submitUserOrder()">
        Place Order
      </button>
    </div>

    <!-- Right Side: Custom HTML Card Banner & Package Summary Card -->
    <div style="display: {{summary_display}};">
      <!-- Dynamic Custom HTML/CSS Card Box (above Order Summary) -->
      <div id="usr-service-custom-card-container">
        {{service_custom_card_box}}
      </div>

      <!-- Package Summary Card -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem;">
        <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin-bottom: 1rem; border-bottom: 1px solid #CBD5E1; padding-bottom: 0.5rem;">📋 Order Summary</h3>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem;">
          <span style="color: #64748B;">Client:</span>
          <strong style="color: #0F172A;">{{user_name}}</strong>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem;">
          <span style="color: #64748B;">Delivery Time:</span>
          <strong id="summary-live-delivery" style="color: #059669;">{{service_avg_time}}</strong>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem;">
          <span style="color: #64748B;">Target Link:</span>
          <strong id="summary-live-link" style="color: #0284C7; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">-</strong>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 1.2rem; font-size: 0.9rem;">
          <span style="color: #64748B;">Keywords:</span>
          <strong id="summary-live-kw" style="color: #475569; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">-</strong>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #00ACC1; padding: 1rem; border-radius: 8px; text-align: center;">
          <div style="font-size: 0.8rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Total Campaign Cost</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #00ACC1;" id="order-total-price-display">{{calculated_price}}</div>
        </div>
      </div>
    </div>
  </div>
</div>`
    },

    'services': {
      name: '≡ Services Catalog Page',
      html: `<div class="data-table-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
    <div>
      <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">SEO Agency <span class="text-gradient">Services & Pricing Catalog</span></h2>
      <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Explore data-driven organic ranking services, link building packages, and technical audits.</p>
    </div>
  </div>

  {{services_table}}
</div>`
    },

    'orders': {
      name: '📦 Order History',
      html: `<div class="data-table-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
    <div>
      <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">Your <span class="text-gradient">Order History</span></h2>
      <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Track the progress and status of your active and past SEO campaigns.</p>
    </div>
    
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <input type="text" id="usr-order-search" class="form-control" style="width: 250px; padding: 0.5rem 0.8rem; font-size: 0.85rem;" placeholder="Search ID, Link, Keyword..." oninput="UserDashboard.filterOrders()">
      
      <select id="usr-order-status-filter" class="form-control" style="width: 150px; padding: 0.5rem 0.8rem; font-size: 0.85rem;" onchange="UserDashboard.filterOrders()">
        <option value="ALL">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="In Progress">In Progress</option>
        <option value="Partial">Partial</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  </div>

  <div id="usr-orders-table-container" style="overflow-x: auto;">
    {{orders_table}}
  </div>
</div>`
    },

    'add-funds': {
      name: '💳 Deposit Funds Page',
      html: `<div class="data-table-card">
  <div style="margin-bottom: 1.5rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 1rem;">
    <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">Deposit <span class="text-gradient">Account Funds</span></h2>
    <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Add USD funds to your client wallet to place instant SEO orders.</p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
    <div>
      <div class="form-group" style="margin-bottom: 1.2rem;">
        <label style="font-weight: 700; color: #0F172A; margin-bottom: 0.4rem; display: block;">Select Payment Gateway *</label>
        <select id="fund-gateway" class="form-control">
          <option value="Razorpay">Razorpay (UPI / Cards / NetBanking)</option>
          <option value="Paytm">Paytm Instant QR</option>
          <option value="Stripe">Stripe (International Credit/Debit Cards)</option>
          <option value="PayPal">PayPal Instant Credit</option>
          <option value="Crypto">Crypto (USDT / BTC / ETH)</option>
        </select>
      </div>

      <div class="form-group" style="margin-bottom: 1.5rem;">
        <label style="font-weight: 700; color: #0F172A; margin-bottom: 0.4rem; display: block;">Deposit Amount ($ USD) *</label>
        <input type="number" id="fund-amount" class="form-control" placeholder="100.00" min="10">
      </div>

      <button class="btn-teal" style="width: 100%; padding: 0.85rem; font-size: 1rem; font-weight: 700; border-radius: 8px;" onclick="UserDashboard.submitAddFunds()">
        💳 Proceed to Secure Payment
      </button>
    </div>

    <!-- Current Balance Card -->
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">💰</div>
      <h3 style="font-size: 1.1rem; font-weight: 700; color: #0F172A; margin-bottom: 0.3rem;">Current Available Balance</h3>
      <div style="font-size: 2.2rem; font-weight: 800; color: #00ACC1; margin-bottom: 0.8rem;">{{user_balance}}</div>
      <p style="font-size: 0.85rem; color: #64748B; max-width: 280px; margin: 0;">Instant credit after payment approval. All transactions are SSL encrypted.</p>
    </div>
  </div>
</div>`
    },

    'orders': {
      name: '📦 Order History Page',
      html: `<div class="data-table-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
    <div>
      <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">My SEO <span class="text-gradient">Order Deliverables</span></h2>
      <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Track real-time progress of active and completed search engine optimization campaigns.</p>
    </div>
  </div>

  {{orders_table}}
</div>`
    },

    'audit': {
      name: '🔍 Audit Your Website',
      html: `<style>
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(0, 172, 193, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(0, 172, 193, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 172, 193, 0); }
  }
  .audit-premium-card {
    background: linear-gradient(135deg, #0a0514 0%, #1a0b2e 100%);
    color: #F8FAFC;
    border: none;
    border-radius: 16px;
    padding: 3rem 2rem;
    position: relative;
    overflow: hidden;
  }
  .audit-premium-card::before {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(0,172,193,0.1) 0%, transparent 60%);
    z-index: 0;
    pointer-events: none;
  }
  .audit-content-wrapper {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    animation: fadeInUp 0.8s ease-out forwards;
  }
  .audit-input-fancy {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
    padding: 1.2rem;
    font-size: 1.1rem;
    border-radius: 12px;
    width: 100%;
    transition: all 0.3s ease;
  }
  .audit-input-fancy:focus {
    outline: none;
    border-color: #00ACC1;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 15px rgba(0, 172, 193, 0.2);
  }
</style>
<div class="data-table-card audit-premium-card">
  <div style="display: flex; justify-content: flex-end; position: absolute; top: 1.5rem; right: 1.5rem; z-index: 2;">
    <button type="button" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-radius: 8px; font-weight: 700; cursor: pointer; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF; backdrop-filter: blur(5px); transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" onclick="UserDashboard.switchTab('audit-history')">
      📋 View Audit History
    </button>
  </div>

  <div class="audit-content-wrapper">
    <div style="text-align: center; margin-bottom: 3rem;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background: linear-gradient(135deg, #00ACC1 0%, #0284C7 100%); border-radius: 20px; font-size: 2.5rem; margin-bottom: 1.5rem; animation: pulseGlow 2s infinite; box-shadow: 0 10px 25px rgba(0,172,193,0.3);">
        🔍
      </div>
      <h2 style="color: #FFFFFF; font-weight: 800; font-size: 2.5rem; margin: 0 0 0.5rem 0; letter-spacing: -1px;">Technical <span style="background: linear-gradient(135deg, #00ACC1, #0284C7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SEO Audit</span> Engine</h2>
      <p style="color: #9CA3AF; font-size: 1.15rem; max-width: 600px; margin: 0 auto;">Submit your domain for a comprehensive 54-metric diagnostic crawl and senior agency manual review.</p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 2.5rem; backdrop-filter: blur(10px);">
      <div class="form-group" style="margin-bottom: 2rem;">
        <label style="font-weight: 700; color: #E2E8F0; margin-bottom: 0.8rem; display: block; font-size: 1.05rem;">Target Website Link / Domain URL *</label>
        <input type="url" id="usr-audit-website-url" class="audit-input-fancy" placeholder="https://yourwebsite.com">
      </div>

      <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid #F59E0B; border-radius: 8px; padding: 1.25rem; margin-bottom: 2.5rem; display: flex; gap: 1rem; align-items: flex-start;">
        <span style="font-size: 1.5rem; margin-top: 0.1rem;">⏱️</span>
        <div style="font-size: 0.95rem; color: #FCD34D; line-height: 1.6;">
          <strong style="color: #FBBF24;">24-Hour Delivery Guarantee:</strong> Audit requests undergo an automated crawler diagnostic followed by senior team verification. Status will show <code>Pending</code> and your full 54-field agency report will be ready within 24 hours.
        </div>
      </div>

      <button type="button" style="width: 100%; padding: 1.2rem; font-size: 1.1rem; font-weight: 800; border-radius: 12px; background: linear-gradient(135deg, #00ACC1 0%, #0284C7 100%); color: #FFF; border: none; cursor: pointer; box-shadow: 0 10px 25px rgba(0, 172, 193, 0.4); text-transform: uppercase; letter-spacing: 1px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'" onclick="UserDashboard.submitSiteAuditRequest()">
        🚀 Request Website Audit Now
      </button>
    </div>
  </div>
</div>`
    },

    'audit-history': {
      name: '📋 Audit History Page',
      html: `<div class="data-table-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
    <div>
      <h2 style="color: #0F172A; font-weight: 800; margin: 0 0 0.2rem 0;">📋 Site <span class="text-gradient">Audit History</span></h2>
      <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Track audit status, monitor review progress, and view completed 54-metric agency reports.</p>
    </div>
    <button type="button" class="btn-teal" style="padding: 0.55rem 1.1rem; font-size: 0.85rem; border-radius: 6px; font-weight: 700; cursor: pointer; background: #00ACC1; border: none; color: #FFF;" onclick="UserDashboard.switchTab('audit')">
      + Audit Website
    </button>
  </div>

  {{audit_history_table}}
</div>`
    },

    'tickets': {
      name: '🗣️ Support Tickets Page',
      html: `<div class="data-table-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
    <div>
      <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">Client <span class="text-gradient">Support Desk</span></h2>
      <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Have a question about your SEO ranking strategy? Open a direct ticket with our senior engineers.</p>
    </div>
    <button class="btn-teal" onclick="UserDashboard.openCreateTicketModal()">+ Create Support Ticket</button>
  </div>

  {{tickets_list}}
</div>`
    },

    'account': {
      name: '👤 Account Settings Page',
      html: `<div class="data-table-card">
  <div style="margin-bottom: 1.5rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 1rem;">
    <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">Account <span class="text-gradient">Profile & Security</span></h2>
    <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Manage personal details, API keys, and account security preferences.</p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
    <div>
      <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin-bottom: 1rem;">👤 Profile Credentials</h3>
      <div class="form-group" style="margin-bottom: 1rem;">
        <label style="font-weight: 600; color: #374151;">Full Name</label>
        <input type="text" class="form-control" value="{{user_name}}" readonly style="background:#F1F5F9;">
      </div>
      <div class="form-group" style="margin-bottom: 1rem;">
        <label style="font-weight: 600; color: #374151;">Username</label>
        <input type="text" class="form-control" value="{{user_username}}" readonly style="background:#F1F5F9;">
      </div>
      <div class="form-group" style="margin-bottom: 1rem;">
        <label style="font-weight: 600; color: #374151;">Email Address</label>
        <input type="email" class="form-control" value="{{user_email}}" readonly style="background:#F1F5F9;">
      </div>
    </div>

    <div>
      <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin-bottom: 1rem;">🔒 Security & Password</h3>
      <div class="form-group" style="margin-bottom: 1rem;">
        <label style="font-weight: 600; color: #374151;">Current Password *</label>
        <input type="password" id="usr-current-pass" class="form-control" placeholder="Enter current password">
      </div>
      <div class="form-group" style="margin-bottom: 1rem;">
        <label style="font-weight: 600; color: #374151;">New Password *</label>
        <input type="password" id="usr-new-pass" class="form-control" placeholder="Enter new password">
      </div>
      <div id="pass-change-msg" style="color: #EF4444; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;"></div>
      <button class="btn-teal" style="width: 100%; margin-top: 0.5rem;" onclick="UserDashboard.changePassword()">
        Update Password
      </button>

      <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin-top: 2rem; margin-bottom: 1rem;">🔑 API Key & Access</h3>
      <div class="form-group" style="margin-bottom: 1rem;">
        <label style="font-weight: 600; color: #374151;">Client API Key</label>
        <input type="text" class="form-control" value="{{user_api_key}}" readonly style="background:#F1F5F9; font-family: monospace;">
      </div>
      <button class="btn-teal" style="width: 100%; margin-top: 0.5rem;" onclick="App.showToast('API Key re-generated successfully!')">
        🔄 Re-generate API Key
      </button>
    </div>
  </div>
</div>`
    },

    'affiliate': {
      name: '🔔 Affiliate & Referral Page',
      html: `<div class="data-table-card" style="background: radial-gradient(ellipse 80% 60% at 50% 0%, #3A0A78 0%, transparent 65%), radial-gradient(ellipse 70% 50% at 72% 28%, #8B1FA8 0%, transparent 58%), radial-gradient(ellipse 90% 70% at 28% 58%, #C43098 0%, transparent 58%), radial-gradient(ellipse 65% 55% at 8% 92%, #F07530 0%, transparent 58%), radial-gradient(ellipse 50% 40% at 92% 80%, #8C1FA5 0%, transparent 52%), linear-gradient(160deg, #1E054A 0%, #5C0E9E 25%, #A52090 50%, #C83090 65%, #B04020 85%, #6A0E90 100%) !important; color: #F8FAFC; border: none; padding: 2.5rem; border-radius: 16px;">
  <div style="margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 1.5rem; text-align: center;">
    <h2 style="color: #FFFFFF; font-weight: 800; font-size: 2rem; margin: 0 0 0.5rem 0;">SEO Agency <span style="background: linear-gradient(135deg, #00ACC1, #0284C7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Affiliate Partner</span> Program</h2>
    <p style="color: #9CA3AF; font-size: 1.1rem; margin: 0;">Earn <strong style="color: #10B981;">{{referral_commission_rate}}</strong> lifetime recurring commission for every client you refer.</p>
  </div>

  <!-- Referral Program Stat Badges -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1.5rem; text-align: center; backdrop-filter: blur(10px);">
      <div style="font-size: 0.85rem; color: #9CA3AF; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Commission Rate</div>
      <div style="font-size: 2rem; font-weight: 800; color: #00ACC1; margin-top: 0.5rem;">{{referral_commission_rate}}</div>
    </div>
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1.5rem; text-align: center; backdrop-filter: blur(10px);">
      <div style="font-size: 0.85rem; color: #9CA3AF; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Total Referral Earnings</div>
      <div style="font-size: 2rem; font-weight: 800; color: #10B981; margin-top: 0.5rem;">{{referral_earnings_total}}</div>
    </div>
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1.5rem; text-align: center; backdrop-filter: blur(10px);">
      <div style="font-size: 0.85rem; color: #9CA3AF; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Minimum Payout Limit</div>
      <div style="font-size: 2rem; font-weight: 800; color: #F59E0B; margin-top: 0.5rem;">{{referral_min_payout}}</div>
    </div>
  </div>

  <div style="background: rgba(0, 172, 193, 0.1); border: 1px dashed rgba(0, 172, 193, 0.5); padding: 2rem; border-radius: 16px; margin-bottom: 2.5rem; text-align: center;">
    <h3 style="font-size: 1.1rem; font-weight: 700; color: #FFFFFF; margin-bottom: 1rem;">Your Unique Referral Link</h3>
    <input type="text" id="usr-ref-link-input" readonly class="form-control" style="max-width: 600px; margin: 0 auto; text-align: center; font-weight: 700; color: #00ACC1; background: #FFFFFF; border: none; padding: 1rem; border-radius: 8px; font-size: 1.1rem;" value="{{referral_link}}">
    <button type="button" class="btn-teal" style="margin-top: 1.2rem; padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 172, 193, 0.4);" onclick="navigator.clipboard.writeText(document.getElementById('usr-ref-link-input')?.value || ''); App.showToast('📋 Referral link copied to clipboard!');">📋 Copy Referral Link</button>
  </div>

  <h3 style="font-size: 1.2rem; font-weight: 700; color: #FFFFFF; margin-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem;">📋 My Referral Earnings Log</h3>
  <div style="background: rgba(255, 255, 255, 0.02); border-radius: 12px; padding: 1rem; overflow-x: auto;">
    {{referral_payouts_table}}
  </div>
</div>`
    },

    'balance_logs': {
      name: '💵 Balance Logs Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Historical Balance Logs</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Track all deposit receipts and order deductions for account {{user_email}}.</p>
  <div style="margin-top: 2rem; overflow-x: auto;">
    {{balance_logs_table}}
  </div>
</div>`
    },

    'audit_report_view': {
      name: '📊 Audit Report View',
      html: `
<div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 1200px; margin: 0 auto;">
  <!-- Top Banner (Screenshot 85) - Full Gradient, Transparent Logo, No Left LOGO Text -->
  <div style="background: linear-gradient(135deg, #1E054A 0%, #5C0E9E 35%, #A52090 65%, #C83090 85%, #6A0E90 100%); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15); position: relative; height: 90px;">
    
    <div style="display: flex; align-items: center; padding: 0 2rem; z-index: 2;">
      <div>
        <a href="{{audit_site_link}}" target="_blank" style="font-weight: 800; font-size: 1.2rem; color: #FFFFFF; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
          <span style="color: #38BDF8;">🔗</span> {{audit_site_link_text}}
        </a>
        <div style="color: #E2E8F0; font-size: 0.85rem; font-weight: 600; margin-top: 0.2rem;">{{audit_client_name}}</div>
      </div>
    </div>
    
    <!-- Right side Transparent Logo -->
    <div style="display: flex; justify-content: flex-end; align-items: center; padding-right: 2rem; z-index: 2;">
      <div style="padding: 0.5rem 0;">
        <img src="{{agency_logo_url}}" alt="Agency Logo" style="height: 40px; max-width: 150px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
      </div>
    </div>
  </div>

  <!-- Body Content (Screenshot 86) -->
  <div style="display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem;">
    
    <!-- Left Sidebar Column -->
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- Score Box -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center; display: flex; flex-direction: column; align-items: center;">
        <div style="font-size: 0.85rem; color: #64748B; font-weight: 700; margin-bottom: 0.2rem;">Website score for</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">{{audit_site_link_text}}</div>
        <div style="font-size: 0.75rem; color: #94A3B8; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
          <span>📍 ${"{{audit_ip}}"}</span> | <span>🔒 enabled</span>
        </div>
        
        <div style="position: relative; width: 140px; height: 140px; border-radius: 50%; background: conic-gradient(#10B981 ${"{{audit_score}}"}%, #D1FAE5 0deg); display: flex; justify-content: center; align-items: center; margin-bottom: 1.5rem;">
          <div style="position: absolute; width: 120px; height: 120px; background: #FFFFFF; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <span style="font-size: 2.2rem; font-weight: 900; color: #0F172A; line-height: 1;">{{audit_score}}</span>
            <span style="font-size: 0.8rem; color: #94A3B8; font-weight: 600;">of 100</span>
          </div>
        </div>
      </div>

      <!-- Additional Metrics Box -->
      <div style="background: #F8FAFC; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #475569; font-weight: 600;"><span>📄</span> Crawled pages</div>
          <div style="font-weight: 800; color: #0F172A;">{{audit_crawled_pages}}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #475569; font-weight: 600;"><span>G</span> Google indexable pages</div>
          <div style="font-weight: 800; color: #0F172A;">{{audit_indexable_pages}}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #475569; font-weight: 600;"><span style="color: #10B981;">✅</span> Google safe browsing</div>
          <div style="font-weight: 800;">{{audit_safe_browsing_html}}</div>
        </div>
      </div>
      
    </div>

    <!-- Right Content Column (Charts Grid) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; align-content: start;">
      
      <!-- 1. Domain Authority -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #3B82F6;">{{audit_domain_authority}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          Domain Authority ( DA )
          <span class="custom-tooltip-icon" data-tooltip="This metric predicts how well your overall website will rank on search engines. Graded on a scale of 1 to 100, a higher score means greater ranking potential and credibility." style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <svg viewBox="0 0 100 30" style="width: 100%; height: 50px; margin-top: 1rem;">
          <path d="M0 28 Q 5 28, 10 10 L 20 8 L 100 8" fill="none" stroke="#3B82F6" stroke-width="2"/>
        </svg>
      </div>

      <!-- 2. Page Authority -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #3B82F6;">{{audit_page_authority}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          Page Authority ( PA )
          <span class="custom-tooltip-icon" data-tooltip="This score predicts the likelihood of a specific page on your website ranking well in search engine results, independent of the overall domain's strength." style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <svg viewBox="0 0 100 30" style="width: 100%; height: 50px; margin-top: 1rem;">
          <path d="M0 25 Q 5 25, 10 10 L 20 5 L 100 5" fill="none" stroke="#3B82F6" stroke-width="2"/>
        </svg>
      </div>

      <!-- 3. Domain Rating -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #3B82F6;">{{audit_domain_rating}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          Domain Rating ( DR )
          <span class="custom-tooltip-icon" data-tooltip="This metric shows the overall strength and quality of your website's total backlink profile compared to other sites in the database, measured on a 100-point scale." style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <svg viewBox="0 0 100 30" style="width: 100%; height: 50px; margin-top: 1rem;">
          <path d="M0 25 Q 10 5, 30 10 T 60 15 T 100 10" fill="none" stroke="#3B82F6" stroke-width="2"/>
        </svg>
      </div>

      <!-- 4. Ranking Keywords -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #3B82F6;">{{audit_ranking_keywords}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          Ranking Keywords
          <span class="custom-tooltip-icon" data-tooltip="This indicates the total number of unique search terms (keywords) for which your website's pages are currently appearing in the top organic search engine results." style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <div style="height: 50px; display: flex; align-items: flex-end; gap: 4px; margin-top: 1rem;">
          <div style="width: 10%; background: #3B82F6; height: 30%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 40%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 60%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 80%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 100%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 70%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 60%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 50%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 85%;"></div>
          <div style="width: 10%; background: #3B82F6; height: 85%;"></div>
        </div>
      </div>

      <!-- 5. Spam Score -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #EF4444;">{{audit_spam_score}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          Spam Score
          <span class="custom-tooltip-icon" data-tooltip="This percentage reflects the likelihood that your website might be considered spammy by search engines due to toxic backlinks or poor SEO practices. A lower score is always better." style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <svg viewBox="0 0 100 30" style="width: 100%; height: 50px; margin-top: 1rem;">
          <path d="M0 20 L 100 20" fill="none" stroke="#EF4444" stroke-width="2"/>
        </svg>
      </div>

      <!-- 6. Domain Age -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #3B82F6;">{{audit_domain_age}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          Domain Age
          <span class="custom-tooltip-icon" data-tooltip="This shows the total time that has passed since your website's domain name was first registered. Older domains often carry more trust and authority with search engines" style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <svg viewBox="0 0 100 30" style="width: 100%; height: 50px; margin-top: 1rem;">
          <path d="M0 25 L 100 5" fill="none" stroke="#3B82F6" stroke-width="2"/>
        </svg>
      </div>

      <!-- 7. Total Backlinks -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #3B82F6;">{{audit_total_backlinks}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          Total Backlinks
          <span class="custom-tooltip-icon" data-tooltip="This is the total number of incoming hyperlinks from other websites pointing to your site. Acquiring high-quality backlinks is a major factor in improving your search rankings." style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <svg viewBox="0 0 100 30" style="width: 100%; height: 50px; margin-top: 1rem;">
          <path d="M0 25 Q 15 15, 30 15 T 60 10 T 100 5" fill="none" stroke="#3B82F6" stroke-width="2"/>
        </svg>
      </div>

      <!-- 8. referring domains -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #3B82F6;">{{audit_referring_domains}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          referring domains
          <span class="custom-tooltip-icon" data-tooltip="This shows the total number of unique, external websites linking back to yours. Even if one website links to you 10 times, it still counts as only one referring domain." style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <svg viewBox="0 0 100 30" style="width: 100%; height: 50px; margin-top: 1rem;">
          <path d="M0 25 Q 5 10, 10 5 L 100 5" fill="none" stroke="#3B82F6" stroke-width="2"/>
        </svg>
      </div>

      <!-- 9. Organic traffic -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); min-height: 160px; display: flex; flex-direction: column;">
        <div style="font-size: 1.6rem; font-weight: 800; color: #3B82F6;">{{audit_organic_traffic}}</div>
        <div style="font-size: 0.75rem; color: #0F172A; font-weight: 600; margin-bottom: auto; display: flex; align-items: center;">
          Organic traffic
          <span class="custom-tooltip-icon" data-tooltip="This represents the estimated number of visitors arriving at your website through unpaid, natural search engine results over a selected period of time." style="margin-left: 0.4rem; cursor: pointer;"><i class="fa-solid fa-circle-info" style="color: #94A3B8; font-size: 0.85rem;"></i></span>
        </div>
        <svg viewBox="0 0 100 30" style="width: 100%; height: 50px; margin-top: 1rem;">
          <path d="M0 25 Q 10 5, 20 10 T 40 12 T 60 8 T 80 15 T 100 10" fill="none" stroke="#3B82F6" stroke-width="2"/>
        </svg>
      </div>

    </div>
  </div>

  <!-- Diagnose Performance Issues Section -->
  <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem;">
      <span style="color: #3B82F6; font-size: 1.1rem;">●</span>
      <span style="font-weight: 700; font-size: 1rem; color: #0F172A;">Diagnose performance issues</span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap;">
      <!-- Left: Circular Gauges -->
      <div style="display: flex; justify-content: flex-start; gap: 3rem; flex-wrap: wrap; padding: 0.5rem 0; flex: 1; min-width: 300px;">
        <!-- Performance -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <div style="position: relative; width: 70px; height: 70px;">
            <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#E5E7EB" stroke-width="3"/>
              <circle cx="18" cy="18" r="16" fill="none" stroke="{{audit_perf_color}}" stroke-width="3" stroke-dasharray="{{audit_perf_dash}} 100.53" stroke-linecap="round"/>
            </svg>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.1rem; font-weight: 800; color: {{audit_perf_color}};">{{audit_perf_score}}</div>
          </div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #475569;">Performance</div>
        </div>
        <!-- Accessibility -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <div style="position: relative; width: 70px; height: 70px;">
            <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#E5E7EB" stroke-width="3"/>
              <circle cx="18" cy="18" r="16" fill="none" stroke="{{audit_a11y_color}}" stroke-width="3" stroke-dasharray="{{audit_a11y_dash}} 100.53" stroke-linecap="round"/>
            </svg>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.1rem; font-weight: 800; color: {{audit_a11y_color}};">{{audit_a11y_score}}</div>
          </div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #475569;">Accessibility</div>
        </div>
        <!-- Best Practices -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <div style="position: relative; width: 70px; height: 70px;">
            <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#E5E7EB" stroke-width="3"/>
              <circle cx="18" cy="18" r="16" fill="none" stroke="{{audit_bp_color}}" stroke-width="3" stroke-dasharray="{{audit_bp_dash}} 100.53" stroke-linecap="round"/>
            </svg>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.1rem; font-weight: 800; color: {{audit_bp_color}};">{{audit_bp_score}}</div>
          </div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #475569;">Best Practices</div>
        </div>
        <!-- SEO -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <div style="position: relative; width: 70px; height: 70px;">
            <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#E5E7EB" stroke-width="3"/>
              <circle cx="18" cy="18" r="16" fill="none" stroke="{{audit_seo_color}}" stroke-width="3" stroke-dasharray="{{audit_seo_dash}} 100.53" stroke-linecap="round"/>
            </svg>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.1rem; font-weight: 800; color: {{audit_seo_color}};">{{audit_seo_score}}</div>
          </div>
          <div style="font-size: 0.78rem; font-weight: 600; color: #475569;">SEO</div>
        </div>
      </div>
      
      <!-- Right: Text Metrics -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex: 1; min-width: 300px; padding: 0.5rem 0;">
        <div style="display: flex; flex-direction: column; gap: 0.2rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="color: #0c6; font-size: 0.8rem;">●</span>
            <span style="font-size: 0.9rem; font-weight: 600; color: #0F172A;">Speed Index</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 700; color: #080; margin-left: 1.2rem;">{{audit_si}}</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.2rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="color: #0c6; font-size: 0.8rem;">●</span>
            <span style="font-size: 0.9rem; font-weight: 600; color: #0F172A;">Cumulative Layout Shift</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 700; color: #080; margin-left: 1.2rem;">{{audit_cls}}</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.2rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="color: #0c6; font-size: 0.8rem;">●</span>
            <span style="font-size: 0.9rem; font-weight: 600; color: #0F172A;">First Contentful Paint</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 700; color: #080; margin-left: 1.2rem;">{{audit_fcp}}</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.2rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="color: #0c6; font-size: 0.8rem;">●</span>
            <span style="font-size: 0.9rem; font-weight: 600; color: #0F172A;">Total Blocking Time</span>
          </div>
          <div style="font-size: 1.4rem; font-weight: 700; color: #080; margin-left: 1.2rem;">{{audit_tbt}}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Server & Network Level Checks Section -->
  <div style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-top: 1.5rem;">
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem;">
      <span style="color: #3B82F6; font-size: 1.1rem;">🌍</span>
      <span style="font-weight: 700; font-size: 1rem; color: #0F172A;">Server & Network Level Checks</span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
      <!-- Card 1 -->
      <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; border: 1px solid #E2E8F0;">
        <div style="font-size: 0.75rem; color: #64748B; font-weight: 700; margin-bottom: 0.3rem;">HTTP Status Code</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">{{audit_http_status_code}}</div>
      </div>
      <!-- Card 2 -->
      <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; border: 1px solid #E2E8F0;">
        <div style="font-size: 0.75rem; color: #64748B; font-weight: 700; margin-bottom: 0.3rem;">SSL Certificate</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">{{audit_ssl_details}}</div>
      </div>
      <!-- Card 3 -->
      <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; border: 1px solid #E2E8F0;">
        <div style="font-size: 0.75rem; color: #64748B; font-weight: 700; margin-bottom: 0.3rem;">WWW vs Non-WWW</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">{{audit_www_redirect}}</div>
      </div>
      <!-- Card 4 -->
      <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; border: 1px solid #E2E8F0;">
        <div style="font-size: 0.75rem; color: #64748B; font-weight: 700; margin-bottom: 0.3rem;">HTTP to HTTPS</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">{{audit_https_redirect}}</div>
      </div>
      <!-- Card 5 -->
      <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; border: 1px solid #E2E8F0;">
        <div style="font-size: 0.75rem; color: #64748B; font-weight: 700; margin-bottom: 0.3rem;">Page File Size (HTML)</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">{{audit_html_size}}</div>
      </div>
      <!-- Card 6 -->
      <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; border: 1px solid #E2E8F0;">
        <div style="font-size: 0.75rem; color: #64748B; font-weight: 700; margin-bottom: 0.3rem;">Compression</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">{{audit_compression}}</div>
      </div>
      <!-- Card 7 -->
      <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; border: 1px solid #E2E8F0;">
        <div style="font-size: 0.75rem; color: #64748B; font-weight: 700; margin-bottom: 0.3rem;">Security Headers</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">{{audit_security_headers}}</div>
      </div>
    </div>
  </div>

</div>
      `
    },

    'mass_order': {
      name: '👥 Mass Order Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Bulk Mass Order Importer</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Submit multiple SEO backlink campaigns in one CSV batch.</p>
</div>`
    },

    'subscriptions': {
      name: '📋 Subscriptions Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Monthly Retainer Subscriptions</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Manage automated recurring monthly link building subscriptions.</p>
</div>`
    },

    'dripfeed': {
      name: '💧 Dripfeed Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Dripfeed Link Building Schedule</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Gradually drip backlinks over 30 to 90 days for max organic safety.</p>
</div>`
    },

    'reviews': {
      name: '⭐ Reviews & Case Studies Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Client Success Case Studies</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Verified organic growth proof and client testimonials.</p>
</div>`
    },

    'updates': {
      name: '🔄 Updates & Algorithm News Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Google Algorithm & System Updates</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Real-time search engine core update advisories.</p>
</div>`
    },

    'terms': {
      name: 'ℹ️ Terms of Service & Privacy Policy',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Terms of Service & Usage Guarantee</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Our 30-day refill guarantee and privacy policy.</p>
</div>`
    },

    'blog': {
      name: '📝 Blog & SEO Guides Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">SEO Insights & Growth Guides</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Actionable tutorials on scaling domain authority and organic traffic.</p>
</div>`
    },

    'childpanel': {
      name: '🗂️ Child Panel Store Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">White Label Child Panel Store</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Rent your own branded SEO reseller website.</p>
</div>`
    },

    'contact_us': {
      name: '📞 Contact Us Strategy Team',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Contact Senior Strategists</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Schedule a 1-on-1 strategy session with our agency leads.</p>
</div>`
    },

    'cookie-policy': {
      name: '🍪 Cookie Policy Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Cookie & Privacy Disclosures</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Information regarding cookies and session data.</p>
</div>`
    },

    'faq': {
      name: '❓ FAQs Page',
      html: `<div class="data-table-card">
  <div style="margin-bottom: 1.5rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 1rem;">
    <h2 style="color: #0F172A; font-weight: 700; margin: 0 0 0.2rem 0;">Frequently Asked <span class="text-gradient">Questions</span></h2>
    <p style="color: #64748B; font-size: 0.88rem; margin: 0;">Everything you need to know about our organic ranking services and delivery guarantees.</p>
  </div>

  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1.2rem; border-radius: 8px;">
      <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin-bottom: 0.4rem;">❓ How fast do SEO backlinks get indexed?</h3>
      <p style="font-size: 0.88rem; color: #64748B; margin: 0;">Our backlinks use high-tier Google Search Console crawlers and are indexed within 7 to 14 business days.</p>
    </div>
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1.2rem; border-radius: 8px;">
      <h3 style="font-size: 1rem; font-weight: 700; color: #0F172A; margin-bottom: 0.4rem;">❓ What is the 30-day refill guarantee?</h3>
      <p style="font-size: 0.88rem; color: #64748B; margin: 0;">If any backlink drops within 30 days of campaign completion, our automated system refills it free of charge.</p>
    </div>
  </div>
</div>`
    },

    'free': {
      name: '♦️ Free Trial & Audit Scanner Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Free Site Audit & Speed Scanner</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Run instant website health checks and CWV tests.</p>
</div>`
    },

    'funds_transfer': {
      name: '🔄 Transfer Balance Page',
      html: `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">Wallet Balance Transfer</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Transfer funds to peer client accounts instantly.</p>
</div>`
    }
  },

  state: {
    templates: {},
    activeEditingPage: 'landing-page'
  },

  init() {
    this.loadFromStorage();
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('seo_page_templates');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state.templates = { ...this.defaultTemplates, ...parsed };
      } else {
        this.state.templates = JSON.parse(JSON.stringify(this.defaultTemplates));
      }
      // Always ensure landing page is synchronized with latest full-width theme template
      this.state.templates['landing-page'] = JSON.parse(JSON.stringify(this.defaultTemplates['landing-page']));
      
      // Force sync Phase 4 templates to ensure CTA banners and tables are rendered for existing sessions
      this.state.templates['new-order'] = JSON.parse(JSON.stringify(this.defaultTemplates['new-order']));
      this.state.templates['audit'] = JSON.parse(JSON.stringify(this.defaultTemplates['audit']));
      this.state.templates['audit-history'] = JSON.parse(JSON.stringify(this.defaultTemplates['audit-history']));
    } catch(e) {
      console.error('Error loading page templates:', e);
      this.state.templates = JSON.parse(JSON.stringify(this.defaultTemplates));
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem('seo_page_templates', JSON.stringify(this.state.templates));
      App.showToast('✅ Saved Page Template Code to LocalStorage!');
      if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
        App.broadcastMenuUpdate();
      }
    } catch(e) {
      console.error('Error saving page templates:', e);
    }
  },

  // Create Custom Page Wizard Handler
  createCustomPage(name, slug, icon = '📄', visibility = 'All', initialHtml = '') {
    if (!name || !slug) return { success: false, message: 'Page name and slug are required.' };
    
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const fullSlug = cleanSlug.startsWith('/') ? cleanSlug : `/${cleanSlug}`;
    const pageKey = cleanSlug.replace(/^\//, '');

    const defaultHtml = initialHtml || `<div class="data-table-card">
  <h2 style="color: #0F172A; font-weight: 700; margin-bottom: 0.4rem;">${name}</h2>
  <p style="color: #64748B; font-size: 0.88rem;">Custom page built by Admin. Welcome to ${name}.</p>
</div>`;

    this.state.templates[pageKey] = {
      name: `${icon} ${name}`,
      html: defaultHtml
    };
    this.saveToStorage();

    // Register in MenuEngine
    if (typeof MenuEngine !== 'undefined') {
      const maxId = Math.max(...MenuEngine.state.menuItems.map(m => m.id)) + 1;
      const maxOrder = Math.max(...MenuEngine.state.menuItems.map(m => m.orderIndex || 0)) + 1;

      MenuEngine.state.menuItems.push({
        id: maxId,
        name: name,
        icon: icon,
        slug: fullSlug,
        linkType: 'Internal',
        openIn: 'Same tab',
        visibility: visibility,
        status: 'Active',
        active: true,
        isExternal: false,
        orderIndex: maxOrder,
        metaTitle: `${name} | Spectrum SEO Agency`,
        metaDescription: `Custom page for ${name}`,
        metaKeywords: name.toLowerCase()
      });
      MenuEngine.saveToStorage();
    }

    App.showToast(`Custom page "${name}" created & added to Menu!`);
    return { success: true, pageKey: pageKey };
  },

  resetTemplate(pageKey) {
    if (this.defaultTemplates[pageKey]) {
      this.state.templates[pageKey] = JSON.parse(JSON.stringify(this.defaultTemplates[pageKey]));
      this.saveToStorage();
      App.showToast(`Restored "${pageKey}" to factory default code template!`);
    }
  },

  // Dynamic Variable Compiler
  compileAndRender(pageKey, data = {}) {
    this.loadFromStorage();
    const tmplObj = this.state.templates[pageKey] || this.defaultTemplates[pageKey];
    if (!tmplObj || !tmplObj.html) {
      return `<div class="data-table-card"><h2>${pageKey}</h2><p>Default template content.</p></div>`;
    }

    let html = tmplObj.html;

    // Substitute Dynamic Placeholders
    html = html.replace(/\{\{user_name\}\}/g, data.user_name || 'Valued Client');
    html = html.replace(/\{\{user_email\}\}/g, data.user_email || 'client@domain.com');
    html = html.replace(/\{\{user_balance\}\}/g, data.user_balance || '$0.00');
    html = html.replace(/\{\{user_api_key\}\}/g, data.user_api_key || 'sk_live_seo_99812489124');
    html = html.replace(/\{\{calculated_price\}\}/g, data.calculated_price || '$150.00');
    html = html.replace(/\{\{referral_link\}\}/g, data.referral_link || 'https://spectrumseo.com/ref/client101');
    html = html.replace(/\{\{link_input_html\}\}/g, data.link_input_html || '');
    html = html.replace(/\{\{keywords_display\}\}/g, data.keywords_display || 'block');
    html = html.replace(/\{\{referral_commission_rate\}\}/g, data.referral_commission_rate || '10%');
    html = html.replace(/\{\{referral_min_payout\}\}/g, data.referral_min_payout || '$50.00 USD');
    html = html.replace(/\{\{referral_earnings_total\}\}/g, data.referral_earnings_total || '$0.00 USD');
    html = html.replace(/\{\{referral_payouts_table\}\}/g, data.referral_payouts_table || '');
    html = html.replace(/\{\{balance_logs_table\}\}/g, data.balance_logs_table || '');

    // Audit Report fields
    html = html.replace(/\{\{audit_site_link\}\}/g, data.audit_site_link || '#');
    html = html.replace(/\{\{audit_site_link_text\}\}/g, data.audit_site_link_text || 'Website Link');
    html = html.replace(/\{\{audit_client_name\}\}/g, data.audit_client_name || 'Client Name');
    html = html.replace(/\{\{agency_logo_url\}\}/g, data.agency_logo_url || '');
    html = html.replace(/\{\{audit_ip\}\}/g, data.audit_ip || 'N/A');
    html = html.replace(/\{\{audit_score\}\}/g, data.audit_score || '0');
    html = html.replace(/\{\{audit_crawled_pages\}\}/g, data.audit_crawled_pages || '0');
    html = html.replace(/\{\{audit_indexable_pages\}\}/g, data.audit_indexable_pages || '0');
    html = html.replace(/\{\{audit_safe_browsing_html\}\}/g, data.audit_safe_browsing_html || '<span style="color: #10B981;">Site is safe</span>');
    html = html.replace(/\{\{audit_domain_authority\}\}/g, data.audit_domain_authority || '0');
    html = html.replace(/\{\{audit_page_authority\}\}/g, data.audit_page_authority || '0');
    html = html.replace(/\{\{audit_domain_rating\}\}/g, data.audit_domain_rating || '0');
    html = html.replace(/\{\{audit_ranking_keywords\}\}/g, data.audit_ranking_keywords || '0');
    html = html.replace(/\{\{audit_spam_score\}\}/g, data.audit_spam_score || '0%');
    html = html.replace(/\{\{audit_domain_age\}\}/g, data.audit_domain_age || 'N/A');
    html = html.replace(/\{\{audit_total_backlinks\}\}/g, data.audit_total_backlinks || '0');
    html = html.replace(/\{\{audit_referring_domains\}\}/g, data.audit_referring_domains || '0');
    html = html.replace(/\{\{audit_organic_traffic\}\}/g, data.audit_organic_traffic || '0');
    html = html.replace(/\{\{audit_perf_score\}\}/g, data.audit_perf_score || '0');
    html = html.replace(/\{\{audit_perf_color\}\}/g, data.audit_perf_color || '#ffaa33');
    html = html.replace(/\{\{audit_perf_dash\}\}/g, data.audit_perf_dash || '0');
    html = html.replace(/\{\{audit_a11y_score\}\}/g, data.audit_a11y_score || '0');
    html = html.replace(/\{\{audit_a11y_color\}\}/g, data.audit_a11y_color || '#ffaa33');
    html = html.replace(/\{\{audit_a11y_dash\}\}/g, data.audit_a11y_dash || '0');
    html = html.replace(/\{\{audit_bp_score\}\}/g, data.audit_bp_score || '0');
    html = html.replace(/\{\{audit_bp_color\}\}/g, data.audit_bp_color || '#ffaa33');
    html = html.replace(/\{\{audit_bp_dash\}\}/g, data.audit_bp_dash || '0');
    html = html.replace(/\{\{audit_seo_score\}\}/g, data.audit_seo_score || '0');
    html = html.replace(/\{\{audit_seo_color\}\}/g, data.audit_seo_color || '#ffaa33');
    html = html.replace(/\{\{audit_seo_dash\}\}/g, data.audit_seo_dash || '0');
    html = html.replace(/\{\{audit_fcp\}\}/g, data.audit_fcp || '0.0 s');
    html = html.replace(/\{\{audit_tbt\}\}/g, data.audit_tbt || '0 ms');
    html = html.replace(/\{\{audit_si\}\}/g, data.audit_si || '0.0 s');
    html = html.replace(/\{\{audit_cls\}\}/g, data.audit_cls || '0');
    html = html.replace(/\{\{audit_http_status_code\}\}/g, data.audit_http_status_code || 'N/A');
    html = html.replace(/\{\{audit_ssl_details\}\}/g, data.audit_ssl_details || 'N/A');
    html = html.replace(/\{\{audit_www_redirect\}\}/g, data.audit_www_redirect || 'N/A');
    html = html.replace(/\{\{audit_https_redirect\}\}/g, data.audit_https_redirect || 'N/A');
    html = html.replace(/\{\{audit_html_size\}\}/g, data.audit_html_size || 'N/A');
    html = html.replace(/\{\{audit_compression\}\}/g, data.audit_compression || 'N/A');
    html = html.replace(/\{\{audit_security_headers\}\}/g, data.audit_security_headers || 'N/A');


    if (data.public_navbar_links !== undefined) {
      html = html.replace(/\{\{public_navbar_links\}\}/g, data.public_navbar_links);
    }
    if (data.services_grid !== undefined) {
      html = html.replace(/\{\{services_grid\}\}/g, data.services_grid);
    }
    if (data.category_select_dropdown !== undefined) {
      html = html.replace(/\{\{category_select_dropdown\}\}/g, data.category_select_dropdown);
    }
    if (data.service_select_dropdown !== undefined) {
      html = html.replace(/\{\{service_select_dropdown\}\}/g, data.service_select_dropdown);
    }
    if (data.quantity_display !== undefined) {
      html = html.replace(/\{\{quantity_display\}\}/g, data.quantity_display);
    }
    if (data.quantity_limits_badge !== undefined) {
      html = html.replace(/\{\{quantity_limits_badge\}\}/g, data.quantity_limits_badge);
    }
    if (data.service_description_box !== undefined) {
      html = html.replace(/\{\{service_description_box\}\}/g, data.service_description_box);
    }
    if (data.service_custom_card_box !== undefined) {
      html = html.replace(/\{\{service_custom_card_box\}\}/g, data.service_custom_card_box);
    }
    if (data.service_avg_time !== undefined) {
      html = html.replace(/\{\{service_avg_time\}\}/g, data.service_avg_time);
    }
    if (data.services_table !== undefined) {
      html = html.replace(/\{\{services_table\}\}/g, data.services_table);
    }
    if (data.orders_table !== undefined) {
      html = html.replace(/\{\{orders_table\}\}/g, data.orders_table);
    }
    if (data.order_success_box !== undefined) {
      html = html.replace(/\{\{order_success_box\}\}/g, data.order_success_box);
    }
    if (data.tickets_list !== undefined) {
      html = html.replace(/\{\{tickets_list\}\}/g, data.tickets_list);
    }
    if (data.audit_history_table !== undefined) {
      html = html.replace(/\{\{audit_history_table\}\}/g, data.audit_history_table);
    }

    return html;
  }
};

window.PageTemplateEngine = PageTemplateEngine;


