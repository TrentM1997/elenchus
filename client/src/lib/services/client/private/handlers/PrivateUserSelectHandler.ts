import { PrivateServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  ArticleSchemaType,
  GetArticleResponseSchema,
  GetArticleResponseSchemaType,
} from "@/lib/schemas/articles/ArticleSchema";
import {
  BookmarkedArticlesResponseSchema,
  BookmarkedArticlesResponseSchemaType,
} from "@/lib/schemas/articles/BookmarkSchema";
import {
  InvestigationSaveResponse,
  InvestigationSaveResponseType,
  InvestigationSchemaType,
  InvestigationsSavedReponseSchema,
  InvestigationsSavedReponseSchemaType,
} from "@/lib/schemas/investigations/InvestigationSchema";
import { IHttpClient } from "@/lib/services/client/http/types";

export interface IPrivateUserSelectHandler {
  readonly investigations: IInvestigationSelectHander;
  readonly bookmarks: IBookmarkSelectHandler;
}

export class PrivateUserSelectHandler implements IPrivateUserSelectHandler {
  public readonly investigations: IInvestigationSelectHander;
  public readonly bookmarks: IBookmarkSelectHandler;
  constructor(
    private readonly http: IHttpClient,
    private readonly routes: Pick<
      PrivateServerClientRoutes,
      "bookmarks" | "investigations"
    >,
  ) {
    this.bookmarks = new BookmarkSelectHandler(this.http, this.routes);
    this.investigations = new InvestigationSelectHander(this.http, this.routes);
  }
}

interface IInvestigationSelectHander {
  all(): Promise<InvestigationsSavedReponseSchemaType>;
  byId(
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationSaveResponseType>;
}

class InvestigationSelectHander implements IInvestigationSelectHander {
  constructor(
    private readonly http: IHttpClient,
    private readonly routes: Pick<PrivateServerClientRoutes, "investigations">,
  ) {}

  public async all(): Promise<InvestigationsSavedReponseSchemaType> {
    return await this.http.get(
      this.routes.investigations.get.all,
      InvestigationsSavedReponseSchema,
    );
  }

  public async byId(
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationSaveResponseType> {
    return await this.http.get(
      `${this.routes.investigations.get.single}${investigation_id}`,
      InvestigationSaveResponse,
    );
  }
}

interface IBookmarkSelectHandler {
  all(): Promise<BookmarkedArticlesResponseSchemaType>;
  byId(
    article_id: ArticleSchemaType["id"],
  ): Promise<GetArticleResponseSchemaType>;
}

class BookmarkSelectHandler implements IBookmarkSelectHandler {
  constructor(
    private readonly http: Pick<IHttpClient, "get">,
    private readonly routes: Pick<PrivateServerClientRoutes, "bookmarks">,
  ) {}

  public async all(): Promise<BookmarkedArticlesResponseSchemaType> {
    return await this.http.get(
      this.routes.bookmarks.get.all,
      BookmarkedArticlesResponseSchema,
    );
  }

  public async byId(
    article_id: ArticleSchemaType["id"],
  ): Promise<GetArticleResponseSchemaType> {
    return await this.http.get(
      `${this.routes.bookmarks.get.single}${article_id}`,
      GetArticleResponseSchema,
    );
  }
}
