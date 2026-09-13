import type {
  FirecrawlJobStatus,
  FirecrawlSuccessPayload,
  ExtractSelectedParams,
  PollExtractionsParams,
} from "./types";

export interface IExtractionService {
  extractArticles(
    params: ExtractSelectedParams,
  ): Promise<FirecrawlSuccessPayload>;
}

export class ExtractionService implements IExtractionService {
  constructor() {}

  public async extractArticles(
    params: ExtractSelectedParams,
  ): Promise<FirecrawlSuccessPayload> {
    return await this.executeExtract(params);
  }

  private async executeExtract({
    articles,
    signal,
    onProgress,
  }: ExtractSelectedParams): Promise<FirecrawlSuccessPayload> {
    const response = await fetch("/articles/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles }),
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Extraction job failed: ${response.status}: ${response.statusText}`,
      );
    }

    const { jobId }: { jobId: string } = await response.json();

    return this.pollExtractions({ onProgress, jobId, signal });
  }

  private async pollExtractions({
    jobId,
    signal,
    onProgress,
  }: PollExtractionsParams): Promise<FirecrawlSuccessPayload> {
    while (true) {
      signal.throwIfAborted();

      const snapshot = await this.fetchJobStatus(jobId, signal);

      onProgress(snapshot);

      if (snapshot.status === "rejected") {
        throw new Error(snapshot.error || "Extraction failed on server.");
      }

      if (snapshot.status === "fulfilled") {
        if (!snapshot.result) {
          throw new Error("Job finished without a result.");
        }

        return snapshot.result;
      }

      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    }
  }

  private async fetchJobStatus(
    jobId: string,
    signal: AbortSignal,
  ): Promise<FirecrawlJobStatus> {
    const response = await fetch(
      `/articles/extract/${encodeURIComponent(jobId)}`,
      {
        method: "GET",
        cache: "no-store",
        signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "Job not found or expired."
          : `Failed to fetch extraction progress (${response.status}).`,
      );
    }

    return (await response.json()) as FirecrawlJobStatus;
  }
}
