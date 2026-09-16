import type { ServerClientRoutes } from "@/infra/transport/types/routeDefinitions";

export interface IPublicServerClient {}

export class PublicServerClient implements IPublicServerClient {
  constructor(
    private readonly routes: Pick<ServerClientRoutes, "public">["public"],
  ) {}
}
