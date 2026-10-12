import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.ts";
import { BookmarkValidator } from "./bookmarkValidator.ts";
import { BookmarkSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { DbResult } from "../../../types/types.ts";
import { AuthenticatedUserId } from "../../../../services/auth/handlers/sessionHandler.ts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export type BookmarkResponse = DbResult<BookmarkSchemaType>;

export interface IBookmarkSelectHandler {
  all(user_id: AuthenticatedUserId): Promise<DbResult<ArticleSchemaType[]>>;
  records(
    user_id: AuthenticatedUserId,
  ): Promise<DbResult<BookmarkSchemaType[]>>;
}

export class BookmarkSelectHandler implements IBookmarkSelectHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly validator: BookmarkValidator,
  ) {}

  public async records(
    user_id: AuthenticatedUserId,
  ): Promise<DbResult<BookmarkSchemaType[]>> {
    return await this.getRecords(user_id);
  }

  public async all(
    user_id: AuthenticatedUserId,
  ): Promise<DbResult<ArticleSchemaType[]>> {
    return await this.getBookmarkedArticles(user_id);
  }

  private async getBookmarkedArticles(
    user_id: AuthenticatedUserId,
  ): Promise<DbResult<ArticleSchemaType[]>> {
    const { data, error } = await this.db.rpc("get_bookmarked_articles", {
      p_user_id: user_id,
    });

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: this.validator.validateBookmarkedArticles(data),
    };
  }

  private async getRecords(
    user_id: AuthenticatedUserId,
  ): Promise<DbResult<BookmarkSchemaType[]>> {
    const { data, error } = await this.db
      .from("bookmarks")
      .select()
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    const bookmarks = this.validator.validateSavedBookMarks(data);

    return {
      ok: true,
      data: bookmarks,
    };
  }
}
