import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { SUPABASE_KEY, SUPABASE_URL } from '../../../../src/Config.js';
import { wrapAsync } from '../../../../core/async/wrapAsync.js';
import { validateOrThrow } from '../../../../core/validation/validateOrThrow.js';
import { LoginSchema } from '../../../../schemas/LoginSchema.js';
import { executeAccountDeletion } from '../../../../services/supabase/executeAccountDeletion.js';
import { retrieveUserWithAdminKey } from '../../../../services/supabase/retrieveUserWithAdminKey.js';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true
    }
});
export const deleteUser = wrapAsync(async (req, res) => {
    const body = validateOrThrow(LoginSchema, req.body);
    const user_id = await retrieveUserWithAdminKey(body, supabase);
    const results = await executeAccountDeletion(user_id, supabase);
    res.success("account deleted", { message: "User deleted successfully.", data: results }, 200);
});
//# sourceMappingURL=deleteUser.js.map