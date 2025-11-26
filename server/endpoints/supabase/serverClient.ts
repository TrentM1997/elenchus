import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { SUPABASE_KEY, SUPABASE_URL } from '../../src/Config.js';
import { Request, Response } from 'express'
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseSession } from '../../types/interfaces.js';
import { UserContent } from '../../types/types.js'
import { Database } from '../../types/databaseInterfaces.js';
import { getUserContent } from '../../services/getUserContent.js';
import { validateUser, ValidateUserResp } from '../../schemas/Users.js';

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


export const getUserAndSupabase = async (req: Request, res: Response): Promise<SupabaseSession | null> => {
    const supabase = createSupabaseFromRequest(req);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }

    const checkUser: ValidateUserResp = validateUser(user);

    if (!checkUser.isValid) {
        res.status(500).json({
            error: `Invalid user schema from Supabase`,
            details: checkUser.details
        });

        return null;
    }
    return { supabase, user };
};


export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const session = await getUserAndSupabase(req, res);
    if (!session) return;
    const { user } = session;
    const checkUser: ValidateUserResp = validateUser(user);

    if (!checkUser.isValid) {
        res.status(500).json({
            error: 'Invalid user schema from Supabase',
            details: checkUser.details
        })
        return;
    }

    const { id } = user;
    const content: UserContent = await getUserContent(supabase, id);
    const userData = { sess: session, userContent: content };
    res.status(200).json({ user: user, data: userData.userContent });
    return;
};