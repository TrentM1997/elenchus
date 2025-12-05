import { getMediaBiases } from "../../../endpoints/supabase/users/transactions/mediaBias.js";
;
;
async function getBiasData(articles) {
    const biasRatings = new Map();
    const uniqueSources = Array.from(new Set(articles.map(a => a.source)));
    const lookups = uniqueSources.map(async (source) => {
        const rating = await getMediaBiases(source);
        return {
            source,
            normalized: {
                bias: rating?.bias ?? null,
                factual_reporting: rating?.factual_reporting ?? null,
                country: rating?.country ?? null,
            },
        };
    });
    const results = await Promise.all(lookups);
    for (const { source, normalized } of results)
        biasRatings.set(source, normalized);
    return biasRatings;
}
;
export { getBiasData };
//# sourceMappingURL=getBiasData.js.map