import express from 'express';

const router = express.Router();

// In-memory quota tracker for free tier demo (IP or token based)
const usageQuota = new Map();
const FREE_TIER_DAILY_LIMIT = 20;

function checkQuota(req, res, next) {
  const clientKey = req.headers['x-api-key'] || req.ip || 'anonymous';
  const today = new Date().toISOString().split('T')[0];
  const recordKey = `${clientKey}_${today}`;

  const currentUsage = usageQuota.get(recordKey) || 0;
  if (currentUsage >= FREE_TIER_DAILY_LIMIT && !req.headers['x-api-key']) {
    return res.status(429).json({
      success: false,
      error: `Daily free quota exceeded (${FREE_TIER_DAILY_LIMIT}/${FREE_TIER_DAILY_LIMIT} requests). Upgrade to Pro or provide an API Key.`,
      quotaExceeded: true,
      remaining: 0
    });
  }

  usageQuota.set(recordKey, currentUsage + 1);
  req.remainingQuota = Math.max(0, FREE_TIER_DAILY_LIMIT - (currentUsage + 1));
  next();
}

/**
 * Intelligent built-in rule and heuristic engine for instant AI tasks
 */
function processAiTask(taskType, input, options = {}) {
  const trimmed = (input || '').trim();

  if (taskType === 'summarize') {
    const sentences = trimmed.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 10);
    const keySentences = sentences.slice(0, Math.min(5, Math.max(2, Math.ceil(sentences.length * 0.35))));
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

    // Detect potential action items
    const actionKeywords = ['must', 'should', 'need to', 'will', 'action', 'todo', 'deadline', 'ensure', 'prepare'];
    const actionItems = sentences.filter(s => actionKeywords.some(kw => s.toLowerCase().includes(kw))).slice(0, 4);

    return {
      executiveSummary: keySentences.slice(0, 2).join(' ') || trimmed.slice(0, 200) + '...',
      keyPoints: keySentences.map(s => s.trim()),
      actionItems: actionItems.length > 0 ? actionItems : ['Review document details', 'Share with relevant stakeholders'],
      stats: {
        originalWords: wordCount,
        summaryWords: keySentences.join(' ').split(/\s+/).length,
        readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200))
      }
    };
  }

  if (taskType === 'code-explain') {
    const lines = trimmed.split('\n');
    let detectedLang = 'JavaScript/TypeScript';
    if (trimmed.includes('def ') || trimmed.includes('import numpy')) detectedLang = 'Python';
    if (trimmed.includes('public class ') || trimmed.includes('System.out')) detectedLang = 'Java';
    if (trimmed.includes('func ') || trimmed.includes('package main')) detectedLang = 'Go';
    if (trimmed.includes('SELECT ') || trimmed.includes('FROM ')) detectedLang = 'SQL';

    const loops = (trimmed.match(/(for|while)\s*\(/g) || []).length;
    let complexity = 'O(1) Constant';
    if (loops === 1) complexity = 'O(N) Linear Time';
    if (loops >= 2) complexity = 'O(N²) Quadratic Time';

    return {
      detectedLanguage: detectedLang,
      estimatedComplexity: complexity,
      overview: `This ${detectedLang} snippet defines structured algorithmic operations with ${lines.length} lines of code.`,
      keyComponents: [
        { section: 'Structure', detail: `Contains ${lines.length} lines of code and ${lines.filter(l => l.trim().startsWith('//') || l.trim().startsWith('#')).length} comment lines.` },
        { section: 'Control Flow', detail: loops > 0 ? `Detected ${loops} loop/iteration block(s) traversing data.` : 'Straight-through or branch-based execution without loops.' },
        { section: 'Best Practice Check', detail: 'Ensure inputs are validated against null or undefined boundaries before processing.' }
      ],
      recommendations: [
        'Add descriptive docstrings or comments for maintainability',
        'Consider boundary checks for empty or edge-case arguments'
      ]
    };
  }

  if (taskType === 'error-explain') {
    let errorCategory = 'Runtime Error';
    let suggestion = 'Check variable assignment and scope.';

    if (trimmed.includes('TypeError') || trimmed.includes('undefined') || trimmed.includes('null')) {
      errorCategory = 'Null/Undefined Reference (TypeError)';
      suggestion = 'Verify the variable exists before reading properties. Use optional chaining (?.), e.g., obj?.property.';
    } else if (trimmed.includes('SyntaxError')) {
      errorCategory = 'Syntax Error';
      suggestion = 'Check for missing closing braces, brackets, quotes, or stray commas.';
    } else if (trimmed.includes('CORS') || trimmed.includes('Cross-Origin')) {
      errorCategory = 'CORS Policy Block';
      suggestion = 'Configure CORS headers on the backend server: `Access-Control-Allow-Origin: *` or allowed origins.';
    } else if (trimmed.includes('404') || trimmed.includes('Not Found')) {
      errorCategory = 'Resource Not Found (404)';
      suggestion = 'Confirm URL endpoint route, base URL, and correct HTTP method (GET vs POST).';
    } else if (trimmed.includes('ECONNREFUSED') || trimmed.includes('Network Error')) {
      errorCategory = 'Connection Refused';
      suggestion = 'Check if target server or database port is running and accessible on localhost/remote host.';
    }

    return {
      errorCategory,
      rootCauseSummary: `The engine detected an issue: "${trimmed.slice(0, 150)}..."`,
      suggestedFix: suggestion,
      steps: [
        'Inspect the line of code identified in the stack trace.',
        'Apply safety guards or error handling around the faulty operation.',
        'Run the test suite or reload with updated parameters.'
      ]
    };
  }

  if (taskType === 'email-draft') {
    const tone = options.tone || 'Formal & Professional';
    const recipient = options.recipient || 'Hiring Manager / Valued Client';
    const topic = options.topic || trimmed || 'Project Collaboration Proposal';

    return {
      subject: `Regarding: ${topic} - Bijesh Tools Hub Collaboration`,
      greeting: `Dear ${recipient},`,
      body: `I am writing to formally reach out regarding ${topic}. I wanted to provide you with a structured overview and discuss how we can coordinate effectively on the upcoming milestones.\n\nPlease let me know your availability for a brief call or if you need any additional supporting documentation from our side.`,
      closing: 'Best regards,\nBijesh Sharma\nTools Hub Platform (bijeshsharam.com.np)',
      tone
    };
  }

  return { message: 'Task completed successfully', inputPreview: trimmed.slice(0, 100) };
}

/**
 * @swagger
 * /api/ai/process:
 *   post:
 *     summary: AI Mini Assistant (Summarizer, Code Explainer, Error Analyzer, Email Drafter)
 *     tags: [AI Mini Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskType
 *               - content
 *             properties:
 *               taskType:
 *                 type: string
 *                 enum: [summarize, code-explain, error-explain, email-draft]
 *                 example: summarize
 *               content:
 *                 type: string
 *                 example: Artificial intelligence enables computers to learn from data, make inferences, and assist humans in productivity.
 *               options:
 *                 type: object
 *                 example: { tone: "Formal", recipient: "Manager" }
 *     responses:
 *       200:
 *         description: AI task output and remaining free quota
 *       429:
 *         description: Quota limit reached
 */
router.post('/process', checkQuota, (req, res) => {
  try {
    const { taskType, content, options } = req.body;
    if (!taskType || !content) {
      return res.status(400).json({ error: 'Both taskType and content are required' });
    }

    const result = processAiTask(taskType, content, options);

    res.json({
      success: true,
      data: result,
      quota: {
        dailyLimit: FREE_TIER_DAILY_LIMIT,
        remainingToday: req.remainingQuota
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
