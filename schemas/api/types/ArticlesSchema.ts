import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { BiasSchema } from "./BiasSchema";

export const FactualReportingRatingSchema = Type.Union([
  Type.Literal("Very High"),
  Type.Literal("High"),
  Type.Literal("Mostly Factual"),
  Type.Literal("Mixed"),
  Type.Literal("Low"),
  Type.Literal("Very Low"),
  Type.Literal("Conspiracy-Pseudoscience"),
  Type.Literal("Questionable Source"),
  Type.Literal("Pro-Science"),
  Type.Literal("Satire"),
  Type.Literal("Unknown"),
]);

export const ArticleSchema = Type.Object({
  title: Type.String(),
  provider: Type.String(),
  authors: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String()), Type.Null()]),
  ),
  article_url: Type.String(),
  image_url: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  date_published: Type.String(),
  fallbackDate: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  summary: Type.Optional(Type.Any()),
  full_text: Type.String(),
  logo: Type.Optional(Type.String()),
  id: Type.Number(),
  factual_reporting: FactualReportingRatingSchema,
  bias: Type.Optional(BiasSchema),
  country: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export type FactualReportingRatingSchemaType = Static<
  typeof FactualReportingRatingSchema
>;

export type ArticleSchemaType = Static<typeof ArticleSchema>;

export const AritclesArraySchema = Type.Array(ArticleSchema);

export type AritclesArraySchemaType = Static<typeof AritclesArraySchema>;
