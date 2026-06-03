import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ParticleBackground } from './components/particle-background';
import { SplashScreen } from './components/splash-screen';
import { StatsBar } from './components/stats-bar';
import { BackgroundMusicPlayer, BackgroundMusicPlayerRef } from './components/background-music-player';
import { HomePage } from './pages/home-page';
import { ProfilePage } from './pages/profile-page';
import { ArchivePage } from './pages/archive-page';
import { ArchiveFloatButton } from './components/archive-float-button';
import { AnimatePresence } from 'motion/react';

// Family members data
// Replace userId with actual Discord User IDs
// To get live data, join the Lanyard Discord: https://discord.gg/lanyard
//
// For customMusic.audioUrl, you can use:
// - YouTube URLs: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
// - Direct MP3 URLs: https://example.com/song.mp3
// - Google Drive: https://drive.google.com/uc?export=download&id=FILE_ID
//
// For customBackground, you can use:
// - Image URLs: https://example.com/image.jpg or .png
// - GIF URLs: https://example.com/animation.gif
// - Video URLs: https://example.com/video.mp4 or .webm
const familyMembers = [
  {
    userId: '531278967404232724',
    slug: 'kyro',
    displayName: 'Kyro',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'Creative designer • Dopamine seeker ✨',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'Dominga',
      artist: 'La Mave',
      album: '',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273fd7ac2874be0bf7b973accf9',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/kyromusic.mp3',
      startTime: 0, // seconds — change to e.g. 30 to start 30s into the song
    },
    customBackground: {
      effect: 'platinum-glow',          // CSS/canvas effect layer
      url: 'https://kumakiryu.github.io/musics-formikaelson/assets/kumbagabg.mp4', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'video' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'tiktok' as const, url: 'https://tiktok.com/@kiryukuma' },
      { platform: 'youtube' as const, url: 'https://www.youtube.com/@saintfukuma' },
    ],
  },
  {
    userId: '336357272559026176',
    slug: 'jacob',
    displayName: 'Jacob',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'Cola tas Coke',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'No Problem',
      artist: 'Chance the Rapper',
      album: '',
      coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/N0problem.jpg/250px-N0problem.jpg',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/jacobmusic.mp3', // Example YouTube URL - works with any YouTube video!
    },
    customBackground: {
      url: 'https://cdn.discordapp.com/attachments/1502820510277308519/1511312151321645128/123.gif?ex=6a21501f&is=6a1ffe9f&hm=36e0edee353e81632f73c8132f6a72c12e59b688f1602992c6ce6f418f2e0631&animated=true', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'image' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'tiktok' as const, url: 'https://www.tiktok.com/@jacobmikaelson' },
      { platform: 'youtube' as const, url: 'https://www.youtube.com/@jacobmikaelson222' },
      { platform: 'kick' as const, url: 'https://kick.com/jacobmikaelson' },
    ],
  },
  {
    userId: '765822761955491851',
    slug: 'hazen',
    displayName: 'HAZEN',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'GARAPAL NGA EH',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'Deuces',
      artist: 'Chris Brown and Tyga',
      album: '',
      coverUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Deuces_%28Chris_Brown_single_-_cover_art%29.jpg/250px-Deuces_%28Chris_Brown_single_-_cover_art%29.jpg',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/hazenmusic.mp3', // Example YouTube URL - works with any YouTube video!
    },
    customBackground: {
      url: 'https://images-ext-1.discordapp.net/external/jtNKG-Ga0iDs_sKDrYhzgRnCX1IKF2Rj_z3DjljGXYQ/https/media.tenor.com/2W8tjsbzPXYAAAPo/peter-griffin-crash-out.mp4', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'video' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'tiktok' as const, url: 'https://www.tiktok.com/@jacobmikaelson' },
    ],
  },
     {
    userId: '616221292797886465',
    slug: 'eggy',
    displayName: 'Who tf is Eggy?',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'What should I put here?',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'Self Care',
      artist: 'Mac Miller',
      album: '',
      coverUrl: 'https://images.genius.com/1f5cc2dbac307c27261849f4f49771ae.1000x1000x1.png',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/eggymusic.mp3',
    },
    customBackground: {
      url: 'https://media.discordapp.net/attachments/1505906117861970012/1511334606455046204/bili.gif?ex=6a201389&is=6a1ec209&hm=9532b9155cfe7d209b74515230e4ce798fe4dd0e1a57cad84a3192068a197e3b&=&width=800&height=693', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'image' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'tiktok' as const, url: 'https://www.tiktok.com/@whotfiseggy?is_from_webapp=1&sender_device=pc' },
    ],
  },
  {
    userId: '585256503624335381',
    slug: 'clx',
    displayName: 'clX',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'dgaf',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'My Eyes',
      artist: 'Travis Scott',
      album: '',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273ff0491ff31fb3c2619f93f47',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/clxmusic.mp3',
      startTime: 0, // seconds — change to e.g. 30 to start 30s into the song
    },
    customBackground: {
      url: 'https://media.discordapp.net/attachments/1511311571752845344/1511360431585890324/GIF_20260518_211225_328.gif?ex=6a202b96&is=6a1eda16&hm=91fda0b7c6145365bf5300b311511bd1dd42c7a93d877666316954e5939b6548&animated=true', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'image' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'youtube' as const, url: 'https://www.youtube.com/@clxqsz' },
      { platform: 'tiktok' as const, url: 'https://www.tiktok.com/@_clxqsz' },
    ],
  },
     {
    userId: '1135177103705391214',
    slug: 'mawi',
    displayName: 'Mawi',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'Trust No One',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'Tabi',
      artist: 'Shanti Dope',
      album: '',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273162c36c300206da2ddbf08d2',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/mawimusic.mp3',
    },
    customBackground: {
      url: 'https://cdn.discordapp.com/attachments/1511311571752845344/1511353371968274452/Background_video.mp4?ex=6a202503&is=6a1ed383&hm=74c6685326cf7897e5a0d2130ba7f744921dd439aa77fd6b42a8ab1826ba6f1a&', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'video' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'youtube' as const, url: 'https://www.youtube.com/@Aaas6x-r' },
      { platform: 'tiktok' as const, url: 'https://www.tiktok.com/@aaas6x' },
      { platform: 'instagram' as const, url: 'https://www.instagram.com/urfav_teejay/' },
    ],
  },
     {
    userId: '160325894416760833',
    slug: 'loki',
    displayName: 'Loki',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'ONE OF THE BEST',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'Come And See Me',
      artist: 'PARTYNEXTDOOR',
      album: '',
      coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/14/PartyNextDoor_-_Come_and_See_Me_%28feat._Drake%29_%28Official_Single_Cover%29.jpg',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/lokimusic.mp3',
    },
    customBackground: {
      url: 'https://media.discordapp.net/attachments/1511311571752845344/1511439165143777442/22892b8f018f3865aa5da71933377480.gif?ex=6a2074ea&is=6a1f236a&hm=b9ca02ba4649859bbbd8229003738075cb28b9f045563c82d4668f9ae18bb1cb&animated=true', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'image' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'youtube' as const, url: ' https://youtube.com/@lokidawggydawg?si=2j_FYm4c2LJV4G1W' },
    ],
  },
   {
    userId: '698545367679238196',
    slug: 'soab',
    displayName: 'soab',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'Grabe mag mahal',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'Ice Cream Man',
      artist: 'Tyga',
      album: '',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273b39f0914ef5920d743c6f35f',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/soabmusic.mp3',
      startTime: 0, // seconds — change to e.g. 30 to start 30s into the song
    },
    customBackground: {
      effect: '',          // CSS/canvas effect layer
      url: 'https://media.discordapp.net/attachments/1511311571752845344/1511604860787884062/c9f07594bbfd646da01c0ec50b040931.gif?ex=6a210f3b&is=6a1fbdbb&hm=b286b1266be04250efb2e93879422e39eb2b6871a082babf21c3ec904544149e&animated=true', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'image' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'tiktok' as const, url: 'https://www.tiktok.com/@soabbbbb?is_from_webapp=1&sender_device=pc' },
      { platform: 'youtube' as const, url: 'https://www.youtube.com/@soabbbbb-r17' },
    ],
  },
    {
    userId: '390743317236678660',
    slug: 'toby',
    displayName: 'Toby',
    nameEffect: 'shimmer' as const,
    bio: {
      text: 'Less perfection, more authenticity',
      effect: 'glitch' as const,
    },
    customMusic: {
      title: 'DRIFTSTAR',
      artist: 'Flow G',
      album: '',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b273c66f8d7ba73725488e6ec6c6',
      audioUrl: 'https://kumakiryu.github.io/musics-forvixen/assets/kytemusic.mp3',
    },
    customBackground: {
      url: 'https://images-ext-1.discordapp.net/external/Jzq8iuW0gVZeTEfjRf_AySpdO_SVDunNwN98hyvZ5j0/https/media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnU1eDBsZ2d0ajYwY2lsb29tbDBvcGdhODN3bGJxNWMwMWV5dmJ4ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H2ZgaMHxgBHZm/giphy.gif?width=375&height=375', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'image' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'tiktok' as const, url: 'https://tiktok.com/@kiryukuma' },
      { platform: 'youtube' as const, url: 'https://www.youtube.com/@saintfukuma' },
    ],
  },
   {
    userId: '748466562381512715',
    slug: 'kula',
    displayName: 'Kula',
    nameEffect: 'shimmer' as const,
    bio: {
      text: '...',
      effect: 'silver-shine' as const,
    },
    customMusic: {
      title: 'Hindi Pwede',
      artist: 'Clien',
      album: '',
      coverUrl: 'https://i.scdn.co/image/ab67616d0000b27303f8ad697a7c6af65b1e8940',
      audioUrl: 'https://kumakiryu.github.io/musics-formikaelson/assets/kulamusic.mp3',
    },
    customBackground: {
      url: 'https://i.makeagif.com/media/8-02-2022/x3K_yO.gif', // Add your custom background URL here (.jpg, .png, .gif, .mp4, .webm)
      type: 'image' as const, // 'image' for jpg/png/gif, 'video' for mp4/webm
    },
    socialLinks: [
      { platform: 'steam' as const, url: 'https://tiktok.com/@kiryukuma' },
    ],
  },
];

