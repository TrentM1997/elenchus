import { cleanURL } from '../helpers/cleanUrl.js';
import { toFailedAttempt } from "../endpoints/firecrawl_extractions.js";
;
;
;
const schema = {
    type: "object",
    properties: {
        title: { type: "string" },
        author: { type: "string" },
        publishedDate: { type: "string" },
        source: { type: "string" },
        content_markdown: { type: "string" },
        imageUrl: { type: "string" },
    },
    required: ["title", "source", "content_markdown"],
};
export async function firecrawlBatchScrape(firecrawl, articles, failed, MBFC_DATA) {
    const urls = articles.map((article) => {
        const cleansed = cleanURL(article.url);
        return cleansed;
    });
    const scraped_articles = [];
    try {
        const batchJob = await firecrawl.batchScrape(urls, {
            options: {
                onlyMainContent: true,
                formats: ["markdown"]
            }
        });
        if ((batchJob.status === 'failed') || (!Array.isArray(batchJob.data))) {
            for (const art of articles) {
                failed.push(toFailedAttempt(art, "Batch scrape failed"));
            }
            return scraped_articles; // exit early so we don't hit undefined
        }
        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];
            const json = batchJob?.data?.[index];
            if (!json) {
                continue;
            }
            ;
            const markdown = json?.markdown ?? "";
            const tooSmall = markdown.length < 200;
            const looksPaywalled = /subscribe|sign in|sign up|enable javascript|disable your ad blocker/i.test(markdown);
            const currArticle = articles.find((article) => {
                const cleanedLink = cleanURL(article.url);
                const item = cleanedLink === url;
                return item ?? null;
            });
            if (!markdown || tooSmall || looksPaywalled) {
                const failedscrape = toFailedAttempt(currArticle, "Content may be paywalled");
                failed.push(failedscrape);
                continue;
            }
            ;
            if (!json || Object.keys(json).length === 0) {
                const failedArticle = currArticle ? {
                    title: currArticle.title,
                    summary: [{ denied: 'We were denied access to the article from', failedArticle: `${currArticle.source} - ${currArticle.title}` }],
                    logo: currArticle.logo,
                    source: currArticle.source,
                    date: currArticle.date,
                    article_url: currArticle.url,
                } : null;
                if (failedArticle) {
                    failed.push(failedArticle);
                }
                ;
                continue;
            }
            else {
                const rating = MBFC_DATA.has(currArticle.source) ? MBFC_DATA.get(currArticle.source) : null;
                const scraped = {
                    title: currArticle.title,
                    provider: currArticle?.source,
                    authors: "N/A",
                    article_url: url,
                    image_url: currArticle?.image ?? null,
                    date_published: currArticle?.date ?? "Date of publication unavailable: visit source for date",
                    fallbackDate: currArticle?.date ?? null,
                    summary: null,
                    full_text: json?.markdown ?? "Failed to retrieve article content",
                    logo: currArticle?.logo,
                    id: null,
                    factual_reporting: rating?.factual_reporting,
                    bias: rating?.bias,
                    country: rating?.country ?? null
                };
                scraped_articles.push(scraped);
            }
        }
        ;
        return scraped_articles;
    }
    catch (err) {
        console.error(err);
        for (const art of articles) {
            failed.push({
                title: art.title,
                summary: [{
                        denied: 'We were denied access to the article from',
                        failedArticle: `${art.source} - ${art.title}`
                    }],
                logo: art.logo,
                source: art.source,
                date: art.date,
                article_url: art.url,
            });
        }
        return scraped_articles;
    }
    ;
}
;
//# sourceMappingURL=firecrawlBatchScrape.js.map