import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { Request, Response } from 'express'
import { FailedAttempt } from './interfaces.js';
import { FcParam, ScrapedArticle } from '../types/types.js';
import { firecrawlBatchScrape } from '../services/firecrawlBatchScrape.js';
import Firecrawl from '@mendable/firecrawl-js';
import type { Bias } from '../types/types.js';
import { getMediaBiases } from './mediaBias.js';

//type FcResObj = { retrieved: ScrapedArticle[] | null, rejected: FailedAttempt[] };


interface JobResult {
    status: 'pending' | 'fulfilled' | 'rejected';
    result?: {
        progress: string,
        retrieved: ScrapedArticle[] | null;
        rejected: FailedAttempt[];
    }
    error?: string | null;
    createdAt: number;
};

const jobs: Record<string, JobResult> = {};

export async function createFirecrawlClient(): Promise<Firecrawl | null> {
    let firecrawl
    try {
        firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_KEY })

        return firecrawl
    } catch (err) {
        console.error(err);
        firecrawl = null;
    };
    return firecrawl;
};


function toFailedAttempt(a: FcParam, reason: string): FailedAttempt {
    return {
        title: a.title,
        summary: [{ denied: reason, failedArticle: a.url }],
        logo: a.logo,
        source: a.source,
        date: a.date,
        article_url: a.url,
    };
}


interface BiasInfo {
    bias: Bias | null;
    factual_reporting: string | null;
    country: string | null;
}

async function getBiasData(articles: FcParam[]): Promise<Map<string, BiasInfo>> {
    const biasRatings = new Map<string, BiasInfo>();

    // First, dedupe sources so we don't ask MBFC 5 times for "CNN"
    const uniqueSources = Array.from(new Set(articles.map(a => a.source)));

    // Kick off all the lookups in parallel, one per unique source
    const lookups = uniqueSources.map(async (source) => {
        const rating = await getMediaBiases(source);

        const normalized: BiasInfo = {
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


type ReqBody = { articles: FcParam[] };

export const firecrawl_extractions = async (req: Request, res: Response): Promise<void> => {
    console.log('firecrawl endpoint hit');
    const { articles }: ReqBody = req.body;



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
        const failed: FailedAttempt[] = [];
        const retrieved: ScrapedArticle[] = [];


        try {
            const firecrawl = await createFirecrawlClient();
            if (!firecrawl) {

                articles.forEach((art: FcParam) => {
                    const failedItem = toFailedAttempt(art, "Could not connect to firecrawl");
                    failed.push(failedItem)
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
            const chunks: FcParam[][] = [];

            for (let i = 0; i < articles.length; i += CHUNK_SIZE) {
                const batch = articles.slice(i, i + CHUNK_SIZE);
                chunks.push(batch);
            }

            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];

                try {
                    const chunkResults = await Promise.race([
                        firecrawlBatchScrape(firecrawl, chunk, failed, MBFC_DATA),
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error('Chunk timed out')), 50000)
                        ),
                    ]);

                    retrieved.push(...chunkResults);

                    jobs[id] = {
                        ...jobs[id],
                        result: {
                            retrieved: [...retrieved],
                            rejected: [...failed],
                            progress: `${i + 1}/${chunks.length}`,
                        },
                    };


                } catch (chunkErr: any) {
                    console.warn(`Chunk ${i + 1} failed:`, chunkErr);
                    chunk.forEach((c: FcParam) => {
                        const item = toFailedAttempt(c, "error during extraction");
                        failed.push(item)
                    })
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

        } catch (err: any) {
            console.error('firecrawl_extractions job failed:', err);

            jobs[id] = {
                status: 'rejected',
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

export const get_firecrawl_job = (req: Request, res: Response): void => {

    const { jobId } = req.params;
    const job = jobs[jobId];

    if (!job) {
        res.status(404).json({ status: 'unknown', error: 'Job not found' });
        return;
    }

    res.status(200).json(job);
};
