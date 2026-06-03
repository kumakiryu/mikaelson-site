import { motion } from 'motion/react';

interface SpotifyProgressProps {
  value: number;
}

export function SpotifyProgress({ value }: SpotifyProgressProps) {
  return (
    <div className="relative w-full h-1 rounded-full overflow-hidden bg-[#C4A46A]/20">
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{
          width: `${value}%`,
          background: 'linear-gradient(90deg, #C4A46A 0%, #8A9474 100%)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            boxShadow: [
              '0 0 10px rgba(196,164,106,0.5)',
              '0 0 20px rgba(196,164,106,0.8)',
              '0 0 10px rgba(196,164,106,0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
