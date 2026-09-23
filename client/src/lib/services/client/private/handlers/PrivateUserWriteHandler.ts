import { PrivateServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  BookmarkResponseSchema,
  BookmarkResponseSchemaType,
  DeleteBookmarkResponseSchema,
  DeleteBookmarkResponseSchemaType,
} from "@/lib/schemas/articles/BookmarkSchema";
import { IHttpClient } from "@/lib/services/client/http/types";
import {
  InvestigationSaveResponse,
  InvestigationSaveResponseType,
  PersistInvestigationInputSchemaType,
} from "@/lib/schemas/investigations/InvestigationSchema";

export interface IPrivateUserWritesHandler {
  bookmark(article_id: number): Promise<BookmarkResponseSchemaType>;
  unBookmark(article_id: string): Promise<DeleteBookmarkResponseSchemaType>;
  investigation(
    investigation: PersistInvestigationInputSchemaType,
  ): Promise<InvestigationSaveResponseType>;
}

export class PrivateUserWritesHandler implements IPrivateUserWritesHandler {
  constructor(
    private readonly http: IHttpClient,
    private readonly routes: Pick<
      PrivateServerClientRoutes,
      "bookmarks" | "investigations"
    >,
  ) {}

  public async bookmark(
    article_id: number,
  ): Promise<BookmarkResponseSchemaType> {
    return await this.http.post(
      this.routes.bookmarks.post,
      BookmarkResponseSchema,
      { article_id },
    );
  }

  public async investigation(
    investigation: PersistInvestigationInputSchemaType,
  ): Promise<InvestigationSaveResponseType> {
    return await this.http.post(
      this.routes.investigations.post,
      InvestigationSaveResponse,
      investigation,
    );
  }

  public async unBookmark(
    article_id: string,
  ): Promise<DeleteBookmarkResponseSchemaType> {
    return await this.http.delete(
      `${this.routes.bookmarks.delete}${article_id}`,
      DeleteBookmarkResponseSchema,
    );
  }
}
