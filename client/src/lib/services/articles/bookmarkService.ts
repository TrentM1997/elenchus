import { ArticleSchemaType } from "../../../../../schemas/api/types/ArticlesSchema";
import {
  BookmarkResponseSchema,
  BookmarkResponseSchemaType,
} from "../../../../../schemas/api/types/BookmarkSchema";
import { validateSchema } from "../../../../../schemas/api/validation/validateSchema";

export interface IBookmarkService {
  removeBookmark(
    article_id: ArticleSchemaType["id"],
  ): Promise<BookmarkResponseSchemaType>;
  bookmark(
    article_id: ArticleSchemaType["id"],
  ): Promise<BookmarkResponseSchemaType>;
}

export class BookmarkService implements IBookmarkService {
  constructor() {}

  public async bookmark(
    article_id: ArticleSchemaType["id"],
  ): Promise<BookmarkResponseSchemaType> {
    return await this.executeBookmark(article_id);
  }

  public async removeBookmark(
    article_id: ArticleSchemaType["id"],
  ): Promise<BookmarkResponseSchemaType> {
    return await this.executeRemoveBookmark(article_id);
  }

  private async executeBookmark(article_id: ArticleSchemaType["id"]) {
    const request = await fetch("/user/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article_id }),
    });

    if (!request.ok) {
      throw new Error("Bookmark request failed");
    }

    return this.validateResponse(await request.json());
  }

  private async executeRemoveBookmark(article_id: ArticleSchemaType["id"]) {
    const request = await fetch("/user/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article_id }),
    });

    if (!request.ok) {
      throw new Error("Bookmark removal request failed");
    }

    return this.validateResponse(await request.json());
  }

  private validateResponse(result: unknown): BookmarkResponseSchemaType {
    const { ok, data } = validateSchema(BookmarkResponseSchema, result);

    if (!ok) {
      throw new Error("Invalid return type for bookmark removal");
    }

    return data;
  }
}
