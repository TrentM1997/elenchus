import { Request, Response } from 'express'
import { FailedAttempt } from './interfaces.js';
import { mapTldrRequests } from '../services/mapTldrRequests.js';
import { MappedTldrRequests } from '../types/types.js';
import { firecrawlExtract } from '../services/firecrawl.js';
import { TldrRequest } from '../types/types.js';

export const tldrSummary = async (req: Request, res: Response): Promise<void> => {

    let failed: FailedAttempt[] = [];
    const { articles } = req.body;

    const firecrawl_scrape = async (article: TldrRequest) => await firecrawlExtract(article);


    if (!articles) {
        res.status(400).json({ error: "No articles recieved to scrape" });
        return;
    };


    try {
        const results: MappedTldrRequests = await mapTldrRequests(
            articles,
            failed,
        );


        //testing firecrawl scrape service here ******************************

        const firecrawl_results = await Promise.allSettled(
            articles.map((article: TldrRequest) => firecrawl_scrape(article))
        );

        const successful_requests = firecrawl_results
            .filter(r => r.status === 'fulfilled')
            .map(r => (r as PromiseFulfilledResult<any>).value);

        const failed_requests = firecrawl_results
            .filter(r => r.status === 'rejected')
            .map(r => (r as PromiseRejectedResult).reason);

        console.log({
            successful_requests: successful_requests,
            failed_requests: failed_requests
        });

        //******************************************************************* */

        res.status(200).json(results);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
    };
};