/**
 * JARVIS Gemini AI Brain Service
 * Handles streaming communication with the backend /api/chat endpoint.
 * Maintains memory of the last 10 messages and handles network/API errors gracefully.
 */

export interface ChatMessageMemory {
  role: 'user' | 'model';
  text: string;
}

export async function streamGeminiResponse(
  prompt: string,
  history: ChatMessageMemory[],
  onChunk: (accumulatedText: string) => void,
  onError: (errorMessage: string) => void,
  onComplete: () => void
): Promise<void> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) {
    onError('বার্তা খালি হতে পারে না। অনুগ্রহ করে কিছু লিখুন।');
    onComplete();
    return;
  }

  // Keep only the last 10 messages
  const boundedHistory = history.slice(-10);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: cleanPrompt,
        history: boundedHistory,
      }),
    });

    if (!response.ok) {
      let errorMsg = 'দুঃখিত, সংযোগে সমস্যা হয়েছে বা API সীমা শেষ। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMsg = errorData.error;
        }
      } catch {
        // use default error message
      }
      onError(errorMsg);
      onComplete();
      return;
    }

    if (!response.body) {
      onError('কোনো তথ্য পাওয়া যায়নি। সংযোগ পরীক্ষা করুন।');
      onComplete();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulatedText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const dataStr = trimmed.slice(6);
        if (dataStr === '[DONE]') {
          onComplete();
          return;
        }

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            onError(parsed.error);
            onComplete();
            return;
          }
          if (parsed.text) {
            accumulatedText += parsed.text;
            onChunk(accumulatedText);
          }
        } catch {
          // ignore chunk parse artifacts
        }
      }
    }

    onComplete();
  } catch (err: unknown) {
    console.error('Fetch stream error:', err);
    onError('দুঃখিত, ইন্টারনেট সংযোগ বিচ্ছিন্ন বা সার্ভার সাড়া দিচ্ছে না।');
    onComplete();
  }
}
