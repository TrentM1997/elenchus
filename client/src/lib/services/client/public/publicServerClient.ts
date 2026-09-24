import type { PublicApiContract } from "@elenchus/contracts";
import { IHttpClient } from "@/lib/services/client/http/types";
import { AuthRouteHandler, IAuthRouteHandler } from "./handlers/AuthHandler";
import {
  IUserRouteHandler,
  UserRouteHandler,
} from "./handlers/UserRouteHandler";
import {
  IThirdPartyRouteHandler,
  ThirdPartyRouteHandler,
} from "./handlers/ThirdPartyRouteHandler";
import {
  ExtractArticlesRouteHandler,
  IExtractArticlesRouteHandler,
} from "./handlers/ExtractArticlesRouteHandler";

export interface IPublicServerClient {
  readonly auth: IAuthRouteHandler;
  readonly user: IUserRouteHandler;
  readonly integrations: IThirdPartyRouteHandler;
  readonly extraction: IExtractArticlesRouteHandler;
}

export class PublicServerClient implements IPublicServerClient {
  public readonly auth: IAuthRouteHandler;
  public readonly user: IUserRouteHandler;
  public readonly integrations: IThirdPartyRouteHandler;
  public readonly extraction: IExtractArticlesRouteHandler;
  constructor(
    private readonly routes: PublicApiContract,
    private readonly http: IHttpClient,
  ) {
    this.auth = new AuthRouteHandler(this.routes, this.http);
    this.user = new UserRouteHandler(this.routes, this.http);
    this.integrations = new ThirdPartyRouteHandler(this.routes, this.http);
    this.extraction = new ExtractArticlesRouteHandler(this.routes, this.http);
  }
}
