import { IDbClient } from "../../db/access/client/dbClient";
import { JobResult } from "../../endpoints/articles/firecrawl_extractions";
import { ArticleSchemaType } from "../../schemas/ArticleSchema";
import { Article, FcParam } from "../../types/types";
import { IFirecrawlService } from "../firecrawl/firecrawlService";

export interface IArticleService {
  startExtraction(articles: FcParam[]): { jobId: string };
  getExtractionJob(jobId: string): JobResult | undefined;
}

export class ArticleService implements IArticleService {
  private readonly jobs: Record<string, JobResult> = {};
  constructor(
    private readonly db: Pick<IDbClient, "articles" | "sources">,
    private readonly firecrawl: IFirecrawlService,
  ) {}

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
}
