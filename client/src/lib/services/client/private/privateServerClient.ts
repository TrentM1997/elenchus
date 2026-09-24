import { IHttpClient } from "@/lib/services/client/http/types";
import {
  AccountRouteHandler,
  IAccountRouteHandler,
} from "./handlers/AccountRouteHandler";
import {
  IPrivateUserRouteHandler,
  PrivateUserRouteHandler,
} from "./handlers/PrivateUserRouteHandler";
import { PrivateApiContract } from "@elenchus/contracts";

export interface IPrivateServerClient {
  readonly account: IAccountRouteHandler;
  readonly user: IPrivateUserRouteHandler;
}

export class PrivateServerClient implements IPrivateServerClient {
  public readonly account: IAccountRouteHandler;
  public readonly user: IPrivateUserRouteHandler;
  constructor(
    private readonly routes: PrivateApiContract,
    private readonly http: IHttpClient,
  ) {
    this.account = new AccountRouteHandler(this.routes, this.http);
    this.user = new PrivateUserRouteHandler(this.http, this.routes);
  }
}
