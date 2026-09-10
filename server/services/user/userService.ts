import { Request } from "express";
import { IDbClient } from "../../db/access/client/dbClient";
import { IAuthorization } from "../auth/authorization";
import { ArticleSchemaType } from "../../schemas/ArticleSchema";
import { LoginSchema } from "../../schemas/LoginSchema";
import { CreateUserResult } from "../../db/access/repositories/user/userWriteHandler";

export interface IUserService {
  savedArticles(
    user_id: string | null | undefined,
  ): Promise<ArticleSchemaType[]>;
  signUp(credentials: LoginSchema): CreateUserResult;
}

export class UserService implements IUserService {
  constructor(
    private readonly db: IDbClient,
    private readonly policy: IAuthorization,
  ) {}

  public async signUp(credentials: LoginSchema): CreateUserResult {
    return await this.db.user.write.createUser(credentials);
  }

  public async savedArticles(
    user_id: string | null | undefined,
  ): Promise<ArticleSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.user.select.savedArticles(userId);
  }
}
