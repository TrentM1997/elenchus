import { IDbClient } from "../../db/access/client/dbClient";
import { ArticleService, IArticleService } from "../articles/articleService";
import { IAuthorization } from "../auth/authorization";
import { IUserService, UserService } from "../user/userService";
import { getEnvVar } from "../../src/Config";
import {
  FirecrawlService,
  IFirecrawlService,
} from "../firecrawl/firecrawlService";
import { firecrawlClient } from "../firecrawl/client/firecrawlClient";
import {
  INewsAPIService,
  NewsAPIService,
} from "../../integrations/newsApiHandler";
const NEWS_API_KEY = getEnvVar("NEWS_API_KEY");

export interface IDomains {
  readonly user: IUserService;
  readonly articles: IArticleService;
}

export class Domains implements IDomains {
  private readonly firecrawl: IFirecrawlService;
  private readonly search: INewsAPIService;
  public readonly user: IUserService;
  public readonly articles: IArticleService;
  constructor(
    private readonly db: IDbClient,
    private readonly authorization: IAuthorization,
  ) {
    this.firecrawl = new FirecrawlService(firecrawlClient);
    this.search = new NewsAPIService(NEWS_API_KEY);
    this.user = new UserService(this.db, this.authorization);
    this.articles = new ArticleService(
      this.db,
      this.authorization,
      this.firecrawl,
      this.search,
    );
  }
}
