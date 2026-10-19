function PearlIllustration({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Upper shell (open) */}
      <path d="M30 120 C38 72 96 44 148 54 C184 61 206 90 210 120" />
      <path d="M58 108 C72 82 108 68 146 74" opacity="0.5" />
      <path d="M86 98 C100 86 120 82 140 86" opacity="0.5" />

      {/* Lower shell */}
      <path d="M30 120 C60 172 180 172 210 120 C170 138 70 138 30 120 Z" />
      <path
        d="M120 162 V142 M92 159 L84 138 M148 159 L156 138 M66 149 L54 130 M174 149 L186 130"
        opacity="0.5"
      />

      {/* Pearl */}
      <circle cx="120" cy="122" r="15" fill="currentColor" fillOpacity="0.25" />
      <circle cx="114" cy="116" r="3.5" fill="currentColor" stroke="none" />

      {/* Magnifying glass */}
      <circle cx="120" cy="122" r="32" fill="currentColor" fillOpacity="0.06" />
      <path d="M143 145 L178 180" strokeWidth="7" />

      {/* Sparkles */}
      <path
        d="M168 70 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M70 52 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z"
        fill="currentColor"
        stroke="none"
      />

      {/* Bubbles */}
      <circle cx="200" cy="50" r="4" opacity="0.5" />
      <circle cx="212" cy="34" r="2.5" opacity="0.5" />
    </svg>
  )
}

export default PearlIllustration