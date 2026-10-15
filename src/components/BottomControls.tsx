import React from 'react';
import { Globe, Mic, LayoutGrid } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface BottomControlsProps {
  isListening: boolean;
  onToggleMic: () => void;
  onOpenWebSearch: () => void;
  onOpenAppControl: () => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  isListening,
  onToggleMic,
  onOpenWebSearch,
  onOpenAppControl,
}) => {
  const handleMicClick = () => {
    if (isListening) {
      soundFX.playMicDeactivate();
    } else {
      soundFX.playMicActivate();
    }
    onToggleMic();
  };

  const handleWebClick = () => {
    soundFX.playBeep(720, 'sine', 0.1);
    onOpenWebSearch();
  };

  const handleAppClick = () => {
    soundFX.playBeep(680, 'sine', 0.1);
    onOpenAppControl();
  };

  return (
    <div className="w-full flex items-center justify-between px-1 relative select-none">
      {/* 1. Web Search Button (Left) */}
      <button
        onClick={handleWebClick}
        className="flex-1 max-w-[105px] sm:max-w-[125px] h-15 sm:h-17 rounded-xl sm:rounded-2xl hud-button flex flex-col items-center justify-center gap-1 cursor-pointer group"
      >
        <Globe className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-rajdhani font-semibold text-[10.5px] sm:text-xs text-cyan-300 tracking-wider truncate">
          Web Search
        </span>
      </button>

      {/* 2. Central Circular Microphone Button (Center) */}
      <div className="flex flex-col items-center justify-center px-2">
        <button
          onClick={handleMicClick}
          className={`relative w-15 h-15 sm:w-17 sm:h-17 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isListening 
              ? 'glow-mic-btn-active bg-[#1f0a0d]' 
              : 'glow-mic-btn bg-[#120508] hover:scale-105 active:scale-95'
          }`}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {/* Concentric red pulse ring when active */}
          {isListening && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-60" />
          )}

          {/* Inner ring track */}
          <div className="absolute inset-1 rounded-full border border-red-500/40" />

          {/* Red Glowing Microphone Icon */}
          <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff3344] drop-shadow-[0_0_10px_rgba(255,51,68,0.9)]" />
        </button>

        {/* Glowing Red MIC label underneath */}
        <span className="font-rajdhani font-bold text-[10px] sm:text-[11px] tracking-[0.25em] text-[#ff3344] glow-text-red uppercase mt-1">
          MIC
        </span>
      </div>

      {/* 3. App Control Button (Right) */}
      <button
        onClick={handleAppClick}
        className="flex-1 max-w-[105px] sm:max-w-[125px] h-15 sm:h-17 rounded-xl sm:rounded-2xl hud-button flex flex-col items-center justify-center gap-1 cursor-pointer group"
      >
        <LayoutGrid className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-rajdhani font-semibold text-[10.5px] sm:text-xs text-cyan-300 tracking-wider truncate">
          App Control
        </span>
      </button>
    </div>
  );
};
