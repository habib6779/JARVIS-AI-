# JARVIS AI — Futuristic HUD Voice Assistant UI

A high-fidelity recreation and production-ready implementation of the iconic **JARVIS AI Voice Assistant** sci-fi holographic HUD interface. Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**, this application features neon-cyan telemetry panels, an SVG holographic arc-reactor core, an authentic Web Audio API sci-fi synthesizer, and a unified conversation and terminal log.

---

## 🌟 Key Features & Interface Modules

1. **Top Header**
   - Electric-cyan glowing accent pill bar.
   - Dual-tier typography: `JARVIS` (`Orbitron` display) & `AI VOICE ASSISTANT` (`Rajdhani`).
   - Glowing HUD Settings gear button opening a configuration modal.

2. **System Telemetry Bar**
   - **CPU & RAM Panel**: Dual live progress bars with tabular telemetry percentages.
   - **Temperature Panel**: Thermometer icon, bold readout (`32°C`), and horizontal HUD track with position node.
   - **Time Panel**: System clock icon, synchronized time display (`09:41`), and horizontal HUD track.

3. **Central Holographic AI Core & Status Matrix**
   - **Holographic Arc-Reactor Core (`AiCore.tsx`)**: Concentric coordinate rings, rotating segmented outer ring, counter-rotating reactor arc bands, central white flare nucleus, radar sweep, and HUD corner brackets.
   - **Subsystem Status (`StatusList.tsx`)**: Aligned status indicators for `VOICE` (`Standby` / `Listening...`), `NETWORK` (`Connected`), and `BATTERY` (`78%`).

4. **Unified Terminal & Conversation History (`TerminalLog.tsx`)**
   - Single unified panel for system telemetry, user commands, and JARVIS replies.
   - Clear visual differentiation:
     - `SYSTEM:` in cyan label with cyan system telemetry text.
     - `USER:` in bright cyan label with crisp white text.
     - `JARVIS:` in glowing electric cyan label with reply text.
   - Internal vertical scrolling only (`overflow-y-auto`), zero blinking text cursor.

5. **Chat Command Bar (`CommandInput.tsx`)**
   - Single-row input with glowing focus state and `➤ SEND` button.
   - Integrated keyboard shortcut (`Enter` to submit).

6. **Tactile Bottom Controls (`BottomControls.tsx`)**
   - **Web Search**: Interactive HUD query protocol modal with preset inquiries.
   - **Central Red MIC Button**: Prominent circular glowing red button with animated pulse ring, toggling voice listening state and triggering authentic audio feedback.
   - **App Control**: Grid icon opening subsystem launcher (Diagnostics, Defense, Power, Comms).

7. **Synthesizer Audio Feedback (`audio.ts`)**
   - Lightweight, zero-dependency procedural audio engine using the native browser **Web Audio API**. Generates sci-fi button blips, frequency sweeps, and mic activation chimes with a master mute toggle in Settings.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Native Browser [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with Orbitron & Rajdhani Google Fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies and build scripts
├── tsconfig.json                # TypeScript strict configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── PROJECT_RULES.md             # Strict design, layout, and architectural constraints
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow (lint & build)
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Master HUD layout & state coordination
    ├── index.css                # Tailwind base styles, neon glow utilities, animations
    ├── components/
    │   ├── AiCore.tsx           # Holographic SVG AI Core reactor with animations
    │   ├── AppControlModal.tsx  # Subsystems launcher modal
    │   ├── BottomControls.tsx   # Web Search, central red MIC button, App Control
    │   ├── CommandInput.tsx     # Single-row command input and SEND button
    │   ├── SettingsModal.tsx    # System settings (audio toggle, terminal reset)
    │   ├── StatusList.tsx       # Voice, Network, and Battery status items
    │   ├── SystemTelemetry.tsx  # CPU/RAM, TEMP, and TIME telemetry cards
    │   ├── TerminalConsole.tsx  # Backward-compatible wrapper for TerminalLog
    │   ├── TerminalLog.tsx      # Unified terminal log & conversation history
    │   ├── UserInput.tsx        # Modular alias for CommandInput
    │   └── WebSearchModal.tsx   # Web Search inquiry modal
    ├── services/
    │   └── inputClassifier.ts   # Modular input classification service
    ├── types/
    │   └── terminal.ts          # Type definitions for messages, status, and categories
    └── utils/
        └── audio.ts             # Web Audio API synthesizer for sci-fi sound effects
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd jarvis-ai-assistant
npm install
```

### Running Locally (Development)

Start the Vite development server on port 3000:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

### Type Checking & Linting

Run TypeScript validation:

```bash
npm run lint
```

### Building for Production

Compile the production bundle into the `dist/` directory:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🔌 Future Integration Guide

This codebase has been architected with clear boundaries so another developer or AI system can connect real services without altering the visual design:

1. **Connecting a Real AI / LLM Backend**:
   - In `src/App.tsx`, modify `handleSendCommand` to stream or post user messages to your backend (`/api/chat` or Gemini SDK).
   - In `src/services/inputClassifier.ts`, replace the lightweight heuristic classifier with an LLM function calling or intent classification endpoint.
   - Append received AI chunks/responses directly to the `logs` state using `{ source: 'JARVIS', text: response }`.

2. **Connecting Speech Recognition (STT)**:
   - In `src/components/BottomControls.tsx` or `src/App.tsx`, hook the `handleToggleVoice` handler to the browser `webkitSpeechRecognition` or a Live Audio API.
   - Update `voiceStatus` in `StatusList` to reflect real microphone connection states (`Listening`, `Transcribing`, `Standby`).

3. **Connecting IoT or Subsystem Controls**:
   - In `src/components/AppControlModal.tsx`, connect the app buttons (Diagnostics, Defense, Power Grid) to real API endpoints.

---

## 📄 License

Apache-2.0
