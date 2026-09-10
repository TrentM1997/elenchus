import { IDbClient } from "../../db/access/client/dbClient";
import { JobResult } from "../../endpoints/articles/firecrawl_extractions";
import { INewsAPIService } from "../../integrations/newsApiHandler";
import { ArticleSchemaType } from "../../schemas/ArticleSchema";
import { BookmarkSchemaType } from "../../schemas/BookmarkSchema";
import { Article, BrowsingOption, FcParam } from "../../types/types";
import { IAuthorization } from "../auth/authorization";
import { IFirecrawlService } from "../firecrawl/firecrawlService";

export interface IArticleService {
  bookmark(
    user_id: string | undefined | null,
    article_id: number,
  ): Promise<BookmarkSchemaType>;

  search(query: string): Promise<BrowsingOption[]>;

  startExtraction(articles: FcParam[]): { jobId: string };

  getExtractionJob(jobId: string): JobResult | undefined;
}

export class ArticleService implements IArticleService {
  private readonly jobs: Record<string, JobResult> = {};
  constructor(
    private readonly db: IDbClient,
    private readonly policy: IAuthorization,
    private readonly firecrawl: IFirecrawlService,
    private readonly newsApi: INewsAPIService,
  ) {}

  public async search(query: string): Promise<BrowsingOption[]> {
    return await this.newsApi.search(query);
  }

  public async bookmark(
    user_id: string | undefined | null,
    article_id: number,
  ): Promise<BookmarkSchemaType> {
    return await this.executeBookmark(article_id, user_id);
  }

  public startExtraction(articles: FcParam[]): { jobId: string } {
    const jobId = crypto.randomUUID();

    this.jobs[jobId] = {
      status: "pending",
      result: {
        progress: `0/${articles.length}`,
        retrieved: [],
        rejected: [],
      },
      error: null,
      createdAt: Date.now(),
    };

    void this.executeExtraction(jobId, articles);

    return { jobId };
  }

  public getExtractionJob(jobId: string): JobResult | undefined {
    const job = this.jobs[jobId];

    return job ? structuredClone(job) : undefined;
  }

  private async executeExtraction(
    jobId: string,
    articles: FcParam[],
  ): Promise<void> {
    try {
      const biases = await this.db.sources.getBiases(articles);

      const scraped = await this.firecrawl.firecrawlJobRunner(
        jobId,
        articles,
        biases,
        this.jobs,
      );

      const saved = await this.persistExtractions(scraped);

      this.completeJob(jobId, articles.length, saved);
    } catch (error) {
      this.jobs[jobId] = {
        ...this.jobs[jobId],
        status: "rejected",
        error:
          error instanceof Error ? error.message : "Article extraction failed",
      };
    }
  }

  private completeJob(
    jobId: string,
    total: number,
    saved: ArticleSchemaType[],
  ): void {
    const current = this.jobs[jobId];

    this.jobs[jobId] = {
      ...current,
      status: "fulfilled",
      result: {
        progress: `${total}/${total}`,
        retrieved: saved,
        rejected: current.result?.rejected ?? [],
      },
      error: null,
    };
  }

  private async persistExtractions(
    scraped: Article[],
  ): Promise<ArticleSchemaType[]> {
    const success: ArticleSchemaType[] = [];
    for (const article of scraped) {
      const saved = await this.save(article);
      success.push(saved);
    }
    return success;
  }

  private async save(article: unknown): Promise<ArticleSchemaType> {
    return await this.db.articles.saveArticle(article);
  }

  private async executeBookmark(
    article_id: number,
    user_id: string | undefined | null,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.articles.bookmarkArticle(userId, article_id);
  }
}
