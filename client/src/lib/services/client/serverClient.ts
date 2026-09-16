import type { ServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  IPrivateServerClient,
  PrivateServerClient,
} from "./private/privateServerClient";
import {
  IPublicServerClient,
  PublicServerClient,
} from "./public/publicServerClient";
import { HttpClient } from "./httpClient";
import { serverClientRoutes } from "@/infra/transport/types/routeDefinitions";

export interface IServerClient {
  readonly privileged: IPrivateServerClient;
  readonly general: IPublicServerClient;
}

export class ServerClient implements IServerClient {
  private readonly routes: ServerClientRoutes;
  public readonly privileged: IPrivateServerClient;
  public readonly general: IPublicServerClient;
  constructor() {
    this.routes = serverClientRoutes;
    this.privileged = new PrivateServerClient(
      this.routes.private,
      new HttpClient(),
    );
    this.general = new PublicServerClient(this.routes.public, new HttpClient());
  }
}
