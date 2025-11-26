import { getUserAndSupabase } from "./serverClient";
export const getUserArticles = async (req, res) => {
    const session = await getUserAndSupabase(req, res);
    if (!session)
        return;
    const { supabase, user } = session;
    try {
        const { data, error } = await supabase
            .from('articles')
            .select()
            .eq('user_id', user.id);
        if (error) {
            console.error(error.message);
            throw new Error(`Unexpected error encountered: ${error.message}`);
        }
        else {
            res.status(200).send(data);
        }
    }
    catch (error) {
        console.error(error);
        const error_message = error instanceof Error
            ? `Unknown server error: ${error.message}`
            : 'Unknown server error, check server logs for more info';
        res.status(500).json({ error: error_message });
        return;
    }
    ;
};
//# sourceMappingURL=getUserArticles.js.map