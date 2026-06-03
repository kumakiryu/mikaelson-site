import { FamilyMemberCard } from '../components/family-member-card';
import { useNavigate } from 'react-router-dom';
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
    platform: 'tiktok' | 'youtube' | 'instagram' | 'twitter' | 'github' | 'twitch' | 'discord' | 'spotify' | 'steam' | 'kick' | 'custom';
    url: string;
    label?: string;
  }>;
}

interface HomePageProps {
  familyMembers: FamilyMember[];
}

export function HomePage({ familyMembers }: HomePageProps) {
  const navigate = useNavigate();

  const handleMemberClick = (member: FamilyMember) => {
    navigate(`/profile/${member.slug}`);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="px-6 pt-12 pb-20"
    >
      <div
        className="max-w-7xl mx-auto grid gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {familyMembers.map((member, index) => (
          <FamilyMemberCard
            key={`${member.userId}-${index}`}
            userId={member.userId}
            name={member.displayName || `Member ${index + 1}`}
            displayName={member.displayName}
            nameEffect={member.nameEffect}
            onClick={() => handleMemberClick(member)}
          />
        ))}
      </div>
    </motion.main>
  );
}
