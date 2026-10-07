import { ArticleToExtractSchemaType } from "@elenchus/contracts/schemas/articles/FirecrawlExtractionSchemas";
import { InsertableArticleSchemaType } from "../../../schemas/ArticleSchema.js";
import { BiasSchemaType } from "@elenchus/contracts/schemas/articles/BiasSchema";

export interface BiasInfo {
  bias: BiasSchemaType | null;
  factual_reporting: string | null;
  country: string | null;
}

export type MBFC = Map<string, BiasInfo>;

export interface BatchItem {
  url: string;
  markdown?: string;
  metadata?: Record<string, any>;
  success?: boolean;
  error?: string;
}

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

export type ScrapeParameters = {
  article: ArticleToExtractSchemaType;
  MBFC_DATA: MBFC;
  pushRetrieved: (a: InsertableArticleSchemaType) => Promise<void>;
  pushFailed: (f: FailedAttempt) => void;
};

export interface FirecrawlContent {
  content_markdown: string;
}

export interface FirecrawlResponse {
  metadata: {
    /* massive meta tag map */
  };
  json: FirecrawlContent;
}
