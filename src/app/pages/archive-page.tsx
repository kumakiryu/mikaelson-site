import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, Play, Home, Users, Archive, ChevronRight, Film, Image, Star, Clock } from 'lucide-react';

// ─── Archive Data ────────────────────────────────────────────────────────────
// Add your own YouTube URLs and image URLs here!
export const archiveItems = [
  // VIDEO HIGHLIGHTS
  {
    id: 'v1',
    type: 'video' as const,
    category: 'highlights',
    title: '39 | WE ON GO !',
    description: 's/o Barrio Siete & Mikaelson Familia',
    date: 'Apr 30, 2026',
    youtubeUrl: 'https://www.youtube.com/watch?v=3lkOg4WQucg',
    thumbnailUrl: 'https://i.ytimg.com/vi/3lkOg4WQucg/hqdefault.jpg',
    featured: true,
    tags: ['montage', 'highlights'],
  },
  {
    id: 'v2',
    type: 'video' as const,
    category: 'highlights',
    title: 'tumesting',
    description: 's/o Barrio Siete',
    date: '2025-11-15',
    youtubeUrl: 'https://www.youtube.com/watch?v=xSFGv2tJ3aM',
    thumbnailUrl: 'https://i.ytimg.com/vi/xSFGv2tJ3aM/hqdefault.jpg',
    featured: false,
    tags: ['gaming', 'night'],
  },
  {
    id: 'v3',
    type: 'video' as const,
    category: 'highlights', // videos | highlights
    title: 'kalmado',
    description: 's/o mga baroy',
    date: 'Apr 27, 2026',
    youtubeUrl: 'https://www.youtube.com/watch?v=4wNXQQrJ1PQ&t=1s',
    thumbnailUrl: 'https://i.ytimg.com/vi/4wNXQQrJ1PQ/hqdefault.jpg',
    featured: true,
    tags: ['edit', 'highlight'],
  },
  {
    id: 'v4',
    type: 'video' as const,
    category: 'highlights', // videos | highlights
    title: 'SUMALI SA BULADAS GANG PARA MANGANSER (PART 2)',
    description: 'S/O DAWGGYDAWG, RAVELO',
    date: 'Feb 10, 2026',
    youtubeUrl: 'https://www.youtube.com/watch?v=MJfIC6fbrY8',
    thumbnailUrl: 'https://i.ytimg.com/vi/MJfIC6fbrY8/hqdefault.jpg',
    featured: true,
    tags: ['edit', 'highlight'],
  },
  // PHOTOS
  {
    id: 'p1',
    type: 'photo' as const,
    category: 'photos',
    title: 'Champs?',
    description: 'KING OF STREETS',
    date: '03/30/2026',
    imageUrl: 'https://media.discordapp.net/attachments/1484182087786299472/1487484798380277782/FiveM_GTAProcess_2026-03-29_00-06-58_694.png?ex=6a2052ac&is=6a1f012c&hm=aa5a09fe531a679b2456ea01fa67bb733601d545c39fda3d05e57b4ba9a65112&animated=true',
    featured: true,
    tags: ['family', 'portrait'],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

const FILTERS = [
  { key: 'all', label: 'All', icon: Archive },
  { key: 'videos', label: 'Videos', icon: Film },
  { key: 'photos', label: 'Photos', icon: Image },
  { key: 'highlights', label: 'Highlights', icon: Star },
  { key: 'recent', label: 'Recent', icon: Clock },
] as const;

type FilterKey = typeof FILTERS[number]['key'];

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ item, onClose }: { item: typeof archiveItems[0]; onClose: () => void }) {
  const videoId = getYouTubeId(item.youtubeUrl || '');
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{ background: 'rgba(15,15,15,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>{item.description}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <X size={18} style={{ color: '#fff' }} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ item, onClose }: { item: typeof archiveItems[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-w-4xl w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <img src={item.imageUrl} alt={item.title} className="w-full rounded-2xl" style={{ maxHeight: '75vh', objectFit: 'contain' }} />
        <div className="mt-4 text-center">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#fff', marginBottom: '0.25rem' }}>{item.title}</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>{item.description}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full"
          style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <X size={20} style={{ color: '#fff' }} />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ item, onClick, index }: { item: typeof archiveItems[0]; onClick: () => void; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(18,18,18,0.9)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered ? '0 0 30px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: hovered ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)', transition: 'background 0.3s' }}>
          <motion.div
            animate={{ scale: hovered ? 1 : 0.8, opacity: hovered ? 1 : 0.6 }}
            className="flex items-center justify-center rounded-full"
            style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.4)' }}
          >
            <Play size={22} fill="#fff" style={{ color: '#fff', marginLeft: 3 }} />
          </motion.div>
        </div>
        {item.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)', backdropFilter: 'blur(10px)' }}>
            <Star size={10} fill="gold" style={{ color: 'gold' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: 'gold', letterSpacing: '0.05em' }}>FEATURED</span>
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Video</span>
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#fff', marginBottom: '0.35rem', lineHeight: 1.3 }}>{item.title}</h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{item.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {item.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
              #{tag}
            </span>
          ))}
          <span className="ml-auto" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Photo Card ───────────────────────────────────────────────────────────────
