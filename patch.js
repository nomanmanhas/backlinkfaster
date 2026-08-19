const fs = require('fs');
const jsPath = 'js/pageTemplateEngine.js';
let lines = fs.readFileSync(jsPath, 'utf8').split('\n');
const newHtml = `      html: \`<div class="public-layout" style="background-color:#FFFFFF;color:#0F172A;font-family:var(--font-main);margin:0;padding:0;width:100%;">

  <!-- SECTION 01 — HERO with integrated navbar -->
  <section id="hero" class="hero-v2" aria-label="Hero — Turn Search Traffic Into Real Business Growth">

    <!-- Gradient Background -->
    <div class="hero-v2__bg" aria-hidden="true">
      <div class="hero-v2__orb hero-v2__orb--1"></div>
      <div class="hero-v2__orb hero-v2__orb--2"></div>
      <div class="hero-v2__orb hero-v2__orb--3"></div>
      <div class="hero-v2__noise"></div>
    </div>

    <!-- Scroll Progress Bar (inside hero, at very top) -->
    <div class="scroll-progress-container" style="position:absolute;top:0;left:0;width:100%;z-index:200;" aria-hidden="true">
      <div id="scroll-progress-bar" class="scroll-progress-bar"></div>
    </div>

    <!-- ── NAVBAR INSIDE HERO ── -->
    <nav class="hero-v2__nav" id="hero-navbar" role="navigation" aria-label="Main Navigation">
      <!-- Logo -->
      <a href="javascript:void(0)" class="hero-v2__nav-logo" onclick="PublicWebsite.navigateTo('home')" aria-label="Home">
        <img id="hero-logo-img" src="" alt="Agency Logo" style="height:38px;object-fit:contain;display:none;border-radius:8px;">
        <span class="logo-icon" id="site-logo" style="background:linear-gradient(135deg,#7B2FFF,#FF4DB8);color:#fff;width:38px;height:38px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;box-shadow:0 3px 12px rgba(123,47,255,0.4);">⚡</span>
        <span class="logo-text site-name" style="font-weight:900;font-size:1.2rem;color:#fff;letter-spacing:-0.4px;">BACKLINK<span style="color:#FF9BDD;">FASTER</span></span>
      </a>

      <!-- Dynamic Menu Links (from Admin) -->
      <ul class="hero-v2__nav-links" id="hero-nav-links" role="list">
        {{public_navbar_links}}
      </ul>

      <!-- Right Actions -->
      <div class="hero-v2__nav-actions">
        <button type="button" class="hero-v2__nav-btn-meeting" onclick="PublicWebsite.openBookMeetingModal()">
          📅 Book Meeting
        </button>
        <button type="button" class="hero-v2__nav-btn-signup" onclick="PublicWebsite.navigateTo('register')">
          ✍️ Get Started
        </button>
        <a href="javascript:void(0)" class="hero-v2__nav-signin" onclick="PublicWebsite.navigateTo('login')">
          Sign In
        </a>
      </div>
    </nav>

    <!-- ── HERO CONTENT GRID ── -->
    <div class="hero-v2__inner">

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
          <span class="hero-v2__headline-accent" style="color:#D4845A;background:none;-webkit-text-fill-color:#D4845A;">Real Business Growth.</span>
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
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="6" fill="rgba(255,255,255,0.35)"/><path d="M3 6l2 2 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Monthly SEO
          </span>
          <span class="hero-v2__trust-pill" role="listitem">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="6" fill="rgba(255,255,255,0.35)"/><path d="M3 6l2 2 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Technical SEO
          </span>
          <span class="hero-v2__trust-pill" role="listitem">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="6" fill="rgba(255,255,255,0.35)"/><path d="M3 6l2 2 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Link Building
          </span>
          <span class="hero-v2__trust-pill" role="listitem">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="6" fill="rgba(255,255,255,0.35)"/><path d="M3 6l2 2 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Local SEO
          </span>
        </div>

      </div><!-- /hero-v2__left -->

      <!-- RIGHT: Visual + Login Card -->
      <div class="hero-v2__right" id="hero-right-col">

        <!-- SEO Visual -->
        <div class="hero-v2__visual" id="hero-seo-visual" aria-label="SEO Growth Engine" role="img">
          <!-- Float cards -->
          <div class="hero-v2__float-card hero-v2__float-card--1 hero-v2__anim hero-v2__anim--float1" aria-hidden="true">
            <div class="hero-v2__float-icon">📈</div>
            <div><div class="hero-v2__float-label">Organic Traffic</div><div class="hero-v2__float-val">+350%</div></div>
          </div>
          <div class="hero-v2__float-card hero-v2__float-card--2 hero-v2__anim hero-v2__anim--float2" aria-hidden="true">
            <div class="hero-v2__float-icon">🔗</div>
            <div><div class="hero-v2__float-label">Backlinks</div><div class="hero-v2__float-val">DR 80+</div></div>
          </div>
          <div class="hero-v2__float-card hero-v2__float-card--3 hero-v2__anim hero-v2__anim--float3" aria-hidden="true">
            <div class="hero-v2__float-icon">🔑</div>
            <div><div class="hero-v2__float-label">Keywords</div><div class="hero-v2__float-val">+2,400</div></div>
          </div>
          <div class="hero-v2__float-card hero-v2__float-card--4 hero-v2__anim hero-v2__anim--float4" aria-hidden="true">
            <div class="hero-v2__float-icon">🏆</div>
            <div><div class="hero-v2__float-label">SERP Position</div><div class="hero-v2__float-val">#1</div></div>
          </div>

          <!-- SEO Core -->
          <div class="hero-v2__seo-core-wrap">
            <div class="hero-v2__seo-core" id="seo-core">
              <div class="hero-v2__orbit hero-v2__orbit--1" aria-hidden="true"><div class="hero-v2__orbit-dot"></div></div>
              <div class="hero-v2__orbit hero-v2__orbit--2" aria-hidden="true"><div class="hero-v2__orbit-dot"></div></div>
              <div class="hero-v2__orbit hero-v2__orbit--3" aria-hidden="true"><div class="hero-v2__orbit-dot"></div></div>
              <div class="hero-v2__core-glyph" aria-hidden="true">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
                  <path d="M20 44 L26 30 L32 36 L38 22 L44 28" stroke="url(#grd1)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="20" cy="44" r="3" fill="#FF9BDD"/>
                  <circle cx="44" cy="28" r="3.5" fill="#FFB347"/>
                  <defs><linearGradient id="grd1" x1="20" y1="44" x2="44" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#FF9BDD"/><stop offset="1" stop-color="#FFB347"/></linearGradient></defs>
                </svg>
              </div>
              <div class="hero-v2__rank-chart" aria-label="SERP rank improvement" role="img">
                <div class="hero-v2__rank-label">SERP Position</div>
                <div class="hero-v2__rank-bars">
                  <div class="hero-v2__rank-bar" style="--h:15%;--delay:0s;--col:rgba(255,155,221,0.4)"></div>
                  <div class="hero-v2__rank-bar" style="--h:30%;--delay:0.1s;--col:rgba(255,155,221,0.5)"></div>
                  <div class="hero-v2__rank-bar" style="--h:48%;--delay:0.2s;--col:rgba(255,155,221,0.65)"></div>
                  <div class="hero-v2__rank-bar" style="--h:65%;--delay:0.3s;--col:rgba(255,155,221,0.8)"></div>
                  <div class="hero-v2__rank-bar" style="--h:82%;--delay:0.4s;--col:#FF9BDD"></div>
                  <div class="hero-v2__rank-bar" style="--h:96%;--delay:0.5s;--col:#FFB347"></div>
                </div>
                <div class="hero-v2__rank-steps"><span>80</span><span>50</span><span>30</span><span>15</span><span>5</span><span>#1</span></div>
              </div>
              <div class="hero-v2__kw-nodes" aria-hidden="true">
                <span class="hero-v2__kw-node" style="--x:-62px;--y:-50px;--s:0.85;--d:0s">SEO</span>
                <span class="hero-v2__kw-node" style="--x:58px;--y:-52px;--s:0.78;--d:0.3s">Backlinks</span>
                <span class="hero-v2__kw-node" style="--x:-68px;--y:48px;--s:0.9;--d:0.6s">Rankings</span>
                <span class="hero-v2__kw-node" style="--x:60px;--y:52px;--s:0.82;--d:0.9s">Traffic</span>
                <span class="hero-v2__kw-node" style="--x:0px;--y:-78px;--s:0.75;--d:1.2s">SERP</span>
              </div>
            </div>
          </div>
        </div><!-- /hero-v2__visual -->

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

    <!-- Fade to white -->
    <div class="hero-v2__fade-out" aria-hidden="true"></div>

  </section><!-- /hero-v2 -->`;

