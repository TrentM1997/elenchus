import { Router } from "express";
import { IAppServices } from "../../services/appServices.js";
import { wrapAsync } from "../async/wrapAsync.js";

export function protectedRoutes(app: IAppServices, router: Router) {
  router.get(
    "/user/saved-articles",
    wrapAsync(async (req, res) => {
      const results = await app.services.api.user.savedArticles(
        req.user?.userId,
      );

      res.success("users saved articles retrieved successfully", results, 200);
    }),
  );

  router.post(
    "/articles/save",
    wrapAsync(async (req, res) => {
      const result = await app.services.api.articles.save(
        req.body,
        req.user?.userId,
      );

      res.success("article saved successfully", result);
    }),
  );

  return router;
}
