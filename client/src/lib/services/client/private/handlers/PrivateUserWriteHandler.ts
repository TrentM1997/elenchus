import { PrivateServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  BookmarkResponseSchema,
  BookmarkResponseSchemaType,
} from "@/lib/schemas/BookmarkSchema";
import { IHttpClient } from "@/lib/services/client/http/httpClient";
import { InvestigationSchemaType } from "../../../../../../../schemas/api/types/InvestigationSchema";
import {
  InvestigationSaveResponse,
  InvestigationSaveResponseType,
} from "@/lib/schemas/InvestigationSchema";

export interface IPrivateUserWritesHandler {
  bookmark(article_id: number): Promise<BookmarkResponseSchemaType>;
  unBookmark(article_id: string): Promise<BookmarkResponseSchemaType>;
  investigation(
    investigation: InvestigationSchemaType,
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
      article_id,
    );
  }

  public async investigation(
    investigation: InvestigationSchemaType,
  ): Promise<InvestigationSaveResponseType> {
    return await this.http.post(
      this.routes.investigations,
      InvestigationSaveResponse,
      investigation,
    );
  }

  public async unBookmark(
    article_id: string,
  ): Promise<BookmarkResponseSchemaType> {
    return await this.http.delete(
      `${this.routes.bookmarks.delete}${article_id}`,
      BookmarkResponseSchema,
    );
  }
}
