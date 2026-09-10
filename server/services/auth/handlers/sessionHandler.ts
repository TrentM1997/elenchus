import type { Response, Request } from "express";
import type {
  AuthTokenResponsePassword,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "../../../types/databaseInterfaces";
import {
  AuthenticationParser,
  IAuthenticationParser,
} from "./authenticationParser";

export interface ISessionHandler {
  recoverSession(res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<AuthTokenResponsePassword>;
  establishSession(
    session: Pick<Session, "access_token" | "refresh_token">,
    res: Response,
  ): void;
}

export class SessionHandler implements ISessionHandler {
  private readonly parser: IAuthenticationParser;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new AuthenticationParser();
  }

  public async recoverSession(res: Response): Promise<void> {
    return await this.executeRecoverSession(res);
  }

  public async login(
    req: Request,
    res: Response,
  ): Promise<AuthTokenResponsePassword> {
    return await this.executeLogin(req, res);
  }

  public establishSession(
    session: Pick<Session, "access_token" | "refresh_token">,
    res: Response,
  ): void {
    this.setAuthCookies(session, res);
  }

  private async executeRecoverSession(res: Response): Promise<void> {
    const session = await this.detectSession();
    if (session) {
      return this.setAuthCookies(session, res);
    }
  }

  private async executeLogin(req: Request, res: Response) {
    const { email, password } = this.parser.parseCredentials(req);
    const result = await this.db.auth.signInWithPassword({ email, password });

    if (result.data.session) {
      this.setAuthCookies(result.data.session, res);
    }
    return result;
  }

  private async detectSession(): Promise<Session | null> {
    const detected = await this.db.auth.getSession();
    const { session } = detected.data;
    return session;
  }

  private setAuthCookies(
    session: Pick<Session, "access_token" | "refresh_token">,
    res: Response,
  ) {
    const { access_token, refresh_token } = session;
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("sb-access-token", access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("sb-refresh-token", refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
