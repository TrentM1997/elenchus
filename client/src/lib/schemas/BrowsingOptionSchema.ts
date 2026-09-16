import { Type, Static } from "@sinclair/typebox";

export const BrowsingOptionSchema = Type.Object({
  date_published: Type.String(),
  description: Type.String(),
  image: Type.Union([Type.String(), Type.Null()]),
  keywords: Type.Union([Type.Array(Type.String()), Type.Null()]),
  name: Type.String(),
  provider: Type.String(),
  url: Type.String(),
  logo: Type.Union([Type.String(), Type.Null()]),
});

export const BrowsingOptionSchemaArray = Type.Array(BrowsingOptionSchema);

export type BrowsingOptionSchemaArrayType = Static<
  typeof BrowsingOptionSchemaArray
>;

export type BrowsingOptionSchemaType = Static<typeof BrowsingOptionSchema>;
