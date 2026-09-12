import { Type, Static } from "@sinclair/typebox";
import { UserSchema } from "./Users";

export const TokenSchema = Type.String({ minLength: 1 });

export type TokenSchemaType = Static<typeof TokenSchema>;

export const SupabaseSessionSchema = Type.Object({
  access_token: Type.String(),
  refresh_token: Type.String(),
  expires_in: Type.Number(),
  expires_at: Type.Optional(Type.Number()),
  token_type: Type.Literal("bearer"),
  user: UserSchema,
});

export type SupabaseSessionSchemaType = Static<typeof SupabaseSessionSchema>;
