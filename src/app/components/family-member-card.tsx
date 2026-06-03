import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useLanyard } from '../hooks/use-lanyard';
import { Music, Gamepad2 } from 'lucide-react';
import { DisplayNameText } from './display-name-text';

interface FamilyMemberCardProps {
  userId: string;
  name: string;
  displayName?: string;
  nameEffect?: 'shimmer' | 'glow' | 'rainbow' | 'neon-pulse' | 'glitch' | 'none';
  onClick?: () => void;
}

export function FamilyMemberCard({ userId, name, displayName, nameEffect = 'none', onClick }: FamilyMemberCardProps) {
  const { data, loading } = useLanyard(userId);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#43B581';
      case 'idle':
        return '#FAA61A';
      case 'dnd':
        return '#F04747';
      default:
        return '#747F8D';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'idle':
        return 'Idle';
      case 'dnd':
        return 'Dnd';
      default:
        return 'Offline';
    }
  };

  if (loading) {
    return (
      <div style={{ perspective: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(30, 30, 30, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            minHeight: '220px',
          }}
        >
          {/* MIKAELSON Badge - Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                color: 'rgba(255, 255, 255, 0.08)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: '700',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.15), 0 0 40px rgba(255, 255, 255, 0.1)',
              }}
            >
              MIKAELSON
            </span>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse" />
            <div className="mt-4 w-24 h-4 bg-gray-700 rounded animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  const avatarUrl = data
    ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`
    : '';

  const spotifyActivity = data?.activities?.find((activity) => activity.name === 'Spotify');
  const gameActivity = data?.activities?.find((activity) => activity.type === 0 && activity.name !== 'Spotify');
  const customStatus = data?.activities?.find((activity) => activity.type === 4);

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '2rem',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovering ? 1.05 : 1})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* MIKAELSON Badge - Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              color: `rgba(255, 255, 255, ${isHovering ? 0.2 : 0.08})`,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: '700',
              textShadow: `0 0 ${isHovering ? 30 : 20}px rgba(255, 255, 255, ${isHovering ? 0.5 : 0.15}), 0 0 ${isHovering ? 60 : 40}px rgba(255, 255, 255, ${isHovering ? 0.3 : 0.1})`,
              transition: 'color 0.3s ease-out, text-shadow 0.3s ease-out',
            }}
          >
            MIKAELSON
          </span>
        </div>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={name}
            className="w-20 h-20 rounded-full"
            style={{
              border: '3px solid rgba(255, 255, 255, 0.1)',
            }}
          />
          {/* Status indicator */}
          <div
            className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4"
            style={{
              backgroundColor: data ? getStatusColor(data.discord_status) : '#747F8D',
              borderColor: 'rgba(30, 30, 30, 0.9)',
            }}
          />
        </div>

        {/* Username */}
        <DisplayNameText
          text={displayName || data?.discord_user.username || name}
          effect={nameEffect}
        />

        {/* Status */}
        <p
          className="mt-1 flex items-center gap-2"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: data ? getStatusColor(data.discord_status) : '#747F8D',
            }}
          />
          {data ? getStatusText(data.discord_status) : 'Loading...'}
        </p>

        {/* Activity chips */}
        <div className="mt-3 w-full space-y-1.5">
          {customStatus?.state && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>{(customStatus as any)?.emoji?.name ?? '·'}</span>
              <p className="truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                {customStatus.state}
              </p>
            </div>
          )}
          {spotifyActivity && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Music size={13} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              <p className="truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {spotifyActivity.details || 'Listening to Spotify'}
              </p>
            </div>
          )}
          {gameActivity && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Gamepad2 size={13} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              <p className="truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {gameActivity.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hover effect gradient - follows mouse */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: isHovering
            ? `radial-gradient(circle at ${((rotateY / 10) * 50 + 50)}% ${((rotateX / -10) * 50 + 50)}%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)`
            : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        }}
      />
      </div>
    </div>
  );
}
