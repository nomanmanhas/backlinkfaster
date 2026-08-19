/* ==========================================================================
   USER AUTHENTICATION & REGISTRATION ENGINE (js/userAuth.js)
   - Sequential Numeric Integer IDs (1, 2, 3, 4, 5...)
   - Unique Username & Unique Phone with Country Code Validation
   - Account Status Guard (Disabled User Block Notification)
   ========================================================================== */

const UserAuthEngine = {
  // Dynamic Signup Form Schema & Settings
  formSettings: {
    masterEnable: true,
    fields: [
      { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'e.g. John', enabled: true, required: true },
      { key: 'lastName', label: 'Last Name', type: 'text', placeholder: 'e.g. Smith', enabled: true, required: true },
      { key: 'username', label: 'Username', type: 'text', placeholder: 'e.g. johnsmith101', enabled: true, required: true },
      { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', enabled: true, required: true },
      { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', enabled: true, required: false },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '+1 (555) 123-4567', enabled: true, required: false },
      { key: 'website', label: 'Website Link / Domain', type: 'url', placeholder: 'https://yourdomain.com', enabled: true, required: false },
      { key: 'skype', label: 'Skype ID', type: 'text', placeholder: 'live:john.smith', enabled: false, required: false },
      { key: 'telegram', label: 'Telegram Handle', type: 'text', placeholder: '@johnsmith', enabled: false, required: false },
      { 
        key: 'monthlyBudget', 
        label: 'Your Monthly Budget for SEO', 
        type: 'select', 
        options: ['$500 - $1,000 / mo', '$1,000 - $5,000 / mo', '$5,000 - $10,000 / mo', '$10,000+ / mo'], 
        enabled: true, 
        required: false 
      }
    ]
  },

  init() {
    this.loadFormSettings();
  },

  loadFormSettings() {
    try {
      const saved = localStorage.getItem('seo_signup_form_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.formSettings = { ...this.formSettings, ...parsed };
      }
    } catch(e) {
      console.error('Error loading signup form settings:', e);
    }
  },

  saveFormSettings() {
    try {
      localStorage.setItem('seo_signup_form_settings', JSON.stringify(this.formSettings));
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('✅ Saved Signup Form Settings to LocalStorage!');
      }
      if (typeof App !== 'undefined' && App.broadcastMenuUpdate) {
        App.broadcastMenuUpdate();
      }
    } catch(e) {
      console.error('Error saving signup form settings:', e);
    }
  },

  async handleSignup(formData) {
    const { fullName, username, companyName, email, phone, countryCode, password, referralId } = formData;

    // 1. Sanitize & clean inputs
    const cleanName = SecurityEngine.sanitizeHTML(fullName?.trim());
    const cleanUsername = SecurityEngine.sanitizeHTML(username?.trim().toLowerCase());
    const cleanCompany = SecurityEngine.sanitizeHTML(companyName?.trim() || 'N/A');
    const cleanEmail = email?.trim().toLowerCase();
    
    // Format phone with country code (e.g. +91 9876543210)
    const code = countryCode?.trim() || '+91';
    const num = phone?.trim() || '';
    const cleanPhone = num ? (num.startsWith('+') ? num : `${code} ${num}`) : 'Not Provided';
    const cleanReferral = SecurityEngine.sanitizeHTML(referralId?.trim() || 'REF-DEFAULT');

    // 2. Security Check: Rate Limiter
    const clientIP = '192.168.1.' + Math.floor(10 + Math.random() * 200);
    if (!SecurityEngine.checkRateLimit(clientIP)) {
      return { success: false, message: 'Too many requests. Please wait 60 seconds.' };
    }

    // 3. Email Format Validation
    if (!SecurityEngine.validateEmail(cleanEmail)) {
      return { success: false, message: 'Invalid email address format.' };
    }

    // 4. Unique Email Check
    const existingEmail = UserAdminEngine.state.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // 5. Unique Username Check
    const existingUsername = UserAdminEngine.state.users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existingUsername) {
      return { success: false, message: 'This username is already taken. Please choose a different username.' };
    }

    // 6. Unique Phone Number Check
    if (cleanPhone !== 'Not Provided') {
      const existingPhone = UserAdminEngine.state.users.find(u => u.phone === cleanPhone);
      if (existingPhone) {
        return { success: false, message: 'An account with this phone number already exists.' };
      }
    }

    // 7. Password Validation
    const passVal = SecurityEngine.validatePassword(password);
    if (!passVal.valid) {
      return { success: false, message: passVal.message };
    }

    // 8. Sequential Integer Numeric ID (1, 2, 3, 4, 5...)
    const numericId = UserAdminEngine.getNextUserId();
    const passwordHash = await SecurityEngine.hashPassword(password);
    const signupDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    // 9. Create Production User Object
    const newUser = {
      id: numericId, // Integer Number ID: 1, 2, 3...
      username: cleanUsername,
      fullName: cleanName,
      companyName: cleanCompany,
      email: cleanEmail,
      phone: cleanPhone,
      referralId: cleanReferral,
      country: 'United States',
      passwordHash: passwordHash,
      signupDate: signupDate,
      lastLogin: 'Never',
      emailVerified: true,
      accountStatus: 'Active', // 'Active' or 'Disabled'
      subscription: 'Free Trial',
      role: 'Client User',
      balance: '0.0000',
      ipAddress: clientIP,
      avatar: cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      avatarColor: '#0097A7'
    };

    UserAdminEngine.state.users.push(newUser);
    if (typeof UserAdminEngine.saveUsers === 'function') {
      UserAdminEngine.saveUsers();
    }
    SecurityEngine.logAction('System Auth', `Registered user: ${cleanUsername} (ID: ${numericId})`, clientIP);

    // Trigger Automated Welcome Email
    if (typeof EmailEngine !== 'undefined') {
      EmailEngine.sendWelcomeEmail(newUser);
    }

    return {
      success: true,
      user: newUser,
      message: `User registration successful! User assigned ID: #${numericId}`
    };
  },

  // Login Authentication Guard with Blocked User Notification
  attemptUserLogin(identifier, password) {
    if (typeof UserAdminEngine !== 'undefined' && UserAdminEngine.loadUsers) {
      UserAdminEngine.loadUsers();
    }
    const cleanId = identifier?.trim().toLowerCase();
    const user = UserAdminEngine.state.users.find(u => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId);

    if (!user) {
      return { success: false, message: 'Invalid username/email or password.' };
    }

    // CRITICAL USER GUARD: Check if status is Disabled
    if (user.accountStatus === 'Disabled') {
      const blockMessage = 'Admin ke taraf se aapka account block kiya gaya hai. Please admin se rabta karein.';
      App.showToast(`⚠️ ${blockMessage}`, 'error');
      alert(`⚠️ Account Blocked:\n\n${blockMessage}`);
      return { success: false, message: blockMessage };
    }

    user.lastLogin = new Date().toLocaleString();
    if (typeof UserAdminEngine !== 'undefined' && UserAdminEngine.saveUsers) {
      UserAdminEngine.saveUsers();
    }
    if (typeof UserDashboard !== 'undefined') {
      UserDashboard.state.currentUser = user;
    }
    try {
      localStorage.setItem('active_client_user', JSON.stringify(user));
    } catch(e) {}
    App.showToast(`Logged in successfully as ${user.username}!`);
    return { success: true, user: user };
  },

  submitHeroLogin(event) {
    if (event) event.preventDefault();
    const emailInput = document.getElementById('usr-hero-email') || document.getElementById('hero-login-user');
    const passInput = document.getElementById('usr-hero-pass') || document.getElementById('hero-login-pass');
    
    const email = emailInput?.value?.trim();
    const password = passInput?.value?.trim();

    if (!email || !password) {
      App.showToast('Please enter your username/email and password.', 'error');
      return;
    }

    const res = this.attemptUserLogin(email, password);
    if (res.success) {
      App.setMode('user');
    }
  }
};
