import { Type, type Static } from "@sinclair/typebox";
import {
  WikiSummaryResponseSchema,
  WikiDisambigResponseSchema,
} from "./WikipediaExtractSchemas.js";

export const SavedExtractSchema = Type.Intersect([
  Type.Union([WikiSummaryResponseSchema, WikiDisambigResponseSchema]),
  Type.Object({
    id: Type.String({ minLength: 1 }),
    user_id: Type.String({ minLength: 1 }),
    investigation_id: Type.Number(),
  }),
]);

export const SavedExtractArraySchema = Type.Array(SavedExtractSchema);

export type SavedExtractArraySchemaType = Static<
  typeof SavedExtractArraySchema
>;

export type SavedExtractSchemaType = Static<typeof SavedExtractSchema>;

const NullableString = Type.Union([Type.String(), Type.Null()]);

const extractRowFields = {
  id: Type.String({ minLength: 1 }),
  investigation_id: Type.Number(),
  user_id: Type.String({ minLength: 1 }),
  title: Type.String(),
  page_url: Type.String(),
  last_updated: NullableString,
  captured_at: Type.String(),
};

export const InvestigationExtractRowSchema = Type.Union([
  Type.Object({
    ...extractRowFields,
    kind: Type.Literal("summary"),
    extract: Type.String(),
    description: Type.String(),
    thumbnail: NullableString,
  }),
  Type.Object({
    ...extractRowFields,
    kind: Type.Literal("disambiguation"),
    extract: Type.Null(),
    description: Type.Null(),
    thumbnail: Type.Null(),
  }),
]);

export type InvestigationExtractRow = Static<
  typeof InvestigationExtractRowSchema
>;
