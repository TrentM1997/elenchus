import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { DbResult } from "../../../types/types.ts";
import { validateSchema } from "../../../../schemas/ValidateSchema.ts";
import {
  SourceRatingSchema,
  SourceRatingSchemaType,
} from "@elenchus/contracts/schemas/articles/SourceRatingSchemas";
import type { ArticleToExtractSchemaType } from "@elenchus/contracts/schemas/articles/FirecrawlExtractionSchemas";

interface LookupsType {
  source: string;
  normalized: SourceRatingSchemaType;
}

export type SourceFactCheckRatingsMap = Map<string, LookupsType["normalized"]>;

export interface ISourcesRepository {
  getBiases(
    articles: ArticleToExtractSchemaType[],
  ): Promise<SourceFactCheckRatingsMap>;
}

export class SourcesRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  public async getBiases(articles: ArticleToExtractSchemaType[]) {
    return await this.executeGetBiases(articles);
  }

  private async executeGetBiases(articles: ArticleToExtractSchemaType[]) {
    const uniqueSources = Array.from(new Set(articles.map((a) => a.source)));
    const lookups = this.getRatingsForSources(uniqueSources);
    return await this.toBiasRatingsDto(lookups);
  }

  private async toBiasRatingsDto(lookups: Promise<LookupsType>[]) {
    const biasRatings = new Map<string, LookupsType["normalized"]>();

    const results = await Promise.all(lookups);
    for (const { source, normalized } of results)
      biasRatings.set(source, normalized);

    return biasRatings;
  }

  private getRatingsForSources(sources: string[]) {
    return sources.map(async (source) => {
      const result = await this.selectSourceRatings(source);

      if (!result.ok) {
        return {
          source: source,
          normalized: {
            bias: "Unknown",
            factual_reporting: null,
            country: null,
          } satisfies SourceRatingSchemaType,
        };
      }

      const rating = result.data;

      return {
        source,
        normalized: rating,
      };
    });
  }

  private async selectSourceRatings(
    provider: string,
  ): Promise<DbResult<SourceRatingSchemaType>> {
    const { data, error } = await this.db
      .from("sources")
      .select("country,bias,factual_reporting")
      .ilike("name", `%${provider}%`)
      .limit(1)
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return this.validateSourceRatings(data);
  }

  private validateSourceRatings(
    results: unknown,
  ): DbResult<SourceRatingSchemaType> {
    const result = validateSchema(SourceRatingSchema, results);

    if (!result.ok) {
      return {
        ok: false,
        message: "Invalid source ratings",
        details: result.errors
          .map((error) => `${error.path}: ${error.message}`)
          .join("; "),
      };
    }

    return { ok: true, data: result.data };
  }
}
