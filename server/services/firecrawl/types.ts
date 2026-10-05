import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InsertableArticleSchemaType } from "../../schemas/ArticleSchema.js";
import type { ArticleToExtractSchemaType } from "@elenchus/contracts/schemas/articles/FirecrawlExtractionSchemas";
import { FailedAttempt } from "./scrape/types.ts";

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
  articles: ArticleToExtractSchemaType[];
  initialRetrieved: ArticleSchemaType[];
  MBFC_DATA: any;
  jobs: Record<string, JobResult>;
  persistArticle: (
    article: InsertableArticleSchemaType,
  ) => Promise<ArticleSchemaType>;
};
