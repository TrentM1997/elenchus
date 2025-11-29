import { Request, Response } from "express";
import { getUserAndSupabase } from "../../client/serverClient.js";

export const getUserResearch = async (req: Request, res: Response): Promise<void> => {
    const session = await getUserAndSupabase(req, res);
    if (!session) return;
    const { supabase, user } = session;

    try {
        const { data, error } = await supabase
            .from('investigations')
            .select()
            .eq('user_id', user.id)

        if (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
            return;

        } else {
            res.status(200).send(data);
            return;

        };

    } catch (error) {
        console.error(error);
        const error_message = error instanceof Error
            ? `Unknown server error: ${error.message}`
            : 'Unknown server error, check server logs for more info';
        res.status(500).json({ error: error_message });
        return;
    };
};
