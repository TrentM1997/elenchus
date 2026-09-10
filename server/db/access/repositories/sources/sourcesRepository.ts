import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces";
import type { BiasSchemaType } from "../../../../schemas/BiasSchema";
import type { FcParam } from "../../../../types/types";

interface NormalizedRatings {
  bias: BiasSchemaType;
  factual_reporting: string | null;
  country: string | null;
}

interface LookupsType {
  source: string;
  normalized: NormalizedRatings;
}

export class SourcesRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  public async getBiases(articles: FcParam[]) {
    return await this.executeGetBiases(articles);
  }

  private async executeGetBiases(articles: FcParam[]) {
    const biasRatings = new Map<
      string,
      {
        bias: BiasSchemaType;
        factual_reporting: string | null;
        country: string | null;
      }
    >();
    const uniqueSources = Array.from(new Set(articles.map((a) => a.source)));

    const lookups = uniqueSources.map(async (source): Promise<LookupsType> => {
      const rating = await this.getSourceBiases(source);

      return {
        source,
        normalized: {
          bias: (rating?.bias as BiasSchemaType) ?? null,
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

  private async getSourceBiases(provider: string) {
    try {
      const { data, error } = await this.db
        .from("sources")
        .select("country,bias,factual_reporting,name")
        .ilike("name", `%${provider}%`)
        .limit(1);

      if (error) {
        console.error(
          "[getMediaBiases] DB error for provider:",
          provider,
          error.message,
        );
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const { country, bias, factual_reporting, name } = data[0];

      return { country, bias, factual_reporting, name };
    } catch (err) {
      console.error(
        "[getMediaBiases] Unexpected throw for provider:",
        provider,
        err,
      );
      return null;
    }
  }
}
