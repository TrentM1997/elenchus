import { Request } from "express";
import { validateOrThrow } from "../../../core/validation/validateOrThrow.js";
import {
  LoginCredentialsSchema,
  type LoginCredentialsSchemaType,
} from "@elenchus/contracts/schemas/auth/AuthSchemas";
import {
  TokenSchema,
  TokenSchemaType,
} from "@elenchus/contracts/schemas/auth/SupabaseSchemas";
import { AuthenticatedUserId } from "./sessionHandler.ts";
import { AuthenticatedUserIdSchema } from "@elenchus/contracts/schemas/auth/AuthenticatedUserIdSchema";

export interface IAuthenticationParser {
  parseRequestForToken(req: Request): string;
  parseCredentials(req: Request): LoginCredentialsSchemaType;
  validateToken(token: unknown): TokenSchemaType;
  validateUserId(id: unknown): AuthenticatedUserId;
}

export class AuthenticationParser implements IAuthenticationParser {
  parseCredentials(req: Request): LoginCredentialsSchemaType {
    const body = req.body;
    return validateOrThrow(LoginCredentialsSchema, body);
  }

  parseRequestForToken(req: Request): string {
    const { cookies } = req;
    const cookie = cookies["sb-access-token"];
    const validated = this.validateToken(cookie);
    return validated;
  }

  public validateUserId(id: unknown): AuthenticatedUserId {
    return validateOrThrow(
      AuthenticatedUserIdSchema,
      id,
    ) as AuthenticatedUserId;
  }

  public validateToken(token: unknown): TokenSchemaType {
    return validateOrThrow(TokenSchema, token);
  }
}
