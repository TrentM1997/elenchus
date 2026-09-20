import { Type, Static } from "@sinclair/typebox";
import { PersistenceFailedResponseSchema } from "./PersistenceFailedSchema";

export const FeedbackResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.String(),
  }),
  PersistenceFailedResponseSchema,
]);

export type FeedbackResponseSchemaType = Static<typeof FeedbackResponseSchema>;
