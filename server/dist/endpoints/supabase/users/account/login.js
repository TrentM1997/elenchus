import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { SUPABASE_KEY, SUPABASE_URL } from '../../../../src/Config.js';
import { UserSchema } from "../../../../schemas/Users.js";
import { LoginSchema } from '../../../../schemas/LoginSchema.js';
import { createClient } from '@supabase/supabase-js';
import { getUserContent } from '../../../../services/supabase/getUserContent.js';
import { wrapAsync } from '../../../../core/async/wrapAsync.js';
import { validateOrThrow } from '../../../../core/validation/validateOrThrow.js';
import { authenticateUser } from '../../../../services/supabase/authenticateUser.js';
import { setAuthCookies } from '../../../../core/auth/setAuthCookies.js';
export const supabaseLogin = wrapAsync(async (req, res) => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { email, password } = req.body;
    validateOrThrow(LoginSchema, req.body);
    const response = await authenticateUser(email, password, supabase);
    if (!response)
        return;
    validateOrThrow(UserSchema, response?.user);
    const { user, session } = response;
    if (session && user) {
        setAuthCookies(session, res);
    }
    ;
    const { id } = user;
    const content = await getUserContent(supabase, id);
    const userData = { sess: session, userContent: content };
    res.status(200).send(userData);
    return;
});
//# sourceMappingURL=login.js.map