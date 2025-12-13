import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { Static } from '@sinclair/typebox';
import { BiasSchema } from './BiasSchema.js';

export const ArticleSchema = Type.Object({
    title: Type.String(),
    provider: Type.String(),
    authors: Type.Union([
        Type.String(),
        Type.Array(Type.String())
    ]),
    article_url: Type.String(),
    image_url: Type.String(),
    date_published: Type.String(),
    fallbackDate: Type.Optional(
        Type.Union([
            Type.String(),
            Type.Null()
        ])
    ),
    summary: Type.Any(),
    full_text: Type.String(),
    logo: Type.Optional(Type.String()),
    id: Type.Union([
        Type.String(),
        Type.Number(),
        Type.Null()
    ]),
    factual_reporting: Type.Optional(
        Type.Union([Type.String(), Type.Null()])
    ),
    bias: Type.Optional(BiasSchema),
    country: Type.Optional(
        Type.Union([Type.String(), Type.Null()])
    )
});

export type ArticleSchema = Static<typeof ArticleSchema>;

const validator = TypeCompiler.Compile(ArticleSchema);

export const validateArticle = (article: unknown) => {

    const isValid = validator.Check(article);

    const details = [...validator.Errors(article)];

    return { isValid, details } as const;
};


export const AritclesArraySchema = Type.Object({
    articles: Type.Array(
        Type.Object(ArticleSchema)
    )
});

export type AritclesArraySchemaType = Static<typeof AritclesArraySchema>;

