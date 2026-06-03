import { EvaluationResult } from "./evaluation";
import { SourceRetrievalResult } from "./sources";

export type PanelTab = "sources" | "assumptions" | "confidence" | "deeper";

export interface TrustPanelSummary {
  source_count: number;
  assumption_count: number;
  uncertain_count: number;
  unsourced_count: number;
}

export interface TrustPanelState {
  is_expanded: boolean;
  active_tab: PanelTab;
  summary: TrustPanelSummary;
  evaluation: EvaluationResult | null;
  sources: SourceRetrievalResult | null;
}
