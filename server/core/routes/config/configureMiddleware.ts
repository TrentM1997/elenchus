import { Router } from "express";
import { IAppServices } from "../../../services/appServices.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { authenticate } from "../../middleware/authenticate.js";
import { IRouteRegistrar } from "../registrar/routeRegistrar.ts";
import { createPublicRoutes } from "./publicRoutes.ts";
import { createPrivateRoutes } from "./privateRoutes.ts";
import { ApiContract } from "@elenchus/contracts";

type UseMiddleWareParams = {
  registrar: IRouteRegistrar;
  publicRouter: Router;
  protectedRouter: Router;
  app: IAppServices;
  contract: ApiContract;
};

export function configureMiddleware({
  protectedRouter,
  publicRouter,
  app,
  registrar,
  contract,
}: UseMiddleWareParams) {
  createPublicRoutes({
    registrar,
    app,
    router: publicRouter,
    contract: contract.public,
  });

  protectedRouter.use(authenticate);
  protectedRouter.use(requireAuth);

  createPrivateRoutes({
    app,
    registrar,
    router: protectedRouter,
    contract: contract.private,
  });
}
