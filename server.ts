import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Server-side persistent config storage path (ignored by git, kept on server only)
const CONFIG_FILE = path.resolve(__dirname, '.server_api_config.json');

interface StoredConfig {
  provider: string;
  model: string;
  apiKey: string;
  savedAt: string;
}

function maskKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '****';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function getActiveConfig(): { provider: string; model: string; apiKey: string; isCustom: boolean } {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as StoredConfig;
      if (parsed.apiKey) {
        return {
          provider: parsed.provider || 'gemini',
          model: parsed.model || 'gemini-3.1-flash-lite',
          apiKey: parsed.apiKey.trim(),
          isCustom: true,
        };
      }
    }
  } catch (e) {
    console.error('Error reading server config file:', e);
  }

  // Fallback to environment variable GEMINI_API_KEY
  if (process.env.GEMINI_API_KEY) {
    return {
      provider: 'gemini',
      model: 'gemini-3.1-flash-lite',
      apiKey: process.env.GEMINI_API_KEY.trim(),
      isCustom: false,
    };
  }

  return {
    provider: 'gemini',
    model: 'gemini-3.1-flash-lite',
    apiKey: '',
    isCustom: false,
  };
}

// Verified fast free-tier Flash models in order of priority
const FLASH_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash',
];

const SYSTEM_INSTRUCTION = `You are JARVIS, an advanced, highly intelligent personal AI assistant.
- Multilingual: Always respond in the language the user uses (Bengali, English, Spanish, French, Hindi, etc.).
- Capabilities: Answer general knowledge, complex mathematics, and coding questions with precision and clarity.
- Math: Provide the correct mathematical solution concisely with clear steps if needed.
- Coding: Provide clean, idiomatic code snippets (JavaScript, TypeScript, Python, etc.) with brief explanations.
- Conciseness: Keep standard answers focused, direct, and concise (1-4 sentences), unless the user explicitly requests a detailed breakdown.
- No Fluff: Avoid unnecessary pleasantries, disclaimers, or conversational filler. If you do not know something, state it plainly.`;

// 1. Get current API configuration (Key is strictly masked, never returned plaintext)
app.get('/api/config', (_req: Request, res: Response): void => {
  const active = getActiveConfig();
  const isConfigured = Boolean(active.apiKey);
  res.json({
    provider: active.provider,
    model: active.model,
    isConfigured,
    status: isConfigured ? 'Connected' : 'Not Configured',
    maskedKey: maskKey(active.apiKey),
    isCustom: active.isCustom,
    lastError: null,
  });
});

// 2. Real API Connection Test
app.post('/api/config/test', async (req: Request, res: Response): Promise<void> => {
  const { provider = 'gemini', model = 'gemini-3.1-flash-lite', apiKey } = req.body;
  const active = getActiveConfig();
  const keyToTest = (typeof apiKey === 'string' && apiKey.trim()) ? apiKey.trim() : active.apiKey;

  if (!keyToTest) {
    res.status(400).json({
      success: false,
      error: 'API Key is required to test the connection. Please enter or paste your key.',
    });
    return;
  }

  try {
    const testAi = new GoogleGenAI({
      apiKey: keyToTest,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Real minimal verification query with backoff for transient 503 demand spikes
    let testRes: any = null;
    let lastTestError: unknown = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        testRes = await testAi.models.generateContent({
          model,
          contents: 'Ping',
          config: {
            maxOutputTokens: 10,
            temperature: 0.1,
          },
        });
        if (testRes) break;
      } catch (err) {
        lastTestError = err;
        const errStr = String(err);
        if (errStr.includes('503') || errStr.includes('UNAVAILABLE')) {
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
            continue;
          }
        }
        throw err;
      }
    }

    if (testRes && (testRes.text || testRes.candidates?.length)) {
      res.json({
        success: true,
        message: `Successfully connected to ${model} using ${provider}. Valid response received.`,
        model,
      });
      return;
    }

    if (lastTestError) throw lastTestError;

    res.status(502).json({
      success: false,
      error: 'Empty response received from Gemini API.',
    });
  } catch (err: unknown) {
    console.error('API Test Error:', err);
    const errString = String(err);
    let errorDetail = 'API connection test failed.';

    if (errString.includes('API_KEY_INVALID') || errString.includes('API key not valid') || errString.includes('400') || errString.includes('403')) {
      errorDetail = 'Invalid API Key. Google AI Studio rejected the provided key.';
    } else if (errString.includes('429') || errString.includes('RESOURCE_EXHAUSTED')) {
      errorDetail = 'Quota or rate limit exceeded for this key (HTTP 429).';
    } else if (errString.includes('503') || errString.includes('UNAVAILABLE') || errString.includes('high demand')) {
      errorDetail = `Model '${model}' is temporarily experiencing high demand (HTTP 503). Please try again shortly or select gemini-flash-lite-latest.`;
    } else if (errString.includes('404') || errString.includes('NOT_FOUND')) {
      errorDetail = `Selected model '${model}' is not supported or not available with this key.`;
    } else if (errString.includes('ECONNREFUSED') || errString.includes('ETIMEDOUT') || errString.includes('fetch failed')) {
      errorDetail = 'Network error: Unable to reach Google Gemini API endpoints.';
    } else if (err instanceof Error && err.message) {
      errorDetail = err.message;
    }

    res.status(400).json({
      success: false,
      error: errorDetail,
    });
  }
});

