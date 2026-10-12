import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { IAuthorization } from "../../auth/authorization.ts";
import {
  BookmarkDeleteResponse,
  BookmarkResponse,
} from "../../../db/access/repositories/bookmarks/bookmarksRepository.ts";

type BookmarkOperation = {
  user_id: string | null | undefined;
  article_id: number;
};

export interface IUserArticlesWriteHandler {
  bookmark(params: BookmarkOperation): Promise<BookmarkResponse>;
  removeBookmark(params: BookmarkOperation): Promise<BookmarkDeleteResponse>;
}

export class UserArticlesWriteHandler implements IUserArticlesWriteHandler {
  constructor(
    private readonly db: Pick<IDbClient, "bookmarks">,
    private readonly policy: IAuthorization,
  ) {}

  public async bookmark(params: {
    user_id: string | null | undefined;
    article_id: number;
  }): Promise<BookmarkResponse> {
    return await this.executeBookmark(params.user_id, params.article_id);
  }

  public async removeBookmark(
    params: BookmarkOperation,
  ): Promise<BookmarkDeleteResponse> {
    return await this.executeRemoveBookmark(params.user_id, params.article_id);
  }

  private async executeBookmark(
    user_id: string | null | undefined,
    article_id: number,
  ): Promise<BookmarkResponse> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.write.bookmark(userId, article_id);
  }

  private async executeRemoveBookmark(
    user_id: string | null | undefined,
    article_id: number,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.bookmarks.write.delete(userId, article_id);
  }
}
