import { validateOrThrow } from "../../core/validation/validateOrThrow.js";
import { AuthenticatedUserIdSchema } from "@elenchus/contracts/schemas/auth/AuthenticatedUserIdSchema";
import { AuthenticatedUserId } from "./handlers/sessionHandler.ts";

export interface IAuthorization {
  requireAuthenticated(user_id: string | undefined | null): AuthenticatedUserId;
}

export class Authorization implements IAuthorization {
  public requireAuthenticated(
    user_id: string | undefined | null,
  ): AuthenticatedUserId {
    return validateOrThrow(
      AuthenticatedUserIdSchema,
      user_id,
    ) as AuthenticatedUserId;
  }
}
