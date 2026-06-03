interface DisplayNameTextProps {
  text: string;
  effect?: 'shimmer' | 'glow' | 'rainbow' | 'neon-pulse' | 'glitch' | 'none';
}

export function DisplayNameText({ text, effect = 'none' }: DisplayNameTextProps) {
  if (effect === 'shimmer') {
    return <h3 className="display-name-shimmer">{text}</h3>;
  }

  if (effect === 'glow') {
    return <h3 className="display-name-glow">{text}</h3>;
  }

  if (effect === 'rainbow') {
    return <h3 className="display-name-rainbow">{text}</h3>;
  }

  if (effect === 'neon-pulse') {
    return <h3 className="display-name-neon-pulse">{text}</h3>;
  }

  if (effect === 'glitch') {
    return (
      <h3 className="display-name-glitch" data-text={text}>
        {text}
      </h3>
    );
  }

  // Default - no effect
  return (
    <h3
      className="mt-4"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.125rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        color: '#FFFFFF',
      }}
    >
      {text}
    </h3>
  );
}
