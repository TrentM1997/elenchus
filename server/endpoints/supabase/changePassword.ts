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
import type { ChangePasswordSuccess, ChangePasswordError, ChangePasswordBody } from '../../types/interfaces.js';

export const changePassword = async (req: Request, res: Response<ChangePasswordSuccess | ChangePasswordError>): Promise<void> => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { email, newPassword } = req.body as ChangePasswordBody;
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) throw new Error(error.message);

    const user: User | undefined = data.users.find((user) => user.email === email);

    if (user) {

        try {
            const { data, error } = await supabase.auth.admin.updateUserById(user.id,
                {
                    password: newPassword
                });

            if (data) {
                const updated = data?.user
                res.status(200).send({ message: 'success', data: updated });
                return;
            } else if (error) {
                res.status(400).send({ status: error.message, data: null });
                return;
            };

        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                res.status(400).json({ status: `Unknown server error ${error}`, data: null });
                return;
            } else {
                res.status(400).json({ status: 'Unknown server error', data: null });
                return;
            };
        };
    } else {
        res.status(404).json({ status: 'No user record found in the database for elenchus', data: null });
        return;
    };
};

