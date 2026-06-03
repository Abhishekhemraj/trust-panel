import { NextRequest, NextResponse } from "next/server";
import { BRAVE_SEARCH_URL, getBraveHeaders } from "@/config/api";
import { Source } from "@/types/sources";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, claim_id } = body;

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const braveKey = process.env.BRAVE_SEARCH_API_KEY;

    // If no Brave key, return mock data so the UI still works
    if (!braveKey || braveKey === "your_brave_search_key_here") {
      return NextResponse.json(getMockSources(query, claim_id));
    }

    const searchUrl = `${BRAVE_SEARCH_URL}?q=${encodeURIComponent(query)}&count=3&text_decorations=false&search_lang=en`;

    const response = await fetch(searchUrl, {
      headers: getBraveHeaders(),
    });

    if (!response.ok) {
      console.error("Brave Search error:", response.status);
      return NextResponse.json(getMockSources(query, claim_id));
    }

    const data = await response.json();
    const webResults = data.web?.results || [];

    const sources: Source[] = webResults.slice(0, 3).map((r: any, i: number) => ({
      id: `source_${claim_id}_${i}`,
      title: r.title || "Untitled",
      url: r.url || "",
      excerpt: r.description || r.extra_snippets?.[0] || "No excerpt available",
      publish_date: r.age || undefined,
      domain: extractDomain(r.url || ""),
    }));

    // Simple conflict detection: if top sources have very different domains
    const has_conflict = sources.length >= 2 &&
      sources[0].domain !== sources[1].domain &&
      hasConflictingSignals(webResults);

    return NextResponse.json({ sources, has_conflict });
  } catch (error) {
    console.error("Search route error:", error);
    return NextResponse.json({ sources: [], has_conflict: false });
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function hasConflictingSignals(results: any[]): boolean {
  // Basic heuristic: check if result descriptions contain opposing signal words
  const positiveWords = ["confirms", "supports", "proves", "shows", "increases"];
  const negativeWords = ["contradicts", "disputes", "refutes", "declines", "decreases"];

  const texts = results.slice(0, 2).map((r: any) =>
    (r.description || "").toLowerCase()
  );

  const hasPositive = texts.some((t) => positiveWords.some((w) => t.includes(w)));
  const hasNegative = texts.some((t) => negativeWords.some((w) => t.includes(w)));

  return hasPositive && hasNegative;
}

// Mock sources for when no Brave API key is configured
function getMockSources(query: string, claim_id: string) {
  return {
    sources: [
      {
        id: `source_${claim_id}_mock_1`,
        title: `Search result for: "${query}"`,
        url: "https://example.com/result-1",
        excerpt:
          "This is a mock source. Add your Brave Search API key to .env.local to see real sources.",
        domain: "example.com",
      },
      {
        id: `source_${claim_id}_mock_2`,
        title: `Related article: "${query}"`,
        url: "https://example.com/result-2",
        excerpt:
          "Second mock source. Get a free Brave Search API key at brave.com/search/api",
        domain: "example.com",
      },
    ],
    has_conflict: false,
    is_mock: true,
  };
}
