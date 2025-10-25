import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../../.env');
import { FIRECRAWL_KEY } from '../src/Config.js';
import Firecrawl from "@mendable/firecrawl-js";
import { TldrRequest } from '../types/types.js';
import { performance } from 'perf_hooks';
import { getMediaBiases } from '../endpoints/mediaBias.js';
import { cleanURL } from '../helpers/cleanUrl.js';
import type { FailedAttempt, ScrapedArticle } from '../types/types.js';

export interface FirecrawlContent {
    title: string;
    author: string;
    source: string;
    content: string;
    imageUrl?: string;
    publishedDate?: string;
}

export interface FirecrawlResponse {
    metadata: { /* massive meta tag map */ },
    json: FirecrawlContent
};

export type FirecrawlResults = Array<FirecrawlResponse>;


export interface ExtractRes {
    data: ScrapedArticle | null,
    message: string
};


export const firecrawlExtract = async (article: TldrRequest, failed: FailedAttempt[]): Promise<ExtractRes> => {

    const schema = {
        type: "object",
        properties: {
            title: { type: "string" },
            author: { type: "string" },
            publishedDate: { type: "string" },
            source: { type: "string" },
            content: { type: "string" },
            imageUrl: { type: "string" },
        },
        required: ["title", "source", "content"],
    };

    const firecrawl = new Firecrawl({
        apiKey: FIRECRAWL_KEY
    });

    const santizedSource = article.source.trim();
    const biasRatings = await getMediaBiases(santizedSource);
    const urlClean = cleanURL(article.url);


    try {
        const start = performance.now();
        const data = await firecrawl.scrape(urlClean, {
            formats: [{
                type: "json",
                schema: schema
            }],
        });


        const results = data as FirecrawlResponse;
        const content: FirecrawlContent = results.json;
        const end: number = performance.now();
        const duration: string = (end - start).toFixed(2);

        const article_extracted: ScrapedArticle = {
            article_abstract: null,
            article_authors: [content.author],
            article_html: null,
            article_image: content.imageUrl ?? article.image,
            article_pub_date: article.date ?? null,
            article_text: content.content ?? null,
            article_title: content.title ?? article.title,
            article_url: article.url,
            bias: biasRatings?.bias ?? null,
            country: biasRatings?.country ?? null,
            date: article.date,
            factual_reporting: biasRatings?.factual_reporting ?? null,
            logo: article.logo ?? null,
            source: article.source ?? null,
            summary: null
        };

        if (content) {
            console.log({
                status: "firecrawl scraped successfully",
                runtime: `duration in milliseconds: ${duration}`
            });
        };

        return { data: article_extracted, message: 'success' };

    } catch (error) {
        console.log({ status: "firecrawl error encountered" });
        console.error(error);
        const failedArticle = {
            title: article.title,
            summary: [{ denied: 'We were denied access to the article from', failedArticle: `${article.source} - ${article.title}` }],
            logo: article.logo,
            source: article.source,
            date: article.date,
            article_url: article.url,
        };
        failed.push(failedArticle);
        return { data: null, message: `failed to scrape from - ${article.url}` }
    };
};