/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Bookmark, 
  History, 
  Sparkles, 
  Trash2, 
  Clock, 
  Share2, 
  Check, 
  Video, 
  Globe, 
  Youtube,
  Pencil,
  X,
  Search,
  Flame,
  Music,
  Gamepad2,
  Cpu,
  CloudRain,
  Tv,
  Menu,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import YouTube from 'react-youtube';

// Stream source type definitions
type SupportPlatform = 'youtube' | 'vimeo' | 'dailymotion' | 'direct' | 'generic';

interface SavedVideo {
  id: string; // ID or URL
  title: string;
  sourceType: SupportPlatform;
  embedUrl: string;
  addedAt: string;
}

interface HistoryItem {
  id: string; // ID or URL
  title: string;
  sourceType: SupportPlatform;
  embedUrl: string;
  timestamp: string;
}

interface YouTubeBrowserVideo {
  id: string;
  title: string;
  channel: string;
  views: string;
  duration: string;
  category: string;
  thumbnailUrl: string;
}

// Suggested videos have been removed to prioritize direct search query-based browser results.


const formatViews = (viewCount: any): string => {
  if (!viewCount) return '1.2M views';
  const num = parseInt(viewCount, 10);
  if (isNaN(num)) return viewCount.toString();
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M views';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K views';
  return num + ' views';
};

