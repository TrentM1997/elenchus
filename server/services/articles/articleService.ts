import { IDbClient } from "../../db/access/client/dbClient.js";
import { ServerError } from "../../core/errors/ServerError.js";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InsertableArticleSchemaType } from "../../schemas/ArticleSchema.js";
import { IFirecrawlService } from "../firecrawl/firecrawlService.js";
import { JobResult } from "../firecrawl/types.js";
import { assertNever } from "../../core/asserts/assertNever.ts";
import { ArticleToExtractSchemaType } from "@elenchus/contracts/schemas/articles/FirecrawlExtractionSchemas";
import { dropParams } from "../firecrawl/scrape/scrapeConfig.ts";

const JOB_CLEANUP_WINDOW = 10 * 60 * 1000;

export interface IArticleService {
  extract(articles: ArticleToExtractSchemaType[]): Promise<{ jobId: string }>;
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

  public async extract(
    articles: ArticleToExtractSchemaType[],
  ): Promise<{ jobId: string }> {
    return this.getOrExtractArticles({ articles });
  }

  private async findExistingArticles(articles: ArticleToExtractSchemaType[]) {
    const cleansed = articles.map((article) => ({
      ...article,
      url: this.cleanUrl(article.url),
    }));

    const urls = cleansed.map((article) => article.url);
    const result = await this.db.articles.byUrls(urls);

    if (!result.ok) {
      throw new ServerError(result.message, 500, result.details);
    }

    const persisted = result.data;
    const persistedUrls = new Set(
      persisted.map((article) => article.article_url),
    );

    const extractionCandidates = cleansed.filter(
      (article) => !persistedUrls.has(article.url),
    );

    return {
      persisted,
      extractionCandidates,
    };
  }

  private async getOrExtractArticles({
    articles,
  }: {
    articles: ArticleToExtractSchemaType[];
  }) {
    const { persisted, extractionCandidates } =
      await this.findExistingArticles(articles);

    return this.startExtraction({ articles, extractionCandidates, persisted });
  }

  private startExtraction({
    articles,
    extractionCandidates,
    persisted,
  }: {
    articles: ArticleToExtractSchemaType[];
    extractionCandidates: ArticleToExtractSchemaType[];
    persisted: ArticleSchemaType[];
  }): {
    jobId: string;
  } {
    const jobId = crypto.randomUUID();

    if (extractionCandidates.length === 0) {
      this.jobs[jobId] = {
        status: "fulfilled",
        result: {
          progress: `${articles.length}/${articles.length}`,
          retrieved: persisted,
          rejected: [],
        },
        error: null,
        createdAt: Date.now(),
      };

      this.scheduleJobCleanup(jobId);

      return { jobId };
    }

    this.jobs[jobId] = {
      status: "pending",
      result: {
        progress: `${persisted.length}/${articles.length}`,
        retrieved: persisted,
        rejected: [],
      },
      error: null,
      createdAt: Date.now(),
    };

    void this.executeExtraction(jobId, extractionCandidates, persisted);

    return { jobId };
  }

  private async executeExtraction(
    jobId: string,
    articles: ArticleToExtractSchemaType[],
    initialRetrieved: ArticleSchemaType[],
  ): Promise<void> {
    try {
      const biases = await this.db.sources.getBiases(articles);

      await this.firecrawl.runFirecrawlJob({
        id: jobId,
        articles,
        initialRetrieved,
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
    const timer = setTimeout(() => {
      delete this.jobs[jobId];
    }, JOB_CLEANUP_WINDOW);

    timer.unref();
  }

  private cleanUrl(url: string): string {
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
