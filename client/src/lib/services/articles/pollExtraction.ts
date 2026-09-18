import type { ExtractionResult, ExtractionJobResultSchemaType } from "@/lib/schemas/ArticleSchema";
import type { IExtractArticlesRouteHandler } from "../client/public/handlers/ExtractArticlesRouteHandler";
import { ServerRequestError } from "../client/errors/ServerRequestError";

export const EXTRACTION_POLLING_POLICY = {
  deadlineMs: 5 * 60 * 1000,
  requestTimeoutMs: 15 * 1000,
  intervalMs: 1000,
  retryDelaysMs: [1000, 2000, 4000],
} as const;

class RequestTimeoutError extends Error {}

// Race the operation as well as aborting its signal so the deadline also covers
// clients that fail to settle after cancellation. Always release our listeners.
async function withTimeout<T>(
  run: (signal: AbortSignal) => Promise<T>,
  parent: AbortSignal,
  duration: number,
  timeout: Error,
): Promise<T> {
  parent.throwIfAborted();
  const controller = new AbortController();
  const abort = () => controller.abort(parent.reason);
  parent.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(() => controller.abort(timeout), duration);
  let rejectOnAbort = () => {};
  try {
    return await new Promise<T>((resolve, reject) => {
      rejectOnAbort = () => reject(controller.signal.reason);
      controller.signal.addEventListener("abort", rejectOnAbort, { once: true });
      if (parent.aborted) abort();
      controller.signal.throwIfAborted();
      run(controller.signal).then(resolve, reject);
    });
  } finally {
    clearTimeout(timer);
    parent.removeEventListener("abort", abort);
    controller.signal.removeEventListener("abort", rejectOnAbort);
  }
}

function waitForNextPoll(signal: AbortSignal, delay: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, delay);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
  });
}

function isRetryable(error: unknown): boolean {
  if (error instanceof RequestTimeoutError) return true;
  if (!(error instanceof ServerRequestError)) return false;
  const context = error.context;
  return context.kind === "network" ||
    (context.kind === "http" && [408, 429, 500, 502, 503, 504].includes(context.status));
}

export async function pollExtraction({
  client,
  articles,
  signal,
  onProgress,
}: {
  client: IExtractArticlesRouteHandler;
  articles: SelectedArticle[];
  signal: AbortSignal;
  onProgress: (result: ExtractionResult) => void;
}): Promise<ExtractionResult> {
  const policy = EXTRACTION_POLLING_POLICY;
  return withTimeout(async (sessionSignal) => {
    // Do not retry job creation: a lost response may still have started a job.
    const { jobId } = await withTimeout(
      (requestSignal) => client.extract(articles, requestSignal),
      sessionSignal, policy.requestTimeoutMs,
      new RequestTimeoutError("Starting extraction timed out"),
    );
    let consecutiveFailures = 0;
    while (true) {
      sessionSignal.throwIfAborted();
      let snapshot: ExtractionJobResultSchemaType;
      try {
        snapshot = await withTimeout(
          (requestSignal) => client.poll({ jobId, signal: requestSignal }),
          sessionSignal, policy.requestTimeoutMs,
          new RequestTimeoutError("The extraction status request timed out"),
        );
      } catch (error) {
        sessionSignal.throwIfAborted();
        if (!isRetryable(error)) throw error;
        const delay = policy.retryDelaysMs[consecutiveFailures];
        if (delay === undefined) {
          throw new Error("Unable to retrieve extraction progress after 3 retries. Please try again.", { cause: error });
        }
        consecutiveFailures += 1;
        await waitForNextPoll(sessionSignal, delay);
        continue;
      }
      sessionSignal.throwIfAborted();
      consecutiveFailures = 0;
      if (!snapshot) throw new Error("Extraction job returned no snapshot");
      if (snapshot.status === "rejected") {
        throw new Error(snapshot.error || "Extraction job failed");
      }
      if (snapshot.status === "fulfilled") {
        if (!snapshot.result) throw new Error("Extraction completed without results");
        return snapshot.result;
      }
      if (snapshot.result) onProgress(snapshot.result);
      await waitForNextPoll(sessionSignal, policy.intervalMs);
    }
  }, signal, policy.deadlineMs,
  new Error("Extraction timed out after 5 minutes. Articles already received are still available."));
}
