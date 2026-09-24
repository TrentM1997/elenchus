import { ArticleSchema, ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { validateServerOrThrow } from "../../../../core/validation/validateOrThrow.js";
import { UserSchema, UserSchemaType } from "@elenchus/contracts/schemas/auth/UserSchema";
import { SupabaseSessionSchema, SupabaseSessionSchemaType } from "@elenchus/contracts/schemas/auth/SupabaseSchemas";
import { ResetPasswordResponseSchema, ResetPasswordResponseSchemaType } from "@elenchus/contracts/schemas/auth/ResetPasswordSchema";

export class UserDataValidator {
  public validateArticles(articles: unknown[]): ArticleSchemaType[] {
    return articles.map((art) => validateServerOrThrow(ArticleSchema, art));
  }

  public validateChangedPasswordResponse(
    result: unknown,
  ): ResetPasswordResponseSchemaType {
    return validateServerOrThrow(ResetPasswordResponseSchema, result);
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
