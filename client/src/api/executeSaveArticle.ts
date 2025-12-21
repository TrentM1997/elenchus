import type { ArticleSchemaType } from "../../../schemas/api/types/ArticlesSchema";
import type { ArticleEndpointConfig, SaveArticleResult } from "@/transport/types/types";
import { adaptSaveArticleResponse } from "@/transport/response/apiResponses";

function executeSaveArticleRequest(config: ArticleEndpointConfig) {
    return async (article: ArticleSchemaType, exists: boolean): Promise<SaveArticleResult> => {

        try {
            const response = await fetch(config.endpoint, {
                method: 'POST',
                credentials: config.credentials,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dataToSave: article,
                    articleExists: exists
                }),
            });

            const results = await adaptSaveArticleResponse(response)
            return results;
        } catch (error) {

            console.error(error);
            return {
                ok: false,
                reason: 'network'
            }
        }
    };
};

export { executeSaveArticleRequest };