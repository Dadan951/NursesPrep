/* ─── Nurses Prép — Logo calligraphie réutilisable ───────────────────────── */
export default function NursesLogo({ size = 'md', light = false }) {
  const sizes = {
    xs: { script: 17, ecg: 10 },
    sm: { script: 22, ecg: 10 },
    md: { script: 28, ecg: 12 },
    lg: { script: 38, ecg: 14 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className="flex flex-col items-start leading-none select-none"
      style={{ fontFamily: "'Dancing Script', cursive" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

      <span
        style={{
          fontSize: s.script,
          fontWeight: 700,
          background: light
            ? 'linear-gradient(135deg,#7dd3fc,#38bdf8,#bae6fd)'
            : 'linear-gradient(135deg,#164e8a,#1d6fba,#0891b2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}
      >
        Nurses Prép
      </span>

      {/* Heartbeat / ECG line */}
      <svg
        viewBox="0 0 120 14"
        style={{ width: s.script * 3.5, height: s.ecg, marginTop: 2 }}
        fill="none"
      >
        <polyline
          points="0,7 20,7 28,2 34,12 40,7 54,7 58,1 63,13 68,7 80,7 84,4 88,10 92,7 120,7"
          stroke={light ? '#38bdf8' : '#0891b2'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
