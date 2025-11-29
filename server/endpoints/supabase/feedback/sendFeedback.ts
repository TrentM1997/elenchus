import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath })
import { SUPABASE_KEY, SUPABASE_URL } from '../../../src/Config.js';
import { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js';
import type { FeedbackBody, FeedbackResponse } from '../../../types/interfaces.js';

export const sendFeedback = async (req: Request, res: Response): Promise<void> => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { email, message } = req.body as FeedbackBody;

    try {

        const { data, error } = await supabase
            .from('user_feedback')
            .insert({
                email: email,
                message: message
            })
            .select();

        if (data) {
            const message: FeedbackResponse = { result: 'success sending feedback' };
            res.status(200).send(message);
            return;

        } else if (error) {
            const err_message: FeedbackResponse = { result: error.message };
            res.status(400).send(err_message);
            return;
        };

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error sending feedback: ${error}`);
            res.status(400).json({ result: `Unknown server error ${error}` });
            return;
        } else {
            console.error(error);
            res.status(400).json({ result: 'Unknown Server error' });
            return;
        };
    };
};



