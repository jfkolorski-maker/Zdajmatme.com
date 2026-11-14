/** Line illustrations for the 5 stages (no stock photos, no fake footage). Stroke 2, rounded. */
const Y = "#FFC928";
const W = "rgba(255,255,255,0.85)";
const D = "rgba(255,255,255,0.25)";

export function StepArt({ step }: { step: number }) {
  const common = { fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden>
      {step === 0 && (
        <g {...common}>
          <rect x="26" y="34" width="120" height="70" rx="18" stroke={W} />
          <path d="M56 104l-10 18 28-18" stroke={W} />
          <text x="86" y="80" textAnchor="middle" fill={Y} fontSize="34" fontWeight="700" stroke="none">?</text>
          <rect x="104" y="96" width="112" height="62" rx="18" stroke={Y} />
          <path d="M186 158l12 16-28-16" stroke={Y} />
          <text x="160" y="136" textAnchor="middle" fill={W} fontSize="26" fontStyle="italic" fontFamily="Georgia, serif" stroke="none">x² + 5</text>
        </g>
      )}
      {step === 1 && (
        <g {...common}>
          <circle cx="62" cy="100" r="34" stroke={W} />
          <circle cx="62" cy="88" r="11" stroke={W} />
          <path d="M42 120c6-12 34-12 40 0" stroke={W} />
          <circle cx="178" cy="100" r="34" stroke={Y} />
          <circle cx="178" cy="88" r="11" stroke={Y} />
          <path d="M158 120c6-12 34-12 40 0" stroke={Y} />
          <path d="M104 92h32M128 84l8 8-8 8" stroke={Y} />
          <path d="M136 112h-32M112 104l-8 8 8 8" stroke={W} />
        </g>
      )}
      {step === 2 && (
        <g {...common}>
          <rect x="30" y="30" width="180" height="116" rx="12" stroke={W} />
          <path d="M98 170h44M120 146v24" stroke={W} />
          <path d="M44 120h152M120 40v100" stroke={D} />
          <path d="M66 52c18 96 90 96 108 0" stroke={Y} strokeWidth="3" />
          <circle cx="91" cy="104" r="4.5" fill={Y} stroke="none" />
          <circle cx="149" cy="104" r="4.5" fill={Y} stroke="none" />
          <text x="186" y="64" fill={W} fontSize="15" fontWeight="700" stroke="none">1:1</text>
        </g>
      )}
      {step === 3 && (
        <g {...common}>
          <path d="M34 166h176M34 166V34" stroke={D} />
          <path d="M44 150l38-26 30 12 40-44 44-38" stroke={Y} strokeWidth="3" />
          <circle cx="196" cy="54" r="6" fill={Y} stroke="none" />
          <path d="M196 54V22l22 8-22 8" stroke={W} />
          {[82, 112, 152].map((x, i) => (
            <circle key={x} cx={x} cy={[124, 136, 92][i]} r="4" fill={W} stroke="none" />
          ))}
        </g>
      )}
      {step === 4 && (
        <g {...common}>
          <rect x="60" y="24" width="120" height="152" rx="14" stroke={W} />
          <path d="M96 24v-6h48v6" stroke={W} />
          {[62, 98, 134].map((y) => (
            <g key={y}>
              <path d={`M80 ${y}l7 7 13-14`} stroke={Y} strokeWidth="3" />
              <path d={`M112 ${y + 1}h46`} stroke={D} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
