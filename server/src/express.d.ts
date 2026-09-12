import type { ISessionHandler } from "../services/auth/handlers/sessionHandler";

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
