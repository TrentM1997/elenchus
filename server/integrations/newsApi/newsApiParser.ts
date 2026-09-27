import { logoMap } from "../../src/logoMap.ts";
import { BrowsingOption, NewsArticle } from "../../types/types.ts";
import { validateServerOrThrow } from "../../core/validation/validateOrThrow.ts";
import {
  NewsApiResultItemSchema,
  NewsApiResultsSchemaType,
  PagesOfBrowsingOptionsSchema,
  PagesOfBrowsingOptionsSchemaType,
} from "@elenchus/contracts/schemas/integrations/NewsApiSchemas";
import {
  BrowsingOptionSchemaArray,
  BrowsingOptionSchemaArrayType,
} from "@elenchus/contracts/schemas/articles/BrowsingOptionSchema";
import { validateSchema } from "../../schemas/ValidateSchema.ts";

const logoMapData = new Map(Object.entries(logoMap));

export interface INewsApiParser {
  parseSearchResults(results: unknown[]): PagesOfBrowsingOptionsSchemaType;
}

export class NewsApiParser implements INewsApiParser {
  parseSearchResults(results: unknown[]): PagesOfBrowsingOptionsSchemaType {
    return this.execute(results);
  }

  private execute(results: unknown[]) {
    const validResults = this.validateNewsApiResults(results);
    return this.toBrowsingPages(validResults);
  }

  private toBrowsingPages(
    results: NewsApiResultsSchemaType,
  ): PagesOfBrowsingOptionsSchemaType {
    const articles = this.mapArticleDTOs(results);
    const pages = this.chunkIntoPages(articles);
    return this.validatePagesOfBrowsingOptions(pages);
  }

  private mapArticleDTOs(
    articles: NewsApiResultsSchemaType,
  ): BrowsingOptionSchemaArrayType {
    const dtos = articles.map((a) => {
      const d = new Date(a.publishedAt);
      const datePublished = d.toString().split(" ").splice(0, 4).join(" ");
      const provider = a.source.name.replace(/\s+/g, "").toLowerCase();
      const logo = this.placeLogos(provider);
      const urlToImage = a.urlToImage;

      return {
        name: a.title,
        url: a.url,
        image: urlToImage,
        description: a.description,
        keywords: null,
        provider: a.source.name,
        date_published: datePublished,
        logo: logo,
      };
    });

    return this.validateBrowsingOptions(dtos);
  }

  private placeLogos(str: string) {
    let value: string | null;
    if (logoMapData.has(str)) {
      value = logoMapData.get(str) ?? null;
    } else {
      value = logoMapData.get("fallback") ?? null;
    }
    return value;
  }

  private chunkIntoPages(results: BrowsingOption[]): BrowsingOption[][] {
    const pages: BrowsingOption[][] = [];

    for (let i = 0; i < results.length; i += 12) {
      pages.push(results.slice(i, i + 12));
    }

    return pages;
  }

  private validateNewsApiResults(results: unknown[]): NewsApiResultsSchemaType {
    const validated: NewsApiResultsSchemaType = [];

    for (const result of results) {
      const { ok, data } = validateSchema(NewsApiResultItemSchema, result);
      if (ok) {
        validated.push(data);
      }
    }
    return validated;
  }

  private validatePagesOfBrowsingOptions(
    results: unknown[],
  ): PagesOfBrowsingOptionsSchemaType {
    return validateServerOrThrow(PagesOfBrowsingOptionsSchema, results);
  }

  private validateBrowsingOptions(
    results: unknown[],
  ): BrowsingOptionSchemaArrayType {
    return validateServerOrThrow(BrowsingOptionSchemaArray, results);
  }
}
