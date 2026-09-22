import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";

export const PerspectiveSchema = Type.Union([
  Type.Literal("Neutral"),
  Type.Literal("Disagree"),
  Type.Literal("Agree"),
  Type.Null(),
]);

export const ExpertiseSchema = Type.Union([
  Type.Literal("New to the Topic"),
  Type.Literal("Familiar"),
  Type.Literal("Area of Expertise"),
  Type.Null(),
]);

export const InvestigationSchema = Type.Object({
  biases: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  changed_opinion: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  ending_perspective: PerspectiveSchema,
  had_merit: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  created_at: Type.String(),
  id: Type.Number(),
  idea: Type.String(),
  initial_perspective: PerspectiveSchema,
  expertise: ExpertiseSchema,
  new_concepts: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  premises: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  sources: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
  takeaway: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  user_id: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  wikipedia_extracts: Type.Optional(
    Type.Union([Type.Array(Type.Any()), Type.Null()]),
  ),
});

export const InsertableInvestigationSchema = Type.Omit(InvestigationSchema, [
  "id",
  "created_at",
]);

export const PersistInvestigationInputSchema = Type.Omit(
  InsertableInvestigationSchema,
  ["user_id"],
);

export type PersistInvestigationInputSchemaType = Static<
  typeof PersistInvestigationInputSchema
>;

export type InsertableInvestigationSchemaType = Static<
  typeof InsertableInvestigationSchema
>;

const validator = TypeCompiler.Compile(InvestigationSchema);

export type InvestigationSchemaType = Static<typeof InvestigationSchema>;

export const validateInvestigation = (investigation: unknown) => {
  const isValid = validator.Check(investigation);
  const details = [...validator.Errors(investigation)];

  return { isValid, details } as const;
};
