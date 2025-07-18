import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
config({ path: envPath });
export function getEnvVar(name) {
    const val = process.env[name];
    if (!val)
        throw new Error(`Missing required env var: ${name}`);
    return val;
}
export const BING_KEY = getEnvVar('BING_KEY');
export const TLDR_KEY = getEnvVar('TLDR_KEY');
export const SUPABASE_URL = getEnvVar('SUPABASE_URL');
export const SUPABASE_KEY = getEnvVar('SUPABASE_SERVICE_KEY');
export const BLUESKY_PASSWORD = getEnvVar('BLUESKY_PASSWORD');
export const BLUESKY_EMAIL = getEnvVar('BLUESKY_EMAIL');
export const PORT = process.env.PORT || '5001';
//# sourceMappingURL=Config.js.map