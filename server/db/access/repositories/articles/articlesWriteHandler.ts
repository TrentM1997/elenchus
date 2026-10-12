import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import {
  IArticlesDbParser,
  type InsertableArticleType,
} from "./articlesParser.js";
import { DbResult } from "../../../types/types.ts";

export interface IArticlesWriteHandler {
  article(article: unknown): Promise<DbResult<ArticleSchemaType>>;
}

export class ArticlesWriteHandler implements IArticlesWriteHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly parser: IArticlesDbParser,
  ) {}

  public article(article: unknown): Promise<DbResult<ArticleSchemaType>> {
    return this.execute(article);
  }

  private async execute(article: unknown) {
    const validated = this.parser.validateArticleInput(article);
    const insertableArticle = this.parser.toInsertableArticle(validated);
    return await this.insert(insertableArticle);
  }

  private async insert(
    article: InsertableArticleType,
  ): Promise<DbResult<ArticleSchemaType>> {
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

    return {
      ok: true,
      data: this.parser.validateArticleSelected(data),
    };
  }
}
