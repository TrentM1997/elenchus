import { createSupabaseFromRequest } from "../../endpoints/supabase/client/serverClient";
import { Request } from "express";
import { ChangePasswordRequestBody } from "../../schemas/Users";
import type { User } from "@supabase/supabase-js";
import { ServerError } from "../../core/errors/ServerError";
import { ClientError } from "../../core/errors/ClientError";

async function executePasswordUpdate(req: Request, body: ChangePasswordRequestBody) {
    const { email, newPassword } = body;
    const supabase = createSupabaseFromRequest(req);
    const listed = await supabase.auth.admin.listUsers();

    if (listed.error) {
        throw new ServerError("Failed to list users during password update");
    }

    const user: User | undefined = listed?.data?.users.find((user) => user.email === email);

    if (!user) {
        throw new ClientError("Couldn't find an account associated with submitted email address");
    }

    const { data, error } = await supabase.auth.admin.updateUserById(user.id, { password: newPassword });

    if (error) {
        throw new ServerError("Failed to update user password");
    }

    return data.user;

};


export { executePasswordUpdate };