import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { ClientError } from '../../core/errors/ClientError.js';
async function retrieveUserWithAdminKey(body, supabase) {
    const { email, password } = body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw new ClientError("Invalid credentials to authenticate account deletion");
    }
    ;
    const user_id = data.session.user.id;
    return user_id;
}
;
export { retrieveUserWithAdminKey };
//# sourceMappingURL=retrieveUserWithAdminKey.js.map