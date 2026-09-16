import type { ServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  IPrivateServerClient,
  PrivateServerClient,
} from "./privateServerClient";
import { IPublicServerClient, PublicServerClient } from "./publicServerClient";

// TODO: finish first pass on encapsulating HTTP requests into this ServerClient facade module

export interface IServerClient {
  readonly privileged: IPrivateServerClient;
  readonly general: IPublicServerClient;
}

export class ServerClient implements IServerClient {
  public readonly privileged: IPrivateServerClient;
  public readonly general: IPublicServerClient;
  private readonly request: HttpClient;
  constructor(private readonly routes: ServerClientRoutes) {
    this.request = new HttpClient();
    this.privileged = new PrivateServerClient(this.routes.private);
    this.general = new PublicServerClient(this.routes.public);
  }
}
