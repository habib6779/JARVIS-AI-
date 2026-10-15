import React from 'react';
import { X, LayoutGrid, Cpu, Shield, Zap, Radio, Bell } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface AppControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction: (actionName: string) => void;
}

export const AppControlModal: React.FC<AppControlModalProps> = ({
  isOpen,
  onClose,
  onTriggerAction,
}) => {
  if (!isOpen) return null;

  const apps = [
    { name: 'Core Diagnostics', icon: Cpu, desc: 'Full sensor telemetry calibration' },
    { name: 'Defense Protocol', icon: Shield, desc: 'Perimeter radar and shield check' },
    { name: 'Power Grid Routing', icon: Zap, desc: 'Arc reactor energy optimization' },
    { name: 'Comms Transceiver', icon: Radio, desc: 'Sub-orbital frequency tuning' },
    { name: 'Surveillance Alert', icon: Bell, desc: 'Motion detector status report' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl hud-border p-5 relative bg-[#020914] text-cyan-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron font-bold text-sm tracking-widest text-cyan-300">
              APP SUBSYSTEMS
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

        {/* Subsystems grid */}
        <div className="py-4 space-y-2.5 font-rajdhani">
          {apps.map((app, idx) => {
            const Icon = app.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  soundFX.playBeep(700 + idx * 40);
                  onTriggerAction(app.name);
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hud-button flex items-center gap-3 text-left group transition-all"
              >
                <div className="w-8 h-8 rounded-lg border border-cyan-500/30 bg-cyan-950/40 flex items-center justify-center shrink-0 group-hover:border-cyan-400">
                  <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-cyan-200 text-sm tracking-wide group-hover:text-white">
                    {app.name}
                  </p>
                  <p className="text-[11px] text-cyan-400/60 truncate">{app.desc}</p>
                </div>
                <span className="text-cyan-400/50 text-xs font-mono">&gt;</span>
              </button>
            );
          })}
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
            CLOSE MENU
          </button>
        </div>
      </div>
    </div>
  );
};
