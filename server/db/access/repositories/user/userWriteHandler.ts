import { AuthError, createClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces";
import { CreatedUserSchemaType } from "../../../../schemas/Users";
import { SupabaseSessionSchemaType } from "../../../../schemas/SessionSchema";
import { UserDataValidator } from "./userDataValidator";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "../../../../src/Config";

export type CreateUserResult = Promise<
  | {
      ok: false;
      error: AuthError;
    }
  | {
      ok: true;
      data: { user: CreatedUserSchemaType; session: SupabaseSessionSchemaType };
    }
>;

export interface IUserWriteHandler {
  createUser(credentials: {
    email: string;
    password: string;
  }): CreateUserResult;
}

export class UserWriteHandler implements IUserWriteHandler {
  constructor(private readonly validator: UserDataValidator) {}

  public async createUser(credentials: {
    email: string;
    password: string;
  }): CreateUserResult {
    return this.executeCreateUser(credentials);
  }

  private async executeCreateUser(credentials: {
    email: string;
    password: string;
  }): CreateUserResult {
    const signupClient = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLIC_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    const { data, error } = await signupClient.auth.signUp(credentials);

    if (error) {
      return { ok: false, error };
    }

    const validated = this.validator.validateNewUserResponse(
      data.user,
      data.session,
    );

    return {
      ok: true,
      data: { user: validated.user, session: validated.session },
    };
  }
}
