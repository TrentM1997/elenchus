import * as path from 'path'
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url)
const __dirname = path.dirname(envUrl)
const envPath = path.resolve(__dirname, '../../.env');
import { FIRECRAWL_KEY } from '../src/Config.js';
import Firecrawl from "@mendable/firecrawl-js";
import { TldrRequest } from '../types/types.js';
import { getMediaBiases } from '../endpoints/mediaBias.js';
import { cleanURL } from '../helpers/cleanUrl.js';
import type { FailedAttempt, ScrapedArticle, Bias } from '../types/types.js';

export interface FirecrawlContent {
    title: string;
    author: string;
    source: string;
    content_markdown: string;
    imageUrl?: string;
    publishedDate?: string;
}

export interface FirecrawlResponse {
    metadata: { /* massive meta tag map */ },
    json: FirecrawlContent
};

export type FirecrawlResults = Array<FirecrawlResponse>;

export const schema = {
    type: "object",
    properties: {
        title: { type: "string" },
        author: { type: "string" },
        publishedDate: { type: "string" },
        source: { type: "string" },
        content_markdown: { type: "string" },
        imageUrl: { type: "string" },
    },
    required: ["title", "source", "content"],
};


export const firecrawlExtract = async (article: TldrRequest, failed: FailedAttempt[]): Promise<ScrapedArticle | null> => {

    const firecrawl = new Firecrawl({
        apiKey: FIRECRAWL_KEY
    });

    const santizedSource = article.source.trim();
    const biasRatings = await getMediaBiases(santizedSource);
    const urlClean = cleanURL(article.url);


    try {
        const data = await firecrawl.scrape(urlClean, {
            formats: [{
                type: "json",
                schema: schema,
                prompt: "Provide the main article body as markdown, preserving paragraphs, headings, and bullet lists."
            }],
        });


        const results = data as FirecrawlResponse;
        const content: FirecrawlContent = results.json;

        const article_extracted: ScrapedArticle = {
            title: article.title,
            provider: article.source,
            authors: content?.author ?? null,
            article_url: urlClean,
            image_url: content?.imageUrl ?? article.image,
            date_published: article.date ?? content?.publishedDate,
            fallbackDate: article?.date ?? null,
            summary: null,
            full_text: content?.content_markdown,
            logo: article.logo,
            id: null,
            factual_reporting: biasRatings?.factual_reporting,
            bias: biasRatings?.bias as Bias,
            country: biasRatings?.country ?? null
        };

        return article_extracted;

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
        return null
    };
};