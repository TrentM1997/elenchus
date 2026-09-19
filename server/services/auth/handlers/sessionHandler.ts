import type { Response, Request } from "express";
import type {
  AuthError,
  AuthTokenResponsePassword,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
import { isAuthError } from "@supabase/supabase-js";
import type { Database } from "../../../types/databaseInterfaces.js";
import {
  AuthenticationParser,
  IAuthenticationParser,
} from "./authenticationParser.js";
import { ServerError } from "../../../core/errors/ServerError.js";
import {
  ISessionRecoveryHandler,
  SessionRecoveryHandler,
} from "./sessionRecoveryHandler.js";
import { CookieHandler, ICookieHandler } from "./cookieHandler.js";
import type { LogOutResult, AuthenticateUserResult } from "./types.js";

export interface ISessionHandler {
  recoverSession(
    req: Request,
    res: Response,
  ): Promise<{ status: "anonymous" } | { status: "authenticated" }>;
  login(req: Request, res: Response): Promise<AuthTokenResponsePassword>;
  establishSession(
    session: Pick<Session, "access_token" | "refresh_token">,
    res: Response,
  ): void;
  logOut(req: Request, res: Response): Promise<LogOutResult>;
  clearSessionCookies(res: Response): void;
  authenticateRequest(req: Request): Promise<AuthenticateUserResult>;
}

export class SessionHandler implements ISessionHandler {
  private readonly parser: IAuthenticationParser;
  private readonly recovery: ISessionRecoveryHandler;
  private readonly tokens: ICookieHandler;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new AuthenticationParser();
    this.tokens = new CookieHandler();
    this.recovery = new SessionRecoveryHandler(this.db, this.parser);
  }

  public async authenticateRequest(
    req: Request,
  ): Promise<AuthenticateUserResult> {
    return await this.executeAuthenticateRequest(req);
  }

  public async recoverSession(
    req: Request,
    res: Response,
  ): Promise<{ status: "anonymous" } | { status: "authenticated" }> {
    return await this.executeRecoverSession(req, res);
  }

  private async executeRecoverSession(
    req: Request,
    res: Response,
  ): Promise<{ status: "anonymous" } | { status: "authenticated" }> {
    try {
      const session = await this.recovery.restoreSession(req);

      if (!session) {
        return { status: "anonymous" };
      }

      this.tokens.setAuthCookies(session, res);
      return { status: "authenticated" };
    } catch (error) {
      if (isAuthError(error)) {
        if (this.isSessionCredentialError(error)) {
          this.tokens.removeAuthCookie(res, "sb-access-token");
          this.tokens.removeAuthCookie(res, "sb-refresh-token");

          return { status: "anonymous" };
        }

        throw new ServerError("Unable to recover session", 503, {
          code: error.code,
          status: error.status,
          message: error.message,
        });
      }

      throw error;
    }
  }

  public async login(
    req: Request,
    res: Response,
  ): Promise<AuthTokenResponsePassword> {
    return await this.executeLogin(req, res);
  }

  public async logOut(req: Request, res: Response): Promise<LogOutResult> {
    return await this.executeLogOut(req, res);
  }

  private async executeAuthenticateRequest(
    req: Request,
  ): Promise<AuthenticateUserResult> {
    const accessToken = req.cookies?.["sb-access-token"];

    if (typeof accessToken !== "string" || accessToken.length === 0) {
      return { status: "anonymous" };
    }

    const { data, error } = await this.db.auth.getUser(accessToken);

    if (error) {
      if (this.isCredentialError(error)) {
        return { status: "anonymous" };
      }

      throw new ServerError("Unable to verify authentication", 503, {
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }

    if (!data.user) {
      return {
        status: "anonymous",
      };
    }

    const {
      user: { id },
    } = data;

    return {
      status: "authenticated",
      user_id: id,
    };
  }

  private async executeLogOut(
    req: Request,
    res: Response,
  ): Promise<LogOutResult> {
    try {
      const session = await this.recovery.restoreSession(req);

      if (!session) {
        return { ok: true };
      }

      const { error } = await this.db.auth.signOut({
        scope: "local",
      });

      return error ? { ok: false, message: error.message } : { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Logout failed",
      };
    } finally {
      this.tokens.removeAuthCookie(res, "sb-access-token");
      this.tokens.removeAuthCookie(res, "sb-refresh-token");
    }
  }

  public establishSession(
    session: Pick<Session, "access_token" | "refresh_token">,
    res: Response,
  ): void {
    this.tokens.setAuthCookies(session, res);
  }

  public clearSessionCookies(res: Response): void {
    this.tokens.removeAuthCookie(res, "sb-access-token");
    this.tokens.removeAuthCookie(res, "sb-refresh-token");
  }

  private async executeLogin(req: Request, res: Response) {
    const { email, password } = this.parser.parseCredentials(req);
    const result = await this.db.auth.signInWithPassword({ email, password });

    if (result.data.session) {
      this.createUserObject(req, result.data.user.id);
      this.tokens.setAuthCookies(result.data.session, res);
    }
    return result;
  }

  private createUserObject(req: Request, userId: string): void {
    req.user = { userId: userId };
  }

  private isCredentialError(error: AuthError): boolean {
    switch (error.code) {
      case "bad_jwt":
      case "session_not_found":
      case "user_not_found":
        return true;
      default:
        return false;
    }
  }

  private isSessionCredentialError(error: AuthError): boolean {
    switch (error.code) {
      case "bad_jwt":
      case "user_not_found":
      case "session_not_found":
      case "session_expired":
      case "refresh_token_not_found":
      case "refresh_token_already_used":
        return true;
      default:
        return false;
    }
  }
}