const replacedContent = lines.slice(0, 13).join('\n') + '\n' + newHtml + '\n' + lines.slice(302).join('\n');
fs.writeFileSync(jsPath, replacedContent, 'utf8');

const cssPath = 'css/styles.css';
const cssAppend = `
/* ── HERO NAVBAR (inside hero section) ── */
.hero-v2__nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 2.5rem;
  background: rgba(15, 8, 35, 0.35);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.12);
  width: 100%;
}
.hero-v2__nav-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}
.hero-v2__nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}
.hero-v2__nav-links li a,
.hero-v2__nav-links li button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.45rem 0.95rem;
  color: rgba(255,255,255,0.82);
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-hero);
  transition: color 0.2s ease, background 0.2s ease, transform 0.18s ease;
  position: relative;
}
.hero-v2__nav-links li a::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, #FF9BDD, #FFB347);
  border-radius: 2px;
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
}
.hero-v2__nav-links li a:hover { color: #fff; background: rgba(255,255,255,0.08); transform: translateY(-1px); }
.hero-v2__nav-links li a:hover::after { transform: translateX(-50%) scaleX(1); }
.hero-v2__nav-actions { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
.hero-v2__nav-btn-meeting {
  padding: 0.5rem 1.1rem;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 600;
  border-radius: 9px;
  cursor: pointer;
  font-family: var(--font-hero);
  transition: background 0.2s ease, transform 0.18s ease;
}
.hero-v2__nav-btn-meeting:hover { background: rgba(255,255,255,0.2); transform: translateY(-1px); }
.hero-v2__nav-btn-signup {
  padding: 0.5rem 1.2rem;
  background: linear-gradient(135deg, #FF4DB8, #FF8C42);
  border: none;
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  border-radius: 9px;
  cursor: pointer;
  font-family: var(--font-hero);
  box-shadow: 0 4px 14px rgba(255,77,184,0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.hero-v2__nav-btn-signup:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,77,184,0.5); }
.hero-v2__nav-signin {
  color: rgba(255,255,255,0.75);
  font-size: 0.83rem;
  font-weight: 600;
  text-decoration: none;
  padding: 0.45rem 0.7rem;
  border-radius: 7px;
  transition: color 0.2s ease, background 0.2s ease;
}
.hero-v2__nav-signin:hover { color: #fff; background: rgba(255,255,255,0.08); }

/* LOGIN CARD (replaces audit card) */
.hero-v2__login-card {
  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(255,255,255,0.55);
  border-radius: 22px;
  padding: 1.75rem;
  box-shadow: 0 24px 60px rgba(90,15,160,0.18), 0 4px 14px rgba(0,0,0,0.07);
  backdrop-filter: blur(20px);
}
.hero-v2__login-header { display: flex; gap: 0.85rem; align-items: center; margin-bottom: 1.35rem; }
.hero-v2__login-icon { font-size: 1.6rem; flex-shrink: 0; }
.hero-v2__login-title { font-size: 1.1rem; font-weight: 800; color: #1A0A3C; margin: 0 0 0.2rem 0; }
.hero-v2__login-sub { font-size: 0.8rem; color: #64748B; margin: 0; }
.hero-v2__login-form { display: flex; flex-direction: column; gap: 0.75rem; }
.hero-v2__login-label { font-size: 0.76rem; font-weight: 700; color: #374151; display: block; margin-bottom: 0.28rem; }
.hero-v2__login-input {
  width: 100%; padding: 0.76rem 1rem; font-size: 0.9rem; font-weight: 500;
  color: #0F172A; background: #F8F9FF; border: 1.5px solid #E4E8FF;
  border-radius: 10px; outline: none; font-family: var(--font-hero);
  transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
.hero-v2__login-input:focus { border-color: #8B30D0; box-shadow: 0 0 0 3px rgba(139,48,208,0.11); }
.hero-v2__login-btn {
  width: 100%; padding: 0.88rem; font-size: 0.95rem; font-weight: 700; color: #fff;
  background: linear-gradient(135deg, #6B20D5, #B52090);
  border: none; border-radius: 10px; cursor: pointer; font-family: var(--font-hero);
  box-shadow: 0 6px 22px rgba(107,32,213,0.38);
  transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s;
}
.hero-v2__login-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(107,32,213,0.5); }
.hero-v2__login-register { font-size: 0.78rem; color: #6B7280; text-align: center; margin: 0.85rem 0 0; }
.hero-v2__login-register a { color: #7B2FFF; font-weight: 700; text-decoration: underline; text-decoration-color: rgba(123,47,255,0.38); }
.hero-v2__login-error { display: none; font-size: 0.78rem; color: #DC2626; background: #FEF2F2; border: 1px solid #FECACA; padding: 0.5rem 0.75rem; border-radius: 8px; }

@media (max-width: 860px) {
  .hero-v2__nav { padding: 0.85rem 1.25rem; }
  .hero-v2__nav-links { display: none; }
}
@media (max-width: 480px) {
  .hero-v2__nav-btn-meeting { display: none; }
}
`;
fs.appendFileSync(cssPath, cssAppend, 'utf8');
console.log('done!');
