import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { ArticleSchemaType } from "../../../../schemas/ArticleSchema.js";
import { ServerError } from "../../../../core/errors/ServerError.js";
import {
  IArticlesDbParser,
  ArticlesDbParser,
  type InsertableArticleType,
} from "./articlesParser.js";
import { BookmarkSchemaType } from "../../../../schemas/BookmarkSchema.js";
import { DbResult } from "../../../types/types.ts";

export type ArticlesFromBookmarks = DbResult<ArticleSchemaType[]>;

export interface IArticlesRepository {
  saveArticle(article: unknown): Promise<ArticleSchemaType>;
  fromBookmarkIds(
    ids: BookmarkSchemaType["article_id"][],
  ): Promise<ArticlesFromBookmarks>;
}

export class ArticlesRepository implements IArticlesRepository {
  private readonly parser: IArticlesDbParser;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new ArticlesDbParser();
  }

  public async saveArticle(article: unknown): Promise<ArticleSchemaType> {
    return await this.executeSaveArticle(article);
  }

  public async fromBookmarkIds(
    ids: BookmarkSchemaType["article_id"][],
  ): Promise<ArticlesFromBookmarks> {
    return await this.executeFromBookmarkIds(ids);
  }

  private async executeFromBookmarkIds(
    ids: BookmarkSchemaType["article_id"][],
  ): Promise<ArticlesFromBookmarks> {
    const { data, error } = await this.db
      .from("articles")
      .select()
      .in("id", ids);

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: this.parser.validateArticles(data),
    };
  }

  private async executeSaveArticle(
    article: unknown,
  ): Promise<ArticleSchemaType> {
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
