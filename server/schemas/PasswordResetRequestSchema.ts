import { Type, type Static } from "@sinclair/typebox";

export const PasswordResetRequestSchema = Type.Object({
  email: Type.String({
    minLength: 1,
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
  }),
});

export type PasswordResetRequestSchemaType = Static<
  typeof PasswordResetRequestSchema
>;
