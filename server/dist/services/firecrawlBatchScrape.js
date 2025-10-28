import { cleanURL } from '../helpers/cleanUrl.js';
import { toFailedAttempt } from "../endpoints/firecrawl_extractions.js";
import { stripVideo } from "../helpers/stripVideo.js";
;
const exluded_tags = [
    // multimedia / ads
    "video", "iframe", "noscript", "embed", "object",
    // nav / banners / popups
    "nav", "footer", "header", "aside", "form",
    // social & comments
    ".share", ".social", ".comments", ".comment", "#comments",
    // cookie and consent
    ".cookie", ".cookie-banner", ".consent", "#consent",
    // recirculation / recommended / related
    ".recommended", ".recommendations", ".recirc", ".related", ".related-content",
    ".read-more", ".more-stories", ".trending", ".popular", ".you-may-also-like",
    ".newsletter", ".subscription", ".subscribe", ".signup",
    // player wrappers
    ".player-container", ".ytp", ".jwplayer", ".vjs"
];
export async function firecrawlBatchScrape(firecrawl, articles, failed, MBFC_DATA, retrieved) {
    const urls = articles.map((article) => {
        const cleansed = cleanURL(article.url);
        return cleansed;
    });
    const scraped_articles = [];
    try {
        const batchJob = await firecrawl.batchScrape(urls, {
            options: {
                waitFor: 2000,
                excludeTags: exluded_tags,
                blockAds: true,
                onlyMainContent: true,
                formats: ["markdown"]
            }
        });
        if ((batchJob.status === 'failed') || (!Array.isArray(batchJob.data))) {
            for (const art of articles) {
                failed.push(toFailedAttempt(art, "Batch scrape failed"));
            }
            return;
        }
        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];
            const item = batchJob?.data?.[index];
            if (!item) {
                continue;
            }
            ;
            const markdown = item?.markdown ?? "";
            const markdown_content = markdown ? stripVideo(markdown) : markdown;
            const currArticle = articles.find((article) => {
                const cleanedLink = cleanURL(article.url);
                const item = cleanedLink === url;
                return item ?? null;
            });
            if (!markdown_content) {
                const failedscrape = toFailedAttempt(currArticle, "Content may be paywalled");
                failed.push(failedscrape);
                continue;
            }
            ;
            if (!item || Object.keys(item).length === 0) {
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
                    full_text: markdown_content ?? "Failed to retrieve article content",
                    logo: currArticle?.logo,
                    id: null,
                    factual_reporting: rating?.factual_reporting,
                    bias: rating?.bias,
                    country: rating?.country ?? null
                };
                retrieved.push(scraped);
            }
        }
        ;
        return;
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
        return;
    }
    ;
}
;
//# sourceMappingURL=firecrawlBatchScrape.js.map