import { PrivateServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  BookmarkedArticlesResponseSchema,
  BookmarkedArticlesResponseSchemaType,
} from "@/lib/schemas/articles/BookmarkSchema";
import {
  InvestigationsSavedReponseSchema,
  InvestigationsSavedReponseSchemaType,
} from "@/lib/schemas/investigations/InvestigationSchema";
import { IHttpClient } from "@/lib/services/client/http/types";

export interface IPrivateUserSelectHandler {
  bookmarks(): Promise<BookmarkedArticlesResponseSchemaType>;
  investigations(): Promise<InvestigationsSavedReponseSchemaType>;
}

export class PrivateUserSelectHandler implements IPrivateUserSelectHandler {
  constructor(
    private readonly http: IHttpClient,
    private readonly routes: Pick<
      PrivateServerClientRoutes,
      "bookmarks" | "investigations"
    >,
  ) {}

  public async bookmarks(): Promise<BookmarkedArticlesResponseSchemaType> {
    return await this.http.get(
      this.routes.bookmarks.get,
      BookmarkedArticlesResponseSchema,
    );
  }

  public async investigations(): Promise<InvestigationsSavedReponseSchemaType> {
    return await this.http.get(
      this.routes.investigations,
      InvestigationsSavedReponseSchema,
    );
  }
}
