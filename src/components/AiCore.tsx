import React from 'react';

interface AiCoreProps {
  isActive?: boolean;
  onClick?: () => void;
}

export const AiCore: React.FC<AiCoreProps> = ({ isActive = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative w-full h-full min-h-[135px] max-h-[175px] sm:min-h-[145px] sm:max-h-[190px] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 cursor-pointer transition-all duration-300 hud-border ${
        isActive ? 'hud-border-bright ring-1 ring-cyan-400/50' : ''
      } flex items-center justify-center overflow-hidden group select-none`}
      title="JARVIS Holographic AI Core"
    >
      {/* HUD Corner Tech Brackets */}
      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/70 pointer-events-none" />

      {/* Side HUD arc accents */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-8 border-r-2 border-cyan-400/40 rounded-r-sm pointer-events-none" />
      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 border-l-2 border-cyan-400/40 rounded-l-sm pointer-events-none" />

      {/* Central SVG Hologram */}
      <div className="relative w-full h-full flex items-center justify-center max-w-[165px] max-h-[165px] sm:max-w-[180px] sm:max-h-[180px]">
        <svg 
          viewBox="0 0 240 240" 
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full select-none"
        >
          <defs>
            {/* Core Lens Flare Glow */}
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#001a33" stopOpacity="0" />
            </radialGradient>

            {/* Glow Filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid & Coordinate Lines */}
          <g opacity="0.25" stroke="#00e5ff" strokeWidth="0.75">
            {/* Concentric Coordinate Rings */}
            <circle cx="120" cy="120" r="105" fill="none" strokeDasharray="3 4" />
            <circle cx="120" cy="120" r="92" fill="none" />
            <circle cx="120" cy="120" r="76" fill="none" strokeDasharray="2 3" />
            <circle cx="120" cy="120" r="58" fill="none" />
            <circle cx="120" cy="120" r="42" fill="none" />
            
            {/* Radial Coordinate Lines */}
            <line x1="15" y1="120" x2="225" y2="120" />
            <line x1="120" y1="15" x2="120" y2="225" />
            <line x1="45" y1="45" x2="195" y2="195" strokeDasharray="2 4" />
            <line x1="195" y1="45" x2="45" y2="195" strokeDasharray="2 4" />
            
            {/* Minor angle rays */}
            <line x1="28" y1="80" x2="212" y2="160" strokeDasharray="1 5" />
            <line x1="28" y1="160" x2="212" y2="80" strokeDasharray="1 5" />
            <line x1="80" y1="28" x2="160" y2="212" strokeDasharray="1 5" />
            <line x1="160" y1="28" x2="80" y2="212" strokeDasharray="1 5" />
          </g>

          {/* Outer Segmented Ring - Rotating Clockwise */}
          <g 
            className={isActive ? "animate-spin-fast" : "animate-spin-slow"} 
            style={{ transformOrigin: '120px 120px' }}
          >
            <circle 
              cx="120" 
              cy="120" 
              r="92" 
              fill="none" 
              stroke="#00e5ff" 
              strokeWidth="1.5" 
              strokeDasharray="16 12 8 12" 
              opacity="0.6"
            />
            {/* Notched ticks on perimeter */}
            <circle 
              cx="120" 
              cy="120" 
              r="98" 
              fill="none" 
              stroke="#38bdf8" 
              strokeWidth="2.5" 
              strokeDasharray="2 18" 
              opacity="0.5"
            />
          </g>

          {/* Heavy Segmented Reactor Arc Ring - Rotating Counter-Clockwise */}
          <g 
            className={isActive ? "animate-spin-fast" : "animate-spin-reverse"} 
            style={{ transformOrigin: '120px 120px' }}
          >
            <circle 
              cx="120" 
              cy="120" 
              r="70" 
              fill="none" 
              stroke="#00e5ff" 
              strokeWidth="7" 
              strokeDasharray="22 14 38 12 18 16" 
              strokeLinecap="butt"
              opacity="0.85"
              filter="url(#neonGlow)"
            />
            {/* Inner segmented cyan blocks */}
            <circle 
              cx="120" 
              cy="120" 
              r="58" 
              fill="none" 
              stroke="#38e1ff" 
              strokeWidth="3.5" 
              strokeDasharray="10 8 20 12" 
              opacity="0.75"
            />
          </g>

          {/* Inner Sharp Precision Ring */}
          <circle 
            cx="120" 
            cy="120" 
            r="44" 
            fill="none" 
            stroke="#00f0ff" 
            strokeWidth="1.8" 
            opacity="0.9"
            filter="url(#neonGlow)"
          />
          <circle 
            cx="120" 
            cy="120" 
            r="38" 
            fill="none" 
            stroke="#00e5ff" 
            strokeWidth="1" 
            strokeDasharray="4 4" 
            opacity="0.7"
          />

          {/* Central Blue Halo */}
          <circle 
            cx="120" 
            cy="120" 
            r="28" 
            fill="url(#coreGlow)"
            className="animate-pulse-core"
            style={{ transformOrigin: '120px 120px' }}
          />

          {/* Core White Flare Center */}
          <circle 
            cx="120" 
            cy="120" 
            r="6" 
            fill="#ffffff" 
            filter="url(#neonGlow)"
            className={isActive ? "animate-ping" : ""}
            style={{ transformOrigin: '120px 120px' }}
          />

          {/* Crosshair Target Marks */}
          <g stroke="#00f0ff" strokeWidth="1.2" opacity="0.8">
            <line x1="104" y1="120" x2="114" y2="120" />
            <line x1="126" y1="120" x2="136" y2="120" />
            <line x1="120" y1="104" x2="120" y2="114" />
            <line x1="120" y1="126" x2="120" y2="136" />
          </g>
        </svg>

        {/* Ambient Radial Flare Overlay */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isActive ? 'opacity-80' : 'opacity-40'
          }`}
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.25) 0%, rgba(0, 119, 182, 0.1) 40%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
};
