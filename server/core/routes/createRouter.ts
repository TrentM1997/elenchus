import { Router } from "express";
import { IAppServices } from "../../services/appServices.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { publicRoutes } from "./publicRoutes.js";
import { protectedRoutes } from "./privateRoutes.js";

export function createRouter(app: IAppServices) {
  const router = Router();
  const publicRouter = Router();
  const protectedRouter = Router();

  publicRoutes(app, publicRouter);

  protectedRouter.use(requireAuth);
  protectedRoutes(app, protectedRouter);

  router.use(publicRouter);
  router.use(protectedRouter);

  return router;
}
