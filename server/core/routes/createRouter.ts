import { Router } from "express";
import { IAppServices } from "../../services/appServices.js";
import { configureMiddleware } from "./config/configureMiddleware.js";
import { configSessionHandler } from "../middleware/configSessionHandler.js";
import { RouteRegistrar } from "./config/routeRegistrar.ts";
import { ApiContract } from "@elenchus/contracts";

export function createRouter({
  app,
  contract,
}: {
  app: IAppServices;
  contract: ApiContract;
}) {
  const registrar = new RouteRegistrar();
  const router = Router();
  const publicRouter = Router();
  const protectedRouter = Router();

  configureMiddleware({
    registrar,
    publicRouter,
    protectedRouter,
    app,
    contract,
  });

  router.use(configSessionHandler);
  router.use(publicRouter);
  router.use(protectedRouter);

  return router;
}
