import type { FcParam, FailedAttempt } from "../../../types/types";
import { cleanURL } from "../../../helpers/cleanUrl.js";

export function toFailedAttempt(a: FcParam, reason: string): FailedAttempt {
    const cleaned = cleanURL(a.url);
    return {
        title: a.title,
        summary: [{ denied: reason, failedArticle: a.url }],
        logo: a.logo,
        source: a.source,
        date: a.date,
        article_url: cleaned,
    };
}