// Helper formatter functions for matching search listings
export const formatViews = (viewCount: any): string => {
  if (!viewCount) return '1.2M views';
  const num = Number(viewCount);
  if (isNaN(num)) return String(viewCount);
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B views';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M views';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K views';
  return num + ' views';
};

export const formatDuration = (val: any): string => {
  if (!val) return '10:00';
  if (typeof val === 'string') return val;
  const totalSeconds = Number(val);
  if (isNaN(totalSeconds)) return '5:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const CURATED_OPM = [
  {
    id: "DX_8bA8fT_I",
    title: "Kathang Isip - Ben&Ben (Official Music Video)",
    channel: "Ben&Ben",
    views: "150M views",
    duration: "5:25",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/DX_8bA8fT_I/hqdefault.jpg"
  },
  {
    id: "zU9RShf7Slo",
    title: "Tadhana - Up Dharma Down (Official Lyric Video)",
    channel: "Armi Millare",
    views: "110M views",
    duration: "4:01",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/zU9RShf7Slo/hqdefault.jpg"
  },
  {
    id: "P1pwvn8_m9s",
    title: "Kung 'Di Rin Lang Ikaw - December Avenue feat. Moira Dela Torre",
    channel: "December Avenue",
    views: "185M views",
    duration: "5:32",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/P1pwvn8_m9s/hqdefault.jpg"
  },
  {
    id: "yvU_r-9f_8E",
    title: "Kahit Ayaw Mo Na - This Band (Official Music Video)",
    channel: "This Band",
    views: "98M views",
    duration: "4:03",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/yvU_r-9f_8E/hqdefault.jpg"
  },
  {
    id: "8s76W-S8vP4",
    title: "Paraluman - Adie (Official Lyric Video)",
    channel: "Adie",
    views: "42M views",
    duration: "5:12",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/8s76W-S8vP4/hqdefault.jpg"
  },
  {
    id: "6_8qA8bYv_o",
    title: "Binibini - Zack Tabudlo (Official Music Video)",
    channel: "Zack Tabudlo",
    views: "64M views",
    duration: "4:40",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/6_8qA8bYv_o/hqdefault.jpg"
  },
  {
    id: "L7X_R8vT_mI",
    title: "Pagsamo - Arthur Nery (Official Lyric Video)",
    channel: "Arthur Nery",
    views: "92M views",
    duration: "5:00",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/L7X_R8vT_mI/hqdefault.jpg"
  },
  {
    id: "S6bB8P6HnGA",
    title: "Ang Huling El Bimbo - Eraserheads Live",
    channel: "Eraserheads",
    views: "45M views",
    duration: "6:15",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/S6bB8P6HnGA/hqdefault.jpg"
  },
  {
    id: "B_X5fD8UfI0",
    title: "Kisapmata - Rivermaya Classics",
    channel: "Rivermaya",
    views: "25M views",
    duration: "4:41",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/B_X5fD8UfI0/hqdefault.jpg"
  },
  {
    id: "vO689_L0Efg",
    title: "Huling Sandali - December Avenue (Mina-Anud OST Official MV)",
    channel: "December Avenue",
    views: "72M views",
    duration: "5:42",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/vO689_L0Efg/hqdefault.jpg"
  },
  {
    id: "C_XQb_8XF0j",
    title: "Tagpuan - Moira Dela Torre (Official Video)",
    channel: "Moira Dela Torre",
    views: "80M views",
    duration: "4:20",
    category: "Trending",
    thumbnailUrl: "https://img.youtube.com/vi/C_XQb_8XF0j/hqdefault.jpg"
  }
];

