import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { SUPABASE_KEY, SUPABASE_URL } from '../../../src/Config.js';
import { Request, Response } from 'express'
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseSession } from '../../../types/interfaces.js';
import { Database } from '../../../types/databaseInterfaces.js';
import { UserSchema } from '../../../schemas/Users.js';
import { validateOrThrow } from '../../../core/validation/validateOrThrow.js';
import { ClientError } from '../../../core/errors/ClientError.js';


export const createSupabaseFromRequest = (req: Request): SupabaseClient<Database> => {
    const accessToken = req.cookies['sb-access-token'];

    return createClient<Database>(SUPABASE_URL!, SUPABASE_KEY!, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        auth: {
            persistSession: true,
        },
    });
};

export const getUserAndSupabase = async (
    req: Request,
    res?: Response
): Promise<
    SupabaseSession
> => {
    const supabase = createSupabaseFromRequest(req);
    const { data, error } = await supabase.auth.getUser();

    if (!data?.user) {
        throw new ClientError("User not authorized", error, 401);
    }

    const user = validateOrThrow(UserSchema, data.user);

    return {
        supabase,
        user
    };
};