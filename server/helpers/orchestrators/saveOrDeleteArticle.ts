import type { Article, ArticleTransactionResponse } from "../../types/types";
import { saveArticleForUser } from "../../services/supabase/saveArticle.js";
import { deleteArticleForUser } from "../../services/supabase/deleteArticle.js";
import { SupabaseClient } from "@supabase/supabase-js";

const saveOrDeleteArticle = async (
    article: Article,
    exists: boolean,
    supabase: SupabaseClient,
    user_id: string | number,
): Promise<ArticleTransactionResponse | null> => {

    const id: string | number | null = article?.id;

    try {
        if (exists) {
            const deleteOperation: ArticleTransactionResponse | null = await deleteArticleForUser(supabase, user_id, id);
            console.log(deleteOperation);
            return deleteOperation;
        } else {
            const saveOperation: ArticleTransactionResponse | null = await saveArticleForUser(supabase, user_id, article);
            return saveOperation
        }

    } catch (err) {
        console.error("saveOrDeleteArticle failed:", err);
        return null;
    };
};

export { saveOrDeleteArticle };