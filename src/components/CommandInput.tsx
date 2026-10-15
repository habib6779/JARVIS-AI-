import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CommandInputProps {
  onSendCommand: (cmd: string) => void;
  disabled?: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({ onSendCommand, disabled = false }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    soundFX.playSend();
    onSendCommand(value.trim());
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center gap-2 sm:gap-2.5">
      {/* Input Field */}
      <div className="flex-1 min-w-0 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a command..."
          disabled={disabled}
          className="w-full h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl hud-border font-rajdhani text-xs sm:text-sm text-cyan-100 placeholder:text-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-300 focus:border-cyan-300 transition-all duration-200"
        />
        {/* Glowing interior node */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/30 pointer-events-none" />
      </div>

      {/* Send Button */}
      <button
        type="submit"
        disabled={disabled}
        className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl hud-button flex items-center justify-center gap-1.5 sm:gap-2 text-cyan-300 font-rajdhani font-bold text-xs sm:text-sm tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed uppercase shrink-0 whitespace-nowrap"
      >
        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 -rotate-12" />
        <span className="glow-text-cyan">SEND</span>
      </button>
    </form>
  );
};
