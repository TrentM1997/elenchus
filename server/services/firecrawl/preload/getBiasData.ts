import { getMediaBiases } from "../../../endpoints/supabase/users/transactions/mediaBias.js";
import type { FcParam, Bias } from "../../../types/types";
import type { BiasSchemaType } from "../../../schemas/BiasSchema.js";

interface NormalizedRatings {
    bias: BiasSchemaType,
    factual_reporting: string | null,
    country: string | null
};

interface LookupsType {
    source: string,
    normalized: NormalizedRatings
};

async function getBiasData(articles: FcParam[]) {
    const biasRatings = new Map<string, { bias: BiasSchemaType; factual_reporting: string | null; country: string | null }>();
    const uniqueSources = Array.from(new Set(articles.map(a => a.source)));

    const lookups = uniqueSources.map(async (source): Promise<LookupsType> => {
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
    for (const { source, normalized } of results) biasRatings.set(source, normalized);

    return biasRatings;
};

export { getBiasData };