// Set your Mikaelson logo URL here (PNG/GIF/etc). Leave empty to use the "M" monogram fallback.
const MIKAELSON_LOGO_URL = 'https://media.discordapp.net/attachments/1504041719602090005/1511451494132486275/mikaelson4.webp?ex=6a208065&is=6a1f2ee5&hm=3fe9953ec1a1281d565ec959284e392bb2706228696687bdaab70eeabbe58b4f&animated=true';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const backgroundMusicRef = useRef<BackgroundMusicPlayerRef>(null);
  const location = useLocation();

  // Set favicon and page title
  useEffect(() => {
    document.title = 'mklsn';

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = MIKAELSON_LOGO_URL;
    link.type = 'image/webp';
  }, []);

  const handleSplashExit = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowSplash(false);
      setIsTransitioning(false);
    }, 1000);
  };

  // Show splash when navigating home with showSplash state
  useEffect(() => {
    if (location.state && (location.state as { showSplash?: boolean }).showSplash) {
      setShowSplash(true);
    }
  }, [location.state]);

  // Pause background music when on profile page
  const isProfilePage = location.pathname.startsWith('/profile/');

  useEffect(() => {
    if (isProfilePage) {
      backgroundMusicRef.current?.pause();
    } else if (!showSplash) {
      backgroundMusicRef.current?.play();
    }
  }, [isProfilePage, showSplash]);

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen
          onEnter={handleSplashExit}
          isExiting={isTransitioning}
          backgroundImageUrl="https://i.makeagif.com/media/9-20-2018/JcXA5d.gif"
        />
      )}

      {/* Main App */}
      <div
        className="min-h-screen relative"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <ParticleBackground />

        <div className="relative" style={{ zIndex: 2 }}>
          <StatsBar memberCount={familyMembers.length} />

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage familyMembers={familyMembers} />} />
              <Route path="/profile/:slug" element={<ProfilePage familyMembers={familyMembers} />} />
              <Route path="/archive" element={<ArchivePage />} />
            </Routes>
          </AnimatePresence>

          {/* Footer */}
          <footer className="py-8 text-center border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', sans-serif",
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              kumbaga
            </p>
          </footer>
        </div>

        {/* Background Music Player */}
        {!showSplash && !isProfilePage && <BackgroundMusicPlayer ref={backgroundMusicRef} />}

        {/* Floating Archive Button */}
        {!showSplash && <ArchiveFloatButton logoUrl={MIKAELSON_LOGO_URL} />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
