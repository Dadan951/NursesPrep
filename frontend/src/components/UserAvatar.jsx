import { useMemo } from 'react';

// Palette de gradients bleus cohérents avec le thème
const GRADIENTS = [
  ['#2563eb', '#4f46e5'],
  ['#0284c7', '#2563eb'],
  ['#7c3aed', '#4f46e5'],
  ['#0891b2', '#0284c7'],
  ['#1d4ed8', '#7c3aed'],
];

const SIZES = {
  xs:  { outer: 'w-6 h-6',   text: 'text-[10px]', ring: 'ring-1' },
  sm:  { outer: 'w-8 h-8',   text: 'text-xs',     ring: 'ring-2' },
  md:  { outer: 'w-10 h-10', text: 'text-sm',     ring: 'ring-2' },
  lg:  { outer: 'w-16 h-16', text: 'text-xl',     ring: 'ring-2' },
  xl:  { outer: 'w-24 h-24', text: 'text-4xl',    ring: 'ring-4' },
};

export default function UserAvatar({ name, size = 'md', className = '' }) {
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  const gradient = useMemo(() => {
    const code = name ? [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) : 0;
    return GRADIENTS[code % GRADIENTS.length];
  }, [name]);

  const s = SIZES[size] || SIZES.md;

  return (
    <div
      className={`
        ${s.outer} rounded-full flex items-center justify-center
        font-bold text-white flex-shrink-0 select-none
        ring-white ${s.ring} shadow-md
        ${className}
      `}
      style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      aria-label={`Avatar de ${name}`}
    >
      {/* Nurse cross overlay */}
      <span className={`${s.text} font-extrabold tracking-tight leading-none`}>
        {initial}
      </span>
    </div>
  );
}
