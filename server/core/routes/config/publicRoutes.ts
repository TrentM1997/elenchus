import { Router } from "express";
import { IAppServices } from "../../../services/appServices.js";
import { wrapAsync } from "../../async/wrapAsync.js";
import { ServerError } from "../../errors/ServerError.js";
import {
  validateOrThrow,
  validateServerOrThrow,
} from "../../validation/validateOrThrow.js";
import { ClientError } from "../../errors/ClientError.js";
import { PUBLIC_API_CONFIG } from "@elenchus/contracts";
import { RouteRegistrar } from "./routeRegistrar.js";
import type { Static } from "@sinclair/typebox";

const registrar = new RouteRegistrar();

export function publicRoutes(app: IAppServices, router: Router) {
  const feedbackRoute = PUBLIC_API_CONFIG.user.feedback;

  registrar.register(
    router,
    feedbackRoute,
    wrapAsync(async (req, res) => {
      const { feedback } = validateOrThrow(feedbackRoute.bodySchema, req.body);

      const result: Static<typeof feedbackRoute.outputSchema> =
        await app.services.api.user.account.submitFeedback(feedback);

      if (!result.ok) {
        throw new ServerError("Failed to submit feedback", 500, result.details);
      }

      const data = validateServerOrThrow(feedbackRoute.outputSchema, result);

      res.success("Feedback submitted successfully", data, 200);
    }),
  );

  const passwordResetRoute = PUBLIC_API_CONFIG.user.passwordReset;

  registrar.register(
    router,
    passwordResetRoute,
    wrapAsync(async (req, res) => {
      const { email } = validateOrThrow(
        passwordResetRoute.bodySchema,
        req.body,
      );
      const result: Static<typeof passwordResetRoute.outputSchema> =
        await app.services.api.user.account.requestPasswordReset(email);

      if (!result.ok) {
        throw new ServerError(
          "Failed to send password reset email",
          400,
          result.message,
        );
      }

      const data = validateServerOrThrow(
        passwordResetRoute.outputSchema,
        result,
      );

      res.success("Reset email sent.", data, 200);
    }),
  );

  const recoverRoute = PUBLIC_API_CONFIG.auth.recover;

  registrar.register(
    router,
    recoverRoute,
    wrapAsync(async (req, res) => {
      const result: Static<typeof recoverRoute.outputSchema> =
        await req.auth.recoverSession(req, res);

      const data = validateServerOrThrow(recoverRoute.outputSchema, result);

      res.success("Session checked", data, 200);
    }),
  );

  const loginRoute = PUBLIC_API_CONFIG.auth.login;

  registrar.register(
    router,
    loginRoute,
    wrapAsync(async (req, res) => {
      validateOrThrow(loginRoute.bodySchema, req.body);
      const { data: loginData, error } = await req.auth.login(req, res);

      if (error) {
        throw new ServerError("Failed to authenticate user", 401, error.cause);
      }

      const result: Static<typeof loginRoute.outputSchema> = {
        ok: true,
        data: loginData,
      };
      const data = validateServerOrThrow(loginRoute.outputSchema, result);

      res.success("Login successful", data, 200);
    }),
  );

  const logOutRoute = PUBLIC_API_CONFIG.auth.logOut;

  registrar.register(
    router,
    logOutRoute,
    wrapAsync(async (req, res) => {
      const result: Static<typeof logOutRoute.outputSchema> =
        await req.auth.logOut(req, res);

      if (!result.ok) {
        throw new ServerError("Failed to sign out user", 500, result.message);
      }

      const data = validateServerOrThrow(logOutRoute.outputSchema, result);

      res.success("signed out successfully", data, 200);
    }),
  );

  const signUpRoute = PUBLIC_API_CONFIG.auth.signUp;

  registrar.register(
    router,
    signUpRoute,
    wrapAsync(async (req, res) => {
      const body = validateOrThrow(signUpRoute.bodySchema, req.body);

      const result = await app.services.api.user.account.signUp(body);

      if (!result.ok || !result.data.session) {
        throw new ServerError("Failed to create new user", 400);
      }

      req.auth.establishSession(result.data.session, res);

      const response: Static<typeof signUpRoute.outputSchema> = result;
      const data = validateServerOrThrow(signUpRoute.outputSchema, response);

      res.success("signup completed successfully", data, 200);
    }),
  );

  const wikiRoute = PUBLIC_API_CONFIG.integrations.wiki;

  registrar.register(
    router,
    wikiRoute,
    wrapAsync(async (req, res) => {
      const { q: term } = validateOrThrow(wikiRoute.querySchema, req.query);
      const result: Static<typeof wikiRoute.outputSchema> =
        await app.integrations.wiki.extract(term);

      const data = validateServerOrThrow(wikiRoute.outputSchema, result);

      res.success("extracted term from wikipedia successfully", data, 200);
    }),
  );

  const pollRoute = PUBLIC_API_CONFIG.articles.poll;

  registrar.register(
    router,
    pollRoute,
    wrapAsync(async (req, res) => {
      const { jobId } = validateOrThrow(pollRoute.paramsSchema, req.params);
      const job = app.services.api.articles.getExtractionJob(jobId);

      if (!job) {
        throw new ClientError("Job not found", null, 404);
      }

      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, max-age=0",
      );
      const response: Static<typeof pollRoute.outputSchema> = job;
      const data = validateServerOrThrow(pollRoute.outputSchema, response);

      res.success("Extraction status retrieved", data, 200);
    }),
  );

  const extractRoute = PUBLIC_API_CONFIG.articles.extract;

  registrar.register(
    router,
    extractRoute,
    wrapAsync(async (req, res) => {
      const { articles } = validateOrThrow(extractRoute.bodySchema, req.body);
      const result: Static<typeof extractRoute.outputSchema> =
        app.services.api.articles.extract(articles);

      const data = validateServerOrThrow(extractRoute.outputSchema, result);

      res.success("Extraction started", data, 202);
    }),
  );

  const blueSkyFeedRoute = PUBLIC_API_CONFIG.integrations.blueSky.feed;

  registrar.register(
    router,
    blueSkyFeedRoute,
    wrapAsync(async (req, res) => {
      const result: Static<typeof blueSkyFeedRoute.outputSchema> =
        await app.integrations.blueSky.feed();

      const data = validateServerOrThrow(blueSkyFeedRoute.outputSchema, result);

      res.success("Blue Sky feed retrieved successfully", data, 200);
    }),
  );

  const blueSkySearchRoute = PUBLIC_API_CONFIG.integrations.blueSky.search;

  registrar.register(
    router,
    blueSkySearchRoute,
    wrapAsync(async (req, res) => {
      const { q: query } = validateOrThrow(
        blueSkySearchRoute.querySchema,
        req.query,
      );
      const result: Static<typeof blueSkySearchRoute.outputSchema> =
        await app.integrations.blueSky.search(query);

      const data = validateServerOrThrow(
        blueSkySearchRoute.outputSchema,
        result,
      );

      res.success("Blue Sky posts searched successfully", data, 200);
    }),
  );

  const newsSearchRoute = PUBLIC_API_CONFIG.integrations.newsApi;

  registrar.register(
    router,
    newsSearchRoute,
    wrapAsync(async (req, res) => {
      const { q: query } = validateOrThrow(
        newsSearchRoute.querySchema,
        req.query,
      );

      const result: Static<typeof newsSearchRoute.outputSchema> =
        await app.integrations.newsApi.search(query);

      const data = validateServerOrThrow(newsSearchRoute.outputSchema, result);

      res.success("successful search", data, 200);
    }),
  );

  return router;
}
