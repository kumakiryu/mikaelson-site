interface BioTextProps {
  text: string;
  effect?: 'silver-shine' | 'glitch' | 'neon' | 'rainbow' | 'wave' | 'pulse' | 'glow-pulse' | 'none';
}

export function BioText({ text, effect = 'none' }: BioTextProps) {
  if (effect === 'glitch') {
    return (
      <div className="glitch-container">
        <div className="glitch" data-text={text}>
          {text}
        </div>
      </div>
    );
  }

  if (effect === 'neon') {
    return (
      <div className="neon-container">
        <div className="neon-text">{text}</div>
      </div>
    );
  }

  if (effect === 'silver-shine') {
    return (
      <div className="silver-shine-container">
        <div className="silver-shine-text">{text}</div>
      </div>
    );
  }

  if (effect === 'rainbow') {
    return (
      <div className="rainbow-container">
        <div className="rainbow-text">{text}</div>
      </div>
    );
  }

  if (effect === 'wave') {
    return (
      <div className="wave-container">
        <div className="wave-text">
          {text.split('').map((char, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (effect === 'pulse') {
    return (
      <div className="pulse-container">
        <div className="pulse-text">{text}</div>
      </div>
    );
  }

  if (effect === 'glow-pulse') {
    return (
      <div className="glow-pulse-container">
        <div className="glow-pulse-text">{text}</div>
      </div>
    );
  }

  // Default - no effect
  return (
    <p
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        lineHeight: '1.5',
      }}
    >
      {text}
    </p>
  );
}
