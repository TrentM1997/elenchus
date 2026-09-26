import { Type, Static } from "@sinclair/typebox";
import { PersistenceFailedResponseSchema } from "../auth/PersistenceFailedSchema.js";
import { ArticleSchema } from "../articles/ArticleSchema.js";

export const InvestigationSourceSchema = Type.Object({
  id: Type.String({ minLength: 1 }),
  created_at: Type.String({ minLength: 1 }),
  article_id: Type.Number(),
  investigation_id: Type.Number(),
});

export const InvestigationSourcesResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: Type.Array(ArticleSchema),
  }),
  PersistenceFailedResponseSchema,
]);

export type InvestigationSourcesResponseSchemaType = Static<
  typeof InvestigationSourcesResponseSchema
>;

export type InvestigationSourceSchemaType = Static<
  typeof InvestigationSourceSchema
>;
