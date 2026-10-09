import type { ISessionHandler } from "../services/auth/handlers/sessionHandler.js";
import type { AuthenticatedUserId } from "../services/auth/authorization.ts";

interface AuthenticatedUser {
  userId?: AuthenticatedUserId;
}

declare global {
  namespace Express {
    interface Request {
      auth: ISessionHandler;
      user: AuthenticatedUser;
    }
  }
}
