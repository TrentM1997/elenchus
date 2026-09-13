import { ServerError } from "../../core/errors/ServerError";
import { BrowsingOption } from "../../types/types";
import { INewsApiParser, NewsApiParser } from "./articleParser";

export interface INewsAPIService {
  search(query: string): Promise<BrowsingOption[]>;
}

export class NewsAPIService implements INewsAPIService {
  private readonly parser: INewsApiParser;
  constructor(private readonly apiKey: string) {
    this.parser = new NewsApiParser();
  }

  public async search(query: string): Promise<BrowsingOption[]> {
    return await this.executeSearch(query);
  }

  private async executeSearch(query: string): Promise<BrowsingOption[]> {
    const url = this.setUrl(query);
    const request = await fetch(url.toString(), {
      headers: { "X-Api-Key": this.apiKey },
    });

    if (!request.ok) {
      throw new ServerError("Couldn't connect to NewsAPI service");
    }

    const response = await request.json();
    return this.parser.parseSearchResults(response.articles ?? []);
  }

  private setUrl(query: string): URL {
    const pageSize = "30",
      page = "1";

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", query);
    url.searchParams.set("language", "en");
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("pageSize", pageSize);
    url.searchParams.set("page", page);
    return url;
  }
}
