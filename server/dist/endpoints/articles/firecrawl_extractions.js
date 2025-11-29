import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { getBiasData } from '../../services/firecrawl/preload/getBiasData.js';
import { firecrawlJobRunner } from '../../services/firecrawl/orchestrate/runFirecrawlJobs.js';
import { validateOrThrow } from '../../core/validation/validateOrThrow.js';
import { ScrapeRequestSchema } from '../../schemas/ScrapeRequestSchema.js';
import { wrapAsync } from '../../core/async/wrapAsync.js';
const jobs = {};
export const firecrawl_extractions = wrapAsync(async (req, res) => {
    const { articles } = validateOrThrow(ScrapeRequestSchema, req.body);
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
    const MBFC_DATA = await getBiasData(articles);
    await firecrawlJobRunner(id, articles, MBFC_DATA, jobs);
});
export const get_firecrawl_job = (req, res) => {
    const { jobId } = req.params;
    const job = jobs[jobId];
    if (!job) {
        res.status(404).json({ status: 'unknown', error: 'Job not found' });
        return;
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.status(200).json(job);
};
//# sourceMappingURL=firecrawl_extractions.js.map