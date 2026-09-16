import type { ServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "./httpClient";

export interface IPrivateServerClient {}

export class PrivateServerClient implements IPrivateServerClient {
  constructor(
    private readonly routes: Pick<ServerClientRoutes, "private">["private"],
    private readonly http: IHttpClient,
  ) {}
}
