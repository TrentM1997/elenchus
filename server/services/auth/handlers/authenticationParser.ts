import { Request } from "express";
import { validateOrThrow } from "../../../core/validation/validateOrThrow.js";
import { LoginSchema } from "../../../schemas/LoginSchema.js";
import { TokenSchema, TokenSchemaType } from "@elenchus/contracts/schemas/auth/SupabaseSchemas";

export interface IAuthenticationParser {
  parseRequestForToken(req: Request): string;
  parseCredentials(req: Request): LoginSchema;
  validateToken(token: unknown): TokenSchemaType;
}

export class AuthenticationParser implements IAuthenticationParser {
  parseCredentials(req: Request): LoginSchema {
    const body = req.body;
    return validateOrThrow(LoginSchema, body);
  }

  parseRequestForToken(req: Request): string {
    const { cookies } = req;
    const cookie = cookies["sb-access-token"];
    const validated = this.validateToken(cookie);
    return validated;
  }

  public validateToken(token: unknown): TokenSchemaType {
    return validateOrThrow(TokenSchema, token);
  }
}
