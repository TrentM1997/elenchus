import type { Static } from "@sinclair/typebox";
import type { ApiContract } from "@elenchus/contracts";
import { Router } from "express";
import { IAppServices } from "../../../services/appServices.js";
import { wrapAsync } from "../../async/wrapAsync.js";
import {
  validateOrThrow,
  validateServerOrThrow,
} from "../../validation/validateOrThrow.js";
import { ServerError } from "../../errors/ServerError.js";
import { IRouteRegistrar } from "./routeRegistrar.js";

export type CreatePrivateRoutesParams = {
  app: IAppServices;
  router: Router;
  registrar: IRouteRegistrar;
  contract: ApiContract["private"];
};

export function createPrivateRoutes({
  registrar,
  router,
  app,
  contract,
}: CreatePrivateRoutesParams) {
  const deleteAccountRoute = contract.account.delete;

  registrar.register(
    router,
    deleteAccountRoute,
    wrapAsync(async (req, res) => {
      const credentials = validateOrThrow(
        deleteAccountRoute.bodySchema,
        req.body,
      );
      const result: Static<typeof deleteAccountRoute.outputSchema> =
        await app.services.api.user.account.deleteAccount(
          req.user?.userId,
          credentials,
        );

      console.log("*******************************");
      console.log({ "Delete Account Result": result });
      console.log("*******************************");
      if (!result.ok) {
        throw new ServerError(result.message, 401, result.details);
      }

      req.auth.clearSessionCookies(res);
      const data = validateServerOrThrow(
        deleteAccountRoute.outputSchema,
        result,
      );

      res.success("User deleted successfully.", data, 200);
    }),
  );

  const bookmarkRecordsRoute = contract.bookmarks.get.records;

  registrar.register(
    router,
    bookmarkRecordsRoute,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const result: Static<typeof bookmarkRecordsRoute.outputSchema> =
        await app.services.api.user.articles.bookmarkRecords(userId);

      if (result.ok === false) {
        throw new ServerError(result.message, 500, result.details);
      }

      const data = validateServerOrThrow(
        bookmarkRecordsRoute.outputSchema,
        result,
      );

      res.success("bookmark records retrieved successfully", data, 200);
    }),
  );

  const bookmarkedArticlesRoute = contract.bookmarks.get.all;

  registrar.register(
    router,
    bookmarkedArticlesRoute,
    wrapAsync(async (req, res) => {
      const results: Static<typeof bookmarkedArticlesRoute.outputSchema> =
        await app.services.api.user.articles.articlesBookmarked(
          req.user?.userId,
        );

      if (results.ok === false) {
        throw new ServerError(results.message, 500, results.details);
      }

      const data = validateServerOrThrow(
        bookmarkedArticlesRoute.outputSchema,
        results,
      );

      res.success("users saved articles retrieved successfully", data, 200);
    }),
  );

  const bookmarkedArticleRoute = contract.bookmarks.get.single;

  registrar.register(
    router,
    bookmarkedArticleRoute,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const { articleId } = validateOrThrow(
        bookmarkedArticleRoute.paramsSchema,
        req.params,
      );
      const article_id = Number(articleId);

      const result: Static<typeof bookmarkedArticleRoute.outputSchema> =
        await app.services.api.user.articles.articleById({
          user_id: userId,
          article_id,
        });

      if (!result.ok) {
        throw new ServerError(result.message, 404, result.details);
      }

      const data = validateServerOrThrow(
        bookmarkedArticleRoute.outputSchema,
        result,
      );

      res.success("Article retrieved successfully", data, 200);
    }),
  );

  const bookmarkRoute = contract.bookmarks.post;

  registrar.register(
    router,
    bookmarkRoute,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const { article_id } = validateOrThrow(
        bookmarkRoute.bodySchema,
        req.body,
      );
      const result: Static<typeof bookmarkRoute.outputSchema> =
        await app.services.api.user.articles.bookmark({
          user_id: userId,
          article_id,
        });

      if (!result.ok) {
        throw new ServerError(
          "Failed to bookmark article",
          500,
          result.details,
        );
      }
      const data = validateServerOrThrow(bookmarkRoute.outputSchema, result);

      res.success("article saved successfully", data);
    }),
  );

  const deleteBookmarkRoute = contract.bookmarks.delete;

  registrar.register(
    router,
    deleteBookmarkRoute,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const { articleId } = validateOrThrow(
        deleteBookmarkRoute.paramsSchema,
        req.params,
      );
      const article_id = Number(articleId);

      const result: Static<typeof deleteBookmarkRoute.outputSchema> =
        await app.services.api.user.articles.removeBookmark({
          user_id: userId,
          article_id,
        });

      if (!result.ok) {
        throw new ServerError("Failed to remove bookmark", 500, result.message);
      }

      const data = validateServerOrThrow(
        deleteBookmarkRoute.outputSchema,
        result,
      );

      res.success("Bookmark deleted successfully", data, 200);
    }),
  );

  const saveInvestigationRoute = contract.investigations.post;

  registrar.register(
    router,
    saveInvestigationRoute,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const {
        investigation,
        articleIds,
        extracts = [],
        notes,
      } = validateOrThrow(saveInvestigationRoute.bodySchema, req.body);

      const result: Static<typeof saveInvestigationRoute.outputSchema> =
        await app.services.api.investigations.write.investigation({
          user_id: userId,
          investigation,
          articleIds,
          extracts,
          notes,
        });

      if (!result.ok) {
        throw new ServerError(
          "Failed to save investigation",
          500,
          result.details,
        );
      }
      const data = validateServerOrThrow(
        saveInvestigationRoute.outputSchema,
        result,
      );

      res.success("Investigation saved successfully", data, 200);
    }),
  );

  const savedInvestigationsRoute = contract.investigations.get.all;

  registrar.register(
    router,
    savedInvestigationsRoute,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const result: Static<typeof savedInvestigationsRoute.outputSchema> =
        await app.services.api.investigations.select.all(userId);

      if (!result.ok) {
        throw new ServerError(
          "Failed to get saved investigations",
          500,
          result.details,
        );
      }

      const data = validateServerOrThrow(
        savedInvestigationsRoute.outputSchema,
        result,
      );

      res.success("Saved investigations retreived successfully", data, 200);
    }),
  );

  const savedInvestigationRoute = contract.investigations.get.single;

  registrar.register(
    router,
    savedInvestigationRoute,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const { investigationId } = validateOrThrow(
        savedInvestigationRoute.paramsSchema,
        req.params,
      );

      const result: Static<typeof savedInvestigationRoute.outputSchema> =
        await app.services.api.investigations.select.byId({
          user_id: userId,
          investigation_id: Number(investigationId),
        });

      const data = validateServerOrThrow(
        savedInvestigationRoute.outputSchema,
        result,
      );

      res.success("Saved investigation retrieved", data, 200);
    }),
  );

  return router;
}
