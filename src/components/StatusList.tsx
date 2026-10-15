import React from 'react';
import { Mic, Wifi, Battery } from 'lucide-react';

interface StatusListProps {
  isVoiceActive?: boolean;
  voiceStatus?: string;
  networkStatus?: string;
  batteryLevel?: number;
}

export const StatusList: React.FC<StatusListProps> = ({
  isVoiceActive = false,
  voiceStatus = 'Standby',
  networkStatus = 'Connected',
  batteryLevel = 78,
}) => {
  return (
    <div className="w-full h-full min-h-[135px] max-h-[175px] sm:min-h-[145px] sm:max-h-[190px] rounded-xl sm:rounded-2xl hud-border p-2 sm:p-2.5 flex flex-col justify-around">
      {/* 1. Voice Indicator */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div 
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
            isVoiceActive 
              ? 'border-cyan-300 bg-cyan-500/20 shadow-[0_0_10px_#00e5ff]' 
              : 'border-cyan-400/70 bg-[#041a33]/60 shadow-[0_0_8px_rgba(0,229,255,0.25)]'
          }`}
        >
          <Mic className={`w-3.5 h-3.5 ${isVoiceActive ? 'text-white' : 'text-cyan-400'}`} />
        </div>
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <span className="font-rajdhani font-bold text-[9.5px] sm:text-[10.5px] tracking-[0.14em] text-cyan-300 uppercase leading-none mb-0.5">
            VOICE
          </span>
          <span className={`font-rajdhani text-xs sm:text-sm font-semibold leading-tight truncate ${
            isVoiceActive ? 'text-white glow-text-cyan' : 'text-cyan-400/90'
          }`}>
            {isVoiceActive ? 'Listening...' : voiceStatus}
          </span>
        </div>
      </div>

      {/* 2. Network Indicator */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cyan-400/70 bg-[#041a33]/60 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.25)]">
          <Wifi className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <span className="font-rajdhani font-bold text-[9.5px] sm:text-[10.5px] tracking-[0.14em] text-cyan-300 uppercase leading-none mb-0.5">
            NETWORK
          </span>
          <span className="font-rajdhani text-xs sm:text-sm font-semibold text-cyan-400/90 leading-tight truncate">
            {networkStatus}
          </span>
        </div>
      </div>

      {/* 3. Battery Indicator */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cyan-400/70 bg-[#041a33]/60 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.25)]">
          <Battery className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <span className="font-rajdhani font-bold text-[9.5px] sm:text-[10.5px] tracking-[0.14em] text-cyan-300 uppercase leading-none mb-0.5">
            BATTERY
          </span>
          <span className="font-rajdhani text-xs sm:text-sm font-semibold text-cyan-400/90 leading-tight">
            {batteryLevel}%
          </span>
        </div>
      </div>
    </div>
  );
};
