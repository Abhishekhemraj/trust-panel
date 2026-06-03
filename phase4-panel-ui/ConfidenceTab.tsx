"use client";

import { ConfidenceSegment } from "@/types/evaluation";

interface ConfidenceTabProps {
  segments: ConfidenceSegment[];
}

const levelConfig = {
  "well-supported": {
    label: "Well supported",
    color: "text-emerald-400",
    bg: "bg-emerald-900/20 border-emerald-800",
    badge: "bg-emerald-900/40 text-emerald-400 border border-emerald-800",
    icon: "✓",
    bar: "bg-emerald-500",
    width: "w-full",
  },
  "partially-supported": {
    label: "Partially supported",
    color: "text-amber-400",
    bg: "bg-amber-900/10 border-amber-800/50",
    badge: "bg-amber-900/40 text-amber-400 border border-amber-800",
    icon: "~",
    bar: "bg-amber-500",
    width: "w-2/3",
  },
  uncertain: {
    label: "Uncertain",
    color: "text-red-400",
    bg: "bg-red-900/10 border-red-800/50",
    badge: "bg-red-900/40 text-red-400 border border-red-800",
    icon: "?",
    bar: "bg-red-500",
    width: "w-1/3",
  },
};

export default function ConfidenceTab({ segments }: ConfidenceTabProps) {
  if (!segments.length) {
    return (
      <div className="text-zinc-500 text-sm py-6 text-center">
        No confidence data available.
      </div>
    );
  }

  const wellCount = segments.filter(
    (s) => s.level === "well-supported"
  ).length;
  const partialCount = segments.filter(
    (s) => s.level === "partially-supported"
  ).length;
  const uncertainCount = segments.filter((s) => s.level === "uncertain").length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 mb-4">
        <p className="text-xs text-zinc-400 mb-3 font-medium uppercase tracking-wide">
          Response confidence overview
        </p>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {wellCount} well supported
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            {partialCount} partial
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            {uncertainCount} uncertain
          </span>
        </div>
        {/* Visual bar */}
        <div className="mt-3 h-2 bg-zinc-700 rounded-full overflow-hidden flex">
          {wellCount > 0 && (
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(wellCount / segments.length) * 100}%` }}
            />
          )}
          {partialCount > 0 && (
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(partialCount / segments.length) * 100}%` }}
            />
          )}
          {uncertainCount > 0 && (
            <div
              className="bg-red-500 h-full"
              style={{ width: `${(uncertainCount / segments.length) * 100}%` }}
            />
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Each section of the response assessed individually with a plain-language
        reason.
      </p>

      {segments.map((segment, i) => {
        const config = levelConfig[segment.level];
        return (
          <div
            key={i}
            className={`border rounded-xl p-4 ${config.bg} space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}
              >
                {config.icon} {config.label}
              </span>
              <span className="text-[11px] text-zinc-500">
                Section {segment.segment_index + 1}
              </span>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed">
              {segment.segment_text.length > 200
                ? segment.segment_text.slice(0, 200) + "..."
                : segment.segment_text}
            </p>

            <div className="flex items-start gap-2 pt-1">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium mt-0.5 shrink-0">
                Why:
              </span>
              <p className={`text-xs ${config.color} leading-relaxed`}>
                {segment.reason}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