function PhotoCard({ item, onClick, index }: { item: typeof archiveItems[0]; onClick: () => void; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered ? '0 0 30px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: index % 3 === 0 ? '4/5' : '4/3' }}>
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
        <div
          className="absolute inset-0 flex flex-col justify-end p-4"
          style={{
            background: hovered ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
            transition: 'background 0.3s',
          }}
        >
          {item.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)', backdropFilter: 'blur(10px)' }}>
              <Star size={10} fill="gold" style={{ color: 'gold' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: 'gold', letterSpacing: '0.05em' }}>FEATURED</span>
            </div>
          )}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Photo</span>
          </div>
          <motion.div animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }} transition={{ duration: 0.2 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', color: '#fff', marginBottom: '0.2rem' }}>{item.title}</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{item.description}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Archive Page ─────────────────────────────────────────────────────────────
export function ArchivePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<typeof archiveItems[0] | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof archiveItems[0] | null>(null);

  const filtered = useMemo(() => {
    let items = [...archiveItems];
    if (activeFilter === 'videos') items = items.filter(i => i.type === 'video');
    else if (activeFilter === 'photos') items = items.filter(i => i.type === 'photo');
    else if (activeFilter === 'highlights') items = items.filter(i => i.category === 'highlights' || i.featured);
    else if (activeFilter === 'recent') items = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return items;
  }, [activeFilter, search]);

  const stats = {
    videos: archiveItems.filter(i => i.type === 'video').length,
    photos: archiveItems.filter(i => i.type === 'photo').length,
    highlights: archiveItems.filter(i => i.featured).length,
  };

  const videos = filtered.filter(i => i.type === 'video');
  const photos = filtered.filter(i => i.type === 'photo');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="min-h-screen"
    >
      {/* ── Sticky Nav ── */}
      <div className="sticky top-0 z-40" style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            <button
              onClick={() => navigate('/', { state: { showSplash: true } })}
              className="hover:text-white transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Home
            </button>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Archive</span>
          </div>
          {/* Nav Buttons */}
          <div className="flex items-center gap-2">
            {[
              { label: 'Home', icon: Home, onClick: () => navigate('/', { state: { showSplash: true } }) },
              { label: 'Members', icon: Users, onClick: () => navigate('/') },
              { label: 'Archive', icon: Archive, onClick: () => {} },
            ].map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  color: label === 'Archive' ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  textDecoration: label === 'Archive' ? 'underline' : 'none',
                  textUnderlineOffset: '3px',
                  textDecorationColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ml-2 transition-all"
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={13} />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Archive size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mikaelson Familia</span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              color: '#fff',
              letterSpacing: '0.08em',
              marginBottom: '1rem',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, #fff 50%, rgba(255,255,255,0.7) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Archive
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', maxWidth: '480px', margin: '0 auto' }}>
            
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { label: 'Videos', value: stats.videos, icon: Film, color: 'rgba(99,179,237,0.8)' },
            { label: 'Photos', value: stats.photos, icon: Image, color: 'rgba(154,230,180,0.8)' },
            { label: 'Featured', value: stats.highlights, icon: Star, color: 'rgba(255,215,0,0.8)' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#fff', lineHeight: 1 }}>{value}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem', letterSpacing: '0.05em' }}>{label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Search + Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search archive..."
              style={{
                width: '100%',
                paddingLeft: '2.75rem',
                paddingRight: '1rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.875rem',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                <X size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
            )}
          </div>
          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all"
                style={{
                  background: activeFilter === key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                  border: activeFilter === key ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  color: activeFilter === key ? '#fff' : 'rgba(255,255,255,0.45)',
                  transform: activeFilter === key ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Empty State ── */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Archive size={48} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: 'rgba(255,255,255,0.3)' }}>Nothing found</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.5rem' }}>Try a different search or filter</p>
          </motion.div>
        )}

        {/* ── Videos Grid ── */}
        <AnimatePresence>
          {videos.length > 0 && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <Film size={18} style={{ color: 'rgba(99,179,237,0.8)' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#fff' }}>Video Highlights</h2>
                <span className="px-2 py-0.5 rounded-full ml-1" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{videos.length}</span>
              </div>
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {videos.map((item, i) => (
                  <VideoCard key={item.id} item={item} onClick={() => setSelectedVideo(item)} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Photos Grid ── */}
        <AnimatePresence>
          {photos.length > 0 && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <Image size={18} style={{ color: 'rgba(154,230,180,0.8)' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#fff' }}>Photo Gallery</h2>
                <span className="px-2 py-0.5 rounded-full ml-1" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{photos.length}</span>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {photos.map((item, i) => (
                  <PhotoCard key={item.id} item={item} onClick={() => setSelectedPhoto(item)} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {selectedVideo && <VideoModal item={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedPhoto && <Lightbox item={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
