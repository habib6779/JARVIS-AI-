/**
 * Service to manage server-side API configuration, credentials, and connection testing.
 * Strictly adheres to security: Real keys are handled server-side and never returned in plaintext.
 */

export interface ApiConfigResponse {
  provider: string;
  model: string;
  isConfigured: boolean;
  status: 'Not Configured' | 'Testing' | 'Connected' | 'Error';
  maskedKey: string;
  isCustom: boolean;
  lastError?: string | null;
}

export interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  model?: string;
}

export interface SaveResult {
  success: boolean;
  message?: string;
  error?: string;
  config?: ApiConfigResponse;
}

export async function fetchApiConfig(): Promise<ApiConfigResponse> {
  const res = await fetch('/api/config');
  if (!res.ok) {
    throw new Error(`Failed to fetch API configuration (status ${res.status})`);
  }
  return res.json();
}

export async function testApiConnection(params: {
  provider: string;
  model: string;
  apiKey?: string;
}): Promise<TestResult> {
  const res = await fetch('/api/config/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    return {
      success: false,
      error: data.error || 'Connection test failed. Please verify your API key.',
    };
  }

  return {
    success: true,
    message: data.message || 'API connection successfully verified.',
    model: data.model,
  };
}

export async function saveApiConfig(params: {
  provider: string;
  model: string;
  apiKey?: string;
}): Promise<SaveResult> {
  const res = await fetch('/api/config/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    return {
      success: false,
      error: data.error || 'Failed to save configuration.',
    };
  }

  return {
    success: true,
    message: data.message || 'Configuration saved successfully.',
    config: data.config,
  };
}

export async function removeApiConfig(): Promise<SaveResult> {
  const res = await fetch('/api/config', {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    return {
      success: false,
      error: data.error || 'Failed to remove configuration.',
    };
  }

  return {
    success: true,
    message: data.message || 'API configuration removed.',
    config: data.config,
  };
}
