# JARVIS AI — Futuristic HUD Voice Assistant UI

A high-fidelity recreation and production-ready implementation of the iconic **JARVIS AI Voice Assistant** sci-fi holographic HUD interface. Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**, this application features neon-cyan telemetry panels, an SVG holographic arc-reactor core, an authentic Web Audio API sci-fi synthesizer, and a unified conversation and terminal log.

---

## 🌟 Key Features & Interface Modules

1. **Official Gemini Flash AI Brain & Streaming Engine**
   - **Server-Side Integration**: Powered by `@google/genai` TypeScript SDK on Express backend (`server.ts`).
   - **Verified High-Speed Flash Models**: Uses `gemini-3.1-flash-lite` (with resilient fallback across `gemini-flash-lite-latest` and `gemini-3.8-flash`) with automatic backoff for 503 spikes.
   - **Multilingual Support**: Fluently processes and generates Bengali (বাংলা), English, and other supported languages.
   - **Advanced Capabilities**: Resolves complex mathematical equations, generates clean code snippets (TypeScript, Python, etc.), and answers general knowledge questions.
   - **Conversation Memory**: Preserves context from the last 10 messages.
   - **Real-Time Streaming**: Low-latency Server-Sent Events (SSE) streaming delivering instant responses directly into the HUD terminal log.
   - **Safe & Secure**: API keys remain strictly server-side in environment secrets; never exposed to browser bundles.

2. **Top Header**
   - Electric-cyan glowing accent pill bar.
   - Dual-tier typography: `JARVIS` (`Orbitron` display) & `AI VOICE ASSISTANT` (`Rajdhani`).
   - Glowing HUD Settings gear button opening a configuration modal.

3. **System Telemetry Bar**
   - **CPU & RAM Panel**: Dual live progress bars with tabular telemetry percentages.
   - **Temperature Panel**: Thermometer icon, bold readout (`32°C`), and horizontal HUD track with position node.
   - **Time Panel**: System clock icon, synchronized time display (`09:41`), and horizontal HUD track.

4. **Central Holographic AI Core & Status Matrix**
   - **Holographic Arc-Reactor Core (`AiCore.tsx`)**: Concentric coordinate rings, rotating segmented outer ring, counter-rotating reactor arc bands, central white flare nucleus, radar sweep, and HUD corner brackets.
   - **Subsystem Status (`StatusList.tsx`)**: Aligned status indicators for `VOICE` (`Standby` / `Listening...`), `NETWORK` (`Connected`), and `BATTERY` (`78%`).

5. **Unified Terminal & Conversation History (`TerminalLog.tsx`)**
   - Single unified panel for system telemetry, user commands, and streaming JARVIS replies.
   - Clear visual differentiation:
     - `SYSTEM:` in cyan label with cyan system telemetry text.
     - `USER:` in bright cyan label with crisp white text.
     - `JARVIS:` in glowing electric cyan label with live-streamed reply text.
   - Internal vertical scrolling only (`overflow-y-auto`), zero blinking text cursor.

6. **Chat Command Bar (`CommandInput.tsx`)**
   - Single-row input with glowing focus state and `➤ SEND` button.
   - Integrated keyboard shortcut (`Enter` to submit) and disabled state during processing.

7. **Tactile Bottom Controls (`BottomControls.tsx`)**
   - **Web Search**: Interactive HUD query protocol modal with preset inquiries.
   - **Central Red MIC Button**: Prominent circular glowing red button with animated pulse ring, toggling voice listening state and triggering authentic audio feedback.
   - **App Control**: Grid icon opening subsystem launcher (Diagnostics, Defense, Power, Comms).

8. **Synthesizer Audio Feedback (`audio.ts`)**
   - Lightweight, zero-dependency procedural audio engine using the native browser **Web Audio API**. Generates sci-fi button blips, frequency sweeps, and mic activation chimes with a master mute toggle in Settings.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Server**: [Express 4](https://expressjs.com/) with native ESM & Server-Sent Events (SSE)
- **AI Engine**: Official [@google/genai](https://github.com/googleapis/genai-js) TypeScript SDK
- **Build Tool**: [Vite 8](https://vitejs.dev/) & [TSX](https://github.com/privatenumber/tsx)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Native Browser [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **GEMINI_API_KEY**: Injected via Secrets / environment variable

### Installation

```bash
git clone <repository-url>
cd jarvis-ai-assistant
npm install
```

### Running Locally (Development)

Start the full-stack server (Express + Vite dev middleware) on port 3000:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

### Automated Verification Test Suite

Run the full verification suite testing multilingual responses (Bengali & English), mathematics, coding capabilities, empty message validation, and live SSE streaming:

```bash
npm test
```

### Type Checking & Linting

```bash
npm run lint
```

### Building for Production

Compile the production bundle into the `dist/` directory:

```bash
npm run build
```

Start the production server:

```bash
npm start
```
