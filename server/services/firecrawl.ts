import type Firecrawl from "@mendable/firecrawl-js";
import { cleanURL } from '../helpers/cleanUrl.js';
import type { ScrapedArticle, Bias, FcParam } from '../types/types.js';
import type { FailedAttempt } from "../types/types.js";
import { toFailedAttempt } from "../endpoints/articles/firecrawl_extractions.js";

export interface FirecrawlContent {
    content_markdown: string;
};

export interface FirecrawlResponse {
    metadata: { /* massive meta tag map */ },
    json: FirecrawlContent
};

export type FirecrawlResults = Array<FirecrawlResponse>;

export const schema = {
    type: "object",
    properties: {
        content_markdown: { type: "string" },
    },
    required: ["content_markdown"],
};

interface BiasInfo {
    bias: Bias | null;
    factual_reporting: string | null;
    country: string | null;
}
type MBFC = Map<string, BiasInfo>

export const firecrawlExtract = async (article: FcParam, firecrawl: Firecrawl, MBFC_DATA: MBFC, pushRetrieved: (a: ScrapedArticle) => void, pushFailed: (f: FailedAttempt) => void): Promise<void> => {


    const urlClean = cleanURL(article.url);


    try {
        const data = await firecrawl.scrape(urlClean, {
            onlyMainContent: true,
            blockAds: true,
            maxAge: 31449600000, // 1 year in ms
            waitFor: 1500,
            formats: [{
                type: "json",
                schema: schema,
                prompt: "Extract ONLY the main article body. Return it as markdown in content_markdown. Preserve paragraph breaks, headings, bullet lists, and quoted passages. Exclude navigation menus, cookie notices, paywall blurbs, newsletter signups, and unrelated promos."
            }],
        });


        const results = data as FirecrawlResponse;
        const content: FirecrawlContent = results.json;
        const rating = MBFC_DATA.has(article.source) ? MBFC_DATA.get(article.source) : null;

        if (
            !content ||
            typeof content.content_markdown !== "string" ||
            content.content_markdown.trim().length < 80
        ) {
            const failedArticle = toFailedAttempt(article, "empty or incomplete body");

            pushFailed(failedArticle);
            return;

        }


        const article_extracted: ScrapedArticle = {
            title: article.title,
            provider: article.source,
            authors: "N/A",
            article_url: urlClean,
            image_url: article.image,
            date_published: article.date ?? null,
            fallbackDate: article?.date ?? null,
            summary: null,
            full_text: content?.content_markdown,
            logo: article.logo,
            id: null,
            factual_reporting: rating?.factual_reporting,
            bias: rating?.bias as Bias,
            country: rating?.country
        };

        pushRetrieved(article_extracted);
        return;

    } catch (error) {
        console.error(error);
        const failedArticle = toFailedAttempt(article, "scrape failed");
        pushFailed(failedArticle);
        return;
    };
};