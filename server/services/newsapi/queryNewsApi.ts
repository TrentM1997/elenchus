import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { shapeBrowsingOptions } from '../../helpers/formatting/shapeArticleOption.js';
import type { BrowsingOption } from '../../types/types';
import { ServerError } from '../../core/errors/ServerError.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const NEWSAPI_KEY = process.env.NEWS_API as string;


const queryNewsApi = async (query: string) => {

    const pageSize = '30', page = '1';

    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q', query);
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', pageSize);
    url.searchParams.set('page', page);

    const r = await fetch(url.toString(), { headers: { 'X-Api-Key': NEWSAPI_KEY } });
    if (!r.ok) {
        throw new ServerError("Couldn't connect to NewsAPI service");
    }

    const json = await r.json();
    const articles = json.articles ?? [];
    const shapedBrowsingOptions: BrowsingOption[] = shapeBrowsingOptions(articles);

    return shapedBrowsingOptions;
};

export { queryNewsApi };