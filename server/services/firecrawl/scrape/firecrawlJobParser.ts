import { BiasSchemaType } from "../../../schemas/BiasSchema";
import {
  Article,
  BiasInfo,
  FailedAttempt,
  FcParam,
  FirecrawlContent,
  MBFC,
} from "../../../types/types";
import { dropParams } from "./scrapeConfig";

export interface IFirecrawlJobParser {
  reconcileFailed(retrieved: Article[], failed: FailedAttempt[]): void;
  toFailedAttempt(a: FcParam, reason: string): FailedAttempt;
  cleanUrl(url: string): string;
  toArticleDto(
    c: FirecrawlContent,
    a: FcParam,
    mb: MBFC,
    urlClean: string,
  ): Article;
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

  public reconcileFailed(retrieved: Article[], failed: FailedAttempt[]): void {
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

  public toArticleDto(
    c: FirecrawlContent,
    a: FcParam,
    mb: MBFC,
    urlClean: string,
  ): Article {
    const rating: BiasInfo | null | undefined = mb.has(a.source)
      ? mb.get(a.source)
      : null;
    const { factual_reporting, bias, country } = rating ?? {};
    const { source, image, date, logo, title } = a;
    const { content_markdown } = c;

    const article_extracted: Article = {
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
      id: null,
      factual_reporting: factual_reporting ?? null,
      bias: bias as BiasSchemaType,
      country: country,
    };

    return article_extracted;
  }

  public cleanUrl(url: string): string {
    try {
      const u = new URL(url);
      // Remove *only* known tracking params — keep important ones.

      for (const key of dropParams) {
        u.searchParams.delete(key);
      }
      u.hash = ""; // strip anchors like #comments
      return u.toString();
    } catch {
      return url;
    }
  }
}
