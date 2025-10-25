import { Request, Response } from 'express'
import { FailedAttempt } from './interfaces.js';
import { mapTldrRequests } from '../services/mapTldrRequests.js';
import { FcParam, MappedTldrRequests, ScrapedArticle } from '../types/types.js';
import { firecrawlExtract } from '../services/firecrawl.js';
import { getPromiseValues } from '../helpers/getPromiseValues.js';

type FcResObj = { retrieved: ScrapedArticle[], rejected: FailedAttempt[] };

export const firecrawl_extractions = async (req: Request, res: Response): Promise<void> => {

    const failed: FailedAttempt[] = [];
    const { articles } = req.body;


    if (!articles) {
        res.status(400).json({ error: "No articles recieved to scrape" });
        return;
    };


    try {
        const requests = articles.map((article: FcParam) => firecrawlExtract(article, failed));

        const firecrawl_results = await Promise.allSettled(requests);
        const successful_requests = getPromiseValues(firecrawl_results);
        const responseObj: FcResObj = { retrieved: successful_requests, rejected: failed }

        res.status(200).json(responseObj);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
    };
};