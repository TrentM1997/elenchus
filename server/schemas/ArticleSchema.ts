import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";
import { BiasSchema } from "./BiasSchema.js";

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

export const ExecuteExtractResponseSchema = Type.Object({
  jobId: Type.String({ minLength: 1 }),
});

export type ExecuteExtractResponseSchemaType = Static<
  typeof ExecuteExtractResponseSchema
>;

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
  Type.Null(),
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
  id: Type.Union([Type.String(), Type.Number(), Type.Null()]),
  factual_reporting: FactualReportingRatingSchema,
  bias: Type.Optional(BiasSchema),
  country: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export type ArticleSchemaType = Static<typeof ArticleSchema>;

export const FactualReportingValidator = TypeCompiler.Compile(
  FactualReportingRatingSchema,
);

export type FactualReportingRatingSchemaType = Static<
  typeof FactualReportingRatingSchema
>;

const validator = TypeCompiler.Compile(ArticleSchema);

export const validateArticle = (article: unknown) => {
  const isValid = validator.Check(article);

  const details = [...validator.Errors(article)];

  return { isValid, details } as const;
};

export const AritclesArraySchema = Type.Array(ArticleSchema);

export type AritclesArraySchemaType = Static<typeof AritclesArraySchema>;

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
