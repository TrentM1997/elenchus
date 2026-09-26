import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import {
  IArticlesDbParser,
  ArticlesDbParser,
  type InsertableArticleType,
} from "./articlesParser.js";
import { BookmarkSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { DbResult } from "../../../types/types.ts";

export type ArticlesFromBookmarks = DbResult<ArticleSchemaType[]>;

export type SaveArticleResult = DbResult<ArticleSchemaType>;

export interface IArticlesRepository {
  saveArticle(article: unknown): Promise<SaveArticleResult>;
  fromBookmarkIds(
    ids: BookmarkSchemaType["article_id"][],
  ): Promise<ArticlesFromBookmarks>;
  byId(
    article_id: ArticleSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType>>;
  byIds(ids: ArticleSchemaType["id"][]): Promise<DbResult<ArticleSchemaType[]>>;
}

export class ArticlesRepository implements IArticlesRepository {
  private readonly parser: IArticlesDbParser;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new ArticlesDbParser();
  }

  public async saveArticle(article: unknown): Promise<SaveArticleResult> {
    return await this.executeSaveArticle(article);
  }

  public async byIds(
    ids: ArticleSchemaType["id"][],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    return await this.executeByIds(ids);
  }

  public async fromBookmarkIds(
    ids: BookmarkSchemaType["article_id"][],
  ): Promise<ArticlesFromBookmarks> {
    return await this.executeFromBookmarkIds(ids);
  }

  public async byId(
    article_id: ArticleSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType>> {
    return await this.executeById(article_id);
  }

  private async executeByIds(
    ids: ArticleSchemaType["id"][],
  ): Promise<DbResult<ArticleSchemaType[]>> {
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

  private async executeById(
    article_id: ArticleSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType>> {
    const { data, error } = await this.db
      .from("articles")
      .select()
      .eq("id", article_id)
      .maybeSingle();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    if (data === null) {
      return {
        ok: false,
        message: "Article not found",
      };
    }

    return {
      ok: true,
      data: this.parser.validateArticleSelected(data),
    };
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
  ): Promise<SaveArticleResult> {
    const validated = this.parser.validateArticleInput(article);
    const insertableArticle = this.parser.toInsertableArticle(validated);
    return await this.insertArticle(insertableArticle);
  }

  private async insertArticle(
    article: InsertableArticleType,
  ): Promise<SaveArticleResult> {
    const { data, error } = await this.db
      .from("articles")
      .insert([article])
      .select()
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    const validArticle = this.parser.validateArticleSelected(data);

    return {
      ok: true,
      data: validArticle,
    };
  }
}
