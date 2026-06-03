export interface Source {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publish_date?: string;
  domain: string;
}

export interface ClaimSourceMapping {
  claim_id: string;
  claim_text: string;
  status: "sourced" | "unsourced" | "conflicting";
  sources: Source[];
  note?: string;
}

export interface SourceRetrievalResult {
  mappings: ClaimSourceMapping[];
  total_sourced: number;
  total_unsourced: number;
  total_conflicting: number;
}
