import { onRequestGet as __api_search_youtube_ts_onRequestGet } from "/Users/balutp3n0y/Downloads/ads-alis/functions/api/search-youtube.ts"
import { onRequestGet as __api_trending_youtube_ts_onRequestGet } from "/Users/balutp3n0y/Downloads/ads-alis/functions/api/trending-youtube.ts"

export const routes = [
    {
      routePath: "/api/search-youtube",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_search_youtube_ts_onRequestGet],
    },
  {
      routePath: "/api/trending-youtube",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_trending_youtube_ts_onRequestGet],
    },
  ]