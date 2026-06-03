/**
 * Converts a raw claim into a clean, effective search query.
 * Strips filler words, keeps nouns, numbers, and key phrases.
 */
export function claimToSearchQuery(claimText: string): string {
  // Remove common filler phrases that hurt search quality
  const fillerPatterns = [
    /according to (studies|research|experts|data)/gi,
    /it (is|has been|was) (shown|reported|found|estimated) that/gi,
    /research (shows|suggests|indicates|finds)/gi,
    /studies (show|suggest|indicate|find)/gi,
    /experts (say|suggest|believe|estimate)/gi,
    /approximately|roughly|about|around/gi,
    /in recent years/gi,
    /it is (important|worth noting|critical) (to note |that )?/gi,
  ];

  let query = claimText;
  fillerPatterns.forEach((pattern) => {
    query = query.replace(pattern, "");
  });

  // Clean up extra whitespace and punctuation
  query = query
    .replace(/["""'']/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Truncate to 10 words max for search effectiveness
  const words = query.split(" ");
  if (words.length > 10) {
    query = words.slice(0, 10).join(" ");
  }

  return query;
}
