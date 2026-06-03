export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_MODEL = "llama-3.3-70b-versatile";

export const BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

export function getGroqHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  };
}

export function getBraveHeaders(): Record<string, string> {
  return {
    Accept: "application/json",
    "Accept-Encoding": "gzip",
    "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY || "",
  };
}