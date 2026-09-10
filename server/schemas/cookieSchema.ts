import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";

export const CookieSchema = Type.Object({
  "sb-access-token": Type.String({
    description: "The Supabase authenticated JWT string",
  }),
  theme: Type.Optional(
    Type.Union([Type.Literal("dark"), Type.Literal("light")]),
  ),
});

export type CookieSchemaType = Static<typeof CookieSchema>;
