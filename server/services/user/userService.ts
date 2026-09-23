import { IDbClient } from "../../db/access/client/dbClient.js";
import { AuthenticatedUserId, IAuthorization } from "../auth/authorization.js";
import { ArticleSchemaType } from "../../schemas/ArticleSchema.js";
import { LoginSchema } from "../../schemas/LoginSchema.js";
import {
  CreateUserResult,
  RequestPasswordResetResult,
  AccountDeletionResult,
} from "../../db/access/repositories/user/userWriteHandler.js";
import {
  BookmarkDeleteResponse,
  BookmarkResponse,
} from "../../db/access/repositories/bookmarks/bookmarksRepository.js";
import { ServerError } from "../../core/errors/ServerError.js";
import { BookmarkSchemaType } from "../../schemas/BookmarkSchema.js";
import { FeedbackReqSchemaType } from "../../schemas/FeedbackReqSchema.js";
import { FeedbackSubmitResult } from "../../db/access/repositories/feedback/feedbackRespository.js";
import { ResetPasswordResponseSchemaType } from "../../schemas/ChangePasswordSchema.ts";
import { DbResult } from "../../db/types/types.ts";
import { ArticlesFromBookmarks } from "../../db/access/repositories/articles/articlesRepository.ts";

type BookmarkOperation = {
  user_id: string | null | undefined;
  article_id: number;
};

export interface IUserService {
  articleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>>;
  changePassword(credentials: {
    email: string;
    password: string;
  }): Promise<ResetPasswordResponseSchemaType>;
  deleteAccount(
    user_id: string | null | undefined,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult>;
  signUp(credentials: LoginSchema): Promise<CreateUserResult>;
  requestPasswordReset(email: string): Promise<RequestPasswordResetResult>;
  bookmark(params: BookmarkOperation): Promise<BookmarkResponse>;
  removeBookmark(params: BookmarkOperation): Promise<BookmarkDeleteResponse>;
  articlesBookmarked(
    user_id: string | undefined | null,
  ): Promise<ArticlesFromBookmarks>;
  submitFeedback(
    feedback: FeedbackReqSchemaType,
  ): Promise<FeedbackSubmitResult>;
}

export class UserService implements IUserService {
  constructor(
    private readonly db: Pick<
      IDbClient,
      "articles" | "bookmarks" | "user" | "feedback"
    >,
    private readonly policy: IAuthorization,
  ) {}

  public async articleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>> {
    return await this.executeArticleById(params);
  }

  public async changePassword(credentials: {
    email: string;
    password: string;
  }): Promise<ResetPasswordResponseSchemaType> {
    return await this.db.user.write.resetPassword(credentials);
  }

  public async bookmark(params: {
    user_id: string | null | undefined;
    article_id: number;
  }): Promise<BookmarkResponse> {
    return await this.executeBookmark(params.user_id, params.article_id);
  }

  public async removeBookmark(
    params: BookmarkOperation,
  ): Promise<BookmarkDeleteResponse> {
    return await this.executeRemoveBookmark(params.user_id, params.article_id);
  }

  public async submitFeedback(
    feedback: FeedbackReqSchemaType,
  ): Promise<FeedbackSubmitResult> {
    return await this.db.feedback.submit(feedback);
  }

  public async signUp(credentials: LoginSchema): Promise<CreateUserResult> {
    return await this.db.user.write.createUser(credentials);
  }

  public async deleteAccount(
    user_id: string | null | undefined,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult> {
    return await this.executeDeleteAccount(user_id, credentials);
  }

  private async executeArticleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>> {
    const userId = this.policy.requireAuthenticated(params.user_id);
    const bookmark = await this.db.bookmarks.getById(userId, params.article_id);
    if (bookmark.ok === false) {
      return bookmark;
    }
    return await this.fromArticleId(bookmark.data.article_id);
  }

  private async fromArticleId(article_id: BookmarkSchemaType["article_id"]) {
    return await this.db.articles.byId(article_id);
  }

  private async executeDeleteAccount(
    user_id: string | null | undefined,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.user.write.deleteAccount(userId, credentials);
  }

  public async requestPasswordReset(
    email: string,
  ): Promise<RequestPasswordResetResult> {
    return await this.db.user.write.requestPasswordReset(email);
  }

  public async articlesBookmarked(
    user_id: string | undefined | null,
  ): Promise<ArticlesFromBookmarks> {
    return this.articlesFromBookmarks(user_id);
  }

  private async articlesFromBookmarks(
    user_id: string | null | undefined,
  ): Promise<ArticlesFromBookmarks> {
    const userId = this.policy.requireAuthenticated(user_id);
    const bookmarks = await this.db.bookmarks.getBookmarks(userId);

    if (!bookmarks.ok) {
      throw new ServerError(
        "Failed to retrieve bookmarked articles",
        500,
        bookmarks.details,
      );
    }

    return this.getArticlesFromBookmarks(bookmarks.data);
  }

  private async getArticlesFromBookmarks(
    bookmarks: BookmarkSchemaType[],
  ): Promise<ArticlesFromBookmarks> {
    const ids = bookmarks.map((bkm) => bkm.article_id);

    if (ids.length === 0) {
      return {
        ok: true,
        data: [],
      };
    }

    const results = await this.db.articles.fromBookmarkIds(ids);

    if (!results.ok) {
      return results;
    }

    const sorted = this.sortBookmarkedArticles(results.data, ids);
    return {
      ok: true,
      data: sorted,
    };
  }

  private sortBookmarkedArticles(
    results: ArticleSchemaType[],
    ids: number[],
  ): ArticleSchemaType[] {
    const articlesById = new Map(
      results.map((article) => [article.id, article]),
    );

    return ids.flatMap((id) => {
      const article = articlesById.get(id);
      return article ? [article] : [];
    });
  }

  private async executeRemoveBookmark(
    user_id: string | null | undefined,
    article_id: number,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.deleteBookmark(userId, article_id);
  }

  private async executeBookmark(
    user_id: string | null | undefined,
    article_id: number,
  ): Promise<BookmarkResponse> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.bookmarkArticle(userId, article_id);
  }
}
