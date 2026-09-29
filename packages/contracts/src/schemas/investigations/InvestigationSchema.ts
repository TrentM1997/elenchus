import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { PersistenceFailedResponseSchema } from "../auth/PersistenceFailedSchema.js";
import { ArticleSchema } from "../articles/ArticleSchema.js";
import {
  InvestigationSourceSchema,
  InvestigationSourcesResponseSchema,
} from "./InvestigationSourceSchema.js";
import {
  WikiSummaryResponseSchema,
  WikiDisambigResponseSchema,
} from "../integrations/WikipediaExtractSchemas.js";
import {
  SavedExtractArraySchema,
  SavedExtractSchema,
} from "../integrations/InvestigationExtractRowSchema.js";

export const PerspectiveSchema = Type.Union([
  Type.Literal("Neutral"),
  Type.Literal("Disagree"),
  Type.Literal("Agree"),
  Type.Null(),
]);

export type PerspectiveSchemaType = Static<typeof PerspectiveSchema>;

export const ExpertiseSchema = Type.Union([
  Type.Literal("New to the Topic"),
  Type.Literal("Familiar"),
  Type.Literal("Area of Expertise"),
  Type.Null(),
]);

export type ExpertiseSchemaType = Static<typeof ExpertiseSchema>;

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
  takeaway: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  user_id: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export const InsertableInvestigationSchema = Type.Omit(InvestigationSchema, [
  "id",
  "created_at",
]);

export const PersistInvestigationInputSchema = Type.Omit(
  InsertableInvestigationSchema,
  ["user_id"],
);

export const SaveInvestigationInputSchema = Type.Object({
  investigation: PersistInvestigationInputSchema,
  articleIds: Type.Array(Type.Number()),
  extracts: Type.Optional(
    Type.Array(
      Type.Union([WikiSummaryResponseSchema, WikiDisambigResponseSchema]),
    ),
  ),
});

export const ExtractsToPersistSchema = Type.Optional(
  Type.Array(
    Type.Union([WikiSummaryResponseSchema, WikiDisambigResponseSchema]),
  ),
);

export type ExtractsToPersistSchemaType = Static<
  typeof ExtractsToPersistSchema
>;

export type PersistInvestigationInputSchemaType = Static<
  typeof PersistInvestigationInputSchema
>;

export type InsertableInvestigationSchemaType = Static<
  typeof InsertableInvestigationSchema
>;

export type InvestigationSchemaType = Static<typeof InvestigationSchema>;

const InvestigationSavedSchema = Type.Object({
  ok: Type.Literal(true),
  data: InvestigationSchema,
});

const InvestigationsSavedSchema = Type.Object({
  ok: Type.Literal(true),
  data: Type.Array(InvestigationSchema),
});

const ExtractsSelectedResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: SavedExtractArraySchema,
  }),
  PersistenceFailedResponseSchema,
]);

export type ExtractsSelectedResponseSchemaType = Static<
  typeof ExtractsSelectedResponseSchema
>;

export const InvestigationSaveResponse = Type.Union([
  InvestigationSavedSchema,
  PersistenceFailedResponseSchema,
]);

export const SelectedInvestigationPayloadSchema = Type.Object({
  investigation: InvestigationSchema,
  sources: Type.Array(ArticleSchema),
  extracts: Type.Array(SavedExtractSchema),
});

export type SelectedInvestigationPayloadSchemaType = Static<
  typeof SelectedInvestigationPayloadSchema
>;

const InvestigationPersistedSchema = Type.Object({
  ok: Type.Literal(true),
  data: SelectedInvestigationPayloadSchema,
});

export const InvestigationAndSourcesResponseSchema = Type.Union([
  InvestigationPersistedSchema,
  PersistenceFailedResponseSchema,
]);

export type InvestigationAndSourcesResponseSchemaType = Static<
  typeof InvestigationAndSourcesResponseSchema
>;

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
