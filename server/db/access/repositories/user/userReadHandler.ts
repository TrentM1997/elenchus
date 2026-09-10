import { SupabaseClient } from "@supabase/supabase-js";
import { AuthenticatedUserId } from "../../../../services/auth/authorization";
import { Database } from "../../../../types/databaseInterfaces";

export class UserReadHandler {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async articles(user_id: AuthenticatedUserId) {
    const { data, error } = await this.db
      .from("articles")
      .select()
      .eq("user_id", user_id);

    return data;
  }
}
