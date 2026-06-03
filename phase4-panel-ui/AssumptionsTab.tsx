"use client";

import { useState } from "react";
import { Assumption } from "@/types/evaluation";

interface AssumptionsTabProps {
  assumptions: Assumption[];
  onCorrect?: (assumptionId: string, correction: string) => void;
  onConfirm?: (assumptionId: string) => void;
  onAskQuestion?: (question: string) => void;
}

export default function AssumptionsTab({
  assumptions,
  onCorrect,
  onConfirm,
}: AssumptionsTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<Record<string, string>>({});
  const [localActions, setLocalActions] = useState<
    Record<string, "confirmed" | "corrected">
  >({});

  if (!assumptions.length) {
    return (
      <div className="text-zinc-500 text-sm py-6 text-center">
        No implicit assumptions detected.
      </div>
    );
  }

  const handleConfirm = (id: string) => {
    setLocalActions((prev) => ({ ...prev, [id]: "confirmed" }));
    setEditingId(null);
    onConfirm?.(id);
  };

  const handleCorrect = (id: string) => {
    const correction = corrections[id]?.trim();
    if (!correction) return;
    setLocalActions((prev) => ({ ...prev, [id]: "corrected" }));
    setEditingId(null);
    onCorrect?.(id, correction);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500 mb-4">
        These are things the AI assumed without you stating them. Correcting
        assumptions lets you regenerate a more accurate response.
      </p>
      {assumptions.map((assumption) => {
        const action = localActions[assumption.id];
        const isEditing = editingId === assumption.id;

        return (
          <div
            key={assumption.id}
            className={`border rounded-xl p-4 transition-colors ${
              action === "confirmed"
                ? "border-emerald-800 bg-emerald-900/10"
                : action === "corrected"
                ? "border-amber-800 bg-amber-900/10"
                : "border-zinc-700"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5">💭</span>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-zinc-200">{assumption.text}</p>

                {/* Action badges */}
                {action === "confirmed" && (
                  <span className="text-xs text-emerald-400 font-medium">
                    ✓ Confirmed correct
                  </span>
                )}
                {action === "corrected" && (
                  <div>
                    <span className="text-xs text-amber-400 font-medium">
                      ✎ Corrected:{" "}
                    </span>
                    <span className="text-xs text-zinc-300">
                      {corrections[assumption.id]}
                    </span>
                  </div>
                )}

                {/* Correction input */}
                {isEditing && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      placeholder="What is the correct assumption?"
                      value={corrections[assumption.id] || ""}
                      onChange={(e) =>
                        setCorrections((prev) => ({
                          ...prev,
                          [assumption.id]: e.target.value,
                        }))
                      }
                      className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCorrect(assumption.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCorrect(assumption.id)}
                        className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Save correction
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {!action && !isEditing && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleConfirm(assumption.id)}
                      className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-zinc-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ✓ Correct
                    </button>
                    <button
                      onClick={() => setEditingId(assumption.id)}
                      className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-zinc-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ✎ Not right — fix it
                    </button>
                  </div>
                )}

                {/* Change action */}
                {action && (
                  <button
                    onClick={() => {
                      setLocalActions((prev) => {
                        const n = { ...prev };
                        delete n[assumption.id];
                        return n;
                      });
                      setEditingId(null);
                    }}
                    className="text-[11px] text-zinc-500 hover:text-zinc-400 mt-1"
                  >
                    Undo
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
