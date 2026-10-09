import type { Router, Request, Response, NextFunction } from "express";
import type { RouteConfigDefinition } from "@elenchus/contracts";
import { wrapAsync } from "../../async/wrapAsync.ts";

export type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export interface IRouteRegistrar {
  register(
    router: Router,
    route: RouteConfigDefinition,
    handler: AsyncRouteHandler,
  ): void;
}

export class RouteRegistrar implements IRouteRegistrar {
  public register(
    router: Router,
    route: RouteConfigDefinition,
    handler: AsyncRouteHandler,
  ): void {
    switch (route.method) {
      case "GET":
        router.get(route.path, wrapAsync(handler));
        break;

      case "POST":
        router.post(route.path, wrapAsync(handler));
        break;

      case "DELETE":
        router.delete(route.path, wrapAsync(handler));
        break;

      case "OPTIONS":
        router.options(route.path, wrapAsync(handler));
        break;

      case "PUT":
        router.put(route.path, wrapAsync(handler));
        break;

      case "PATCH":
        router.patch(route.path, wrapAsync(handler));
        break;

      case "HEAD":
        router.head(route.path, wrapAsync(handler));
        break;

      default:
        throw new Error(`Unsupported route method: ${route.method}`);
    }
  }
}
