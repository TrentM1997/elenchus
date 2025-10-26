import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { firecrawlBatchScrape } from '../services/firecrawlBatchScrape.js';
import Firecrawl from '@mendable/firecrawl-js';
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
export const firecrawl_extractions = async (req, res) => {
    const failed = [];
    const { articles } = req.body;
    if ((!articles) || (!Array.isArray(articles))) {
        res.status(400).json({ error: "No articles recieved to scrape" });
        return;
    }
    ;
    try {
        const firecrawl = await createFirecrawlClient();
        if (firecrawl !== null) {
            const jobs = await firecrawlBatchScrape(firecrawl, articles, failed);
            const responseObj = { retrieved: jobs, rejected: failed };
            res.status(200).json(responseObj);
            return;
        }
        else {
            res.status(401).send("Couldn't connect to firecrawl");
            return;
        }
        ;
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
    }
    ;
};
//# sourceMappingURL=firecrawl_extractions.js.map