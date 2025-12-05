import { clearAuthCookies } from "../../../../core/auth/clearAuthCookies.js";
export const signUserOut = async (req, res) => {
    try {
        await clearAuthCookies(res);
        res.success("Signed out successfully", null, 200);
    }
    catch (error) {
        console.error(error);
        res.serverError("Failed to sign out", null, 500);
    }
    ;
};
//# sourceMappingURL=signout.js.map