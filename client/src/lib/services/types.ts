import { JobStatus, Prog } from "@/state/Reducers/Investigate/articles/types";
import { ArticleSchemaType } from "../../../../schemas/api/types/ArticlesSchema";
import { ExtractionJobResultSchemaType } from "../schemas/ArticleSchema";

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