// 3. Save API configuration securely on server
app.post('/api/config/save', (req: Request, res: Response): void => {
  const { provider = 'gemini', model = 'gemini-3.1-flash-lite', apiKey } = req.body;
  const active = getActiveConfig();
  const keyToSave = (typeof apiKey === 'string' && apiKey.trim()) ? apiKey.trim() : active.apiKey;

  if (!keyToSave) {
    res.status(400).json({
      success: false,
      error: 'Cannot save empty API key. Please provide a valid Gemini API key.',
    });
    return;
  }

  const stored: StoredConfig = {
    provider,
    model,
    apiKey: keyToSave,
    savedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(stored, null, 2), 'utf-8');
    res.json({
      success: true,
      message: 'API configuration saved securely on server.',
      config: {
        provider,
        model,
        isConfigured: true,
        status: 'Connected',
        maskedKey: maskKey(keyToSave),
        isCustom: true,
      },
    });
  } catch (err) {
    console.error('Failed to save config:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to write configuration to server storage.',
    });
  }
});

// 4. Remove custom API key and revert
app.delete('/api/config', (_req: Request, res: Response): void => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
    const fallback = getActiveConfig();
    const isConfigured = Boolean(fallback.apiKey);
    res.json({
      success: true,
      message: isConfigured
        ? 'Custom key removed. Reverted to system environment key.'
        : 'API key removed. JARVIS is now unconfigured.',
      config: {
        provider: fallback.provider,
        model: fallback.model,
        isConfigured,
        status: isConfigured ? 'Connected' : 'Not Configured',
        maskedKey: maskKey(fallback.apiKey),
        isCustom: fallback.isCustom,
      },
    });
  } catch (err) {
    console.error('Failed to delete config:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete configuration file.',
    });
  }
});

// 5. Streaming chat endpoint (routes to configured key and chosen model)
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { prompt, history = [] } = req.body;

  // Handle empty or whitespace-only messages gracefully
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'বার্তা খালি হতে পারে না। অনুগ্রহ করে কিছু লিখুন।' });
    return;
  }

  const activeConfig = getActiveConfig();
  if (!activeConfig.apiKey) {
    res.status(400).json({
      error: 'API কী কনফিগার করা নেই। অনুগ্রহ করে Settings প্যানেল থেকে আপনার Gemini API Key যুক্ত করুন।',
    });
    return;
  }

  const activeAi = new GoogleGenAI({
    apiKey: activeConfig.apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Set up Server-Sent Events headers for low-latency streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Retain only the last 10 messages for conversation memory
    const recentHistory = Array.isArray(history) ? history.slice(-10) : [];

    const formattedContents = [
      ...recentHistory.map((item: { role: string; text: string }) => ({
        role: item.role === 'model' ? 'model' : 'user',
        parts: [{ text: item.text }],
      })),
      {
        role: 'user',
        parts: [{ text: prompt.trim() }],
      },
    ];

    let streamSucceeded = false;
    let chunksEmitted = 0;
    let lastError: Error | null = null;

    const modelsToTry = [
      activeConfig.model,
      ...FLASH_MODELS.filter((m) => m !== activeConfig.model),
    ];

    // Try primary and fallback models with backoff logic for transient 503 / rate-limit spikes
    for (const modelName of modelsToTry) {
      if (streamSucceeded) break;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const stream = await activeAi.models.generateContentStream({
            model: modelName,
            contents: formattedContents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });

          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
              chunksEmitted++;
            }
          }

          streamSucceeded = true;
          break; // successfully completed streaming for this model
        } catch (err: unknown) {
          lastError = err instanceof Error ? err : new Error(String(err));
          // If we already emitted some chunks to the client, we cannot switch to another model midway
          if (chunksEmitted > 0) {
            throw lastError;
          }
          // If it's a 429 quota limit, don't wait for retries on this model; fall back immediately
          const is429 = String(err).includes('429') || String(err).includes('RESOURCE_EXHAUSTED');
          if (is429) {
            break;
          }
          // On transient 503 or network glitches, apply brief exponential backoff
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
          }
        }
      }
    }

    if (!streamSucceeded) {
      throw lastError || new Error('No response stream available');
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: unknown) {
    console.error('Gemini Stream Error:', err);
    const isRateLimit = String(err).includes('429') || String(err).includes('RESOURCE_EXHAUSTED');
    const userMessage = isRateLimit
      ? 'API সীমা সাময়িকভাবে পূর্ণ হয়েছে। অনুগ্রহ করে কয়েক সেকেন্ড পর আবার চেষ্টা করুন।'
      : 'দুঃখিত, সংযোগে সমস্যা হয়েছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।';

    res.write(`data: ${JSON.stringify({ error: userMessage })}\n\n`);
    res.end();
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`JARVIS Server running on port ${port}`);
  });
}

startServer();
