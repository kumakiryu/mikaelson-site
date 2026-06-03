import { motion } from 'motion/react';
import { Music, Gamepad2, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { SpotifyProgress } from './spotify-progress';
import { useEffect, useState } from 'react';

interface Activity {
  name: string;
  type: 'game' | 'spotify' | 'custom';
  details?: string;
  state?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
  };
}

interface PresenceCardProps {
  username: string;
  avatarUrl: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  customStatus?: string;
  badges: string[];
}

export function PresenceCard({ username, avatarUrl, status, activities, customStatus, badges }: PresenceCardProps) {
  const [elapsed, setElapsed] = useState(0);
  const [spotifyProgress, setSpotifyProgress] = useState(0);

  const spotifyActivity = activities.find(a => a.type === 'spotify');
  const gameActivity = activities.find(a => a.type === 'game');
  const currentActivity = spotifyActivity || gameActivity || activities[0];

  useEffect(() => {
    if (!currentActivity?.timestamps?.start) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const start = currentActivity.timestamps!.start!;
      const elapsedMs = now - start;
      setElapsed(Math.floor(elapsedMs / 1000));

      if (currentActivity.timestamps?.end) {
        const total = currentActivity.timestamps.end - start;
        const progress = (elapsedMs / total) * 100;
        setSpotifyProgress(Math.min(progress, 100));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentActivity]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto px-6 py-16"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(231,221,209,0.6) 100%)',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        {/* Floating animation */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 20px 60px rgba(196,164,106,0.2)',
              '0 30px 80px rgba(138,148,116,0.3)',
              '0 20px 60px rgba(196,164,106,0.2)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="flex gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={avatarUrl}
              alt={username}
              className="w-24 h-24 rounded-2xl"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Username & Status */}
            <div className="flex items-center gap-3 mb-3">
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#242424',
                }}
              >
                {username}
              </h3>
              <div
                className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-medium"
                style={{
                  backgroundColor: status === 'online' ? '#43B58120' : '#74778D20',
                  color: status === 'online' ? '#43B581' : '#747F8D',
                }}
              >
                {status}
              </div>
            </div>

            {/* Custom Status */}
            {customStatus && (
              <p
                className="mb-4 italic"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  color: '#8A9474',
                }}
              >
                "{customStatus}"
              </p>
            )}

            {/* Current Activity */}
            {currentActivity && (
              <div className="mb-4 p-4 rounded-2xl bg-white/50">
                <div className="flex items-start gap-3">
                  {currentActivity.type === 'spotify' ? (
                    <Music className="w-5 h-5 text-[#1DB954] flex-shrink-0 mt-1" />
                  ) : (
                    <Gamepad2 className="w-5 h-5 text-[#8A9474] flex-shrink-0 mt-1" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: '#C4A46A',
                        fontWeight: 600,
                      }}
                    >
                      {currentActivity.type === 'spotify' ? 'Listening to Spotify' : 'Playing'}
                    </p>
                    <p
                      className="font-semibold mb-1 truncate"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: '#242424',
                      }}
                    >
                      {currentActivity.name}
                    </p>
                    {currentActivity.details && (
                      <p
                        className="text-sm truncate"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: '#8A9474',
                        }}
                      >
                        {currentActivity.details}
                      </p>
                    )}
                    {currentActivity.state && (
                      <p
                        className="text-sm truncate"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: '#8A9474',
                        }}
                      >
                        {currentActivity.state}
                      </p>
                    )}

                    {/* Timer */}
                    {currentActivity.timestamps?.start && (
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-[#C4A46A]" />
                        <span
                          className="text-xs"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: '#C4A46A',
                          }}
                        >
                          {formatTime(elapsed)} elapsed
                        </span>
                      </div>
                    )}

                    {/* Spotify Progress */}
                    {currentActivity.type === 'spotify' && currentActivity.timestamps?.end && (
                      <div className="mt-3">
                        <SpotifyProgress value={spotifyProgress} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: '#C4A46A20',
                      color: '#C4A46A',
                      border: '1px solid #C4A46A40',
                    }}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}