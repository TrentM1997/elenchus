import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InsertableArticleSchemaType } from "../../schemas/ArticleSchema.js";
import { FailedAttempt, FcParam } from "../../types/types.js";

export interface JobResult {
  status: "pending" | "fulfilled" | "rejected";
  result?: {
    progress: string;
    retrieved: ArticleSchemaType[];
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
  persistArticle: (
    article: InsertableArticleSchemaType,
  ) => Promise<ArticleSchemaType>;
};
