import { logoMap } from "../../src/logoMap";
import { validateSearchResult } from "../../schemas/SearchResultsSchema";
import { BrowsingOption, NewsArticle } from "../../types/types";

const logoMapData = new Map(Object.entries(logoMap));

export interface INewsApiParser {
  parseSearchResults(results: unknown[]): BrowsingOption[][];
}

export class NewsApiParser implements INewsApiParser {
  parseSearchResults(results: unknown[]): BrowsingOption[][] {
    return this.executeParseResults(results);
  }

  private executeParseResults(results: unknown[]): BrowsingOption[][] {
    const validArticles = results.filter(
      (a: any): a is NewsArticle => validateSearchResult(a).isValid,
    );

    const articles = this.mapArticleDTOs(validArticles);
    return this.chunkIntoPages(articles);
  }

  private mapArticleDTOs(articles: NewsArticle[]): BrowsingOption[] {
    return articles.map((a: NewsArticle): BrowsingOption => {
      const d = new Date(a.publishedAt);
      const datePublished = d.toString().split(" ").splice(0, 4).join(" ");
      const provider = a.source.name.replace(/\s+/g, "").toLowerCase();
      const logo = this.placeLogos(provider);
      const urlToImage = a.urlToImage;

      return {
        name: a.title ?? "",
        url: a.url ?? "",
        image: urlToImage ?? null,
        description: a.description ?? "",
        keywords: null,
        provider: a.source.name,
        date_published: datePublished ?? null,
        logo: logo,
      };
    });
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
}
