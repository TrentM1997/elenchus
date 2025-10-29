import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { firecrawlBatchScrape } from '../services/firecrawlBatchScrape.js';
import Firecrawl from '@mendable/firecrawl-js';
import { getMediaBiases } from './mediaBias.js';
import { cleanURL } from '../helpers/cleanUrl.js';
;
const jobs = {};
export async function createFirecrawlClient() {
    let firecrawl;
    try {
        firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_KEY });
        return firecrawl;
    }
    catch (err) {
        console.error(err);
        firecrawl = null;
    }
    ;
    return firecrawl;
}
;
export function toFailedAttempt(a, reason) {
    return {
        title: a.title,
        summary: [{ denied: reason, failedArticle: a.url }],
        logo: a.logo,
        source: a.source,
        date: a.date,
        article_url: a.url,
    };
}
async function getBiasData(articles) {
    const biasRatings = new Map();
    // First, dedupe sources so we don't ask MBFC 5 times for "CNN"
    const uniqueSources = Array.from(new Set(articles.map(a => a.source)));
    // Kick off all the lookups in parallel, one per unique source
    const lookups = uniqueSources.map(async (source) => {
        const rating = await getMediaBiases(source);
        const normalized = {
            bias: rating?.bias ?? null,
            factual_reporting: rating?.factual_reporting ?? null,
            country: rating?.country ?? null
        };
        return { source, normalized };
    });
    // Wait for them all together
    const results = await Promise.all(lookups);
    // Fill the map
    for (const { source, normalized } of results) {
        biasRatings.set(source, normalized);
    }
    return biasRatings;
}
export const firecrawl_extractions = async (req, res) => {
    console.log('firecrawl endpoint hit');
    const { articles } = req.body;
    if (!articles || !Array.isArray(articles)) {
        res.status(400).json({ error: "No articles received to scrape" });
        return;
    }
    const MBFC_DATA = await getBiasData(articles);
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
    (async () => {
        const failed = [];
        const retrieved = [];
        try {
            const firecrawl = await createFirecrawlClient();
            if (!firecrawl) {
                articles.forEach((art) => {
                    const failedItem = toFailedAttempt(art, "Could not connect to firecrawl");
                    failed.push(failedItem);
                });
                jobs[id] = {
                    status: 'rejected',
                    result: {
                        progress: 'Unexpected error: extraction failed',
                        rejected: failed,
                        retrieved: []
                    },
                    error: "Couldn't connect to Firecrawl",
                    createdAt: jobs[id]?.createdAt ?? Date.now(),
                };
                return;
            }
            const CHUNK_SIZE = 1;
            const chunks = [];
            for (let i = 0; i < articles.length; i += CHUNK_SIZE) {
                const batch = articles.slice(i, i + CHUNK_SIZE);
                chunks.push(batch);
            }
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                try {
                    await Promise.race([
                        firecrawlBatchScrape(firecrawl, chunk, failed, MBFC_DATA, retrieved),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Chunk timed out')), 40000)),
                    ]);
                    const successUrls = new Set(retrieved.map(r => r.article_url));
                    //walk backwards to remove any urls that actually succeeded
                    for (let i = failed.length - 1; i >= 0; i--) {
                        if (successUrls.has(cleanURL(failed[i].article_url))) {
                            failed.splice(i, 1);
                        }
                    }
                    const prog = (retrieved.length + failed.length);
                    jobs[id] = {
                        ...jobs[id],
                        result: {
                            retrieved: [...retrieved],
                            rejected: [...failed],
                            progress: `${prog}/${chunks.length}`,
                        },
                    };
                }
                catch (chunkErr) {
                    console.warn(`Chunk ${i + 1} failed:`, chunkErr);
                    chunk.forEach((c) => {
                        const item = toFailedAttempt(c, "error during extraction");
                        failed.push(item);
                    });
                }
            }
            jobs[id] = {
                status: 'fulfilled',
                result: {
                    progress: `${chunks.length}/${chunks.length}`,
                    retrieved: retrieved,
                    rejected: failed
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
                    retrieved: retrieved
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
    res.status(200).json(job);
};
//# sourceMappingURL=firecrawl_extractions.js.map