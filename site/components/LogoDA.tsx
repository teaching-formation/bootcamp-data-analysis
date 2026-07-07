export default function LogoDA({ width = 280, height = 60 }: { width?: number; height?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 60" width={width} height={height}>
      <defs>
        <linearGradient id="daGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fb923c" }} />
          <stop offset="100%" style={{ stopColor: "#38bdf8" }} />
        </linearGradient>
        <linearGradient id="daGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#7dd3fc" }} />
          <stop offset="100%" style={{ stopColor: "#38bdf8" }} />
        </linearGradient>
        <linearGradient id="daGradText" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--logo-text-a, #ffffff)" }} />
          <stop offset="100%" style={{ stopColor: "var(--logo-text-b, #e0f2fe)" }} />
        </linearGradient>
        <filter id="daGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Analytics icon */}
      <g transform="translate(8, 8)" filter="url(#daGlow)">
        {/* Scatter data points */}
        <circle cx="6"  cy="34" r="3" fill="url(#daGradIcon)" opacity="0.85" />
        <circle cx="20" cy="26" r="3" fill="url(#daGradMain)" opacity="0.85" />
        <circle cx="36" cy="18" r="3" fill="url(#daGradIcon)" opacity="0.85" />
        <circle cx="50" cy="10" r="3" fill="url(#daGradMain)" opacity="0.85" />
        <circle cx="14" cy="32" r="2" fill="url(#daGradMain)" opacity="0.5" />
        <circle cx="28" cy="22" r="2" fill="url(#daGradIcon)" opacity="0.5" />
        <circle cx="44" cy="14" r="2" fill="url(#daGradMain)" opacity="0.5" />

        {/* Trend line */}
        <path
          d="M 6 34 L 50 10"
          stroke="url(#daGradMain)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
          strokeDasharray="none"
        />

        {/* Arrow at end of trend */}
        <path
          d="M 50 10 L 58 8 L 54 16 Z"
          fill="url(#daGradMain)"
          opacity="0.9"
        />

        {/* X / Y axes */}
        <line x1="0" y1="40" x2="62" y2="40" stroke="url(#daGradIcon)" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
        <line x1="0" y1="40" x2="0"  y2="4"  stroke="url(#daGradIcon)" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />

        {/* Bar chart (mini, behind scatter) */}
        <rect x="4"  y="28" width="6" height="12" rx="1" fill="url(#daGradIcon)" opacity="0.35" />
        <rect x="17" y="20" width="6" height="20" rx="1" fill="url(#daGradMain)" opacity="0.35" />
        <rect x="33" y="12" width="6" height="28" rx="1" fill="url(#daGradIcon)" opacity="0.35" />
        <rect x="48" y="4"  width="6" height="36" rx="1" fill="url(#daGradMain)" opacity="0.35" />
      </g>

      {/* Text: Data Analyst */}
      <text
        x="84"
        y="32"
        fontFamily="Inter, SF Pro Display, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="url(#daGradText)"
      >
        Data Analyst
      </text>

      {/* Text: BOOTCAMP */}
      <text
        x="84"
        y="50"
        fontFamily="Inter, SF Pro Display, -apple-system, sans-serif"
        fontSize="13"
        fontWeight="600"
        fill="var(--logo-sub, rgba(255,255,255,0.75))"
        letterSpacing="0.1em"
      >
        BOOTCAMP
      </text>
    </svg>
  );
}
