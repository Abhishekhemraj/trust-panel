"use client";

import { EvaluationResult } from "@/types/evaluation";
import { SourceRetrievalResult } from "@/types/sources";

interface TrustBarProps {
  evaluation: EvaluationResult;
  sources: SourceRetrievalResult | null;
  sourcesLoading: boolean;
  evalLoading: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function TrustBar({
  evaluation,
  sources,
  sourcesLoading,
  evalLoading,
  isExpanded,
  onToggle,
}: TrustBarProps) {
  if (evalLoading) {
    return (
      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-2 ml-1">
        <div className="w-3 h-3 border border-zinc-600 border-t-amber-500 rounded-full animate-spin" />
        Analysing response...
      </div>
    );
  }

  const factualCount = evaluation.claims.filter(
    (c) => c.claim_type === "factual"
  ).length;
  const sourcedCount = sources?.total_sourced ?? null;
  const unsourcedCount = sources?.total_unsourced ?? null;
  const assumptionCount = evaluation.assumptions.length;
  const uncertainCount = evaluation.confidence_segments.filter(
    (s) => s.level === "uncertain"
  ).length;

  return (
    <button
      onClick={onToggle}
      className={`mt-2 ml-1 flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-lg border transition-all w-fit group ${
        isExpanded
          ? "border-amber-600/60 bg-amber-900/10 text-zinc-300"
          : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-amber-600/50 hover:text-zinc-300"
      }`}
    >
      {/* Sources pill */}
      <span className="flex items-center gap-1">
        <span>📎</span>
        <span>
          {sourcesLoading
            ? `${factualCount} claims`
            : sourcedCount !== null
            ? `${sourcedCount} sourced`
            : `${factualCount} claims`}
        </span>
      </span>

      <span className="text-zinc-600">·</span>

      {/* Assumptions pill */}
      <span className="flex items-center gap-1">
        <span>💭</span>
        <span>{assumptionCount} assumptions</span>
      </span>

      <span className="text-zinc-600">·</span>

      {/* Uncertain pill */}
      <span
        className={`flex items-center gap-1 ${
          uncertainCount > 0 ? "text-amber-500/80" : ""
        }`}
      >
        <span>⚠️</span>
        <span>{uncertainCount} uncertain</span>
      </span>

      {/* Unsourced pill */}
      {unsourcedCount !== null && unsourcedCount > 0 && (
        <>
          <span className="text-zinc-600">·</span>
          <span className="text-red-400/80">{unsourcedCount} unsourced</span>
        </>
      )}

      <span className="text-zinc-600">·</span>

      <span
        className={`transition-colors ${
          isExpanded
            ? "text-amber-400"
            : "text-amber-500/80 group-hover:text-amber-400"
        }`}
      >
        {isExpanded ? "Close ×" : "Review →"}
      </span>
    </button>
  );
}
