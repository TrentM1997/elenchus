import { cleanURL } from "../../../helpers/cleanUrl.js";
export function toFailedAttempt(a, reason) {
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
//# sourceMappingURL=toFailedAttempt.js.map