import { ArticleSchemaType } from "../../schemas/ArticleSchema";
import { FailedAttempt, FcParam } from "../../types/types";

export interface JobResult {
  status: "pending" | "fulfilled" | "rejected";
  result?: {
    progress: string;
    retrieved: ArticleSchemaType[] | null;
    rejected: FailedAttempt[];
  };
  error?: string | null;
  createdAt: number;
}

export type RunFirecrawlJobParameters = {
  id: string;
  articles: FcParam[];
  MBFC_DATA: any;
  jobs: Record<string, JobResult>;
};
