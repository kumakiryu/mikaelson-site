import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import splashImage from '../../imports/mikaelson4.png';

interface SplashScreenProps {
  onEnter: () => void;
  backgroundImageUrl?: string;
  isExiting?: boolean;
}

export function SplashScreen({ onEnter, backgroundImageUrl, isExiting = false }: SplashScreenProps) {
  const backgroundImage = backgroundImageUrl || splashImage;

  return (
    <motion.div
      initial={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      animate={{
        scale: isExiting ? 1.1 : 1,
        opacity: isExiting ? 0 : 1,
        filter: isExiting ? 'blur(10px)' : 'blur(0px)'
      }}
      transition={{
        duration: 1.0,
        ease: [0.33, 1, 0.68, 1]
      }}
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        zIndex: 200,
        pointerEvents: isExiting ? 'none' : 'auto',
      }}
      onClick={onEnter}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="splash-title-electric"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            color: '#FFFFFF',
            marginBottom: '2rem',
            letterSpacing: '0.1em',
          }}
        >
          MIKAELSON
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: "'Cormorant Garamond', sans-serif",
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.7)',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            marginBottom: '4rem',
          }}
        >

        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className="px-8 py-3 rounded-full transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1rem',
                color: '#FFFFFF',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Click to Enter
            </span>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown size={32} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Animated particles hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-8"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.1em',
        }}
      >
        CLICK ANYWHERE
      </motion.div>
    </motion.div>
  );
}
