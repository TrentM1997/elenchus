import {
  BrowsingOptionSchemaArrayType,
  BrowsingOptionSchemaArray,
  SearchResultsResponseSchemaType,
  SearchResultsResponseSchema,
} from "@/lib/schemas/articles/BrowsingOptionSchema";
import {
  BlueSkyPostSchemaArray,
  BlueSkyPostSchemaArrayType,
  SplitBlueSkyFeedSchema,
  SplitBlueSkyFeedSchemaType,
} from "@/lib/schemas/integrations/BlueSkySchemas";
import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../../http/types";
import {
  WikiResponse,
  WikiResponseSchema,
} from "@/lib/schemas/integrations/WikipediaExtractSchemas";

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
    private readonly routes: Pick<PublicServerClientRoutes, "integrations">,
    private readonly http: IHttpClient,
  ) {
    this.search = new ThirdPartyRouteSearchHandler(this.routes, this.http);
  }

  public async blueSkyFeed(): Promise<SplitBlueSkyFeedSchemaType> {
    return await this.http.get(
      this.routes.integrations.blueSky.feed,
      SplitBlueSkyFeedSchema,
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
    private readonly routes: Pick<PublicServerClientRoutes, "integrations">,
    private readonly http: IHttpClient,
  ) {}

  public async blueSky(query: string): Promise<BlueSkyPostSchemaArrayType> {
    return await this.http.get(
      `${this.routes.integrations.blueSky.search}${query}`,
      BlueSkyPostSchemaArray,
    );
  }

  public async articles(
    params: NewsApiSearchParams,
  ): Promise<SearchResultsResponseSchemaType> {
    const { query, signal } = params;

    return await this.http.get(
      `${this.routes.integrations.newsApi}${query}`,
      SearchResultsResponseSchema,
      signal,
    );
  }

  public async wikipediaExtract(query: string): Promise<WikiResponse> {
    const encodedQuery = encodeURIComponent(query);

    return await this.http.get(
      `${this.routes.integrations.wiki}${encodedQuery}`,
      WikiResponseSchema,
    );
  }
}
