import { wrapAsync } from "../../../core/async/wrapAsync.js";
import { getUserAndSupabase } from "../client/serverClient.js";
import { validateOrThrow } from "../../../core/validation/validateOrThrow.js";
import { UserSchema } from "../../../schemas/Users.js";
import { getUserContent } from "../../../services/getUserContent.js";
export const getCurrentUser = wrapAsync(async (req, res) => {
    const session = await getUserAndSupabase(req, res);
    if (!session)
        return;
    const { user, supabase } = session;
    validateOrThrow(UserSchema, user);
    const { id } = user;
    const content = await getUserContent(supabase, id);
    const results = {
        user: user,
        userArticles: content?.userArticles ?? null,
        userResearch: content?.userResearch ?? null
    };
    console.log(results);
    res.success("user recovered", results, 200);
    return;
});
//# sourceMappingURL=getCurrentUser.js.map