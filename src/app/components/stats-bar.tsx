import { useEffect, useState } from 'react';
import { Clock, Users, Eye } from 'lucide-react';

interface StatsBarProps {
  memberCount: number;
}

export function StatsBar({ memberCount }: StatsBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load and increment viewer count
    const viewKey = 'homepage_viewers';
    const currentViewers = parseInt(localStorage.getItem(viewKey) || '0', 10);
    const newViewerCount = currentViewers + 1;
    localStorage.setItem(viewKey, newViewerCount.toString());
    setViewerCount(newViewerCount);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const hoursStr = hours.toString().padStart(2, '0');

    return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div
      className="w-full px-6 py-4"
      style={{
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-6">
        {/* Time - Left */}
        <div className="flex items-center gap-3 justify-self-start">
          <Clock size={20} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.25rem',
                color: '#FFFFFF',
                fontWeight: '600',
                letterSpacing: '0.05em',
              }}
            >
              {formatTime(currentTime)}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '2px',
              }}
            >
              {formatDate(currentTime)}
            </p>
          </div>
        </div>

        {/* Title - Center */}
        <div className="justify-self-center">
          <h1
            className="splash-title-shimmer"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              letterSpacing: '0.15em',
            }}
          >
            MIKAELSON
          </h1>
        </div>

        {/* Stats - Right */}
        <div className="flex items-center gap-8 justify-self-end">
          {/* Viewers */}
          <div className="flex items-center gap-2">
            <Eye size={18} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}
              >
                {viewerCount.toLocaleString()}
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Viewers
              </p>
            </div>
          </div>

          {/* Members */}
          <div className="flex items-center gap-2">
            <Users size={18} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}
              >
                {memberCount}
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Members
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
