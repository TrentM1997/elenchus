import {
  SearchResultsResponseSchemaType,
} from "@elenchus/contracts/schemas/articles/BrowsingOptionSchema";
import {
  BlueSkyPostSchemaArrayType,
  SplitBlueSkyFeedSchemaType,
} from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";
import type { PublicApiContract } from "@elenchus/contracts";
import { IHttpClient } from "../../http/types";
import {
  WikiResponse,
} from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";

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

    return await this.http.request(
      route,
      route.path,
      {},
    );
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
    const encodedQuery = encodeURIComponent(query);
    const route = this.routes.integrations.blueSky.search;

    return await this.http.request(
      route,
      `${route.path}?q=${encodedQuery}`,
      {},
    );
  }

  public async articles(
    params: NewsApiSearchParams,
  ): Promise<SearchResultsResponseSchemaType> {
    const { query, signal } = params;
    const encodedQuery = encodeURIComponent(query);

    const route = this.routes.integrations.newsApi;

    return await this.http.request(
      route,
      `${route.path}?q=${encodedQuery}`,
      { signal },
    );
  }

  public async wikipediaExtract(query: string): Promise<WikiResponse> {
    const encodedQuery = encodeURIComponent(query);

    const route = this.routes.integrations.wiki;

    return await this.http.request(
      route,
      `${route.path}?q=${encodedQuery}`,
      {},
    );
  }
}
