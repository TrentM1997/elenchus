import {
  BrowsingOptionSchemaArrayType,
  BrowsingOptionSchemaArray,
} from "@/lib/schemas/BrowsingOptionSchema";
import {
  BlueSkyPostSchemaArray,
  BlueSkyPostSchemaArrayType,
} from "@/lib/schemas/BlueSkySchemas";
import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../../httpClient";

export interface IThirdPartyRouteHandler {
  readonly search: IThirdPartyRouteSearchHandler;
  blueSkyFeed(): Promise<BlueSkyPostSchemaArrayType>;
}

export class ThirdPartyRouteHandler implements IThirdPartyRouteHandler {
  public readonly search: IThirdPartyRouteSearchHandler;
  constructor(
    private readonly routes: Pick<PublicServerClientRoutes, "integrations">,
    private readonly http: IHttpClient,
  ) {
    this.search = new ThirdPartyRouteSearchHandler(this.routes, this.http);
  }

  public async blueSkyFeed(): Promise<BlueSkyPostSchemaArrayType> {
    return await this.http.get(
      this.routes.integrations.blueSky.feed,
      BlueSkyPostSchemaArray,
    );
  }
}

export interface IThirdPartyRouteSearchHandler {
  blueSky(query: string): Promise<BlueSkyPostSchemaArrayType>;
  articles(query: string): Promise<BrowsingOptionSchemaArrayType>;
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

  public async articles(query: string): Promise<BrowsingOptionSchemaArrayType> {
    return await this.http.get(
      `${this.routes.integrations.newsApi}${query}`,
      BrowsingOptionSchemaArray,
    );
  }
}
