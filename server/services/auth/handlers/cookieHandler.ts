import type { Response } from "express";
import type { Session } from "@supabase/supabase-js";

export interface ICookieHandler {
  removeAuthCookie(
    res: Response,
    tokenName: "sb-access-token" | "sb-refresh-token",
  ): void;
  setAuthCookies(
    session: Pick<Session, "access_token" | "refresh_token">,
    res: Response,
  ): void;
}

export class CookieHandler implements ICookieHandler {
  removeAuthCookie(
    res: Response,
    tokenName: "sb-access-token" | "sb-refresh-token",
  ): void {
    res.clearCookie(tokenName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    });
  }

  setAuthCookies(
    session: Pick<Session, "access_token" | "refresh_token">,
    res: Response,
  ): void {
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
