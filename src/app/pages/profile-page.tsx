import { useParams, useNavigate } from 'react-router-dom';
import { ProfileDetailView } from '../components/profile-detail-view';
import { motion } from 'motion/react';

interface FamilyMember {
  userId: string;
  slug: string;
  displayName: string;
  nameEffect?: 'shimmer' | 'glow' | 'rainbow' | 'neon-pulse' | 'glitch' | 'none';
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
  };
  customBackground?: {
    url?: string;
    type?: 'image' | 'video';
    effect?: string;
  };
  socialLinks?: Array<{
    platform: 'tiktok' | 'youtube' | 'instagram' | 'twitter' | 'github' | 'twitch' | 'discord' | 'spotify' | 'steam' | 'custom' | 'kick';
    url: string;
    label?: string;
  }>;
}

interface ProfilePageProps {
  familyMembers: FamilyMember[];
}

export function ProfilePage({ familyMembers }: ProfilePageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const member = familyMembers.find(m => m.slug === slug);

  if (!member) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <h1 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: '1rem' }}>
            Member not found
          </h1>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="min-h-screen"
    >
      <ProfileDetailView
        userId={member.userId}
        name={member.displayName}
        displayName={member.displayName}
        bio={member.bio}
        customMusic={member.customMusic}
        customBackground={member.customBackground}
        socialLinks={member.socialLinks}
        onClose={() => navigate('/')}
      />
    </motion.div>
  );
}
