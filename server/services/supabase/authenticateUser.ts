import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { type User, type Session } from "@supabase/supabase-js";
import { validateOrThrow } from '../../core/validation/validateOrThrow.js';
import { UserSchema } from '../../schemas/Users.js';

export interface AuthenticateUserResponse {
    user: User,
    session: Session
}

async function authenticateUser(email: string, password: string, supabase: any): Promise<AuthenticateUserResponse | null> {
    const response = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (!response.data.session) return null;
    validateOrThrow(UserSchema, response.data.user);
    return { user: response?.data?.user, session: response.data.session };
};

export { authenticateUser };