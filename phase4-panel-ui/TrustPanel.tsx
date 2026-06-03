"use client";

import { useState } from "react";
import { EvaluationResult } from "@/types/evaluation";
import { SourceRetrievalResult } from "@/types/sources";
import { PanelTab } from "@/types/panel";
import SourcesTab from "./SourcesTab";
import AssumptionsTab from "./AssumptionsTab";
import ConfidenceTab from "./ConfidenceTab";
import DeeperTab from "./DeeperTab";

interface TrustPanelProps {
  evaluation: EvaluationResult;
  sources: SourceRetrievalResult | null;
  sourcesLoading: boolean;
  onClose: () => void;
  onAskQuestion?: (question: string) => void;
}

const TABS: { id: PanelTab; label: string; icon: string }[] = [
  { id: "sources", label: "Sources", icon: "📎" },
  { id: "assumptions", label: "Assumptions", icon: "💭" },
  { id: "confidence", label: "Confidence", icon: "📊" },
  { id: "deeper", label: "Go Deeper", icon: "🎯" },
];

export default function TrustPanel({
  evaluation,
  sources,
  sourcesLoading,
  onClose,
  onAskQuestion,
}: TrustPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>("sources");

  const tabCounts: Record<PanelTab, number | null> = {
    sources: sources
      ? sources.total_sourced
      : evaluation.claims.filter((c) => c.claim_type === "factual").length,
    assumptions: evaluation.assumptions.length,
    confidence: evaluation.confidence_segments.filter(
      (s) => s.level === "uncertain"
    ).length,
    deeper: evaluation.probe_questions.length,
  };

  return (
    <div className="border border-zinc-700 rounded-2xl bg-zinc-900 overflow-hidden shadow-2xl shadow-black/40">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-700 bg-zinc-800/50">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-sm">🔍</span>
          <span className="text-sm font-semibold text-zinc-200">
            Trust Panel
          </span>
          <span className="text-[11px] text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
            AI-generated — verify critical claims
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-lg leading-none"
          aria-label="Close panel"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-700 bg-zinc-800/30 px-2 pt-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors relative ${
              activeTab === tab.id
                ? "text-amber-400 bg-zinc-900 border border-b-zinc-900 border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tabCounts[tab.id] !== null && tabCounts[tab.id]! > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.id
                    ? "bg-amber-600/30 text-amber-400"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              >
                {tabCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 max-h-[420px] overflow-y-auto">
        {activeTab === "sources" && (
          <>
            {sourcesLoading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                <div className="w-3 h-3 border border-zinc-600 border-t-amber-500 rounded-full animate-spin" />
                Finding sources...
              </div>
            )}
            <SourcesTab
              mappings={
                sources?.mappings ||
                evaluation.claims
                  .filter((c) => c.claim_type === "factual")
                  .map((c) => ({
                    claim_id: c.id,
                    claim_text: c.text,
                    status: "unsourced" as const,
                    sources: [],
                    note: sourcesLoading
                      ? "Searching for sources..."
                      : "No sources found",
                  }))
              }
            />
          </>
        )}

        {activeTab === "assumptions" && (
          <AssumptionsTab
            assumptions={evaluation.assumptions}
            onAskQuestion={onAskQuestion}
          />
        )}

        {activeTab === "confidence" && (
          <ConfidenceTab segments={evaluation.confidence_segments} />
        )}

        {activeTab === "deeper" && (
          <DeeperTab
            questions={evaluation.probe_questions}
            onAskQuestion={onAskQuestion}
          />
        )}
      </div>
    </div>
  );
}
