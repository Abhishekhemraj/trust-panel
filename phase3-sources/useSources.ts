"use client";

import { useState, useCallback } from "react";
import { ExtractedClaim } from "@/types/evaluation";
import { SourceRetrievalResult } from "@/types/sources";
import { retrieveSources } from "./SourceService";

interface SourceState {
  [messageId: string]: {
    result: SourceRetrievalResult | null;
    isLoading: boolean;
    error: string | null;
  };
}

export function useSources() {
  const [sources, setSources] = useState<SourceState>({});

  const fetchSources = useCallback(
    async (messageId: string, claims: ExtractedClaim[]) => {
      setSources((prev) => ({
        ...prev,
        [messageId]: { result: null, isLoading: true, error: null },
      }));

      try {
        const result = await retrieveSources(claims);
        setSources((prev) => ({
          ...prev,
          [messageId]: { result, isLoading: false, error: null },
        }));
        return result;
      } catch {
        setSources((prev) => ({
          ...prev,
          [messageId]: {
            result: null,
            isLoading: false,
            error: "Source retrieval failed",
          },
        }));
        return null;
      }
    },
    []
  );

  const getSources = useCallback(
    (messageId: string) => {
      return sources[messageId] || { result: null, isLoading: false, error: null };
    },
    [sources]
  );

  return { fetchSources, getSources };
}
