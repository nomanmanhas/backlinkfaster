/* ==========================================================================
   AUTOMATED EMAIL & PASSWORD RECOVERY ENGINE (js/emailEngine.js)
   - SMTP Server Configuration
   - Default Template Storage & LocalStorage Synchronization
   - Dynamic Template Compiler ({{var}} placeholders)
   - Enable/Disable Status Guard
   - Custom Template Storage Engine (Add / Delete / Toggle)
   - Automated Emails: Welcome, Password Reset OTP, Order Confirmation,
     Order Cancellation & Refund, Subscription Reminder
   - Test Email Dispatcher
   ========================================================================== */

const EmailEngine = {
  settings: {
    smtpHost: 'smtp.yourdomain.com',
    smtpPort: '587',
    smtpUser: 'noreply@yourdomain.com',
    smtpPass: 'SecretPassword123!',
    senderName: 'Spectrum SEO Agency',
    senderEmail: 'noreply@yourdomain.com',
    enableWelcomeEmail: true,
    enablePasswordResetEmail: true
  },

  // Active OTP Memory Store (email -> { otp: '482910', expiresAt: timestamp })
  resetTokens: {},

  // LocalStorage Memory Key
  STORAGE_KEY: 'seo_email_templates',

  // Active compiled templates memory store
  templates: {},

  // 1. Default Email Templates Schema (5 Auto-Emails)
  defaultTemplates: {
    welcome: {
      name: 'Welcome Email',
      description: 'Sent automatically when a new user registers an account.',
      subject: 'Welcome to {{site_name}}! Account Created',
      enabled: true,
      body: `Hi {{user_name}},

Thank you for registering at {{site_name}}.

Account Details:
---------------------------------
Username: {{user_username}}
Email: {{user_email}}
User ID: #{{user_id}}

You can now log in and manage your SEO projects and audits.

Best Regards,
{{site_name}} Team`
    },

    password_reset: {
      name: 'Forgot Password OTP',
      description: 'Sent when a user requests a password reset verification code.',
      subject: 'Password Reset Verification Code - {{site_name}}',
      enabled: true,
      body: `Hello {{user_name}},

We received a request to reset your password.
Your 6-Digit Password Reset OTP Code is:

🔑 OTP CODE: {{otp_code}}

This code is valid for 15 minutes. If you did not request this, please ignore this email.

Best Regards,
{{site_name}} Support`
    },

    order_confirmation: {
      name: 'Order Confirmation',
      description: 'Sent automatically when a client places a new SEO order.',
      subject: 'Order Confirmation #{{order_id}} - {{site_name}}',
      enabled: true,
      body: `Hi {{user_name}},

Thank you for your order! We have received your campaign details.

Order Summary:
---------------------------------
Order ID: {{order_id}}
Service: {{order_service}}
Target Link: {{target_link}}
Keywords: {{order_keywords}}
Quantity: {{order_quantity}}
Total Charge: {{order_charge}}
Status: {{order_status}}
Date: {{order_date}}

Thank you for choosing {{site_name}}!`
    },

    order_cancellation: {
      name: 'Order Cancellation & Refund',
      description: 'Sent when an admin cancels an order and refunds the client wallet.',
      subject: 'Order Cancelled & Refunded #{{order_id}} - {{site_name}}',
      enabled: true,
      body: `Hi {{user_name}},

Your order #{{order_id}} has been cancelled.

Refund Details:
---------------------------------
Order ID: {{order_id}}
Service: {{order_service}}
Refunded Amount: {{order_charge}}
Wallet Status: Successfully Credited back to your balance!

Best Regards,
{{site_name}} Financial Team`
    },

    subscription_reminder: {
      name: 'Subscription Expiry Reminder',
      description: 'Sent to remind client of upcoming subscription expiration.',
      subject: '⏰ Subscription Expiration Reminder ({{time_left}} Left) - {{site_name}}',
      enabled: true,
      body: `Hi {{user_name}},

Your SEO Retainer Subscription "{{order_service}}" is expiring in {{time_left}}!

Subscription Details:
---------------------------------
Service: {{order_service}}
Rate: {{order_charge}}
Expiration Window: {{time_left}} remaining

Please log in to your Client Dashboard and renew your subscription to maintain uninterrupted SEO ranking performance!

Best Regards,
{{site_name}} Renewal Desk`
    },

    site_audit_submitted: {
      name: 'Site Audit Request Received',
      description: 'Sent automatically when a user submits a website for SEO Site Audit.',
      subject: 'Site Audit Request Received #{{audit_id}} - {{site_name}}',
      enabled: true,
      body: `Hi {{user_name}},

We have received your Site Audit Request for {{target_link}}.

Audit Request Details:
---------------------------------
Audit ID: {{audit_id}}
Username: {{user_name}}
Target Link: {{target_link}}
Status: {{audit_status}}

Notice: Our technical team has started analyzing your website. It takes up to 24 hours to complete a full 54-point audit. You will receive another email as soon as your report is ready.

Best Regards,
{{site_name}} Technical Team`
    },

    site_audit_completed: {
      name: 'Site Audit Report Completed',
      description: 'Sent automatically when an admin completes the Site Audit report.',
      subject: '🎉 Your SEO Audit Report is Ready! #{{audit_id}} - {{site_name}}',
      enabled: true,
      body: `Hi {{user_name}},

Great news! Your comprehensive SEO Site Audit Report for {{target_link}} is now 100% Ready!

Audit Summary:
---------------------------------
Audit ID: {{audit_id}}
Website Domain: {{target_link}}
Status: Complete

Log in to your Client Dashboard -> Audit History to view your complete 54-metric agency report.

Best Regards,
{{site_name}} SEO Team`
    }
  },

  // Initialize & Load Templates
  init() {
    this.loadTemplates();
  },

  // 2. LocalStorage Memory Store Management
  loadTemplates() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.templates = {};

      // Initialize default templates with enabled: true
      Object.keys(this.defaultTemplates).forEach(key => {
        this.templates[key] = {
          ...this.defaultTemplates[key],
          enabled: true
        };
      });

      if (stored) {
        const parsed = JSON.parse(stored);
        Object.keys(parsed).forEach(key => {
          if (this.defaultTemplates[key]) {
            this.templates[key] = {
              ...this.defaultTemplates[key],
              ...parsed[key],
              enabled: parsed[key].enabled !== undefined ? Boolean(parsed[key].enabled) : true
            };
          } else {
            this.templates[key] = {
              enabled: true,
              ...parsed[key],
              enabled: parsed[key].enabled !== undefined ? Boolean(parsed[key].enabled) : true
            };
          }
        });
      }
    } catch (e) {
      console.error('[EmailEngine] Failed to load templates from localStorage:', e);
      this.templates = {};
      Object.keys(this.defaultTemplates).forEach(key => {
        this.templates[key] = {
          ...this.defaultTemplates[key],
          enabled: true
        };
      });
    }
    return this.templates;
  },

  saveTemplate(templateKey, subject, body) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }
    if (!this.templates[templateKey]) {
      this.templates[templateKey] = {
        name: templateKey,
        description: '',
        subject: '',
        body: '',
        enabled: true
      };
    }
    this.templates[templateKey].subject = subject;
    this.templates[templateKey].body = body;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.templates));
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(`✅ Template "${this.templates[templateKey].name || templateKey}" saved successfully!`);
      }
    } catch (e) {
      console.error('[EmailEngine] Failed to save template to localStorage:', e);
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Failed to save email template.', 'error');
      }
    }
  },

  resetTemplate(templateKey) {
    if (!this.defaultTemplates[templateKey]) return;

    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    this.templates[templateKey] = JSON.parse(JSON.stringify(this.defaultTemplates[templateKey]));

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.templates));
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(`🔄 Template "${this.templates[templateKey].name || templateKey}" reset to default!`);
      }
    } catch (e) {
      console.error('[EmailEngine] Failed to reset template in localStorage:', e);
    }
  },

  toggleTemplateStatus(templateKey, isEnabled) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }
    if (!this.templates[templateKey]) {
      console.error(`[EmailEngine] Template not found: ${templateKey}`);
      return false;
    }

    const enabledState = Boolean(isEnabled);
    this.templates[templateKey].enabled = enabledState;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.templates));
      const templateName = this.templates[templateKey].name || templateKey;
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(`Email template "${templateName}" is now ${enabledState ? 'ENABLED 🟢' : 'DISABLED 🔴'}!`);
      }
      return true;
    } catch (e) {
      console.error('[EmailEngine] Failed to toggle template status in localStorage:', e);
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Failed to update email template status.', 'error');
      }
      return false;
    }
  },

  addCustomTemplate({ name, description, subject, body, enabled }) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    const nameStr = name ? String(name).trim() : 'Custom Template';
    const slug = nameStr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const newKey = `cust_${slug || 'template'}_${Date.now()}`;

    const isEnabled = enabled !== undefined ? Boolean(enabled) : true;

    const newTemplate = {
      name: nameStr,
      description: description || '',
      subject: subject || '',
      body: body || '',
      isCustom: true,
      enabled: isEnabled
    };

    this.templates[newKey] = newTemplate;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.templates));
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(`✅ Custom template "${newTemplate.name}" added successfully!`);
      }
      return { success: true, key: newKey };
    } catch (e) {
      console.error('[EmailEngine] Failed to add custom template to localStorage:', e);
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Failed to save custom email template.', 'error');
      }
      return { success: false, error: e.message };
    }
  },

  deleteCustomTemplate(templateKey) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    const tmpl = this.templates[templateKey];
    if (!tmpl || !tmpl.isCustom) {
      console.warn(`[EmailEngine] Cannot delete template '${templateKey}': Not a custom template or template not found.`);
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Only custom email templates can be deleted.', 'error');
      }
      return { success: false, message: 'Not a custom template or template not found.' };
    }

    const templateName = tmpl.name || templateKey;
    delete this.templates[templateKey];

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.templates));
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(`🗑️ Custom template "${templateName}" deleted successfully!`);
      }
      return { success: true };
    } catch (e) {
      console.error('[EmailEngine] Failed to delete custom template from localStorage:', e);
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Failed to delete email template.', 'error');
      }
      return { success: false, error: e.message };
    }
  },

  // 3. Dynamic Template Compiler
  compileTemplate(templateKey, data = {}) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    const tmpl = this.templates[templateKey] || this.defaultTemplates[templateKey];
    if (!tmpl) {
      console.error(`[EmailEngine] Template key not found: ${templateKey}`);
      return { subject: '', body: '' };
    }

    const compileData = {
      site_name: this.settings.senderName,
      ...data
    };

    let subject = tmpl.subject || '';
    let body = tmpl.body || '';

    const varRegex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

    subject = subject.replace(varRegex, (match, varName) => {
      return compileData[varName] !== undefined && compileData[varName] !== null
        ? compileData[varName]
        : match;
    });

    body = body.replace(varRegex, (match, varName) => {
      return compileData[varName] !== undefined && compileData[varName] !== null
        ? compileData[varName]
        : match;
    });

    return { subject, body };
  },

  // 4. Refactored Email Functions using compileTemplate & Status Guard
  sendWelcomeEmail(user) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    if (this.templates['welcome'] && this.templates['welcome'].enabled === false) {
      console.log('[EmailEngine] Skipping sendWelcomeEmail: Template "welcome" is disabled.');
      return;
    }

    if (!this.settings.enableWelcomeEmail) return;

    const data = {
      user_name: user.fullName || user.username || 'Valued User',
      user_email: user.email || '',
      user_id: user.id || '',
      user_username: user.username || '',
      site_name: this.settings.senderName
    };

    const { subject, body } = this.compileTemplate('welcome', data);

    console.log(`[SMTP MAILER] Sending Welcome Email to ${user.email}...`);
    console.log(`Subject: ${subject}`);
    console.log(body);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`📧 Automated Welcome Email sent to ${user.email}!`);
    }

    return { subject, body };
  },

  initiatePasswordReset(emailInput) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    if (this.templates['password_reset'] && this.templates['password_reset'].enabled === false) {
      console.log('[EmailEngine] Skipping initiatePasswordReset: Template "password_reset" is disabled.');
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Password reset emails are currently disabled by administrator.', 'error');
      }
      return { success: false, message: 'Password reset emails are currently disabled by system administrator.' };
    }

    const cleanEmail = emailInput?.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const user = (typeof UserAdminEngine !== 'undefined' && UserAdminEngine.state?.users)
      ? UserAdminEngine.state.users.find(u => u.email.toLowerCase() === cleanEmail)
      : null;

    if (!user) {
      return { success: false, message: 'No account found with this email address.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    this.resetTokens[cleanEmail] = { otp, expiresAt };

    const data = {
      user_name: user.fullName || user.username || 'User',
      otp_code: otp,
      site_name: this.settings.senderName
    };

    const { subject, body } = this.compileTemplate('password_reset', data);

    console.log(`[SMTP MAILER] Password Reset OTP Code for ${cleanEmail}: ${otp}`);
    console.log(`Subject: ${subject}`);
    console.log(body);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`📧 Password Reset Email with OTP sent to ${cleanEmail}!`);
    }

    return {
      success: true,
      email: cleanEmail,
      otp: otp,
      subject,
      body,
      message: `Verification OTP Code sent to ${cleanEmail}`
    };
  },

  verifyAndResetPassword(emailInput, otpInput, newPassword) {
    const cleanEmail = emailInput?.trim().toLowerCase();
    const cleanOtp = otpInput?.trim();

    const record = this.resetTokens[cleanEmail];
    if (!record) {
      return { success: false, message: 'No password reset request found for this email.' };
    }

    if (Date.now() > record.expiresAt) {
      delete this.resetTokens[cleanEmail];
      return { success: false, message: 'OTP verification code has expired. Please request a new one.' };
    }

    if (record.otp !== cleanOtp) {
      return { success: false, message: 'Invalid OTP verification code. Please check your email.' };
    }

    const user = (typeof UserAdminEngine !== 'undefined' && UserAdminEngine.state?.users)
      ? UserAdminEngine.state.users.find(u => u.email.toLowerCase() === cleanEmail)
      : null;

    if (!user) {
      return { success: false, message: 'User account not found.' };
    }

    user.passwordHash = newPassword;
    delete this.resetTokens[cleanEmail];

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`✅ Password reset successfully for ${user.username}!`);
    }
    return { success: true, user: user, message: 'Password reset successful! You can now log in.' };
  },

  openForgotPasswordModal() {
    if (typeof App !== 'undefined' && App.openModal) {
      App.openModal(`
        <h2 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">Reset Your <span class="text-gradient">Password</span></h2>
        <p style="color: #6B7280; font-size: 0.88rem; margin-bottom: 1.2rem;">Enter your registered email address to receive a 6-digit OTP reset code via email.</p>

        <div id="reset-step-1">
          <div class="form-group">
            <label>Registered Email Address *</label>
            <input type="email" id="reset-email-input" class="form-control" placeholder="user@domain.com">
          </div>
          <button class="btn-teal" style="width: 100%; margin-top: 1rem;" onclick="EmailEngine.submitForgotPasswordStep1()">
            📧 Send OTP Reset Code
          </button>
        </div>

        <div id="reset-step-2" style="display: none;">
          <div style="background: #ECFDF5; border: 1px solid #10B981; padding: 0.8rem; border-radius: 8px; font-size: 0.85rem; color: #065F46; margin-bottom: 1rem;" id="otp-demo-notice">
            OTP Code Sent!
          </div>

          <div class="form-group">
            <label>6-Digit Verification OTP Code *</label>
            <input type="text" id="reset-otp-input" class="form-control" placeholder="123456">
          </div>
          <div class="form-group">
            <label>New Password *</label>
            <input type="password" id="reset-newpass-input" class="form-control" placeholder="••••••••">
          </div>
          <button class="btn-teal" style="width: 100%; margin-top: 1rem;" onclick="EmailEngine.submitForgotPasswordStep2()">
            🔒 Save New Password & Login
          </button>
        </div>
      `);
    }
  },

  submitForgotPasswordStep1() {
    const email = document.getElementById('reset-email-input')?.value;
    const res = this.initiatePasswordReset(email);

    if (res.success) {
      const step1 = document.getElementById('reset-step-1');
      const step2 = document.getElementById('reset-step-2');
      if (step1) step1.style.display = 'none';
      if (step2) step2.style.display = 'block';
      const notice = document.getElementById('otp-demo-notice');
      if (notice) {
        notice.innerHTML = `🔑 OTP sent to <strong>${res.email}</strong>. (Code: <strong style="font-size: 1.1rem; color: #059669;">${res.otp}</strong>)`;
      }
    } else {
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(res.message, 'error');
      }
    }
  },

  submitForgotPasswordStep2() {
    const email = document.getElementById('reset-email-input')?.value;
    const otp = document.getElementById('reset-otp-input')?.value;
    const newPass = document.getElementById('reset-newpass-input')?.value;

    if (!otp || !newPass) {
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('Please enter both OTP code and new password.', 'error');
      }
      return;
    }

    const res = this.verifyAndResetPassword(email, otp, newPass);
    if (res.success) {
      if (typeof App !== 'undefined' && App.closeModal) App.closeModal();
      if (typeof UserDashboard !== 'undefined') UserDashboard.state.currentUser = res.user;
      if (typeof App !== 'undefined' && App.setMode) App.setMode('user');
    } else {
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(res.message, 'error');
      }
    }
  },

  sendOrderConfirmationEmail(user, order, service) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    if (this.templates['order_confirmation'] && this.templates['order_confirmation'].enabled === false) {
      console.log('[EmailEngine] Skipping sendOrderConfirmationEmail: Template "order_confirmation" is disabled.');
      return;
    }

    const data = {
      user_name: user.fullName || user.username || 'Valued Customer',
      order_id: order.id || 'N/A',
      order_service: order.serviceName || service?.name || service?.title || 'SEO Package',
      target_link: order.targetLink || 'N/A',
      order_keywords: order.keywords || 'N/A',
      order_charge: order.charge || '$0.00',
      order_quantity: order.quantity || 1,
      order_status: order.status || 'Pending',
      order_date: order.orderDate || new Date().toLocaleDateString(),
      site_name: this.settings.senderName
    };

    const { subject, body } = this.compileTemplate('order_confirmation', data);

    console.log(`[SMTP MAILER] Order Confirmation Email sent to ${user.email}...`);
    console.log(`Subject: ${subject}`);
    console.log(body);

    // if (typeof App !== 'undefined' && App.showToast) {
    //   App.showToast(`📧 Automated Order Confirmation Email sent to ${user.email}!`);
    // }

    return { subject, body };
  },

  sendOrderCancellationEmail(user, order) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    if (this.templates['order_cancellation'] && this.templates['order_cancellation'].enabled === false) {
      console.log('[EmailEngine] Skipping sendOrderCancellationEmail: Template "order_cancellation" is disabled.');
      return;
    }

    const data = {
      user_name: user.fullName || user.username || 'Valued Customer',
      order_id: order.id || 'N/A',
      order_service: order.serviceName || 'SEO Package',
      order_charge: order.charge || '$0.00',
      site_name: this.settings.senderName
    };

    const { subject, body } = this.compileTemplate('order_cancellation', data);

    console.log(`[SMTP MAILER] Cancellation & Refund Email sent to ${user.email}...`);
    console.log(`Subject: ${subject}`);
    console.log(body);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`📧 Automated Refund Confirmation Email sent to ${user.email}!`);
    }

    return { subject, body };
  },

  sendSubscriptionReminderEmail(user, sub, timeText) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }

    if (this.templates['subscription_reminder'] && this.templates['subscription_reminder'].enabled === false) {
      console.log('[EmailEngine] Skipping sendSubscriptionReminderEmail: Template "subscription_reminder" is disabled.');
      return;
    }

    const data = {
      user_name: user.fullName || user.username || 'Valued Customer',
      order_service: sub.serviceName || sub.title || 'SEO Retainer',
      order_charge: sub.charge || sub.price || '$0.00',
      time_left: timeText || 'Soon',
      site_name: this.settings.senderName
    };

    const { subject, body } = this.compileTemplate('subscription_reminder', data);

    console.log(`[SMTP MAILER] Subscription Reminder Email (${timeText}) sent to ${user.email}...`);
    console.log(`Subject: ${subject}`);
    console.log(body);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`⏰ Email Reminder (${timeText} left) sent to ${user.email}!`);
    }

    return { subject, body };
  },

  // 5. Test Email Dispatcher
  getMockDataForTemplate(templateKey, targetEmail) {
    const today = new Date().toLocaleDateString();
    const commonMock = {
      user_name: 'John Doe',
      user_email: targetEmail || 'john.doe@example.com',
      user_id: '101',
      user_username: 'johndoe',
      order_id: 'ORD-99281',
      order_service: 'Premium SEO Service',
      target_link: 'https://mywebsite.com',
      order_keywords: 'seo agency, digital marketing, rank boost',
      order_charge: '$250.00',
      order_quantity: '1',
      order_status: 'Processing',
      order_date: today,
      otp_code: '849204',
      time_left: '3 Days',
      site_name: this.settings.senderName
    };

    switch (templateKey) {
      case 'welcome':
        return {
          user_name: 'John Doe',
          user_email: targetEmail || 'john.doe@example.com',
          user_id: '101',
          user_username: 'johndoe',
          site_name: this.settings.senderName
        };
      case 'password_reset':
        return {
          user_name: 'John Doe',
          otp_code: '849204',
          site_name: this.settings.senderName
        };
      case 'order_confirmation':
        return {
          user_name: 'John Doe',
          order_id: 'ORD-99281',
          order_service: 'Premium High-DA Backlink Package',
          target_link: 'https://mywebsite.com',
          order_keywords: 'seo agency, digital marketing, rank boost',
          order_charge: '$250.00',
          order_quantity: '1',
          order_status: 'Processing',
          order_date: today,
          site_name: this.settings.senderName
        };
      case 'order_cancellation':
        return {
          user_name: 'John Doe',
          order_id: 'ORD-99281',
          order_service: 'Monthly SEO Retainer',
          order_charge: '$150.00',
          site_name: this.settings.senderName
        };
      case 'subscription_reminder':
        return {
          user_name: 'John Doe',
          order_service: 'Monthly SEO Retainer',
          order_charge: '$150.00',
          time_left: '3 Days',
          site_name: this.settings.senderName
        };
      default:
        return commonMock;
    }
  },

  sendTestEmail(templateKey, targetEmail = 'test@example.com') {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }
    const destEmail = targetEmail || 'test@example.com';
    const mockData = this.getMockDataForTemplate(templateKey, destEmail);
    const { subject, body } = this.compileTemplate(templateKey, mockData);

    const tmpl = this.templates[templateKey] || this.defaultTemplates[templateKey];
    const name = tmpl ? tmpl.name : templateKey;

    console.log(`[SMTP MAILER TEST] Dispatching Test Email (${name} / ${templateKey}) to ${destEmail}...`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`🧪 Test Email (${name}) sent to ${destEmail}!`);
    }

    return { success: true, templateKey, targetEmail: destEmail, subject, body };
  },

  sendSiteAuditSubmittedEmail(auditData, user) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }
    const data = {
      user_name: (user && (user.fullName || user.username)) || auditData.username || 'Valued Customer',
      audit_id: auditData.id || auditData.auditId,
      target_link: auditData.link || auditData.targetLink,
      audit_status: auditData.status || 'Pending',
      site_name: this.settings.senderName
    };
    const { subject, body } = this.compileTemplate('site_audit_submitted', data);
    console.log(`[SMTP MAILER] Site Audit Submitted Email sent for ${data.audit_id}...`);
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`📧 Site Audit submission email sent to ${user ? user.email : 'user'}!`);
    }
    return { subject, body };
  },

  sendSiteAuditCompletedEmail(auditData, user) {
    if (!this.templates || Object.keys(this.templates).length === 0) {
      this.loadTemplates();
    }
    const data = {
      user_name: (user && (user.fullName || user.username)) || auditData.username || 'Valued Customer',
      audit_id: auditData.id || auditData.auditId,
      target_link: auditData.link || auditData.targetLink,
      audit_status: auditData.status || 'Complete',
      site_name: this.settings.senderName
    };
    const { subject, body } = this.compileTemplate('site_audit_completed', data);
    console.log(`[SMTP MAILER] Site Audit Completed Email sent for ${data.audit_id}...`);
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`🎉 Site Audit completed notification email sent!`);
    }
    return { subject, body };
  }
};

// Initialize EmailEngine templates from localStorage
EmailEngine.init();
