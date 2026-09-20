import { Type, Static } from "@sinclair/typebox";
import { UserSchema } from "./UserSchema";
import { PersistenceFailedResponseSchema } from "./PersistenceFailedSchema";

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
