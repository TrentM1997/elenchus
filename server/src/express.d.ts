import type { ISessionHandler } from "../services/auth/handlers/sessionHandler.js";

interface AuthenticatedUser {
  userId?: string;
}

declare global {
  namespace Express {
    interface Request {
      auth: ISessionHandler;
      user: AuthenticatedUser;
    }
  }
}
