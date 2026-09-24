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
import { apiContractConfig, type ApiContract } from "@elenchus/contracts";
import { RequestUrlBuilder } from "./http/requestUrlBuilder";

export interface IServerClient {
  readonly privileged: IPrivateServerClient;
  readonly general: IPublicServerClient;
}

export class ServerClient implements IServerClient {
  public readonly privileged: IPrivateServerClient;
  public readonly general: IPublicServerClient;
  constructor(
    private readonly routes: ApiContract,
    private readonly http: IHttpClient,
  ) {
    this.privileged = new PrivateServerClient(this.routes.private, this.http);
    this.general = new PublicServerClient(this.routes.public, this.http);
  }
}

export const serverClient = new ServerClient(
  apiContractConfig,
  new HttpClient(
    new RequestParser(),
    new ConfigRequestHandler(),
    new RequestUrlBuilder(),
  ),
);
