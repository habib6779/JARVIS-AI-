import React, { useRef, useEffect } from 'react';
import { HistoryItem } from '../types/terminal';

interface TerminalLogProps {
  logs: HistoryItem[];
  isProcessing?: boolean;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs, isProcessing = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as logs/messages update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isProcessing]);

  return (
    <div className="w-full rounded-xl sm:rounded-2xl hud-border p-2.5 sm:p-3.5 h-[110px] sm:h-[130px] md:h-[140px] flex flex-col justify-between overflow-hidden relative select-none">
      {/* Corner tech accents */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-cyan-400/50 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-cyan-400/50 pointer-events-none" />

      {/* Unified Conversation & System Terminal History Container */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-auto space-y-2 font-tech text-[11px] sm:text-xs text-cyan-300 tracking-wider leading-relaxed pr-1"
      >
        {logs.map((item) => (
          <div key={item.id} className="leading-tight">
            {item.source === 'SYSTEM' && (
              <div className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold shrink-0">SYSTEM:</span>
                <span className="text-[#38e1ff] glow-text-cyan break-words">{item.text}</span>
              </div>
            )}

            {item.source === 'USER' && (
              <div className="flex items-start gap-1.5 my-0.5">
                <span className="text-cyan-400 font-bold shrink-0">USER:</span>
                <span className="text-white glow-text-cyan break-words font-medium">{item.text}</span>
              </div>
            )}

            {item.source === 'JARVIS' && (
              <div className="flex items-start gap-1.5 pl-2 border-l border-cyan-400/40 my-0.5">
                <span className="text-[#00e5ff] font-bold shrink-0">JARVIS:</span>
                <span className="text-cyan-100 glow-text-cyan break-words">{item.text}</span>
              </div>
            )}
          </div>
        ))}

        {/* Quiet processing notice when input is submitted */}
        {isProcessing && (
          <div className="text-[10px] sm:text-[11px] text-cyan-400/70 font-rajdhani tracking-widest uppercase">
            [PROCESSING INPUT DIRECTIVE...]
          </div>
        )}
      </div>
    </div>
  );
};
