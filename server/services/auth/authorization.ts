import { validateOrThrow } from "../../core/validation/validateOrThrow";
import { AuthenticatedRequestSchema } from "../../schemas/AuthenticatedRequestSchema";

declare const authenticatedUser: unique symbol;

export type AuthenticatedUserId = string & {
  readonly [authenticatedUser]: true;
};

export interface IAuthorization {
  requireAuthenticated(user_id: string | undefined | null): AuthenticatedUserId;
}

export class Authorization implements IAuthorization {
  public requireAuthenticated(
    user_id: string | undefined | null,
  ): AuthenticatedUserId {
    return validateOrThrow(
      AuthenticatedRequestSchema,
      user_id,
    ) as AuthenticatedUserId;
  }
}
