import Firecrawl from "@mendable/firecrawl-js";
import {
  ArticleSchemaType,
  InsertableArticleSchemaType,
  validateArticle,
} from "../../../schemas/ArticleSchema.js";
import type { FcParam, FirecrawlResponse } from "../../../types/types.js";
import { ServerError } from "../../../core/errors/ServerError.js";
import { IFirecrawlJobParser } from "./firecrawlJobParser.js";
import { FIRECRAWL_OPTIONS } from "./scrapeConfig.js";
import { ScrapeParameters } from "./types.js";

export interface IFirecrawlScrapeHandler {
  scrape(params: ScrapeParameters): Promise<void>;
}

export class FirecrawlScrapeHandler implements IFirecrawlScrapeHandler {
  constructor(
    private readonly firecrawl: Firecrawl,
    private readonly parser: IFirecrawlJobParser,
  ) {}

  public async scrape(params: ScrapeParameters): Promise<void> {
    return await this.executeScrape(params);
  }

  private async executeScrape({
    article,
    MBFC_DATA,
    pushFailed,
    pushRetrieved,
  }: ScrapeParameters): Promise<void> {
    const urlClean = this.parser.cleanUrl(article.url);
    let extracted: InsertableArticleSchemaType;

    try {
      const content = await this.scrapeContent(urlClean);

      if (this.parser.isInvalidContent(content)) {
        this.pushFailedContent(article, pushFailed, "empty or incomplete body");
        return;
      }

      extracted = this.parser.toScrapedArticleDto(
        content,
        article,
        MBFC_DATA,
        urlClean,
      );

      const { isValid, details } = validateArticle(extracted);

      if (!isValid) {
        console.error(details);
        throw new ServerError("invalid schema from Firecrawl extraction");
      }
    } catch (error) {
      console.error(error);
      this.pushFailedContent(article, pushFailed, "scrape failed");
      return;
    }

    try {
      await pushRetrieved(extracted);
    } catch (error) {
      console.error("Failed to persist extracted article", error);
      this.pushFailedContent(article, pushFailed, "article persistence failed");
    }
  }

  private async scrapeContent(url: string) {
    const { json: content } = (await this.firecrawl.scrape(
      url,
      FIRECRAWL_OPTIONS,
    )) as FirecrawlResponse;
    return content;
  }

  private pushFailedContent(
    article: FcParam,
    pushFailed: ScrapeParameters["pushFailed"],
    message:
      | "empty or incomplete body"
      | "scrape failed"
      | "article persistence failed",
  ): void {
    const failedArticle = this.parser.toFailedAttempt(article, message);
    pushFailed(failedArticle);
  }
}
