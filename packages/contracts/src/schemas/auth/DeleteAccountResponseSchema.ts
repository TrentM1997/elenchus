import { Type, Static } from "@sinclair/typebox";
import { UserSchema } from "./UserSchema.js";
import { PersistenceFailedResponseSchema } from "./PersistenceFailedSchema.js";

export const DeleteAccountResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.Union([Type.Null(), UserSchema]),
  }),
  PersistenceFailedResponseSchema,
]);

export type DeleteAccountResponseSchemaType = Static<
  typeof DeleteAccountResponseSchema
>;
