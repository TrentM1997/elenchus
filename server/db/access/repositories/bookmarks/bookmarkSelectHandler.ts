import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { BookmarkValidator } from "./bookmarkValidator.js";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";
import { BookmarkSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { DbResult } from "../../../types/types.ts";

export type BookmarkResponse = DbResult<BookmarkSchemaType>;

export type BookmarkedArticlesResponse = DbResult<BookmarkSchemaType[]>;

export interface IBookmarkSelectHandler {
  single(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse>;
  all(user_id: AuthenticatedUserId): Promise<BookmarkedArticlesResponse>;
}

export class BookmarkSelectHandler implements IBookmarkSelectHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly validator: BookmarkValidator,
  ) {}

  public async all(
    user_id: AuthenticatedUserId,
  ): Promise<BookmarkedArticlesResponse> {
    return await this.executeGetBookmarks(user_id);
  }

  public async single(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse> {
    return await this.getBookmarkById(user_id, article_id);
  }

  private async executeGetBookmarks(
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
  public async getBookmarkById(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<DbResult<BookmarkSchemaType>> {
    const { data, error } = await this.db
      .from("bookmarks")
      .select()
      .eq("user_id", user_id)
      .eq("article_id", article_id)
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
      data: this.validator.validateBookmark(data),
    };
  }
}
