import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../src/Config";

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

export { db };
