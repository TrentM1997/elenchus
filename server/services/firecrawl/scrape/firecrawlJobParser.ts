import { validateServerOrThrow } from "../../../core/validation/validateOrThrow.js";
import { ArticleSchema, ArticleSchemaType, FactualReportingRatingSchema, FactualReportingRatingSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InsertableArticleSchema, InsertableArticleSchemaType } from "../../../schemas/ArticleSchema.js";
import { BiasSchemaType } from "@elenchus/contracts/schemas/articles/BiasSchema";
import { validateSchema } from "../../../schemas/ValidateSchema.js";
import {
  Article,
  BiasInfo,
  FailedAttempt,
  FcParam,
  FirecrawlContent,
  MBFC,
} from "../../../types/types.js";
import { dropParams } from "./scrapeConfig.js";

export interface IFirecrawlJobParser {
  reconcileFailed(
    retrieved: ArticleSchemaType[],
    failed: FailedAttempt[],
  ): void;
  toFailedAttempt(a: FcParam, reason: string): FailedAttempt;
  cleanUrl(url: string): string;
  toScrapedArticleDto(
    c: FirecrawlContent,
    a: FcParam,
    mb: MBFC,
    urlClean: string,
  ): InsertableArticleSchemaType;
  isInvalidContent(c: FirecrawlContent | null | undefined): boolean;
}

export class FirecrawlJobParser implements IFirecrawlJobParser {
  constructor() {}

  public isInvalidContent(c: FirecrawlContent | null | undefined): boolean {
    return (
      !c ||
      typeof c.content_markdown !== "string" ||
      c.content_markdown.trim().length < 100
    );
  }

  public reconcileFailed(
    retrieved: ArticleSchemaType[],
    failed: FailedAttempt[],
  ): void {
    const success = new Set(retrieved.map((r) => this.cleanUrl(r.article_url)));
    for (let i = failed.length - 1; i >= 0; i--) {
      if (success.has(this.cleanUrl(failed[i].article_url)))
        failed.splice(i, 1);
    }
  }

  public toFailedAttempt(a: FcParam, reason: string): FailedAttempt {
    const cleaned = this.cleanUrl(a.url);
    return {
      title: a.title,
      summary: [{ denied: reason, failedArticle: a.url }],
      logo: a.logo,
      source: a.source,
      date: a.date,
      article_url: cleaned,
    };
  }

  public toScrapedArticleDto(
    c: FirecrawlContent,
    a: FcParam,
    mb: MBFC,
    urlClean: string,
  ): InsertableArticleSchemaType {
    const rating: BiasInfo | null | undefined = mb.has(a.source)
      ? mb.get(a.source)
      : null;
    const { factual_reporting, bias, country } = rating ?? {};
    const { source, image, date, logo, title } = a;
    const { content_markdown } = c;

    const validatedFactRating = this.validateFactualRating(factual_reporting);

    const article_extracted = {
      title: title,
      provider: source,
      authors: "N/A",
      article_url: urlClean,
      image_url: image,
      date_published: date ?? null,
      fallbackDate: date ?? null,
      summary: null,
      full_text: content_markdown,
      logo: logo,
      factual_reporting: validatedFactRating,
      bias: bias as BiasSchemaType,
      country: country,
    } satisfies InsertableArticleSchemaType;

    return this.validateArticle(article_extracted);
  }

  private validateFactualRating(
    rating: unknown,
  ): FactualReportingRatingSchemaType {
    const { ok, data } = validateSchema(FactualReportingRatingSchema, rating);
    if (ok) return data;
    return "Unknown";
  }

  private validateArticle(article: unknown): InsertableArticleSchemaType {
    return validateServerOrThrow(InsertableArticleSchema, article);
  }

  public cleanUrl(url: string): string {
    try {
      const u = new URL(url);

      for (const key of dropParams) {
        u.searchParams.delete(key);
      }
      u.hash = "";
      return u.toString();
    } catch {
      return url;
    }
  }
}
