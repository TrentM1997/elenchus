import { Type, Static } from "@sinclair/typebox";
import { BiasSchema } from "./BiasSchema.js";

export const FactualReportingSchema = Type.Union([
  Type.Literal("Very High"),
  Type.Literal("High"),
  Type.Literal("Mostly Factual"),
  Type.Literal("Mixed"),
  Type.Literal("Low"),
  Type.Literal("Very Low"),
  Type.Literal("N/A"),
  Type.Null(),
]);

export type FactualReporting = Static<typeof FactualReportingSchema>;

export const SourceRatingSchema = Type.Object({
  country: Type.Union([Type.String(), Type.Null()]),
  bias: BiasSchema,
  factual_reporting: FactualReportingSchema,
});

export type SourceRatingSchemaType = Static<typeof SourceRatingSchema>;

export const SourceRatingRowsSchema = Type.Array(SourceRatingSchema);
