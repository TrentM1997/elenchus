import type { NextFunction, Request, Response } from "express";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await req.auth.authenticateRequest(req);

    if (result.status === "authenticated") {
      req.user = { userId: result.user_id };
    }

    next();
  } catch (error) {
    next(error);
  }
}
