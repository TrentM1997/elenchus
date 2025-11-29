import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import Firecrawl from '@mendable/firecrawl-js';
import { ServerError } from '../../../core/errors/ServerError.js';
export async function createFirecrawlClient() {
    const key = process.env.FIRECRAWL_KEY;
    if (!key) {
        throw new ServerError("firecrawl api key missing from environment");
    }
    try {
        return new Firecrawl({ apiKey: key });
    }
    catch (err) {
        throw new ServerError("Failed to initialize Firecrawl client", 500, err);
    }
}
;
//# sourceMappingURL=firecrawlClient.js.map