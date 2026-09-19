import { Type, Static } from "@sinclair/typebox";

export const PersistenceFailedResponseSchema = Type.Object({
  ok: Type.Literal(false),
  message: Type.String(),
  details: Type.String(),
});

export type PersistenceFailedResponseSchemaType = Static<
  typeof PersistenceFailedResponseSchema
>;
