export interface WikiDisambigCandidate {
  pageid: number;
  title: string;
  extract: string;
  thumbnail: string | null;
  url: string;
  lastUpdated: string | null; // ISO 8601
}

export interface WikiDisambigResponse {
  kind: "disambiguation";
  title: string;
  pageUrl: string;
  candidates: WikiDisambigCandidate[];
  lastUpdated: string; // ISO 8601 (the disambig page itself, from REST summary)
}

export interface WikiSummaryResponse {
  kind: "summary";
  title: string;
  extract: string;
  description: string;
  thumbnail: string | null;
  pageUrl: string;
  lastUpdated: string; // ISO 8601 (from REST summary)
}

export interface WikiErrorResponse {
  kind: "error";
  message: string;
}

export type WikiResponse =
  | WikiSummaryResponse
  | WikiDisambigResponse
  | WikiErrorResponse;

interface ActionApiThumbnail {
  source: string;
  width?: number;
  height?: number;
}

export interface ActionApiRevision {
  timestamp: string;
}

export interface ActionApiPage {
  pageid: number;
  ns: number;
  title: string;
  index?: number;
  missing?: boolean;
  extract?: string;
  thumbnail?: ActionApiThumbnail;
  revisions?: ActionApiRevision[]; // only if you add &prop=revisions
}

export interface ActionApiQueryResponse {
  query?: {
    pages?: Record<string, ActionApiPage>;
  };
}
