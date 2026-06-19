var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.wrangler/tmp/bundle-JcUeoC/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// ../src/lib/youtube.ts
var formatViews = /* @__PURE__ */ __name((viewCount) => {
  if (!viewCount)
    return "1.2M views";
  const num = Number(viewCount);
  if (isNaN(num))
    return String(viewCount);
  if (num >= 1e9)
    return (num / 1e9).toFixed(1) + "B views";
  if (num >= 1e6)
    return (num / 1e6).toFixed(1) + "M views";
  if (num >= 1e3)
    return (num / 1e3).toFixed(0) + "K views";
  return num + " views";
}, "formatViews");
var formatDuration = /* @__PURE__ */ __name((val) => {
  if (!val)
    return "10:00";
  if (typeof val === "string")
    return val;
  const totalSeconds = Number(val);
  if (isNaN(totalSeconds))
    return "5:00";
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor(totalSeconds % 3600 / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}, "formatDuration");
var CURATED_OPM = [
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
async function searchYouTube(query) {
  console.log(`[Proxy] Performing server-side YouTube search for: "${query}"`);
  try {
    console.log(`[Proxy-Direct] Attempting direct fetch from Youtube...`);
    const directUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
    const searchRes = await fetch(directUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Cache-Control": "no-cache"
      }
    });
    if (searchRes.ok) {
      const html = await searchRes.text();
      let jsonStr = "";
      const startIndex = html.indexOf("ytInitialData = ");
      if (startIndex !== -1) {
        const dataStart = startIndex + "ytInitialData = ".length;
        const slice = html.slice(dataStart, dataStart + 15e5);
        const endIndex = slice.indexOf(";<\/script>");
        if (endIndex !== -1) {
          jsonStr = slice.slice(0, endIndex);
        } else {
          const endSemicolon = slice.indexOf("};");
          if (endSemicolon !== -1) {
            jsonStr = slice.slice(0, endSemicolon + 1);
          }
        }
      }
      if (jsonStr) {
        try {
          const data = JSON.parse(jsonStr);
          const results = [];
          const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
          if (Array.isArray(contents)) {
            for (const section of contents) {
              const items = section?.itemSectionRenderer?.contents;
              if (!Array.isArray(items))
                continue;
              for (const item of items) {
                if (item?.videoRenderer) {
                  const v = item.videoRenderer;
                  const videoId = v.videoId;
                  if (!videoId)
                    continue;
                  let title = "Untitled Video";
                  if (v.title?.runs && v.title.runs[0]?.text) {
                    title = v.title.runs[0].text;
                  } else if (v.title?.simpleText) {
                    title = v.title.simpleText;
                  }
                  let channel = "YouTube Creator";
                  if (v.ownerText?.runs && v.ownerText.runs[0]?.text) {
                    channel = v.ownerText.runs[0].text;
                  } else if (v.longBylineText?.runs && v.longBylineText.runs[0]?.text) {
                    channel = v.longBylineText.runs[0].text;
                  }
                  let views = "View count unavailable";
                  if (v.viewCountText?.simpleText) {
                    views = v.viewCountText.simpleText;
                  } else if (v.shortViewCountText?.simpleText) {
                    views = v.shortViewCountText.simpleText;
                  } else if (v.viewCountText?.runs && v.viewCountText.runs[0]?.text) {
                    views = v.viewCountText.runs[0].text;
                  }
                  let duration = "0:00";
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
                    category: "Trending",
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
          console.warn("[Proxy-Direct] ytInitialData JSON parsing failed, trying fallbacks...", jsonErr);
        }
      }
    } else {
      console.warn(`[Proxy-Direct] Direct stream fetch returned HTTP ${searchRes.status}. Trying fallbacks...`);
    }
  } catch (directErr) {
    console.warn("[Proxy-Direct] Direct scrape failed. Swapping instantly to Piped/Invidious races...", directErr);
  }
  const candidates = [
    { url: `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`, type: "piped" },
    { url: `https://pipedapi.lunar.icu/search?q=${encodeURIComponent(query)}&filter=videos`, type: "piped" },
    { url: `https://pipedapi.ducks.party/search?q=${encodeURIComponent(query)}&filter=videos`, type: "piped" },
    { url: `https://piped-api.garudalinux.org/search?q=${encodeURIComponent(query)}&filter=videos`, type: "piped" },
    { url: `https://pipedapi.us.to/search?q=${encodeURIComponent(query)}&filter=videos`, type: "piped" },
    { url: `https://pipedapi.silk.co/search?q=${encodeURIComponent(query)}&filter=videos`, type: "piped" },
    { url: `https://inv.tux.im/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: "invidious" },
    { url: `https://yewtu.be/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: "invidious" },
    { url: `https://vid.puffyan.us/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: "invidious" },
    { url: `https://invidious.projectsegfau.lt/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: "invidious" },
    { url: `https://iv.ggtyler.dev/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: "invidious" },
    { url: `https://inv.river.space/api/v1/search?q=${encodeURIComponent(query)}&type=video`, type: "invidious" }
  ];
  const fetchWithTimeout = /* @__PURE__ */ __name(async (url, timeoutMs) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }, "fetchWithTimeout");
  const fetchAndParse = /* @__PURE__ */ __name(async (endpoint) => {
    try {
      const res = await fetchWithTimeout(endpoint.url, 4e3);
      if (!res.ok)
        throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      let parsedVideos = [];
      if (endpoint.type === "piped") {
        const items = data.items || [];
        parsedVideos = items.filter((item) => item.type === "stream" && item.url && !item.isLive).map((item) => {
          let vidId = "";
          if (item.url) {
            if (item.url.includes("v=")) {
              vidId = item.url.split("v=")[1]?.split("&")[0] || "";
            } else if (item.url.includes("/watch/")) {
              vidId = item.url.split("/watch/")[1]?.split("?")[0] || "";
            } else {
              const parts = item.url.split("/");
              vidId = parts[parts.length - 1]?.split("?")[0] || "";
            }
          }
          return {
            id: vidId,
            title: item.title || "Untitled Stream",
            channel: item.uploaderName || "YouTube Creator",
            views: item.views ? formatViews(item.views) : item.uploadedDate || "View count unavailable",
            duration: formatDuration(item.duration),
            category: "Trending",
            thumbnailUrl: item.thumbnail || `https://img.youtube.com/vi/${vidId}/mqdefault.jpg`
          };
        }).filter((v) => v.id);
      } else {
        if (!Array.isArray(data))
          throw new Error("Invidious response not an array");
        parsedVideos = data.filter((item) => item.type === "video" && item.videoId && !item.liveNow).map((item) => ({
          id: item.videoId,
          title: item.title || "Untitled Video",
          channel: item.author || "YouTube Creator",
          views: formatViews(item.viewCount) || item.publishedText || "View count unavailable",
          duration: formatDuration(item.lengthSeconds),
          category: "Trending",
          thumbnailUrl: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`
        })).filter((v) => v.id);
      }
      if (parsedVideos.length === 0)
        throw new Error("No valid playable videos in response");
      console.log(`[Proxy-Instance] Successful fallback search from ${endpoint.url} with ${parsedVideos.length} videos.`);
      return parsedVideos;
    } catch (e) {
      throw new Error(`Instance failed: ${endpoint.url} - ${e?.message}`);
    }
  }, "fetchAndParse");
  try {
    const winningResults = await Promise.any(candidates.map((candidate) => fetchAndParse(candidate)));
    return winningResults;
  } catch (err) {
    console.warn("[Proxy] All backends failed or timed out. Returning OPM static fallback list.", err);
    return CURATED_OPM;
  }
}
__name(searchYouTube, "searchYouTube");

// api/search-youtube.ts
var onRequestGet = /* @__PURE__ */ __name(async (context) => {
  const url = new URL(context.request.url);
  const query = url.searchParams.get("q");
  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query parameter q" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const results = await searchYouTube(query);
    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("[Proxy-Search] Failed searchYouTube:", err);
    return new Response(JSON.stringify({ results: [], error: "All backends timed out. Please try again." }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");

// api/trending-youtube.ts
var onRequestGet2 = /* @__PURE__ */ __name(async () => {
  console.log(`[Proxy-Trending] Dynamically loading live OPM feed for main page...`);
  try {
    const results = await searchYouTube("pinoy opm");
    if (results && results.length > 0) {
      return new Response(JSON.stringify({ results }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ results: CURATED_OPM }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("[Proxy-Trending] Failed searchYouTube. Serving CURATED_OPM fallback list...", err);
    return new Response(JSON.stringify({ results: CURATED_OPM }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");

// ../.wrangler/tmp/pages-bFWigS/functionsRoutes-0.9717134832372509.mjs
var routes = [
  {
    routePath: "/api/search-youtube",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/trending-youtube",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: () => {
            isFailOpen = true;
          }
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-JcUeoC/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-JcUeoC/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.7910895465433068.mjs.map
