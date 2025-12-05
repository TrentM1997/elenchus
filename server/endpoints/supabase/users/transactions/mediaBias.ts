import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { SUPABASE_KEY, SUPABASE_URL } from '../../../../src/Config.js';
import { createClient } from '@supabase/supabase-js';
import type { Bias } from '../../../../types/types.js';
import type { Database } from '../../../../types/databaseInterfaces.js';
import type { BiasSchemaType } from '../../../../schemas/BiasSchema.js';

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true
    }
})

export interface BiasTypes {
    country: string | null,
    bias: BiasSchemaType,
    factual_reporting: string | null,
    name: string | null
}

export const getMediaBiases = async (provider: string) => {
    try {
        const { data, error } = await supabase
            .from('sources')
            .select('country,bias,factual_reporting,name')
            .ilike('name', `%${provider}%`)
            .limit(1);

        if (error) {
            console.error('[getMediaBiases] DB error for provider:', provider, error.message);
            return null;
        }

        if (!data || data.length === 0) {
            return null;
        }

        const { country, bias, factual_reporting, name } = data[0];

        return { country, bias, factual_reporting, name };
    } catch (err) {
        console.error('[getMediaBiases] Unexpected throw for provider:', provider, err);
        return null;
    }
};

