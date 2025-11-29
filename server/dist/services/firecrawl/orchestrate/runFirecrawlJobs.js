import { createFirecrawlClient } from "../client/firecrawlClient.js";
import { toFailedAttempt } from "../chunking/toFailedAttempt.js";
import { firecrawlExtract } from "../scrape/firecrawl.js";
import { reconcileFailed } from "../chunking/reconcileFailed.js";
async function firecrawlJobRunner(id, articles, MBFC_DATA, jobs) {
    const failed = [];
    const retrieved = [];
    try {
        const firecrawl = await createFirecrawlClient();
        if (!firecrawl) {
            for (const art of articles)
                failed.push(toFailedAttempt(art, 'Could not connect to Firecrawl'));
            jobs[id] = {
                status: 'rejected',
                result: { progress: 'connection failed', retrieved: [], rejected: failed },
                error: "Couldn't connect to Firecrawl",
                createdAt: jobs[id]?.createdAt ?? Date.now(),
            };
            return;
        }
        const TIMEOUT_MS = 15000;
        const inFlight = [];
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
        const pushRetrieved = (a) => {
            retrieved.push(a);
            updateJobSnapshot();
        };
        const pushFailed = (f) => {
            failed.push(f);
            updateJobSnapshot();
        };
        for (const article of articles) {
            const scrapeJob = firecrawlExtract(article, firecrawl, MBFC_DATA, pushRetrieved, pushFailed);
            const result = await Promise.race([
                scrapeJob.then(() => ({ timedOut: false })),
                new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), TIMEOUT_MS)),
            ]);
            if (result.timedOut)
                inFlight.push(scrapeJob);
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
    }
    catch (err) {
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
}
;
export { firecrawlJobRunner };
//# sourceMappingURL=runFirecrawlJobs.js.map