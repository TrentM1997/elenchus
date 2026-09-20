import { Type, Static } from "@sinclair/typebox";
import { CreatedUserSchema } from "./UserSchema";
import { SupabaseSessionSchema } from "./SupabaseSchemas";
import { PersistenceFailedResponseSchema } from "./PersistenceFailedSchema";

// Nested User Metadata / Identity Schemas
const UserIdentitySchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  identity_data: Type.Optional(Type.Record(Type.String(), Type.Any())),
  provider: Type.String(),
  last_sign_in_at: Type.Optional(Type.String()),
  created_at: Type.Optional(Type.String()),
  updated_at: Type.Optional(Type.String()),
});

const UserSchema = Type.Object({
  id: Type.String(),
  app_metadata: Type.Record(Type.String(), Type.Any()),
  user_metadata: Type.Record(Type.String(), Type.Any()),
  aud: Type.String(),
  confirmation_sent_at: Type.Optional(Type.String()),
  recovery_sent_at: Type.Optional(Type.String()),
  email_change_sent_at: Type.Optional(Type.String()),
  new_email: Type.Optional(Type.String()),
  invited_at: Type.Optional(Type.String()),
  action_link: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  phone: Type.Optional(Type.String()),
  created_at: Type.String(),
  confirmed_at: Type.Optional(Type.String()),
  email_confirmed_at: Type.Optional(Type.String()),
  phone_confirmed_at: Type.Optional(Type.String()),
  last_sign_in_at: Type.Optional(Type.String()),
  role: Type.Optional(Type.String()),
  updated_at: Type.Optional(Type.String()),
  identities: Type.Optional(Type.Array(UserIdentitySchema)),
  is_anonymous: Type.Optional(Type.Boolean()),
});

const SessionSchema = Type.Object({
  access_token: Type.String(),
  token_type: Type.String(),
  expires_in: Type.Number(),
  expires_at: Type.Optional(Type.Number()),
  refresh_token: Type.String(),
  user: UserSchema,
});

const WeakPasswordSchema = Type.Object({
  reasons: Type.Array(
    Type.Union([
      Type.Literal("length"),
      Type.Literal("characters"),
      Type.Literal("pwned"),
    ]),
  ),
  message: Type.String(),
});

const LoginSuccessResponseSchema = Type.Object({
  ok: Type.Literal(true),
  data: Type.Object({
    user: UserSchema,
    session: SessionSchema,
    weakPassword: Type.Optional(WeakPasswordSchema),
  }),
});

export const LoginResponseSchema = Type.Union([
  LoginSuccessResponseSchema,
  PersistenceFailedResponseSchema,
]);

export type LoginResponseSchemaType = Static<typeof LoginResponseSchema>;

export const AuthTokenResponsePasswordSchema = Type.Union([
  Type.Object({
    data: Type.Object({
      user: UserSchema,
      session: SessionSchema,
      weakPassword: Type.Optional(WeakPasswordSchema),
    }),
    error: Type.Null(),
  }),

  Type.Object({
    data: Type.Object({
      user: Type.Null(),
      session: Type.Null(),
      weakPassword: Type.Optional(Type.Null()),
    }),
    error: PersistenceFailedResponseSchema,
  }),
]);

export const LogOutResultSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.Literal("success"),
  }),
  PersistenceFailedResponseSchema,
]);

export const RecoverSessionResponseSchema = Type.Union([
  Type.Object({
    status: Type.Literal("anonymous"),
  }),
  Type.Object({
    status: Type.Literal("authenticated"),
  }),
]);

export const CreateUserResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.Object({
      user: CreatedUserSchema,
      session: SupabaseSessionSchema,
    }),
  }),
]);

export const ResetPasswordResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.Record(Type.String(), Type.Never()),
  }),
  PersistenceFailedResponseSchema,
]);

export type ResetPasswordResponseSchemaType = Static<
  typeof ResetPasswordResponseSchema
>;

export type CreateUserResponseSchemaType = Static<
  typeof CreateUserResponseSchema
>;

export type RecoverSessionResponseSchemaType = Static<
  typeof RecoverSessionResponseSchema
>;

export type LogOutResultSchemaType = Static<typeof LogOutResultSchema>;

// Infer the TypeScript type from the schema if needed
export type AuthTokenResponsePasswordType = Static<
  typeof AuthTokenResponsePasswordSchema
>;
