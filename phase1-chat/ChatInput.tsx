"use client";

import { useState, KeyboardEvent, forwardRef, useImperativeHandle } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export interface ChatInputHandle {
  setInput: (value: string) => void;
}

const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  ({ onSend, isLoading }, ref) => {
    const [input, setInput] = useState("");

    useImperativeHandle(ref, () => ({
      setInput: (value: string) => setInput(value),
    }));

    const handleSend = () => {
      const trimmed = input.trim();
      if (!trimmed || isLoading) return;
      onSend(trimmed);
      setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none rounded-xl bg-zinc-800 border border-zinc-600 text-zinc-100 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-zinc-500"
            disabled={isLoading}
            style={{ minHeight: "48px", maxHeight: "160px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 160) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-5 py-3 text-sm font-medium transition-colors shrink-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Thinking
              </span>
            ) : (
              "Send →"
            )}
          </button>
        </div>
        <p className="text-center text-[11px] text-zinc-600 mt-2">
          Responses are evaluated automatically — tap the trust bar to review sources, assumptions &amp; confidence
        </p>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
export default ChatInput;
