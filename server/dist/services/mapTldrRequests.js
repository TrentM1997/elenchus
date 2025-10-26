const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../../.env');
import { TLDR_KEY } from '../src/Config.js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import cleanseAuthorList from '../helpers/authorCleanup.js';
import decodeItem from '../helpers/decodeItem.js';
import { getMediaBiases } from '../endpoints/mediaBias.js';
import { cleanURL } from '../helpers/cleanUrl.js';
import { delay } from '../helpers/throttle.js';
import { getPromiseValues } from '../helpers/getPromiseValues.js';
export async function mapTldrRequests(articles, failed) {
    const dataMap = articles.map(async (article, index) => {
        const url = 'https://tldrthis.p.rapidapi.com/v1/model/abstractive/summarize-url/';
        const santizedSource = article.source.trim();
        const biasRatings = await getMediaBiases(santizedSource);
        const urlClean = cleanURL(article.url);
        await delay(index * 2000);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': TLDR_KEY,
                    'x-rapidapi-host': 'tldrthis.p.rapidapi.com',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: urlClean,
                    is_detailed: false,
                    min_length: 100,
                    max_length: 300,
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to fetch summary for ${article.url}: ${response.status} ${response.statusText} - ${errorText}`);
                throw new Error(`Failed to fetch summary for ${article.url}: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            data.provider = article.source;
            data.full_text = data.article_text;
            data.title = article.title;
            data.image_url = article.image;
            data.logo = article.logo;
            data.source = article.source;
            data.date_published = data.article_pub_date;
            data.bias = biasRatings?.bias ?? null;
            data.country = biasRatings?.country ?? null;
            data.factual_reporting = biasRatings?.factual_reporting ?? null;
            console.log({
                Data: data.date_published
            });
            const decodedData = decodeItem(data);
            decodedData.article_authors = cleanseAuthorList(decodedData.article_authors);
            return decodedData;
        }
        catch (error) {
            console.error("mapTldrReqests failed for", article.url, error);
            const failedAttempt = {
                title: article.title,
                summary: [{ denied: 'We were denied access to the article from', failedArticle: `${article.source} - ${article.title}` }],
                logo: article.logo,
                source: article.source,
                date: article.date,
                article_url: article.url,
            };
            failed.push(failedAttempt);
            return null;
        }
        ;
    });
    const results = await Promise.allSettled(dataMap);
    const returnValues = getPromiseValues(results);
    const resultsObject = { retrieved: returnValues, rejected: failed };
    return resultsObject;
}
;
//# sourceMappingURL=mapTldrRequests.js.map