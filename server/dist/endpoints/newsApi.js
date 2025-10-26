import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import decodeItem from '../helpers/decodeItem.js';
import { logoMap } from './logoMap.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const NEWSAPI_KEY = process.env.NEWS_API;
const logoMapData = new Map(Object.entries(logoMap));
export async function newsApi(req, res) {
    console.log('/newsArticles hit');
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
        const mapped = (json.articles ?? []).map((a) => {
            const d = new Date(a.publishedAt);
            const datePublished = d.toString().split(' ').splice(0, 4).join(' ');
            return {
                name: a.title ?? '',
                url: a.url ?? '',
                image: { img: a.urlToImage ?? null, width: null, height: null },
                description: a.description ?? '',
                keywords: [[]],
                provider: a.source.name,
                date_published: datePublished ?? null,
            };
        });
        const shapedArticles = mapped.map((article) => {
            const provider = article.provider.replace(/\s+/g, '').toLowerCase();
            if (logoMapData.has(provider)) {
                article.logo = logoMapData.get(provider);
            }
            else {
                article.logo = logoMapData.get("fallback");
            }
            return article;
        });
        const decoded = shapedArticles.map((article) => {
            return (decodeItem(article));
        });
        res.status(200).json({ message: "success", data: decoded });
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