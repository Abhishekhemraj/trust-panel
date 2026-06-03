import { ExtractedClaim } from "@/types/evaluation";
import { ClaimSourceMapping, Source, SourceRetrievalResult } from "@/types/sources";
import { claimToSearchQuery } from "./searchQuery";

export async function retrieveSources(
  claims: ExtractedClaim[]
): Promise<SourceRetrievalResult> {
  // Only search for factual claims — opinions/recommendations don't need sourcing
  const factualClaims = claims.filter((c) => c.claim_type === "factual");
  const nonFactualClaims = claims.filter((c) => c.claim_type !== "factual");

  // Map non-factual claims as unsourced by nature
  const nonFactualMappings: ClaimSourceMapping[] = nonFactualClaims.map((c) => ({
    claim_id: c.id,
    claim_text: c.text,
    status: "unsourced",
    sources: [],
    note: `This is an ${c.claim_type} — source verification not applicable`,
  }));

  // Search for each factual claim in parallel
  const factualMappings = await Promise.all(
    factualClaims.map((claim) => searchForClaim(claim))
  );

  const allMappings = [...factualMappings, ...nonFactualMappings];

  return {
    mappings: allMappings,
    total_sourced: allMappings.filter((m) => m.status === "sourced").length,
    total_unsourced: allMappings.filter((m) => m.status === "unsourced").length,
    total_conflicting: allMappings.filter((m) => m.status === "conflicting").length,
  };
}

async function searchForClaim(claim: ExtractedClaim): Promise<ClaimSourceMapping> {
  try {
    const query = claimToSearchQuery(claim.text);

    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, claim_id: claim.id }),
    });

    if (!response.ok) {
      return unsourcedMapping(claim, "Search unavailable");
    }

    const data = await response.json();
    const sources: Source[] = data.sources || [];

    if (sources.length === 0) {
      return unsourcedMapping(claim, "No sources found — based on general training data");
    }

    // If multiple sources with conflicting signals, mark as conflicting
    const status = sources.length >= 2 && data.has_conflict ? "conflicting" : "sourced";

    return {
      claim_id: claim.id,
      claim_text: claim.text,
      status,
      sources,
      note: status === "conflicting" ? "Multiple sources found with differing information" : undefined,
    };
  } catch {
    return unsourcedMapping(claim, "Search error — based on general training data");
  }
}

function unsourcedMapping(claim: ExtractedClaim, note: string): ClaimSourceMapping {
  return {
    claim_id: claim.id,
    claim_text: claim.text,
    status: "unsourced",
    sources: [],
    note,
  };
}
