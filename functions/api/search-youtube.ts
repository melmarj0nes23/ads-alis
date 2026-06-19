import { searchYouTube } from "../../src/lib/youtube";

export const onRequestGet: PagesFunction = async (context) => {
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
};
