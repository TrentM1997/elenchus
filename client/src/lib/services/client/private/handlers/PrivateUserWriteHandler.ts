import {
  BookmarkResponseSchemaType,
  DeleteBookmarkResponseSchemaType,
} from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { IHttpClient } from "@/lib/services/client/http/types";
import {
  InvestigationSaveResponseType,
  PersistInvestigationInputSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { PrivateApiContract } from "@elenchus/contracts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export interface IPrivateUserWritesHandler {
  bookmark(
    article_id: ArticleSchemaType["id"],
  ): Promise<BookmarkResponseSchemaType>;
  unBookmark(
    article_id: ArticleSchemaType["id"],
  ): Promise<DeleteBookmarkResponseSchemaType>;
  investigation(
    investigation: PersistInvestigationInputSchemaType,
  ): Promise<InvestigationSaveResponseType>;
}

export class PrivateUserWritesHandler implements IPrivateUserWritesHandler {
  constructor(
    private readonly http: Pick<IHttpClient, "request">,
    private readonly routes: PrivateApiContract,
  ) {}

  public async bookmark(
    article_id: number,
  ): Promise<BookmarkResponseSchemaType> {
    const route = this.routes.bookmarks.post;

    return await this.http.request(route, { body: { article_id } });
  }

  public async investigation(
    investigation: PersistInvestigationInputSchemaType,
  ): Promise<InvestigationSaveResponseType> {
    const route = this.routes.investigations.post;

    return await this.http.request(route, { body: investigation });
  }

  public async unBookmark(
    article_id: ArticleSchemaType["id"],
  ): Promise<DeleteBookmarkResponseSchemaType> {
    const route = this.routes.bookmarks.delete;

    return await this.http.request(route, {
      params: { articleId: String(article_id) },
    });
  }
}
