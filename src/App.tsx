import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { AiCore } from './components/AiCore';
import { SystemTelemetry } from './components/SystemTelemetry';
import { StatusList } from './components/StatusList';
import { TerminalLog } from './components/TerminalLog';
import { CommandInput } from './components/CommandInput';
import { BottomControls } from './components/BottomControls';
import { SettingsModal } from './components/SettingsModal';
import { WebSearchModal } from './components/WebSearchModal';
import { AppControlModal } from './components/AppControlModal';
import { HistoryItem } from './types/terminal';
import { soundFX } from './utils/audio';

const INITIAL_LOGS: HistoryItem[] = [
  { id: 'init-1', source: 'SYSTEM', text: 'JARVIS INITIALIZED' },
  { id: 'init-2', source: 'SYSTEM', text: 'AI CORE ONLINE' },
  { id: 'init-3', source: 'SYSTEM', text: 'READY FOR INPUT' },
];

export default function App() {
  const [logs, setLogs] = useState<HistoryItem[]>(INITIAL_LOGS);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isWebSearchOpen, setIsWebSearchOpen] = useState<boolean>(false);
  const [isAppControlOpen, setIsAppControlOpen] = useState<boolean>(false);

  // Helper to append system logs into the unified history
  const addSystemLog = (text: string) => {
    const item: HistoryItem = {
      id: 'sys-' + Date.now(),
      source: 'SYSTEM',
      text,
    };
    setLogs((prev) => [...prev, item]);
  };

  // Toggle voice assistant state
  const handleToggleVoice = () => {
    setIsVoiceActive((prev) => {
      const next = !prev;
      if (next) {
        addSystemLog('VOICE INPUT STREAM: ACTIVE');
      } else {
        addSystemLog('VOICE INPUT STREAM: STANDBY');
      }
      return next;
    });
  };

  // Handle typed command/message inside the single unified history panel
  const handleSendCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const userEntry: HistoryItem = {
      id: 'usr-' + Date.now(),
      source: 'USER',
      text: cmd.trim(),
    };

    setLogs((prev) => [...prev, userEntry]);
    setIsProcessing(true);

    // Prepare area for future JARVIS response beneath the user message
    setTimeout(() => {
      setIsProcessing(false);

      const lower = cmd.toLowerCase().trim();
      let jarvisReply = 'Input received. AI service integration will connect here.';

      if (lower === 'hello' || lower === 'hi' || lower === 'hey' || lower.includes('jarvis')) {
        jarvisReply = 'Greetings. Systems online and listening.';
      } else if (lower.includes('status') || lower.includes('system') || lower.includes('health')) {
        jarvisReply = 'All subsystem diagnostics nominal.';
      } else if (lower.startsWith('what is') || lower.startsWith('how') || lower.startsWith('why') || lower.endsWith('?')) {
        jarvisReply = 'Inquiry logged. Neural response module pending backend connection.';
      } else {
        jarvisReply = `Directive "${cmd}" noted. Awaiting command service connection.`;
      }

      const jarvisEntry: HistoryItem = {
        id: 'jarvis-' + Date.now(),
        source: 'JARVIS',
        text: jarvisReply,
      };

      setLogs((prev) => [...prev, jarvisEntry]);
    }, 450);
  };

  // Handle Web Search query simulation into unified history
  const handleWebSearch = (query: string) => {
    handleSendCommand(`search ${query}`);
  };

  // Handle App Subsystem action into unified history
  const handleAppAction = (appName: string) => {
    handleSendCommand(`launch ${appName}`);
  };

  // Sync sound utility with toggle
  useEffect(() => {
    soundFX.enabled = soundEnabled;
  }, [soundEnabled]);

  return (
    <div className="h-[100dvh] w-full bg-[#02050c] text-cyan-200 flex flex-col justify-between overflow-x-hidden overflow-y-auto sm:overflow-hidden select-none relative">
      {/* Background Cyber Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none bg-cyber-grid opacity-30" />
      <div 
        className="fixed top-1/4 -left-32 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" 
      />
      <div 
        className="fixed bottom-1/4 -right-32 w-96 h-96 rounded-full bg-blue-700/10 blur-[130px] pointer-events-none" 
      />

      {/* Standalone Futuristic Dashboard (Full Viewport Integration, No Extra Expanding Cards) */}
      <main className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex-1 flex flex-col justify-between p-2.5 sm:p-3 md:py-3.5 relative z-10">
        
        {/* 1. TOP HEADER */}
        <header className="flex items-center justify-between w-full shrink-0 pt-0.5 pb-1 px-1">
          {/* Left vertical glowing cyan accent bar */}
          <div className="w-1.5 h-6 sm:h-7 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />

          {/* Center Title Lockup */}
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="font-orbitron font-bold text-xl sm:text-2xl md:text-3xl tracking-[0.22em] text-[#38e1ff] glow-text-cyan leading-none">
              JARVIS
            </h1>
            <span className="font-rajdhani font-bold text-[10px] sm:text-[11px] tracking-[0.32em] text-[#00c8e6] opacity-90 mt-0.5 sm:mt-1 uppercase">
              AI VOICE ASSISTANT
            </span>
          </div>

          {/* Right Glowing Settings Gear */}
          <button
            onClick={() => {
              soundFX.playBeep(620);
              setIsSettingsOpen(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 hover:text-cyan-200 transition-colors drop-shadow-[0_0_8px_rgba(0,229,255,0.7)] cursor-pointer"
            title="System Settings"
          >
            <Settings className="w-5 h-5 hover:rotate-45 transition-transform duration-300" />
          </button>
        </header>

        {/* 2. SYSTEM TELEMETRY ROW (CPU, RAM, TEMP, TIME) */}
        <section className="w-full shrink-0 my-1">
          <SystemTelemetry cpuVal={18} ramVal={42} tempVal={32} timeStr="09:41" />
        </section>

        {/* 3. MIDDLE ROW: HOLOGRAPHIC AI CORE & STATUS LIST (Height reduced ~10% to give space to history) */}
        <section className="grid grid-cols-12 gap-2 sm:gap-3 w-full items-stretch shrink-0 min-h-[135px] max-h-[175px] sm:min-h-[145px] sm:max-h-[190px] my-1">
          {/* Left: Circular Holographic AI Core (Spans 7 cols) */}
          <div className="col-span-7 h-full flex items-center justify-center">
            <AiCore 
              isActive={isVoiceActive || isProcessing} 
              onClick={handleToggleVoice}
            />
          </div>

          {/* Right: Vertical Status Items (Spans 5 cols) */}
          <div className="col-span-5 h-full">
            <StatusList 
              isVoiceActive={isVoiceActive} 
              voiceStatus="Standby"
              networkStatus="Connected"
              batteryLevel={78}
            />
          </div>
        </section>

        {/* 4. MAIN TERMINAL & UNIFIED CONVERSATION HISTORY PANEL (Slightly taller ~12-15%, Internal Scrolling) */}
        <section className="w-full shrink-0 my-1 sm:my-1.5">
          <TerminalLog logs={logs} isProcessing={isProcessing} />
        </section>

        {/* 5. CHAT INPUT ROW */}
        <section className="w-full shrink-0 my-1">
          <CommandInput onSendCommand={handleSendCommand} disabled={isProcessing} />
        </section>

        {/* 6. BOTTOM CONTROLS (Web Search, Big Red MIC, App Control) */}
        <footer className="w-full shrink-0 pt-0.5 pb-1">
          <BottomControls
            isListening={isVoiceActive}
            onToggleMic={handleToggleVoice}
            onOpenWebSearch={() => setIsWebSearchOpen(true)}
            onOpenAppControl={() => setIsAppControlOpen(true)}
          />
        </footer>
      </main>

      {/* Modals & Overlays */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onResetTerminal={() => setLogs(INITIAL_LOGS)}
      />

      <WebSearchModal
        isOpen={isWebSearchOpen}
        onClose={() => setIsWebSearchOpen(false)}
        onSearchSubmit={handleWebSearch}
      />

      <AppControlModal
        isOpen={isAppControlOpen}
        onClose={() => setIsAppControlOpen(false)}
        onTriggerAction={handleAppAction}
      />
    </div>
  );
}
