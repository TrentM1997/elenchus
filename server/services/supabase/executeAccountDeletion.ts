import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { ServerError } from "../../core/errors/ServerError.js";
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/databaseInterfaces';

async function executeAccountDeletion(user_id: string, supabase: SupabaseClient<Database>) {

    const { data, error } = await supabase
        .auth
        .admin
        .deleteUser(user_id);

    if (error) {
        throw new ServerError("Failed to delete user account");
    }

    return data;
};

export { executeAccountDeletion };

