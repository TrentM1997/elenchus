import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { IAuthorization } from "../../auth/authorization.ts";
import { DbResult } from "../../../db/types/types.ts";
import { ArticlesFromBookmarks } from "../../../db/access/repositories/articles/articlesRepository.ts";
import {
  BookmarkDeleteResponse,
  BookmarkResponse,
} from "../../../db/access/repositories/bookmarks/bookmarksRepository.ts";
import { BookmarkSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { ServerError } from "../../../core/errors/ServerError.ts";

type BookmarkOperation = {
  user_id: string | null | undefined;
  article_id: number;
};

export interface IUserArticleHandler {
  bookmarkByArticleId(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>>;
  articlesBookmarked(
    user_id: string | undefined | null,
  ): Promise<ArticlesFromBookmarks>;
  articleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>>;
  bookmark(params: BookmarkOperation): Promise<BookmarkResponse>;

  removeBookmark(params: BookmarkOperation): Promise<BookmarkDeleteResponse>;
}

export class UserArticleHandler implements IUserArticleHandler {
  constructor(
    private readonly db: Pick<IDbClient, "articles" | "bookmarks">,
    private readonly policy: IAuthorization,
  ) {}

  public async articlesBookmarked(
    user_id: string | undefined | null,
  ): Promise<ArticlesFromBookmarks> {
    return this.articlesFromBookmarks(user_id);
  }

  public async articleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>> {
    return await this.executeArticleById(params);
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

  public async bookmarkByArticleId(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>> {
    return await this.executeBookmarkByArticleId(params);
  }

  private async executeBookmarkByArticleId(params: {
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

  private async executeArticleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>> {
    this.policy.requireAuthenticated(params.user_id);

    return await this.fromArticleId(params.article_id);
  }

  private async fromArticleId(article_id: ArticleSchemaType["id"]) {
    return await this.db.articles.byId(article_id);
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
