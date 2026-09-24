import {
  ArticleSchemaType,
  GetArticleResponseSchemaType,
} from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { BookmarkedArticlesResponseSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import {
  InvestigationSaveResponseType,
  InvestigationSchemaType,
  InvestigationsSavedReponseSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { IHttpClient } from "@/lib/services/client/http/types";
import { PrivateApiContract } from "@elenchus/contracts";

export interface IPrivateUserSelectHandler {
  readonly investigations: IInvestigationSelectHander;
  readonly bookmarks: IBookmarkSelectHandler;
}

export class PrivateUserSelectHandler implements IPrivateUserSelectHandler {
  public readonly investigations: IInvestigationSelectHander;
  public readonly bookmarks: IBookmarkSelectHandler;
  constructor(
    private readonly http: Pick<IHttpClient, "request">,
    private readonly routes: Pick<
      PrivateApiContract,
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
    private readonly http: Pick<IHttpClient, "request">,
    private readonly routes: Pick<PrivateApiContract, "investigations">,
  ) {}

  public async all(): Promise<InvestigationsSavedReponseSchemaType> {
    const route = this.routes.investigations.get.all;

    return await this.http.request(route, {});
  }

  public async byId(
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationSaveResponseType> {
    const route = this.routes.investigations.get.single;

    return await this.http.request(route, {
      params: { investigationId: `${investigation_id}` },
    });
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
    private readonly http: Pick<IHttpClient, "request">,
    private readonly routes: Pick<PrivateApiContract, "bookmarks">,
  ) {}

  public async all(): Promise<BookmarkedArticlesResponseSchemaType> {
    const route = this.routes.bookmarks.get.all;

    return await this.http.request(route, {});
  }

  public async byId(
    article_id: ArticleSchemaType["id"],
  ): Promise<GetArticleResponseSchemaType> {
    const route = this.routes.bookmarks.get.single;

    return await this.http.request(route, {
      params: { articleId: String(article_id) },
    });
  }
}
