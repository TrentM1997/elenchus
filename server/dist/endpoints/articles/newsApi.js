import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { shapeBrowsingOptions } from '../../helpers/formatting/shapeArticleOption.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const NEWSAPI_KEY = process.env.NEWS_API;
export async function newsApi(req, res) {
    try {
        const q = req.query.q || '';
        const query = decodeURIComponent(q);
        const pageSize = req.query.count || '30';
        const page = req.query.page || '1';
        const url = new URL('https://newsapi.org/v2/everything');
        if (q)
            url.searchParams.set('q', query);
        url.searchParams.set('language', 'en');
        url.searchParams.set('sortBy', 'publishedAt');
        url.searchParams.set('pageSize', pageSize);
        url.searchParams.set('page', page);
        const r = await fetch(url.toString(), { headers: { 'X-Api-Key': NEWSAPI_KEY } });
        if (!r.ok) {
            const text = await r.text();
            res.status(r.status).json({ message: text || r.statusText, data: null });
            return;
        }
        const json = await r.json();
        const articles = json.articles ?? [];
        const shapedBrowsingOptions = shapeBrowsingOptions(articles);
        res.status(200).json({ message: "success", data: shapedBrowsingOptions });
        return;
    }
    catch (err) {
        console.error('newsApiArticles error:', err);
        res.status(500).json({ message: "failed", data: null });
        return;
    }
    ;
}
;
//# sourceMappingURL=newsApi.js.map