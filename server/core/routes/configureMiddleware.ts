import { Router } from "express";
import { IAppServices } from "../../services/appServices.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { publicRoutes } from "./publicRoutes.js";
import { protectedRoutes } from "./privateRoutes.js";
import { authenticate } from "../middleware/authenticate.js";

type UseMiddleWareParams = {
  publicRouter: Router;
  protectedRouter: Router;
  app: IAppServices;
};

export function configureMiddleware({
  protectedRouter,
  publicRouter,
  app,
}: UseMiddleWareParams) {
  publicRoutes(app, publicRouter);
  protectedRouter.use(authenticate);
  protectedRouter.use(requireAuth);
  protectedRoutes(app, protectedRouter);
}
