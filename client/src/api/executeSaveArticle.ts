import type { ArticleSchemaType } from "../../../schemas/api/types/ArticlesSchema";
import type { ArticleEndpointConfig } from "@/transport/types";

function executeSaveArticleRequest(config: ArticleEndpointConfig) {
    return async (article: ArticleSchemaType, exists: boolean) => {
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

        if (!response.ok) {
            console.error(response.statusText);
            throw new Error('could not fetch endpoint');
        };

        return response.json() as Promise<SavedResponse>
    }

};

export { executeSaveArticleRequest };