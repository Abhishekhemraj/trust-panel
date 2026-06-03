"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import { EvaluationResult } from "@/types/evaluation";
import { SourceRetrievalResult } from "@/types/sources";
import MessageBubble from "./MessageBubble";

interface EvalState {
  result: EvaluationResult | null;
  isLoading: boolean;
  error: string | null;
}

interface SrcState {
  result: SourceRetrievalResult | null;
  isLoading: boolean;
  error: string | null;
}

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  getEvaluation: (id: string) => EvalState;
  getSources: (id: string) => SrcState;
  onAskQuestion: (question: string) => void;
}

export default function MessageList({
  messages,
  isLoading,
  getEvaluation,
  getSources,
  onAskQuestion,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 mt-32">
            <div className="text-5xl mb-5">🔍</div>
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">
              Trust Panel for Claude
            </h2>
            <p className="text-sm max-w-sm mx-auto leading-relaxed">
              Ask anything. After each response, tap the trust bar to see
              sources, assumptions, confidence levels, and probe questions.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "What are the best strategies for entering the Indian SaaS market?",
                "How do I negotiate a salary raise?",
                "Explain the risks of investing in crypto",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onAskQuestion(suggestion)}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 px-4 py-2 rounded-xl transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            evaluation={msg.role === "assistant" ? getEvaluation(msg.id) : null}
            sources={msg.role === "assistant" ? getSources(msg.id) : null}
            onAskQuestion={onAskQuestion}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-md px-5 py-3">
              <div className="text-[11px] text-zinc-400 font-medium mb-1.5 uppercase tracking-wide">
                Claude
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
