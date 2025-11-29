import { FcParam, Article, FailedAttempt } from "../../../types/types";
import type { JobResult } from "../../../endpoints/articles/firecrawl_extractions.js";
import { createFirecrawlClient } from "../client/firecrawlClient.js";
import { toFailedAttempt } from "../chunking/toFailedAttempt.js";
import { firecrawlExtract } from "../scrape/firecrawl.js";
import { reconcileFailed } from "../chunking/reconcileFailed.js";

async function firecrawlJobRunner(
    id: string,
    articles: FcParam[],
    MBFC_DATA: any,
    jobs: Record<string, JobResult>,

) {

    const failed: FailedAttempt[] = [];
    const retrieved: Article[] = [];

    try {
        const firecrawl = await createFirecrawlClient();
        if (!firecrawl) {
            for (const art of articles) failed.push(toFailedAttempt(art, 'Could not connect to Firecrawl'));
            jobs[id] = {
                status: 'rejected',
                result: { progress: 'connection failed', retrieved: [], rejected: failed },
                error: "Couldn't connect to Firecrawl",
                createdAt: jobs[id]?.createdAt ?? Date.now(),
            };
            return;
        }

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
            const scrapeJob = firecrawlExtract(article, firecrawl, MBFC_DATA, pushRetrieved, pushFailed);

            const result = await Promise.race([
                scrapeJob.then(() => ({ timedOut: false as const })),
                new Promise<{ timedOut: true }>((resolve) =>
                    setTimeout(() => resolve({ timedOut: true as const }), TIMEOUT_MS)
                ),
            ]);

            if (result.timedOut) inFlight.push(scrapeJob);
        }

        await Promise.allSettled(inFlight);

        reconcileFailed(retrieved, failed);

        console.log({ retrievedLength: retrieved.length, failedLength: failed.length });

        jobs[id] = {
            status: 'fulfilled',
            result: {
                progress: `${articles.length}/${articles.length}`,
                retrieved: [...retrieved],
                rejected: [...failed],
            },
            error: null,
            createdAt: jobs[id]?.createdAt ?? Date.now(),
        };
    } catch (err: any) {
        console.error('firecrawl_extractions job failed:', err);
        const partial_success = retrieved.length > 0;
        jobs[id] = {
            status: partial_success ? 'fulfilled' : 'rejected',
            result: {
                progress: 'Unexpected error: extraction failed',
                rejected: failed,
                retrieved,
            },
            error: err?.message ?? 'Internal server error',
            createdAt: jobs[id]?.createdAt ?? Date.now(),
        };
    }
};


export { firecrawlJobRunner };