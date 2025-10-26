import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { Request, Response } from 'express'
import { FailedAttempt } from './interfaces.js';
import { ScrapedArticle } from '../types/types.js';
import { firecrawlBatchScrape } from '../services/firecrawlBatchScrape.js';
import { FIRECRAWL_KEY } from '../src/Config.js';
import Firecrawl from '@mendable/firecrawl-js';

type FcResObj = { retrieved: ScrapedArticle[] | null, rejected: FailedAttempt[] };


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


export const firecrawl_extractions = async (req: Request, res: Response): Promise<void> => {

    const failed: FailedAttempt[] = [];
    const { articles } = req.body;

    if ((!articles) || (!Array.isArray(articles))) {
        res.status(400).json({ error: "No articles recieved to scrape" });
        return;
    };

    try {
        const firecrawl = await createFirecrawlClient();
        if (firecrawl !== null) {
            const jobs: ScrapedArticle[] = await firecrawlBatchScrape(firecrawl, articles, failed);
            const responseObj: FcResObj = { retrieved: jobs, rejected: failed };
            res.status(200).json(responseObj);
            return;
        } else {
            res.status(401).send("Couldn't connect to firecrawl");
            return;
        };


    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
    };
};