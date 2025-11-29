import { ServerError } from "../../../../core/errors/ServerError.js";
import { getUserAndSupabase } from "../../client/serverClient.js";
import { Request, Response } from "express";

export const getUserArticles = async (req: Request, res: Response): Promise<void> => {
    const session = await getUserAndSupabase(req, res);
    if (!session) return;
    const { supabase, user } = session;

    try {
        const { data, error } = await supabase
            .from('articles')
            .select()
            .eq('user_id', user.id)

        if (error) {
            console.error(error.message);
            throw new ServerError(`Unexpected error encountered: ${error.message}`);
        } else {
            res.status(200).send(data)
        }

    } catch (error) {
        console.error(error);
        const error_message = error instanceof Error
            ? `Unknown server error: ${error.message}`
            : 'Unknown server error, check server logs for more info';
        res.status(500).json({ error: error_message });
        return;
    };
};