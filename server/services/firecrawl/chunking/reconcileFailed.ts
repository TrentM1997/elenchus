import type { Article, FailedAttempt } from "../../../types/types";
import { cleanURL } from "../../../helpers/cleanUrl.js";

function reconcileFailed(retrieved: Article[], failed: FailedAttempt[]) {
    const success = new Set(retrieved.map(r => cleanURL(r.article_url)));
    for (let i = failed.length - 1; i >= 0; i--) {
        if (success.has(cleanURL(failed[i].article_url))) failed.splice(i, 1);
    }
};


export { reconcileFailed };