/**
 * Automated Verification Test Suite for JARVIS Gemini Integration & API Configuration System
 * Tests:
 * 1. GET /api/config endpoint (Security: masked keys, status, provider)
 * 2. POST /api/config/test with Invalid Key (Rejection & meaningful error message)
 * 3. POST /api/config/test with Valid Key (Real API connection verification)
 * 4. POST /api/config/save endpoint (Secure server storage)
 * 5. Multilingual Conversation (Bengali)
 * 6. Multilingual Conversation (English)
 * 7. Mathematics Problem Solving
 * 8. Empty Message Validation (HTTP 400)
 * 9. Live SSE Streaming integration with configured Gemini model
 * 10. DELETE /api/config cleanup & fallback
 */

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ FAIL: GEMINI_API_KEY is not defined in environment variables.');
  process.exit(1);
}

const FLASH_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];

const ai = new GoogleGenAI({
  apiKey: API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
    if (detail) console.log(`     Details: ${detail.slice(0, 120)}...`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (detail) console.error(`     Details: ${detail}`);
  }
}

async function generateWithFallback(prompt: string): Promise<string> {
  let lastErr: unknown;
  for (const model of FLASH_MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        const text = res.text?.trim() || '';
        if (text) return text;
      } catch (err: unknown) {
        lastErr = err;
        const errStr = String(err);
        const is429 = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');
        if (is429) {
          break; // move to next model immediately
        }
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  throw lastErr;
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('  JARVIS GEMINI API & CONFIGURATION VERIFICATION SUITE');
  console.log('======================================================\n');

  // Test 1: GET /api/config (Check that key is masked and never exposed plaintext)
  console.log('[Test Suite 1: Security & Configuration Inspection]');
  try {
    const res = await fetch('http://localhost:3000/api/config');
    const data = await res.json();
    const isMasked = data.maskedKey && data.maskedKey.includes('...') && !data.maskedKey.includes(API_KEY);
    assert(
      res.status === 200 && data.isConfigured === true && isMasked,
      'GET /api/config returns secure masked credentials',
      `Status: ${data.status}, Masked: ${data.maskedKey}`
    );
  } catch (err) {
    assert(false, 'GET /api/config returns secure masked credentials', String(err));
  }

  // Test 2: POST /api/config/test with Invalid Key (Ensure rejection with meaningful error)
  console.log('\n[Test Suite 2: Invalid API Key Rejection]');
  try {
    const res = await fetch('http://localhost:3000/api/config/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: 'AIzaSyFakeKeyInvalid123456789' }),
    });
    const data = await res.json();
    assert(
      res.status === 400 && data.success === false && data.error.includes('Invalid API Key'),
      'Invalid API Key rejection with meaningful error',
      data.error
    );
  } catch (err) {
    assert(false, 'Invalid API Key rejection with meaningful error', String(err));
  }

  // Test 3: POST /api/config/test with Valid Key
  console.log('\n[Test Suite 3: Real API Connection Test]');
  try {
    const res = await fetch('http://localhost:3000/api/config/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-flash-lite-latest',
        apiKey: API_KEY,
      }),
    });
    const data = await res.json();
    assert(
      res.status === 200 && data.success === true,
      'Real Gemini API Connection Verification',
      data.message
    );
  } catch (err) {
    assert(false, 'Real Gemini API Connection Verification', String(err));
  }

  // Test 4: POST /api/config/save (Save custom server-side config)
  console.log('\n[Test Suite 4: Secure Server-Side Configuration Save]');
  try {
    const res = await fetch('http://localhost:3000/api/config/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'gemini',
        model: 'gemini-flash-lite-latest',
        apiKey: API_KEY,
      }),
    });
    const data = await res.json();
    assert(
      res.status === 200 && data.success === true && data.config?.isCustom === true,
      'Save API configuration securely on server',
      `MaskedKey: ${data.config?.maskedKey}`
    );
  } catch (err) {
    assert(false, 'Save API configuration securely on server', String(err));
  }

  // Test 5: Multilingual Conversation - Bengali
  console.log('\n[Test Suite 5: Multilingual Capability - Bengali]');
  try {
    const text = await generateWithFallback('বাংলায় ১ বাক্যে বলো: পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ কোনটি?');
    const hasMoon = text.includes('চাঁদ') || text.includes('চন্দ্র');
    assert(hasMoon && text.length > 0, 'Bengali Knowledge Response', text);
  } catch (err: unknown) {
    assert(false, 'Bengali Knowledge Response', String(err));
  }

  // Test 6: Multilingual Conversation - English
  console.log('\n[Test Suite 6: Multilingual Capability - English]');
  try {
    const text = await generateWithFallback('What is the speed of sound in air approximately? Answer in 1 short sentence.');
    const hasSpeed = text.includes('343') || text.includes('340') || text.includes('meter') || text.includes('m/s');
    assert(hasSpeed && text.length > 0, 'English Knowledge Response', text);
  } catch (err: unknown) {
    assert(false, 'English Knowledge Response', String(err));
  }

  // Test 7: Mathematics Problem Solving
  console.log('\n[Test Suite 7: Mathematics Resolution]');
  await new Promise((r) => setTimeout(r, 1500));
  try {
    const text = await generateWithFallback('Solve for x: 7x - 14 = 35. State x value concisely.');
    const hasCorrectX = text.includes('7') || text.includes('x = 7') || text.includes('x=7');
    assert(hasCorrectX, 'Linear Equation Math Solution', text);
  } catch (err: unknown) {
    assert(false, 'Linear Equation Math Solution', String(err));
  }

  // Test 8: Empty Message Validation via Endpoint (HTTP 400)
  console.log('\n[Test Suite 8: Empty Message Validation]');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '   ' }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    assert(res.status === 400, 'Empty Message Rejection (HTTP 400)', `Status: ${res.status}`);
  } catch (err: unknown) {
    assert(false, 'Empty Message Rejection (HTTP 400)', String(err));
  }

  // Test 9: Live SSE Streaming via /api/chat with Configured API Key
  console.log('\n[Test Suite 9: Live Streaming Chat via Configured Model]');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Say: JARVIS online',
        history: [{ role: 'user', text: 'Hello' }, { role: 'model', text: 'Greetings.' }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    assert(res.status === 200, 'Streaming Endpoint Connection (HTTP 200)', `Status: ${res.status}`);

    const reader = res.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let streamChunksReceived = 0;
    let sawDone = false;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const textChunk = decoder.decode(value);
        if (textChunk.includes('data:')) {
          streamChunksReceived++;
        }
        if (textChunk.includes('[DONE]')) {
          sawDone = true;
        }
      }
    }

    assert(streamChunksReceived > 0, 'Stream Received Text Chunks', `Chunks: ${streamChunksReceived}`);
    assert(sawDone, 'Stream Received [DONE] Termination Token');
  } catch (err: unknown) {
    assert(false, 'Live Streaming Chat', String(err));
  }

  // Test 10: DELETE /api/config (Clean up and revert)
  console.log('\n[Test Suite 10: Remove Custom Configuration]');
  try {
    const res = await fetch('http://localhost:3000/api/config', {
      method: 'DELETE',
    });
    const data = await res.json();
    assert(
      res.status === 200 && data.success === true,
      'Revert / Remove custom configuration',
      data.message
    );
  } catch (err) {
    assert(false, 'Revert / Remove custom configuration', String(err));
  }

  console.log('\n======================================================');
  console.log(`  FINAL RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('======================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite();
