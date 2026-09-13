import type { Article, JobStatus, Prog } from "@/state/Reducers/Investigate/Reading";

export interface FailedAttempt {
  title: string;
  summary: {
    denied: string;
    failedArticle: string;
  }[];
  logo: string;
  source: string;
  date: string;
  article_url: string;
}

export interface FirecrawlJobStatus {
  status: JobStatus;
  result: {
    progress: Prog;
    retrieved: Article[];
    rejected: FailedAttempt[];
  } | null;
  error: string | null;
  createdAt: number | null;
}

export interface FirecrawlSuccessPayload {
  retrieved: Article[];
  rejected: FailedAttempt[];
  progress: Prog;
}

export type PollExtractionsParams = {
  jobId: string;
  signal: AbortSignal;
  onProgress: (snapshot: FirecrawlJobStatus) => void;
};

export type ExtractSelectedParams = {
  articles: SelectedArticle[];
  signal: AbortSignal;
  onProgress: (snapshot: FirecrawlJobStatus) => void;
};
