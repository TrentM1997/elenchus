import type { SaveArticleResult } from "@/infra/transport/types/types";


async function adaptSaveArticleResponse(
    response: Response
): Promise<SaveArticleResult> {
    if (!response.ok) {
        if (response.status === 401) {
            return Promise.resolve({ ok: false, reason: 'unauthorized' });
        }
        return Promise.resolve({ ok: false, reason: 'unknown' });
    }

    const data = await response.json()

    return { ok: true, id: data.id }
};

export { adaptSaveArticleResponse };