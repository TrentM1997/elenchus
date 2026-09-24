import { JobStatus, Prog } from "@/state/Reducers/Investigate/articles/types";
import {
  ArticleSchemaType,
  ExtractionJobResultSchemaType,
} from "@elenchus/contracts/schemas/articles/ArticleSchema";

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
    retrieved: ArticleSchemaType[];
    rejected: FailedAttempt[];
  } | null;
  error: string | null;
  createdAt: number | null;
}

export interface FirecrawlSuccessPayload {
  retrieved: ArticleSchemaType[];
  rejected: FailedAttempt[];
  progress: Prog;
}

export type PollExtractionsParams = {
  jobId: string;
  signal: AbortSignal;
  onProgress: (snapshot: ExtractionJobResultSchemaType) => void;
};

export type ExtractSelectedParams = {
  articles: SelectedArticle[];
  signal: AbortSignal;
  onProgress: (snapshot: ExtractionJobResultSchemaType) => void;
};
