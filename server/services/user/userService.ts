import { IDbClient } from "../../db/access/client/dbClient.js";
import { IAuthorization } from "../auth/authorization.js";
import {
  IUserArticleHandler,
  UserArticleHandler,
} from "./handlers/userArticleHandler.ts";
import {
  IUserAccountHandler,
  UserAccountHandler,
} from "./handlers/userAccountHandler.ts";

export interface IUserService {
  readonly articles: IUserArticleHandler;
  readonly account: IUserAccountHandler;
}

export class UserService implements IUserService {
  public readonly articles: IUserArticleHandler;
  public readonly account: IUserAccountHandler;
  constructor(
    private readonly db: Pick<
      IDbClient,
      "articles" | "bookmarks" | "user" | "feedback"
    >,
    private readonly policy: IAuthorization,
  ) {
    this.articles = new UserArticleHandler(this.db, this.policy);
    this.account = new UserAccountHandler(this.db, this.policy);
  }
}
