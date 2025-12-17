import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { SUPABASE_KEY, SUPABASE_URL } from '../../../src/Config.js';
import { createClient } from '@supabase/supabase-js';
import { UserSchema } from '../../../schemas/Users.js';
import { validateOrThrow } from '../../../core/validation/validateOrThrow.js';
import { ClientError } from '../../../core/errors/ClientError.js';
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
//# sourceMappingURL=serverClient.js.map