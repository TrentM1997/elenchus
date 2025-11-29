import { getUserAndSupabase } from "../../endpoints/supabase/client/serverClient.js";
async function getUserContext(req, res) {
    const session = await getUserAndSupabase(req, res);
    if (!session)
        return null;
    const { supabase, user } = session;
    return {
        supabase: supabase ?? null,
        user: user ?? null,
        user_id: user.id ?? null,
    };
}
;
export { getUserContext };
//# sourceMappingURL=getUserContext.js.map