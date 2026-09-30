import { Type, Static } from "@sinclair/typebox";
import { PersistenceFailedResponseSchema } from "./PersistenceFailedSchema.js";

export const DeleteAccountResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.Null(),
  }),
  PersistenceFailedResponseSchema,
]);

export type DeleteAccountResponseSchemaType = Static<
  typeof DeleteAccountResponseSchema
>;
