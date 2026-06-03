export interface ExtractedClaim {
  id: string;
  text: string;
  segment_index: number;
  claim_type: "factual" | "opinion" | "recommendation" | "prediction";
}

export interface Assumption {
  id: string;
  text: string;
  related_claim_ids: string[];
  user_action: "unreviewed" | "confirmed" | "corrected";
  correction?: string;
}

export interface ConfidenceSegment {
  segment_index: number;
  segment_text: string;
  level: "well-supported" | "partially-supported" | "uncertain";
  reason: string;
  related_claim_ids: string[];
}

export interface ProbeQuestion {
  id: string;
  question: string;
  context: string;
  related_segment_index: number;
}

export interface EvaluationResult {
  claims: ExtractedClaim[];
  assumptions: Assumption[];
  confidence_segments: ConfidenceSegment[];
  probe_questions: ProbeQuestion[];
}
