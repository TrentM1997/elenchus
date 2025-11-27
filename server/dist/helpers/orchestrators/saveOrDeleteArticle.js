import { saveArticleForUser } from "../../services/saveArticle.js";
import { deleteArticleForUser } from "../../services/deleteArticle.js";
const saveOrDeleteArticle = async (article, exists, supabase, user_id) => {
    const id = article?.id;
    try {
        if (exists) {
            const deleteOperation = await deleteArticleForUser(supabase, user_id, id);
            console.log(deleteOperation);
            return deleteOperation;
        }
        else {
            const saveOperation = await saveArticleForUser(supabase, user_id, article);
            return saveOperation;
        }
    }
    catch (err) {
        console.error("saveOrDeleteArticle failed:", err);
        return null;
    }
    ;
};
export { saveOrDeleteArticle };
//# sourceMappingURL=saveOrDeleteArticle.js.map