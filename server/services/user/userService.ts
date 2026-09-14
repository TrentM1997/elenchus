import { IDbClient } from "../../db/access/client/dbClient";
import { IAuthorization } from "../auth/authorization";
import { ArticleSchemaType } from "../../schemas/ArticleSchema";
import { LoginSchema } from "../../schemas/LoginSchema";
import {
  CreateUserResult,
  PasswordResetResult,
  AccountDeletionResult,
} from "../../db/access/repositories/user/userWriteHandler";
import {
  BookmarkDeleteResponse,
  BookmarkResponse,
} from "../../db/access/repositories/bookmarks/bookmarksRepository";
import { ServerError } from "../../core/errors/ServerError";
import { BookmarkSchemaType } from "../../schemas/BookmarkSchema";
import { FeedbackReqSchemaType } from "../../schemas/FeedbackReqSchema";
import { FeedbackSubmitResult } from "../../db/access/repositories/feedback/feedbackRespository";

type BookmarkOperation = {
  user_id: string | null | undefined;
  article_id: number;
};

export interface IUserService {
  deleteAccount(
    user_id: string | null | undefined,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult>;
  signUp(credentials: LoginSchema): CreateUserResult;
  requestPasswordReset(email: string): Promise<PasswordResetResult>;
  bookmark(params: BookmarkOperation): Promise<BookmarkResponse>;
  removeBookmark(params: BookmarkOperation): Promise<BookmarkDeleteResponse>;
  articlesBookmarked(
    user_id: string | undefined | null,
  ): Promise<ArticleSchemaType[]>;
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

  public async signUp(credentials: LoginSchema): CreateUserResult {
    return await this.db.user.write.createUser(credentials);
  }

  public async deleteAccount(
    user_id: string | null | undefined,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult> {
    return await this.executeDeleteAccount(user_id, credentials);
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
  ): Promise<PasswordResetResult> {
    return await this.db.user.write.requestPasswordReset(email);
  }

  public async articlesBookmarked(
    user_id: string | undefined | null,
  ): Promise<ArticleSchemaType[]> {
    return this.articlesFromBookmarks(user_id);
  }

  private async articlesFromBookmarks(
    user_id: string | null | undefined,
  ): Promise<ArticleSchemaType[]> {
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
  ): Promise<ArticleSchemaType[]> {
    const ids = bookmarks.map((bkm) => bkm.article_id);

    if (ids.length === 0) {
      return [];
    }

    const results = await this.db.articles.fromBookmarkIds(ids);

    if (!results.ok) {
      throw new ServerError(
        "Failed to retrieve articles from bookmarks",
        500,
        results.details,
      );
    }

    return this.sortBookmarkedArticles(results.data, ids);
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
