import {
  AuthError,
  createClient,
  User,
  UserAttributes,
} from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { CreatedUserSchemaType } from "../../../../schemas/Users.js";
import { SupabaseSessionSchemaType } from "../../../../schemas/SessionSchema.js";
import { UserDataValidator } from "./userDataValidator.js";
import {
  SUPABASE_KEY,
  SUPABASE_PUBLIC_KEY,
  SUPABASE_URL,
} from "../../../../src/Config.js";
import type { LoginSchema } from "../../../../schemas/LoginSchema.js";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";
import { ResetPasswordResponseSchemaType } from "../../../../schemas/ChangePasswordSchema.ts";
import type { DbResult } from "../../../types/types.ts";

type CreateUserSuccessPayload = {
  user: CreatedUserSchemaType;
  session: SupabaseSessionSchemaType;
};

export type CreateUserResult = DbResult<CreateUserSuccessPayload>;

export type RequestPasswordResetResult = DbResult<Record<string, never>>;

export type AccountDeletionResult = DbResult<User | null>;

export interface IUserWriteHandler {
  deleteAccount(
    user_id: AuthenticatedUserId,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult>;
  requestPasswordReset(email: string): Promise<RequestPasswordResetResult>;
  createUser(credentials: {
    email: string;
    password: string;
  }): Promise<CreateUserResult>;
  resetPassword(credentials: {
    email: string;
    password: string;
  }): Promise<ResetPasswordResponseSchemaType>;
}

export class UserWriteHandler implements IUserWriteHandler {
  constructor(private readonly validator: UserDataValidator) {}

  public async requestPasswordReset(
    email: string,
  ): Promise<RequestPasswordResetResult> {
    return await this.executeRequestPasswordReset(email);
  }

  public async resetPassword(credentials: {
    email: string;
    password: string;
  }): Promise<ResetPasswordResponseSchemaType> {
    return await this.executeChangePassword(credentials);
  }

  public async createUser(credentials: {
    email: string;
    password: string;
  }): Promise<CreateUserResult> {
    return this.executeCreateUser(credentials);
  }

  public async deleteAccount(
    user_id: AuthenticatedUserId,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult> {
    return await this.executeDeleteAccount(user_id, credentials);
  }

  private async executeDeleteAccount(
    user_id: AuthenticatedUserId,
    credentials: LoginSchema,
  ): Promise<DbResult<User | null>> {
    const verificationClient = createClient<Database>(
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

    const { data, error } =
      await verificationClient.auth.signInWithPassword(credentials);

    if (error) {
      return {
        ok: false,
        message: "Unable to verify credentials for account deletion",
        details: error.message,
      };
    }

    if (!data.user || data.user.id !== user_id) {
      return {
        ok: false,
        message: "Credentials do not match the authenticated account",
      };
    }

    const adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const {
      error: deletionError,
      data: { user },
    } = await adminClient.auth.admin.deleteUser(user_id);

    if (deletionError) {
      return {
        ok: false,
        message: "Failed to delete user account",
        details: deletionError.message,
      };
    }

    return { ok: true, data: user };
  }

  private async executeRequestPasswordReset(
    email: string,
  ): Promise<RequestPasswordResetResult> {
    const resetClient = createClient<Database>(
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

    const { data, error } = await resetClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: "https://elenchusapp.io/reset-password",
      },
    );

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, data };
  }

  private async executeChangePassword(credentials: {
    email: string;
    password: string;
  }): Promise<ResetPasswordResponseSchemaType> {
    const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data, error } = await client.auth.updateUser({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return this.validator.validateChangedPasswordResponse({
      ok: true,
      data: data.user,
    });
  }

  private async executeCreateUser(credentials: {
    email: string;
    password: string;
  }): Promise<CreateUserResult> {
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
      return { ok: false, message: error.message };
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
