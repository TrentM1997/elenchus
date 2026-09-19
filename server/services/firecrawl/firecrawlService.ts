import Firecrawl from "@mendable/firecrawl-js";
import { Article, FailedAttempt, FcParam } from "../../types/types.js";
import {
  FirecrawlJobParser,
  IFirecrawlJobParser,
} from "./scrape/firecrawlJobParser.js";
import {
  FirecrawlScrapeHandler,
  IFirecrawlScrapeHandler,
} from "./scrape/firecrawlScrapeHandler.js";
import { JobResult, RunFirecrawlJobParameters } from "./types.js";
import { ArticleSchemaType } from "../../schemas/ArticleSchema.js";

export interface IFirecrawlService {
  runFirecrawlJob(
    id: string,
    articles: FcParam[],
    MBFC_DATA: any,
    jobs: Record<string, JobResult>,
  ): Promise<ArticleSchemaType[]>;
}

export class FirecrawlService implements IFirecrawlService {
  private readonly parser: IFirecrawlJobParser;
  private readonly scraper: IFirecrawlScrapeHandler;
  constructor(private readonly firecrawl: Firecrawl) {
    this.parser = new FirecrawlJobParser();
    this.scraper = new FirecrawlScrapeHandler(this.firecrawl, this.parser);
  }

  public async runFirecrawlJob(
    id: string,
    articles: FcParam[],
    MBFC_DATA: any,
    jobs: Record<string, JobResult>,
  ): Promise<ArticleSchemaType[]> {
    return await this.executeFirecrawlJob({ id, articles, MBFC_DATA, jobs });
  }

  private async executeFirecrawlJob(params: RunFirecrawlJobParameters) {
    const { jobs, id } = params;

    const failed: FailedAttempt[] = [];
    const retrieved: ArticleSchemaType[] = [];

    try {
      await this.runScrapeAttempts({ ...params, retrieved, failed });

      return retrieved;
    } catch (err: any) {
      console.error("firecrawl_extractions job failed:", err);
      this.jobFailed({ retrieved: retrieved, jobs, id, failed, err });
      return retrieved;
    }
  }

  private async runScrapeAttempts({
    articles,
    MBFC_DATA,
    retrieved,
    jobs,
    id,
    failed,
  }: RunFirecrawlJobParameters & {
    retrieved: ArticleSchemaType[];
    failed: FailedAttempt[];
  }) {
    const updateJobSnapshot = () => {
      const prog = retrieved.length + failed.length;
      jobs[id] = {
        ...jobs[id],
        result: {
          retrieved: [...retrieved],
          rejected: [...failed],
          progress: `${prog}/${articles.length}`,
        },
      };
    };

    const pushFailed = (f: FailedAttempt) => {
      failed.push(f);
      updateJobSnapshot();
    };

    const pushRetrieved = (a: ArticleSchemaType) => {
      retrieved.push(a);
      updateJobSnapshot();
    };

    const NEXT_SCRAPE_WAIT_MS = 15000;
    const inFlight: Promise<void>[] = [];

    for (const article of articles) {
      const scrapeJob = this.scraper.scrape({
        article,
        MBFC_DATA,
        pushRetrieved,
        pushFailed,
      });

      const result = await Promise.race([
        scrapeJob.then(() => ({ timedOut: false as const })),
        new Promise<{ timedOut: true }>((resolve) =>
          setTimeout(
            () => resolve({ timedOut: true as const }),
            NEXT_SCRAPE_WAIT_MS,
          ),
        ),
      ]);

      if (result.timedOut) inFlight.push(scrapeJob);
    }

    await Promise.allSettled(inFlight);

    this.parser.reconcileFailed(retrieved, failed);

    this.jobFulfilled({ jobs, id, articles, retrieved, failed });
  }

  private jobFailed({
    retrieved,
    jobs,
    id,
    failed,
    err,
  }: {
    jobs: RunFirecrawlJobParameters["jobs"];
    id: RunFirecrawlJobParameters["id"];
    failed: FailedAttempt[];
    retrieved: ArticleSchemaType[];
    err: any;
  }) {
    const partial_success = retrieved.length > 0;
    jobs[id] = {
      status: partial_success ? "fulfilled" : "rejected",
      result: {
        progress: "Unexpected error: extraction failed",
        rejected: failed,
        retrieved,
      },
      error: err?.message ?? "Internal server error",
      createdAt: jobs[id]?.createdAt ?? Date.now(),
    };
  }

  private jobFulfilled({
    jobs,
    id,
    articles,
    retrieved,
    failed,
  }: {
    jobs: RunFirecrawlJobParameters["jobs"];
    id: RunFirecrawlJobParameters["id"];
    failed: FailedAttempt[];
    retrieved: ArticleSchemaType[];
    articles: FcParam[];
  }) {
    jobs[id] = {
      status: "fulfilled",
      result: {
        progress: `${articles.length}/${articles.length}`,
        retrieved: [...retrieved],
        rejected: [...failed],
      },
      error: null,
      createdAt: jobs[id]?.createdAt ?? Date.now(),
    };
  }
}
