import { createSupabaseFromRequest } from "../../endpoints/supabase/client/serverClient";
import { ServerError } from "../../core/errors/ServerError";
import { ClientError } from "../../core/errors/ClientError";
async function executePasswordUpdate(req, body) {
    const { email, newPassword } = body;
    const supabase = createSupabaseFromRequest(req);
    const listed = await supabase.auth.admin.listUsers();
    if (listed.error) {
        throw new ServerError("Failed to list users during password update");
    }
    const user = listed?.data?.users.find((user) => user.email === email);
    if (!user) {
        throw new ClientError("Couldn't find an account associated with submitted email address");
    }
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, { password: newPassword });
    if (error) {
        throw new ServerError("Failed to update user password");
    }
    return data.user;
}
;
export { executePasswordUpdate };
//# sourceMappingURL=updateUserPassword.js.map