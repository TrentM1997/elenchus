import { Router } from "express";
import { IAppServices } from "../../services/appServices.js";
import { wrapAsync } from "../async/wrapAsync.js";
import { ServerError } from "../errors/ServerError.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";
import { SearchQuerySchema } from "../../schemas/SearchQuerySchema.js";
import { LoginSchema } from "../../schemas/LoginSchema.js";
import { ScrapeRequestSchema } from "../../schemas/ScrapeRequestSchema.js";

export function publicRoutes(app: IAppServices, router: Router) {
  router.post(
    "/auth/login",
    wrapAsync(async (req, res) => {
      const { data, error } = await req.auth.login(req, res);

      if (error) {
        throw new ServerError("Failed to authenticate user", 401, error.cause);
      }

      res.success("Login successful", data);
    }),
  );

  router.post(
    "/createNewUser",
    wrapAsync(async (req, res) => {
      const body = validateOrThrow(LoginSchema, req.body);

      const result = await app.services.api.user.signUp(body);

      if (!result.ok || !result.data.session) {
        throw new ServerError("Failed to create new user", 400);
      }

      req.auth.establishSession(result.data.session, res);

      res.success("signup completed successfully", result);
    }),
  );

  router.get(
    "/articles/extract/:jobId",
    wrapAsync(async (req, res) => {
      const { jobId } = req.params;
      const job = app.services.api.articles.getExtractionJob(jobId);
      if (!job) {
        res.status(404).json({ status: "unknown", error: "Job not found" });
        return;
      }
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, max-age=0",
      );
      res.status(200).json(job);
    }),
  );

  router.post(
    "/articles/extract",
    wrapAsync(async (req, res) => {
      const { articles } = validateOrThrow(ScrapeRequestSchema, req.body);
      const result = app.services.api.articles.startExtraction(articles);

      res.status(202).json(result);
    }),
  );

  router.get(
    "/articles/search",
    wrapAsync(async (req, res) => {
      const query = validateOrThrow(SearchQuerySchema, req.query.q);

      const results = await app.services.api.articles.search(query);

      res.success("successful search", results);
    }),
  );

  router.get(
    "/user/saved-articles",
    wrapAsync(async (req, res) => {
      const user_id = req.user?.userId;
      const results = await app.services.api.user.savedArticles(user_id);

      if (!results) {
        throw new ServerError("Failed to retrieve users saved articles", 404);
      }

      res.success("users saved articles retrieved successfully", results, 200);
    }),
  );

  return router;
}
