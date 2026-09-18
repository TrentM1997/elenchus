import { Type, Static } from "@sinclair/typebox";

export type AccountDeletionResult =
  | { ok: true }
  | { ok: false; message: string; statusCode: number; details?: unknown };

export const DeleteAccountResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
  }),
  Type.Object({
    ok: Type.Literal(true),
    message: Type.String(),
    statusCode: Type.Number(),
    details: Type.Unknown(),
  }),
]);

export type DeleteAccountResponseSchemaType = Static<
  typeof DeleteAccountResponseSchema
>;