export async function searchYouTube(query: string): Promise<any[]> {
  console.log(`[Proxy] Performing server-side YouTube search for: "${query}"`);

  // 1. Primary Strategy: Direct Official YouTube search scraping!
  try {
    console.log(`[Proxy-Direct] Attempting direct fetch from Youtube...`);
    const directUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
    const searchRes = await fetch(directUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Cache-Control': 'no-cache'
      }
    });

    if (searchRes.ok) {
      const html = await searchRes.text();
      let jsonStr = '';
      const startIndex = html.indexOf('ytInitialData = ');
      if (startIndex !== -1) {
        const dataStart = startIndex + 'ytInitialData = '.length;
        const slice = html.slice(dataStart, dataStart + 1500000);
        const endIndex = slice.indexOf(';</script>');
        if (endIndex !== -1) {
          jsonStr = slice.slice(0, endIndex);
        } else {
          const endSemicolon = slice.indexOf('};');
          if (endSemicolon !== -1) {
            jsonStr = slice.slice(0, endSemicolon + 1);
          }
        }
      }

      if (jsonStr) {
        try {
          const data = JSON.parse(jsonStr);
          const results: any[] = [];
          const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
          
          if (Array.isArray(contents)) {
            for (const section of contents) {
              const items = section?.itemSectionRenderer?.contents;
              if (!Array.isArray(items)) continue;
              
              for (const item of items) {
                if (item?.videoRenderer) {
                  const v = item.videoRenderer;
                  const videoId = v.videoId;
                  if (!videoId) continue;
                  
                  let title = 'Untitled Video';
                  if (v.title?.runs && v.title.runs[0]?.text) {
                    title = v.title.runs[0].text;
                  } else if (v.title?.simpleText) {
                    title = v.title.simpleText;
                  }
                  
                  let channel = 'YouTube Creator';
                  if (v.ownerText?.runs && v.ownerText.runs[0]?.text) {
                    channel = v.ownerText.runs[0].text;
                  } else if (v.longBylineText?.runs && v.longBylineText.runs[0]?.text) {
                    channel = v.longBylineText.runs[0].text;
                  }
                  
                  let views = 'View count unavailable';
                  if (v.viewCountText?.simpleText) {
                    views = v.viewCountText.simpleText;
                  } else if (v.shortViewCountText?.simpleText) {
                    views = v.shortViewCountText.simpleText;
                  } else if (v.viewCountText?.runs && v.viewCountText.runs[0]?.text) {
                    views = v.viewCountText.runs[0].text;
                  }
                  
                  let duration = '0:00';
                  if (v.lengthText?.simpleText) {
                    duration = v.lengthText.simpleText;
                  } else if (v.lengthText?.runs && v.lengthText.runs[0]?.text) {
                    duration = v.lengthText.runs[0].text;
                  }
                  
                  let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                  if (v.thumbnail?.thumbnails && Array.isArray(v.thumbnail.thumbnails) && v.thumbnail.thumbnails.length > 0) {
                    thumbnailUrl = v.thumbnail.thumbnails[v.thumbnail.thumbnails.length - 1].url || thumbnailUrl;
                  }
                  
                  results.push({
                    id: videoId,
                    title,
                    channel,
                    views,
                    duration,
                    category: 'Trending',
                    thumbnailUrl
                  });
                }
              }
            }
          }

          if (results.length > 0) {
            console.log(`[Proxy-Direct] Successfully fetched ${results.length} results directly from search-query scrape.`);
            return results;
          }
        } catch (jsonErr) {
          console.warn('[Proxy-Direct] ytInitialData JSON parsing failed, trying fallbacks...', jsonErr);
        }
      }
    } else {
      console.warn(`[Proxy-Direct] Direct stream fetch returned HTTP ${searchRes.status}. Trying fallbacks...`);
    }
  } catch (directErr) {
    console.warn('[Proxy-Direct] Direct scrape failed. Swapping instantly to Piped/Invidious races...', directErr);
  }

  // 2. Fallback: Race multiple Invidious & Piped servers
  const candidates = [
    { url: `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`, type: 'piped' },
    { url: `https://pipedapi.lunar.icu/search?q=${encodeURIComponent(query)}&filter=videos`, type: 'piped' },
    { url: `https://pipedapi.ducks.party/search?q=${encodeURIComponent(query)}&filter=videos`, type: 'piped' },
    { url: `https://piped-api.garudalinux.org/search?q=${encodeURIComponent(query)}&filter=videos`, type: 'piped' },
    { url: `https://pipedapi.us.to/search?q=${encodeURIComponent(query)}&filter=videos`, type: 'piped' },
    { url: `https://pipedapi.silk.co/search?q=${encodeURIComponent(query)}&filter=videos`, type: 'piped' },
    { url: `https://inv.tux.im/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: 'invidious' },
    { url: `https://yewtu.be/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: 'invidious' },
    { url: `https://vid.puffyan.us/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: 'invidious' },
    { url: `https://invidious.projectsegfau.lt/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: 'invidious' },
    { url: `https://iv.ggtyler.dev/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: 'invidious' },
    { url: `https://inv.river.space/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: 'invidious' }
  ];

  const fetchWithTimeout = async (url: string, timeoutMs: number) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  const fetchAndParse = async (endpoint: typeof candidates[0]) => {
    try {
      const res = await fetchWithTimeout(endpoint.url, 4000);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      
      let parsedVideos: any[] = [];
      
      if (endpoint.type === 'piped') {
        const items = data.items || [];
        parsedVideos = items
          .filter((item: any) => item.type === 'stream' && item.url && !item.isLive)
          .map((item: any) => {
            let vidId = '';
            if (item.url) {
              if (item.url.includes('v=')) {
                vidId = item.url.split('v=')[1]?.split('&')[0] || '';
              } else if (item.url.includes('/watch/')) {
                vidId = item.url.split('/watch/')[1]?.split('?')[0] || '';
              } else {
                const parts = item.url.split('/');
                vidId = parts[parts.length - 1]?.split('?')[0] || '';
              }
            }
            return {
              id: vidId,
              title: item.title || 'Untitled Stream',
              channel: item.uploaderName || 'YouTube Creator',
              views: item.views ? formatViews(item.views) : item.uploadedDate || 'View count unavailable',
              duration: formatDuration(item.duration),
              category: 'Trending',
              thumbnailUrl: item.thumbnail || `https://img.youtube.com/vi/${vidId}/mqdefault.jpg`
            };
          })
          .filter((v: any) => v.id);
      } else {
        if (!Array.isArray(data)) throw new Error('Invidious response not an array');
        parsedVideos = data
          .filter((item: any) => item.type === 'video' && item.videoId && !item.liveNow)
          .map((item: any) => ({
            id: item.videoId,
            title: item.title || 'Untitled Video',
            channel: item.author || 'YouTube Creator',
            views: formatViews(item.viewCount) || item.publishedText || 'View count unavailable',
            duration: formatDuration(item.lengthSeconds),
            category: 'Trending',
            thumbnailUrl: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`
          }))
          .filter((v: any) => v.id);
      }
      
      if (parsedVideos.length === 0) throw new Error('No valid playable videos in response');
      console.log(`[Proxy-Instance] Successful fallback search from ${endpoint.url} with ${parsedVideos.length} videos.`);
      return parsedVideos;
    } catch (e: any) {
      throw new Error(`Instance failed: ${endpoint.url} - ${e?.message}`);
    }
  };

  try {
    const winningResults = await Promise.any(candidates.map(candidate => fetchAndParse(candidate)));
    return winningResults;
  } catch (err: any) {
    console.warn('[Proxy] All backends failed or timed out. Returning OPM static fallback list.', err);
    return CURATED_OPM;
  }
}
