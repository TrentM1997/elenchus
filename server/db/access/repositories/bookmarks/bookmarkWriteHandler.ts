import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { BookmarkValidator } from "./bookmarkValidator.js";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";
import { DbResult } from "../../../types/types.ts";
import { BookmarkResponse } from "./bookmarkSelectHandler.ts";

export type BookmarkDeleteResponse = DbResult<
  Database["public"]["Tables"]["bookmarks"]["Row"][]
>;

export interface IBookmarkWriteHandler {
  bookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse>;
  delete(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkDeleteResponse>;
}

export class BookmarkWriteHandler implements IBookmarkWriteHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly validator: BookmarkValidator,
  ) {}

  public async bookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse> {
    return await this.executeBookmarkArticle(user_id, article_id);
  }

  public async delete(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkDeleteResponse> {
    return await this.executeDeleteBookmark(user_id, article_id);
  }

  private async executeDeleteBookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkDeleteResponse> {
    const { data, error } = await this.db
      .from("bookmarks")
      .delete()
      .eq("article_id", article_id)
      .eq("user_id", user_id)
      .select();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data,
    };
  }

  private async executeBookmarkArticle(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse> {
    const insertable = { article_id, user_id };
    const { data, error } = await this.db
      .from("bookmarks")
      .insert(insertable)
      .select()
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    const bookmark = this.validator.validateBookmark(data);
    return {
      ok: true,
      data: bookmark,
    };
  }
}