const formatDuration = (secondsStr: any): string => {
  if (!secondsStr) return '11:40';
  const sec = parseInt(secondsStr, 10);
  if (isNaN(sec)) return secondsStr.toString();
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function App() {
  // Input URL or ID
  const [inputUrl, setInputUrl] = useState('');
  
  // Active video streaming states
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [sourceType, setSourceType] = useState<SupportPlatform>('youtube');
  const [embedUrl, setEmbedUrl] = useState('');
  
  // User lists
  const [favorites, setFavorites] = useState<SavedVideo[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Inline editing state for favorites
  const [editingFavId, setEditingFavId] = useState<string | null>(null);
  const [editingFavTitle, setEditingFavTitle] = useState('');

  // Ad-Free YouTube Browser parameters
  const [browserActive, setBrowserActive] = useState(true);
  const [browserSearchQuery, setBrowserSearchQuery] = useState('');
  const [browserResults, setBrowserResults] = useState<YouTubeBrowserVideo[]>([]);
  const [browserSearchInput, setBrowserSearchInput] = useState('');
  const [isBrowserLoading, setIsBrowserLoading] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  // Trending videos states
  const [trendingVideos, setTrendingVideos] = useState<YouTubeBrowserVideo[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

  // Navigation drawer toggle states for header right buttons
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Height matching trackers for player and sidebar
  const playerCardRef = useRef<HTMLDivElement>(null);
  const [playerCardHeight, setPlayerCardHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth scroll to video player on mobile when a video is selected
  useEffect(() => {
    if (currentVideoId) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setTimeout(() => {
          // Both possible container targets for clean scroll
          const targetElement = document.getElementById('cinema_module_card') || 
                                document.getElementById('live_video_frame_container') ||
                                document.getElementById('nav_header');
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 120);
      }
    }
  }, [currentVideoId]);

  useEffect(() => {
    if (!currentVideoId || !playerCardRef.current) {
      setPlayerCardHeight(null);
      return;
    }
    
    // Initial calculation
    setPlayerCardHeight(playerCardRef.current.getBoundingClientRect().height);

    // Watch for dynamic rendering changes (e.g., responsive width/height transitions)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (playerCardRef.current) {
          setPlayerCardHeight(playerCardRef.current.getBoundingClientRect().height);
        }
      }
    });

    resizeObserver.observe(playerCardRef.current);
    
    // Fallback timer to double check as media loads
    const timer = setTimeout(() => {
      if (playerCardRef.current) {
        setPlayerCardHeight(playerCardRef.current.getBoundingClientRect().height);
      }
    }, 300);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [currentVideoId]);

  // Load client parameters and handle direct routing params
  useEffect(() => {
    const storedFavorites = localStorage.getItem('pure_player_favorites');
    const storedHistory = localStorage.getItem('pure_player_history');
    
    if (storedFavorites) {
      try { setFavorites(JSON.parse(storedFavorites)); } catch (e) { console.error(e); }
    }
    if (storedHistory) {
      try { setHistory(JSON.parse(storedHistory)); } catch (e) { console.error(e); }
    }

    // Support direct loading via share parameters
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url') || params.get('video');
    if (sharedUrl) {
      const parsed = parseAnyVideoUrl(sharedUrl);
      if (parsed) {
        setSourceType(parsed.type);
        setCurrentVideoId(parsed.id);
        setEmbedUrl(parsed.embedUrl);
        setVideoTitle(parsed.title);
      }
    }

    // Fetch trending videos
    const fetchTrending = async () => {
      setIsTrendingLoading(true);
      try {
        const res = await fetch('/api/trending-youtube');
        if (res.ok) {
          const data = await res.json();
          if (data.results && Array.isArray(data.results)) {
            setTrendingVideos(data.results);
          }
        }
      } catch (err) {
        console.error("Failed to load trending videos:", err);
      } finally {
        setIsTrendingLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // Sync methods
  const saveFavoritesToStorage = (updated: SavedVideo[]) => {
    setFavorites(updated);
    localStorage.setItem('pure_player_favorites', JSON.stringify(updated));
  };

  const saveHistoryToStorage = (updated: HistoryItem[]) => {
    setHistory(updated);
    localStorage.setItem('pure_player_history', JSON.stringify(updated));
  };

  // Helper parser for start seconds count
  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/^(\d+)(s|m|h)?$/);
    if (match) {
      const val = parseInt(match[1], 10);
      const unit = match[2];
      if (unit === 'm') return val * 60;
      if (unit === 'h') return val * 3600;
      return val;
    }
    
    let seconds = 0;
    const hMatch = timeStr.match(/(\d+)h/);
    const mMatch = timeStr.match(/(\d+)m/);
    const sMatch = timeStr.match(/(\d+)s/);
    if (hMatch) seconds += parseInt(hMatch[1], 10) * 3600;
    if (mMatch) seconds += parseInt(mMatch[1], 10) * 60;
    if (sMatch) seconds += parseInt(sMatch[1], 10);
    
    if (seconds > 0) return seconds;
    const rawSec = parseInt(timeStr, 10);
    return isNaN(rawSec) ? 0 : rawSec;
  };

  // Deep parse YouTube link
  const parseYouTubeId = (url: string) => {
    const trimmed = url.trim();
    if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return { id: trimmed, start: 0 };
    }

    try {
      const urlObj = new URL(trimmed);
      let id: string | null = null;
      let start = 0;

      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname === '/watch') {
          id = urlObj.searchParams.get('v');
        } else if (urlObj.pathname.startsWith('/embed/')) {
          id = urlObj.pathname.split('/embed/')[1];
        } else if (urlObj.pathname.startsWith('/live/')) {
          id = urlObj.pathname.split('/live/')[1];
        }
        const t = urlObj.searchParams.get('t') || urlObj.searchParams.get('start');
        if (t) start = parseTime(t);
      } 
      else if (urlObj.hostname.includes('youtu.be')) {
        id = urlObj.pathname.substring(1);
        const t = urlObj.searchParams.get('t');
        if (t) start = parseTime(t);
      }
      else if (urlObj.hostname.includes('youtube-nocookie.com')) {
        if (urlObj.pathname.startsWith('/embed/')) {
          id = urlObj.pathname.split('/embed/')[1];
        }
      }

      if (id) {
        id = id.split('?')[0].split('&')[0];
        return { id, start };
      }
    } catch (e) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/live\/)([^#\&\?]*).*/;
      const match = trimmed.match(regExp);
      if (match && match[2].length === 11) {
        return { id: match[2], start: 0 };
      }
    }
    return null;
  };

  // Comprehensive, platform-independent parser
  const parseAnyVideoUrl = (rawInput: string) => {
    const input = rawInput.trim();
    if (!input) return null;

    // 1. Direct Media/Video Streams (.mp4, .webm, .ogg, .mov, .m3u8 files)
    const isDirectMedia = /\.(mp4|webm|ogg|mov|mkv|m3u8)(\?.*)?$/i.test(input) || input.startsWith('data:video/');
    if (isDirectMedia) {
      let fileName = 'Direct Video File';
      try {
        const urlObj = new URL(input);
        const segments = urlObj.pathname.split('/');
        const lastPart = segments[segments.length - 1];
        if (lastPart) {
          fileName = decodeURIComponent(lastPart);
        }
      } catch (e) {}
      
      return {
        type: 'direct' as SupportPlatform,
        id: input,
        embedUrl: input,
        title: fileName,
        start: 0
      };
    }

    // 2. YouTube Streams
    const youtubeResult = parseYouTubeId(input);
    if (youtubeResult) {
      const offset = youtubeResult.start;
      const params = new URLSearchParams({
        autoplay: '1',
        loop: '1',
        playlist: youtubeResult.id,
        start: offset.toString(),
        iv_load_policy: '3', // Turn off creator annotations/sub buttons
        rel: '0',            // Exclude noise recommendations
        modestbranding: '1', // Minimize YT overlays
        fs: '1',
        playsinline: '1'
      }).toString();

      return {
        type: 'youtube' as SupportPlatform,
        id: youtubeResult.id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeResult.id}?${params}`,
        title: `YouTube Stream (${youtubeResult.id})`,
        start: offset
      };
    }

    // 3. Vimeo Links
    const vimeoMatches = input.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
    if (vimeoMatches && vimeoMatches[1]) {
      const vimeoId = vimeoMatches[1];
      // dnt=1 stops tracking cookies, portrait/byline/title=0 cleans promotional overlays
      const cleanEmbed = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&dnt=1&title=0&byline=0&portrait=0`;
      return {
        type: 'vimeo' as SupportPlatform,
        id: vimeoId,
        embedUrl: cleanEmbed,
        title: `Vimeo Stream (${vimeoId})`,
        start: 0
      };
    }

    // 4. Dailymotion Links
    const dmMatches = input.match(/(?:dailymotion\.com\/(?:video|embed\/video)\/|dai\.ly\/)([a-zA-Z0-9]+)/i);
    if (dmMatches && dmMatches[1]) {
      const dmId = dmMatches[1];
      // queue-enable=false and sharing-enable=false skips overlay ads and sharing lists
      const cleanEmbed = `https://www.dailymotion.com/embed/video/${dmId}?autoplay=1&loop=1&queue-enable=false&sharing-enable=false&ui-logo=false`;
      return {
        type: 'dailymotion' as SupportPlatform,
        id: dmId,
        embedUrl: cleanEmbed,
        title: `Dailymotion Stream (${dmId})`,
        start: 0
      };
    }

    // v. Generic HTTP fallback embedded iframe (Sandbox Isolated)
    if (/^https?:\/\//i.test(input)) {
      return {
        type: 'generic' as SupportPlatform,
        id: input,
        embedUrl: input,
        title: 'Sandbox Web Player',
        start: 0
      };
    }

    return null;
  };

  const fetchWithTimeout = async (url: string, timeoutMs = 4000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  const runBrowserSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsBrowserLoading(true);
    setBrowserSearchQuery(query);
    setBrowserActive(true);
    
    try {
      console.log('Fetching YouTube search through secure backend proxy...');
      const res = await fetch(`/api/search-youtube?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP proxy error ${res.status}`);
      
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        setBrowserResults(data.results);
      } else {
        throw new Error(data.error || 'Invalid format returned by proxy');
      }
    } catch (err) {
      console.warn('Backend proxy search failed. Error:', err);
      // Fail gracefully
      setBrowserResults([]);
    } finally {
      setIsBrowserLoading(false);
    }
  };

  // Launch form stream action (Unified input that plays or browses)
  const handleLaunchVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputUrl.trim();
    if (!query) return;

    // Detect if they literally typed a address like youtube.com or search-intent
    const isNavigation = /^(youtube\.com|www\.youtube\.com|invidious|search|browse|explore)$/i.test(query);
    
    if (isNavigation) {
      setBrowserActive(true);
      setBrowserSearchQuery('');
      setBrowserResults([]);
      setInputUrl('');
      return;
    }

    const parsed = parseAnyVideoUrl(query);
    if (parsed) {
      setSourceType(parsed.type);
      setCurrentVideoId(parsed.id);
      setEmbedUrl(parsed.embedUrl);
      setVideoTitle(parsed.title);
      addToHistory(parsed.id, parsed.title, parsed.type, parsed.embedUrl);
      setInputUrl('');
    } else {
      // Treat as search/browse action inside our ad-free browser
      runBrowserSearch(query);
      setInputUrl('');
    }
  };

  const handleVideoEnd = () => {
    if (!autoPlayNext) return;
    
    const listToSearch = browserSearchQuery ? browserResults : trendingVideos;
    if (listToSearch.length === 0) return;
    
    const currentIndex = listToSearch.findIndex(v => v.id === currentVideoId);
    if (currentIndex >= 0 && currentIndex < listToSearch.length - 1) {
      const nextVideo = listToSearch[currentIndex + 1];
      setCurrentVideoId(nextVideo.id);
      setVideoTitle(nextVideo.title);
      setSourceType('youtube');
      setEmbedUrl(`https://www.youtube-nocookie.com/embed/${nextVideo.id}?autoplay=1&modestbranding=1&rel=0`);
      addToHistory(nextVideo.id, nextVideo.title, 'youtube', `https://www.youtube-nocookie.com/embed/${nextVideo.id}?autoplay=1&modestbranding=1&rel=0`);
    }
  };

  const addToHistory = (id: string, title: string, type: SupportPlatform, embed: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const filtered = history.filter(item => item.id !== id);
    const updated = [{ id, title, sourceType: type, embedUrl: embed, timestamp: now }, ...filtered].slice(0, 15);
    saveHistoryToStorage(updated);
  };

  const toggleFavorite = () => {
    const isFav = favorites.some(fav => fav.id === currentVideoId);
    if (isFav) {
      const updated = favorites.filter(fav => fav.id !== currentVideoId);
      saveFavoritesToStorage(updated);
    } else {
      const updated = [
        ...favorites,
        { 
          id: currentVideoId, 
          title: videoTitle,
          sourceType,
          embedUrl,
          addedAt: new Date().toLocaleDateString()
        }
      ];
      saveFavoritesToStorage(updated);
    }
  };

  const deleteBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter(fav => fav.id !== id);
    saveFavoritesToStorage(updated);
  };

  const startRenameBookmark = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFavId(id);
    setEditingFavTitle(currentTitle);
  };

  const saveRenamedBookmark = (id: string) => {
    const trimmed = editingFavTitle.trim();
    if (trimmed) {
      const updated = favorites.map(fav => fav.id === id ? { ...fav, title: trimmed } : fav);
      saveFavoritesToStorage(updated);
    }
    setEditingFavId(null);
  };

  const clearHistory = () => {
    saveHistoryToStorage([]);
  };

  // Play bookmark item directly
  const playSavedItem = (item: { id: string; title: string; sourceType: SupportPlatform; embedUrl: string }) => {
    setSourceType(item.sourceType);
    setCurrentVideoId(item.id);
    setEmbedUrl(item.embedUrl);
    setVideoTitle(item.title);
    addToHistory(item.id, item.title, item.sourceType, item.embedUrl);
  };

  // UI badge generator per platform
  const renderPlatformBadge = (type: SupportPlatform) => {
    let style = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    let label = 'YouTube Secure';
    if (type === 'vimeo') { style = 'bg-sky-500/10 text-sky-400 border-sky-500/20'; label = 'Vimeo Secure'; }
    if (type === 'dailymotion') { style = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'; label = 'Dailymotion'; }
    if (type === 'direct') { style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; label = 'Ad-Free Direct MP4 Player'; }
    if (type === 'generic') { style = 'bg-slate-500/10 text-slate-400 border-slate-500/20'; label = 'Isolated Sandbox Web'; }
    
    return (
      <span className={`text-[10px] uppercase tracking-wider font-extrabold border px-2.5 py-0.5 rounded-md ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <div id="app_container" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-12">
      
      {/* Background ambient glow behind active elements */}
      <div 
        id="ambient_glow_layer"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] h-[380px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 origin-center filter animate-pulse"
        style={{
          animationDuration: '12s',
          background: sourceType === 'direct' 
            ? 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(99,102,241,0.03) 50%, rgba(0,0,0,0) 100%)'
            : sourceType === 'vimeo'
            ? 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(99,102,241,0.03) 50%, rgba(0,0,0,0) 100%)'
            : 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(99,102,241,0.03) 50%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* Primary Header */}
      <header id="nav_header" className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 py-4.5">
        <div id="header_wrapper" className="w-full px-4 md:px-8 lg:px-12 flex flex-row items-center justify-between gap-4">
          <div id="brand_title_container" className="flex items-center gap-3">
            <div id="brand_logo" className="h-9 w-9 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/10 shrink-0">
              <Play id="logo_icon" className="h-5 w-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <h1 id="brand_main_name" className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Ads-Alis Stream
              </h1>
              <p id="brand_sub_name" className="hidden md:block text-xs text-slate-400">Ad-Free & Pop-up Free Multi-Platform Streaming Environment</p>
            </div>
          </div>

          {/* Hamburger button for mobile */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition cursor-pointer select-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Upper Right Navigation Buttons (Desktop) */}
          <div id="navbar_user_interactions" className="hidden md:flex items-center gap-3">
            <button
              id="nav_history_btn"
              onClick={() => setIsHistoryOpen(true)}
              className="px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-350 hover:text-white text-xs font-semibold tracking-wide flex items-center gap-2 transition cursor-pointer select-none active:scale-95"
            >
              <History className="h-4 w-4 text-slate-450" />
              <span>History</span>
              {history.length > 0 && (
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-500">
                  {history.length}
                </span>
              )}
            </button>

            <button
              id="nav_bookmarks_btn"
              onClick={() => setIsBookmarksOpen(true)}
              className="px-4 py-2 rounded-lg border border-amber-500/10 hover:border-amber-500/30 bg-amber-500/5 text-amber-400 hover:text-amber-350 text-xs font-semibold tracking-wide flex items-center gap-2 transition cursor-pointer select-none active:scale-95"
            >
              <Bookmark className="h-4 w-4 fill-amber-500/10" />
              <span>Bookmarks</span>
              {favorites.length > 0 && (
                <span className="bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 py-3 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsHistoryOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 text-slate-200 flex items-center gap-3 text-xs font-medium transition cursor-pointer"
            >
              <History className="h-4 w-4 text-amber-500" />
              <span>History</span>
              {history.length > 0 && (
                <span className="ml-auto bg-slate-800 px-2 py-0.5 rounded text-xs font-bold text-amber-500">
                  {history.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setIsBookmarksOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 text-slate-200 flex items-center gap-3 text-xs font-medium transition cursor-pointer"
            >
              <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500/10" />
              <span>Bookmarks</span>
              {favorites.length > 0 && (
                <span className="ml-auto bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-bold text-amber-500">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Main Grid Content */}
      <main id="main_content" className="w-full px-4 md:px-8 lg:px-12 py-6 md:py-8 relative z-10">
        
        {/* Global Multi-Platform URL Input Terminal */}
        <section id="url_input_panel" className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 md:p-5 mb-6 shadow-sm">
          <form id="url_parse_form" onSubmit={handleLaunchVideo} className="flex flex-col sm:flex-row gap-3">
            <div id="input_wrapper" className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Video className="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="youtube_url_field"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste any YouTube link, Vimeo link, Dailymotion link, or raw Direct Media URL (.mp4)"
                className="block w-full py-3.5 pl-10 pr-4 rounded-lg bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
            </div>

            <button
              id="stream_now_action_btn"
              type="submit"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 rounded-lg text-sm font-bold tracking-wide shadow-md shadow-amber-500/10 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="h-4 w-4 fill-current" />
              Search Video
            </button>
          </form>
        </section>

        {/* Main Section Layout with dynamic responsiveness */}
        {!currentVideoId ? (
          /* ========================================================= */
          /* NO VIDEO IS CURRENTLY PLAYING: FULL SCREEN VIEW MODE     */
          /* ========================================================= */
          <div id="full_screen_browser_wrapper" className="space-y-6 animate-fade-in">
            
            {/* Search Or Trending Header Dashboard */}
            {browserSearchQuery && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800/80 p-5 rounded-xl shadow-md">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Search className="h-5 w-5 text-amber-550 text-amber-500" />
                    <span>Search Results for: <span className="text-amber-400">"{browserSearchQuery}"</span></span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Found {browserResults.length} clean, ad-free video streams based on your keyword search.
                  </p>
                </div>

                {/* Inline layout action helper */}
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => {
                      setBrowserSearchQuery('');
                      setBrowserResults([]);
                      setBrowserSearchInput('');
                    }}
                    className="text-xs bg-red-500/10 text-red-400 border border-red-500/25 px-4 py-2 rounded-lg hover:bg-red-500/20 transition flex items-center gap-1.5 font-semibold cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <X className="h-4 w-4" /> Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Grid Container */}
            {isBrowserLoading || isTrendingLoading ? (
              /* Loading Skeleton Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-3 h-64 animate-pulse flex flex-col justify-between">
                    <div className="w-full aspect-video bg-slate-950 rounded-lg" />
                    <div className="space-y-2 mt-3 flex-1">
                      <div className="h-4 w-5/6 bg-slate-950 rounded" />
                      <div className="h-3 w-1/2 bg-slate-950 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              (() => {
                const videosToDisplay = browserSearchQuery ? browserResults : trendingVideos;
                
                if (videosToDisplay.length === 0) {
                  return (
                    <div className="text-center py-20 bg-slate-900/55 rounded-xl border border-dashed border-slate-800 p-8">
                      <div className="h-12 w-12 bg-slate-950 border border-slate-850 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                        <Search className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">No Videos Found</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        We couldn't retrieve any streaming links for the active query. Try searching for a different topic, channel, or stream.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videosToDisplay.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => {
                          const params = new URLSearchParams({
                            autoplay: '1',
                            loop: '1',
                            playlist: video.id,
                            iv_load_policy: '3',
                            rel: '0',
                            modestbranding: '1',
                            fs: '1',
                            playsinline: '1'
                          }).toString();
                          
                          setSourceType('youtube');
                          setCurrentVideoId(video.id);
                          setEmbedUrl(`https://www.youtube-nocookie.com/embed/${video.id}?${params}`);
                          setVideoTitle(video.title);
                          addToHistory(video.id, video.title, 'youtube', `https://www.youtube-nocookie.com/embed/${video.id}?${params}`);
                        }}
                        className="bg-slate-900/40 hover:bg-slate-900 border border-slate-850/60 hover:border-amber-500/25 rounded-xl overflow-hidden transition cursor-pointer group flex flex-col h-full shadow-lg"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                          />
                          
                          <span className="absolute bottom-2 right-2 bg-slate-950/95 backdrop-blur-sm border border-slate-800/80 text-[10px] font-bold text-slate-200 px-1.5 py-0.5 rounded">
                            {video.duration}
                          </span>

                          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-lg scale-90 group-hover:scale-100 transition duration-300">
                              <Play className="h-4 w-4 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Text fields */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <h4 className="text-[12.5px] font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-amber-400 transition" title={video.title}>
                            {video.title}
                          </h4>
                          <div className="flex items-center justify-between gap-2 mt-3 text-[11px] text-slate-400 border-t border-slate-850/40 pt-2.5">
                            <span className="truncate font-semibold text-slate-350">{video.channel}</span>
                            <span className="whitespace-nowrap bg-slate-950 border border-slate-850 px-2 py-0.5 rounded-md text-[10px] font-semibold text-amber-500/90">{video.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* VIDEO IS PLAYING: SPLIT SCREEN VIEW MODE (CINEMATIC)     */
          /* ========================================================= */
          <div id="main_layout_grid" className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-fade-in">
            
            {/* LEFT PORTION: THE ACTIVE AD-FREE THEATER PLAYER (lg:col-span-3) */}
            <div id="cinema_module_card" ref={playerCardRef} className="lg:col-span-3 bg-slate-900 border border-slate-800/90 rounded-xl overflow-hidden shadow-xl shadow-slate-950/70 flex flex-col justify-start">
              
              {/* Media viewer container */}
              <div id="live_video_frame_container" className="relative bg-black select-none aspect-video">
                {sourceType === 'direct' ? (
                  /* NATIVE DIRECT SECURE WEB STREAMING PLAYER */
                  <video
                    id="native_video_core"
                    src={embedUrl}
                    controls
                    autoPlay
                    loop
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : sourceType === 'youtube' ? (
                  /* REACT-YOUTUBE SECURED EMBED FOR AUTOPLAY EVENTS */
                  <YouTube
                    videoId={currentVideoId}
                    className="absolute inset-0 w-full h-full"
                    iframeClassName="absolute inset-0 w-full h-full border-0"
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        rel: 0,
                      },
                    }}
                    onEnd={handleVideoEnd}
                  />
                ) : (
                  /* GENERIC/OTHER SECURED SANDBOXED EMBED */
                  <iframe
                    key={currentVideoId}
                    id="sandbox_player_iframe"
                    title="Isolated Sandboxed Video Stream Core"
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Information bar below running video */}
              <div id="player_meta_bar" className="p-4 bg-slate-900 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                <div id="active_meta_info" className="min-w-0 flex-1">
                  <h2 id="active_video_heading" className="text-sm md:text-base font-bold text-white mt-1.5 leading-snug truncate" title={videoTitle}>{videoTitle}</h2>
                  <p id="active_video_id_tag" className="text-[10px] text-slate-450 font-mono mt-0.5 truncate max-w-xl">Source URL / Identifier: {currentVideoId}</p>
                </div>
                
                <div id="player_quick_actions" className="flex items-center gap-2 shrink-0">
                  <button
                    id="bookmark_toggle_btn"
                    onClick={toggleFavorite}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition select-none ${
                      favorites.some(fav => fav.id === currentVideoId)
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        : 'border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5 fill-current" />
                    {favorites.some(fav => fav.id === currentVideoId) ? 'Bookmarked' : 'Bookmark'}
                  </button>

                  <button
                    id="copy_clean_link_btn"
                    onClick={() => {
                      const cleanUrl = `${window.location.origin}?url=${encodeURIComponent(currentVideoId)}`;
                      navigator.clipboard.writeText(cleanUrl);
                    }}
                    className="px-3 py-2 border border-slate-800 rounded-lg text-xs font-semibold text-slate-350 hover:bg-slate-800 hover:text-slate-100 flex items-center gap-1.5 transition"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </button>

                  <button
                    onClick={() => {
                      setCurrentVideoId('');
                      setEmbedUrl('');
                      setVideoTitle('');
                    }}
                    className="px-3 py-2 border border-slate-800 rounded-lg text-xs font-semibold text-slate-350 hover:bg-slate-800 hover:text-red-400 hover:border-red-500/20 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer select-none"
                    title="Close player & focus browser"
                  >
                    <X className="h-3.5 w-3.5" />
                    Close Player
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT PORTION: COMPACT SIDEBAR BROWSER & RECOMMENDATIONS (lg:col-span-1) */}
            <div id="right_search_browser_module" style={{ height: (isDesktop && playerCardHeight) ? `${playerCardHeight}px` : undefined }} className="lg:col-span-1 bg-slate-900 border border-slate-800/90 rounded-xl p-4 md:p-5 shadow-lg flex flex-col justify-stretch min-h-[350px]">
              <div className="flex flex-col flex-1 h-full overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-1.5">
                      <Tv className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      {browserSearchQuery ? 'Related Search Results' : 'Featured Videos'}
                    </h3>
                    
                    {/* Auto-Play Next Toggle */}
                    <button
                      onClick={() => setAutoPlayNext(!autoPlayNext)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors hover:bg-slate-800"
                      title={autoPlayNext ? "Disable Auto-Play Next" : "Enable Auto-Play Next"}
                    >
                      {autoPlayNext ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-emerald-400" />
                          <span className="text-emerald-400">Auto-Play</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-slate-500" />
                          <span className="text-slate-400">Auto-Play</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sidebar Active List Scroll */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                  {isBrowserLoading || isTrendingLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="bg-slate-950/40 rounded-xl overflow-hidden border border-slate-850 p-2 h-20 animate-pulse flex gap-2">
                          <div className="w-24 aspect-video bg-slate-900 rounded-md" />
                          <div className="flex-1 space-y-1.5 mt-1">
                            <div className="h-3 w-5/6 bg-slate-900 rounded" />
                            <div className="h-2.5 w-1/2 bg-slate-900 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    (() => {
                      const sidebarList = browserSearchQuery ? browserResults : trendingVideos;
                      
                      if (sidebarList.length === 0) {
                        return (
                          <div className="text-center py-8 px-4 bg-slate-950/20 rounded-xl border border-dashed border-slate-850">
                            <p className="text-xs text-slate-400 font-medium font-sans">No matching videos.</p>
                          </div>
                        );
                      }

                      return sidebarList.map((video) => {
                        const isCurrentlyPlaying = video.id === currentVideoId;
                        return (
                          <div
                            key={video.id}
                            onClick={() => {
                              const params = new URLSearchParams({
                                autoplay: '1',
                                loop: '1',
                                playlist: video.id,
                                iv_load_policy: '3',
                                rel: '0',
                                modestbranding: '1',
                                fs: '1',
                                playsinline: '1'
                              }).toString();
                              
                              setSourceType('youtube');
                              setCurrentVideoId(video.id);
                              setEmbedUrl(`https://www.youtube-nocookie.com/embed/${video.id}?${params}`);
                              setVideoTitle(video.title);
                              addToHistory(video.id, video.title, 'youtube', `https://www.youtube-nocookie.com/embed/${video.id}?${params}`);
                            }}
                            className={`flex flex-row gap-2.5 p-2 rounded-xl border transition cursor-pointer group ${
                              isCurrentlyPlaying
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : 'bg-slate-950/40 hover:bg-slate-950 border-slate-850/80 hover:border-amber-500/15'
                            }`}
                          >
                            {/* Small Left Thumbnail */}
                            <div className="relative w-24 sm:w-28 aspect-video bg-slate-950 rounded-lg overflow-hidden shrink-0">
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 right-1 bg-slate-950/90 text-[8px] font-bold text-slate-200 px-1 py-0.2 rounded">
                                {video.duration}
                              </span>
                            </div>

                            {/* Right Video Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <h4 className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-amber-400 transition" title={video.title}>
                                {video.title}
                              </h4>
                              <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400 mt-1 pb-0.5">
                                <span className="truncate max-w-[80px] font-medium text-slate-300">{video.channel}</span>
                                <span className="whitespace-nowrap text-amber-550 text-amber-500 font-medium">{video.views}</span>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Bookmarks Drawer Overlay */}
      {isBookmarksOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop blur overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsBookmarksOpen(false)}
          />
          {/* Drawer Panel Body */}
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800/85 p-5 flex flex-col h-full shadow-2xl transition-all duration-300 overflow-hidden z-10">
            <div className="flex flex-col h-full">
              <div id="favorites_header" className="flex items-center justify-between mb-4 shrink-0">
                <h3 id="fav_title" className="text-sm font-semibold text-white flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                  Your Bookmarks
                </h3>
                <div className="flex items-center gap-2">
                  <span id="fav_counter" className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    {favorites.length} Saved
                  </span>
                  <button 
                    onClick={() => setIsBookmarksOpen(false)}
                    className="p-1 px-1.5 bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-100 transition rounded-md"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-stretch overflow-hidden">
                {favorites.length === 0 ? (
                  <div id="fav_empty_state" className="border border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-950/20 flex-1 flex flex-col items-center justify-center">
                    <Bookmark className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-medium">No custom bookmarks saved.</p>
                    <p className="text-[10px] text-slate-500 mt-1.5 max-w-[200px] text-center">Tap "Bookmark" on any active stream to pin content here.</p>
                  </div>
                ) : (
                  <div id="favorites_stack" className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-full">
                    {favorites.map((fav) => (
                      <div
                        key={fav.id}
                        id={`favorite_item_${fav.id}`}
                        onClick={() => {
                          if (editingFavId !== fav.id) {
                            playSavedItem(fav);
                            setIsBookmarksOpen(false);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-1.5 transition cursor-pointer group ${
                          editingFavId === fav.id 
                            ? 'bg-slate-950 border-amber-500/50' 
                            : 'bg-slate-950/70 hover:bg-slate-950 border-slate-850'
                        }`}
                      >
                        {editingFavId === fav.id ? (
                          <div className="flex items-center gap-2 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                            <Pencil className="h-3 w-3 text-amber-500 flex-shrink-0 animate-pulse" />
                            <input
                              type="text"
                              value={editingFavTitle}
                              onChange={(e) => setEditingFavTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveRenamedBookmark(fav.id);
                                } else if (e.key === 'Escape') {
                                  setEditingFavId(null);
                                }
                              }}
                              className="bg-slate-950 border border-slate-800 text-white rounded px-1.5 py-0.5 text-xs flex-1 focus:outline-none focus:border-amber-500 min-w-0 font-medium"
                              autoFocus
                            />
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => saveRenamedBookmark(fav.id)}
                                className="text-emerald-500 hover:text-emerald-400 p-1 rouned transition"
                                title="Save"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingFavId(null)}
                                className="text-slate-400 hover:text-slate-200 p-1 rounded transition"
                                title="Cancel"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                              <Play className="h-3 w-3 text-amber-500 fill-current flex-shrink-0" />
                              <span className="truncate text-slate-200 group-hover:text-amber-300 font-semibold" title={fav.title}>{fav.title}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                id={`rename_fav_btn_${fav.id}`}
                                type="button"
                                onClick={(e) => startRenameBookmark(fav.id, fav.title, e)}
                                className="text-slate-500 hover:text-amber-450 p-1 rounded-md transition"
                                title="Rename bookmark"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                id={`delete_fav_btn_${fav.id}`}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBookmark(fav.id, e);
                                }}
                                className="text-slate-500 hover:text-red-400 p-1 rounded-md transition"
                                title="Delete bookmark"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Drawer Overlay */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop blur overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsHistoryOpen(false)}
          />
          {/* Drawer Panel Body */}
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800/85 p-5 flex flex-col h-full shadow-2xl transition-all duration-300 overflow-hidden z-10">
            <div className="flex flex-col h-full">
              <div id="history_header" className="flex items-center justify-between mb-4 shrink-0">
                <h3 id="history_title" className="text-sm font-semibold text-white flex items-center gap-2">
                  <History className="h-4 w-4 text-slate-400" />
                  Streaming History
                </h3>
                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    <button
                      id="clear_history_btn"
                      onClick={clearHistory}
                      className="text-[10px] font-semibold bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-red-400 px-2 py-1.5 rounded transition cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <button 
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-1 px-1.5 bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-100 transition rounded-md"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-stretch overflow-hidden">
                {history.length === 0 ? (
                  <div id="history_empty_state" className="border border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-950/20 flex-1 flex flex-col items-center justify-center">
                    <Clock className="h-6 w-6 text-slate-705 mx-auto mb-2" />
                    <p className="text-xs text-slate-450">Your streamed items will be listed here.</p>
                  </div>
                ) : (
                  <div id="history_stack" className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-full">
                    {history.map((hist, index) => (
                      <button
                        key={`${hist.id}-${index}`}
                        id={`history_item_${hist.id}_${index}`}
                        onClick={() => {
                          playSavedItem(hist);
                          setIsHistoryOpen(false);
                        }}
                        className="text-left w-full p-3 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-850/70 text-xs flex justify-between items-center gap-2.5 transition cursor-pointer group"
                      >
                        <span className="truncate text-slate-200 group-hover:text-amber-400 transition flex-1 font-semibold">{hist.title}</span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">{hist.timestamp}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer id="page_footer" className="bg-slate-950 border-t border-slate-900 py-6 mt-12 text-center text-xs text-slate-400">
        <div id="footer_content_container" className="w-full px-4 md:px-8 lg:px-12 flex flex-col items-center gap-1.5">
          <p className="block md:hidden text-[11px] text-slate-500 max-w-xs mx-auto font-medium">
            Ad-Free & Pop-up Free Multi-Platform Streaming Environment
          </p>
          <p id="footer_license_text">Ads-Alis - June 2026</p>
        </div>
      </footer>

    </div>
  );
}
