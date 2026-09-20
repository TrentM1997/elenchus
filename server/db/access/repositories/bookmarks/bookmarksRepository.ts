import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";
import {
  BookmarkSchema,
  BookmarkSchemaType,
} from "../../../../schemas/BookmarkSchema.js";
import { validateServerOrThrow } from "../../../../core/validation/validateOrThrow.js";
import { DbResult } from "../../../types/types.ts";

export type BookmarkResponse = DbResult<BookmarkSchemaType>;

export type BookmarkDeleteResponse = DbResult<
  Database["public"]["Tables"]["bookmarks"]["Row"][]
>;

export type BookmarkedArticlesResponse = DbResult<BookmarkSchemaType[]>;

export interface IBookmarksRepository {
  bookmarkArticle(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse>;
  deleteBookmark(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkDeleteResponse>;
  getBookmarks(
    user_id: AuthenticatedUserId,
  ): Promise<BookmarkedArticlesResponse>;
  getById(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse>;
}

export class BookmarksRepository implements IBookmarksRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  public async getBookmarks(
    user_id: AuthenticatedUserId,
  ): Promise<BookmarkedArticlesResponse> {
    return await this.executeGetBookmarks(user_id);
  }

  public async getById(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse> {
    return await this.getBookmarkById(user_id, article_id);
  }

  private async executeGetBookmarks(
    user_id: AuthenticatedUserId,
  ): Promise<BookmarkedArticlesResponse> {
    const { data, error } = await this.db
      .from("bookmarks")
      .select()
      .eq("user_id", user_id)
      .order("created_at");

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    const bookmarks = this.validateSavedBookMarks(data);

    return {
      ok: true,
      data: bookmarks,
    };
  }

  public async bookmarkArticle(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse> {
    return await this.executeBookmarkArticle(user_id, article_id);
  }

  public async getBookmarkById(
    user_id: AuthenticatedUserId,
    article_id: number,
  ): Promise<BookmarkResponse> {
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
      data: this.validateBookmark(data),
    };
  }

  public async deleteBookmark(
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

    const bookmark = this.validateBookmark(data);
    return {
      ok: true,
      data: bookmark,
    };
  }

  private validateSavedBookMarks(results: unknown[]) {
    const bookmarks = [];
    for (const result of results) {
      const bookmark = validateServerOrThrow(BookmarkSchema, result);
      bookmarks.push(bookmark);
    }
    return bookmarks;
  }

  private validateBookmark(bookmark: unknown): BookmarkSchemaType {
    return validateServerOrThrow(BookmarkSchema, bookmark);
  }
}
