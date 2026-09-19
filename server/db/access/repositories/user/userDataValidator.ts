import {
  ArticleSchema,
  ArticleSchemaType,
} from "../../../../schemas/ArticleSchema.js";
import { validateServerOrThrow } from "../../../../core/validation/validateOrThrow.js";
import { UserSchema, UserSchemaType } from "../../../../schemas/Users.js";
import {
  SupabaseSessionSchema,
  SupabaseSessionSchemaType,
} from "../../../../schemas/SessionSchema.js";
import {
  ResetPasswordResponseSchema,
  ResetPasswordResponseSchemaType,
} from "../../../../schemas/ChangePasswordSchema.ts";

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
