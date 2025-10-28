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

export async function firecrawlBatchScrape(firecrawl: Firecrawl, articles: FcParam[], failed: FailedAttempt[], MBFC_DATA: MBFC): Promise<ScrapedArticle[]> {

    const urls = articles.map((article: FcParam) => {
        const cleansed = cleanURL(article.url);
        return cleansed;
    });

    const scraped_articles: ScrapedArticle[] = [];

    try {

        const batchJob: BatchScrapeJob = await firecrawl.batchScrape(urls, {
            options: {
                waitFor: 3000,
                excludeTags: ["video", "iframe", "noscript", ".cookie-banner", ".player-container"],
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
            return scraped_articles;
        }

        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];

            const item = batchJob?.data?.[index] as BatchItem | undefined;

            if (!item) {
                continue;
            };

            const markdown = item?.markdown ?? "";
            const markdown_content = markdown ? stripVideo(markdown) : markdown;

            const tooSmall = markdown_content.length < 200;
            const looksPaywalled = /subscribe|sign in|sign up|enable javascript|disable your ad blocker/i.test(markdown_content);


            const currArticle = articles.find((article: FcParam) => {
                const cleanedLink: string = cleanURL(article.url);
                const item = cleanedLink === url;
                return item ?? null
            }) as FcParam;

            if (!markdown_content || tooSmall || looksPaywalled) {
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

                scraped_articles.push(scraped);
            }
        };


        return scraped_articles;

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
        return scraped_articles;
    };
};