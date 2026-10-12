import type {
  AuthenticatedUserId,
  ISessionHandler,
} from "../services/auth/handlers/sessionHandler.js";

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
