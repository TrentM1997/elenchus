import { Request, Response } from 'express'
import { FailedAttempt } from './interfaces.js';
import { ScrapedArticle } from '../types/types.js';
import { firecrawlExtract } from '../services/firecrawl.js';
import { firecrawlBatchScrape } from '../services/firecrawlBatchScrape.js';

type FcResObj = { retrieved: ScrapedArticle[] | null, rejected: FailedAttempt[] };

export const firecrawl_extractions = async (req: Request, res: Response): Promise<void> => {

    const failed: FailedAttempt[] = [];
    const { articles } = req.body;

    if ((!articles) || (!Array.isArray(articles))) {
        res.status(400).json({ error: "No articles recieved to scrape" });
        return;
    };

    try {
        const jobs: ScrapedArticle[] = await firecrawlBatchScrape(articles, failed);
        const responseObj: FcResObj = { retrieved: jobs, rejected: failed };
        res.status(200).json(responseObj);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
    };
};