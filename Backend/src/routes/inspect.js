import express from 'express';
import axios from 'axios';
import dns from 'dns';
import { promisify } from 'util';
import { validateSafeUrl } from '../utils/ssrfProtection.js';

const router = express.Router();
const dnsResolve = promisify(dns.resolve);

/**
 * Helper to extract basic HTML tags via regex (lightweight, zero foreign DOM dependency)
 */
function extractHtmlMetadata(html) {
  const getTag = (pattern) => {
    const match = html.match(pattern);
    return match ? match[1].trim() : null;
  };

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const metaDesc = getTag(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                   getTag(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);

  const ogTitle = getTag(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i) ||
                  getTag(/<meta\s+content=["']([^"']*)["']\s+property=["']og:title["']/i);

  const ogDesc = getTag(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i) ||
                 getTag(/<meta\s+content=["']([^"']*)["']\s+property=["']og:description["']/i);

  const ogImage = getTag(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) ||
                  getTag(/<meta\s+content=["']([^"']*)["']\s+property=["']og:image["']/i);

  const twitterCard = getTag(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i);

  const canonical = getTag(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);

  return {
    title,
    description: metaDesc || '',
    ogTitle: ogTitle || title,
    ogDescription: ogDesc || metaDesc || '',
    ogImage: ogImage || '',
    twitterCard: twitterCard || 'summary_large_image',
    canonical: canonical || ''
  };
}

/**
 * @swagger
 * /api/tools/inspect:
 *   post:
 *     summary: Safe SSRF-protected URL inspection, metadata and header extractor
 *     tags: [Web & SEO Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://bijeshsharam.com.np
 *     responses:
 *       200:
 *         description: Extracted page metadata, response time and headers
 *       400:
 *         description: Invalid or blocked URL (SSRF protected)
 */
router.post('/inspect', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const safeUrl = await validateSafeUrl(url);

    const startTime = Date.now();
    const response = await axios.get(safeUrl, {
      timeout: 6000,
      maxContentLength: 2 * 1024 * 1024, // 2MB limit
      headers: {
        'User-Agent': 'BijeshToolsHub-Inspector/1.0 (+https://bijeshsharam.com.np)'
      },
      validateStatus: () => true
    });
    const responseTimeMs = Date.now() - startTime;

    const metadata = typeof response.data === 'string'
      ? extractHtmlMetadata(response.data)
      : { title: '', description: '', ogTitle: '', ogDescription: '', ogImage: '', canonical: '' };

    res.json({
      success: true,
      data: {
        targetUrl: safeUrl,
        statusCode: response.status,
        statusText: response.statusText,
        responseTimeMs,
        headers: {
          server: response.headers['server'] || 'Undisclosed',
          contentType: response.headers['content-type'] || '',
          cacheControl: response.headers['cache-control'] || 'none',
          strictTransportSecurity: response.headers['strict-transport-security'] || 'Not set',
          xFrameOptions: response.headers['x-frame-options'] || 'Not set',
          contentSecurityPolicy: response.headers['content-security-policy'] ? 'Configured' : 'Not set'
        },
        metadata
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Inspection failed' });
  }
});

/**
 * @swagger
 * /api/tools/dns:
 *   get:
 *     summary: Resolve DNS records (A, MX, TXT) safely
 *     tags: [Web & SEO Tools]
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           example: google.com
 *     responses:
 *       200:
 *         description: Resolved DNS records
 */
router.get('/dns', async (req, res) => {
  try {
    const { domain } = req.query;
    if (!domain) {
      return res.status(400).json({ error: 'Domain query parameter is required' });
    }

    // Clean domain
    const cleanDomain = domain.replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];

    // Check SSRF
    await validateSafeUrl(`https://${cleanDomain}`);

    const records = {};

    try {
      records.a = await dnsResolve(cleanDomain, 'A');
    } catch (e) {
      records.a = [];
    }

    try {
      records.mx = await dnsResolve(cleanDomain, 'MX');
    } catch (e) {
      records.mx = [];
    }

    try {
      records.txt = await dnsResolve(cleanDomain, 'TXT');
    } catch (e) {
      records.txt = [];
    }

    res.json({
      success: true,
      data: {
        domain: cleanDomain,
        records
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
