import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { SUPABASE_KEY, SUPABASE_URL } from '../../src/Config.js';
import { validateUser } from "../../schemas/Users.js";
import { validateLoginBody } from '../../schemas/LoginSchema.js';
import { createClient } from '@supabase/supabase-js';
import { getUserContent } from '../../services/getUserContent';
export const supabaseLogin = async (req, res) => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { email, password } = req.body;
    const checkLoginBody = validateLoginBody(req.body);
    if (!checkLoginBody.isValid) {
        res.status(400).json({
            error: 'invalid login credentials sent from UI',
            details: checkLoginBody.details
        });
        return;
    }
    try {
        const response = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (response.data.session) {
            const { access_token, refresh_token } = response.data.session;
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('sb-access-token', access_token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000,
            });
            res.cookie('sb-refresh-token', refresh_token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const sessionData = response.data.session;
            const checkUser = validateUser(sessionData.user);
            if (!checkUser.isValid) {
                res.status(500).json({
                    error: 'invalid user schema from Supabase',
                    details: checkUser.details
                });
                return;
            }
            ;
            const { id } = sessionData.user;
            const content = await getUserContent(supabase, id);
            const userData = { sess: sessionData, userContent: content };
            res.status(200).send(userData);
            return;
        }
        else {
            res.status(400).json({ db_error: 'unable to login in to supabase' });
            return;
        }
        ;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
        return;
    }
    ;
};
//# sourceMappingURL=login.js.map