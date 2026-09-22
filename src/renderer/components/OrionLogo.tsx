import React from 'react';

interface OrionLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  glow?: boolean;
  variant?: 'emblem' | 'full' | 'horizontal';
}

export const OrionLogo: React.FC<OrionLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  showTagline = false,
  animated = true,
  glow = true,
  variant = 'emblem'
}) => {
  const pixelSize = typeof size === 'number' ? size : 40;

  // Vector SVG rendering of the official ORION planetary ring torus & celestial star
  const renderEmblem = () => (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? 'transition-transform duration-500 hover:scale-105' : ''}`}
        style={{
          filter: glow
            ? 'drop-shadow(0 0 16px rgba(59, 130, 246, 0.65)) drop-shadow(0 0 32px rgba(139, 92, 246, 0.45))'
            : 'none'
        }}
      >
        <defs>
          {/* Main Planetary Torus Gradient: Electric Cyan -> Orion Blue -> Violet */}
          <linearGradient id="orionPlanetGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="35%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Diagonal Orbital Ring Gradient */}
          <linearGradient id="orionRingGrad" x1="10" y1="140" x2="190" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="85%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Star Flare Glow */}
          <radialGradient id="starFlare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#BAE6FD" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>

          {/* Inner Shadow / Depth */}
          <filter id="innerDepth" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadow" />
            <feFlood floodColor="#0B0F1A" floodOpacity="0.7" />
            <feComposite in2="shadow" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Back segment of Orbital Ring (passes behind the planet) */}
        <path
          d="M 28 126 C 22 136 32 144 54 138 C 96 126 142 98 174 62"
          stroke="url(#orionRingGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Planetary Torus Body "O" */}
        <circle
          cx="100"
          cy="100"
          r="62"
          stroke="url(#orionPlanetGrad)"
          strokeWidth="28"
          fill="none"
          filter="url(#innerDepth)"
        />

        {/* Gloss Specular Highlight on Torus Top Arc */}
        <path
          d="M 60 66 A 62 62 0 0 1 140 66"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Front segment of Orbital Ring (crosses over the front face of the planet) */}
        <path
          d="M 22 136 C 40 152 74 150 114 132 C 152 114 180 84 186 64 C 188 56 182 50 172 54"
          stroke="url(#orionRingGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Specular White Rim Light on the Ring */}
        <path
          d="M 80 144 C 120 128 156 98 174 68"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* 4-Point Celestial Star Flare at Top-Right Intersection (x: 154, y: 44) */}
        <g transform="translate(154, 44)">
          {/* Radial Glow Halo */}
          <circle cx="0" cy="0" r="24" fill="url(#starFlare)" opacity="0.85" />
          
          {/* Vertical Spike */}
          <path
            d="M 0 -22 Q 1 -6 6 0 Q 1 6 0 22 Q -1 6 -6 0 Q -1 -6 0 -22 Z"
            fill="#FFFFFF"
            className={animated ? 'animate-pulse' : ''}
          />
          {/* Horizontal Spike */}
          <path
            d="M -22 0 Q -6 -1 0 -6 Q 6 -1 22 0 Q 6 1 0 6 Q -6 1 -22 0 Z"
            fill="#FFFFFF"
            className={animated ? 'animate-pulse' : ''}
          />

          {/* Central Bright Diamond Core */}
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );

  if (variant === 'emblem' && !showText) {
    return renderEmblem();
  }

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {renderEmblem()}
      
      {(showText || variant === 'horizontal' || variant === 'full') && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span
              className="font-extrabold tracking-[0.25em] text-white font-sans uppercase drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              style={{ fontSize: typeof size === 'number' ? Math.max(14, size * 0.45) : '18px' }}
            >
              ORION
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">
              COMMAND • ASSIST • CREATE
            </span>
          )}
        </div>
      )}
    </div>
  );
};
