import { Router } from "express";
import { IAppServices } from "../../services/appServices.js";
import { configureMiddleware } from "./configureMiddleware.js";
import { configSessionHandler } from "../middleware/configSessionHandler.js";

export function createRouter(app: IAppServices) {
  const router = Router();
  const publicRouter = Router();
  const protectedRouter = Router();

  configureMiddleware({ publicRouter, protectedRouter, app });

  router.use(configSessionHandler);
  router.use(publicRouter);
  router.use(protectedRouter);

  return router;
}
