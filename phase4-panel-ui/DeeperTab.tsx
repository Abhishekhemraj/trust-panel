"use client";

import { ProbeQuestion } from "@/types/evaluation";

interface DeeperTabProps {
  questions: ProbeQuestion[];
  onAskQuestion?: (question: string) => void;
}

export default function DeeperTab({ questions, onAskQuestion }: DeeperTabProps) {
  if (!questions.length) {
    return (
      <div className="text-zinc-500 text-sm py-6 text-center">
        No probe questions generated.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 mb-4">
        Questions to consider before acting on this response. These are specific
        to what was just generated — not generic advice.
      </p>

      {questions.map((q, i) => (
        <div
          key={q.id}
          className="border border-zinc-700 rounded-xl p-4 space-y-3 hover:border-zinc-600 transition-colors"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0">
              {i === 0 ? "🎯" : i === 1 ? "🔍" : "💡"}
            </span>
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-zinc-200 leading-relaxed">
                {q.question}
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">{q.context}</p>

              {onAskQuestion && (
                <button
                  onClick={() => onAskQuestion(q.question)}
                  className="mt-2 text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 hover:border-amber-600/50 text-zinc-300 hover:text-zinc-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>↩</span>
                  Ask this in chat
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4">
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="text-zinc-400 font-medium">Why these questions?</span>{" "}
          Asking targeted follow-ups is how you develop a sharper intuition for
          evaluating AI outputs. Over time, you&apos;ll start catching these gaps
          before the panel does.
        </p>
      </div>
    </div>
  );
}
