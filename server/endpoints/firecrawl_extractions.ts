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

type FcResObj = { retrieved: ScrapedArticle[] | null, rejected: FailedAttempt[] };

interface JobResult {
    status: 'pending' | 'fulfilled' | 'rejected';
    result?: any;
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

type ReqBody = { articles: FcParam[] };

export const firecrawl_extractions = async (req: Request, res: Response): Promise<void> => {
    console.log('firecrawl endpoint hit');
    const { articles }: ReqBody = req.body;

    if (!articles || !Array.isArray(articles)) {
        res.status(400).json({ error: "No articles received to scrape" });
        return;
    }


    const id = crypto.randomUUID();

    jobs[id] = {
        status: 'pending',
        result: null,
        error: null,
        createdAt: Date.now(),
    };

    res.status(202).json({ jobId: id });

    (async () => {
        const failed: FailedAttempt[] = [];

        try {
            const firecrawl = await createFirecrawlClient();
            if (!firecrawl) {
                jobs[id] = {
                    status: 'rejected',
                    result: null,
                    error: "Couldn't connect to Firecrawl",
                    createdAt: jobs[id]?.createdAt ?? Date.now(),
                };
                return;
            }

            const scraped: ScrapedArticle[] = await firecrawlBatchScrape(
                firecrawl,
                articles,
                failed
            );

            const responseObj: FcResObj = {
                retrieved: scraped ?? null,
                rejected: failed,
            };

            jobs[id] = {
                status: 'fulfilled',
                result: responseObj,
                error: null,
                createdAt: jobs[id]?.createdAt ?? Date.now(),
            };
        } catch (err: any) {
            console.error('firecrawl_extractions job failed:', err);

            jobs[id] = {
                status: 'rejected',
                result: null,
                error: err?.message ?? 'Internal Server Error',
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
