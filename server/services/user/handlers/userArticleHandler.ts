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

type BookmarkOperation = {
  user_id: string | null | undefined;
  article_id: number;
};

export interface IUserArticleHandler {
  bookmarkRecords(
    user_id: string | undefined | null,
  ): Promise<DbResult<BookmarkSchemaType[]>>;
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

  public async bookmarkRecords(
    user_id: string | undefined | null,
  ): Promise<DbResult<BookmarkSchemaType[]>> {
    return await this.getBookmarkRecords(user_id);
  }

  public async articlesBookmarked(
    user_id: string | undefined | null,
  ): Promise<DbResult<ArticleSchemaType[]>> {
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

  private async getBookmarkRecords(
    user_id: string | undefined | null,
  ): Promise<DbResult<BookmarkSchemaType[]>> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.select.records(userId);
  }

  private async executeArticleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>> {
    this.policy.requireAuthenticated(params.user_id);

    return await this.fromArticleId(params.article_id);
  }

  private async fromArticleId(article_id: ArticleSchemaType["id"]) {
    return await this.db.articles.select.byId(article_id);
  }

  private async articlesFromBookmarks(user_id: string | null | undefined) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.select.all(userId);
  }

  private async executeRemoveBookmark(
    user_id: string | null | undefined,
    article_id: number,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.write.delete(userId, article_id);
  }

  private async executeBookmark(
    user_id: string | null | undefined,
    article_id: number,
  ): Promise<BookmarkResponse> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.write.bookmark(userId, article_id);
  }
}
