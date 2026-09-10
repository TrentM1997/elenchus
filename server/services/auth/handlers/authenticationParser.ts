import { Request } from "express";
import {
  CookieSchema,
  type CookieSchemaType,
} from "../../../schemas/cookieSchema";
import { validateOrThrow } from "../../../core/validation/validateOrThrow";
import { LoginSchema } from "../../../schemas/LoginSchema";

export interface IAuthenticationParser {
  parseRequestForToken(req: Request): string;
  parseCredentials(req: Request): LoginSchema;
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
    return validated["sb-access-token"];
  }

  private validateToken(token: unknown): CookieSchemaType {
    return validateOrThrow(CookieSchema, token);
  }
}
