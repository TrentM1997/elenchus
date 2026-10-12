import { BookmarkSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { IAuthorization } from "../../auth/authorization.ts";
import { DbResult } from "../../../db/types/types.ts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export interface IUserArticlesSelectHandler {
  bookmarkRecords(
    user_id: string | undefined | null,
  ): Promise<DbResult<BookmarkSchemaType[]>>;
  articlesBookmarked(
    user_id: string | undefined | null,
  ): Promise<DbResult<ArticleSchemaType[]>>;
  articleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>>;
}

export class UserArticlesSelectHandler implements IUserArticlesSelectHandler {
  constructor(
    private readonly db: Pick<IDbClient, "bookmarks" | "articles">,
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
    return await this.articlesFromBookmarks(user_id);
  }

  public async articleById(params: {
    user_id: string | null | undefined;
    article_id: ArticleSchemaType["id"];
  }): Promise<DbResult<ArticleSchemaType>> {
    return await this.executeArticleById(params);
  }

  private async articlesFromBookmarks(user_id: string | null | undefined) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.select.all(userId);
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

    return await this.db.articles.select.byId(params.article_id);
  }
}
