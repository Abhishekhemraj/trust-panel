"use client";

import { useState } from "react";
import { ChatMessage } from "@/types/chat";
import { EvaluationResult } from "@/types/evaluation";
import { SourceRetrievalResult } from "@/types/sources";
import TrustBar from "@/phase4-panel-ui/TrustBar";
import TrustPanel from "@/phase4-panel-ui/TrustPanel";

interface MessageBubbleProps {
  message: ChatMessage;
  evaluation?: {
    result: EvaluationResult | null;
    isLoading: boolean;
    error: string | null;
  } | null;
  sources?: {
    result: SourceRetrievalResult | null;
    isLoading: boolean;
    error: string | null;
  } | null;
  onAskQuestion?: (question: string) => void;
}

export default function MessageBubble({
  message,
  evaluation,
  sources,
  onAskQuestion,
}: MessageBubbleProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const isUser = message.role === "user";
  const evalResult = evaluation?.result;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`${isUser ? "max-w-[75%]" : "w-full max-w-[90%]"}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-5 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-amber-600 text-white rounded-br-md"
              : "bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-bl-md"
          }`}
        >
          {!isUser && (
            <div className="text-[11px] text-zinc-400 font-medium mb-1.5 uppercase tracking-wide">
              Claude
            </div>
          )}
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {/* Trust bar — only for assistant messages */}
        {!isUser && (
          <div className="mt-1">
            {evaluation?.isLoading && !evalResult && (
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-2 ml-1">
                <div className="w-3 h-3 border border-zinc-600 border-t-amber-500 rounded-full animate-spin" />
                Analysing response...
              </div>
            )}

            {evalResult && (
              <TrustBar
                evaluation={evalResult}
                sources={sources?.result ?? null}
                sourcesLoading={sources?.isLoading ?? false}
                evalLoading={evaluation?.isLoading ?? false}
                isExpanded={isPanelOpen}
                onToggle={() => setIsPanelOpen((v) => !v)}
              />
            )}

            {evaluation?.error && !evaluation.isLoading && (
              <div className="text-[11px] text-red-400/70 mt-2 ml-1">
                Could not evaluate this response
              </div>
            )}

            {/* Expanded Trust Panel */}
            {isPanelOpen && evalResult && (
              <div className="mt-3">
                <TrustPanel
                  evaluation={evalResult}
                  sources={sources?.result ?? null}
                  sourcesLoading={sources?.isLoading ?? false}
                  onClose={() => setIsPanelOpen(false)}
                  onAskQuestion={(q) => {
                    setIsPanelOpen(false);
                    onAskQuestion?.(q);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
