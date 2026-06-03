import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: number;
  fontSize: number;
  twinkleDuration: number;
  twinkleDelay: number;
  driftDuration: number;
  driftDelay: number;
  driftX: number;
  driftY: number;
}

export function MikaelsonRain() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const items: Star[] = [];
    for (let i = 0; i < 25; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: 0.04 + Math.random() * 0.08,
        fontSize: 0.55 + Math.random() * 1.2,
        twinkleDuration: 3 + Math.random() * 4,
        twinkleDelay: Math.random() * 6,
        driftDuration: 20 + Math.random() * 20,
        driftDelay: Math.random() * 10,
        driftX: (Math.random() - 0.5) * 60,
        driftY: (Math.random() - 0.5) * 40,
      });
    }
    setStars(items);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontFamily: "'Playfair Display', serif",
            fontSize: `${star.fontSize}rem`,
            color: '#FFFFFF',
            fontWeight: '700',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: '0 0 12px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.2)',
            animation: `
              mk-twinkle ${star.twinkleDuration}s ease-in-out ${star.twinkleDelay}s infinite,
              mk-drift ${star.driftDuration}s ease-in-out ${star.driftDelay}s infinite alternate
            `,
            '--drift-x': `${star.driftX}px`,
            '--drift-y': `${star.driftY}px`,
            '--base-opacity': star.opacity,
          } as React.CSSProperties}
        >
          MKLSN
        </div>
      ))}

      <style>{`
        @keyframes mk-twinkle {
          0%, 100% { opacity: var(--base-opacity); }
          50%       { opacity: calc(var(--base-opacity) * 3.5); }
        }
        @keyframes mk-drift {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(var(--drift-x), var(--drift-y)); }
        }
      `}</style>
    </div>
  );
}
