import type { ServerClientRoutes } from "@/infra/transport/types/routeDefinitions";

export interface IPrivateServerClient {}

export class PrivateServerClient implements IPrivateServerClient {
  constructor(
    private readonly routes: Pick<ServerClientRoutes, "private">["private"],
  ) {}
}
