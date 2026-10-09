import { AuthenticatedUserId } from "../authorization.ts";

export type LogOutResult =
  | { ok: false; message: string }
  | { ok: true; data: "success" };

export type AuthenticateUserResult =
  | { status: "anonymous" }
  | { status: "authenticated"; user_id: AuthenticatedUserId };
