import { Request, Response } from "express";
import { wrapAsync } from "../../../core/async/wrapAsync.js";
import { getUserAndSupabase } from "../client/serverClient.js";
import { validateOrThrow } from "../../../core/validation/validateOrThrow.js";
import { UserSchema } from "../../../schemas/Users.js";
import { getUserContent } from "../../../services/getUserContent.js";
import type { UserContent } from "../../../types/types";


export const getCurrentUser = wrapAsync(async (req: Request, res: Response): Promise<void> => {
    const session = await getUserAndSupabase(req, res);
    if (!session) return;
    const { user, supabase } = session;
    validateOrThrow(UserSchema, user);

    const { id } = user;
    const content: UserContent = await getUserContent(supabase, id);
    const results = {
        user: user,
        userArticles: content?.userArticles ?? null,
        userResearch: content?.userResearch ?? null
    };
    console.log(results);
    res.success("user recovered", results, 200);
    return;
});