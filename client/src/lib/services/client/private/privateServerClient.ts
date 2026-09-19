import type { ServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "@/lib/services/client/http/types";
import {
  AccountRouteHandler,
  IAccountRouteHandler,
} from "./handlers/AccountRouteHandler";
import {
  IPrivateUserRouteHandler,
  PrivateUserRouteHandler,
} from "./handlers/PrivateUserRouteHandler";

export interface IPrivateServerClient {
  readonly account: IAccountRouteHandler;
  readonly user: IPrivateUserRouteHandler;
}

export class PrivateServerClient implements IPrivateServerClient {
  public readonly account: IAccountRouteHandler;
  public readonly user: IPrivateUserRouteHandler;
  constructor(
    private readonly routes: Pick<ServerClientRoutes, "private">["private"],
    private readonly http: IHttpClient,
  ) {
    this.account = new AccountRouteHandler(this.routes, this.http);
    this.user = new PrivateUserRouteHandler(this.http, this.routes);
  }
}
