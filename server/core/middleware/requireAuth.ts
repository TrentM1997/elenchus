import type { RequestHandler } from "express";
import { ClientError } from "../errors/ClientError.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.user?.userId) {
    next(new ClientError("Authentication required", null, 401));
    return;
  }

  next();
};
