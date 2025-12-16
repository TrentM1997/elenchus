import { wrapAsync } from "../../../../core/async/wrapAsync.js";
import { ServerError } from "../../../../core/errors/ServerError.js";
import { validateOrThrow } from "../../../../core/validation/validateOrThrow.js";
import { AritclesArraySchema } from "../../../../schemas/ArticleSchema.js";
import { getUserAndSupabase } from "../../client/serverClient.js";
import { Request, Response } from "express";

export const getUserArticles = wrapAsync(async (
    req: Request,
    res: Response
): Promise<void> => {

    const { supabase, user } = await getUserAndSupabase(req);

    const { data, error } = await supabase
        .from('articles')
        .select()
        .eq('user_id', user.id)

    if (error) throw new ServerError("Failed to retrieve articles from DB", 500, error);

    //const articles = validateOrThrow(AritclesArraySchema, data);

    res.success("retrieved user articles", data, 200);
});