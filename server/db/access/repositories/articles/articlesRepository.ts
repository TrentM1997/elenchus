import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { IArticlesDbParser, ArticlesDbParser } from "./articlesParser.js";
import { DbResult } from "../../../types/types.ts";
import {
  IArticlesWriteHandler,
  ArticlesWriteHandler,
} from "./articlesWriteHandler.ts";
import {
  IArticlesSelectHandler,
  ArticlesSelectHandler,
} from "./articlesSelectHandler.ts";

export type ArticlesFromBookmarks = DbResult<ArticleSchemaType[]>;

export type SaveArticleResult = DbResult<ArticleSchemaType>;

export interface IArticlesRepository {
  readonly write: IArticlesWriteHandler;
  readonly select: IArticlesSelectHandler;
}

export class ArticlesRepository implements IArticlesRepository {
  private readonly parser: IArticlesDbParser;
  public readonly write: IArticlesWriteHandler;
  public readonly select: IArticlesSelectHandler;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new ArticlesDbParser();
    this.write = new ArticlesWriteHandler(this.db, this.parser);
    this.select = new ArticlesSelectHandler(this.db, this.parser);
  }
}
