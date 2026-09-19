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

export type ChangePasswordResult =
  | {
      ok: false;
      message: string;
    }
  | {
      ok: true;
      user: User;
    };

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

export type PasswordResetResult =
  | { ok: true; data: Record<string, never> }
  | { ok: false; error: AuthError };

export type AccountDeletionResult =
  | { ok: true }
  | { ok: false; message: string; statusCode: number; details?: unknown };

export interface IUserWriteHandler {
  deleteAccount(
    user_id: AuthenticatedUserId,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult>;
  requestPasswordReset(email: string): Promise<PasswordResetResult>;
  createUser(credentials: {
    email: string;
    password: string;
  }): CreateUserResult;
  resetPassword(credentials: {
    email: string;
    password: string;
  }): Promise<ResetPasswordResponseSchemaType>;
}

export class UserWriteHandler implements IUserWriteHandler {
  constructor(private readonly validator: UserDataValidator) {}

  public async deleteAccount(
    user_id: AuthenticatedUserId,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult> {
    return await this.executeDeleteAccount(user_id, credentials);
  }

  private async executeDeleteAccount(
    user_id: AuthenticatedUserId,
    credentials: LoginSchema,
  ): Promise<AccountDeletionResult> {
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
        statusCode:
          error.code === "invalid_credentials" ? 401 : (error.status ?? 503),
        details: error.message,
      };
    }

    if (!data.user || data.user.id !== user_id) {
      return {
        ok: false,
        message: "Credentials do not match the authenticated account",
        statusCode: 403,
      };
    }

    // Never sign in on this client: deletion must retain the server credentials.
    const adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { error: deletionError } =
      await adminClient.auth.admin.deleteUser(user_id);

    if (deletionError) {
      return {
        ok: false,
        message: "Failed to delete user account",
        statusCode: deletionError.status ?? 500,
        details: deletionError.message,
      };
    }

    return { ok: true };
  }

  public async requestPasswordReset(
    email: string,
  ): Promise<PasswordResetResult> {
    return await this.executeRequestPasswordReset(email);
  }

  private async executeRequestPasswordReset(
    email: string,
  ): Promise<PasswordResetResult> {
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
      return { ok: false, error };
    }

    return { ok: true, data };
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
  }): CreateUserResult {
    return this.executeCreateUser(credentials);
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

    const { user } = data;

    if (user) {
      return {
        ok: false,
        message: "Failed to change password",
      };
    }

    return this.validator.validateChangedPasswordResponse({
      ok: true,
      user,
    });
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
