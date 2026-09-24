import { ArticleSchema } from "@elenchus/contracts/schemas/articles/ArticleSchema";
export {
  ArticleSchema,
  type ArticleSchemaType,
  AritclesArraySchema,
  type AritclesArraySchemaType,
  ExecuteExtractResponseSchema,
  type ExecuteExtractResponseSchemaType,
  FactualReportingRatingSchema,
  type FactualReportingRatingSchemaType,
  FactualReportingValidator,
} from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";

export const JobResultStatusSchema = Type.Union([
  Type.Literal("rejected"),
  Type.Literal("fulfilled"),
  Type.Literal("rejected"),
]);

export const FailedJobSummarySchema = Type.Union([
  Type.Object({
    denied: Type.String(),
    failedArticle: Type.Array(Type.String()),
  }),
  Type.Null(),
]);

export const FailedExtractJobSchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  summary: FailedJobSummarySchema,
  logo: Type.String(),
  source: Type.String(),
  date: Type.String(),
  article_url: Type.String({ minLength: 1 }),
});

export type FailedExtractJobSchemaType = Static<typeof FailedExtractJobSchema>;

export const ExtractionJobSchema = Type.Object({});

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

export const ExtractionJobResultSchema = Type.Object({
  status: JobResultStatusSchema,
  result: Type.Object({
    progress: Type.String(),
    retrieved: ArticleSchema,
    rejected: FailedExtractJobSchema,
  }),
  error: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  createdAt: Type.Number(),
});

export type ExtractionJobResultSchemaType = Static<
  typeof ExtractionJobResultSchema
>;
