import type { ServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../httpClient";
import { AuthRouteHandler, IAuthRouteHandler } from "./handlers/AuthHandler";

export interface IPublicServerClient {
  readonly auth: IAuthRouteHandler;
}

export class PublicServerClient implements IPublicServerClient {
  public readonly auth: IAuthRouteHandler;
  constructor(
    private readonly routes: Pick<ServerClientRoutes, "public">["public"],
    private readonly http: IHttpClient,
  ) {
    this.auth = new AuthRouteHandler(this.routes, this.http);
  }
}
