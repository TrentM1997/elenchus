import { Type, Static } from "@sinclair/typebox";
import { PersistenceFailedResponseSchema } from "./PersistenceFailedSchema.js";

export const FeedbackReqSchema = Type.Object({
  email: Type.String(),
  message: Type.String(),
});

export type FeedbackReqSchemaType = Static<typeof FeedbackReqSchema>;

export const FeedbackResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.String(),
  }),
  PersistenceFailedResponseSchema,
]);

export type FeedbackResponseSchemaType = Static<typeof FeedbackResponseSchema>;
