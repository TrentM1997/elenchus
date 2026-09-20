import { Type, Static } from "@sinclair/typebox";
import { UserSchema } from "./UserSchema";

export const DeleteAccountResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.Union([Type.Null(), UserSchema]),
  }),
  Type.Object({
    ok: Type.Literal(false),
    message: Type.String(),
    statusCode: Type.Number(),
    details: Type.Unknown(),
  }),
]);

export type DeleteAccountResponseSchemaType = Static<
  typeof DeleteAccountResponseSchema
>;
