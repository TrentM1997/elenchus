import Firecrawl from "@mendable/firecrawl-js";
import { cleanURL } from '../helpers/cleanUrl.js';
import type { FailedAttempt, ScrapedArticle, Bias, FcParam } from '../types/types.js';
import { toFailedAttempt } from "../endpoints/firecrawl_extractions.js";
import type { BatchScrapeJob } from "@mendable/firecrawl-js";
import { stripVideo } from "../helpers/stripVideo.js";

export interface BatchItem {
    url: string,
    markdown?: string,
    metadata?: Record<string, any>,
    success?: boolean,
    error?: string
};

interface BiasInfo {
    bias: Bias | null;
    factual_reporting: string | null;
    country: string | null;
}

type MBFC = Map<string, BiasInfo>

const excluded_tags = [
    // multimedia / ads
    "video", "iframe", "noscript", "embed", "object",
    ".ad", ".ads", ".advertisement", ".sponsor", ".sponsored", ".ad-container", ".ad-slot",
    ".promo", ".promotion", ".affiliate", ".outbrain", ".taboola",

    // nav / banners / popups / sticky UI
    "nav", "footer", "header", "aside", "form",
    ".nav", ".banner", ".popup", ".modal", ".overlay",
    ".sticky", ".fixed", ".floating", ".topbar", ".bottom-bar", ".announcement",

    // social & comments
    ".share", ".social", ".comments", ".comment", "#comments",
    ".fb", ".twitter", ".instagram", ".tiktok", ".linkedin", ".reddit",
    ".follow", ".like-button", ".share-buttons",

    // cookie and consent
    ".cookie", ".cookie-banner", ".consent", "#consent", ".gdpr", ".privacy", ".disclaimer",

    // recirculation / recommended / related / trending
    ".recommended", ".recommendations", ".recirc", ".related", ".related-content",
    ".read-more", ".more-stories", ".trending", ".popular", ".you-may-also-like",
    ".more-on", ".more-from", ".next-article", ".previous-article",
    ".sidebar", ".right-rail", ".left-rail",

    // newsletter / subscription / paywall
    ".newsletter", ".subscription", ".subscribe", ".signup", ".paywall", ".meter", ".login",

    // player wrappers
    ".player-container", ".ytp", ".jwplayer", ".vjs", ".audio-player", ".media-player",

    ".sponsored-content", ".external-links", ".widget", ".tools", ".comments-section"
];


export async function firecrawlBatchScrape(firecrawl: Firecrawl, articles: FcParam[], failed: FailedAttempt[], MBFC_DATA: MBFC, retrieved: ScrapedArticle[]): Promise<void> {

    const urls = articles.map((article: FcParam) => {
        const cleansed = cleanURL(article.url);
        return cleansed;
    });


    try {

        const batchJob: BatchScrapeJob = await firecrawl.batchScrape(urls, {
            options: {
                waitFor: 1500,
                excludeTags: excluded_tags,
                blockAds: true,
                onlyMainContent: true,
                formats: ["markdown"]
            }
        }
        );

        if ((batchJob.status === 'failed') || (!Array.isArray(batchJob.data))) {
            for (const art of articles) {
                failed.push(toFailedAttempt(art, "Batch scrape failed"));
            }
            return;
        }

        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];

            const item = batchJob?.data?.[index] as BatchItem | undefined;

            if (!item) {
                continue;
            };

            const markdown = item?.markdown ?? "";
            const markdown_content = markdown ? stripVideo(markdown) : markdown;



            const currArticle = articles.find((article: FcParam) => {
                const cleanedLink: string = cleanURL(article.url);
                const item = cleanedLink === url;
                return item ?? null
            }) as FcParam;

            if (!markdown_content) {
                const failedscrape = toFailedAttempt(currArticle, "Content may be paywalled");
                failed.push(failedscrape);
                continue;
            };

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
                };

                continue;
            } else {
                const rating = MBFC_DATA.has(currArticle.source) ? MBFC_DATA.get(currArticle.source) : null


                const scraped: ScrapedArticle = {
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
                    bias: rating?.bias as Bias,
                    country: rating?.country ?? null
                };

                retrieved.push(scraped);
            }
        };


        return;

    } catch (err) {
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
    };
};