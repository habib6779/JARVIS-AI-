import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sliders,
  Shield,
  RefreshCw,
  Key,
  Eye,
  EyeOff,
  Clipboard,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  Loader2,
  Sparkles,
  Cpu,
  Server,
  Lock,
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import {
  ApiConfigResponse,
  fetchApiConfig,
  testApiConnection,
  saveApiConfig,
  removeApiConfig,
} from '../services/configService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetTerminal: () => void;
  onConfigChange?: (config: ApiConfigResponse) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  onResetTerminal,
  onConfigChange,
}) => {
  const [config, setConfig] = useState<ApiConfigResponse | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
  const [provider, setProvider] = useState<string>('gemini');
  const [model, setModel] = useState<string>('gemini-3.1-flash-lite');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false);
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Load configuration from backend whenever modal is opened
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setIsLoadingConfig(true);
    setStatusMessage(null);
    setClipboardNotice(null);
    setShowRemoveConfirm(false);

    fetchApiConfig()
      .then((data) => {
        if (!mounted) return;
        setConfig(data);
        setProvider(data.provider || 'gemini');
        setModel(data.model || 'gemini-3.1-flash-lite');
        // If already configured, show saved/read-only mode until Edit is clicked
        setIsEditing(!data.isConfigured);
        setApiKeyInput('');
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Failed to load API configuration:', err);
        setStatusMessage({
          type: 'error',
          text: 'Unable to query backend configuration state.',
        });
      })
      .finally(() => {
        if (mounted) setIsLoadingConfig(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Clipboard Paste with graceful fallback and clear errors
  const handlePaste = async () => {
    soundFX.playBeep(700);
    setClipboardNotice(null);
    setStatusMessage(null);

    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        throw new Error('Clipboard API unavailable in this browser or context.');
      }
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        setClipboardNotice('Clipboard is empty. Please copy your Gemini API key first.');
        return;
      }
      setApiKeyInput(text.trim());
      setStatusMessage({
        type: 'info',
        text: 'API Key successfully pasted from clipboard.',
      });
    } catch (err: unknown) {
      console.warn('Clipboard read error:', err);
      setClipboardNotice(
        'Clipboard access is restricted or denied by your browser. Please paste manually into the field (Ctrl+V / Cmd+V).'
      );
    }
  };

  // Handle Real API Connection Test
  const handleTestConnection = async () => {
    soundFX.playBeep(650);
    setIsTesting(true);
    setStatusMessage(null);
    setClipboardNotice(null);

    const keyToTest = apiKeyInput.trim() || undefined;
    const result = await testApiConnection({
      provider,
      model,
      apiKey: keyToTest,
    });

    setIsTesting(false);
    if (result.success) {
      soundFX.playBeep(880);
      setStatusMessage({
        type: 'success',
        text: result.message || 'API connection verified successfully!',
      });
      if (config) {
        const updated = { ...config, status: 'Connected' as const };
        setConfig(updated);
        if (onConfigChange) onConfigChange(updated);
      }
    } else {
      soundFX.playBeep(300);
      setStatusMessage({
        type: 'error',
        text: result.error || 'Connection test failed. Please verify your credentials.',
      });
      if (config) {
        const updated = {
          ...config,
          status: 'Error' as const,
          lastError: result.error,
        };
        setConfig(updated);
        if (onConfigChange) onConfigChange(updated);
      }
    }
  };

  // Handle Save API Configuration
  const handleSaveConfig = async () => {
    if (!apiKeyInput.trim() && !config?.isConfigured) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter or paste an API Key before saving.',
      });
      return;
    }

    soundFX.playBeep(750);
    setIsSaving(true);
    setStatusMessage(null);
    setClipboardNotice(null);

    const result = await saveApiConfig({
      provider,
      model,
      apiKey: apiKeyInput.trim() || undefined,
    });

    setIsSaving(false);
    if (result.success && result.config) {
      soundFX.playBeep(920);
      setConfig(result.config);
      setIsEditing(false);
      setApiKeyInput('');
      setStatusMessage({
        type: 'success',
        text: 'API configuration saved securely on server.',
      });
      if (onConfigChange) onConfigChange(result.config);
    } else {
      soundFX.playBeep(320);
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to save configuration.',
      });
    }
  };

  // Handle Remove API Key
  const handleRemoveConfig = async () => {
    soundFX.playBeep(450);
    setIsRemoving(true);
    setStatusMessage(null);

    const result = await removeApiConfig();
    setIsRemoving(false);
    setShowRemoveConfirm(false);

    if (result.success && result.config) {
      setConfig(result.config);
      setIsEditing(!result.config.isConfigured);
      setApiKeyInput('');
      setStatusMessage({
        type: 'info',
        text: result.message || 'API configuration removed.',
      });
      if (onConfigChange) onConfigChange(result.config);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to remove API configuration.',
      });
    }
  };

  // Compute live connection status
  const currentStatus = isTesting
    ? 'Testing'
    : config?.status || 'Not Configured';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-2xl hud-border bg-[#020914] text-cyan-200 shadow-[0_0_30px_rgba(0,229,255,0.15)] relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-[#041226]/80 shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron font-bold text-xs sm:text-sm tracking-widest text-cyan-300">
              JARVIS SYSTEM CONFIG
            </h3>
          </div>
          <button
            onClick={() => {
              soundFX.playBeep(400);
              onClose();
            }}
            className="w-7 h-7 rounded-lg hud-button flex items-center justify-center text-cyan-400 hover:text-white cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 font-rajdhani text-sm">
          {/* 1. API CONFIGURATION SECTION */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 relative">
            {/* Header & Status Indicator */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span className="font-orbitron font-bold text-xs tracking-wider text-cyan-200">
                  AI CORE API CONFIGURATION
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5">
                {currentStatus === 'Testing' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-amber-500/20 text-amber-300 border border-amber-400/50 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    TESTING
                  </span>
                )}
                {currentStatus === 'Connected' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    CONNECTED
                  </span>
                )}
                {currentStatus === 'Error' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-rose-500/20 text-rose-300 border border-rose-400/50">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    ERROR
                  </span>
                )}
                {currentStatus === 'Not Configured' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    <AlertCircle className="w-3 h-3 text-slate-400" />
                    NOT CONFIGURED
                  </span>
                )}
              </div>
            </div>

            {/* Provider Selector */}
            <div className="space-y-1.5 mb-3">
              <label className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                API PROVIDER
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                disabled={!isEditing && config?.isConfigured}
                className="w-full bg-[#020d1c] border border-cyan-500/40 rounded-lg px-2.5 py-1.5 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <option value="gemini">Google Gemini (Official API)</option>
              </select>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5 mb-3">
              <label className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                MODEL SELECTOR
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!isEditing && config?.isConfigured}
                className="w-full bg-[#020d1c] border border-cyan-500/40 rounded-lg px-2.5 py-1.5 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <option value="gemini-3.1-flash-lite">
                  gemini-3.1-flash-lite (Fastest, High Availability)
                </option>
                <option value="gemini-flash-lite-latest">
                  gemini-flash-lite-latest (Auto-Updated Lite)
                </option>
                <option value="gemini-3.8-flash">
                  gemini-3.8-flash (Standard Flash)
                </option>
              </select>
            </div>

            {/* API Key Input / Display */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  API KEY
                </label>
                {config?.isConfigured && !isEditing && (
                  <span className="text-[11px] text-cyan-400/70">
                    {config.isCustom ? 'User Key (Server Stored)' : 'System Environment Key'}
                  </span>
                )}
              </div>

              {/* Input Field with integrated Paste & Show/Hide buttons */}
              {isEditing || !config?.isConfigured ? (
                <div className="space-y-2">
                  <div className="relative flex items-center">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKeyInput}
                      onChange={(e) => {
                        setApiKeyInput(e.target.value);
                        setStatusMessage(null);
                        setClipboardNotice(null);
                      }}
                      placeholder="Paste your Gemini API key (AIzaSy...)"
                      className="w-full bg-[#020d1c] border border-cyan-500/50 rounded-lg pl-3 pr-20 py-2 text-xs text-cyan-100 placeholder-cyan-700/60 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(0,229,255,0.3)] font-mono"
                    />

                    {/* Integrated controls: Paste & Show/Hide */}
                    <div className="absolute right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePaste}
                        className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-[10px] font-orbitron font-semibold text-cyan-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        title="Paste from clipboard"
                      >
                        <Clipboard className="w-3 h-3" />
                        <span>PASTE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowKey((prev) => !prev)}
                        className="p-1 rounded text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer"
                        title={showKey ? 'Hide key' : 'Show key'}
                      >
                        {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Clipboard Notice Banner if access restricted */}
                  {clipboardNotice && (
                    <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-1.5 leading-tight">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{clipboardNotice}</span>
                    </div>
                  )}

                  {/* Action buttons while editing */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isTesting || (!apiKeyInput.trim() && !config?.isConfigured)}
                      onClick={handleTestConnection}
                      className="flex-1 py-1.5 px-3 rounded-lg hud-button text-xs font-orbitron font-bold text-cyan-300 hover:text-white flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>TESTING...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>TEST API</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSaving || !apiKeyInput.trim()}
                      onClick={handleSaveConfig}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-xs font-orbitron font-bold text-cyan-200 hover:text-white shadow-[0_0_10px_rgba(0,229,255,0.3)] flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>SAVING...</span>
                        </>
                      ) : (
                        <span>SAVE KEY</span>
                      )}
                    </button>

                    {config?.isConfigured && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setApiKeyInput('');
                          setStatusMessage(null);
                        }}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 cursor-pointer"
                      >
                        CANCEL
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Configured Key (Masked Display with Edit & Remove actions) */
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#020d1c] border border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono text-xs text-cyan-200 tracking-wider">
                        {config?.maskedKey || '••••••••••••••••'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playBeep(600);
                          setIsEditing(true);
                          setStatusMessage(null);
                        }}
                        className="px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-[11px] font-orbitron text-cyan-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        title="Edit API Key"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>EDIT</span>
                      </button>

                      {config?.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            soundFX.playBeep(400);
                            setShowRemoveConfirm(true);
                          }}
                          className="px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-[11px] font-orbitron text-rose-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title="Remove custom API Key"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>REMOVE</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Remove Confirmation Prompt */}
                  {showRemoveConfirm && (
                    <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40 space-y-2 text-xs">
                      <p className="text-rose-200 font-semibold">
                        Remove custom Gemini API key from server?
                      </p>
                      <p className="text-[11px] text-rose-300/80">
                        JARVIS will disconnect or fall back to system defaults.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isRemoving}
                          onClick={handleRemoveConfig}
                          className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-orbitron text-[11px] font-bold cursor-pointer disabled:opacity-50"
                        >
                          {isRemoving ? 'REMOVING...' : 'CONFIRM REMOVE'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRemoveConfirm(false)}
                          className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700 cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Test Connection Button for already saved key */}
                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={isTesting}
                      onClick={handleTestConnection}
                      className="w-full py-1.5 px-3 rounded-lg hud-button text-xs font-orbitron font-bold text-cyan-300 hover:text-white flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>TESTING CONNECTION...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>TEST SAVED CONNECTION</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Real Status / Feedback Message banner */}
            {statusMessage && (
              <div
                className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
                    : 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200'
                }`}
              >
                {statusMessage.type === 'success' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {statusMessage.type === 'error' && (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                {statusMessage.type === 'info' && (
                  <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                )}
                <span className="flex-1">{statusMessage.text}</span>
              </div>
            )}
          </div>

          {/* 2. Synthesizer Audio Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-cyan-500/50" />
              )}
              <div>
                <p className="font-semibold text-cyan-200">Synthesizer Audio</p>
                <p className="text-xs text-cyan-400/60">Sci-fi interface feedback chimes</p>
              </div>
            </div>
            <button
              onClick={() => {
                onToggleSound();
                soundFX.playBeep(600);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-orbitron transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_#00e5ff]'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 3. Reset Terminal Console */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-semibold text-cyan-200">Terminal Log</p>
                <p className="text-xs text-cyan-400/60">Reset console back to boot state</p>
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playBeep(520);
                onResetTerminal();
                onClose();
              }}
              className="px-3 py-1 rounded-lg text-xs font-bold font-orbitron hud-button text-cyan-300 cursor-pointer"
            >
              RESET
            </button>
          </div>

          {/* 4. Security & Encryption Note */}
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-3 text-xs text-cyan-400/70">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Server-Side Secure Key Isolation • Zero Client-Side Exposure • AES-256</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#041226]/80 text-center shrink-0">
          <button
            onClick={() => {
              soundFX.playBeep(400);
              onClose();
            }}
            className="w-full py-2 rounded-xl hud-button text-xs font-orbitron font-semibold tracking-wider text-cyan-300 hover:text-white cursor-pointer"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
