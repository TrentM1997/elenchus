import { logoMap } from "../../endpoints/logos/logoMap.js";
import decodeItem from '../decodeItem.js';
import { validateSearchResult } from "../../schemas/SearchResultsSchema.js";
const logoMapData = new Map(Object.entries(logoMap));
const decodeResults = (arr) => {
    const decoded = arr.map((a) => {
        return decodeItem(a);
    });
    return decoded;
};
const logo_or_fallback = (str) => {
    let value;
    if (logoMapData.has(str)) {
        value = logoMapData.get(str) ?? null;
    }
    else {
        value = logoMapData.get("fallback") ?? null;
    }
    ;
    return value;
};
const shapeBrowsingOptions = (results) => {
    const validResults = results.filter((a) => validateSearchResult(a).isValid);
    try {
        const mapped = validResults?.map((a) => {
            const d = new Date(a.publishedAt);
            const datePublished = d.toString().split(' ').splice(0, 4).join(' ');
            const provider = a.source.name.replace(/\s+/g, '').toLowerCase();
            const logo = logo_or_fallback(provider);
            const urlToImage = a.urlToImage;
            return {
                name: a.title ?? '',
                url: a.url ?? '',
                image: urlToImage ?? null,
                description: a.description ?? '',
                keywords: null,
                provider: a.source.name,
                date_published: datePublished ?? null,
                logo: logo
            };
        });
        const decoded = decodeResults(mapped);
        return decoded;
    }
    catch (err) {
        console.error(err);
        return [];
    }
    ;
};
export { shapeBrowsingOptions, decodeResults };
//# sourceMappingURL=shapeArticleOption.js.map