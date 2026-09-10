import {
  ArticleSchema,
  ArticleSchemaType,
} from "../../../../schemas/ArticleSchema";
import { validateServerOrThrow } from "../../../../core/validation/validateOrThrow";
import { UserSchema, UserSchemaType } from "../../../../schemas/Users";
import {
  SupabaseSessionSchema,
  SupabaseSessionSchemaType,
} from "../../../../schemas/SessionSchema";

export class UserDataValidator {
  public validateArticles(articles: unknown[]): ArticleSchemaType[] {
    return articles.map((art) => validateServerOrThrow(ArticleSchema, art));
  }

  public validateNewUserResponse(
    user: unknown,
    session: unknown,
  ): { user: UserSchemaType; session: SupabaseSessionSchemaType } {
    const validUser = validateServerOrThrow(UserSchema, user);
    const validSession = validateServerOrThrow(SupabaseSessionSchema, session);

    return {
      user: validUser,
      session: validSession,
    };
  }
}
