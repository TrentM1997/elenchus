import { Router } from "express";
import { IAppServices } from "../../../services/appServices";
import { requireAuth } from "../../middleware/requireAuth";
import { publicRoutes } from "./publicRoutes";
import { protectedRoutes } from "./privateRoutes";
import { authenticate } from "../../middleware/authenticate";

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
