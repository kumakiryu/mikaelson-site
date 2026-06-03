import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ArchiveFloatButtonProps {
  logoUrl?: string;
}

export function ArchiveFloatButton({ logoUrl }: ArchiveFloatButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isArchive = location.pathname === '/archive';
  if (isArchive) return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      onClick={() => navigate('/archive')}
      className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-1 group"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      aria-label="Archive"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
            filter: 'blur(6px)',
          }}
        />
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Archive"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.6)) drop-shadow(0 0 28px rgba(255,255,255,0.3))',
              display: 'block',
              position: 'relative',
              zIndex: 1,
            }}
          />
        ) : (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.8rem',
                color: '#fff',
                letterSpacing: '0.05em',
              }}
            >
              M
            </span>
          </div>
        )}
      </motion.div>
      {/* Tooltip label */}
      <span
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}
      >
        Archive
      </span>
    </motion.button>
  );
}
