import { Router } from "express";
import { IAppServices } from "../../../services/appServices.js";
import { wrapAsync } from "../../async/wrapAsync.js";
import { ServerError } from "../../errors/ServerError.js";
import { validateOrThrow } from "../../validation/validateOrThrow.js";
import { ClientError } from "../../errors/ClientError.js";
import { PUBLIC_API_CONFIG } from "@elenchus/contracts";

export function publicRoutes(app: IAppServices, router: Router) {
  router.post(
    PUBLIC_API_CONFIG.user.feedback.path,
    wrapAsync(async (req, res) => {
      const { feedback } = validateOrThrow(
        PUBLIC_API_CONFIG.user.feedback.bodySchema,
        req.body,
      );

      const result = await app.services.api.user.submitFeedback(feedback);

      if (!result.ok) {
        throw new ServerError("Failed to submit feedback", 500, result.details);
      }

      res.success("Feedback submitted successfully", result, 200);
    }),
  );

  router.post(
    PUBLIC_API_CONFIG.user.passwordReset.path,
    wrapAsync(async (req, res) => {
      const { email } = validateOrThrow(
        PUBLIC_API_CONFIG.user.passwordReset.bodySchema,
        req.body,
      );
      const result = await app.services.api.user.requestPasswordReset(email);

      if (!result.ok) {
        throw new ServerError(
          "Failed to send password reset email",
          400,
          result.message,
        );
      }

      res.success("Reset email sent.", result, 200);
    }),
  );

  router.post(
    PUBLIC_API_CONFIG.auth.recover.path,
    wrapAsync(async (req, res) => {
      const result = await req.auth.recoverSession(req, res);

      res.success("Session checked", result, 200);
    }),
  );

  router.post(
    PUBLIC_API_CONFIG.auth.login.path,
    wrapAsync(async (req, res) => {
      validateOrThrow(
        PUBLIC_API_CONFIG.auth.login.bodySchema,
        req.body,
      );
      const { data, error } = await req.auth.login(req, res);

      if (error) {
        throw new ServerError("Failed to authenticate user", 401, error.cause);
      }

      res.success("Login successful", { ok: true, data }, 200);
    }),
  );

  router.post(
    PUBLIC_API_CONFIG.auth.logOut.path,
    wrapAsync(async (req, res) => {
      const result = await req.auth.logOut(req, res);

      if (!result.ok) {
        throw new ServerError("Failed to sign out user", 500, result.message);
      }

      res.success("signed out successfully", result, 200);
    }),
  );

  router.post(
    PUBLIC_API_CONFIG.auth.signUp.path,
    wrapAsync(async (req, res) => {
      const body = validateOrThrow(
        PUBLIC_API_CONFIG.auth.signUp.bodySchema,
        req.body,
      );

      const result = await app.services.api.user.signUp(body);

      if (!result.ok || !result.data.session) {
        throw new ServerError("Failed to create new user", 400);
      }

      req.auth.establishSession(result.data.session, res);

      res.success("signup completed successfully", result, 200);
    }),
  );

  router.get(
    PUBLIC_API_CONFIG.integrations.wiki.path,
    wrapAsync(async (req, res) => {
      const { q: term } = validateOrThrow(
        PUBLIC_API_CONFIG.integrations.wiki.querySchema,
        req.query,
      );
      const result = await app.integrations.wiki.extract(term);

      res.success("extracted term from wikipedia successfully", result, 200);
    }),
  );

  router.get(
    PUBLIC_API_CONFIG.articles.poll.path,
    wrapAsync(async (req, res) => {
      const { jobId } = validateOrThrow(
        PUBLIC_API_CONFIG.articles.poll.paramsSchema,
        req.params,
      );
      const job = app.services.api.articles.getExtractionJob(jobId);

      if (!job) {
        throw new ClientError("Job not found", null, 404);
      }

      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, max-age=0",
      );
      res.success("Extraction status retrieved", job, 200);
    }),
  );

  router.post(
    PUBLIC_API_CONFIG.articles.extract.path,
    wrapAsync(async (req, res) => {
      const { articles } = validateOrThrow(
        PUBLIC_API_CONFIG.articles.extract.bodySchema,
        req.body,
      );
      const result = app.services.api.articles.extract(articles);

      res.success("Extraction started", result, 202);
    }),
  );

  router.get(
    PUBLIC_API_CONFIG.integrations.blueSky.feed.path,
    wrapAsync(async (req, res) => {
      const result = await app.integrations.blueSky.feed();

      res.success("Blue Sky feed retrieved successfully", result, 200);
    }),
  );

  router.get(
    PUBLIC_API_CONFIG.integrations.blueSky.search.path,
    wrapAsync(async (req, res) => {
      const { q: query } = validateOrThrow(
        PUBLIC_API_CONFIG.integrations.blueSky.search.querySchema,
        req.query,
      );
      const result = await app.integrations.blueSky.search(query);

      res.success("Blue Sky posts searched successfully", result, 200);
    }),
  );

  router.get(
    PUBLIC_API_CONFIG.integrations.newsApi.path,
    wrapAsync(async (req, res) => {
      const { q: query } = validateOrThrow(
        PUBLIC_API_CONFIG.integrations.newsApi.querySchema,
        req.query,
      );

      const result = await app.integrations.newsApi.search(query);

      res.success("successful search", result, 200);
    }),
  );

  return router;
}
