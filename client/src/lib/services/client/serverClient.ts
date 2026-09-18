import {
  serverClientRoutes,
  type ServerClientRoutes,
} from "@/infra/transport/types/routeDefinitions";
import {
  IPrivateServerClient,
  PrivateServerClient,
} from "./private/privateServerClient";
import {
  IPublicServerClient,
  PublicServerClient,
} from "./public/publicServerClient";
import { HttpClient } from "@/lib/services/client/http/httpClient";
import { RequestParser } from "./http/RequestParser";
import { ConfigRequestHandler } from "./http/ConfigRequestHandler";
import { IHttpClient } from "./http/types";

export interface IServerClient {
  readonly privileged: IPrivateServerClient;
  readonly general: IPublicServerClient;
}

export class ServerClient implements IServerClient {
  public readonly privileged: IPrivateServerClient;
  public readonly general: IPublicServerClient;
  constructor(
    private readonly routes: ServerClientRoutes,
    private readonly http: IHttpClient,
  ) {
    this.privileged = new PrivateServerClient(this.routes.private, this.http);
    this.general = new PublicServerClient(this.routes.public, this.http);
  }
}

export const serverClient = new ServerClient(
  serverClientRoutes,
  new HttpClient(new RequestParser(), new ConfigRequestHandler()),
);
