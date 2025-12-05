import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { Request, Response } from 'express'
import { wrapAsync } from '../../../../core/async/wrapAsync.js';
import { LoginSchema } from '../../../../schemas/LoginSchema.js';
import { validateOrThrow } from '../../../../core/validation/validateOrThrow.js';
import { createUser } from '../../../../services/supabase/createUser.js';
import { setAuthCookies } from '../../../../core/auth/setAuthCookies.js';
import { UserSchema } from '../../../../schemas/Users.js';

export const createNewUser = wrapAsync(async (req: Request, res: Response): Promise<void> => {
    validateOrThrow(LoginSchema, req.body);
    const { email, password } = req.body;

    const { user, session } = await createUser(email, password);

    validateOrThrow(UserSchema, user);

    if (session) {
        setAuthCookies(session, res);
    }

    res.success("created new user", { user: user }, 200);

});