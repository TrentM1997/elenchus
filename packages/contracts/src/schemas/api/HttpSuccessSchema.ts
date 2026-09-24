import { Type, Static } from "@sinclair/typebox";

export const HttpSuccessSchema = Type.Object({
  status: Type.Literal("success"),
  message: Type.String(),
  data: Type.Unknown(),
});

export type HttpSuccessSchemaType = Static<typeof HttpSuccessSchema>;
