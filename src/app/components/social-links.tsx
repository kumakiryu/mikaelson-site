import { motion } from 'motion/react';
import { Github, Instagram, MessageCircle } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: 'github' | 'instagram' | 'tiktok' | 'discord';
}

interface SocialLinksProps {
  links: SocialLink[];
}

const icons = {
  github: Github,
  instagram: Instagram,
  discord: MessageCircle,
  tiktok: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
};

const platformLabels = {
  github: 'GitHub',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  discord: 'Discord',
};

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
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
        Connect
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {links.map((link, index) => {
          const Icon = icons[link.icon];
          return (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -8,
                boxShadow: '0 20px 60px rgba(196,164,106,0.4)',
              }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl backdrop-blur-md transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(231,221,209,0.5) 100%)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-8 h-8 mb-4" style={{ color: '#8A9474' }} />
              </motion.div>
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
                {platformLabels[link.icon]}
              </span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
