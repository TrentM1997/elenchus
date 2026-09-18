import { Type, Static } from "@sinclair/typebox";

export const FeedbackResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
  }),
  Type.Object({
    ok: Type.Literal(false),
    message: Type.String({ minLength: 1 }),
    details: Type.String({ minLength: 1 }),
  }),
]);

export type FeedbackResponseSchemaType = Static<typeof FeedbackResponseSchema>;
