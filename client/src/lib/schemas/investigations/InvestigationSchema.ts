import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { PersistenceFailedResponseSchema } from "../auth/PersistenceFailedSchema";

export const InitialPerspectiveSchema = Type.Union([
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
  created_at: Type.Optional(Type.String()),
  ending_perspective: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  had_merit: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  id: Type.Optional(Type.Number()),
  idea: Type.String(),
  initial_perspective: InitialPerspectiveSchema,
  new_concepts: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  premises: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  sources: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
  takeaway: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  user_id: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  wikipedia_extracts: Type.Optional(
    Type.Union([Type.Array(Type.Any()), Type.Null()]),
  ),
});

export type InvestigationSchemaType = Static<typeof InvestigationSchema>;

const InvestigationSavedSchema = Type.Object({
  ok: Type.Literal(true),
  data: InvestigationSchema,
});

const InvestigationsSavedSchema = Type.Object({
  ok: Type.Literal(true),
  data: Type.Array(InvestigationSchema),
});

export const InvestigationSaveResponse = Type.Union([
  InvestigationSavedSchema,
  PersistenceFailedResponseSchema,
]);

export const InvestigationsSavedReponseSchema = Type.Union([
  InvestigationsSavedSchema,
  PersistenceFailedResponseSchema,
]);

export type InvestigationsSavedReponseSchemaType = Static<
  typeof InvestigationsSavedReponseSchema
>;

export type InvestigationSaveResponseType = Static<
  typeof InvestigationSaveResponse
>;
