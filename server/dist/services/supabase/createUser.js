import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { SUPABASE_KEY, SUPABASE_URL } from '../../src/Config.js';
import { createClient } from '@supabase/supabase-js';
import { UserSchema } from '../../schemas/Users.js';
import { validateOrThrow } from '../../core/validation/validateOrThrow.js';
async function createUser(email, password) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    validateOrThrow(UserSchema, data.user);
    const { user, session, } = data;
    return {
        session: session ?? null,
        user: user ?? null
    };
}
;
export { createUser };
//# sourceMappingURL=createUser.js.map