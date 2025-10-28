import { cleanURL } from '../helpers/cleanUrl.js';
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
                formats: [{
                        type: "json",
                        prompt: "Provide the main article body as markdown, preserving paragraphs, headings, and bullet lists.",
                        schema: schema,
                    }]
            }
        });
        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];
            const item = batchJob?.data?.[index];
            const json = item?.json;
            const currArticle = articles.find((article) => {
                const cleanedLink = cleanURL(article.url);
                const item = cleanedLink === url;
                return item ?? null;
            });
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