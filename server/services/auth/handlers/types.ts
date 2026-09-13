export type LogOutResult = { ok: false; message: string } | { ok: true };

export type AuthenticateUserResult =
  | { status: "anonymous" }
  | { status: "authenticated"; user_id: string };
