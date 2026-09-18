import { PrivateServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "@/lib/services/client/http/types";
import {
  IPrivateUserWritesHandler,
  PrivateUserWritesHandler,
} from "./PrivateUserWriteHandler";
import {
  IPrivateUserSelectHandler,
  PrivateUserSelectHandler,
} from "./PrivateUserSelectHandler";

export interface IPrivateUserRouteHandler {
  readonly write: IPrivateUserWritesHandler;
  readonly select: IPrivateUserSelectHandler;
}

export class PrivateUserRouteHandler implements IPrivateUserRouteHandler {
  public readonly write: IPrivateUserWritesHandler;
  public readonly select: IPrivateUserSelectHandler;
  constructor(
    private readonly http: IHttpClient,
    private readonly routes: Pick<
      PrivateServerClientRoutes,
      "bookmarks" | "investigations"
    >,
  ) {
    this.write = new PrivateUserWritesHandler(this.http, this.routes);
    this.select = new PrivateUserSelectHandler(this.http, this.routes);
  }
}
