import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Available domains for temporary inboxes
const DOMAINS = ['bijeshmail.com', 'inboxnepal.com', 'devverify.net', 'tempmail.bijeshsharam.com'];

// In-memory store for active mailboxes and incoming emails
// Key: email address (lowercase) -> Mailbox Object
const mailboxes = new Map();

// Helper: Extract 4-8 digit OTP verification code from text or subject
export function extractOtp(text = '', subject = '') {
  const combined = `${subject} ${text}`;
  
  // Specific OTP patterns
  const patterns = [
    /(?:verification|security|confirm|otp|code|pin|access|login)\s*(?:code)?\s*(?:is|:)?\s*([0-9]{4,8})\b/i,
    /\b([0-9]{4,8})\s*(?:is your\s*(?:verification|security|otp|login|code))\b/i,
    /\bcode:\s*([0-9]{4,8})\b/i,
    /\b([0-9]{6})\b/ // standard 6-digit code
  ];

  for (const regex of patterns) {
    const match = combined.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Generate random realistic prefix
function generatePrefix() {
  const words = ['dev', 'nepal', 'alex', 'kiran', 'user', 'sam', 'maya', 'coder', 'test', 'cloud', 'bijesh'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}.${num}`;
}

/**
 * @swagger
 * /api/tools/temp-mail/create:
 *   post:
 *     summary: Create a new temporary disposable email mailbox
 *     tags: [Developer & Security]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 example: bijeshmail.com
 *               customPrefix:
 *                 type: string
 *                 example: mytest.9941
 *     responses:
 *       200:
 *         description: Created mailbox details
 */
router.post('/create', (req, res) => {
  try {
    const { domain = 'bijeshmail.com', customPrefix } = req.body || {};
    const chosenDomain = DOMAINS.includes(domain) ? domain : DOMAINS[0];
    const prefix = (customPrefix ? customPrefix.trim().replace(/[^a-zA-Z0-9._-]/g, '') : generatePrefix()) || generatePrefix();
    const address = `${prefix.toLowerCase()}@${chosenDomain}`;

    const now = Date.now();
    const mailboxId = `mb_${crypto.randomBytes(6).toString('hex')}`;

    // Initial Welcome Message
    const welcomeEmail = {
      id: `msg_${crypto.randomBytes(6).toString('hex')}`,
      from: 'Bijesh Tools Hub <system@bijeshsharam.com.np>',
      subject: '🎉 Your Disposable Inbox is Ready!',
      timestamp: new Date().toISOString(),
      isRead: false,
      otp: null,
      text: `Welcome to your disposable inbox on Bijesh Tools Hub!\n\nYou can use this email address (${address}) to sign up on test apps, newsletters, or services.\nWhen verification emails or OTP codes arrive, they will appear here in real-time.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-top: 0;">🎉 Welcome to Your Disposable Inbox!</h2>
          <p>Your temporary email <strong>${address}</strong> is active and ready to receive incoming messages.</p>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">Active Mailbox:</p>
            <p style="margin: 4px 0 0; font-size: 16px; font-weight: bold; color: #0f172a;">${address}</p>
          </div>
          <p style="font-size: 13px; color: #64748b;">Any incoming OTP or verification codes will be automatically extracted and highlighted with a 1-click Copy button.</p>
        </div>
      `
    };

    const mailboxData = {
      id: mailboxId,
      address,
      domain: chosenDomain,
      createdAt: now,
      expiresAt: now + 60 * 60 * 1000, // 60 minutes
      emails: [welcomeEmail]
    };

    mailboxes.set(address, mailboxData);

    res.json({
      success: true,
      data: {
        id: mailboxId,
        address,
        domain: chosenDomain,
        expiresAt: mailboxData.expiresAt,
        availableDomains: DOMAINS
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/tools/temp-mail/inbox/{address}:
 *   get:
 *     summary: Fetch all emails inside the specified temporary mailbox
 *     tags: [Developer & Security]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/inbox/:address', (req, res) => {
  try {
    const address = (req.params.address || '').toLowerCase().trim();
    const mailbox = mailboxes.get(address);

    if (!mailbox) {
      return res.json({
        success: true,
        data: {
          address,
          total: 0,
          emails: []
        }
      });
    }

    res.json({
      success: true,
      data: {
        address: mailbox.address,
        id: mailbox.id,
        createdAt: mailbox.createdAt,
        expiresAt: mailbox.expiresAt,
        total: mailbox.emails.length,
        emails: mailbox.emails
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/tools/temp-mail/send-test:
 *   post:
 *     summary: Simulate sending an OTP or verification email to test the inbox
 *     tags: [Developer & Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *                 example: alex.9921@bijeshmail.com
 *               service:
 *                 type: string
 *                 example: github
 *                 enum: [github, google, instagram, esewa, netflix]
 *     responses:
 *       200:
 *         description: Injected test email with OTP
 */
router.post('/send-test', (req, res) => {
  try {
    const { address, service = 'github' } = req.body || {};
    if (!address) {
      return res.status(400).json({ success: false, error: 'Target mailbox address is required.' });
    }

    const cleanAddress = address.toLowerCase().trim();
    const mailbox = mailboxes.get(cleanAddress);

    if (!mailbox) {
      return res.status(404).json({ success: false, error: 'Mailbox not found or expired.' });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const msgId = `msg_${crypto.randomBytes(6).toString('hex')}`;
    let sender = '';
    let subject = '';
    let bodyText = '';
    let bodyHtml = '';

    switch (service) {
      case 'github':
        sender = 'GitHub Security <no-reply@github.com>';
        subject = `[GitHub] Verification code: ${otp}`;
        bodyText = `Your GitHub verification code is ${otp}. This code expires in 10 minutes.`;
        bodyHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; background: #0d1117; color: #c9d1d9; border-radius: 12px;">
            <div style="margin-bottom: 20px;">
              <span style="font-size: 24px; font-weight: bold; color: #ffffff;">GitHub</span>
            </div>
            <h3 style="color: #ffffff; margin-top: 0;">Device Verification Code</h3>
            <p>Please enter the following verification code to authenticate your login attempt:</p>
            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 6px; color: #58a6ff;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #8b949e;">If you did not make this request, please change your password immediately.</p>
          </div>
        `;
        break;

      case 'google':
        sender = 'Google Security Team <account-verification@google.com>';
        subject = `${otp} is your Google verification code`;
        bodyText = `Use ${otp} to verify your Google Account. Don't share this code with anyone.`;
        bodyHtml = `
          <div style="font-family: 'Google Sans', Roboto, sans-serif; padding: 24px; background: #ffffff; color: #3c4043; border-radius: 12px; border: 1px solid #dadce0;">
            <div style="margin-bottom: 16px;">
              <span style="font-size: 22px; font-weight: bold; color: #1a73e8;">Google</span>
            </div>
            <h3 style="color: #202124; margin-top: 0;">Verify your email address</h3>
            <p>Here is your 6-digit confirmation code:</p>
            <div style="background: #e8f0fe; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 6px; color: #1967d2;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #5f6368;">This code will expire in 15 minutes.</p>
          </div>
        `;
        break;

      case 'esewa':
        sender = 'eSewa Fonepay Nepal <auth@esewa.com.np>';
        subject = `eSewa Transaction OTP: ${otp}`;
        bodyText = `Your eSewa verification OTP is ${otp}. Valid for 5 minutes. Do not share your OTP with anyone.`;
        bodyHtml = `
          <div style="font-family: sans-serif; padding: 24px; background: #f4fbf7; color: #1e293b; border-radius: 12px; border: 1px solid #bbf7d0;">
            <div style="margin-bottom: 16px;">
              <span style="font-size: 22px; font-weight: bold; color: #16a34a;">eSewa Nepal</span>
            </div>
            <h3 style="color: #14532d; margin-top: 0;">Digital Wallet OTP Verification</h3>
            <p>Your one-time authorization code is:</p>
            <div style="background: #ffffff; border: 2px dashed #22c55e; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
              <span style="font-size: 34px; font-family: monospace; font-weight: bold; letter-spacing: 6px; color: #15803d;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #64748b;">Bijesh Tools Hub Test Sandbox • Never share OTP over telephone.</p>
          </div>
        `;
        break;

      case 'instagram':
      default:
        sender = 'Instagram <security@mail.instagram.com>';
        subject = `${otp} is your Instagram security code`;
        bodyText = `Hi, someone tried to log in to your Instagram account. Here is your code: ${otp}`;
        bodyHtml = `
          <div style="font-family: sans-serif; padding: 24px; background: #ffffff; color: #262626; border-radius: 12px; border: 1px solid #dbdbdb;">
            <div style="margin-bottom: 16px;">
              <span style="font-size: 22px; font-weight: bold; color: #e1306c;">Instagram</span>
            </div>
            <h3 style="color: #262626; margin-top: 0;">Security Code</h3>
            <p>Please enter this code to complete authentication:</p>
            <div style="background: #fafafa; border: 1px solid #dbdbdb; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 6px; color: #c13584;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #8e8e8e;">Security notice from Meta Platforms.</p>
          </div>
        `;
        break;
    }

    const newEmail = {
      id: msgId,
      from: sender,
      subject,
      timestamp: new Date().toISOString(),
      isRead: false,
      otp,
      text: bodyText,
      html: bodyHtml
    };

    mailbox.emails.unshift(newEmail);

    res.json({
      success: true,
      data: {
        message: 'Test email successfully delivered to mailbox',
        otp,
        email: newEmail
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/tools/temp-mail/incoming:
 *   post:
 *     summary: Webhook endpoint for receiving real external incoming emails
 *     tags: [Developer & Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - from
 *               - subject
 *             properties:
 *               to:
 *                 type: string
 *               from:
 *                 type: string
 *               subject:
 *                 type: string
 *               text:
 *                 type: string
 *               html:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email received and queued in inbox
 */
router.post('/incoming', (req, res) => {
  try {
    const { to, from, subject = '(No Subject)', text = '', html = '' } = req.body || {};
    if (!to) {
      return res.status(400).json({ success: false, error: 'Recipient "to" email is required.' });
    }

    const cleanAddress = to.toLowerCase().trim();
    const mailbox = mailboxes.get(cleanAddress);

    if (!mailbox) {
      return res.status(404).json({ success: false, error: 'Mailbox not found or expired.' });
    }

    const detectedOtp = extractOtp(text, subject);
    const newEmail = {
      id: `msg_${crypto.randomBytes(6).toString('hex')}`,
      from: from || 'Anonymous Sender <sender@unknown.com>',
      subject,
      timestamp: new Date().toISOString(),
      isRead: false,
      otp: detectedOtp,
      text,
      html: html || `<p>${text}</p>`
    };

    mailbox.emails.unshift(newEmail);

    res.json({
      success: true,
      data: {
        message: 'Email delivered to disposable inbox',
        otpDetected: !!detectedOtp,
        otp: detectedOtp
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/tools/temp-mail/inbox/{address}:
 *   delete:
 *     summary: Delete / burn an active disposable mailbox
 *     tags: [Developer & Security]
 */
router.delete('/inbox/:address', (req, res) => {
  try {
    const address = (req.params.address || '').toLowerCase().trim();
    const deleted = mailboxes.delete(address);
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
