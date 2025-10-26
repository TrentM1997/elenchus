import { Request, Response } from 'express'
import { FailedAttempt } from './interfaces.js';
import { ScrapedArticle } from '../types/types.js';
import { firecrawlExtract } from '../services/firecrawl.js';
import { FIRECRAWL_KEY } from '../src/Config.js';
import { firecrawlBatchScrape } from '../services/firecrawlBatchScrape.js';
import Firecrawl from '@mendable/firecrawl-js';

type FcResObj = { retrieved: ScrapedArticle[] | null, rejected: FailedAttempt[] };


export function createFirecrawlClient() {
    const key = FIRECRAWL_KEY;

    if (!key) {
        // Don't throw globally. Throw here so the caller can decide how to respond.
        throw new Error("Missing FIRECRAWL_KEY in this runtime environment");
    }

    return new Firecrawl({ apiKey: key });
}


export const firecrawl_extractions = async (req: Request, res: Response): Promise<void> => {

    const failed: FailedAttempt[] = [];
    const { articles } = req.body;


    if ((!articles) || (!Array.isArray(articles))) {
        res.status(400).json({ error: "No articles recieved to scrape" });
        return;
    };

    const key = createFirecrawlClient()

    try {
        const firecrawl = createFirecrawlClient();
        const jobs: ScrapedArticle[] = await firecrawlBatchScrape(firecrawl, articles, failed);
        const responseObj: FcResObj = { retrieved: jobs, rejected: failed };
        res.status(200).json(responseObj);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
    };
};