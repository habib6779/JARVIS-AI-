# JARVIS AI — Project Rules & Design Constitution

> **CRITICAL**: The existing JARVIS UI in this codebase is the **approved final design**. Its current source code is the **single source of truth**. Future development must extend this exact project rather than recreate it from screenshots or alternative templates.

---

## 1. Visual Identity & Color Palette

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| **Canvas Background** | `#02050c` | Deep space obsidian black |
| **Secondary Background** | `#030712` | Gradient depths and ambient vignette |
| **HUD Panel Surface** | `rgba(4, 18, 36, 0.85)` to `rgba(2, 10, 22, 0.92)` | Translucent gradient with backdrop blur |
| **Electric Cyan (Primary)** | `#00e5ff` | Borders, glowing texts, SVG reactor rings |
| **Soft Cyan Text** | `#38e1ff` / `#e0f2fe` | High-legibility values and terminal lines |
| **Muted Cyan** | `rgba(0, 229, 255, 0.45)` | Subtle hairpins, coordinate grids, borders |
| **Accent Red (Mic)** | `#ff3344` / `#ff2233` | Circular microphone button and pulse glow |
| **Cyan Glow Shadow** | `0 0 14px rgba(0, 229, 255, 0.2)` | Standard HUD panel outer glow |
| **Mic Glow Shadow** | `0 0 25px rgba(255, 51, 68, 0.6)` | Circular microphone button active state |

---

## 2. Typography Rules

Every text element strictly adheres to this hierarchy:

1. **Display & Headings**: `Orbitron`, sans-serif (`font-orbitron`)
   - Used for: `JARVIS` title, modal headers, primary action badges.
   - Letter-spacing: wide tracking (`tracking-[0.22em]`).
2. **Subtitles, Labels & Controls**: `Rajdhani`, sans-serif (`font-rajdhani`)
   - Used for: `AI VOICE ASSISTANT`, CPU/RAM labels, status titles, button labels.
   - Weights: 500, 600, 700.
3. **Data Telemetry & Terminal**: `Share Tech Mono`, monospace (`font-tech`)
   - Used for: Terminal logs, system messages, percentages (`18%`, `42%`, `32°C`).
   - Tabular alignment: clean monospace numbers.

---

## 3. Viewport & Layout Architecture

The application is engineered as a **standalone futuristic dashboard** directly integrated with the browser viewport:

- **100dvh Vertical Discipline**: The layout utilizes `h-[100dvh]` to fit cleanly within mobile device viewports without triggering page-level vertical scrollbars.
- **No Device Frames**: Never reintroduce artificial smartphone bezels, rounded phone mockup boundaries, fake camera notches, or simulated Android navigation bars. The app itself is the interface.
- **Desktop Adaptation**: On desktop viewports, the layout is centered with `max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto` to preserve ideal HUD proportions without horizontal stretching.

---

## 4. Component Sizing & Vertical Budget

To ensure zero layout shifts and prevent elements from pushing each other out of the viewport, adhere strictly to these dimensions:

```text
┌────────────────────────────────────────────────────────┐
│ Header (JARVIS + Settings)                 ~36px–40px  │
├────────────────────────────────────────────────────────┤
│ System Telemetry (CPU/RAM, TEMP, TIME)     ~65px–75px  │
├────────────────────────────────────────────────────────┤
│ AI Core & Status Matrix (2-col split)     ~135px–175px │
├────────────────────────────────────────────────────────┤
│ Unified Terminal / Conversation History   ~110px–140px │
├────────────────────────────────────────────────────────┤
│ Chat Command Bar (Input + SEND)            ~40px–44px  │
├────────────────────────────────────────────────────────┤
│ Bottom Controls (Web, MIC, App Control)    ~68px–75px  │
└────────────────────────────────────────────────────────┘
```

### Component Constraints:

1. **Central AI Core (`AiCore.tsx`)**:
   - Height strictly bounded to `min-h-[135px] max-h-[175px]` (`sm:min-h-[145px] sm:max-h-[190px]`).
   - SVG must use `preserveAspectRatio="xMidYMid meet"` and remain centered.
   - Must never overflow or push the adjacent status list.

2. **Status List (`StatusList.tsx`)**:
   - Exactly matches the top and bottom bounds of `AiCore.tsx`.
   - Circular icons sized to `w-7 h-7 sm:w-8 sm:h-8`.
   - Text labels (`VOICE`, `NETWORK`, `BATTERY`) must never truncate or wrap to two lines.

3. **Unified Terminal & Conversation History (`TerminalLog.tsx`)**:
   - Single unified panel for `SYSTEM:`, `USER:`, and `JARVIS:` messages.
   - Height strictly bounded to `h-[110px] sm:h-[130px] md:h-[140px]`.
   - **Internal scrolling only**: When content exceeds height, only the terminal scrolls internally (`overflow-y-auto`). The dashboard page itself never scrolls.
   - **Zero Blinking Cursor**: Do not display a blinking blue cursor or empty blinking command prompt anywhere in the terminal.

4. **Bottom Controls (`BottomControls.tsx`)**:
   - **Web Search** (left), **Red MIC** (center), and **App Control** (right) must always align horizontally in one row.
   - Central red microphone button remains `w-15 h-15 sm:w-17 sm:h-17` with concentric pulse ring.
   - Must never be clipped by the bottom of the viewport.

---

## 5. Strict Behavioral Rules for Future Development

When extending this codebase, adhere to these non-negotiable rules:

1. **No Extra Confirmation Panels or Cards**:
   - Do NOT add separate Action Dispatch cards, Execution confirmation banners, or expanding alert boxes below the terminal.
   - All interactions must log cleanly inside the existing unified `TerminalLog` panel.

2. **No Preset Button Rows**:
   - Do NOT add rows of suggestion chips or preset command pills that consume vertical viewport space.

3. **No Fabricated Real Executions**:
   - Unless a real, authentic backend or OS bridge is connected, do NOT falsely claim that applications like YouTube were launched or that real device commands executed.

4. **Preserve Modular Architecture**:
   - Keep `InputClassifier` (`src/services/inputClassifier.ts`) modular so an LLM or backend service can be connected without altering UI components.
   - Keep `soundFX` (`src/utils/audio.ts`) procedural using Web Audio API (do not rely on external MP3/WAV links that can break in sandbox environments).

---

## 6. Verification Checklist for Pull Requests

Before committing changes:
- [ ] `npm run lint` passes with 0 errors (`tsc --noEmit`).
- [ ] `npm run build` succeeds without build warnings or missing assets.
- [ ] No page-level vertical scrollbar appears on standard mobile viewports (390x844).
- [ ] The terminal has NO blinking vertical cursor.
- [ ] All three bottom controls are fully visible and aligned in one row.
- [ ] Holographic AI core circular rings and rotating animations remain centered.
