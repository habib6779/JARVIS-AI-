import React from 'react';
import { X, Volume2, VolumeX, Sliders, Shield, RefreshCw } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetTerminal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  onResetTerminal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl hud-border p-5 relative bg-[#020914] text-cyan-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron font-bold text-sm tracking-widest text-cyan-300">
              SYSTEM CONFIG
            </h3>
          </div>
          <button
            onClick={() => {
              soundFX.playBeep(400);
              onClose();
            }}
            className="w-7 h-7 rounded-lg hud-button flex items-center justify-center text-cyan-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings list */}
        <div className="py-4 space-y-4 font-rajdhani text-sm">
          {/* Sound Toggle */}
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
              className={`px-3 py-1 rounded-lg text-xs font-bold font-orbitron transition-all ${
                soundEnabled
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_#00e5ff]'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reset Terminal */}
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
              className="px-3 py-1 rounded-lg text-xs font-bold font-orbitron hud-button text-cyan-300"
            >
              RESET
            </button>
          </div>

          {/* System Protocol Info */}
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-3 text-xs text-cyan-400/70">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>JARVIS MARK VII • Core Diagnostic Active • Encryption AES-256</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              soundFX.playBeep(400);
              onClose();
            }}
            className="w-full py-2 rounded-xl hud-button text-xs font-orbitron font-semibold tracking-wider text-cyan-300"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
