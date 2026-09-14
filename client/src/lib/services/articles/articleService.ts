import { SearchEndpoint } from "@/infra/transport/types/types";
import { validateSchema } from "../../../../schemas/api/validation/validateSchema";

export interface BrowsingOption {
  date_published: string;
  description: string;
  image: string | null;
  keywords: string[] | null;
  name: string;
  provider: string;
  url: string;
  logo: string | null;
}

export type NewsSearchResults =
  | { ok: true; data: ArticleType[] }
  | { ok: false; details: string };

export interface IClientArticleService {
  searchNewsApi(params: NewsApiSearchParams): Promise<NewsSearchResults>;
}

export type NewsApiSearchParams = {
  query: string;
  endpoint: SearchEndpoint;
  signal: AbortSignal;
};

export class ClientArticleService implements IClientArticleService {
  public async searchNewsApi(
    params: NewsApiSearchParams,
  ): Promise<NewsSearchResults> {
    return await this.executeSearch(params);
  }

  private async executeSearch({
    query,
    endpoint,
    signal,
  }: NewsApiSearchParams): Promise<NewsSearchResults> {
    try {
      const request = await fetch(this.getUrl({ query, endpoint }), {
        ...this.getSearchOptions(),
        signal,
      });

      if (!request.ok) {
        throw new Error("Search query failed");
      }

      const result = await request.json();

      return {
        ok: true,
        data: result.data,
      };
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        details: `${err}`,
      };
    }
  }

  private getUrl({
    query,
    endpoint,
  }: Pick<NewsApiSearchParams, "query" | "endpoint">): string {
    const encodedQuery = encodeURIComponent(query);
    return `${endpoint}?q=${encodedQuery}`;
  }

  private getSearchOptions() {
    return {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  }
}
