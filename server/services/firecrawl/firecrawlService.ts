import Firecrawl from "@mendable/firecrawl-js";
import { Article, FailedAttempt, FcParam } from "../../types/types";
import { JobResult } from "../../endpoints/articles/firecrawl_extractions";
import { firecrawlExtract } from "./scrape/firecrawl";
import { FirecrawlJobParser, IFirecrawlJobParser } from "../firecrawlJobParser";

export interface IFirecrawlService {
  firecrawlJobRunner(
    id: string,
    articles: FcParam[],
    MBFC_DATA: any,
    jobs: Record<string, JobResult>,
  ): Promise<Article[]>;
}

export class FirecrawlService implements IFirecrawlService {
  private readonly parser: IFirecrawlJobParser;
  constructor(private readonly firecrawl: Firecrawl) {
    this.parser = new FirecrawlJobParser();
  }

  public async firecrawlJobRunner(
    id: string,
    articles: FcParam[],
    MBFC_DATA: any,
    jobs: Record<string, JobResult>,
  ): Promise<Article[]> {
    const failed: FailedAttempt[] = [];
    const retrieved: Article[] = [];

    try {
      const TIMEOUT_MS = 15000;
      const inFlight: Promise<void>[] = [];

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

      const pushRetrieved = (a: Article) => {
        retrieved.push(a);
        updateJobSnapshot();
      };

      const pushFailed = (f: FailedAttempt) => {
        failed.push(f);
        updateJobSnapshot();
      };

      for (const article of articles) {
        const scrapeJob = firecrawlExtract(
          article,
          this.firecrawl,
          MBFC_DATA,
          pushRetrieved,
          pushFailed,
        );

        const result = await Promise.race([
          scrapeJob.then(() => ({ timedOut: false as const })),
          new Promise<{ timedOut: true }>((resolve) =>
            setTimeout(() => resolve({ timedOut: true as const }), TIMEOUT_MS),
          ),
        ]);

        if (result.timedOut) inFlight.push(scrapeJob);
      }

      await Promise.allSettled(inFlight);

      this.parser.reconcileFailed(retrieved, failed);

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

      return retrieved;
    } catch (err: any) {
      console.error("firecrawl_extractions job failed:", err);
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
      return [];
    }
  }
}
