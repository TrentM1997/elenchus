import {
  BrowsingOptionSchemaArrayType,
  BrowsingOptionSchemaArray,
} from "@/lib/schemas/BrowsingOptionSchema";
import {
  BlueSkyPostSchemaArray,
  BlueSkyPostSchemaArrayType,
  SplitBlueSkyFeedSchema,
  SplitBlueSkyFeedSchemaType,
} from "@/lib/schemas/BlueSkySchemas";
import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../../http/types";

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
  articles(params: NewsApiSearchParams): Promise<BrowsingOptionSchemaArrayType>;
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
  ): Promise<BrowsingOptionSchemaArrayType> {
    const { query, signal } = params;

    return await this.http.get(
      `${this.routes.integrations.newsApi}${query}`,
      BrowsingOptionSchemaArray,
      signal,
    );
  }
}
