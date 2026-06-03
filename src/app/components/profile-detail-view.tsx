import { ArrowLeft, Music, Gamepad2, Circle, Play, Pause, Volume2, Eye, ExternalLink } from 'lucide-react';
import { useLanyard } from '../hooks/use-lanyard';
import { useEffect, useRef, useState } from 'react';
import { Youtube, Instagram, Github, Twitch, Twitter } from 'lucide-react';
import { FaTiktok, FaDiscord, FaSpotify, FaSteam } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { BioText } from './bio-text';
import { MikaelsonRain } from './mikaelson-rain';
import { ProfileBackgroundEffect, BackgroundEffect } from './profile-background-effect';

interface SocialLink {
  platform: 'tiktok' | 'youtube' | 'instagram' | 'twitter' | 'github' | 'twitch' | 'discord' | 'spotify' | 'steam' | 'kick' | 'custom';
  url: string;
  label?: string;
}

interface ProfileDetailViewProps {
  userId: string;
  name: string;
  displayName?: string;
  bio?: {
    text: string;
    effect?: 'silver-shine' | 'glitch' | 'neon' | 'none';
  };
  customMusic?: {
    title: string;
    artist: string;
    album?: string;
    coverUrl?: string;
    audioUrl?: string;
    startTime?: number;
  };
  customBackground?: {
    url?: string;
    type?: 'image' | 'video';
    effect?: BackgroundEffect;
  };
  socialLinks?: SocialLink[];
  onClose: () => void;
}

