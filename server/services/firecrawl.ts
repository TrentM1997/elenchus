import { cleanURL } from '../helpers/cleanUrl.js';
import { toFailedAttempt } from "../endpoints/articles/firecrawl_extractions.js";
import { validateArticle } from "../schemas/ArticleSchema.js";
import { shapeArticle } from "../helpers/formatting/shapeArticle.js";
import { isContentInvalid } from "../helpers/formatting/isContentInvalid.js";
import type Firecrawl from "@mendable/firecrawl-js";
import type {
    Article,
    MBFC,
    FailedAttempt,
    FirecrawlResponse,
    FcParam
} from "../types/types.js";
import { ServerError } from '../core/errors/ServerError.js';

export const schema = {
    type: "object",
    properties: {
        content_markdown: { type: "string" },
    },
    required: ["content_markdown"],
};

const FIRECRAWL_OPTIONS = {
    onlyMainContent: true,
    blockAds: true,
    maxAge: 31449600000, // 1 year
    waitFor: 1500,
    formats: [{
        type: "json",
        schema,
        prompt:
            "Extract ONLY the main article body. Return it as markdown in content_markdown. Preserve paragraph breaks, headings, bullet lists, and quoted passages. Exclude navigation menus, cookie notices, paywall blurbs, newsletter signups, and unrelated promos."
    }],
} satisfies Parameters<Firecrawl["scrape"]>[1];

export const firecrawlExtract = async (article: FcParam, firecrawl: Firecrawl, MBFC_DATA: MBFC, pushRetrieved: (a: Article) => void, pushFailed: (f: FailedAttempt) => void): Promise<void> => {
    const urlClean = cleanURL(article.url);

    try {
        const { json: content } = await firecrawl.scrape(
            urlClean,
            FIRECRAWL_OPTIONS
        ) as FirecrawlResponse;

        if (isContentInvalid(content)) {
            const failedArticle = toFailedAttempt(article, "empty or incomplete body");
            pushFailed(failedArticle);
            return;
        };

        const extracted: Article = shapeArticle(
            content,
            article,
            MBFC_DATA,
            urlClean
        );

        const {
            isValid,
            details
        } = validateArticle(extracted);

        if (!isValid) {
            console.log(details);
            throw new ServerError("invalid schema from Firecrawl extraction");
        }
        pushRetrieved(extracted);

    } catch (error) {
        console.error(error);
        const failedArticle = toFailedAttempt(article, "scrape failed");
        pushFailed(failedArticle);
        return;
    };
};