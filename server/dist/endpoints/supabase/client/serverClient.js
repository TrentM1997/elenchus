import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { SUPABASE_KEY, SUPABASE_URL } from '../../../src/Config.js';
import { createClient } from '@supabase/supabase-js';
import { validateUser } from '../../../schemas/Users.js';
export const createSupabaseFromRequest = (req) => {
    const accessToken = req.cookies['sb-access-token'];
    return createClient(SUPABASE_URL, SUPABASE_KEY, {
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
export const getUserAndSupabase = async (req, res) => {
    const supabase = createSupabaseFromRequest(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }
    const checkUser = validateUser(user);
    if (!checkUser.isValid) {
        res.status(500).json({
            error: `Invalid user schema from Supabase`,
            details: checkUser.details
        });
        return null;
    }
    return { supabase, user };
};
//# sourceMappingURL=serverClient.js.map