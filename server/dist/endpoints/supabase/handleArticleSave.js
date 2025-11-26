import { getUserAndSupabase } from "./serverClient";
import { saveArticleForUser } from "../../services/saveArticle";
import { deleteArticleForUser } from "../../services/deleteArticle";
export const handleArticleSave = async (req, res) => {
    const { articleExists, dataToSave } = req.body;
    const session = await getUserAndSupabase(req, res);
    if (!session)
        return;
    const { supabase, user } = session;
    const user_id = user?.id;
    const { id } = dataToSave;
    try {
        let result;
        if ((articleExists === true) && (id)) {
            console.log('deleting');
            result = await deleteArticleForUser(supabase, user_id, id);
        }
        else {
            console.log('saving');
            result = await saveArticleForUser(supabase, user_id, dataToSave);
        }
        if (result) {
            console.log(result);
            const responseObject = { success: true, data: result };
            res.status(200).send(responseObject);
            return;
        }
        else {
            res.status(400).json({ success: false, message: `Database operation failed to execute.` });
            return;
        }
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: `Unknown server error ${error}` });
            return;
        }
        else {
            res.status(500).json({ success: false, message: 'Unknown server error, check server logs for more info' });
            return;
        }
        ;
    }
    ;
};
//# sourceMappingURL=handleArticleSave.js.map