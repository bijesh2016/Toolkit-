import express from 'express';
import crypto from 'crypto';

const router = express.Router();

/**
 * @swagger
 * /api/tools/hash:
 *   post:
 *     summary: Generate cryptographic hashes (MD5, SHA1, SHA256, SHA512, HMAC)
 *     tags: [Developer & Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: Hello World
 *               hmacSecret:
 *                 type: string
 *                 example: my-salt-key
 *     responses:
 *       200:
 *         description: Generated hashes
 */
router.post('/hash', (req, res) => {
  try {
    const { text, hmacSecret } = req.body;
    if (text === undefined || text === null) {
      return res.status(400).json({ error: 'Text string is required' });
    }

    const md5 = crypto.createHash('md5').update(text).digest('hex');
    const sha1 = crypto.createHash('sha1').update(text).digest('hex');
    const sha256 = crypto.createHash('sha256').update(text).digest('hex');
    const sha512 = crypto.createHash('sha512').update(text).digest('hex');

    let hmacSha256 = null;
    if (hmacSecret) {
      hmacSha256 = crypto.createHmac('sha256', hmacSecret).update(text).digest('hex');
    }

    res.json({
      success: true,
      data: {
        textLength: text.length,
        md5,
        sha1,
        sha256,
        sha512,
        hmacSha256
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/tools/password-entropy:
 *   post:
 *     summary: Evaluate password entropy, complexity, and estimated crack time
 *     tags: [Developer & Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: MySecure#Pass2026!
 *     responses:
 *       200:
 *         description: Password entropy and security metrics
 */
router.post('/password-entropy', (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.json({
        success: true,
        data: { score: 0, entropy: 0, crackTime: 'Instant', strength: 'Very Weak', suggestions: ['Enter a password'] }
      });
    }

    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33;

    const entropy = Math.round(password.length * Math.log2(pool || 1));

    let score = 0;
    let strength = 'Very Weak';
    let crackTime = 'Instant';

    if (entropy < 30) {
      score = 1;
      strength = 'Weak';
      crackTime = 'A few seconds';
    } else if (entropy < 50) {
      score = 2;
      strength = 'Fair';
      crackTime = 'A few hours / days';
    } else if (entropy < 70) {
      score = 3;
      strength = 'Strong';
      crackTime = 'Several months / years';
    } else {
      score = 4;
      strength = 'Very Strong';
      crackTime = 'Centuries (Immune to brute force)';
    }

    const suggestions = [];
    if (password.length < 12) suggestions.push('Increase length to at least 12 characters.');
    if (!/[A-Z]/.test(password)) suggestions.push('Add uppercase letters.');
    if (!/[0-9]/.test(password)) suggestions.push('Include numbers.');
    if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push('Add special symbols (e.g. !@#$%).');

    res.json({
      success: true,
      data: {
        length: password.length,
        poolSize: pool,
        entropyBits: entropy,
        score,
        strength,
        crackTime,
        suggestions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/tools/secret-detect:
 *   post:
 *     summary: Scan text for sensitive secrets (API keys, tokens, emails, cards) and redact
 *     tags: [Developer & Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: My aws key is AKIA1234567890EXAMPLE and email is test@domain.com
 *     responses:
 *       200:
 *         description: Detected secrets and redacted safe output
 */
router.post('/secret-detect', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const findings = [];
    let redacted = text;

    // Detect AWS Access Key ID
    const awsRegex = /(AKIA[0-9A-Z]{16})/g;
    let match;
    while ((match = awsRegex.exec(text)) !== null) {
      findings.push({ type: 'AWS Access Key', match: match[1], position: match.index });
    }
    redacted = redacted.replace(awsRegex, '[REDACTED_AWS_KEY]');

    // Detect GitHub Personal Access Tokens
    const ghRegex = /(gh[pousr]_[A-Za-z0-9_]{36,255})/g;
    while ((match = ghRegex.exec(text)) !== null) {
      findings.push({ type: 'GitHub Token', match: match[1], position: match.index });
    }
    redacted = redacted.replace(ghRegex, '[REDACTED_GITHUB_TOKEN]');

    // Detect JSON Web Tokens (JWT)
    const jwtRegex = /(eyJ[a-zA-Z0-9-_]+\.eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+)/g;
    while ((match = jwtRegex.exec(text)) !== null) {
      findings.push({ type: 'JSON Web Token (JWT)', match: match[1], position: match.index });
    }
    redacted = redacted.replace(jwtRegex, '[REDACTED_JWT]');

    // Detect Email Addresses
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    while ((match = emailRegex.exec(text)) !== null) {
      findings.push({ type: 'Email Address', match: match[1], position: match.index });
    }
    redacted = redacted.replace(emailRegex, '[REDACTED_EMAIL]');

    // Detect Credit Card numbers
    const ccRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
    while ((match = ccRegex.exec(text)) !== null) {
      findings.push({ type: 'Credit Card Number', match: match[0], position: match.index });
    }
    redacted = redacted.replace(ccRegex, '[REDACTED_CARD_NUMBER]');

    res.json({
      success: true,
      data: {
        totalSecretsFound: findings.length,
        findings,
        redactedText: redacted
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/tools/regex-test:
 *   post:
 *     summary: Test regular expressions and view matches with captured groups
 *     tags: [Developer & Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pattern
 *               - text
 *             properties:
 *               pattern:
 *                 type: string
 *                 example: ([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})
 *               flags:
 *                 type: string
 *                 example: gm
 *               text:
 *                 type: string
 *                 example: Contact me at dev@bijeshsharam.com.np or support@tools.np
 *     responses:
 *       200:
 *         description: Regex execution result and captured tokens
 */
router.post('/regex-test', (req, res) => {
  try {
    const { pattern, flags = 'g', text } = req.body;
    if (!pattern || text === undefined) {
      return res.status(400).json({ error: 'Pattern and text are required' });
    }

    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;

    if (flags.includes('g')) {
      let count = 0;
      while ((match = regex.exec(text)) !== null && count < 200) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        if (match[0].length === 0) regex.lastIndex++;
        count++;
      }
    } else {
      match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
      }
    }

    res.json({
      success: true,
      data: {
        totalMatches: matches.length,
        matches
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// In-memory cache for translations to ensure ultra-fast sub-5ms responses
const translationCache = new Map();
const MAX_CACHE_SIZE = 500;

/**
 * @swagger
 * /api/tools/translate:
 *   post:
 *     summary: Real-time Multi-Language Translation (English, Nepali, Hindi, Japanese, etc.)
 *     tags: [Developer & Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: Welcome to Nepal
 *               from:
 *                 type: string
 *                 default: en
 *                 example: en
 *               to:
 *                 type: string
 *                 default: ne
 *                 example: ne
 *     responses:
 *       200:
 *         description: Translated text result
 */
router.post('/translate', async (req, res) => {
  try {
    const { text, from = 'en', to = 'ne' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text string is required for translation.' });
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return res.json({ success: true, data: { translatedText: '', from, to, cached: false } });
    }

    // Check cache
    const cacheKey = `${from}|${to}|${trimmed.toLowerCase()}`;
    if (translationCache.has(cacheKey)) {
      return res.json({
        success: true,
        data: {
          translatedText: translationCache.get(cacheKey),
          from,
          to,
          cached: true
        }
      });
    }

    // Call translation provider
    const pair = `${from}|${to}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${encodeURIComponent(pair)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const apiRes = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!apiRes.ok) {
      throw new Error(`Translation upstream returned status ${apiRes.status}`);
    }

    const apiData = await apiRes.json();
    const translatedText = apiData?.responseData?.translatedText || trimmed;

    // Cache the result
    if (translationCache.size >= MAX_CACHE_SIZE) {
      const firstKey = translationCache.keys().next().value;
      translationCache.delete(firstKey);
    }
    translationCache.set(cacheKey, translatedText);

    res.json({
      success: true,
      data: {
        translatedText,
        from,
        to,
        match: apiData?.responseData?.match || 1,
        cached: false
      }
    });
  } catch (err) {
    // Graceful fallback for offline / disconnected environments
    res.json({
      success: false,
      error: err.name === 'AbortError' ? 'Translation request timed out' : err.message,
      fallbackText: req.body?.text || ''
    });
  }
});

export default router;
