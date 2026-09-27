import { Type, Static } from "@sinclair/typebox";

export const ArticleToExtractSchema = Type.Object({
  url: Type.String(),
  source: Type.String(),
  date: Type.String(),
  logo: Type.String(),
  title: Type.String(),
  image: Type.String(),
});

export type ArticleToExtractSchemaType = Static<typeof ArticleToExtractSchema>;
