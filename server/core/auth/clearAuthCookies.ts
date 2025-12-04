import { Response } from "express";

async function clearAuthCookies(res: Response) {

    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');
};

export { clearAuthCookies };