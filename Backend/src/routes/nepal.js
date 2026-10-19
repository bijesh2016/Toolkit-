import express from 'express';
import { bsToAd, adToBs } from '../utils/nepaliCalendar.js';
import { convertToNprWords } from '../utils/numberToWords.js';
import { NEPAL_PROVINCES, NEPAL_FESTIVALS, NEPAL_TAX_INFO } from '../utils/nepalData.js';

const router = express.Router();

/**
 * @swagger
 * /api/nepal/bs-to-ad:
 *   get:
 *     summary: Convert Bikram Sambat (BS) date to Gregorian (AD)
 *     tags: [Nepal Tools]
 *     parameters:
 *       - in: query
 *         name: bsYear
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2081
 *       - in: query
 *         name: bsMonth
 *         required: true
 *         schema:
 *           type: integer
 *           example: 7
 *       - in: query
 *         name: bsDay
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully converted BS to AD
 *       400:
 *         description: Invalid or out-of-range date
 */
router.get('/bs-to-ad', (req, res) => {
  try {
    const { bsYear, bsMonth, bsDay } = req.query;
    if (!bsYear || !bsMonth || !bsDay) {
      return res.status(400).json({ error: 'Please provide bsYear, bsMonth, and bsDay' });
    }
    const result = bsToAd(parseInt(bsYear, 10), parseInt(bsMonth, 10), parseInt(bsDay, 10));
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/nepal/ad-to-bs:
 *   get:
 *     summary: Convert Gregorian (AD) date to Bikram Sambat (BS)
 *     tags: [Nepal Tools]
 *     parameters:
 *       - in: query
 *         name: adYear
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *       - in: query
 *         name: adMonth
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: adDay
 *         required: true
 *         schema:
 *           type: integer
 *           example: 17
 *     responses:
 *       200:
 *         description: Successfully converted AD to BS
 *       400:
 *         description: Invalid or out-of-range date
 */
router.get('/ad-to-bs', (req, res) => {
  try {
    const { adYear, adMonth, adDay } = req.query;
    if (!adYear || !adMonth || !adDay) {
      return res.status(400).json({ error: 'Please provide adYear, adMonth, and adDay' });
    }
    const result = adToBs(parseInt(adYear, 10), parseInt(adMonth, 10), parseInt(adDay, 10));
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/nepal/npr-to-words:
 *   post:
 *     summary: Convert NPR currency amount to South Asian & Devanagari words
 *     tags: [Nepal Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 125000.50
 *     responses:
 *       200:
 *         description: Converted words representation
 */
router.post('/npr-to-words', (req, res) => {
  try {
    const { amount } = req.body;
    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    const result = convertToNprWords(amount);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/nepal/provinces:
 *   get:
 *     summary: Get all 7 Provinces with 77 Districts, Headquarters and Postal Codes
 *     tags: [Nepal Tools]
 *     responses:
 *       200:
 *         description: List of provinces and districts
 */
router.get('/provinces', (req, res) => {
  const { search } = req.query;
  if (!search) {
    return res.json({ success: true, total: NEPAL_PROVINCES.length, data: NEPAL_PROVINCES });
  }

  const query = search.toLowerCase();
  const filtered = NEPAL_PROVINCES.map(province => {
    const matchingDistricts = province.districts.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.hq.toLowerCase().includes(query) ||
      d.postalCode.includes(query)
    );
    if (province.name.toLowerCase().includes(query) || province.capital.toLowerCase().includes(query)) {
      return province;
    }
    if (matchingDistricts.length > 0) {
      return { ...province, districts: matchingDistricts };
    }
    return null;
  }).filter(Boolean);

  res.json({ success: true, total: filtered.length, data: filtered });
});

/**
 * @swagger
 * /api/nepal/festivals:
 *   get:
 *     summary: Get list of Nepal cultural festivals and calendar holidays
 *     tags: [Nepal Tools]
 *     responses:
 *       200:
 *         description: Festival calendar details
 */
router.get('/festivals', (req, res) => {
  res.json({ success: true, total: NEPAL_FESTIVALS.length, data: NEPAL_FESTIVALS });
});

/**
 * @swagger
 * /api/nepal/tax-info:
 *   get:
 *     summary: Get Nepal standard VAT and TDS tax rates
 *     tags: [Nepal Tools]
 *     responses:
 *       200:
 *         description: VAT and TDS reference specifications
 */
router.get('/tax-info', (req, res) => {
  res.json({ success: true, data: NEPAL_TAX_INFO });
});

export default router;
