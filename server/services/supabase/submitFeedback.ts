import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { SUPABASE_KEY, SUPABASE_URL } from '../../src/Config.js';
import { createClient } from "@supabase/supabase-js";
import { ServerError } from "../../core/errors/ServerError.js";

async function submitFeedback(email: string, message: string) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabase
        .from('user_feedback')
        .insert({
            email: email,
            message: message
        })
        .select();

    if (error) throw new ServerError("Failed to submit feedback to DB", 500, error);

    return {
        data: data,
        submitted: true
    };
};


export { submitFeedback };