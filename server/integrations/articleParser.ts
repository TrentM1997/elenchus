import { validateSearchResult } from "../schemas/SearchResultsSchema";
import { BrowsingOption, NewsArticle } from "../types/types";
import decodeItem from "../helpers/decodeItem";
import { logoMap } from "../endpoints/logos/logoMap";
const logoMapData = new Map(Object.entries(logoMap));

export interface IArticleParser {
  parseSearchResults(results: unknown[]): BrowsingOption[];
}

export class ArticleParser implements IArticleParser {
  parseSearchResults(results: unknown[]): BrowsingOption[] {
    return this.executeParseResults(results);
  }

  private executeParseResults(results: unknown[]): BrowsingOption[] {
    const decoded = this.decodeRawResults(results);

    const validArticles = decoded.filter(
      (a: any): a is NewsArticle => validateSearchResult(a).isValid,
    );

    return this.mapArticleDTOs(validArticles);
  }

  private decodeRawResults(results: unknown[]) {
    const decoded = results.map((a) => {
      return decodeItem(a);
    });
    return decoded;
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
}
