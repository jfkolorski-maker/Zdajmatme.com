/** Line illustrations for the four teaching stages (stroke 2, rounded) – no stock photos, no fake footage. */
const A = "#FFA550";
const W = "rgba(255,255,255,0.85)";
const D = "rgba(255,255,255,0.22)";

export function StepArt({ step }: { step: number }) {
  const c = { fill: "none", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
      {step === 0 && (
        // tempo / level fitted to the student: three sliders
        <g {...c}>
          {[50, 100, 150].map((y, i) => (
            <g key={y}>
              <path d={`M40 ${y}h160`} stroke={D} />
              <path d={`M40 ${y}h${[110, 60, 140][i]}`} stroke={i === 1 ? A : W} strokeWidth={3.5} />
              <circle cx={40 + [110, 60, 140][i]} cy={y} r="9" fill="#1a1a1a" stroke={i === 1 ? A : W} strokeWidth={3} />
            </g>
          ))}
        </g>
      )}
      {step === 1 && (
        // homework + constant contact
        <g {...c}>
          <rect x="36" y="40" width="104" height="132" rx="10" stroke={W} />
          {[70, 96, 122].map((y) => (
            <path key={y} d={`M54 ${y}h68`} stroke={D} />
          ))}
          <text x="60" y="104" fill={A} fontSize="22" fontStyle="italic" fontFamily="Georgia, serif" stroke="none">x² = 9</text>
          <path d="M150 64h60a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10h-32l-16 14v-14h-12a10 10 0 0 1-10-10V74a10 10 0 0 1 10-10z" stroke={A} />
          <text x="180" y="99" textAnchor="middle" fill={W} fontSize="24" fontWeight="700" stroke="none">?</text>
        </g>
      )}
      {step === 2 && (
        // report for parents
        <g {...c}>
          <rect x="58" y="24" width="124" height="156" rx="12" stroke={W} />
          <path d="M98 24v-8h44v8" stroke={W} />
          <path d="M78 140l26-26 20 14 38-42" stroke={A} strokeWidth={3.5} />
          {[60, 76].map((y) => (
            <path key={y} d={`M78 ${y}h84`} stroke={D} />
          ))}
          <circle cx="162" cy="86" r="5" fill={A} stroke="none" />
        </g>
      )}
      {step === 3 && (
        // success and confidence
        <g {...c}>
          <circle cx="120" cy="96" r="62" stroke={D} />
          <circle cx="120" cy="96" r="46" stroke={W} />
          <path d="M96 98l17 17 32-36" stroke={A} strokeWidth={4.5} />
          <path d="M120 18v10M198 96h-10M52 96H42M175 41l-7 7M65 41l7 7" stroke={A} />
        </g>
      )}
    </svg>
  );
}
