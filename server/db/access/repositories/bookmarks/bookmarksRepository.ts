import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { BookmarkSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { BookmarkValidator } from "./bookmarkValidator.js";
import {
  IBookmarkSelectHandler,
  BookmarkSelectHandler,
} from "./bookmarkSelectHandler.js";
import {
  IBookmarkWriteHandler,
  BookmarkWriteHandler,
} from "./bookmarkWriteHandler.ts";
import { DbResult } from "../../../types/types.ts";

export type BookmarkResponse = DbResult<BookmarkSchemaType>;

export type BookmarkDeleteResponse = DbResult<
  Database["public"]["Tables"]["bookmarks"]["Row"][]
>;

export type BookmarkedArticlesResponse = DbResult<BookmarkSchemaType[]>;

export interface IBookmarksRepository {
  readonly select: IBookmarkSelectHandler;
  readonly write: IBookmarkWriteHandler;
}

export class BookmarksRepository implements IBookmarksRepository {
  public readonly select: IBookmarkSelectHandler;
  public readonly write: IBookmarkWriteHandler;
  private readonly validator: BookmarkValidator;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.validator = new BookmarkValidator();
    this.select = new BookmarkSelectHandler(this.db, this.validator);
    this.write = new BookmarkWriteHandler(this.db, this.validator);
  }
}