export function ProfileDetailView({
  userId,
  name,
  displayName,
  bio,
  customMusic,
  customBackground,
  socialLinks,
  onClose,
}: ProfileDetailViewProps) {
  const { data, loading } = useLanyard(userId);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const isMountedRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isYouTube, setIsYouTube] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Track profile views
  useEffect(() => {
    const viewKey = `profile_views_${userId}`;
    const currentViews = parseInt(localStorage.getItem(viewKey) || '0', 10);
    const newViewCount = currentViews + 1;
    localStorage.setItem(viewKey, newViewCount.toString());
    setViewCount(newViewCount);
  }, [userId]);

  // Check if URL is YouTube
  useEffect(() => {
    if (customMusic?.audioUrl) {
      const isYouTubeUrl = ReactPlayer.canPlay(customMusic.audioUrl) &&
        (customMusic.audioUrl.includes('youtube.com') || customMusic.audioUrl.includes('youtu.be'));
      setIsYouTube(isYouTubeUrl);
      // Reset error state when URL changes
      setAudioError(false);
    }
  }, [customMusic?.audioUrl]);

  // Set initial volume for audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    isMountedRef.current = true;

    // Cleanup: stop music when modal closes
    return () => {
      isMountedRef.current = false;

      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }

      // Wait for play promise to resolve before pausing
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          })
          .catch(() => {
            // Play was already cancelled
          });
      } else if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [customMusic?.audioUrl, audioError, isYouTube]);

  // Update visualization when playing state changes
  useEffect(() => {
    if (isPlaying && analyserRef.current) {
      startAudioVisualization();
    } else if (!isPlaying && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      setGlowIntensity(0.5);
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (audioError || !isMountedRef.current) return;

    if (isYouTube) {
      setIsPlaying(!isPlaying);
    } else if (audioRef.current) {
      const audio = audioRef.current;

      if (isPlaying) {
        // Wait for any pending play promise before pausing
        if (playPromiseRef.current) {
          playPromiseRef.current
            .then(() => {
              audio.pause();
              if (isMountedRef.current) {
                setIsPlaying(false);
              }
              playPromiseRef.current = null;
            })
            .catch(() => {
              if (isMountedRef.current) {
                setIsPlaying(false);
              }
              playPromiseRef.current = null;
            });
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      } else {
        playPromiseRef.current = audio.play();
        playPromiseRef.current
          .then(() => {
            if (isMountedRef.current) {
              setIsPlaying(true);
            }
            playPromiseRef.current = null;
          })
          .catch((error) => {
            if (error.name !== 'AbortError') {
              console.log('Playback failed:', error);
            }
            if (isMountedRef.current) {
              setIsPlaying(false);
            }
            playPromiseRef.current = null;
          });
      }
    }
  };

  const handleAudioError = () => {
    console.log('Audio source error - the audio URL may be invalid or inaccessible');
    setAudioError(true);
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleCanPlay = () => {
    // Auto-play when audio is ready
    if (audioRef.current && customMusic?.audioUrl && !audioError && isMountedRef.current) {
      // Setup audio analyzer for reactive glow
      if (!audioContextRef.current && !isYouTube) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;

          const source = audioContextRef.current.createMediaElementSource(audioRef.current);
          source.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        } catch (error) {
          console.log('Audio analyzer setup failed:', error);
        }
      }

      // Seek to startTime before playing
      if (customMusic.startTime && customMusic.startTime > 0) {
        audioRef.current.currentTime = customMusic.startTime;
      }

      playPromiseRef.current = audioRef.current.play();

      if (playPromiseRef.current !== undefined) {
        playPromiseRef.current
          .then(() => {
            if (isMountedRef.current) {
              setIsPlaying(true);
              startAudioVisualization();
            }
            playPromiseRef.current = null;
          })
          .catch((error) => {
            if (error.name !== 'AbortError') {
              console.log('Audio playback failed:', error);
            }
            if (isMountedRef.current) {
              setIsPlaying(false);
            }
            playPromiseRef.current = null;
          });
      }
    }
  };

  const startAudioVisualization = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateGlow = () => {
      if (!analyserRef.current || !isMountedRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average frequency
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      // Map to glow intensity (0.5 to 1.5 for more dramatic effect)
      const intensity = 0.5 + (average / 255) * 1.0;

      setGlowIntensity(intensity);

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(updateGlow);
      }
    };

    updateGlow();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (isYouTube && playerRef.current) {
      playerRef.current.seekTo(time, 'seconds');
      setCurrentTime(time);
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleYouTubeProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleYouTubeReady = (player: any) => {
    if (player && player.getDuration) {
      const dur = player.getDuration();
      setDuration(dur);
    }
    if (customMusic?.startTime && customMusic.startTime > 0 && playerRef.current) {
      playerRef.current.seekTo(customMusic.startTime, 'seconds');
      setCurrentTime(customMusic.startTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -20;
    const rotateYValue = ((x - centerX) / centerX) * 20;

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

  const getSocialIcon = (platform: string) => {
    const iconProps = { size: 20, style: { color: '#FFFFFF' } };
    switch (platform) {
      case 'tiktok':
        return <FaTiktok {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'github':
        return <Github {...iconProps} />;
      case 'twitch':
        return <Twitch {...iconProps} />;
      case 'discord':
        return <FaDiscord {...iconProps} />;
      case 'spotify':
        return <FaSpotify {...iconProps} />;
      case 'steam':
        return <FaSteam {...iconProps} />;
      case 'kick':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 2h3.5v7.5L13 2h4.5l-5.5 8L17.5 22H13l-4.5-7.5V22H5V2z"/>
          </svg>
        );
      default:
        return <ExternalLink {...iconProps} />;
    }
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
        return 'Do Not Disturb';
      default:
        return 'Offline';
    }
  };

  const avatarUrl = data
    ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=512`
    : '';

  const spotifyActivity = data?.activities?.find((activity) => activity.name === 'Spotify');
  const gameActivity = data?.activities?.find((activity) => activity.type === 0 && activity.name !== 'Spotify');
  const customStatus = data?.activities?.find((activity) => activity.type === 4);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      {/* Mikaelson Rain Background */}
      <MikaelsonRain />

      {/* Back Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.875rem',
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Profile Card */}
      <div style={{ perspective: '1500px' }}>
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `3px solid rgba(255, 255, 255, ${Math.min(glowIntensity * 0.8, 1)})`,
          padding: '3rem 2.5rem',
          maxWidth: '420px',
          minWidth: '420px',
          width: '100%',
          boxShadow: `
            0 0 ${20 * glowIntensity}px rgba(255, 255, 255, ${0.8 * Math.min(glowIntensity, 1)}),
            0 0 ${40 * glowIntensity}px rgba(255, 255, 255, ${0.6 * Math.min(glowIntensity, 1)}),
            0 0 ${60 * glowIntensity}px rgba(255, 255, 255, ${0.4 * Math.min(glowIntensity, 1)}),
            0 0 ${80 * glowIntensity}px rgba(255, 255, 255, ${0.3 * Math.min(glowIntensity, 1)}),
            inset 0 0 ${20 * glowIntensity}px rgba(255, 255, 255, ${0.2 * Math.min(glowIntensity, 1)})
          `,
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovering
            ? 'border-color 0.05s ease-out, box-shadow 0.05s ease-out, transform 0.05s ease-out'
            : 'border-color 0.05s ease-out, box-shadow 0.05s ease-out, transform 0.3s ease-out',
        }}
      >
        {/* Custom Background */}
        {(customBackground?.url || customBackground?.effect) && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              overflow: 'hidden',
            }}
          >
            {customBackground.url && (
              customBackground.type === 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.3,
                  }}
                >
                  <source src={customBackground.url} type="video/mp4" />
                  <source src={customBackground.url} type="video/webm" />
                </video>
              ) : (
                <img
                  src={customBackground.url}
                  alt="Background"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.3,
                  }}
                />
              )
            )}
            {customBackground.effect && (
              <ProfileBackgroundEffect effect={customBackground.effect} />
            )}
          </div>
        )}

        {/* Content Overlay */}
        <div className="relative" style={{ zIndex: 1 }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse" />
            <div className="mt-6 w-32 h-6 bg-gray-700 rounded animate-pulse" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatarUrl}
                alt={name}
                className="rounded-full"
                style={{
                  width: '128px',
                  height: '128px',
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                }}
              />
              {/* Status indicator */}
              <div
                className="absolute bottom-2 right-2 rounded-full border-4"
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: data ? getStatusColor(data.discord_status) : '#747F8D',
                  borderColor: 'rgba(20, 20, 20, 0.95)',
                }}
              />
            </div>

            {/* Name */}
            <h2
              className="mt-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#FFFFFF',
              }}
            >
              {displayName || data?.discord_user.username || name}
            </h2>

            {/* Bio */}
            {bio && (
              <div className="mt-4 w-full max-w-sm px-4">
                <BioText text={bio.text} effect={bio.effect} />
              </div>
            )}

            {/* Status */}
            <div
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Circle
                size={8}
                fill={data ? getStatusColor(data.discord_status) : '#747F8D'}
                style={{ color: data ? getStatusColor(data.discord_status) : '#747F8D' }}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {data ? getStatusText(data.discord_status) : 'Loading...'}
              </span>
            </div>


            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="w-full mt-6">
                <div className="flex flex-wrap justify-center gap-3">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-full transition-all"
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            {(spotifyActivity || customMusic || gameActivity || customStatus?.state) && (
              <div className="w-full my-4" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            )}

            {/* Activities — dynamic sizing based on count */}
            {(spotifyActivity || gameActivity || customStatus?.state) && (() => {
              const activeCount = [customStatus?.state, spotifyActivity, gameActivity].filter(Boolean).length;

              // Scale padding and text down as more activities appear
              const py    = activeCount >= 3 ? '0.18rem' : activeCount === 2 ? '0.28rem' : '0.4rem';
              const gap   = activeCount >= 3 ? '0.2rem'  : activeCount === 2 ? '0.3rem'  : '0.5rem';
              const lbl   = activeCount >= 2 ? '0.55rem' : '0.6rem';
              const main  = activeCount >= 2 ? '0.72rem' : '0.78rem';
              const sub   = activeCount >= 2 ? '0.62rem' : '0.68rem';
              const icoSz = activeCount >= 2 ? 11 : 13;

              const chipStyle: React.CSSProperties = {
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: `${py} 0.75rem`,
                borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              };

              return (
                <div className="w-full mb-2" style={{ display: 'flex', flexDirection: 'column', gap }}>
                  {/* Custom status with emoji */}
                  {customStatus?.state && (
                    <div style={chipStyle}>
                      <Circle size={icoSz} fill="rgba(255,255,255,0.4)" style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: lbl, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1px' }}>Status</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: main, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {(customStatus as any)?.emoji?.name && (
                            <span style={{ marginRight: '0.3em' }}>{(customStatus as any).emoji.name}</span>
                          )}
                          {customStatus.state}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Spotify */}
                  {spotifyActivity && (
                    <div style={chipStyle}>
                      <Music size={icoSz} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: lbl, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1px' }}>Spotify</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: main, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {spotifyActivity.details || 'Unknown Track'}
                        </p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: sub, color: 'rgba(255,255,255,0.4)' }}>
                          by {spotifyActivity.state || 'Unknown Artist'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Game */}
                  {gameActivity && (
                    <div style={chipStyle}>
                      <Gamepad2 size={icoSz} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: lbl, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1px' }}>Playing</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: main, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {gameActivity.name}
                        </p>
                        {gameActivity.details && (
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: sub, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {gameActivity.details}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Custom Music */}
            {customMusic && (() => {
              const hasActivity = !!(spotifyActivity || gameActivity || customStatus?.state);
              const coverSize = hasActivity ? '36px' : '48px';
              const playBtnSize = hasActivity ? '32px' : '40px';
              return (
              <div className="w-full">
                <div
                  className="rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: hasActivity ? '0.5rem' : '0.75rem',
                  }}
                >
                  {/* Volume Control - Top Right Corner */}
                  <div className="flex justify-end mb-1.5">
                    <div className="flex items-center gap-2">
                      <Volume2 size={11} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                          width: '44px',
                          height: '2px',
                          borderRadius: '2px',
                          background: `linear-gradient(to right, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) ${volume * 100}%, rgba(255, 255, 255, 0.15) ${volume * 100}%, rgba(255, 255, 255, 0.15) 100%)`,
                          outline: 'none',
                          appearance: 'none',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mb-2">
                    {customMusic.coverUrl && (
                      <img
                        src={customMusic.coverUrl}
                        alt={customMusic.title}
                        className="rounded"
                        style={{
                          width: coverSize,
                          height: coverSize,
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: hasActivity ? '0.8rem' : '0.9rem',
                          color: '#FFFFFF',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {customMusic.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: hasActivity ? '0.7rem' : '0.8rem',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {customMusic.artist}
                      </p>
                      {!hasActivity && customMusic.album && (
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.7rem',
                            color: 'rgba(255, 255, 255, 0.3)',
                            marginTop: '0.25rem',
                          }}
                        >
                          {customMusic.album}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Audio Player Controls */}
                  {customMusic.audioUrl && (
                    <div className="space-y-2">
                      {/* Progress Bar */}
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.7rem',
                            color: 'rgba(255, 255, 255, 0.4)',
                            minWidth: '30px',
                          }}
                        >
                          {formatTime(currentTime)}
                        </span>
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="flex-1"
                          style={{
                            height: '3px',
                            borderRadius: '2px',
                            background: `linear-gradient(to right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                            outline: 'none',
                            appearance: 'none',
                            cursor: 'pointer',
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.7rem',
                            color: 'rgba(255, 255, 255, 0.4)',
                            minWidth: '30px',
                            textAlign: 'right',
                          }}
                        >
                          {formatTime(duration)}
                        </span>
                      </div>

                      {/* Play/Pause Button - Centered */}
                      <div className="flex justify-center">
                        <button
                          onClick={togglePlayPause}
                          className="flex items-center justify-center rounded-full transition-all"
                          style={{
                            width: playBtnSize,
                            height: playBtnSize,
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                          }}
                        >
                          {isPlaying ? <Pause size={hasActivity ? 13 : 16} fill="#FFFFFF" /> : <Play size={hasActivity ? 13 : 16} fill="#FFFFFF" />}
                        </button>
                      </div>

                      {/* Audio Player */}
                      {isYouTube ? (
                        <div style={{ display: 'none' }}>
                          <ReactPlayer
                            ref={playerRef}
                            url={customMusic.audioUrl}
                            playing={isPlaying}
                            volume={volume}
                            onProgress={handleYouTubeProgress}
                            onReady={handleYouTubeReady}
                            onEnded={() => setIsPlaying(false)}
                            onError={handleAudioError}
                            width="0"
                            height="0"
                            progressInterval={1000}
                            config={{
                              youtube: {
                                playerVars: {
                                  autoplay: 1,
                                  controls: 0,
                                  modestbranding: 1,
                                }
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <audio
                            ref={audioRef}
                            crossOrigin="anonymous"
                            preload="auto"
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onCanPlay={handleCanPlay}
                            onEnded={() => setIsPlaying(false)}
                            onError={handleAudioError}
                          >
                            <source src={customMusic.audioUrl} type="audio/mpeg" />
                            <source src={customMusic.audioUrl} type="audio/mp3" />
                            <source src={customMusic.audioUrl} />
                          </audio>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              );
            })()}


            {/* View Count - Below Music Player */}
            <div
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Eye size={14} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {viewCount.toLocaleString()} {viewCount === 1 ? 'view' : 'views'}
              </span>
            </div>
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  );
}
