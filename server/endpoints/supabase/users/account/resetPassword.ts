import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { SUPABASE_KEY, SUPABASE_URL } from '../../../../src/Config.js';
import { Request, Response } from "express";
import type { GetLinkBody, GetLinkResponse } from '../../../../types/interfaces.js';
import { createClient } from '@supabase/supabase-js';

export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const { email } = req.body as GetLinkBody;

    if (!email) {
        res.status(400).json({ error: 'Email is required.' });
        return;
    };

    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://elenchusapp.io/reset-password',
        });

        if (error) {
            const db_error: GetLinkResponse = { message: error.message, data: null }
            res.status(400).json(db_error);
            return;
        }

        const message: GetLinkResponse = { message: 'Reset email sent.', data: data }
        res.status(200).json(message);
        return;

    } catch (err) {
        console.error(err);
        const error_message: string = err instanceof Error
            ? `Unknown server error: ${err.message}`
            : 'Unknown server error, check server logs for more info';
        const server_error: GetLinkResponse = { message: error_message, data: null };
        res.status(500).json(server_error);
        return;
    };
};

