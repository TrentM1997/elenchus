import { Request, Response } from "express";
import type { ArticleBody } from "../../types/interfaces.js";
import { validateArticle } from "../../schemas/ArticleSchema.js";
import { saveOrDeleteArticle } from "../../helpers/orchestrators/saveOrDeleteArticle.js";
import { ArticleTransactionResponse } from "../../types/types.js";
import { getUserContext } from "../../helpers/orchestrators/getUserContext.js";

export const handleArticleSave = async (req: Request, res: Response): Promise<void> => {
    const { articleExists, dataToSave } = req.body as ArticleBody;
    const { isValid, details } = validateArticle(dataToSave as unknown);

    if (!isValid) {
        console.log("***********INVALID SCHEMA*********************");
        console.log(details);
        res.status(400).json({
            success: false,
            message: `Invalid article schema • ${details}`
        });
        return;
    };

    const ctx = await getUserContext(req, res);
    if (!ctx) return;
    const {
        supabase,
        user_id
    } = ctx;

    try {
        const result: ArticleTransactionResponse | null = await saveOrDeleteArticle(
            dataToSave,
            articleExists,
            supabase,
            user_id
        );

        if (!result) {
            res.status(400).json(
                {
                    success: false,
                    data: `Database operation failed to execute.`
                }
            );
            return;
        };

        const response = {
            success: true,
            data: result
        };
        res.status(200).send(response);

    } catch (error) {
        console.log(error);

        if (error instanceof Error) {
            res.status(500).json({ success: false, message: `Unknown server error ${error}` });
            return;
        } else {
            res.status(500).json({ success: false, message: 'Unknown server error, check server logs for more info' });
            return;
        };
    };
};
