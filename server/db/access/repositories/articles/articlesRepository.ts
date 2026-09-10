import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces";
import { ArticleSchemaType } from "../../../../schemas/ArticleSchema";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization";
import { ServerError } from "../../../../core/errors/ServerError";
import { BookmarkSchemaType } from "../../../../schemas/BookmarkSchema";
import {
  IArticlesDbParser,
  ArticlesDbParser,
  type InsertableArticleType,
} from "./articlesParser";

export interface IArticlesRepository {
  saveArticle(article: unknown): Promise<ArticleSchemaType>;
  bookmarkArticle(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkSchemaType>;
}

export class ArticlesRepository implements IArticlesRepository {
  private readonly parser: IArticlesDbParser;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new ArticlesDbParser();
  }

  public async saveArticle(article: unknown): Promise<ArticleSchemaType> {
    return await this.executeSaveArticle(article);
  }

  public async bookmarkArticle(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkSchemaType> {
    return await this.executeBookmarkArticle(user_id, article_id);
  }

  private async executeBookmarkArticle(
    user_id: AuthenticatedUserId,
    article_id: number,
  ) {
    const insertable = this.parser.toInsertableBookmark(user_id, article_id);
    const result = await this.db
      .from("bookmarks")
      .insert(insertable)
      .select()
      .single();
    return this.parser.validateBookMark(result);
  }

  private async executeSaveArticle(article: unknown) {
    const validated = this.parser.validateArticleInput(article);
    const insertableArticle = this.parser.toInsertableArticle(validated);
    return await this.upsertArticle(insertableArticle);
  }

  private async upsertArticle(
    article: InsertableArticleType,
  ): Promise<ArticleSchemaType> {
    const { data, error } = await this.db
      .from("articles")
      .upsert([article], { onConflict: "article_url" })
      .select()
      .single();

    if (error) {
      throw new ServerError("Failed to save article", 500, error.details);
    }

    return this.parser.validateArticleSelected(data);
  }
}
