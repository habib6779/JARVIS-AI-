import React, { useState, useEffect } from 'react';
import { Thermometer, Clock } from 'lucide-react';

interface SystemTelemetryProps {
  cpuVal?: number;
  ramVal?: number;
  tempVal?: number;
  timeStr?: string;
}

export const SystemTelemetry: React.FC<SystemTelemetryProps> = ({
  cpuVal = 18,
  ramVal = 42,
  tempVal = 32,
  timeStr,
}) => {
  const [cpu, setCpu] = useState(cpuVal);
  const [ram, setRam] = useState(ramVal);
  const [temp, setTemp] = useState(tempVal);
  const [currentTime, setCurrentTime] = useState(timeStr || '09:41');

  // Subtle ambient fluctuation around target values
  useEffect(() => {
    const interval = setInterval(() => {
      const cpuDelta = (Math.random() - 0.5) * 4;
      setCpu(Math.min(99, Math.max(12, Math.round(cpuVal + cpuDelta))));

      const ramDelta = (Math.random() - 0.5) * 2;
      setRam(Math.min(99, Math.max(38, Math.round(ramVal + ramDelta))));

      const tempDelta = (Math.random() - 0.5) * 1.5;
      setTemp(Math.round(tempVal + tempDelta));
    }, 4000);

    return () => clearInterval(interval);
  }, [cpuVal, ramVal, tempVal]);

  useEffect(() => {
    if (!timeStr) {
      setCurrentTime('09:41');
    } else {
      setCurrentTime(timeStr);
    }
  }, [timeStr]);

  return (
    <div className="flex flex-row gap-2 sm:gap-3 w-full items-stretch">
      {/* 1. CPU & RAM Panel (takes ~44% of space, no overlap) */}
      <div className="flex-[1.4] min-w-0 rounded-xl sm:rounded-2xl hud-border p-2.5 sm:p-3 flex flex-col justify-between">
        {/* CPU Row */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-rajdhani font-bold text-cyan-300 tracking-wider text-[11px] sm:text-xs">
              CPU
            </span>
            <span className="text-[10px] text-cyan-400/40 select-none hidden xs:inline">+</span>
            <span className="font-tech text-xs sm:text-sm text-cyan-200 tabular-nums font-bold glow-text-cyan">
              {cpu}%
            </span>
          </div>
          {/* CPU Bar */}
          <div className="w-full h-1 bg-[#021324] rounded-full overflow-hidden border border-cyan-500/20">
            <div 
              className="h-full bg-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_8px_#00e5ff]"
              style={{ width: `${cpu}%` }}
            />
          </div>
        </div>

        {/* RAM Row */}
        <div className="mt-1.5 sm:mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-rajdhani font-bold text-cyan-300 tracking-wider text-[11px] sm:text-xs">
              RAM
            </span>
            <span className="font-tech text-xs sm:text-sm text-cyan-200 tabular-nums font-bold glow-text-cyan">
              {ram}%
            </span>
          </div>
          {/* RAM Bar */}
          <div className="w-full h-1 bg-[#021324] rounded-full overflow-hidden border border-cyan-500/20">
            <div 
              className="h-full bg-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_8px_#00e5ff]"
              style={{ width: `${ram}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. TEMP Panel (takes ~28% of space) */}
      <div className="flex-1 min-w-0 rounded-xl sm:rounded-2xl hud-border p-2.5 sm:p-3 flex flex-col justify-between">
        <div className="flex items-center gap-1 text-cyan-300">
          <Thermometer className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
          <span className="font-rajdhani font-bold text-[10px] sm:text-[11px] tracking-wider text-cyan-300 uppercase truncate">
            TEMP
          </span>
        </div>

        <div className="font-rajdhani font-bold text-base sm:text-xl text-cyan-100 glow-text-cyan tracking-wide my-0.5 truncate">
          {temp}°C
        </div>

        {/* Bottom track indicator with node */}
        <div className="relative w-full h-1.5 flex items-center">
          <div className="w-full h-[1px] bg-cyan-500/30" />
          <div 
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-cyan-400 bg-[#041b33] shadow-[0_0_6px_#00e5ff]"
            style={{ left: '30%' }}
          />
        </div>
      </div>

      {/* 3. TIME Panel (takes ~28% of space) */}
      <div className="flex-1 min-w-0 rounded-xl sm:rounded-2xl hud-border p-2.5 sm:p-3 flex flex-col justify-between">
        <div className="flex items-center gap-1 text-cyan-300">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
          <span className="font-rajdhani font-bold text-[10px] sm:text-[11px] tracking-wider text-cyan-300 uppercase truncate">
            TIME
          </span>
        </div>

        <div className="font-rajdhani font-bold text-base sm:text-xl text-cyan-100 glow-text-cyan tracking-wide my-0.5 truncate">
          {currentTime}
        </div>

        {/* Bottom track indicator with node */}
        <div className="relative w-full h-1.5 flex items-center">
          <div className="w-full h-[1px] bg-cyan-500/30" />
          <div 
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-cyan-400 bg-[#041b33] shadow-[0_0_6px_#00e5ff]"
            style={{ left: '24%' }}
          />
        </div>
      </div>
    </div>
  );
};
