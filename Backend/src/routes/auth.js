import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bijesh-tools-hub-secret-2026';

// In-memory demo store
const users = new Map();

/**
 * @swagger
 * /api/auth/plans:
 *   get:
 *     summary: Retrieve available subscription plans and Nepal payment details
 *     tags: [Auth & Pro Tier]
 *     responses:
 *       200:
 *         description: Available plans, pricing in NPR & USD, and payment gateways
 */
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    data: {
      plans: [
        {
          id: 'free',
          name: 'Free Forever',
          priceNpr: 0,
          priceUsd: 0,
          period: 'lifetime',
          features: [
            'Access to 50+ Client-Side Tools',
            '100% Privacy-Preserving In-Browser Processing',
            '20 Daily AI Mini-Tool Quota',
            'Full Nepal Suite (BS-AD, Typing, Words, Tax)',
            'Standard PDF and Image Exports'
          ],
          buttonText: 'Current Plan',
          isPopular: false
        },
        {
          id: 'pro',
          name: 'Pro Developer & Business',
          priceNpr: 499,
          priceUsd: 4.99,
          period: 'month',
          features: [
            'Unlimited AI Mini-Tool Invocations',
            'Dedicated Custom API Key for Swagger / CLI Access',
            'Cloud Workspace Synchronization',
            'Batch PDF & Image Compression up to 100MB',
            'Custom Invoices with Nepal IRD VAT & PAN Formatting',
            'Priority Support via Email'
          ],
          buttonText: 'Upgrade with eSewa / Khalti',
          isPopular: true
        },
        {
          id: 'team',
          name: 'Team & Agency',
          priceNpr: 1499,
          priceUsd: 14.99,
          period: 'month',
          features: [
            'Up to 10 Team Member Accounts',
            'Shared Snippets & Saved Templates',
            'White-label Invoices & Certificates',
            'Dedicated High-Speed Web Inspection Proxy',
            'Custom Domain Branding'
          ],
          buttonText: 'Contact for Team',
          isPopular: false
        }
      ],
      paymentGateways: [
        { name: 'eSewa', icon: 'esewa', supported: true, country: 'Nepal' },
        { name: 'Khalti', icon: 'khalti', supported: true, country: 'Nepal' },
        { name: 'FonePay', icon: 'fonepay', supported: true, country: 'Nepal' },
        { name: 'ConnectIPS', icon: 'connectips', supported: true, country: 'Nepal' },
        { name: 'International Cards (Stripe)', icon: 'card', supported: true, country: 'Global' }
      ]
    }
  });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register an account or generate a guest developer profile
 *     tags: [Auth & Pro Tier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: dev@bijeshsharam.com.np
 *               name:
 *                 type: string
 *                 example: Bijesh Sharma
 *               password:
 *                 type: string
 *                 example: superSecret123!
 *     responses:
 *       200:
 *         description: Account created successfully with JWT
 */
router.post('/register', (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const apiKey = 'bth_' + crypto.randomBytes(16).toString('hex');
    const user = {
      id: crypto.randomUUID(),
      email,
      name,
      plan: 'pro',
      apiKey,
      createdAt: new Date().toISOString()
    };

    users.set(email, user);
    const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Welcome to Bijesh Tools Hub Pro Workspace!',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in to account
 *     tags: [Auth & Pro Tier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: dev@bijeshsharam.com.np
 *               password:
 *                 type: string
 *                 example: superSecret123!
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let user = users.get(email);
  if (!user) {
    // Generate automatic guest profile for demo convenience
    const apiKey = 'bth_' + crypto.randomBytes(16).toString('hex');
    user = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      plan: 'free',
      apiKey,
      createdAt: new Date().toISOString()
    };
    users.set(email, user);
  }

  const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user
  });
});

export default router;
