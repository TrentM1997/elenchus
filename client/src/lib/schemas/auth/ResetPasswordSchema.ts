import { Static, Type } from "@sinclair/typebox";
import { UserSchema } from "./UserSchema";

const PasswordChangeSuccessSchema = Type.Object({
  ok: Type.Literal(true),
  data: UserSchema,
});

const PasswordChangeFailedSchema = Type.Object({
  ok: Type.Literal(false),
  message: Type.String(),
});

export const ResetPasswordResponseSchema = Type.Union([
  PasswordChangeSuccessSchema,
  PasswordChangeFailedSchema,
]);

export type ResetPasswordResponseSchemaType = Static<
  typeof ResetPasswordResponseSchema
>;
