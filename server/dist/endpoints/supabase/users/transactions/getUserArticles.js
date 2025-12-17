import { wrapAsync } from "../../../../core/async/wrapAsync.js";
import { ServerError } from "../../../../core/errors/ServerError.js";
import { getUserAndSupabase } from "../../client/serverClient.js";
export const getUserArticles = wrapAsync(async (req, res) => {
    const { supabase, user } = await getUserAndSupabase(req);
    const { data, error } = await supabase
        .from('articles')
        .select()
        .eq('user_id', user.id);
    if (error)
        throw new ServerError("Failed to retrieve articles from DB", 500, error);
    //const articles = validateOrThrow(AritclesArraySchema, data);
    res.success("retrieved user articles", data, 200);
});
//# sourceMappingURL=getUserArticles.js.map