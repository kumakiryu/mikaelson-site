import { motion } from 'motion/react';
import { Avatar } from './ui/avatar';

interface ProfileHeaderProps {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
}

const statusColors = {
  online: '#43B581',
  idle: '#FAA61A',
  dnd: '#F04747',
  offline: '#747F8D',
};

const statusLabels = {
  online: 'Currently active on Discord',
  idle: 'Away from Discord',
  dnd: 'Do not disturb',
  offline: 'Offline',
};

export function ProfileHeader({ username, displayName, bio, avatarUrl, status }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #F8F5F0 0%, #E7DDD1 50%, #F8F5F0 100%)',
      }}
    >
      {/* Floating blur shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: '#8A9474' }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: '#C4A46A' }}
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Avatar with status */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative inline-block mb-8"
        >
          <div className="relative p-2 rounded-full bg-white/40 backdrop-blur-md shadow-2xl">
            <img
              src={avatarUrl}
              alt={username}
              className="w-40 h-40 rounded-full border-4 border-white/60"
            />
            {/* Status indicator */}
            <motion.div
              className="absolute bottom-4 right-4 w-8 h-8 rounded-full border-4 border-white"
              style={{ backgroundColor: statusColors[status] }}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${statusColors[status]}40`,
                  `0 0 0 10px ${statusColors[status]}00`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </div>
        </motion.div>

        {/* Username */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '4rem',
            fontWeight: 600,
            color: '#242424',
            letterSpacing: '-0.02em',
          }}
        >
          {displayName}
        </motion.h1>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-6"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.125rem',
            fontWeight: 300,
            color: '#8A9474',
            letterSpacing: '0.05em',
          }}
        >
          {bio}
        </motion.p>

        {/* Status label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusColors[status] }}
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#242424',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {statusLabels[status]}
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-black/20 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-black/40 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
