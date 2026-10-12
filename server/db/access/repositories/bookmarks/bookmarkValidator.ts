import {
  BookmarkSchema,
  BookmarkSchemaType,
} from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { validateServerOrThrow } from "../../../../core/validation/validateOrThrow.js";
import {
  AritclesArraySchema,
  ArticleSchemaType,
} from "@elenchus/contracts/schemas/articles/ArticleSchema";

export class BookmarkValidator {
  public validateSavedBookMarks(results: unknown[]) {
    const bookmarks = [];
    for (const result of results) {
      const bookmark = validateServerOrThrow(BookmarkSchema, result);
      bookmarks.push(bookmark);
    }
    return bookmarks;
  }

  public validateBookmarkedArticles(articles: unknown): ArticleSchemaType[] {
    return validateServerOrThrow(AritclesArraySchema, articles);
  }

  public validateBookmark(bookmark: unknown): BookmarkSchemaType {
    return validateServerOrThrow(BookmarkSchema, bookmark);
  }
}
