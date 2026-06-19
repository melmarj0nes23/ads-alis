import { searchYouTube, CURATED_OPM } from "../../src/lib/youtube";

export const onRequestGet: PagesFunction = async () => {
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
};
