import type { ServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../httpClient";
import {
  AccountRouteHandler,
  IAccountRouteHandler,
} from "./handlers/AccountRouteHandler";

export interface IPrivateServerClient {
  readonly account: IAccountRouteHandler;
}

export class PrivateServerClient implements IPrivateServerClient {
  public readonly account: IAccountRouteHandler;
  constructor(
    private readonly routes: Pick<ServerClientRoutes, "private">["private"],
    private readonly http: IHttpClient,
  ) {
    this.account = new AccountRouteHandler(this.routes, this.http);
  }
}
