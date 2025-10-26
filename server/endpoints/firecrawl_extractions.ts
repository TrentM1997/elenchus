import { Request, Response } from 'express'
import { FailedAttempt } from './interfaces.js';
import { ScrapedArticle } from '../types/types.js';
import { firecrawlExtract } from '../services/firecrawl.js';
import { firecrawlBatchScrape } from '../services/firecrawlBatchScrape.js';
import Firecrawl from '@mendable/firecrawl-js';

type FcResObj = { retrieved: ScrapedArticle[] | null, rejected: FailedAttempt[] };

export const firecrawl_extractions = async (req: Request, res: Response): Promise<void> => {

    const failed: FailedAttempt[] = [];
    const { articles } = req.body;


    if ((!articles) || (!Array.isArray(articles))) {
        res.status(400).json({ error: "No articles recieved to scrape" });
        return;
    };

    const FIRECRAWL_KEY = process.env.FIRECRAWL_KEY;
    console.log(
        "[firecrawl_extractions] FIRECRAWL_KEY present?",
        !!FIRECRAWL_KEY,
        "len:",
        FIRECRAWL_KEY ? FIRECRAWL_KEY.length : "none"
    );

    if (!FIRECRAWL_KEY) {
        res.status(500).json({
            error: "Server misconfigured: FIRECRAWL_KEY is missing",
        });
        return;
    }

    try {
        const firecrawl = new Firecrawl({ apiKey: FIRECRAWL_KEY });
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