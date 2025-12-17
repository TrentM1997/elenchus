import type { ArticleSchemaType } from "../../../../schemas/api/types/ArticlesSchema"


async function executeSaveArticle(
    article: ArticleSchemaType,
    exists: boolean
) {

    const response = await fetch('/articleOperation', {
        method: 'POST',
        credentials: 'include',
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
};

export { executeSaveArticle };