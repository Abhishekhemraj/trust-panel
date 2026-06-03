"use client";

import { ClaimSourceMapping } from "@/types/sources";

interface SourcesTabProps {
  mappings: ClaimSourceMapping[];
}

export default function SourcesTab({ mappings }: SourcesTabProps) {
  if (!mappings.length) {
    return (
      <div className="text-zinc-500 text-sm py-6 text-center">
        No claims found to verify.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 mb-4">
        Every factual claim mapped to its source. Unsourced claims rely on
        general training data.
      </p>
      {mappings.map((mapping) => (
        <div
          key={mapping.claim_id}
          className="border border-zinc-700 rounded-xl p-4 space-y-3"
        >
          {/* Claim */}
          <div className="flex items-start gap-2">
            <span
              className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                mapping.status === "sourced"
                  ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800"
                  : mapping.status === "conflicting"
                  ? "bg-amber-900/40 text-amber-400 border border-amber-800"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
              }`}
            >
              {mapping.status === "sourced"
                ? "✓ sourced"
                : mapping.status === "conflicting"
                ? "⚡ conflicting"
                : "? unsourced"}
            </span>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {mapping.claim_text}
            </p>
          </div>

          {/* Note for unsourced */}
          {mapping.note && mapping.status === "unsourced" && (
            <p className="text-xs text-zinc-500 italic ml-1">{mapping.note}</p>
          )}

          {/* Sources */}
          {mapping.sources.length > 0 && (
            <div className="space-y-2 ml-1">
              {mapping.sources.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700 hover:border-zinc-600 rounded-lg p-3 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-amber-500 group-hover:text-amber-400">
                      {source.domain}
                    </span>
                    {source.publish_date && (
                      <span className="text-[11px] text-zinc-500">
                        {source.publish_date}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-300 mb-1 group-hover:text-zinc-200">
                    {source.title}
                  </p>
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {source.excerpt}
                  </p>
                  <span className="text-[11px] text-zinc-600 group-hover:text-zinc-500 mt-1 block">
                    {source.url.length > 60
                      ? source.url.slice(0, 60) + "..."
                      : source.url}{" "}
                    ↗
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Conflicting note */}
          {mapping.status === "conflicting" && (
            <p className="text-xs text-amber-400/80 ml-1">
              ⚡ Multiple sources found with differing information — verify
              independently before using.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
