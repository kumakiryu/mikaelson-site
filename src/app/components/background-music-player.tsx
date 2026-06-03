import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BackgroundMusicPlayerProps {
  title?: string;
  artist?: string;
  audioUrl?: string;
}

export interface BackgroundMusicPlayerRef {
  pause: () => void;
  play: () => void;
}

export const BackgroundMusicPlayer = forwardRef<BackgroundMusicPlayerRef, BackgroundMusicPlayerProps>(({
  title = 'We The Best',
  artist = 'EXB',
  audioUrl = 'https://kumakiryu.github.io/musics-formikaelson/assets/bgmusic.mp3',
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-play music on mount
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const playAudio = () => {
        audioRef.current?.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Auto-play prevented by browser:', error);
          });
      };

      // Small delay to ensure audio element is ready
      const timer = setTimeout(playAudio, 500);

      return () => clearTimeout(timer);
    }
  }, [audioUrl]);

  // Expose pause and play methods to parent
  useImperativeHandle(ref, () => ({
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    },
    play: () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Playback failed:', error);
          setIsPlaying(false);
        });
      }
    },
  }));

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Playback failed:', error);
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  if (!audioUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6"
      style={{ zIndex: 50 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className="rounded-2xl overflow-hidden transition-all"
        style={{
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Compact View */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {isPlaying ? (
              <Pause size={16} style={{ color: '#FFFFFF' }} fill="#FFFFFF" />
            ) : (
              <Play size={16} style={{ color: '#FFFFFF' }} fill="#FFFFFF" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <Music size={16} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            <div className="min-w-0" style={{ width: isExpanded ? '200px' : '0px', transition: 'width 0.3s' }}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p
                      className="truncate"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.875rem',
                        color: '#FFFFFF',
                        fontWeight: '500',
                      }}
                    >
                      {title}
                    </p>
                    <p
                      className="truncate"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      {artist}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2"
              >
                <button onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX size={16} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  ) : (
                    <Volume2 size={16} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{
                    width: '80px',
                    height: '3px',
                    borderRadius: '2px',
                    background: `linear-gradient(to right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) ${volume * 100}%, rgba(255, 255, 255, 0.2) ${volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        onEnded={() => setIsPlaying(false)}
      >
        <source src={audioUrl} type="audio/mpeg" />
        <source src={audioUrl} type="audio/mp3" />
      </audio>
    </motion.div>
  );
});
