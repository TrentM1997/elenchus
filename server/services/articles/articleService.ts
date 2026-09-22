import { IDbClient } from "../../db/access/client/dbClient.js";
import { ServerError } from "../../core/errors/ServerError.js";
import {
  ArticleSchemaType,
  InsertableArticleSchemaType,
} from "../../schemas/ArticleSchema.js";
import { FcParam } from "../../types/types.js";
import { IFirecrawlService } from "../firecrawl/firecrawlService.js";
import { JobResult } from "../firecrawl/types.js";

export interface IArticleService {
  extract(articles: FcParam[]): { jobId: string };
  getExtractionJob(jobId: string): JobResult | undefined;
}

export class ArticleService implements IArticleService {
  private readonly jobs: Record<string, JobResult> = {};
  constructor(
    private readonly db: Pick<IDbClient, "articles" | "sources">,
    private readonly firecrawl: IFirecrawlService,
  ) {}

  public extract(articles: FcParam[]): { jobId: string } {
    return this.startExtraction(articles);
  }

  private startExtraction(articles: FcParam[]): { jobId: string } {
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

      await this.firecrawl.runFirecrawlJob(
        jobId,
        articles,
        biases,
        this.jobs,
        this.save.bind(this),
      );
    } catch (error) {
      this.jobs[jobId] = {
        ...this.jobs[jobId],
        status: "rejected",
        error:
          error instanceof Error ? error.message : "Article extraction failed",
      };
      return;
    }
  }

  private async save(
    article: InsertableArticleSchemaType,
  ): Promise<ArticleSchemaType> {
    const result = await this.db.articles.saveArticle(article);
    if (!result.ok) {
      throw new ServerError(result.message, 500, result.details);
    }
    return result.data;
  }
}
