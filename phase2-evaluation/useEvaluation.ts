"use client";

import { useState, useCallback } from "react";
import { EvaluationResult } from "@/types/evaluation";
import { runEvaluation } from "./EvaluationService";

interface EvaluationState {
  [messageId: string]: {
    result: EvaluationResult | null;
    isLoading: boolean;
    error: string | null;
  };
}

export function useEvaluation() {
  const [evaluations, setEvaluations] = useState<EvaluationState>({});

  const evaluate = useCallback(
    async (messageId: string, userPrompt: string, aiResponse: string) => {
      // Set loading state for this message
      setEvaluations((prev) => ({
        ...prev,
        [messageId]: { result: null, isLoading: true, error: null },
      }));

      const result = await runEvaluation(userPrompt, aiResponse);

      setEvaluations((prev) => ({
        ...prev,
        [messageId]: {
          result,
          isLoading: false,
          error: result ? null : "Evaluation failed",
        },
      }));

      return result;
    },
    []
  );

  const getEvaluation = useCallback(
    (messageId: string) => {
      return evaluations[messageId] || { result: null, isLoading: false, error: null };
    },
    [evaluations]
  );

  return { evaluate, getEvaluation };
}
