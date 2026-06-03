import { motion } from 'motion/react';

interface Server {
  name: string;
  icon: string;
  members?: number;
}

interface ServerBadgesProps {
  servers: Server[];
}

export function ServerBadges({ servers }: ServerBadgesProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          fontWeight: 600,
          color: '#242424',
          letterSpacing: '-0.02em',
        }}
      >
        Communities
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {servers.map((server, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05,
              y: -8,
            }}
            className="group relative p-6 rounded-2xl backdrop-blur-sm cursor-pointer overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(231,221,209,0.4) 100%)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, rgba(196,164,106,0.15), transparent)',
              }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Server Icon */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 mb-4 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={server.icon}
                  alt={server.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Server Name */}
              <h3
                className="mb-1"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#242424',
                }}
              >
                {server.name}
              </h3>

              {/* Members count */}
              {server.members && (
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: '#8A9474',
                  }}
                >
                  {server.members.toLocaleString()} members
                </p>
              )}
            </div>

            {/* Decorative corner */}
            <motion.div
              className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, transparent 50%, #C4A46A20 50%)',
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
