import { Response, Request } from "express";
import { clearAuthCookies } from "../../../../core/auth/clearAuthCookies.js";

export const signUserOut = async (req: Request, res: Response): Promise<void> => {
    try {
        await clearAuthCookies(res);
        res.success("Signed out successfully", null, 200);
    } catch (error) {
        console.error(error);
        res.serverError("Failed to sign out", null, 500);
    };
};