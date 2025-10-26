import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../../.env');
import { FIRECRAWL_KEY } from '../src/Config.js';
import Firecrawl from "@mendable/firecrawl-js";
import { getMediaBiases } from '../endpoints/mediaBias.js';
import { cleanURL } from '../helpers/cleanUrl.js';
import type { FailedAttempt, ScrapedArticle, Bias, FcParam } from '../types/types.js';


interface FirecrawlJSON {
    title?: string;
    description?: string;
    author?: string | string[];
    imageUrl?: string;
    publishedDate?: string;
    content_markdown?: string;
};

interface FirecrawlBatchItem {
    json: FirecrawlJSON
};

interface BiasInfo {
    bias: Bias | null;
    factual_reporting: string | null;
    country: string | null;
}

type BatchResults = Array<ScrapedArticle> | null

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

async function getBiasData(articles: FcParam[]): Promise<Map<string, BiasInfo>> {
    const biasRatings = new Map<string, BiasInfo>();

    for (let i = 0; i < articles.length; i++) {
        let source = articles[i].source;
        let rating = await getMediaBiases(source);

        let normalized: BiasInfo = {
            bias: rating?.bias ?? null,
            factual_reporting: rating?.factual_reporting ?? null,
            country: rating?.country ?? null
        };

        biasRatings.set(source, normalized);
    };

    return biasRatings;
};

export async function firecrawlBatchScrape(articles: FcParam[], failed: FailedAttempt[]): Promise<ScrapedArticle[]> {

    const firecrawl = new Firecrawl({ apiKey: FIRECRAWL_KEY });
    const urls = articles.map((article: FcParam) => {
        const cleansed = cleanURL(article.url);
        return cleansed;
    });

    const MBFC_DATA = await getBiasData(articles);
    const scraped_articles: ScrapedArticle[] = [];

    try {

        const batchJob = await firecrawl.batchScrape(urls, {
            options: {
                formats: [{
                    type: "json",
                    prompt: "Provide the main article body as markdown, preserving paragraphs, headings, and bullet lists.",
                    schema: schema
                }]
            }
        }
        );

        for(let index = 0; index < urls.length; index++) {
            const url = urls[index];

            const item = batchJob?.data?.[index] as FirecrawlBatchItem;
            const json: FirecrawlJSON = item?.json;

            const currArticle = articles.find((article: FcParam) => {
                const cleanedLink: string = cleanURL(article.url);
                const item = cleanedLink === url;
                return item ?? null
            }) as FcParam;

            if (!json) {

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
                title: json.title ?? currArticle.title,
                provider: currArticle?.source,
                authors: json?.author ?? "Author N/A",
                article_url: url,
                image_url: currArticle?.image ?? json?.imageUrl,
                date_published: currArticle?.date ?? json?.publishedDate,
                fallbackDate: currArticle?.date ?? null,
                summary: null,
                full_text: json?.content_markdown ?? "Failed to retrieve article content",
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
        return scraped_articles;
    };
};





       // const results = urls.map((url: string, index: number): void => {
//
       //     const item = batchJob?.data?.[index] as FirecrawlBatchItem;
       //     const json: FirecrawlJSON = item?.json;
//
       //     const currArticle = articles.find((article: FcParam) => {
       //         const item = article.url === url;
       //         return item ?? null
       //     }) as FcParam;
//
       //     if (!json) {
//
       //         const failedArticle = currArticle ? {
       //             title: currArticle.title,
       //             summary: [{ denied: 'We were denied access to the article from', failedArticle: `${currArticle.source} - ${currArticle.title}` }],
       //             logo: currArticle.logo,
       //             source: currArticle.source,
       //             date: currArticle.date,
       //             article_url: currArticle.url,
       //         } : null;
//
       //         if (failedArticle) {
       //             failed.push(failedArticle);
       //         };
//
       //         return;
       //     } else {
       //          const rating = MBFC_DATA.has(currArticle.source) ? MBFC_DATA.get(currArticle.source) : null
//
//
       //     const scraped: ScrapedArticle = {
       //         title: json.title ?? currArticle.title,
       //         provider: currArticle?.source,
       //         authors: json?.author ?? "Author N/A",
       //         article_url: url,
       //         image_url: currArticle?.image ?? json?.imageUrl,
       //         date_published: currArticle?.date ?? json?.publishedDate,
       //         fallbackDate: currArticle?.date ?? null,
       //         summary: null,
       //         full_text: json?.content_markdown ?? "Failed to retrieve article content",
       //         logo: currArticle?.logo,
       //         id: null,
       //         factual_reporting: rating?.factual_reporting,
       //         bias: rating?.bias as Bias,
       //         country: rating?.country ?? null
       //     };
//
       //     scraped_articles.push(scraped);
       // }
       //    
       // });