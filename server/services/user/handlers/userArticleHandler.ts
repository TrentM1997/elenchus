import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { IAuthorization } from "../../auth/authorization.ts";
import {
  IUserArticlesSelectHandler,
  UserArticlesSelectHandler,
} from "./userArticlesSelectHandler.ts";
import {
  IUserArticlesWriteHandler,
  UserArticlesWriteHandler,
} from "./userArticlesWriteHandler.ts";

export interface IUserArticleHandler {
  readonly select: IUserArticlesSelectHandler;
  readonly write: IUserArticlesWriteHandler;
}

export class UserArticleHandler implements IUserArticleHandler {
  public readonly select: IUserArticlesSelectHandler;
  public readonly write: IUserArticlesWriteHandler;
  constructor(
    private readonly db: Pick<IDbClient, "articles" | "bookmarks">,
    private readonly policy: IAuthorization,
  ) {
    this.write = new UserArticlesWriteHandler(this.db, this.policy);
    this.select = new UserArticlesSelectHandler(this.db, this.policy);
  }
}
