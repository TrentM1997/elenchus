import { ArticleSchema } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";

export const InsertableArticleSchema = Type.Omit(ArticleSchema, ["id"]);

export type InsertableArticleSchemaType = Static<
  typeof InsertableArticleSchema
>;

const validator = TypeCompiler.Compile(InsertableArticleSchema);

export const validateArticle = (article: unknown) => {
  const isValid = validator.Check(article);

  const details = [...validator.Errors(article)];

  return { isValid, details } as const;
};
