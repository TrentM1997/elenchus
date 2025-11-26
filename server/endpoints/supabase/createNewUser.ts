import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { SUPABASE_KEY, SUPABASE_URL } from '../../src/Config.js';
import { Request, Response } from 'express'
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import type { SignUpRequestBody } from '../../types/interfaces.js';
import type { NewUser } from '../../types/interfaces.js';

export const createNewUser = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body as SignUpRequestBody;

    try {

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const isProduction = process.env.NODE_ENV === 'production';
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (data.session) {
            const { access_token, refresh_token } = data.session;

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
        }
        if (error) {
            console.error({ 'Signup error encountered': error.message });
            const db_error: NewUser = { message: error.message, data: null }
            res.status(400).json(db_error);
            return;
        } else {
            const message: NewUser = { message: 'User created', data: data.user }
            res.status(200).send(message);
            return;
        };

    } catch (error) {
        if (error) {
            if (error instanceof Error) {
                const err_message: NewUser = { message: `Unexpected server error: ${error.message}`, data: null };
                res.status(500).json(err_message);
                return;
            } else {
                console.error(error)
                const err_message: NewUser = { message: `Unexpected server error`, data: null };
                res.status(400).json(err_message);
                return;
            };

        };
    };
};