import { SearchResultsResponseSchemaType } from "@elenchus/contracts/schemas/articles/BrowsingOptionSchema";
import {
  BlueSkyPostSchemaArrayType,
  SplitBlueSkyFeedSchemaType,
} from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";
import type { PublicApiContract } from "@elenchus/contracts";
import { IHttpClient } from "../../http/types";
import { WikiResponse } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";

export type NewsApiSearchParams = {
  query: string;
  signal?: AbortSignal;
};

export interface IThirdPartyRouteHandler {
  readonly search: IThirdPartyRouteSearchHandler;
  blueSkyFeed(): Promise<SplitBlueSkyFeedSchemaType>;
}

export class ThirdPartyRouteHandler implements IThirdPartyRouteHandler {
  public readonly search: IThirdPartyRouteSearchHandler;
  constructor(
    private readonly routes: Pick<PublicApiContract, "integrations">,
    private readonly http: Pick<IHttpClient, "request">,
  ) {
    this.search = new ThirdPartyRouteSearchHandler(this.routes, this.http);
  }

  public async blueSkyFeed(): Promise<SplitBlueSkyFeedSchemaType> {
    const route = this.routes.integrations.blueSky.feed;

    return await this.http.request(route, {});
  }
}

export interface IThirdPartyRouteSearchHandler {
  blueSky(query: string): Promise<BlueSkyPostSchemaArrayType>;
  articles(
    params: NewsApiSearchParams,
  ): Promise<SearchResultsResponseSchemaType>;
  wikipediaExtract(query: string): Promise<WikiResponse>;
}

class ThirdPartyRouteSearchHandler implements IThirdPartyRouteSearchHandler {
  constructor(
    private readonly routes: Pick<PublicApiContract, "integrations">,
    private readonly http: Pick<IHttpClient, "request">,
  ) {}

  public async blueSky(query: string): Promise<BlueSkyPostSchemaArrayType> {
    const route = this.routes.integrations.blueSky.search;

    return await this.http.request(route, { query: { q: query } });
  }

  public async articles(
    params: NewsApiSearchParams,
  ): Promise<SearchResultsResponseSchemaType> {
    const { query, signal } = params;

    const route = this.routes.integrations.newsApi;

    return await this.http.request(route, {
      query: { q: query },
      signal,
    });
  }

  public async wikipediaExtract(query: string): Promise<WikiResponse> {
    const route = this.routes.integrations.wiki;

    return await this.http.request(route, {
      query: { q: query },
    });
  }
}
