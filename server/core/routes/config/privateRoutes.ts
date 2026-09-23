import { Router } from "express";
import { IAppServices } from "../../../services/appServices.js";
import { wrapAsync } from "../../async/wrapAsync.js";
import { validateOrThrow } from "../../validation/validateOrThrow.js";
import { BookmarkArticleIdSchema } from "../../../schemas/BookmarkSchema.js";
import { ServerError } from "../../errors/ServerError.js";
import {
  GetInvestigationSchema,
  InvestigationSchema,
  PersistInvestigationInputSchema,
} from "../../../schemas/InvestigationSchema.js";
import { LoginSchema } from "../../../schemas/LoginSchema.js";
import { PRIVATE_API_ROUTES } from "./routeConfig.js";
import { SearchQuerySchema } from "../../../schemas/SearchQuerySchema.ts";

export function protectedRoutes(app: IAppServices, router: Router) {
  router.post(
    PRIVATE_API_ROUTES.account.delete,
    wrapAsync(async (req, res) => {
      const credentials = validateOrThrow(LoginSchema, req.body);
      const result = await app.services.api.user.deleteAccount(
        req.user?.userId,
        credentials,
      );

      if (!result.ok) {
        throw new ServerError(result.message, 401, result.details);
      }

      req.auth.clearSessionCookies(res);
      res.success("User deleted successfully.", result, 200);
    }),
  );

  router.get(
    PRIVATE_API_ROUTES.bookmarks.get.all,
    wrapAsync(async (req, res) => {
      const results = await app.services.api.user.articlesBookmarked(
        req.user?.userId,
      );

      if (results.ok === false) {
        throw new ServerError(results.message, 500, results.details);
      }

      res.success("users saved articles retrieved successfully", results, 200);
    }),
  );

  router.get(
    PRIVATE_API_ROUTES.bookmarks.get.single,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const article_id = validateOrThrow(
        BookmarkArticleIdSchema,
        Number(req.params.articleId),
      );

      const result = await app.services.api.user.articleById({
        user_id: userId,
        article_id,
      });

      if (!result.ok) {
        throw new ServerError(result.message, 404, result.details);
      }

      res.success("Article retrieved successfully", result, 200);
    }),
  );

  router.post(
    PRIVATE_API_ROUTES.bookmarks.post,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const article_id = validateOrThrow(
        BookmarkArticleIdSchema,
        req.body?.article_id,
      );
      const result = await app.services.api.user.bookmark({
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
      res.success("article saved successfully", result);
    }),
  );

  router.delete(
    PRIVATE_API_ROUTES.bookmarks.delete,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const article_id = validateOrThrow(
        BookmarkArticleIdSchema,
        Number(req.params.articleId),
      );

      const result = await app.services.api.user.removeBookmark({
        user_id: userId,
        article_id,
      });

      if (!result.ok) {
        throw new ServerError("Failed to remove bookmark", 500, result.message);
      }

      res.success("Bookmark deleted successfully", result, 200);
    }),
  );

  router.post(
    PRIVATE_API_ROUTES.investigations.post,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const investigation = validateOrThrow(
        PersistInvestigationInputSchema,
        req.body,
      );

      const result = await app.services.api.investigations.save(
        userId,
        investigation,
      );

      if (!result.ok) {
        throw new ServerError(
          "Failed to save investigation",
          500,
          result.details,
        );
      }
      res.success("Investigation saved successfully", result, 200);
    }),
  );

  router.get(
    PRIVATE_API_ROUTES.investigations.get.all,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const result =
        await app.services.api.investigations.getSavedResearch(userId);

      if (!result.ok) {
        throw new ServerError(
          "Failed to get saved investigations",
          500,
          result.details,
        );
      }

      res.success("Saved investigations retreived successfully", result, 200);
    }),
  );

  router.get(
    PRIVATE_API_ROUTES.investigations.get.single,
    wrapAsync(async (req, res) => {
      const userId = req.user.userId;
      const id = Number(req.params.investigationId);
      const { user_id, investigation_id } = validateOrThrow(
        GetInvestigationSchema,
        { user_id: userId, investigation_id: id },
      );

      const result = await app.services.api.investigations.getInvestigation({
        user_id,
        investigation_id,
      });

      if (!result.ok) {
        throw new ServerError(
          "Failed to retrieve investigation",
          404,
          result.details,
        );
      }
      res.success("Saved investigation retrieved", result, 200);
    }),
  );

  return router;
}
