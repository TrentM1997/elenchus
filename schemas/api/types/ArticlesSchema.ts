import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { Static } from '@sinclair/typebox';
import { TSchema } from '@sinclair/typebox';
import { BiasSchema } from './BiasSchema';

export const ArticleSchema = Type.Object({
    title: Type.String(),
    provider: Type.String(),
    authors: Type.Optional(Type.Union([
        Type.String(),
        Type.Array(Type.String())
    ])),
    article_url: Type.String(),
    image_url: Type.Optional(Type.String()),
    date_published: Type.String(),
    fallbackDate: Type.Optional(
        Type.Union([
            Type.String(),
            Type.Null()
        ])
    ),
    summary: Type.Optional(Type.Any()),
    full_text: Type.String(),
    logo: Type.Optional(Type.String()),
    id: Type.Optional(Type.Union([
        Type.String(),
        Type.Number(),
        Type.Null()
    ])),
    factual_reporting: Type.Optional(
        Type.Union([Type.String(), Type.Null()])
    ),
    bias: Type.Optional(BiasSchema),
    country: Type.Optional(
        Type.Union([Type.String(), Type.Null()])
    )
});

export type ArticleSchemaType = Static<typeof ArticleSchema>;

export const AritclesArraySchema = Type.Array(ArticleSchema);

export type AritclesArraySchemaType = Static<typeof AritclesArraySchema>;

