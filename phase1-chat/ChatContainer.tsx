"use client";

import { useRef } from "react";
import { useChatApi } from "./useChatApi";
import { useEvaluation } from "@/phase2-evaluation/useEvaluation";
import { useSources } from "@/phase3-sources/useSources";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatContainer() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChatApi();
  const { evaluate, getEvaluation } = useEvaluation();
  const { fetchSources, getSources } = useSources();
  const chatInputRef = useRef<{ setInput: (v: string) => void } | null>(null);

  const handleSend = async (text: string) => {
    const result = await sendMessage(text);
    if (result?.message && result?.raw_content) {
      const evalResult = await evaluate(
        result.message.id,
        text,
        result.raw_content
      );
      if (evalResult?.claims?.length) {
        fetchSources(result.message.id, evalResult.claims);
      }
    }
  };

  const handleAskQuestion = (question: string) => {
    chatInputRef.current?.setInput(question);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700 bg-zinc-900 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-100">
              Trust Panel
            </h1>
            <p className="text-[11px] text-zinc-500">
              Evaluate AI outputs with confidence
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800"
          >
            Clear chat
          </button>
        )}
      </header>

      {error && (
        <div className="bg-red-900/30 border-b border-red-800 px-6 py-2 text-red-300 text-xs shrink-0">
          {error}
        </div>
      )}

      <MessageList
        messages={messages}
        isLoading={isLoading}
        getEvaluation={getEvaluation}
        getSources={getSources}
        onAskQuestion={handleAskQuestion}
      />

      <ChatInput
        ref={chatInputRef}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}
