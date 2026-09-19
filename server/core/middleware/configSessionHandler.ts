import type { NextFunction, Request, Response } from "express";
import { SessionHandler } from "../../services/auth/handlers/sessionHandler.js";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from "../../src/Config.js";
import { Database } from "../../types/databaseInterfaces.js";

export function configSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  req.auth = new SessionHandler(authClient);
  next();
}
