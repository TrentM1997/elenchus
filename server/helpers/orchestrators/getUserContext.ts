import { Request, Response } from "express";
import { getUserAndSupabase } from "../../endpoints/supabase/serverClient.js";
import { SupabaseClient, User } from "@supabase/supabase-js";

type GetUserContextReturn = { supabase: SupabaseClient, user: User, user_id: string | number };

async function getUserContext(req: Request, res: Response): Promise<GetUserContextReturn | null> {
    const session = await getUserAndSupabase(req, res);
    if (!session) return null;

    const { supabase, user } = session;

    return {
        supabase: supabase ?? null,
        user: user ?? null,
        user_id: user.id ?? null,
    };
};

export { getUserContext };