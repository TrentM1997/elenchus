import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { IArticlesDbParser } from "./articlesParser.js";
import { DbResult } from "../../../types/types.ts";
import { ServerError } from "../../../../core/errors/ServerError.ts";

export interface IArticlesSelectHandler {
  byId(
    article_id: ArticleSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType>>;
  byIds(ids: ArticleSchemaType["id"][]): Promise<DbResult<ArticleSchemaType[]>>;
  byUrls(
    urls: ArticleSchemaType["article_url"][],
  ): Promise<DbResult<ArticleSchemaType[]>>;
}

export class ArticlesSelectHandler implements IArticlesSelectHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly parser: IArticlesDbParser,
  ) {}

  public async byIds(
    ids: ArticleSchemaType["id"][],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    return await this.byArticleIds(ids);
  }

  public async byId(
    article_id: ArticleSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType>> {
    return await this.executeById(article_id);
  }

  public async byUrls(
    urls: ArticleSchemaType["article_url"][],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    return await this.selectbyUrls(urls);
  }

  private async selectbyUrls(
    urls: ArticleSchemaType["article_url"][],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    const { data, error } = await this.db
      .from("articles")
      .select()
      .in("article_url", urls);

    if (error) {
      throw new ServerError(error.message, 500, error.cause);
    }

    if (data === null) {
      return {
        ok: false,
        message: "Article not found",
      };
    }

    return {
      ok: true,
      data: this.parser.validateArticles(data),
    };
  }

  private async byArticleIds(
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
}
