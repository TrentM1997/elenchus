import { AuthError, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces";
import { CreatedUserSchemaType } from "../../../../schemas/Users";
import { SupabaseSessionSchemaType } from "../../../../schemas/SessionSchema";
import { UserDataValidator } from "./userDataValidator";

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
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly validator: UserDataValidator,
  ) {}

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
    const { data, error } = await this.db.auth.signUp(credentials);
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
