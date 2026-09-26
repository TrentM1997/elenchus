import { IDbClient } from "../../db/access/client/dbClient.js";
import { ArticleService, IArticleService } from "../articles/articleService.js";
import { IAuthorization } from "../auth/authorization.js";
import { IUserService, UserService } from "../user/userService.js";
import {
  FirecrawlService,
  IFirecrawlService,
} from "../firecrawl/firecrawlService.js";
import { firecrawlClient } from "../firecrawl/client/firecrawlClient.js";
import { InvestionService } from "../investigations/InvestigationService.js";
import { IInvestigationService } from "../investigations/types.ts";

export interface IDomains {
  readonly user: IUserService;
  readonly articles: IArticleService;
  readonly investigations: IInvestigationService;
}

export class Domains implements IDomains {
  private readonly firecrawl: IFirecrawlService;
  public readonly user: IUserService;
  public readonly investigations: IInvestigationService;
  public readonly articles: IArticleService;
  constructor(
    private readonly db: IDbClient,
    private readonly authorization: IAuthorization,
  ) {
    this.firecrawl = new FirecrawlService(firecrawlClient);
    this.user = new UserService(this.db, this.authorization);
    this.articles = new ArticleService(this.db, this.firecrawl);
    this.investigations = new InvestionService(this.db, this.authorization);
  }
}
