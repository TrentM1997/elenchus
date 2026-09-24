import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";
import { BiasSchema } from "./BiasSchema.js";
import { PersistenceFailedResponseSchema } from "../auth/PersistenceFailedSchema.js";

export const ScrapeRequestSchema = Type.Object({
  articles: Type.Array(
    Type.Object({
      url: Type.String(),
      source: Type.String(),
      date: Type.String(),
      logo: Type.String(),
      title: Type.String(),
      image: Type.String(),
    }),
  ),
});

export const ExtractArticlesResponseSchema = Type.Object({
  jobId: Type.String(),
});

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
  id: Type.Number(),
  factual_reporting: FactualReportingRatingSchema,
  bias: Type.Optional(BiasSchema),
  country: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export type ArticleSchemaType = Static<typeof ArticleSchema>;

export const GetArticleResponseSchema = Type.Union([
  Type.Object({
    ok: Type.Literal(true),
    data: ArticleSchema,
  }),
  PersistenceFailedResponseSchema,
]);

export type GetArticleResponseSchemaType = Static<
  typeof GetArticleResponseSchema
>;

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

export const JobResultStatusSchema = Type.Union([
  Type.Literal("pending"),
  Type.Literal("fulfilled"),
  Type.Literal("rejected"),
]);

export const FailedJobSummarySchema = Type.Array(
  Type.Object({
    denied: Type.String(),
    failedArticle: Type.String(),
  }),
);

export const FailedExtractJobSchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  summary: FailedJobSummarySchema,
  logo: Type.String(),
  source: Type.String(),
  date: Type.String(),
  article_url: Type.String({ minLength: 1 }),
});

export type FailedExtractJobSchemaType = Static<typeof FailedExtractJobSchema>;

export const ExecuteExtractResponseSchema = Type.Object({
  jobId: Type.String({ minLength: 1 }),
});

export type ExecuteExtractResponseSchemaType = Static<
  typeof ExecuteExtractResponseSchema
>;

export const ExtractionResultSchema = Type.Object({
  progress: Type.String(),
  retrieved: Type.Array(ArticleSchema),
  rejected: Type.Array(FailedExtractJobSchema),
});

export type ExtractionResult = Static<typeof ExtractionResultSchema>;

export const ExtractionJobSchema = Type.Object({
  status: JobResultStatusSchema,
  result: Type.Optional(ExtractionResultSchema),
  error: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  createdAt: Type.Number(),
});

export type ExtractionJobSchemaType = Static<typeof ExtractionJobSchema>;

export const ExtractionJobResultSchema = Type.Union([
  ExtractionJobSchema,
  Type.Undefined(),
]);

export type ExtractionJobResultSchemaType = Static<
  typeof ExtractionJobResultSchema
>;
