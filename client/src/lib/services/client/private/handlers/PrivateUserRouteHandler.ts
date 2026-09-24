import { IHttpClient } from "@/lib/services/client/http/types";
import {
  IPrivateUserWritesHandler,
  PrivateUserWritesHandler,
} from "./PrivateUserWriteHandler";
import {
  IPrivateUserSelectHandler,
  PrivateUserSelectHandler,
} from "./PrivateUserSelectHandler";
import { PrivateApiContract } from "@elenchus/contracts";

export interface IPrivateUserRouteHandler {
  readonly write: IPrivateUserWritesHandler;
  readonly select: IPrivateUserSelectHandler;
}

export class PrivateUserRouteHandler implements IPrivateUserRouteHandler {
  public readonly write: IPrivateUserWritesHandler;
  public readonly select: IPrivateUserSelectHandler;
  constructor(
    private readonly http: Pick<IHttpClient, "request">,
    private readonly routes: PrivateApiContract,
  ) {
    this.write = new PrivateUserWritesHandler(this.http, this.routes);
    this.select = new PrivateUserSelectHandler(this.http, this.routes);
  }
}
