import type { Request } from "express";
import { SupabaseClient, Session } from "@supabase/supabase-js";
import { Database } from "../../../types/databaseInterfaces";
import { IAuthenticationParser } from "./authenticationParser";

export interface ISessionRecoveryHandler {
  restoreSession(req: Request): Promise<Session | null>;
}

export class SessionRecoveryHandler implements ISessionRecoveryHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly parser: IAuthenticationParser,
  ) {}

  public async restoreSession(req: Request): Promise<Session | null> {
    return await this.restoreRequestSession(req);
  }

  private async restoreRequestSession(req: Request): Promise<Session | null> {
    const accToken = req.cookies?.["sb-access-token"];
    const refreshToken = req.cookies?.["sb-refresh-token"];

    if (typeof refreshToken !== "string" || refreshToken.length === 0) {
      return null;
    }

    const validRefreshToken = this.parser.validateToken(refreshToken);
    const accessToken =
      accToken === undefined || accToken === ""
        ? undefined
        : this.parser.validateToken(accToken);

    const { data, error } = await this.initSession(
      validRefreshToken,
      accessToken,
    );

    if (error) {
      throw error;
    }

    return data.session;
  }

  private async initSession(refreshToken: string, accessToken?: string) {
    if (accessToken) {
      return await this.db.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } else {
      return await this.db.auth.refreshSession({
        refresh_token: refreshToken,
      });
    }
  }
}
