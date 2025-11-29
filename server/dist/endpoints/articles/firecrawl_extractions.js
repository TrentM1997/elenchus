import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { firecrawlExtract } from '../../services/firecrawl/scrape/firecrawl.js';
import { createFirecrawlClient } from '../../services/firecrawl/client/firecrawlClient.js';
import { toFailedAttempt } from '../../services/firecrawl/chunking/toFailedAttempt.js';
import { getBiasData } from '../../services/firecrawl/preload/getBiasData.js';
import { reconcileFailed } from '../../services/firecrawl/chunking/reconcileFailed.js';
const jobs = {};
export const firecrawl_extractions = async (req, res) => {
    console.log('firecrawl endpoint hit');
    const { articles } = req.body;
    if (!articles || !Array.isArray(articles)) {
        res.status(400).json({ error: 'No articles received to scrape' });
        return;
    }
    const id = crypto.randomUUID();
    jobs[id] = {
        status: 'pending',
        result: {
            progress: `0/${articles.length}`,
            retrieved: [],
            rejected: []
        },
        error: null,
        createdAt: Date.now(),
    };
    res.status(202).json({ jobId: id });
    const MBFC_DATA = await getBiasData(articles);
    (async () => {
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
    })();
};
export const get_firecrawl_job = (req, res) => {
    const { jobId } = req.params;
    const job = jobs[jobId];
    if (!job) {
        res.status(404).json({ status: 'unknown', error: 'Job not found' });
        return;
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.status(200).json(job);
};
//# sourceMappingURL=firecrawl_extractions.js.map