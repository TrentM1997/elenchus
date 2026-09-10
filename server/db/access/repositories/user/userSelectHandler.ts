import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces";
import { ArticleSchemaType } from "../../../../schemas/ArticleSchema";
import { AuthenticatedUserId } from "../../../../services/auth/authorization";
import { UserReadHandler } from "./userReadHandler";
import { UserDataValidator } from "./userDataValidator";
import { ServerError } from "../../../../core/errors/ServerError";

export interface IUserSelectHandler {
  savedArticles(user_id: AuthenticatedUserId): Promise<ArticleSchemaType[]>;
}

export class UserSelectHandler implements IUserSelectHandler {
  private readonly read: UserReadHandler;
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly validator: UserDataValidator,
  ) {
    this.read = new UserReadHandler(this.db);
  }

  public async savedArticles(
    user_id: AuthenticatedUserId,
  ): Promise<ArticleSchemaType[]> {
    const raw = await this.read.articles(user_id);
    if (!raw) {
      throw new ServerError("Failed to retrieve users saved articles", 404);
    }
    return this.validator.validateArticles(raw);
  }
}
