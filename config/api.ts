export const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
export const GROK_MODEL = "grok-4-1-fast";

export const BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

export function getGrokHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROK_API_KEY}`,
  };
}

export function getBraveHeaders(): Record<string, string> {
  return {
    Accept: "application/json",
    "Accept-Encoding": "gzip",
    "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY || "",
  };
}
