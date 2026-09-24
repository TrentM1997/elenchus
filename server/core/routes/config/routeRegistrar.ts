import type { Router, RequestHandler } from "express";
import type { RouteConfigDefinition } from "@elenchus/contracts";

export class RouteRegistrar {
  public register(
    router: Router,
    route: RouteConfigDefinition,
    handler: RequestHandler,
  ): void {
    switch (route.method) {
      case "GET":
        router.get(route.path, handler);
        break;

      case "POST":
        router.post(route.path, handler);
        break;

      case "DELETE":
        router.delete(route.path, handler);
        break;

      default:
        throw new Error(`Unsupported route method: ${route.method}`);
    }
  }
}
