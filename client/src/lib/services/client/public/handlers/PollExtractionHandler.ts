import type { ExtractArticlesRouteHandler } from "./ExtractArticlesRouteHandler";
import type { ExtractionResult } from "@/lib/schemas/articles/ArticleSchema";
import { ServerRequestError } from "../../errors/ServerRequestError";
import { withTimeout, waitForNextPoll } from "../../../articles/pollingTiming";

export const EXTRACTION_POLLING_POLICY = {
  deadlineMs: 5 * 60 * 1000,
  requestTimeoutMs: 15 * 1000,
  intervalMs: 1000,
  retryDelaysMs: [1000, 2000, 4000],
} as const;

class RequestTimeoutError extends Error {}

export type ExtractionRequests = Pick<
  ExtractArticlesRouteHandler,
  "extract" | "poll"
>;

export type PollExtractionParams = {
  articles: SelectedArticle[];
  signal: AbortSignal;
  onProgress: (result: ExtractionResult) => void;
};

export interface IPollExtractionHandler {
  runExtraction(params: PollExtractionParams): Promise<ExtractionResult>;
}

export class PollExtractionHandler implements IPollExtractionHandler {
  constructor(private readonly client: ExtractionRequests) {}

  public async runExtraction(
    params: PollExtractionParams,
  ): Promise<ExtractionResult> {
    return await this.runExtractionAndPoll(params);
  }

  private runExtractionAndPoll(
    params: PollExtractionParams,
  ): Promise<ExtractionResult> {
    return withTimeout(
      (signal) => this.executeExtraction({ ...params, signal }),
      params.signal,
      EXTRACTION_POLLING_POLICY.deadlineMs,
      new Error(
        "Extraction timed out after 5 minutes. Articles already received are still available.",
      ),
    );
  }

  private async executeExtraction({
    articles,
    signal,
    onProgress,
  }: PollExtractionParams): Promise<ExtractionResult> {
    // Starting a job is never retried: the server may already have created it.
    const { jobId } = await withTimeout(
      (requestSignal) => this.client.extract(articles, requestSignal),
      signal,
      EXTRACTION_POLLING_POLICY.requestTimeoutMs,
      new RequestTimeoutError("Starting extraction timed out"),
    );

    return this.pollUntilComplete(jobId, signal, onProgress);
  }

  private async pollUntilComplete(
    jobId: string,
    signal: AbortSignal,
    onProgress: PollExtractionParams["onProgress"],
  ): Promise<ExtractionResult> {
    const policy = EXTRACTION_POLLING_POLICY;
    // Per-run state: concurrent or subsequent runs do not share retry budgets.
    let consecutiveFailures = 0;

    while (true) {
      signal.throwIfAborted();
      let snapshot;
      try {
        snapshot = await withTimeout(
          (requestSignal) => this.client.poll({ jobId, signal: requestSignal }),
          signal,
          policy.requestTimeoutMs,
          new RequestTimeoutError("The extraction status request timed out"),
        );
      } catch (error) {
        signal.throwIfAborted();
        if (!this.isRetryable(error)) throw error;

        const delay = policy.retryDelaysMs[consecutiveFailures];
        if (delay === undefined) {
          throw new Error(
            "Unable to retrieve extraction progress after 3 retries. Please try again.",
            { cause: error },
          );
        }
        consecutiveFailures += 1;
        await waitForNextPoll(signal, delay);
        continue;
      }

      signal.throwIfAborted();
      consecutiveFailures = 0;
      if (!snapshot) throw new Error("Extraction job returned no snapshot");
      if (snapshot.status === "rejected") {
        throw new Error(snapshot.error || "Extraction job failed");
      }
      if (snapshot.status === "fulfilled") {
        if (!snapshot.result)
          throw new Error("Extraction completed without results");
        return snapshot.result;
      }
      if (snapshot.result) onProgress(snapshot.result);
      await waitForNextPoll(signal, policy.intervalMs);
    }
  }

  private isRetryable(error: unknown): boolean {
    if (error instanceof RequestTimeoutError) return true;
    if (!(error instanceof ServerRequestError)) return false;
    const context = error.context;
    return (
      context.kind === "network" ||
      (context.kind === "http" &&
        [408, 429, 500, 502, 503, 504].includes(context.status))
    );
  }
}
