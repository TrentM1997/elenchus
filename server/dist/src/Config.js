import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { ServerError } from '../core/errors/ServerError.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(process.cwd(), '.env');
config({ path: envPath });
export function getEnvVar(name) {
    const val = process.env[name];
    if (!val)
        throw new ServerError(`Missing required env var: ${name}`);
    return val;
}
export const TLDR_KEY = getEnvVar('TLDR_KEY');
export const FIRECRAWL_KEY = getEnvVar('FIRECRAWL_KEY');
export const SUPABASE_URL = getEnvVar('SUPABASE_URL');
export const SUPABASE_KEY = getEnvVar('SUPABASE_SERVICE_KEY');
export const BLUESKY_PASSWORD = getEnvVar('BLUESKY_PASSWORD');
export const BLUESKY_EMAIL = getEnvVar('BLUESKY_EMAIL');
export const PORT = process.env.PORT || '5001';
//# sourceMappingURL=Config.js.map