import React, { useState } from 'react';
import { X, Search, Globe, ExternalLink } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface WebSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchSubmit: (query: string) => void;
}

export const WebSearchModal: React.FC<WebSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    soundFX.playSend();
    onSearchSubmit(query.trim());
    setQuery('');
    onClose();
  };

  const sampleSearches = [
    'Stark Industries Satellite Uplink',
    'Atmospheric Weather Telemetry',
    'Global Network Grid Latency',
    'Quantum Encryption Standards',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl hud-border p-5 relative bg-[#020914] text-cyan-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron font-bold text-sm tracking-widest text-cyan-300">
              WEB SEARCH PROTOCOL
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

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query satellite network..."
              autoFocus
              className="w-full h-11 pl-10 pr-4 rounded-xl hud-border font-rajdhani text-sm text-cyan-100 placeholder:text-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-300"
            />
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-2 rounded-xl hud-button text-xs font-orbitron font-semibold tracking-wider text-cyan-300 flex items-center justify-center gap-2"
          >
            <span>EXECUTE QUERY</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </form>

        {/* Preset query chips */}
        <div className="mt-4 pt-3 border-t border-cyan-500/20">
          <p className="text-[11px] font-rajdhani text-cyan-400/70 uppercase tracking-wider mb-2">
            Quick Inquiries:
          </p>
          <div className="flex flex-col gap-1.5">
            {sampleSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFX.playSend();
                  onSearchSubmit(item);
                  onClose();
                }}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs font-rajdhani text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/20 transition-colors"
              >
                &gt; {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
