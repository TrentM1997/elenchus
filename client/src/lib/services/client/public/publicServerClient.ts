import type {
  PublicServerClientRoutes,
  ServerClientRoutes,
} from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../httpClient";
import { AuthRouteHandler, IAuthRouteHandler } from "./handlers/AuthHandler";
import {
  IUserRouteHandler,
  UserRouteHandler,
} from "./handlers/UserRouteHandler";

export interface IPublicServerClient {
  readonly auth: IAuthRouteHandler;
  readonly user: IUserRouteHandler;
}

export class PublicServerClient implements IPublicServerClient {
  public readonly auth: IAuthRouteHandler;
  public readonly user: IUserRouteHandler;
  constructor(
    private readonly routes: PublicServerClientRoutes,
    private readonly http: IHttpClient,
  ) {
    this.auth = new AuthRouteHandler(this.routes, this.http);
    this.user = new UserRouteHandler(this.routes, this.http);
  }
}
