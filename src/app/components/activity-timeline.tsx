import { motion } from 'motion/react';
import { Music, Gamepad2, MessageSquare } from 'lucide-react';

interface TimelineActivity {
  type: 'now-playing' | 'last-active' | 'recent';
  title: string;
  subtitle: string;
  timestamp: string;
  imageUrl?: string;
}

interface ActivityTimelineProps {
  activities: TimelineActivity[];
}

const activityIcons = {
  'now-playing': Music,
  'last-active': Gamepad2,
  'recent': MessageSquare,
};

const activityLabels = {
  'now-playing': 'Now Playing',
  'last-active': 'Last Active',
  'recent': 'Recent Activity',
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          fontWeight: 600,
          color: '#242424',
          letterSpacing: '-0.02em',
        }}
      >
        Activity Timeline
      </motion.h2>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ x: 8 }}
              className="group relative"
            >
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div
                  className="absolute left-6 top-16 bottom-0 w-px"
                  style={{
                    background: 'linear-gradient(to bottom, #C4A46A40, transparent)',
                  }}
                />
              )}

              <div className="flex gap-6">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #C4A46A 0%, #8A9474 100%)',
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>

                {/* Card */}
                <div
                  className="flex-1 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(231,221,209,0.4) 100%)',
                    border: '1px solid rgba(196,164,106,0.2)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-1">
                      <p
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: '#C4A46A',
                          fontWeight: 600,
                        }}
                      >
                        {activityLabels[activity.type]}
                      </p>
                      <h3
                        className="mb-1"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: '#242424',
                        }}
                      >
                        {activity.title}
                      </h3>
                      <p
                        className="mb-2"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.875rem',
                          color: '#8A9474',
                        }}
                      >
                        {activity.subtitle}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: '#C4A46A',
                        }}
                      >
                        {activity.timestamp}
                      </p>
                    </div>

                    {/* Image */}
                    {activity.imageUrl && (
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-20 h-20 rounded-xl object-cover shadow-md"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
