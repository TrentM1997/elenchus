import { IDbClient } from "../../db/access/client/dbClient.js";
import { ServerError } from "../../core/errors/ServerError.js";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InsertableArticleSchemaType } from "../../schemas/ArticleSchema.js";
import { FcParam } from "../../types/types.js";
import { IFirecrawlService } from "../firecrawl/firecrawlService.js";
import { JobResult } from "../firecrawl/types.js";
import { assertNever } from "../../core/asserts/assertNever.ts";

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

  public getExtractionJob(jobId: string): JobResult | undefined {
    const job = this.jobs[jobId];

    return job ? structuredClone(job) : undefined;
  }

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

  private async executeExtraction(
    jobId: string,
    articles: FcParam[],
  ): Promise<void> {
    try {
      const biases = await this.db.sources.getBiases(articles);

      await this.firecrawl.runFirecrawlJob({
        id: jobId,
        articles,
        MBFC_DATA: biases,
        jobs: this.jobs,
        persistArticle: this.save.bind(this),
      });
    } catch (error) {
      const job = this.jobs[jobId];

      if (!job) {
        console.error("Extraction job unexpectedly missing", { jobId, error });
        return;
      }

      this.jobs[jobId] = {
        ...job,
        status: "rejected",
        error:
          error instanceof Error ? error.message : "Article extraction failed",
      };
    } finally {
      this.scheduleCompletedJobCleanup({ job: this.jobs[jobId], jobId });
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

  private scheduleCompletedJobCleanup({
    job,
    jobId,
  }: {
    job: JobResult | undefined;
    jobId: string;
  }): void {
    if (job) {
      switch (job.status) {
        case "pending": {
          break;
        }
        case "fulfilled": {
          this.scheduleJobCleanup(jobId);
          break;
        }
        case "rejected": {
          this.scheduleJobCleanup(jobId);
          break;
        }

        default: {
          return assertNever(job.status);
        }
      }
    }
  }

  private scheduleJobCleanup(jobId: string): void {
    const timer = setTimeout(
      () => {
        delete this.jobs[jobId];
      },
      10 * 60 * 1000,
    );

    timer.unref();
  }
}
