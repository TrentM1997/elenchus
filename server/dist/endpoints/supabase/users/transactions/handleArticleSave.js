import { ArticleBodySchema } from "../../../../types/types.js";
import { saveOrDeleteArticle } from "../../../../helpers/orchestrators/saveOrDeleteArticle.js";
import { getUserContext } from "../../../../helpers/orchestrators/getUserContext.js";
import { validateOrThrow } from "../../../../core/validation/validateOrThrow.js";
import { wrapAsync } from "../../../../core/async/wrapAsync.js";
export const handleArticleSave = wrapAsync(async (req, res) => {
    const { articleExists, dataToSave } = validateOrThrow(ArticleBodySchema, req.body);
    const ctx = await getUserContext(req, res);
    if (!ctx)
        return;
    const { supabase, user_id } = ctx;
    const result = await saveOrDeleteArticle(dataToSave, articleExists, supabase, user_id);
    res.success("success", result, 200);
});
//# sourceMappingURL=handleArticleSave.js.map