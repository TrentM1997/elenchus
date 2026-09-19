import { ArticleSchemaType } from "../../../schemas/ArticleSchema.js";
import {
  Article,
  Bias,
  FailedAttempt,
  FcParam,
  MBFC,
  ScrapedArticle,
} from "../../../types/types.js";

export interface BatchItem {
  url: string;
  markdown?: string;
  metadata?: Record<string, any>;
  success?: boolean;
  error?: string;
}

interface BiasInfo {
  bias: Bias | null;
  factual_reporting: string | null;
  country: string | null;
}

export type ScrapeParameters = {
  article: FcParam;
  MBFC_DATA: MBFC;
  pushRetrieved: (a: ArticleSchemaType) => void;
  pushFailed: (f: FailedAttempt) => void;
};

export type BatchScrapeParameters = {
  articles: FcParam[];
  failed: FailedAttempt[];
  MBFC_DATA: MBFC;
  retrieved: ScrapedArticle[];
};
